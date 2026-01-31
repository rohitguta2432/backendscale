const caseStudies = [
    {
        title: "Event-Driven Pipeline at Scale",
        problem: "Message queue consumer lag exceeded 2 million messages during peak hours. Downstream systems failed to process events within SLA, causing data staleness and customer-facing delays.",
        approach: "Refactored monolithic consumers into horizontally scalable microservices with back-pressure handling. Implemented partition-aware processing and dead-letter queues for reliable recovery.",
        techStack: ["Node.js", "Kafka", "Redis", "MongoDB", "AWS EKS"],
        outcome: "Throughput increased 12×. Consumer lag reduced to under 1,000 messages. Zero message loss achieved during 3-month observation period.",
    },
    {
        title: "API Latency Optimization",
        problem: "REST APIs averaged 800ms response times under moderate load. Database queries dominated CPU cycles, and infrastructure costs scaled linearly with traffic.",
        approach: "Introduced multi-tier caching with Redis for hot paths. Rewrote N+1 query patterns, added read replicas, and implemented connection pooling with PgBouncer.",
        techStack: ["Python", "FastAPI", "Redis", "PostgreSQL", "GCP Cloud Run"],
        outcome: "P95 latency dropped from 1.2s to 90ms. Database load reduced by 70%. Monthly infrastructure spend decreased by 40%.",
    },
    {
        title: "AI-Ready Backend Architecture",
        problem: "Legacy synchronous backend couldn't support new LLM integration requirements. Tight coupling between domains made feature velocity unpredictable.",
        approach: "Decomposed monolith into bounded contexts with async communication. Established clean API boundaries and implemented event sourcing for AI model training data capture.",
        techStack: ["Go", "gRPC", "RabbitMQ", "PostgreSQL", "Azure AKS"],
        outcome: "LLM features shipped in 6 weeks vs. estimated 6 months. New feature deployment cadence improved from monthly to weekly.",
    },
];

export default function CaseStudies() {
    return (
        <section id="work" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-2" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <span className="section-label">Case Studies</span>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>Work That Ships</h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.125rem" }}>
                        Backend engineering for startups and scale-ups. Anonymized to protect client confidentiality.
                    </p>
                </div>

                <div className="grid grid-3">
                    {caseStudies.map((study, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
                        >
                            {/* Title */}
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginBottom: 0 }}>
                                {study.title}
                            </h3>

                            {/* Problem */}
                            <div>
                                <span style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}>
                                    Problem
                                </span>
                                <p style={{ fontSize: "0.9rem", marginTop: "0.375rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                                    {study.problem}
                                </p>
                            </div>

                            {/* Approach */}
                            <div>
                                <span style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}>
                                    Approach
                                </span>
                                <p style={{ fontSize: "0.9rem", marginTop: "0.375rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                                    {study.approach}
                                </p>
                            </div>

                            {/* Outcome */}
                            <div style={{
                                padding: "1rem",
                                background: "rgba(34, 197, 94, 0.08)",
                                border: "1px solid rgba(34, 197, 94, 0.2)",
                                borderRadius: "8px",
                            }}>
                                <span style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    color: "var(--success)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}>
                                    Outcome
                                </span>
                                <p style={{ fontSize: "0.9rem", marginTop: "0.375rem", lineHeight: 1.6, color: "var(--text-primary)", fontWeight: 500 }}>
                                    {study.outcome}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {study.techStack.map((tech) => (
                                        <span key={tech} style={{
                                            fontSize: "0.75rem",
                                            padding: "0.25rem 0.625rem",
                                            background: "var(--surface-hover)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "4px",
                                            color: "var(--text-muted)",
                                            fontFamily: "var(--font-mono)",
                                        }}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
                    <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                        Need similar results?
                    </p>
                    <a
                        href="#contact"
                        className="btn btn-primary"
                        style={{ fontSize: "1rem" }}
                    >
                        Book a Free 30-Minute Backend Review
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
