const services = [
    {
        title: "Full Product Development",
        description:
            "End-to-end development of web and mobile applications. From initial concept through architecture, development, and deployment.",
        highlight: "Complete solution",
        featured: true,
    },
    {
        title: "Technical Consulting",
        description:
            "Strategic advice on architecture decisions, technology choices, and best practices. Code reviews and team mentoring.",
        highlight: "Hourly or retainer",
        featured: false,
    },
    {
        title: "System Optimization",
        description:
            "Performance audits, bottleneck identification, and optimization. Make your existing systems faster and more efficient.",
        highlight: "Fixed-price audit",
        featured: false,
    },
    {
        title: "AI & Automation",
        description:
            "Integrate AI capabilities into your products. Automation workflows, intelligent features, and data-driven solutions.",
        highlight: "Project-based",
        featured: false,
    },
];

export default function Services() {
    return (
        <section id="services" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-3" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-label">Services</span>
                    <h2>What I Offer</h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto" }}>
                        Flexible engagement models to match your needs — from one-time projects
                        to ongoing partnerships.
                    </p>
                </div>

                <div className="grid grid-2">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`card ${service.featured ? "featured" : ""}`}
                        >
                            {service.featured && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "1rem",
                                        right: "1rem",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        color: "var(--accent)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        padding: "0.25rem 0.75rem",
                                        background: "rgba(59, 130, 246, 0.15)",
                                        borderRadius: "9999px",
                                    }}
                                >
                                    Most Popular
                                </span>
                            )}
                            <h3
                                style={{
                                    color: "var(--text-primary)",
                                    paddingRight: service.featured ? "100px" : "0",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {service.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    marginBottom: "1rem",
                                    lineHeight: 1.6,
                                }}
                            >
                                {service.description}
                            </p>
                            <span
                                className="mono"
                                style={{
                                    fontSize: "0.8125rem",
                                    color: "var(--accent)",
                                    fontWeight: 500,
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
