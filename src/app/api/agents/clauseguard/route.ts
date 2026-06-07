import { NextResponse } from "next/server";
import { scanContract } from "@/lib/clauseguard/playbook";

export const runtime = "nodejs";

const MAX_LEN = 40000;

// Deterministic offline contract pre-screen — the playbook layer that runs with
// no API key. Same contract text always yields the same findings.
export async function POST(request: Request) {
    let body: { text?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (typeof body.text !== "string" || body.text.trim().length === 0) {
        return NextResponse.json({ error: "text must be a non-empty contract string" }, { status: 400 });
    }

    const { findings, stats } = scanContract(body.text.slice(0, MAX_LEN));
    return NextResponse.json({ findings, stats });
}
