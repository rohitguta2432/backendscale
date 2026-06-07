"use client";

import { useState } from "react";
import { LEADS, ICP, type Lead, type PipelineResult } from "@/lib/prospectr/pipeline";

function barTone(points: number, max: number): string {
    if (points >= max) return "ok";
    if (points > 0) return "warn";
    return "bad";
}

export default function ProspectrDemo() {
    const [lead, setLead] = useState<Lead>(LEADS[0]);
    const [result, setResult] = useState<PipelineResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function loadLead(l: Lead) {
        setLead(l);
        setResult(null);
        setError(null);
    }

    async function run() {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/prospectr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId: lead.id }),
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
                <span className="agentlab-bar-title">Prospectr · outbound pipeline</span>
                <span className="agentlab-bar-note">deterministic · dry-run only · runs on this site</span>
            </div>

            <p className="pr-icp">
                <strong>ICP:</strong> {ICP.industries.join(" / ")} · {ICP.roles.join(", ")} · {ICP.sizes.join(" or ")} ·
                signals: {ICP.signalKeywords.join(", ")}
            </p>

            <div className="agentlab-chips">
                {LEADS.map((l) => (
                    <button
                        key={l.id}
                        type="button"
                        className={`agentlab-chip${l.id === lead.id ? " agentlab-chip--active" : ""}`}
                        onClick={() => loadLead(l)}
                        disabled={loading}
                    >
                        {l.company}
                    </button>
                ))}
            </div>

            <div className="lab-brief">
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Lead</span>
                    <span className="lab-brief-val">
                        {lead.name} — {lead.role}, {lead.company}
                    </span>
                </div>
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Profile</span>
                    <span className="lab-brief-val">
                        {lead.industry} · {lead.size} · <code>{lead.domain}</code>
                    </span>
                </div>
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Signals</span>
                    <span className="lab-brief-val">{lead.signals.join("; ")}</span>
                </div>
            </div>

            <div className="agentlab-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={loading}>
                    {loading ? "Running…" : "Run agent"}
                </button>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {result && (
                <div className="scan-result">
                    <div className="scan-summary">
                        <span className={`scan-grade scan-grade--${result.classification === "keep" ? "ok" : "warn"}`}>
                            {result.score}
                        </span>
                        <span className={`sev-pill sev-pill--${result.classification === "keep" ? "ok" : "warn"}`}>
                            {result.classification === "keep" ? "Keep" : "Skip"}
                        </span>
                        <span
                            className={`sev-pill sev-pill--${
                                result.queue.tone === "ok" ? "ok" : result.queue.tone === "warn" ? "warn" : "critical"
                            }`}
                        >
                            {result.queue.label}
                        </span>
                    </div>

                    <div className="pr-email">
                        <span className="pr-email-label">Verified email</span>
                        <code className="pr-email-addr">{result.email}</code>
                        <span className={`sev-pill sev-pill--${result.emailConfidence === "verified" ? "ok" : "warn"}`}>
                            {result.emailConfidence}
                        </span>
                    </div>

                    <div className="fs-dims">
                        {result.breakdown.map((c) => {
                            const pct = Math.round((c.points / c.max) * 100);
                            const tone = barTone(c.points, c.max);
                            return (
                                <div key={c.label} className="fs-dim">
                                    <span className="fs-dim-label">
                                        {c.label} <span className="pr-comp-detail">{c.detail}</span>
                                    </span>
                                    <span className="fs-dim-track">
                                        <span className={`fs-dim-fill fs-dim-fill--${tone}`} style={{ width: `${pct}%` }} />
                                    </span>
                                    <span className="fs-dim-score">
                                        {c.points}/{c.max}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {result.blocklisted && (
                        <p className="agentlab-error">Safety gate: {result.blockReason} — never queued.</p>
                    )}

                    {result.pitch && (
                        <div className="pr-pitch">
                            <div className="pr-pitch-subject">
                                <strong>Subject:</strong> {result.pitch.subject}
                                <span className="pr-pitch-meta">
                                    {result.pitch.wordCount} words · {result.pitch.placeholderLeak ? "placeholder leak" : "no placeholders"}
                                </span>
                            </div>
                            <pre className="pr-pitch-body">{result.pitch.body}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
