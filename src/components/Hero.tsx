import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <p className="hero-subtitle">Rohit Raj — Backend & AI Engineer</p>
                        <h1 className="hero-title">
                            Building AI Systems<br />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7em' }}>That Solve Real Problems</span>
                        </h1>

                        <div className="hero-approach" style={{
                            margin: '2rem 0',
                            padding: '1.5rem',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            textAlign: 'left'
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--text-muted)',
                                marginBottom: '1rem'
                            }}>
                                My Approach
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: '1.25rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8
                            }}>
                                <li><strong>Problem First</strong> — Identify the real user pain before writing code</li>
                                <li><strong>AI as a Tool</strong> — Use LLMs where they add value, not as a gimmick</li>
                                <li><strong>Production-Ready</strong> — Every project includes infra, testing, and deployment</li>
                                <li><strong>Open Engineering</strong> — Document decisions, trade-offs, and failures publicly</li>
                            </ul>
                        </div>

                        <div className="hero-actions">
                            <Link href="/projects" className="btn btn-primary">
                                View AI Projects
                            </Link>
                            <Link href="/notes" className="btn btn-secondary">
                                Engineering Notes
                            </Link>
                            <a
                                href="https://github.com/rohitguta2432"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>

                    <div style={{
                        flex: '0 0 320px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Image
                            src="/hero-graphic.png"
                            alt="AI and Backend Systems Architecture"
                            width={320}
                            height={320}
                            priority
                            style={{
                                borderRadius: '8px',
                                opacity: 0.9
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
