"use client";

import { useEffect, useState } from "react";
import { PRESETS, TRACES, type LooprTrace } from "@/lib/loopr/traces";

const fillClass = (s: number) => (s >= 0.999 ? "ok" : s >= 0.5 ? "warn" : "bad");
const pct = (s: number) => Math.round(s * 100);

const preStyle: React.CSSProperties = {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    fontSize: "0.78rem",
    lineHeight: 1.5,
    color: "var(--text-primary)",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.6rem 0.7rem",
};

export default function LooproDemo() {
    const [presetId, setPresetId] = useState(PRESETS[0].id);
    const [trace, setTrace] = useState<LooprTrace | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shown, setShown] = useState(0);

    const seed = TRACES[presetId];

    // Reveal iterations one at a time so you watch the loop converge.
    useEffect(() => {
        if (!trace || shown >= trace.iterations.length) return;
        const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 400 : 950);
        return () => clearTimeout(t);
    }, [trace, shown]);

    function loadPreset(id: string) {
        setPresetId(id);
        setTrace(null);
        setError(null);
        setShown(0);
    }

    async function run() {
        if (loading) return;
        setLoading(true);
        setError(null);
        setTrace(null);
        setShown(0);
        try {
            const res = await fetch("/api/agents/loopr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preset: presetId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Loop error (${res.status})`);
            setTrace(data as LooprTrace);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const done = !!trace && shown >= trace.iterations.length;
    const running = loading || (!!trace && !done);

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">Loopr · prompt-optimization loop</span>
                <span className="agentlab-bar-note">replay of a real local run · deterministic</span>
            </div>

            <div className="agentlab-chips">
                {PRESETS.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        className={`agentlab-chip${p.id === presetId ? " agentlab-chip--active" : ""}`}
                        onClick={() => loadPreset(p.id)}
                        disabled={running}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="lab-brief">
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Task</span>
                    <span className="lab-brief-val">{seed.description}</span>
                </div>
                <div className="lab-brief-row">
                    <span className="lab-brief-key">Scorer</span>
                    <span className="lab-brief-val">
                        <code>{seed.scorer}</code>
                    </span>
                </div>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
                <label className="agentlab-field-label">Seed prompt</label>
                <pre style={preStyle}>{seed.seedPrompt}</pre>
            </div>

            <div className="agentlab-actions" style={{ marginTop: "0.9rem" }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={running}>
                    {running ? "Optimizing…" : "Run the loop ▸"}
                </button>
            </div>

            {error && <p className="agentlab-error">{error}</p>}

            {trace && (
                <div className="scan-result">
                    <label className="agentlab-field-label" style={{ marginBottom: "0.6rem" }}>
                        Iterations
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                        {trace.iterations.slice(0, shown).map((it) => {
                            const cls = fillClass(it.meanScore);
                            const color =
                                cls === "ok" ? "var(--success)" : cls === "warn" ? "var(--warning)" : "var(--error)";
                            return (
                                <div
                                    key={it.n}
                                    style={{
                                        border: "1px solid var(--border)",
                                        borderColor: it.isBest ? "var(--success)" : "var(--border)",
                                        borderRadius: "10px",
                                        padding: "0.8rem 0.85rem",
                                        background: "var(--surface)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.7rem",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono, monospace)",
                                                fontSize: "0.8rem",
                                                color: "var(--text-secondary)",
                                                minWidth: "3.2rem",
                                            }}
                                        >
                                            iter {it.n}
                                        </span>
                                        <span style={{ flex: 1 }}>
                                            <span className="fs-dim-track" style={{ display: "block" }}>
                                                <span
                                                    className={`fs-dim-fill fs-dim-fill--${cls}`}
                                                    style={{ width: `${pct(it.meanScore)}%`, transition: "width 600ms ease" }}
                                                />
                                            </span>
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono, monospace)",
                                                fontSize: "0.8rem",
                                                fontWeight: 700,
                                                color,
                                                minWidth: "5.4rem",
                                                textAlign: "right",
                                            }}
                                        >
                                            {pct(it.meanScore)}% · {it.passed}/{it.total}
                                        </span>
                                        {it.isBest && (
                                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--success)" }}>
                                                ▲ best
                                            </span>
                                        )}
                                    </div>

                                    {it.n === 0 && it.cases.length > 0 && (
                                        <details style={{ marginBottom: it.rewrite ? "0.55rem" : 0 }}>
                                            <summary
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "0.76rem",
                                                    color: "var(--text-secondary)",
                                                }}
                                            >
                                                what the seed produced
                                            </summary>
                                            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0" }}>
                                                {it.cases.map((c, i) => (
                                                    <li
                                                        key={i}
                                                        style={{
                                                            fontSize: "0.76rem",
                                                            color: "var(--text-secondary)",
                                                            marginBottom: "0.4rem",
                                                            lineHeight: 1.5,
                                                        }}
                                                    >
                                                        <span style={{ color: c.score >= 1 ? "var(--success)" : "var(--error)" }}>
                                                            {c.score >= 1 ? "✓" : "✗"}
                                                        </span>{" "}
                                                        want <code>{c.expected}</code> · got{" "}
                                                        <span style={{ fontStyle: "italic" }}>“{c.output}”</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}

                                    {it.rewrite && (
                                        <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "0.7rem" }}>
                                            <span
                                                style={{
                                                    display: "block",
                                                    fontSize: "0.72rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em",
                                                    color: "var(--text-secondary)",
                                                    marginBottom: "0.35rem",
                                                }}
                                            >
                                                reflected → rewrote the prompt
                                            </span>
                                            <pre style={preStyle}>{it.rewrite}</pre>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {done && (
                        <div
                            style={{
                                marginTop: "0.9rem",
                                padding: "0.85rem 1rem",
                                borderRadius: "10px",
                                background: "color-mix(in srgb, var(--success) 12%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--success) 35%, transparent)",
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: 700, color: "var(--success)" }}>
                                ✅ {trace.stopReason} — seed {pct(trace.seedScore)}% → best {pct(trace.bestScore)}% (+
                                {pct(trace.improvement)}%, iter {trace.bestIteration})
                            </p>
                            <label className="agentlab-field-label" style={{ margin: "0.7rem 0 0.35rem" }}>
                                Best prompt
                            </label>
                            <pre style={preStyle}>{trace.bestPrompt}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
