"use client";

import { useEffect, useState } from "react";
import { PRESETS, TRACES, type LooprTrace } from "@/lib/loopr/traces";
import { LIVE_TASKS, LIVE_PRESETS } from "@/lib/loopr/tasks";
import { optimize, type LiveCase, type LiveIteration, type LiveResult } from "@/lib/loopr/engine";
import { makeBrowserClient, DEFAULT_MODELS, type Provider } from "@/lib/loopr/browserLLM";

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

interface IterVM {
    n: number;
    meanScore: number;
    passed: number;
    total: number;
    isBest: boolean;
    rewrite: string;
    cases: { input: string; expected: string; output: string; score: number }[];
}
interface SummaryVM {
    seedScore: number;
    bestScore: number;
    improvement: number;
    bestIteration: number;
    stopReason: string;
    bestPrompt: string;
}

function parseCases(text: string): LiveCase[] {
    return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
            const i = l.indexOf("|||");
            return i === -1 ? null : { input: l.slice(0, i).trim(), expected: l.slice(i + 3).trim() };
        })
        .filter((c): c is LiveCase => !!c && !!c.input);
}
const casesToText = (cases: LiveCase[]) => cases.map((c) => `${c.input} ||| ${c.expected}`).join("\n");

function renderResults(iters: IterVM[], summary: SummaryVM | null) {
    return (
        <div className="scan-result">
            <label className="agentlab-field-label" style={{ marginBottom: "0.6rem" }}>
                Iterations
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {iters.map((it) => {
                    const cls = fillClass(it.meanScore);
                    const color = cls === "ok" ? "var(--success)" : cls === "warn" ? "var(--warning)" : "var(--error)";
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
                            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.5rem" }}>
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
                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--success)" }}>▲ best</span>
                                )}
                            </div>

                            {it.n === 0 && it.cases.length > 0 && (
                                <details style={{ marginBottom: it.rewrite ? "0.55rem" : 0 }}>
                                    <summary style={{ cursor: "pointer", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                                        what the seed produced
                                    </summary>
                                    <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0" }}>
                                        {it.cases.map((c, i) => (
                                            <li
                                                key={i}
                                                style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginBottom: "0.4rem", lineHeight: 1.5 }}
                                            >
                                                <span style={{ color: c.score >= 1 ? "var(--success)" : "var(--error)" }}>
                                                    {c.score >= 1 ? "✓" : "✗"}
                                                </span>{" "}
                                                want <code>{c.expected}</code> · got{" "}
                                                <span style={{ fontStyle: "italic" }}>“{(c.output || "").slice(0, 150)}”</span>
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

            {summary && (
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
                        ✅ {summary.stopReason} — seed {pct(summary.seedScore)}% → best {pct(summary.bestScore)}% (+
                        {pct(summary.improvement)}%, iter {summary.bestIteration})
                    </p>
                    <label className="agentlab-field-label" style={{ margin: "0.7rem 0 0.35rem" }}>
                        Best prompt
                    </label>
                    <pre style={preStyle}>{summary.bestPrompt}</pre>
                </div>
            )}
        </div>
    );
}

export default function LooproDemo() {
    const [mode, setMode] = useState<"replay" | "live">("replay");

    // ---- replay mode ----
    const [presetId, setPresetId] = useState(PRESETS[0].id);
    const [trace, setTrace] = useState<LooprTrace | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shown, setShown] = useState(0);
    const seed = TRACES[presetId];

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
    async function runReplay() {
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

    // ---- live mode (bring your own key) ----
    const [livePreset, setLivePreset] = useState(LIVE_PRESETS[0].id);
    const [provider, setProvider] = useState<Provider>("openai");
    const [model, setModel] = useState(DEFAULT_MODELS.openai);
    const [apiKey, setApiKey] = useState("");
    const [seedDraft, setSeedDraft] = useState(LIVE_TASKS[LIVE_PRESETS[0].id].seedPrompt);
    const [casesDraft, setCasesDraft] = useState(casesToText(LIVE_TASKS[LIVE_PRESETS[0].id].cases));
    const [liveIters, setLiveIters] = useState<LiveIteration[]>([]);
    const [liveResult, setLiveResult] = useState<LiveResult | null>(null);
    const [liveRunning, setLiveRunning] = useState(false);
    const [liveError, setLiveError] = useState<string | null>(null);
    const [liveStatus, setLiveStatus] = useState("");

    function loadLivePreset(id: string) {
        setLivePreset(id);
        setSeedDraft(LIVE_TASKS[id].seedPrompt);
        setCasesDraft(casesToText(LIVE_TASKS[id].cases));
        setLiveIters([]);
        setLiveResult(null);
        setLiveError(null);
    }
    function pickProvider(p: Provider) {
        setProvider(p);
        setModel(DEFAULT_MODELS[p]);
    }
    async function runLive() {
        if (liveRunning) return;
        if (!apiKey.trim()) {
            setLiveError(`Enter your ${provider === "openai" ? "OpenAI" : "Anthropic"} API key to run live.`);
            return;
        }
        const cases = parseCases(casesDraft);
        if (!cases.length) {
            setLiveError("Add at least one eval case (format: input ||| expected).");
            return;
        }
        setLiveRunning(true);
        setLiveError(null);
        setLiveIters([]);
        setLiveResult(null);
        setLiveStatus("running iter 0…");
        try {
            const base = LIVE_TASKS[livePreset];
            const generate = makeBrowserClient(provider, apiKey, model);
            const result = await optimize(
                { ...base, seedPrompt: seedDraft, cases },
                generate,
                (it) => {
                    setLiveIters((prev) => [...prev, it]);
                    setLiveStatus(`iter ${it.n}: ${pct(it.meanScore)}%`);
                },
            );
            setLiveResult(result);
            setLiveStatus("");
        } catch (e) {
            setLiveError(e instanceof Error ? e.message : "Live run failed");
        } finally {
            setLiveRunning(false);
        }
    }

    // ---- view models ----
    const replayIters: IterVM[] = trace ? trace.iterations.slice(0, shown) : [];
    const replayDone = !!trace && shown >= trace.iterations.length;
    const replaySummary: SummaryVM | null = trace && replayDone ? trace : null;
    const replayRunning = loading || (!!trace && !replayDone);

    const liveSummary: SummaryVM | null = liveResult;

    return (
        <div className="agentlab-demo">
            <div className="agentlab-bar">
                <span className="agentlab-dot" aria-hidden="true" />
                <span className="agentlab-bar-title">Loopr · prompt-optimization loop</span>
                <span className="agentlab-bar-note">
                    {mode === "replay" ? "replay of a real local run · deterministic" : "live · your key, in your browser"}
                </span>
            </div>

            <div className="agentlab-chips" role="tablist" aria-label="Mode" style={{ marginBottom: "1rem" }}>
                <button
                    type="button"
                    className={`agentlab-chip${mode === "replay" ? " agentlab-chip--active" : ""}`}
                    onClick={() => setMode("replay")}
                >
                    Replay (preset)
                </button>
                <button
                    type="button"
                    className={`agentlab-chip${mode === "live" ? " agentlab-chip--active" : ""}`}
                    onClick={() => setMode("live")}
                >
                    Live · your key
                </button>
            </div>

            {mode === "replay" ? (
                <>
                    <div className="agentlab-chips">
                        {PRESETS.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className={`agentlab-chip${p.id === presetId ? " agentlab-chip--active" : ""}`}
                                onClick={() => loadPreset(p.id)}
                                disabled={replayRunning}
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
                        <button type="button" className="btn btn-primary btn-sm" onClick={runReplay} disabled={replayRunning}>
                            {replayRunning ? "Optimizing…" : "Run the loop ▸"}
                        </button>
                    </div>

                    {error && <p className="agentlab-error">{error}</p>}
                    {trace && renderResults(replayIters, replaySummary)}
                </>
            ) : (
                <>
                    <div className="agentlab-chips">
                        {LIVE_PRESETS.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className={`agentlab-chip${p.id === livePreset ? " agentlab-chip--active" : ""}`}
                                onClick={() => loadLivePreset(p.id)}
                                disabled={liveRunning}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="agentlab-actions" style={{ marginBottom: "0.7rem", flexWrap: "wrap" }}>
                        <label className="agentlab-field-label" style={{ margin: 0 }}>
                            <select
                                value={provider}
                                onChange={(e) => pickProvider(e.target.value as Provider)}
                                disabled={liveRunning}
                                style={{ marginRight: "0.5rem" }}
                            >
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic</option>
                            </select>
                        </label>
                        <input
                            className="rslv-input"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            disabled={liveRunning}
                            placeholder="model"
                            style={{ maxWidth: "180px" }}
                        />
                        <input
                            className="rslv-input"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            disabled={liveRunning}
                            placeholder={provider === "openai" ? "sk-…" : "sk-ant-…"}
                            style={{ flex: 1, minWidth: "180px" }}
                        />
                    </div>
                    <p className="agentlab-disclaimer" style={{ margin: "0 0 0.8rem" }}>
                        Your key runs in your browser and is sent only to {provider === "openai" ? "OpenAI" : "Anthropic"} —
                        never to this site, never stored. Costs a few cents of your own tokens per run.
                    </p>

                    <label className="agentlab-field-label">Seed prompt (edit me)</label>
                    <textarea
                        className="agentlab-textarea agentlab-textarea--code"
                        rows={3}
                        value={seedDraft}
                        onChange={(e) => setSeedDraft(e.target.value)}
                        disabled={liveRunning}
                    />
                    <label className="agentlab-field-label" style={{ marginTop: "0.7rem" }}>
                        Eval cases — one per line, <code>input ||| expected</code>
                    </label>
                    <textarea
                        className="agentlab-textarea agentlab-textarea--code"
                        rows={4}
                        value={casesDraft}
                        onChange={(e) => setCasesDraft(e.target.value)}
                        disabled={liveRunning}
                    />

                    <div className="agentlab-actions" style={{ marginTop: "0.8rem", alignItems: "center", gap: "0.7rem" }}>
                        <button type="button" className="btn btn-primary btn-sm" onClick={runLive} disabled={liveRunning}>
                            {liveRunning ? "Optimizing…" : "Run live ▸"}
                        </button>
                        {liveRunning && liveStatus && (
                            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono, monospace)" }}>
                                {liveStatus}
                            </span>
                        )}
                    </div>

                    {liveError && <p className="agentlab-error">{liveError}</p>}
                    {(liveIters.length > 0 || liveResult) &&
                        renderResults(liveIters as unknown as IterVM[], liveSummary)}
                </>
            )}
        </div>
    );
}
