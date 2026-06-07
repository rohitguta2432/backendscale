import Link from "next/link";
import { agents, type AgentShowcase } from "@/data/agents";
import type { Locale } from "@/lib/i18n";

const GithubIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
);

function AgentCard({ agent, index, locale, variant }: { agent: AgentShowcase; index: number; locale: Locale; variant: "teaser" | "full" }) {
    const demoHref = variant === "full" ? "#try" : `/${locale}/agents#try`;
    return (
        <article className="ai-project-card agent-card group">
            <div className="ai-project-number">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="ai-project-number-line" />
            </div>

            <div className="ai-project-body">
                <div className="ai-project-header">
                    <h3 className="ai-project-title">{agent.name}</h3>
                    <div className="ai-project-meta">
                        <span className={`ai-project-status ai-project-status--${agent.status}`}>{agent.status}</span>
                        {agent.demo && (
                            <Link href={demoHref} className="ai-project-live agent-demo-link">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                Try it live
                            </Link>
                        )}
                        {agent.liveUrl && (
                            <a href={agent.liveUrl} target="_blank" rel="noopener noreferrer" className="ai-project-live">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                Live
                            </a>
                        )}
                        {agent.repoUrl && (
                            <a href={agent.repoUrl} target="_blank" rel="noopener noreferrer" className="ai-project-repo">
                                <GithubIcon /> Source
                            </a>
                        )}
                    </div>
                </div>

                <div className="agent-market">
                    <span className="agent-market-label">Billion-dollar market</span>
                    <span className="agent-market-name">{agent.market}</span>
                    <span className="agent-market-size">{agent.marketSize}</span>
                </div>

                <div className="ai-project-content">
                    <div className="ai-project-text">
                        <div className="ai-project-section">
                            <h4 className="ai-project-label ai-project-label--problem">Problem</h4>
                            <p>{agent.problem}</p>
                        </div>
                        <div className="ai-project-section">
                            <h4 className="ai-project-label ai-project-label--solution">What the agent does</h4>
                            <p>{agent.solution}</p>
                        </div>
                    </div>
                </div>

                <div className="ai-project-approach">
                    <h4 className="ai-project-label ai-project-label--ai">Autonomy</h4>
                    <p>{agent.autonomy}</p>
                </div>

                {agent.metrics && agent.metrics.length > 0 && (
                    <dl className="ai-project-metrics" aria-label="Agent metrics">
                        {agent.metrics.map((m) => (
                            <div key={m.label} className="ai-project-metric">
                                <dt className="ai-project-metric-label">{m.label}</dt>
                                <dd className="ai-project-metric-value">{m.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <div className="ai-project-tech">
                    {agent.techStack.map((tech) => (
                        <span key={tech} className="ai-project-chip">{tech}</span>
                    ))}
                </div>
            </div>
        </article>
    );
}

interface AgentsProps {
    locale: Locale;
    variant?: "teaser" | "full";
}

export default function Agents({ locale, variant = "teaser" }: AgentsProps) {
    return (
        <section id="agents" className="ai-projects-section">
            <div className="container">
                <div className="ai-projects-header">
                    <span className="ai-projects-eyebrow">AI Agent Host</span>
                    <h2 className="ai-projects-heading">Autonomous agents, aimed at billion-dollar markets</h2>
                    <p className="ai-projects-subheading">
                        Not chatbots — agents that decide, call tools, and finish a job on their own. One of them runs live on this page.
                    </p>
                </div>

                <div className="ai-projects-list">
                    {agents.map((agent, i) => (
                        <AgentCard key={agent.slug} agent={agent} index={i} locale={locale} variant={variant} />
                    ))}
                </div>

                {variant === "teaser" && (
                    <div className="ai-projects-footer">
                        <Link href={`/${locale}/agents`} className="btn btn-primary">
                            Open the Agent Host — try a live agent →
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
