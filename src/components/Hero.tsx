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
                padding: "8rem 1.5rem 6rem",
                position: "relative",
            }}
        >
            {/* Background effects */}
            <div className="grid-pattern" />
            <div className="gradient-orb orb-1" />

            <div style={{ maxWidth: "950px", position: "relative", zIndex: 1 }}>
                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "9999px",
                        marginBottom: "1.5rem",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    <span style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", animation: "pulse 2s infinite" }} />
                    Available for new projects
                </div>

                <h1 style={{ marginBottom: "1.5rem", fontSize: "clamp(2.75rem, 7vw, 4.5rem)", letterSpacing: "-0.03em" }}>
                    Transform Your Business with{" "}
                    <span style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        AI Innovation
                    </span>
                </h1>

                <p
                    style={{
                        fontSize: "1.25rem",
                        lineHeight: "1.8",
                        color: "var(--text-secondary)",
                        maxWidth: "700px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    We build intelligent AI products, integrate cutting-edge LLMs, and engineer
                    scalable systems that give your business an unfair advantage.
                </p>

                {/* Tech Pills */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "2.5rem",
                    }}
                >
                    {["GPT-4 & Claude", "Custom ML Models", "RAG Systems", "AI Agents", "Full-Stack Dev"].map((tech) => (
                        <span key={tech} className="badge" style={{ fontSize: "0.8125rem", padding: "0.375rem 0.875rem" }}>
                            {tech}
                        </span>
                    ))}
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a href="#contact" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                        Start Your Project →
                    </a>
                    <a href="#services" className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
                        View Services
                    </a>
                </div>

                {/* Trust indicators */}
                <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Trusted by innovative companies
                    </p>
                    <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", opacity: 0.6 }}>
                        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-muted)" }}>TechCorp</span>
                        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-muted)" }}>Finova</span>
                        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-muted)" }}>DataFlow</span>
                        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-muted)" }}>AIStack</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
