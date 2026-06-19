// Real Loopr optimization traces, captured from live local runs (Ollama qwen2.5:14b)
// on 2026-06-19. The on-site demo REPLAYS these deterministically — no LLM call at
// runtime, so the same preset always shows the same convergence. Run the loop live
// yourself with `loopr serve` (see github.com/rohitguta2432/loopr).

export interface LooprCase {
    input: string;
    expected: string;
    output: string;
    score: number;
}

export interface LooprIteration {
    n: number;
    meanScore: number;
    passed: number;
    total: number;
    isBest: boolean;
    /** The rewritten prompt this iteration's reflection proposed ("" if none / converged). */
    rewrite: string;
    cases: LooprCase[];
}

export interface LooprTrace {
    preset: string;
    label: string;
    scorer: string;
    description: string;
    seedPrompt: string;
    bestPrompt: string;
    seedScore: number;
    bestScore: number;
    improvement: number;
    bestIteration: number;
    stopReason: string;
    iterations: LooprIteration[];
}

export const TRACES: Record<string, LooprTrace> = {
    "intent": {
        "preset": "intent",
        "label": "Intent routing",
        "scorer": "exact",
        "description": "Classify a support message as exactly one of refund / shipping / technical / billing / other.",
        "seedPrompt": "What does this user want?\n{input}",
        "bestPrompt": "Classify the following support message into one of these categories: refund, shipping, technical, billing, other. Your response should be a single lowercase word without punctuation.\n{input}",
        "seedScore": 0.0,
        "bestScore": 1.0,
        "improvement": 1.0,
        "bestIteration": 1,
        "stopReason": "converged",
        "iterations": [
            {
                "n": 0,
                "meanScore": 0.0,
                "passed": 0,
                "total": 6,
                "isBest": true,
                "rewrite": "Classify the following support message into one of these categories: refund, shipping, technical, billing, other. Your response should be a single lowercase word without punctuation.\n{input}",
                "cases": [
                    {
                        "input": "My package never arrived and tracking hasn't updated in a week.",
                        "expected": "shipping",
                        "output": "It sounds like you're experiencing frustration with the delivery of your package. Here’s what you can do to address the situation:\n\n1. **Contact the S…",
                        "score": 0.0
                    },
                    {
                        "input": "I was charged twice for the same order.",
                        "expected": "billing",
                        "output": "It sounds like you're experiencing an issue with a double charge for the same order. To help resolve this, I would need more information about your si…",
                        "score": 0.0
                    },
                    {
                        "input": "The app crashes every time I open the settings page.",
                        "expected": "technical",
                        "output": "It sounds like you're experiencing technical difficulties with an application. The issue you're encountering—where the app crashes whenever you try to…",
                        "score": 0.0
                    }
                ]
            },
            {
                "n": 1,
                "meanScore": 1.0,
                "passed": 6,
                "total": 6,
                "isBest": true,
                "rewrite": "",
                "cases": [
                    {
                        "input": "My package never arrived and tracking hasn't updated in a week.",
                        "expected": "shipping",
                        "output": "shipping",
                        "score": 1.0
                    },
                    {
                        "input": "I was charged twice for the same order.",
                        "expected": "billing",
                        "output": "billing",
                        "score": 1.0
                    },
                    {
                        "input": "The app crashes every time I open the settings page.",
                        "expected": "technical",
                        "output": "technical",
                        "score": 1.0
                    }
                ]
            }
        ]
    },
    "yesno": {
        "preset": "yesno",
        "label": "Yes / no",
        "scorer": "exact",
        "description": "Answer each question with exactly 'yes' or 'no' — no prose, no punctuation.",
        "seedPrompt": "{input}",
        "bestPrompt": "{input}\n\nPlease respond with only 'yes' or 'no', without any additional explanation, punctuation, or extra words.",
        "seedScore": 0.0,
        "bestScore": 1.0,
        "improvement": 1.0,
        "bestIteration": 1,
        "stopReason": "converged",
        "iterations": [
            {
                "n": 0,
                "meanScore": 0.0,
                "passed": 0,
                "total": 4,
                "isBest": true,
                "rewrite": "{input}\n\nPlease respond with only 'yes' or 'no', without any additional explanation, punctuation, or extra words.",
                "cases": [
                    {
                        "input": "Is the Earth round?",
                        "expected": "yes",
                        "output": "Yes, the Earth is round. More specifically, it is an oblate spheroid shape, which means it is slightly flattened at the poles and bulging at the equat…",
                        "score": 0.0
                    },
                    {
                        "input": "Is 9 a prime number?",
                        "expected": "no",
                        "output": "No, 9 is not a prime number. A prime number is defined as a number greater than 1 that has no positive divisors other than 1 and itself. However, 9 ca…",
                        "score": 0.0
                    },
                    {
                        "input": "Can humans breathe underwater without equipment?",
                        "expected": "no",
                        "output": "Humans cannot naturally breathe underwater like fish can. Fish have gills that extract oxygen from water, whereas humans have lungs designed for breat…",
                        "score": 0.0
                    }
                ]
            },
            {
                "n": 1,
                "meanScore": 1.0,
                "passed": 4,
                "total": 4,
                "isBest": true,
                "rewrite": "",
                "cases": [
                    {
                        "input": "Is the Earth round?",
                        "expected": "yes",
                        "output": "yes",
                        "score": 1.0
                    },
                    {
                        "input": "Is 9 a prime number?",
                        "expected": "no",
                        "output": "no",
                        "score": 1.0
                    },
                    {
                        "input": "Can humans breathe underwater without equipment?",
                        "expected": "no",
                        "output": "no",
                        "score": 1.0
                    }
                ]
            }
        ]
    },
    "extract_json": {
        "preset": "extract_json",
        "label": "JSON extraction",
        "scorer": "json_field",
        "description": "Pull the person's role from a one-line bio as lowercase JSON {\"role\": ...}.",
        "seedPrompt": "Extract info from this bio.\n{input}",
        "bestPrompt": "Identify the person's role from the given one-line bio and return it in lowercase as a JSON object with a single field \"role\". Do not include any additional information or explanations.\n\nExample output format: {\"role\": \"backend engineer\"}\n{input}",
        "seedScore": 0.0,
        "bestScore": 1.0,
        "improvement": 1.0,
        "bestIteration": 1,
        "stopReason": "converged",
        "iterations": [
            {
                "n": 0,
                "meanScore": 0.0,
                "passed": 0,
                "total": 4,
                "isBest": true,
                "rewrite": "Identify the person's role from the given one-line bio and return it in lowercase as a JSON object with a single field \"role\". Do not include any additional information or explanations.\n\nExample output format: {\"role\": \"backend engineer\"}\n{input}",
                "cases": [
                    {
                        "input": "Aisha Khan is a backend engineer at a fintech startup.",
                        "expected": "backend engineer",
                        "output": "From the given bio, we can extract the following information about Aisha Khan:\n\n- **Occupation**: Backend Engineer\n- **Industry/Company Type**: Fintec…",
                        "score": 0.0
                    },
                    {
                        "input": "Marco runs design for a small SaaS company.",
                        "expected": "designer",
                        "output": "From the given bio, we can extract the following information about Marco:\n\n- **Role**: He is responsible for design at his workplace.\n- **Company Type…",
                        "score": 0.0
                    },
                    {
                        "input": "Dr. Lena Park, a data scientist, leads the ML team.",
                        "expected": "data scientist",
                        "output": "From the given bio:\n\n- Name: Dr. Lena Park\n- Profession: Data Scientist\n- Role: Leader of the Machine Learning (ML) team",
                        "score": 0.0
                    }
                ]
            },
            {
                "n": 1,
                "meanScore": 1.0,
                "passed": 4,
                "total": 4,
                "isBest": true,
                "rewrite": "",
                "cases": [
                    {
                        "input": "Aisha Khan is a backend engineer at a fintech startup.",
                        "expected": "backend engineer",
                        "output": "{\"role\": \"backend engineer\"}",
                        "score": 1.0
                    },
                    {
                        "input": "Marco runs design for a small SaaS company.",
                        "expected": "designer",
                        "output": "{\"role\": \"designer\"}",
                        "score": 1.0
                    },
                    {
                        "input": "Dr. Lena Park, a data scientist, leads the ML team.",
                        "expected": "data scientist",
                        "output": "{\"role\": \"data scientist\"}",
                        "score": 1.0
                    }
                ]
            }
        ]
    }
};

export const PRESETS: { id: string; label: string }[] = [{"id": "intent", "label": "Intent routing"}, {"id": "yesno", "label": "Yes / no"}, {"id": "extract_json", "label": "JSON extraction"}];
