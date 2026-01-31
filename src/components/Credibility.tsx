const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Projects Delivered" },
    { value: "100%", label: "Client Satisfaction" },
];

const casePoints = [
    "Built complete SaaS platforms from zero to production for multiple startups",
    "Reduced system latency by 85% for a fintech handling millions of transactions",
    "Migrated legacy monoliths to modern microservices with zero downtime",
    "Implemented AI-powered features that increased user engagement by 3x",
    "Optimized cloud infrastructure reducing operational costs by 40%",
    "Led technical teams and mentored junior developers to senior level",
];

export default function Credibility() {
    return (
        <section id="work" style={{ position: "relative" }}>
            <div className="divider" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-label">Track Record</span>
                    <h2>Proven Results</h2>
                </div>

                {/* Stats Row */}
                <div
                    className="grid grid-3"
                    style={{ maxWidth: "700px", margin: "0 auto 4rem" }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="stat">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Case Points */}
                <div
                    id="about"
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        padding: "2rem",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1rem",
                            color: "var(--text-muted)",
                            marginBottom: "1.5rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Selected Achievements
                    </h3>
                    <ul className="result-list">
                        {casePoints.map((point, index) => (
                            <li key={index}>
                                <span className="check">✓</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
