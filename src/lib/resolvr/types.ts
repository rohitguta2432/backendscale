// Resolvr — shared types for the autonomous support-resolution agent.
// See docs/resolvr-spec.md. Classification, retrieval, and the resolve/escalate
// decision are deterministic; only the customer-facing reply is drafted by an LLM.

export type Category =
    | "billing"
    | "technical"
    | "account"
    | "how_to"
    | "refund"
    | "security"
    | "legal"
    | "abuse"
    | "other";

export type Sentiment = "positive" | "neutral" | "frustrated" | "angry";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Action = "resolve" | "escalate";
export type CustomerTier = "free" | "pro" | "enterprise";

export interface Ticket {
    subject: string;
    body: string;
    customerTier: CustomerTier;
}

export interface Classification {
    category: Category;
    intent: string;
    sentiment: Sentiment;
    priority: Priority;
}

export interface KBArticle {
    id: string;
    title: string;
    category: Category;
    keywords: string[];
    body: string;
}

export interface KBHit {
    id: string;
    title: string;
    score: number; // 0..1, fraction of the ticket covered by this article
    snippet: string;
}

export interface Decision {
    action: Action;
    reason: string;
    confidence: number; // 0..1
}

export interface ResolveResult {
    classification: Classification;
    sources: KBHit[];
    decision: Decision;
    reply: string;
    routingNote: string | null;
    backend: string; // "ollama · <model>" | "api · <model>" | "offline template" | "rule-based · escalation"
    trace: string[];
    latencyMs: number;
}
