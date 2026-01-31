export default function Hero() {
    return (
        <section
            id="hero"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "var(--space-12) var(--space-6)",
            }}
        >
            <div style={{ maxWidth: "800px" }}>
                <h1 style={{ marginBottom: "var(--space-6)" }}>
                    Backend Systems That Scale
                </h1>
                <p
                    style={{
                        fontSize: "1.25rem",
                        lineHeight: "1.7",
                        marginBottom: "var(--space-8)",
                        color: "var(--text-secondary)",
                    }}
                >
                    I help startups and engineering teams fix slow APIs, eliminate Kafka
                    bottlenecks, and design event-driven architectures that don&apos;t break at
                    10x traffic.
                </p>
                <p
                    style={{
                        fontSize: "1rem",
                        marginBottom: "var(--space-8)",
                        color: "var(--text-muted)",
                    }}
                >
                    10+ years building high-scale distributed systems with{" "}
                    <span className="mono" style={{ color: "var(--text-secondary)" }}>
                        Spring Boot
                    </span>
                    ,{" "}
                    <span className="mono" style={{ color: "var(--text-secondary)" }}>
                        Kafka
                    </span>
                    ,{" "}
                    <span className="mono" style={{ color: "var(--text-secondary)" }}>
                        Redis
                    </span>
                    , and cloud-native infrastructure.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <a href="mailto:hello@backendscale.dev" className="btn btn-primary">
                        Get in Touch
                    </a>
                    <a href="#services" className="btn btn-secondary">
                        View Services
                    </a>
                </div>
            </div>
        </section>
    );
}
