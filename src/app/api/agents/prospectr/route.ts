import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/prospectr/pipeline";

export const runtime = "nodejs";

// Deterministic outbound pipeline: the client posts a leadId, the server enriches
// + scores it against the fixed ICP, drafts a pitch for keepers, and runs the
// blocklist safety gate. No API key, no network, no real sends.
export async function POST(request: Request) {
    let body: { leadId?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (typeof body.leadId !== "string" || body.leadId.trim().length === 0) {
        return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    try {
        return NextResponse.json(runPipeline(body.leadId.trim()));
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : "could not run pipeline" }, { status: 422 });
    }
}
