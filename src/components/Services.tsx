const services = [
    {
        title: "Backend Performance Audit",
        description:
            "A focused 1-week deep-dive into your backend. I analyze your APIs, database queries, caching strategy, and infrastructure. You get a prioritized action plan with specific recommendations.",
        highlight: "Fixed-price • 1-week delivery",
        featured: true,
    },
    {
        title: "Event-Driven Architecture Consulting",
        description:
            "Design or refactor your event-driven systems. Kafka topic design, consumer optimization, exactly-once semantics, and dead letter queue strategies.",
        highlight: "Project-based",
        featured: false,
    },
    {
        title: "AI Integration for Backends",
        description:
            "Add AI capabilities to your existing systems. RAG pipelines, vector databases, embeddings, and internal AI tools that actually integrate with your stack.",
        highlight: "Project-based",
        featured: false,
    },
    {
        title: "On-Demand Consulting",
        description:
            "Flexible access to senior backend expertise. Architecture reviews, code reviews, troubleshooting sessions, or ongoing advisory for your engineering team.",
        highlight: "Hourly or monthly retainer",
        featured: false,
    },
];

export default function Services() {
    return (
        <section id="services" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="container">
                <span className="section-label">Services</span>
                <h2>How I Can Help</h2>
                <p style={{ maxWidth: "600px", marginBottom: "var(--space-8)" }}>
                    Every engagement starts with understanding your specific challenges.
                    No cookie-cutter solutions.
                </p>
                <div className="grid grid-2">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                borderColor: service.featured
                                    ? "var(--accent)"
                                    : "var(--border)",
                                position: "relative",
                            }}
                        >
                            {service.featured && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "var(--space-4)",
                                        right: "var(--space-4)",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--accent)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                            <h3 style={{ color: "var(--text-primary)", paddingRight: "60px" }}>
                                {service.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    marginBottom: "var(--space-4)",
                                }}
                            >
                                {service.description}
                            </p>
                            <span
                                className="mono"
                                style={{
                                    fontSize: "0.8125rem",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {service.highlight}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
