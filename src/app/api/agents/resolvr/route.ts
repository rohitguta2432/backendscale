import { NextResponse } from "next/server";
import { resolve } from "@/lib/resolvr/resolve";
import type { CustomerTier } from "@/lib/resolvr/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const TIERS: CustomerTier[] = ["free", "pro", "enterprise"];

// Autonomous support-resolution agent. Deterministic classify → retrieve →
// decide; the customer-facing reply is drafted by Ollama (local) → cloud API →
// offline template, whichever is reachable. See docs/resolvr-spec.md.
export async function POST(request: Request) {
    let body: { subject?: unknown; body?: unknown; customerTier?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 200) : "";
    const message = typeof body.body === "string" ? body.body.trim().slice(0, 4000) : "";
    if (!message) {
        return NextResponse.json({ error: "body (the ticket message) is required" }, { status: 400 });
    }

    const customerTier: CustomerTier = TIERS.includes(body.customerTier as CustomerTier)
        ? (body.customerTier as CustomerTier)
        : "pro";

    try {
        const result = await resolve({ subject: subject || "(no subject)", body: message, customerTier });
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Resolution failed" },
            { status: 500 },
        );
    }
}
