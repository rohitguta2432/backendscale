"use client";

import { useState } from "react";
import { SAMPLES } from "@/lib/clauseguard/samples";

type Severity = "high" | "medium" | "low";

interface Finding {
    id: string;
    category: string;
    title: string;
    severity: Severity;
    quote: string;
    why: string;
    redline: string;
}

interface Stats {
    high: number;
    medium: number;
    low: number;
    total: number;
    riskLevel: "high" | "medium" | "low" | "clear";
}

const SEV_ORDER: Severity[] = ["high", "medium", "low"];

function riskTone(level: string): string {
    if (level === "high") return "bad";
    if (level === "medium") return "warn";
    if (level === "low") return "warn";
    return "ok";
}

export default function ClauseGuardDemo() {
    const [text, setText] = useState(SAMPLES[0].text);
    const [findings, setFindings] = useState<Finding[] | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function review() {
        if (loading || !text.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/clauseguard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Review error (${res.status})`);
            setFindings(data.findings);
            setStats(data.stats);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    function loadSample(t: string) {
        setText(t);
        setFindings(null);
        setStats(null);
        setError(null);
    }

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">ClauseGuard · live review</span>
                <span className="agentlab-bar-note">deterministic playbook · no API key · runs on this site</span>
            </div>

            <div className="agentlab-chips">
                {SAMPLES.map((s) => (
                    <button key={s.id} type="button" className="agentlab-chip" onClick={() => loadSample(s.text)} disabled={loading}>
                        {s.label}
                    </button>
                ))}
            </div>

            <label className="agentlab-field-label" htmlFor="cg-input">
                Paste a contract (NDA, MSA, SOW, SaaS terms)
            </label>
            <textarea
                id="cg-input"
                className="agentlab-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                disabled={loading}
            />

            <div className="agentlab-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={review} disabled={loading || !text.trim()}>
                    {loading ? "Reviewing…" : "Review contract"}
                </button>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {stats && findings && (
                <div className="scan-result">
                    <div className="scan-summary">
                        <span className={`scan-grade scan-grade--${riskTone(stats.riskLevel)}`}>{stats.riskLevel}</span>
                        <div className="scan-counts">
                            {SEV_ORDER.map((s) =>
                                stats[s] > 0 ? (
                                    <span key={s} className={`sev-pill sev-pill--${s}`}>
                                        {stats[s]} {s}
                                    </span>
                                ) : null,
                            )}
                            {stats.total === 0 && <span className="sev-pill sev-pill--ok">No risky clauses flagged</span>}
                        </div>
                    </div>

                    <ul className="scan-findings">
                        {findings.map((f, i) => (
                            <li key={i} className="scan-finding">
                                <div className="scan-finding-head">
                                    <span className={`sev-pill sev-pill--${f.severity}`}>{f.severity}</span>
                                    <span className="scan-finding-title">{f.title}</span>
                                    <span className="scan-finding-tool">{f.category}</span>
                                </div>
                                <blockquote className="clause-quote">{f.quote}</blockquote>
                                <p className="scan-finding-evidence">{f.why}</p>
                                <p className="scan-finding-fix">
                                    <strong>Suggested redline:</strong> {f.redline}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p className="agentlab-disclaimer">
                        Automated first-pass risk screen, not legal advice. For high-stakes contracts, have a qualified attorney review the final terms.
                    </p>
                </div>
            )}
        </div>
    );
}
