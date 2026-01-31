const stats = [
    { value: "10+", label: "Years in Tech" },
    { value: "50+", label: "AI Projects" },
    { value: "100M+", label: "Users Impacted" },
];

const casePoints = [
    "Built AI-powered SaaS platforms processing millions of requests daily",
    "Integrated LLMs into production systems serving Fortune 500 companies",
    "Developed custom ML models achieving 95%+ accuracy on complex tasks",
    "Architected cloud-native solutions handling 10x traffic spikes",
    "Reduced development time by 60% using AI-assisted workflows",
    "Led AI transformation initiatives increasing revenue by 40%",
];

export default function Credibility() {
    return (
        <section id="work" style={{ position: "relative" }}>
            <div className="divider" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-label">Track Record</span>
                    <h2>Proven AI Expertise</h2>
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
                        AI & Engineering Achievements
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
