// Resolvr's LLM backend — the dual-capability part of the brief.
//
// draftReply() tries three tiers in order and reports which one ran:
//   1. Ollama   — local model at OLLAMA_BASE_URL (default http://localhost:11434)
//   2. Cloud API — any OpenAI-compatible endpoint, used when LLM_API_KEY is set
//   3. Offline   — a deterministic template built from the top KB article
//
// The offline tier guarantees the public demo always returns a grounded reply,
// even on Vercel where neither Ollama nor a key is present.

import type { Classification, KBHit, Ticket } from "./types";
import { KB_BY_ID } from "./kb";

export interface DraftInput {
    ticket: Ticket;
    classification: Classification;
    sources: KBHit[];
}

export interface DraftOutput {
    text: string;
    backend: string;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:14b";
const LLM_API_BASE_URL = process.env.LLM_API_BASE_URL || "https://api.openai.com/v1";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
const LLM_API_MODEL = process.env.LLM_API_MODEL || "gpt-4o-mini";

// Generous enough for a cold local Ollama model to load and generate. On the
// public site there's no Ollama, so the fetch fast-fails (connection refused)
// long before this — the timeout only applies when a backend is reachable.
const TIMEOUT_MS = 22000;
const MAX_TOKENS = 280;

const SYSTEM_PROMPT = `You are Resolvr, a senior customer-support agent for "Northwind", a project-management SaaS.
Write the reply to send to the customer. Rules you must follow:
- Answer ONLY using the KNOWLEDGE BASE context provided. Do not invent features, prices, steps, or policy.
- If the context does not fully answer the question, say a specialist will follow up — do not guess.
- Never promise a refund, credit, discount, or compensation.
- Be warm and concise (under 120 words). Use the customer's wording. End with one clear next step.
- Sign off as "— Northwind Support". Output only the reply text, no preamble or quotes.`;

function buildContext(sources: KBHit[]): string {
    return sources
        .map((s) => {
            const a = KB_BY_ID[s.id];
            return a ? `## ${a.title}\n${a.body}` : `## ${s.title}\n${s.snippet}`;
        })
        .join("\n\n");
}

function buildUserPrompt(input: DraftInput): string {
    const { ticket, classification } = input;
    return [
        `KNOWLEDGE BASE:\n${buildContext(input.sources)}`,
        ``,
        `TICKET (category: ${classification.category}, sentiment: ${classification.sentiment}):`,
        `Subject: ${ticket.subject}`,
        `Message: ${ticket.body}`,
        ``,
        `Write the reply now.`,
    ].join("\n");
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
        return await fn(ctrl.signal);
    } finally {
        clearTimeout(timer);
    }
}

async function tryOllama(input: DraftInput): Promise<DraftOutput | null> {
    try {
        const res = await withTimeout((signal) =>
            fetch(`${OLLAMA_BASE_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal,
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    stream: false,
                    options: { temperature: 0.2, num_predict: MAX_TOKENS },
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: buildUserPrompt(input) },
                    ],
                }),
            }),
        );
        if (!res.ok) return null;
        const data = (await res.json()) as { message?: { content?: string } };
        const text = data.message?.content?.trim();
        if (!text) return null;
        return { text: stripThink(text), backend: `ollama · ${OLLAMA_MODEL}` };
    } catch {
        return null;
    }
}

async function tryCloudApi(input: DraftInput): Promise<DraftOutput | null> {
    if (!LLM_API_KEY) return null;
    try {
        const res = await withTimeout((signal) =>
            fetch(`${LLM_API_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
                signal,
                body: JSON.stringify({
                    model: LLM_API_MODEL,
                    temperature: 0.2,
                    max_tokens: MAX_TOKENS,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: buildUserPrompt(input) },
                    ],
                }),
            }),
        );
        if (!res.ok) return null;
        const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) return null;
        return { text: stripThink(text), backend: `api · ${LLM_API_MODEL}` };
    } catch {
        return null;
    }
}

// Reasoning models (qwen3, deepseek-r1, …) wrap chain-of-thought in <think> tags;
// strip them so only the customer-facing reply is shown.
function stripThink(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function offlineTemplate(input: DraftInput): DraftOutput {
    const top = input.sources[0];
    const article = top ? KB_BY_ID[top.id] : undefined;
    const name = "there";
    const text = article
        ? `Hi ${name}, thanks for reaching out — happy to help with this.\n\n${article.body}\n\nIf that doesn't get you sorted, just reply here and a specialist will jump in.\n\n— Northwind Support`
        : `Hi ${name}, thanks for reaching out. I want to get this exactly right, so I'm connecting you with a specialist who'll follow up shortly.\n\n— Northwind Support`;
    return { text, backend: "offline template" };
}

export async function draftReply(input: DraftInput): Promise<DraftOutput> {
    return (await tryOllama(input)) ?? (await tryCloudApi(input)) ?? offlineTemplate(input);
}
