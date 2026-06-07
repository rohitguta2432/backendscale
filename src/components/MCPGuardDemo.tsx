"use client";

import { useState } from "react";
import { SAMPLES } from "@/lib/mcpguard/samples";

type Severity = "critical" | "high" | "medium" | "low";

interface Finding {
    id: string;
    severity: Severity;
    tool: string;
    evidence: string;
    remediation: string;
}

interface Summary {
    total: number;
    bySeverity: Record<Severity, number>;
    grade: string;
    hasCriticalOrHigh: boolean;
}

const SEV_ORDER: Severity[] = ["critical", "high", "medium", "low"];

function gradeTone(grade: string): string {
    if (grade === "A" || grade === "B") return "ok";
    if (grade === "C" || grade === "D") return "warn";
    return "bad";
}

export default function MCPGuardDemo() {
    const [text, setText] = useState(SAMPLES[0].json);
    const [findings, setFindings] = useState<Finding[] | null>(null);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function scan() {
        if (loading || !text.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/mcpguard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ manifest: text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Scan error (${res.status})`);
            const sorted = (data.findings as Finding[])
                .slice()
                .sort((a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity));
            setFindings(sorted);
            setSummary(data.summary);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    function loadSample(json: string) {
        setText(json);
        setFindings(null);
        setSummary(null);
        setError(null);
    }

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">MCPGuard · live scanner</span>
                <span className="agentlab-bar-note">deterministic · no API key · runs on this site</span>
            </div>

            <div className="agentlab-chips">
                {SAMPLES.map((s) => (
                    <button key={s.id} type="button" className="agentlab-chip" onClick={() => loadSample(s.json)} disabled={loading}>
                        {s.label}
                    </button>
                ))}
            </div>

            <label className="agentlab-field-label" htmlFor="mcpg-input">
                Paste an MCP manifest (JSON)
            </label>
            <textarea
                id="mcpg-input"
                className="agentlab-textarea agentlab-textarea--code"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                rows={10}
                disabled={loading}
            />

            <div className="agentlab-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={scan} disabled={loading || !text.trim()}>
                    {loading ? "Scanning…" : "Scan manifest"}
                </button>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {summary && findings && (
                <div className="scan-result">
                    <div className="scan-summary">
                        <span className={`scan-grade scan-grade--${gradeTone(summary.grade)}`}>{summary.grade}</span>
                        <div className="scan-counts">
                            {SEV_ORDER.map((s) =>
                                summary.bySeverity[s] > 0 ? (
                                    <span key={s} className={`sev-pill sev-pill--${s}`}>
                                        {summary.bySeverity[s]} {s}
                                    </span>
                                ) : null,
                            )}
                            {summary.total === 0 && <span className="sev-pill sev-pill--ok">No issues found</span>}
                        </div>
                    </div>

                    <ul className="scan-findings">
                        {findings.map((f, i) => (
                            <li key={i} className="scan-finding">
                                <div className="scan-finding-head">
                                    <span className={`sev-pill sev-pill--${f.severity}`}>{f.severity}</span>
                                    <code className="scan-finding-id">{f.id}</code>
                                    <span className="scan-finding-tool">{f.tool}</span>
                                </div>
                                <p className="scan-finding-evidence">{f.evidence}</p>
                                <p className="scan-finding-fix">
                                    <strong>Fix:</strong> {f.remediation}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
