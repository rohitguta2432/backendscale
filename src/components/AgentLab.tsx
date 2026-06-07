"use client";

import { useState, type ComponentType } from "react";
import DispatchrDemo from "@/components/DispatchrDemo";
import ClauseGuardDemo from "@/components/ClauseGuardDemo";
import FinScopeDemo from "@/components/FinScopeDemo";
import MCPGuardDemo from "@/components/MCPGuardDemo";

interface Bullet {
    name: string;
    desc: string;
    mono?: boolean;
}

interface LabAgent {
    id: string;
    label: string;
    title: string;
    description: string;
    Component: ComponentType;
    panelTitle: string;
    bullets: Bullet[];
    evalTitle: string;
    evals: { label: string; value: string }[];
    hint: string;
}

const AGENTS: LabAgent[] = [
    {
        id: "dispatchr",
        label: "Dispatchr",
        title: "Dispatchr — AI home-services dispatcher",
        description:
            "A working dispatcher for a home-services company. No API key, no cloud LLM — a deterministic policy drives the exact tool-calling loop a production model would, so the demo is reproducible and the booking actually happens. Swap in any OpenAI-compatible model and the loop is unchanged.",
        Component: DispatchrDemo,
        panelTitle: "What it can do on its own",
        bullets: [
            { name: "get_price_estimate", desc: "quotes only from a real price book", mono: true },
            { name: "find_available_slots", desc: "offers genuine open technician slots", mono: true },
            { name: "book_job", desc: "books the appointment end-to-end", mono: true },
            { name: "escalate_to_human", desc: "hands off on any safety emergency", mono: true },
        ],
        evalTitle: "Quality gate",
        evals: [
            { label: "Eval cases passed", value: "26 / 26" },
            { label: "Emergency-escalation recall", value: "100%" },
            { label: "Over-escalation rate", value: "0%" },
            { label: "Price integrity", value: "100%" },
        ],
        hint: "Try a normal repair, then a safety line like “I smell gas” — watch it refuse to quote and escalate instead.",
    },
    {
        id: "clauseguard",
        label: "ClauseGuard",
        title: "ClauseGuard — AI contract risk review",
        description:
            "Paste an NDA, MSA, SOW, or SaaS terms and get a first-pass risk screen. A deterministic 16-rule playbook runs on this site with no API key — it flags each risky clause with the exact quote, explains why it matters, and proposes a redline.",
        Component: ClauseGuardDemo,
        panelTitle: "What it checks for",
        bullets: [
            { name: "Liability & indemnity", desc: "uncapped liability, broad hold-harmless" },
            { name: "IP & restrictions", desc: "over-broad IP assignment, non-compete, non-solicit" },
            { name: "Payment & term", desc: "Net-90, auto-renewal, unilateral changes" },
            { name: "Missing protections", desc: "flags a liability cap that isn’t there" },
        ],
        evalTitle: "How it runs",
        evals: [
            { label: "Clause rules", value: "16 + absence checks" },
            { label: "Categories covered", value: "9" },
            { label: "API key required", value: "none" },
        ],
        hint: "Load the risky freelance MSA, hit Review, and read the ranked findings with suggested redlines.",
    },
    {
        id: "finscope",
        label: "FinScope",
        title: "FinScope — portfolio X-ray (educational)",
        description:
            "Pick a sample portfolio and run an X-ray across six health dimensions. Deterministic analysers do the math; a hard compliance gate guarantees the output never says buy, sell, or switch — every flag ends with a question for a SEBI-registered advisor.",
        Component: FinScopeDemo,
        panelTitle: "What it scores",
        bullets: [
            { name: "Allocation & concentration", desc: "equity drift vs age, single-instrument risk" },
            { name: "Overlap & expense", desc: "fund holdings overlap, above-median cost drag" },
            { name: "Tax & emergency fund", desc: "STCG/LTCG flags, liquidity cushion" },
            { name: "Compliance gate", desc: "blocks any buy/sell/switch language" },
        ],
        evalTitle: "How it runs",
        evals: [
            { label: "Health dimensions", value: "6" },
            { label: "Compliance violations", value: "0" },
            { label: "Investment advice", value: "never" },
        ],
        hint: "Run the full sample portfolio, then change the age — watch the allocation flag move with it.",
    },
    {
        id: "mcpguard",
        label: "MCPGuard",
        title: "MCPGuard — MCP manifest security scanner",
        description:
            "Paste an MCP manifest (JSON) and scan it for the ways a third-party tool can attack an agent. Six deterministic check families run with zero network and no LLM, grade the manifest A–F, and return the exact evidence that tripped each rule.",
        Component: MCPGuardDemo,
        panelTitle: "What it scans for",
        bullets: [
            { name: "Prompt injection", desc: "instructions, hidden Unicode, base64 payloads in descriptions" },
            { name: "Tool poisoning", desc: "exfiltration & cross-tool hijack directives" },
            { name: "Over-permissioning", desc: "shell/curl-pipe-bash, rm -rf, broad scopes" },
            { name: "Secrets & wildcards", desc: "leaked keys, ** globs, unauthenticated dangerous tools" },
        ],
        evalTitle: "How it runs",
        evals: [
            { label: "Threat check families", value: "6" },
            { label: "Eval recall", value: "100%" },
            { label: "Network calls", value: "zero" },
        ],
        hint: "Load the malicious manifest sample and scan it — note the critical findings and the A–F grade.",
    },
];

export default function AgentLab() {
    const [activeId, setActiveId] = useState(AGENTS[0].id);
    const active = AGENTS.find((a) => a.id === activeId) ?? AGENTS[0];
    const Demo = active.Component;

    return (
        <section className="agent-live" id="try">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Agent Lab — try them live</h2>
                    <p className="section-description">
                        Four working agents, running right here on this site. Each one is deterministic and runs with no
                        API key or cloud LLM, so the demos are reproducible — and each is gated by its own eval suite.
                        Pick one and put it to work.
                    </p>
                </div>

                <div className="agentlab-tabs" role="tablist" aria-label="Live agents">
                    {AGENTS.map((a) => (
                        <button
                            key={a.id}
                            type="button"
                            role="tab"
                            aria-selected={a.id === activeId}
                            className={`agentlab-tab${a.id === activeId ? " agentlab-tab--active" : ""}`}
                            onClick={() => setActiveId(a.id)}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>

                <div className="agent-live-grid">
                    <div className="agentlab-active">
                        <div className="agentlab-active-head">
                            <h3 className="agentlab-active-title">{active.title}</h3>
                            <p className="agentlab-active-desc">{active.description}</p>
                        </div>
                        <Demo />
                    </div>

                    <aside className="agent-live-side">
                        <div className="agent-live-panel">
                            <h3 className="agent-live-panel-title">{active.panelTitle}</h3>
                            <ul className="agent-tool-list">
                                {active.bullets.map((b) => (
                                    <li key={b.name}>
                                        {b.mono ? <code>{b.name}</code> : <strong>{b.name}</strong>}
                                        <span>{b.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="agent-live-panel">
                            <h3 className="agent-live-panel-title">{active.evalTitle}</h3>
                            <dl className="agent-eval">
                                {active.evals.map((e) => (
                                    <div key={e.label}>
                                        <dt>{e.label}</dt>
                                        <dd>{e.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="agent-live-hint">{active.hint}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
