"use client";

import { useState } from "react";
import { PRESETS, type PortfolioPreset } from "@/lib/finscope/presets";
import type { PortfolioReport, HoldingType } from "@/lib/finscope/analyse";

const TYPE_LABEL: Record<HoldingType, string> = {
    equity_mf: "Equity MF",
    debt_mf: "Debt MF",
    stock: "Stock",
    fd: "FD",
    gold: "Gold",
    cash: "Cash",
};

const DIMENSIONS: { key: keyof PortfolioReport["scores"]; label: string }[] = [
    { key: "allocation", label: "Allocation" },
    { key: "overlap", label: "Overlap" },
    { key: "tax", label: "Tax efficiency" },
    { key: "expense", label: "Expense ratio" },
    { key: "concentration", label: "Concentration" },
    { key: "emergency_fund", label: "Emergency fund" },
];

const inr = (n: number) => "₹" + Math.trunc(n).toLocaleString("en-IN");

function scoreTone(s: number): string {
    if (s >= 80) return "ok";
    if (s >= 60) return "warn";
    return "bad";
}

export default function FinScopeDemo() {
    const [preset, setPreset] = useState<PortfolioPreset>(PRESETS[0]);
    const [age, setAge] = useState(PRESETS[0].age);
    const [risk, setRisk] = useState(PRESETS[0].risk);
    const [report, setReport] = useState<PortfolioReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function loadPreset(p: PortfolioPreset) {
        setPreset(p);
        setAge(p.age);
        setRisk(p.risk);
        setReport(null);
        setError(null);
    }

    async function run() {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/agents/finscope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    holdings: preset.holdings,
                    age,
                    risk,
                    monthly_expenses: preset.monthlyExpenses,
                    today: preset.today,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `X-ray error (${res.status})`);
            setReport(data);
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
                <span className="agentlab-bar-title">FinScope · portfolio X-ray</span>
                <span className="agentlab-bar-note">deterministic playbook · no API key · runs on this site</span>
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

            <p className="fs-blurb">{preset.blurb}</p>

            <div className="fs-holdings">
                <table className="fs-table">
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Type</th>
                            <th className="fs-num">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preset.holdings.map((h) => (
                            <tr key={h.instrument}>
                                <td>{h.instrument}</td>
                                <td>{TYPE_LABEL[h.type]}</td>
                                <td className="fs-num">{inr(h.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="fs-controls">
                <label className="fs-control">
                    <span>Age</span>
                    <input
                        type="number"
                        min={1}
                        max={120}
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        disabled={loading}
                    />
                </label>
                <label className="fs-control">
                    <span>Risk</span>
                    <select value={risk} onChange={(e) => setRisk(e.target.value as PortfolioPreset["risk"])} disabled={loading}>
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                    </select>
                </label>
                <div className="agentlab-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={loading}>
                        {loading ? "Running X-ray…" : "Run X-ray"}
                    </button>
                </div>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {report && (
                <div className="scan-result">
                    <div className="fs-scorehead">
                        <div className={`fs-overall fs-overall--${scoreTone(report.scores.overall)}`}>
                            <span className="fs-overall-num">{report.scores.overall}</span>
                            <span className="fs-overall-max">/100</span>
                        </div>
                        <div className="fs-overall-meta">
                            <span className="fs-overall-label">Overall health</span>
                            <span className="fs-overall-sub">
                                {inr(report.total)} across {report.holdingsCount} holdings
                            </span>
                        </div>
                    </div>

                    <div className="fs-dims">
                        {DIMENSIONS.map((d) => {
                            const s = report.scores[d.key];
                            return (
                                <div key={d.key} className="fs-dim">
                                    <span className="fs-dim-label">{d.label}</span>
                                    <span className="fs-dim-track">
                                        <span className={`fs-dim-fill fs-dim-fill--${scoreTone(s)}`} style={{ width: `${s}%` }} />
                                    </span>
                                    <span className="fs-dim-score">{s}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="fs-alloc">
                        <span className="fs-alloc-title">Allocation</span>
                        <div className="fs-alloc-bar">
                            {Object.entries(report.allocationPct)
                                .filter(([, v]) => v > 0)
                                .map(([k, v]) => (
                                    <span key={k} className={`fs-alloc-seg fs-alloc-seg--${k}`} style={{ width: `${v}%` }} title={`${k} ${v}%`} />
                                ))}
                        </div>
                        <div className="fs-alloc-legend">
                            {Object.entries(report.allocationPct)
                                .filter(([, v]) => v > 0)
                                .map(([k, v]) => (
                                    <span key={k} className="fs-alloc-key">
                                        <span className={`fs-alloc-dot fs-alloc-seg--${k}`} />
                                        {k} {v}%
                                    </span>
                                ))}
                        </div>
                    </div>

                    <ul className="scan-findings">
                        {report.flags.length === 0 && <li className="sev-pill sev-pill--ok">No significant issues flagged</li>}
                        {report.flags.map((f, i) => (
                            <li key={i} className="scan-finding">
                                <div className="scan-finding-head">
                                    <span className="fs-flag-dim">{f.dimension}</span>
                                    <span className="scan-finding-title">{f.text}</span>
                                </div>
                                <p className="scan-finding-fix">
                                    <strong>Ask a SEBI-registered RIA:</strong> {f.question}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <p className="agentlab-disclaimer">{report.disclaimer}</p>
                </div>
            )}
        </div>
    );
}
