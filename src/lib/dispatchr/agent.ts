// The Dispatchr agent: a transparent tool-calling loop with a deterministic,
// rule-based policy (the "MockLLM"). No API key, no network — same input always
// yields the same decisions, which is what makes the on-site demo and the eval
// gate reproducible. The exact same loop runs a real LLM in the Python project
// by swapping the policy for OpenAI tool-calling.

import type { Message, AssistantTurn, StepRecord, AgentResult } from "./data";
import { Tools, type OfferedSlot } from "./tools";

export const SYSTEM_PROMPT = `You are Dispatchr, the dispatcher for a home-services company (HVAC, plumbing, electrical). You answer customer messages and take them from "I have a problem" to a booked appointment, on your own.

Policy:
- SAFETY FIRST. If the message suggests a gas smell, smoke, fire, sparks, electric shock, or flooding, call escalate_to_human immediately — do not quote or book.
- Classify the problem into one job type, then call get_price_estimate. NEVER state a price you did not get from that tool.
- Call find_available_slots and offer the customer real open slots only.
- When the customer picks a slot and gives a name + address, call book_job.
- Be warm, concise, and professional. Show money with the ₹ symbol (e.g. ₹800).`;

const EMERGENCY = [
    "gas", "smell of gas", "smoke", "fire", "burning", "burnt", "spark",
    "carbon monoxide", "flood", "shock", "electrocut", "explosion",
    "can't breathe", "cant breathe",
];

// Ordered: an explicit "install" intent wins; AC is checked before plumbing so
// "my AC is leaking water" routes to ac_repair, not plumbing.
const CLASSIFY: [string, string[]][] = [
    ["installation", ["install", "new ac", "set up", "setup", "mount", "fit a new"]],
    ["ac_repair", ["air condition", "aircon", "a/c", " ac ", "cooling", "not cooling", "won't cool", "ac is", "ac isn"]],
    ["heating_repair", ["heat", "heater", "furnace", "boiler", "radiator", "geyser not", "no hot water"]],
    ["electrical", ["outlet", "socket", "wiring", "breaker", "fuse", "switchboard", "no power", "lights not", "light not", "short circuit", "tripping", "mcb"]],
    ["plumbing", ["leak", "pipe", "drain", "clog", "blockage", "tap", "faucet", "toilet", "sink", "overflow", "sewage", "geyser"]],
];

