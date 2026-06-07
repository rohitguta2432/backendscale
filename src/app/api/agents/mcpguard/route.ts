import { NextResponse } from "next/server";
import { runAllChecks } from "@/lib/mcpguard/rules";
import { summary } from "@/lib/mcpguard/score";
import { normalizeManifest } from "@/lib/mcpguard/loader";

export const runtime = "nodejs";

const MAX_LEN = 20000;

// Deterministic, zero-network scan: the client posts a raw MCP manifest (JSON
// string), we parse + normalise it and run the exact rules engine. Same input
// always yields the same findings.
export async function POST(request: Request) {
    let body: { manifest?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (typeof body.manifest !== "string" || body.manifest.trim().length === 0) {
        return NextResponse.json({ error: "manifest must be a non-empty JSON string" }, { status: 400 });
    }
    if (body.manifest.length > MAX_LEN) {
        return NextResponse.json({ error: `manifest too large (max ${MAX_LEN} chars)` }, { status: 400 });
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(body.manifest);
    } catch {
        return NextResponse.json({ error: "manifest is not valid JSON" }, { status: 422 });
    }

    let manifest;
    try {
        manifest = normalizeManifest(parsed);
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : "could not read manifest" }, { status: 422 });
    }

    const findings = runAllChecks(manifest);
    return NextResponse.json({ findings, summary: summary(findings) });
}
