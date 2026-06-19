// Full task specs for the live (bring-your-own-key) demo. These mirror the
// bundled tasks in the loopr repo — a seed prompt, a scorer, and eval cases.
// The visitor can edit the seed prompt and cases, then run the real loop.

import type { LiveTask } from "@/lib/loopr/engine";

export const LIVE_TASKS: Record<string, LiveTask> = {
    intent: {
        name: "Classify a support message as exactly one of: refund, shipping, technical, billing, other. Lowercase, one word.",
        scorer: "exact",
        seedPrompt: "What does this user want?\n{input}",
        budget: 6,
        patience: 2,
        cases: [
            { input: "My package never arrived and tracking hasn't updated in a week.", expected: "shipping" },
            { input: "I was charged twice for the same order.", expected: "billing" },
            { input: "The app crashes every time I open the settings page.", expected: "technical" },
            { input: "I want my money back, this product is defective.", expected: "refund" },
            { input: "Do you ship to Canada?", expected: "shipping" },
            { input: "How do I update the credit card on my account?", expected: "billing" },
        ],
    },
    yesno: {
        name: "Answer the question with exactly 'yes' or 'no' — lowercase, no punctuation, no extra words.",
        scorer: "exact",
        seedPrompt: "{input}",
        budget: 5,
        patience: 2,
        cases: [
            { input: "Is the Earth round?", expected: "yes" },
            { input: "Is 9 a prime number?", expected: "no" },
            { input: "Can humans breathe underwater without equipment?", expected: "no" },
            { input: "Is water made of hydrogen and oxygen?", expected: "yes" },
        ],
    },
    extract_json: {
        name: "Extract the person's role from a one-line bio as lowercase JSON with a single field \"role\".",
        scorer: "json_field",
        scorerConfig: { field: "role" },
        seedPrompt: "Extract info from this bio.\n{input}",
        budget: 6,
        patience: 2,
        cases: [
            { input: "Aisha Khan is a backend engineer at a fintech startup.", expected: "backend engineer" },
            { input: "Marco runs design for a small SaaS company.", expected: "designer" },
            { input: "Dr. Lena Park, a data scientist, leads the ML team.", expected: "data scientist" },
            { input: "Sam is the product manager for the payments app.", expected: "product manager" },
        ],
    },
    sentiment: {
        name: "Classify sentiment as exactly one of: positive, negative, neutral.",
        scorer: "contains",
        seedPrompt: "What is the sentiment here?\n{input}",
        budget: 6,
        patience: 2,
        cases: [
            { input: "I absolutely love this, best purchase of the year!", expected: "positive" },
            { input: "This is the worst experience I have ever had.", expected: "negative" },
            { input: "The package arrived on Tuesday as scheduled.", expected: "neutral" },
            { input: "It broke after two days and nobody replied.", expected: "negative" },
        ],
    },
};

export const LIVE_PRESETS: { id: string; label: string }[] = [
    { id: "intent", label: "Intent routing" },
    { id: "yesno", label: "Yes / no" },
    { id: "extract_json", label: "JSON extraction" },
    { id: "sentiment", label: "Sentiment" },
];
