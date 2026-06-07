"use client";

import { useState } from "react";
import { SAMPLES, type TopicSample } from "@/lib/cadence/samples";
import type { PipelineResult } from "@/lib/cadence/pipeline";

export default function CadenceDemo() {
    const [topic, setTopic] = useState<TopicSample>(SAMPLES[0]);
    const [result, setResult] = useState<PipelineResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function loadSample(s: TopicSample) {
        setTopic(s);
        setResult(null);
        setError(null);
    }

    async function run() {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/cadence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: topic.topic, keyword: topic.keyword, niche: topic.niche }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Pipeline error (${res.status})`);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">Cadence · content pipeline</span>
                <span className="agentlab-bar-note">deterministic · no API key · runs on this site</span>
            </div>

            <div className="agentlab-chips">
                {SAMPLES.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        className={`agentlab-chip${s.id === topic.id ? " agentlab-chip--active" : ""}`}
                        onClick={() => loadSample(s)}
                        disabled={loading}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="lab-brief">
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Topic</span>
                    <span className="lab-brief-val">{topic.topic}</span>
                </div>
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Target keyword</span>
                    <span className="lab-brief-val">
                        <code>{topic.keyword}</code>
                    </span>
                </div>
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Niche</span>
                    <span className="lab-brief-val">{topic.niche}</span>
                </div>
            </div>

            <div className="agentlab-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={loading}>
                    {loading ? "Drafting…" : "Run pipeline"}
                </button>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {result && (
                <div className="scan-result">
                    <div className="scan-summary">
                        <span className={`scan-grade scan-grade--${result.valid ? "ok" : "bad"}`}>
                            {result.valid ? "A" : "F"}
                        </span>
                        <span className={`sev-pill sev-pill--${result.valid ? "ok" : "critical"}`}>
                            {result.status === "published" ? "Published" : "Rejected"}
                        </span>
                        <span className="cad-checkcount">
                            {result.passed}/{result.total} structural checks passed
                        </span>
                    </div>

                    <div className="cad-meta">
                        <div className="cad-meta-row">
                            <span className="cad-meta-key">SEO title</span>
                            <span className="cad-meta-val">{result.post.seoTitle}</span>
                            <span className="cad-meta-badge">{result.post.titleLen} ch</span>
                        </div>
                        <div className="cad-meta-row">
                            <span className="cad-meta-key">Meta</span>
                            <span className="cad-meta-val">{result.post.metaDescription}</span>
                            <span className="cad-meta-badge">{result.post.metaLen} ch</span>
                        </div>
                        <div className="cad-meta-row">
                            <span className="cad-meta-key">Slug</span>
                            <span className="cad-meta-val">
                                <code>{result.post.slug}</code>
                            </span>
                            <span className="cad-meta-badge">{result.post.wordCount} words</span>
                        </div>
                        <div className="cad-meta-row">
                            <span className="cad-meta-key">H1</span>
                            <span className="cad-meta-val">{result.post.h1}</span>
                            <span className="cad-meta-badge">
                                {result.post.sectionCount} H2 · {result.post.faqCount} FAQ
                            </span>
                        </div>
                    </div>

                    <ul className="cad-checks">
                        {result.checks.map((c) => (
                            <li key={c.key} className={`cad-check cad-check--${c.ok ? "ok" : "bad"}`}>
                                <span className="cad-check-icon" aria-hidden="true">
                                    {c.ok ? "✓" : "✗"}
                                </span>
                                <span className="cad-check-label">{c.label}</span>
                                <span className="cad-check-detail">{c.detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
