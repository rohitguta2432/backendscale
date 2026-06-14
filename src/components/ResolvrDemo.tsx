"use client";

import { useState } from "react";
import { PRESETS, type TicketPreset } from "@/lib/resolvr/presets";
import type { ResolveResult, CustomerTier } from "@/lib/resolvr/types";

const TIERS: CustomerTier[] = ["free", "pro", "enterprise"];

function priorityTone(p: string): string {
    if (p === "urgent") return "critical";
    if (p === "high") return "high";
    if (p === "medium") return "medium";
    return "low";
}

export default function ResolvrDemo() {
    const [preset, setPreset] = useState<TicketPreset>(PRESETS[0]);
    const [subject, setSubject] = useState(PRESETS[0].subject);
    const [bodyText, setBodyText] = useState(PRESETS[0].body);
    const [tier, setTier] = useState<CustomerTier>(PRESETS[0].customerTier);
    const [result, setResult] = useState<ResolveResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function loadPreset(p: TicketPreset) {
        setPreset(p);
        setSubject(p.subject);
        setBodyText(p.body);
        setTier(p.customerTier);
        setResult(null);
        setError(null);
    }

    async function run() {
        if (loading || !bodyText.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/resolvr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, body: bodyText, customerTier: tier }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Resolution error (${res.status})`);
            setResult(data as ResolveResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const escalated = result?.decision.action === "escalate";

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">Resolvr · support resolution</span>
                <span className="agentlab-bar-note">ollama → api → offline · grounded in KB</span>
            </div>

            <div className="agentlab-chips">
                {PRESETS.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        className={`agentlab-chip${p.id === preset.id ? " agentlab-chip--active" : ""}`}
                        onClick={() => loadPreset(p)}
                        disabled={loading}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <label className="agentlab-field-label" htmlFor="rslv-subject">Subject</label>
            <input
                id="rslv-subject"
                className="rslv-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                maxLength={200}
            />

            <label className="agentlab-field-label" htmlFor="rslv-body">Customer message</label>
            <textarea
                id="rslv-body"
                className="agentlab-textarea"
                rows={4}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                disabled={loading}
                maxLength={4000}
            />

            <div className="rslv-controls">
                <label className="rslv-control">
                    <span>Customer tier</span>
                    <select value={tier} onChange={(e) => setTier(e.target.value as CustomerTier)} disabled={loading}>
                        {TIERS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </label>
                <div className="agentlab-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={loading}>
                        {loading ? "Resolving…" : "Resolve ticket"}
                    </button>
                </div>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {result && (
                <div className="scan-result">
                    <div className="rslv-pills">
                        <span className="sev-pill sev-pill--medium">{result.classification.category}</span>
                        <span className={`sev-pill sev-pill--${priorityTone(result.classification.priority)}`}>
                            {result.classification.priority} priority
                        </span>
                        <span className="sev-pill sev-pill--low">{result.classification.sentiment}</span>
                    </div>

                    <div className={`rslv-decision rslv-decision--${escalated ? "escalate" : "resolve"}`}>
                        <span className="rslv-decision-badge">{escalated ? "ESCALATE" : "AUTO-RESOLVE"}</span>
                        <span className="rslv-decision-reason">{result.decision.reason}</span>
                        <span className="rslv-decision-conf">confidence {Math.round(result.decision.confidence * 100)}%</span>
                    </div>

                    <div className="rslv-reply">
                        <div className="rslv-reply-head">
                            <span className="rslv-reply-title">{escalated ? "Holding reply to customer" : "Drafted reply"}</span>
                            <span className="rslv-backend" title="Which backend produced this reply">{result.backend}</span>
                        </div>
                        <p className="rslv-reply-body">{result.reply}</p>
                    </div>

                    {result.routingNote && (
                        <p className="rslv-routing"><strong>Internal:</strong> {result.routingNote}</p>
                    )}

                    {result.sources.length > 0 && (
                        <div className="rslv-sources">
                            <span className="rslv-sources-title">Grounded in</span>
                            <ul>
                                {result.sources.map((s) => (
                                    <li key={s.id}>
                                        <code>{s.id}</code> <span>{s.title}</span>
                                        <span className="rslv-source-score">{Math.round(s.score * 100)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <details className="rslv-trace">
                        <summary>Tool trace · {result.latencyMs} ms</summary>
                        <ol>
                            {result.trace.map((t, i) => (
                                <li key={i}><code>{t}</code></li>
                            ))}
                        </ol>
                    </details>
                </div>
            )}
        </div>
    );
}
