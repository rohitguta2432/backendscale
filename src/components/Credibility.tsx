const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Systems Architected" },
    { value: "100M+", label: "Daily Events Processed" },
];

const casePoints = [
    "Reduced API latency by 85% for a fintech processing millions of daily transactions",
    "Redesigned Kafka architecture handling 10x traffic spike during product launch",
    "Implemented Redis caching strategy that cut database load by 70%",
    "Migrated monolith to event-driven microservices with zero downtime",
    "Built RAG system for internal knowledge base serving 500+ employees",
    "Optimized Spring Boot services reducing cloud costs by 40%",
];

export default function Credibility() {
    return (
        <section id="credibility" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="container">
                <span className="section-label">Track Record</span>
                <h2>Proof of Work</h2>

                {/* Stats Row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "var(--space-4)",
                        marginBottom: "var(--space-12)",
                        paddingTop: "var(--space-4)",
                    }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="stat">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Case Points */}
                <div style={{ maxWidth: "800px" }}>
                    <h3
                        style={{
                            fontSize: "1rem",
                            color: "var(--text-muted)",
                            marginBottom: "var(--space-4)",
                            fontWeight: 500,
                        }}
                    >
                        Selected Results
                    </h3>
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-3)",
                        }}
                    >
                        {casePoints.map((point, index) => (
                            <li
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "var(--space-3)",
                                    color: "var(--text-secondary)",
                                    fontSize: "0.9375rem",
                                    lineHeight: 1.6,
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--success)",
                                        fontSize: "1rem",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    ✓
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
