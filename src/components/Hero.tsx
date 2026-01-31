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

            <div style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
                <span className="section-label">Software Consultancy</span>

                <h1 style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
                    Building Digital Solutions That Scale
                </h1>

                <p
                    style={{
                        fontSize: "1.25rem",
                        lineHeight: "1.8",
                        marginBottom: "2.5rem",
                        color: "var(--text-secondary)",
                        maxWidth: "750px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    From greenfield projects to complex problem-solving — I help startups and
                    enterprises build, optimize, and scale their software systems with
                    confidence.
                </p>

                {/* Value Props */}
                <div
                    style={{
                        display: "flex",
                        gap: "2rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "2.5rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--success)", fontSize: "1.25rem" }}>✓</span>
                        Build from Scratch
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--success)", fontSize: "1.25rem" }}>✓</span>
                        Fix & Optimize
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--success)", fontSize: "1.25rem" }}>✓</span>
                        Scale & Grow
                    </div>
                </div>

                {/* CTAs */}
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <a href="mailto:hello@rohitguta.dev" className="btn btn-primary">
                        Start a Project
                    </a>
                    <a href="#services" className="btn btn-secondary">
                        View Services
                    </a>
                </div>
            </div>
        </section>
    );
}
