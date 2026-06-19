// Client-safe TS port of the Loopr core (run -> score -> reflect -> rewrite).
// Mirrors the Python engine at github.com/rohitguta2432/loopr. Runs entirely in
// the browser for the "bring your own key" live demo: scoring and the stop
// decision are deterministic; the LLM only runs the task and phrases the
// reflection. No server, no key storage — see browserLLM.ts.

export type ScorerName = "exact" | "contains" | "regex" | "json_field" | "llm_judge";

export interface LiveCase {
    input: string;
    expected: string;
}

export interface LiveTask {
    name: string;
    seedPrompt: string;
    scorer: ScorerName;
    scorerConfig?: Record<string, unknown>;
    cases: LiveCase[];
    system?: string;
    budget?: number;
    patience?: number;
    targetScore?: number;
}

export interface LiveCaseResult extends LiveCase {
    output: string;
    score: number;
}

export interface LiveIteration {
    n: number;
    prompt: string;
    meanScore: number;
    passed: number;
    total: number;
    isBest: boolean;
    rewrite: string;
    cases: LiveCaseResult[];
}

export interface LiveResult {
    seedPrompt: string;
    bestPrompt: string;
    seedScore: number;
    bestScore: number;
    improvement: number;
    bestIteration: number;
    stopReason: string;
    iterations: LiveIteration[];
}

export type Generate = (prompt: string, system: string) => Promise<string>;

const norm = (s: string) => (s || "").trim().toLowerCase();

export function extractJson(text: string): string {
    if (!text) return "";
    for (const [open, close] of [["{", "}"], ["[", "]"]]) {
        const start = text.indexOf(open);
        if (start === -1) continue;
        let depth = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === open) depth++;
            else if (text[i] === close) {
                depth--;
                if (depth === 0) return text.slice(start, i + 1);
            }
        }
    }
    return "";
}

async function score(
    name: ScorerName,
    output: string,
    expected: string,
    config: Record<string, unknown> | undefined,
    generate: Generate,
): Promise<number> {
    switch (name) {
        case "exact":
            return norm(output) === norm(expected) ? 1 : 0;
        case "contains":
            return norm(expected) && norm(output).includes(norm(expected)) ? 1 : 0;
        case "regex": {
            const pattern = (config?.pattern as string) ?? expected;
            try {
                const flags = config?.ignorecase === false ? "" : "i";
                return new RegExp(pattern, flags).test(output || "") ? 1 : 0;
            } catch {
                return 0;
            }
        }
        case "json_field": {
            const field = config?.field as string | undefined;
            if (!field) return 0;
            const blob = extractJson(output);
            if (!blob) return 0;
            try {
                let value: unknown = JSON.parse(blob);
                for (const part of String(field).split(".")) {
                    if (value && typeof value === "object" && part in (value as Record<string, unknown>)) {
                        value = (value as Record<string, unknown>)[part];
                    } else {
                        return 0;
                    }
                }
                return norm(String(value)) === norm(expected) ? 1 : 0;
            } catch {
                return 0;
            }
        }
        case "llm_judge": {
            const rubric = (config?.rubric as string) ?? "";
            const prompt =
                (rubric ? `GRADING RUBRIC:\n${rubric}\n\n` : "") +
                `EXPECTED:\n${expected}\n\nCANDIDATE:\n${output}\n\nIs the CANDIDATE correct? Reply YES or NO.`;
            const verdict = await generate(
                prompt,
                "You are a strict grader. Reply with exactly one word: YES or NO.",
            );
            return norm(verdict).slice(0, 5).includes("yes") ? 1 : 0;
        }
    }
}

function renderPrompt(prompt: string, input: string): string {
    return prompt.includes("{input}") ? prompt.split("{input}").join(input) : `${prompt}\n\n${input}`;
}

const REFLECT_SYSTEM =
    "You are a prompt-optimization engine. You improve an instruction prompt so a language " +
    "model gets more eval cases right. Reason about WHY the current prompt failed, then rewrite " +
    "it. Keep the {input} placeholder. Do not solve or hard-code the individual cases — improve " +
    "the general instruction.";

