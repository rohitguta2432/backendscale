const stats = [
    { value: "50+", label: "AI Projects Delivered" },
    { value: "10x", label: "Avg. Efficiency Gain" },
    { value: "98%", label: "Client Satisfaction" },
];

const results = [
    { metric: "3x", description: "Faster development with AI-assisted workflows" },
    { metric: "95%+", description: "Accuracy on custom ML models" },
    { metric: "$2M+", description: "Cost savings for enterprise clients" },
    { metric: "40%", description: "Revenue increase from AI features" },
];

export default function Credibility() {
    return (
        <section id="work" style={{ position: "relative" }}>
            <div className="divider" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <span className="section-label">Results</span>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>Proven Track Record</h2>
                    <p style={{ maxWidth: "550px", margin: "0 auto", fontSize: "1.125rem" }}>
                        Real results from real AI implementations across industries.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-3" style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="stat">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Results Grid */}
                <div id="about" className="grid grid-2" style={{ maxWidth: "900px", margin: "0 auto" }}>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1.5rem",
                                padding: "1.5rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "1.75rem",
                                    fontWeight: 800,
                                    background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    minWidth: "80px",
                                }}
                            >
                                {result.metric}
                            </span>
                            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", margin: 0 }}>
                                {result.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
