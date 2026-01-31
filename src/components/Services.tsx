const services = [
    {
        title: "AI Product Development",
        description:
            "End-to-end development of AI-powered products. From concept to deployment — including LLM integration, custom ML models, and intelligent automation.",
        highlight: "Most popular",
        featured: true,
    },
    {
        title: "GenAI & LLM Solutions",
        description:
            "Build with ChatGPT, Claude, Gemini, and open-source models. Custom chatbots, RAG systems, AI agents, and content generation pipelines.",
        highlight: "Cutting-edge",
        featured: false,
    },
    {
        title: "Full-Stack Engineering",
        description:
            "Modern web and mobile applications with AI at the core. React, Next.js, Node.js, Python, and cloud-native infrastructure.",
        highlight: "Production-ready",
        featured: false,
    },
    {
        title: "AI Strategy Consulting",
        description:
            "Strategic guidance on AI adoption, technology selection, and implementation roadmaps. Make informed decisions that drive real business value.",
        highlight: "Advisory",
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
                    <span className="section-label">What I Build</span>
                    <h2>AI-Powered Services</h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto" }}>
                        Cutting-edge technology solutions that put AI at the center of your business
                        — from idea to production.
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
                                    {service.highlight}
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