function reflectionPrompt(task: LiveTask, current: string, failures: LiveCaseResult[]): string {
    const shown = failures.slice(0, 8).map((r, i) => {
        const got = (r.output || "").replace(/\s+/g, " ").slice(0, 200);
        return `${i + 1}. INPUT: ${r.input}\n   EXPECTED: ${r.expected}\n   GOT: ${got}`;
    });
    return (
        `TASK GOAL: ${task.name}\n\n` +
        `CURRENT PROMPT:\n"""\n${current}\n"""\n\n` +
        `THIS PROMPT FAILED ON THESE CASES:\n${shown.join("\n")}\n\n` +
        "Step 1 - Diagnose in 1-3 sentences what about the prompt caused these failures.\n" +
        "Step 2 - Rewrite an improved prompt that keeps the {input} placeholder and generalizes.\n\n" +
        "Return ONLY the rewritten prompt wrapped exactly like this:\n<prompt>\n...improved prompt...\n</prompt>"
    );
}

function parseProposed(text: string): string {
    const m = (text || "").match(/<prompt>\s*([\s\S]*?)\s*<\/prompt>/i);
    return m ? m[1].trim() : "";
}

async function evaluate(
    generate: Generate,
    task: LiveTask,
    prompt: string,
): Promise<{ mean: number; results: LiveCaseResult[] }> {
    const results: LiveCaseResult[] = [];
    for (const c of task.cases) {
        const output = await generate(renderPrompt(prompt, c.input), task.system ?? "");
        const s = await score(task.scorer, output, c.expected, task.scorerConfig, generate);
        results.push({ ...c, output, score: s });
    }
    const mean = results.length ? results.reduce((a, r) => a + r.score, 0) / results.length : 0;
    return { mean, results };
}

export async function optimize(
    task: LiveTask,
    generate: Generate,
    onIteration?: (it: LiveIteration) => void,
): Promise<LiveResult> {
    const budget = Math.max(1, task.budget ?? 6);
    const patience = task.patience ?? 2;
    const target = task.targetScore ?? 1.0;

    let current = task.seedPrompt;
    let bestPrompt = current;
    let bestScore = -1;
    let bestIteration = 0;
    let seedScore = 0;
    let noImprove = 0;
    let stopReason = "budget";
    const iterations: LiveIteration[] = [];

    for (let n = 0; n < budget; n++) {
        const { mean, results } = await evaluate(generate, task, current);
        if (n === 0) seedScore = mean;

        const isBest = mean > bestScore;
        if (isBest) {
            bestPrompt = current;
            bestScore = mean;
            bestIteration = n;
            noImprove = 0;
        } else {
            noImprove++;
        }

        const iteration: LiveIteration = {
            n,
            prompt: current,
            meanScore: mean,
            passed: results.filter((r) => r.score >= 1).length,
            total: results.length,
            isBest,
            rewrite: "",
            cases: results,
        };

        if (mean >= target) {
            stopReason = "converged";
            iterations.push(iteration);
            onIteration?.(iteration);
            break;
        }
        if (noImprove >= patience) {
            stopReason = "plateau";
            iterations.push(iteration);
            onIteration?.(iteration);
            break;
        }
        if (n === budget - 1) {
            stopReason = "budget";
            iterations.push(iteration);
            onIteration?.(iteration);
            break;
        }

        // reflect on failures and propose the next candidate
        const failures = results.filter((r) => r.score < 1);
        const raw = await generate(reflectionPrompt(task, current, failures), REFLECT_SYSTEM);
        const proposed = parseProposed(raw);
        const next = proposed && proposed.includes("{input}") ? proposed : current;
        iteration.rewrite = next === current ? "" : next;
        iterations.push(iteration);
        onIteration?.(iteration);
        current = next;
    }

    return {
        seedPrompt: task.seedPrompt,
        bestPrompt,
        seedScore,
        bestScore,
        improvement: bestScore - seedScore,
        bestIteration,
        stopReason,
        iterations,
    };
}