let callCounter = 0;
function newCallId(): string {
    callCounter += 1;
    return `call_${callCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function isEmergency(text: string): boolean {
    return EMERGENCY.some((k) => text.includes(k));
}

function classify(text: string): string | null {
    const padded = ` ${text} `;
    for (const [jobType, keys] of CLASSIFY) {
        if (keys.some((k) => padded.includes(k))) return jobType;
    }
    return null;
}

function money(n: number): string {
    return `₹${n.toLocaleString("en-IN")}`;
}

function labelHour(label: string): [number, string] | null {
    const m = label.match(/(\d{1,2}):00\s*(AM|PM)/);
    return m ? [parseInt(m[1], 10), m[2].toLowerCase()] : null;
}

function pickSlot(text: string, slots: OfferedSlot[]): OfferedSlot | null {
    if (!slots.length) return null;
    const t = text.toLowerCase();
    if (["second", "2nd", "slot 2", " 2 "].some((w) => t.includes(w))) return slots[1] ?? null;
    if (["third", "3rd", "slot 3", " 3 "].some((w) => t.includes(w))) return slots[2] ?? null;
    const tm = t.match(/(\d{1,2})\s*(am|pm)/);
    if (tm) {
        const want: [number, string] = [parseInt(tm[1], 10), tm[2].toLowerCase()];
        for (const s of slots) {
            const lh = labelHour(s.label);
            if (lh && lh[0] === want[0] && lh[1] === want[1]) return s;
        }
    }
    if (["first", "1st", "earliest", "yes", "book", "sure", "that works", "ok", "okay", "sounds good"].some((w) => t.includes(w))) {
        return slots[0];
    }
    return null;
}

function extractContact(text: string): [string, string] {
    const nameM = text.match(/\b(?:i'm|i am|my name is|this is)\s+([A-Za-z][a-zA-Z]+)/i);
    const addrM = text.match(/\bat\s+(.+?)(?:[.;]|$)/i) ?? text.match(/\b(\d+\s+[A-Za-z][\w\s,]+)/);
    const name = nameM ? nameM[1] : "Customer";
    const address = addrM ? addrM[1].trim() : "(address to confirm)";
    return [name, address];
}

function composeOffer(price: Record<string, unknown>, slots: OfferedSlot[]): string {
    const label = String(price.label ?? "the job").toLowerCase();
    const fee = Number(price.diagnostic_fee ?? 0);
    const low = Number(price.repair_low ?? 0);
    const high = Number(price.repair_high ?? 0);
    const feePart = fee ? `The diagnostic visit is ${money(fee)}, and ` : "There's no separate diagnostic fee, and ";
    const quote = `${feePart}most ${label} jobs run ${money(low)}–${money(high)}.`;
    if (!slots.length) {
        return quote + " I don't have an open slot in the next two days — want me to put you on the waitlist?";
    }
    const lines = slots.map((s, i) => `  ${i + 1}) ${s.label} with ${s.technician_name}`).join("\n");
    return `${quote}\nI can offer:\n${lines}\nWhich works for you?`;
}

// The deterministic policy. Decides the next tool call (or final reply) purely
// from the conversation so far + the tool results already gathered this run.
function decide(messages: Message[]): AssistantTurn {
    const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.content ?? "");
    const toolMsgs = messages.filter((m) => m.role === "tool");
    const done = new Set(toolMsgs.map((m) => m.name));
    const results: Record<string, Record<string, unknown>> = {};
    for (const m of toolMsgs) {
        try {
            results[m.name ?? ""] = JSON.parse(m.content ?? "{}");
        } catch {
            results[m.name ?? ""] = {};
        }
    }

    const allText = userMsgs.join(" ").toLowerCase();
    const firstUser = userMsgs[0] ?? "";
    const lastUser = userMsgs[userMsgs.length - 1] ?? "";

    if (done.has("escalate_to_human")) {
        return {
            content:
                "I'm connecting you to a human dispatcher right now for your safety. " +
                "If anyone is in danger, please call your local emergency number immediately.",
            tool_calls: [],
        };
    }

    if (isEmergency(allText)) {
        return {
            tool_calls: [{
                id: newCallId(),
                name: "escalate_to_human",
                arguments: { reason: "Possible safety emergency in customer message", summary: firstUser.slice(0, 200) },
            }],
        };
    }

    const jobType = classify(allText);

    if (jobType === null && !done.has("get_price_estimate")) {
        return {
            content: "Happy to help! Could you tell me a bit more about the problem — is it your AC, heating, plumbing, or electrical?",
            tool_calls: [],
        };
    }

    if (!done.has("get_price_estimate")) {
        return { tool_calls: [{ id: newCallId(), name: "get_price_estimate", arguments: { job_type: jobType } }] };
    }

    if (!done.has("find_available_slots")) {
        return { tool_calls: [{ id: newCallId(), name: "find_available_slots", arguments: { job_type: jobType } }] };
    }

    const slots = (results.find_available_slots?.slots as OfferedSlot[]) ?? [];

    if (!done.has("book_job")) {
        const chosen = pickSlot(lastUser, slots);
        if (chosen) {
            const [name, address] = extractContact(lastUser);
            return {
                tool_calls: [{
                    id: newCallId(),
                    name: "book_job",
                    arguments: { slot_id: chosen.slot_id, customer_name: name, address, problem: firstUser.slice(0, 200) },
                }],
            };
        }
        return { content: composeOffer(results.get_price_estimate ?? {}, slots), tool_calls: [] };
    }

    const booking = results.book_job ?? {};
    if (booking.status === "booked") {
        return {
            content:
                `Booked! ${String(booking.technician_name)} will arrive ${String(booking.window)}. ` +
                `Your reference is ${String(booking.booking_id)}. You'll get a reminder text before arrival. ` +
                "Anything else I can help with?",
            tool_calls: [],
        };
    }
    return { content: "That slot just filled up — would another time work for you?", tool_calls: [] };
}

function assistantMessage(turn: AssistantTurn): Message {
    return {
        role: "assistant",
        content: turn.content ?? null,
        tool_calls: turn.tool_calls.map((tc) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
        })),
    };
}

export function buildMessages(userMessages: string[]): Message[] {
    return [
        { role: "system", content: SYSTEM_PROMPT },
        ...userMessages.map((m): Message => ({ role: "user", content: m })),
    ];
}

const MAX_STEPS = 6;

// Drive the loop until the policy produces a final message (no tool calls).
export function runConversation(userMessages: string[], now?: Date): AgentResult {
    const tools = new Tools(now);
    const messages = buildMessages(userMessages);
    const records: StepRecord[] = [];

    for (let step = 0; step < MAX_STEPS; step++) {
        const turn = decide(messages);
        if (turn.tool_calls.length) {
            messages.push(assistantMessage(turn));
            for (const tc of turn.tool_calls) {
                const result = tools.call(tc.name, tc.arguments);
                records.push({ name: tc.name, arguments: tc.arguments, result });
                messages.push({ role: "tool", tool_call_id: tc.id, name: tc.name, content: JSON.stringify(result) });
            }
            continue;
        }
        const reply = turn.content ?? "";
        return {
            reply,
            tool_calls: records,
            escalated: records.some((r) => r.name === "escalate_to_human"),
        };
    }

    return { reply: "Sorry, I'm having trouble — let me get a human to help.", tool_calls: records, escalated: false };
}
