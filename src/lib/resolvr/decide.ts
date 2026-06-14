// The resolve-vs-escalate decision. Deterministic and safety-first: certain
// categories ALWAYS escalate regardless of how confident retrieval is. This is
// the hard gate the eval suite asserts at 100% recall.

import type { Category, Decision } from "./types";

// Below this retrieval confidence we don't trust the KB to answer, so we escalate
// rather than risk a wrong or invented reply.
export const COVERAGE_THRESHOLD = 0.18;

const MUST_ESCALATE: Category[] = ["security", "legal", "abuse"];

const ESCALATION_REASON: Partial<Record<Category, string>> = {
    security: "Possible account compromise — a human must verify identity and lock the account before anything else.",
    legal: "Legal/compliance matter — must be handled by a person, never an automated reply.",
    abuse: "Hostile or abusive message — routed to a human to de-escalate.",
    refund: "Refunds require human authorization per the 14-day policy — the agent cannot promise one.",
};

export function decide(category: Category, topScore: number): Decision {
    if (MUST_ESCALATE.includes(category)) {
        return { action: "escalate", reason: ESCALATION_REASON[category]!, confidence: 0.95 };
    }

    if (category === "refund") {
        return { action: "escalate", reason: ESCALATION_REASON.refund!, confidence: 0.8 };
    }

    if (topScore < COVERAGE_THRESHOLD) {
        return {
            action: "escalate",
            reason: "Not enough knowledge-base coverage to answer confidently — routing to a specialist.",
            confidence: Math.round((1 - topScore) * 100) / 100,
        };
    }

    return {
        action: "resolve",
        reason: "Clear self-serve request with strong knowledge-base coverage — safe to answer autonomously.",
        confidence: Math.min(0.97, Math.round((0.5 + topScore / 2) * 100) / 100),
    };
}
