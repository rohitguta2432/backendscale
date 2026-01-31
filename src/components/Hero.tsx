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
                <span className="section-label">AI-Powered Solutions</span>

                <h1 style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
                    Building the Future with AI & Cutting-Edge Tech
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
                    I help businesses harness the power of Artificial Intelligence, Machine Learning,
                    and modern software engineering to build intelligent products that transform industries.
                </p>

                {/* Tech Badges */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.75rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "2.5rem",
                    }}
                >
                    <span className="badge">🤖 AI/ML</span>
                    <span className="badge">🧠 LLMs & GenAI</span>
                    <span className="badge">⚡ Full-Stack</span>
                    <span className="badge">☁️ Cloud-Native</span>
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
                    <a href="#contact" className="btn btn-primary">
                        Start Building
                    </a>
                    <a href="#services" className="btn btn-secondary">
                        Explore Services
                    </a>
                </div>
            </div>
        </section>
    );
}
