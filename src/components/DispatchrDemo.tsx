"use client";

import { useEffect, useRef, useState } from "react";

interface StepRecord {
    name: string;
    arguments: Record<string, unknown>;
    result: Record<string, unknown>;
}

interface ChatItem {
    role: "user" | "agent";
    text: string;
    tools?: StepRecord[];
    escalated?: boolean;
}

const INTRO =
    "Hi! I'm Dispatchr — the AI dispatcher for a home-services company. Tell me what's wrong (AC, heating, plumbing, electrical) and I'll quote it and book a technician. Try one of the prompts below.";

const STARTERS = [
    "My AC isn't cooling at all",
    "There's a leak under my kitchen sink",
    "I smell gas in my kitchen!",
];

function n(v: unknown): string {
    return Number(v).toLocaleString("en-IN");
}

function summarizeTool(t: StepRecord): string {
    const r = t.result;
    switch (t.name) {
        case "get_price_estimate":
            return r.error
                ? String(r.error)
                : `${String(r.label)} — ₹${n(r.diagnostic_fee)} diagnostic · ₹${n(r.repair_low)}–₹${n(r.repair_high)}`;
        case "find_available_slots": {
            const slots = (r.slots as unknown[]) ?? [];
            return `${slots.length} open slot${slots.length === 1 ? "" : "s"} found`;
        }
        case "book_job":
            return r.status === "booked"
                ? `Booked ${String(r.booking_id)} · ${String(r.technician_name)} · ${String(r.window)}`
                : String(r.error ?? "slot unavailable");
        case "escalate_to_human":
            return "Safety escalation → human dispatcher";
        default:
            return t.name;
    }
}

export default function DispatchrDemo() {
    const [seed] = useState(() => new Date().toISOString());
    const [transcript, setTranscript] = useState<ChatItem[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [transcript, loading]);

    const userTurns = transcript.filter((t) => t.role === "user").map((t) => t.text);
    const lastAgent = [...transcript].reverse().find((t) => t.role === "agent");
    const offeringSlots = !!lastAgent && /which works|i can offer/i.test(lastAgent.text);

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        setError(null);
        setInput("");
        const nextUserTurns = [...userTurns, trimmed];
        setTranscript((prev) => [...prev, { role: "user", text: trimmed }]);
        setLoading(true);
        try {
            const res = await fetch("/api/agents/dispatchr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextUserTurns, seed }),
            });
            if (!res.ok) throw new Error(`Agent error (${res.status})`);
            const data = await res.json();
            setTranscript((prev) => [
                ...prev,
                { role: "agent", text: data.reply, tools: data.toolCalls, escalated: data.escalated },
            ]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setTranscript([]);
        setInput("");
        setError(null);
    }

    const chips = offeringSlots
        ? ["Book the 2 PM slot — I'm Rohit at 12 MG Road", "What about tomorrow morning?"]
        : STARTERS;

    return (
        <div className="dispatchr">
            <div className="dispatchr-bar">
                <span className="dispatchr-dot" aria-hidden="true" />
                <span className="dispatchr-bar-title">Dispatchr · live agent</span>
                <span className="dispatchr-bar-note">deterministic · no API key · runs on this site</span>
                {transcript.length > 0 && (
                    <button type="button" className="dispatchr-reset" onClick={reset} disabled={loading}>
                        Reset
                    </button>
                )}
            </div>

            <div className="dispatchr-window" ref={scrollRef}>
                <div className="dispatchr-msg dispatchr-msg--agent">
                    <div className="dispatchr-bubble">{INTRO}</div>
                </div>

                {transcript.map((item, i) => (
                    <div key={i} className={`dispatchr-msg dispatchr-msg--${item.role}`}>
                        {item.role === "agent" && item.tools && item.tools.length > 0 && (
                            <ol className="dispatchr-trace" aria-label="Agent tool calls">
                                {item.tools.map((t, j) => (
                                    <li key={j} className="dispatchr-trace-step">
                                        <code className="dispatchr-trace-name">{t.name}()</code>
                                        <span className="dispatchr-trace-result">{summarizeTool(t)}</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                        <div className={`dispatchr-bubble ${item.escalated ? "dispatchr-bubble--alert" : ""}`}>
                            {item.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="dispatchr-msg dispatchr-msg--agent">
                        <div className="dispatchr-bubble dispatchr-bubble--typing">
                            <span /> <span /> <span />
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="dispatchr-error">{error}</p>}

            <div className="dispatchr-chips">
                {chips.map((c) => (
                    <button key={c} type="button" className="dispatchr-chip" onClick={() => send(c)} disabled={loading}>
                        {c}
                    </button>
                ))}
            </div>

            <form
                className="dispatchr-input"
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the problem, or pick a slot…"
                    aria-label="Message Dispatchr"
                    maxLength={500}
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}
