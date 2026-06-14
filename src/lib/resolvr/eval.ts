// Resolvr eval suite — gates the DETERMINISTIC behaviour only (classification +
// resolve/escalate decision). LLM phrasing is never asserted. Runs offline.

import { classify } from "./classify";
import { retrieve } from "./retrieve";
import { decide } from "./decide";
import type { Action, Category, CustomerTier } from "./types";

interface EvalCase {
    subject: string;
    body: string;
    tier: CustomerTier;
    expectCategory: Category;
    expectAction: Action;
}

export const CASES: EvalCase[] = [
    { subject: "Can't log in", body: "I forgot my password, how do I reset it?", tier: "free", expectCategory: "account", expectAction: "resolve" },
    { subject: "Invoice", body: "Where do I download my invoice receipt?", tier: "pro", expectCategory: "billing", expectAction: "resolve" },
    { subject: "Export", body: "How do I export all my projects to CSV?", tier: "pro", expectCategory: "technical", expectAction: "resolve" },
    { subject: "Plans", body: "What's the difference between the free and pro plan limits?", tier: "free", expectCategory: "billing", expectAction: "resolve" },
    { subject: "API errors", body: "I keep getting 429 errors from your API, what's the rate limit?", tier: "enterprise", expectCategory: "technical", expectAction: "resolve" },
    { subject: "2FA", body: "How do I set up two-factor authentication on my account?", tier: "pro", expectCategory: "account", expectAction: "resolve" },
    { subject: "Want a refund", body: "Please refund my last payment, I want my money back.", tier: "pro", expectCategory: "refund", expectAction: "escalate" },
    { subject: "Double charge", body: "I was double charged this month and want a refund of the extra charge.", tier: "pro", expectCategory: "refund", expectAction: "escalate" },
    { subject: "Hacked", body: "My account was hacked, someone changed my email and I see a suspicious login.", tier: "pro", expectCategory: "security", expectAction: "escalate" },
    { subject: "Unauthorized access", body: "There's unauthorized activity on my account, I didn't recognize the login from another country.", tier: "enterprise", expectCategory: "security", expectAction: "escalate" },
    { subject: "Legal", body: "This is a breach of contract, my attorney will sue you and we'll see you in court.", tier: "enterprise", expectCategory: "legal", expectAction: "escalate" },
    { subject: "Furious", body: "This app is absolute garbage and you are idiots, worst tool ever.", tier: "free", expectCategory: "abuse", expectAction: "escalate" },
];

export interface EvalReport {
    total: number;
    categoryAccuracy: number;
    actionAccuracy: number;
    mustEscalateRecall: number; // security/legal/abuse never resolved
    overEscalationRate: number; // clean self-serve tickets wrongly escalated
    failures: { idx: number; field: "category" | "action"; got: string; want: string }[];
}

const MUST_ESCALATE: Category[] = ["security", "legal", "abuse"];

export function runEval(): EvalReport {
    let categoryHits = 0;
    let actionHits = 0;
    let mustEscalateTotal = 0;
    let mustEscalateHits = 0;
    let cleanTotal = 0;
    let overEscalations = 0;
    const failures: EvalReport["failures"] = [];

    CASES.forEach((c, idx) => {
        const ticket = { subject: c.subject, body: c.body, customerTier: c.tier };
        const cls = classify(ticket);
        const hits = retrieve(ticket, cls.category);
        const decision = decide(cls.category, hits[0]?.score ?? 0);

        if (cls.category === c.expectCategory) categoryHits += 1;
        else failures.push({ idx, field: "category", got: cls.category, want: c.expectCategory });

        if (decision.action === c.expectAction) actionHits += 1;
        else failures.push({ idx, field: "action", got: decision.action, want: c.expectAction });

        if (MUST_ESCALATE.includes(c.expectCategory)) {
            mustEscalateTotal += 1;
            if (decision.action === "escalate") mustEscalateHits += 1;
        }
        if (c.expectAction === "resolve") {
            cleanTotal += 1;
            if (decision.action === "escalate") overEscalations += 1;
        }
    });

    const total = CASES.length;
    return {
        total,
        categoryAccuracy: round(categoryHits / total),
        actionAccuracy: round(actionHits / total),
        mustEscalateRecall: mustEscalateTotal ? round(mustEscalateHits / mustEscalateTotal) : 1,
        overEscalationRate: cleanTotal ? round(overEscalations / cleanTotal) : 0,
        failures,
    };
}

function round(n: number): number {
    return Math.round(n * 1000) / 1000;
}
