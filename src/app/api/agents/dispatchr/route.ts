import { NextResponse } from "next/server";
import { runConversation } from "@/lib/dispatchr/agent";

export const runtime = "nodejs";

const MAX_TURNS = 20;
const MAX_LEN = 500;

// Stateless replay: the client holds the conversation and posts every user turn
// so far plus a fixed session seed. We rebuild a fresh, isolated world each call
// and re-run the deterministic agent — same input always yields the same booking.
export async function POST(request: Request) {
    let body: { messages?: unknown; seed?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_TURNS) {
        return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 });
    }

    const messages: string[] = [];
    for (const m of body.messages) {
        if (typeof m !== "string" || m.trim().length === 0) {
            return NextResponse.json({ error: "each message must be a non-empty string" }, { status: 400 });
        }
        messages.push(m.slice(0, MAX_LEN));
    }

    let now: Date | undefined;
    if (typeof body.seed === "string") {
        const parsed = new Date(body.seed);
        if (!Number.isNaN(parsed.getTime())) now = parsed;
    }

    const result = runConversation(messages, now);

    return NextResponse.json({
        reply: result.reply,
        toolCalls: result.tool_calls,
        escalated: result.escalated,
    });
}
