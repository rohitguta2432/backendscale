import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/cadence/pipeline";

export const runtime = "nodejs";

const MAX_LEN = 300;

// Deterministic content pipeline: the client posts a topic + keyword + niche,
// we draft a full SEO post and run the structural linter. Same input always
// yields the same result — no API key, no network, no LLM.
export async function POST(request: Request) {
    let body: { topic?: unknown; keyword?: unknown; niche?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
    const niche = typeof body.niche === "string" ? body.niche.trim() : "";

    if (!topic || !keyword) {
        return NextResponse.json({ error: "topic and keyword are required" }, { status: 400 });
    }
    if (topic.length > MAX_LEN || keyword.length > MAX_LEN || niche.length > MAX_LEN) {
        return NextResponse.json({ error: `field too long (max ${MAX_LEN} chars)` }, { status: 400 });
    }

    const result = runPipeline(topic, keyword, niche || "general");
    return NextResponse.json(result);
}
