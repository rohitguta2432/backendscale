import { NextResponse } from "next/server";
import { TRACES, PRESETS } from "@/lib/loopr/traces";

export const runtime = "nodejs";

// Deterministic replay: the prompt-optimization loop ran offline against a local
// model; this route just serves the recorded trace for a chosen preset. No LLM
// call, no network, no randomness — the same preset always returns the same run.
export async function POST(request: Request) {
    let body: { preset?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const preset = typeof body.preset === "string" ? body.preset.trim() : "";
    if (!preset) {
        return NextResponse.json(
            { error: `preset is required (one of: ${PRESETS.map((p) => p.id).join(", ")})` },
            { status: 400 },
        );
    }

    const trace = TRACES[preset];
    if (!trace) {
        return NextResponse.json({ error: `unknown preset '${preset}'` }, { status: 404 });
    }

    return NextResponse.json(trace);
}
