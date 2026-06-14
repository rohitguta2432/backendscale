// Resolvr orchestrator — the transparent tool-calling loop:
//   classify_ticket → search_kb → decide_action → draft_resolution
// Deterministic stages set the safety decision; the LLM only phrases a reply
// when the decision is "resolve". Escalations use a deterministic holding reply.

import { classify } from "./classify";
import { retrieve } from "./retrieve";
import { decide } from "./decide";
import { draftReply } from "./llm";
import type { Category, ResolveResult, Ticket } from "./types";

function routingTeam(category: Category): string {
    switch (category) {
        case "security":
            return "Trust & Safety";
        case "legal":
            return "Legal & Compliance";
        case "abuse":
            return "Customer Success (de-escalation)";
        case "refund":
            return "Billing";
        default:
            return "Tier-2 Support";
    }
}

function escalationReply(category: Category): string {
    const sign = "— Northwind Support";
    switch (category) {
        case "security":
            return `Thanks for flagging this — account security is something we take seriously. I've escalated your message to our Trust & Safety team, who will verify your identity and secure the account. As a precaution, please don't share any passwords or codes by email. Someone will reach out shortly.\n\n${sign}`;
        case "legal":
            return `Thank you for your message. Because this raises a legal matter, I'm routing it to the right team rather than answering directly. They'll follow up with you on the appropriate next steps.\n\n${sign}`;
        case "abuse":
            return `I'm sorry this has been frustrating — that's genuinely not the experience we want for you. I've asked a specialist to pick this up personally so we can make it right. They'll be in touch shortly.\n\n${sign}`;
        case "refund":
            return `Thanks for reaching out about a refund. Refunds are reviewed individually under our 14-day policy, so I've passed this to a billing specialist who can look at your account and the charge. They'll follow up with the outcome shortly.\n\n${sign}`;
        default:
            return `Thanks for the details — I want to get this exactly right, so I've routed it to a specialist who'll follow up shortly with the next step.\n\n${sign}`;
    }
}

export async function resolve(ticket: Ticket): Promise<ResolveResult> {
    const t0 = Date.now();
    const trace: string[] = [];

    const classification = classify(ticket);
    trace.push(
        `classify_ticket → ${classification.category} · ${classification.priority} priority · ${classification.sentiment}`,
    );

    const sources = retrieve(ticket, classification.category);
    trace.push(
        `search_kb → ${sources.length ? sources.map((s) => `${s.id} (${s.score})`).join(", ") : "no matches"}`,
    );

    const topScore = sources[0]?.score ?? 0;
    const decision = decide(classification.category, topScore);
    trace.push(`decide_action → ${decision.action.toUpperCase()} · confidence ${decision.confidence}`);

    let reply: string;
    let routingNote: string | null = null;
    let backend: string;

    if (decision.action === "resolve") {
        const draft = await draftReply({ ticket, classification, sources });
        reply = draft.text;
        backend = draft.backend;
        trace.push(`draft_resolution → ${backend}`);
    } else {
        const team = routingTeam(classification.category);
        reply = escalationReply(classification.category);
        routingNote = `Routed to ${team}. ${decision.reason}`;
        backend = "rule-based · escalation";
        trace.push(`draft_resolution → escalation holding reply · routed to ${team}`);
    }

    return {
        classification,
        sources,
        decision,
        reply,
        routingNote,
        backend,
        trace,
        latencyMs: Date.now() - t0,
    };
}
