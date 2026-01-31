const problems = [
    {
        title: "Slow APIs",
        description:
            "Response times killing user experience? I identify bottlenecks in database queries, caching, and service calls.",
    },
    {
        title: "Kafka Consumer Lag",
        description:
            "Messages piling up faster than you can process? I optimize consumer groups, partitioning, and throughput.",
    },
    {
        title: "Redis Cache Inconsistency",
        description:
            "Stale data causing bugs? I design cache invalidation strategies that actually work.",
    },
    {
        title: "Event-Driven Failures",
        description:
            "Systems breaking under load? I architect resilient event flows with proper error handling and retry logic.",
    },
    {
        title: "AI Integration Confusion",
        description:
            "Not sure how to add AI to your existing backend? I help teams implement RAG, embeddings, and internal tools.",
    },
];

export default function Problems() {
    return (
        <section id="problems" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="container">
                <span className="section-label">Common Challenges</span>
                <h2>Problems I Solve</h2>
                <p style={{ maxWidth: "600px", marginBottom: "var(--space-8)" }}>
                    These are the issues I see engineering teams struggle with most. If
                    any sound familiar, I can help.
                </p>
                <div className="grid grid-3">
                    {problems.map((problem, index) => (
                        <div key={index} className="card">
                            <h3 style={{ color: "var(--text-primary)" }}>{problem.title}</h3>
                            <p style={{ fontSize: "0.9375rem", margin: 0 }}>
                                {problem.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
