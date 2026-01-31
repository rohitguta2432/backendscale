const services = [
    {
        icon: "🤖",
        title: "AI Product Development",
        description: "End-to-end AI products from concept to production. LLM integration, custom models, intelligent automation.",
        tags: ["GPT-4", "Claude", "Custom ML"],
        featured: true,
    },
    {
        icon: "🧠",
        title: "GenAI & LLM Solutions",
        description: "Production-ready chatbots, RAG pipelines, AI agents, and content generation systems.",
        tags: ["RAG", "Agents", "Embeddings"],
        featured: false,
    },
    {
        icon: "⚡",
        title: "Full-Stack Engineering",
        description: "Modern web & mobile apps with AI at the core. React, Next.js, Python, cloud-native infrastructure.",
        tags: ["React", "Node.js", "Python"],
        featured: false,
    },
    {
        icon: "📊",
        title: "AI Strategy & Consulting",
        description: "Strategic guidance on AI adoption, technology selection, and implementation roadmaps.",
        tags: ["Strategy", "Roadmap", "Advisory"],
        featured: false,
    },
];

export default function Services() {
    return (
        <section id="services" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-3" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <span className="section-label">Services</span>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>What We Build</h2>
                    <p style={{ maxWidth: "550px", margin: "0 auto", fontSize: "1.125rem" }}>
                        Cutting-edge AI solutions that transform ideas into production-ready products.
                    </p>
                </div>

                <div className="grid grid-2">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`card ${service.featured ? "featured" : ""}`}
                            style={{ padding: "2rem" }}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                                <span style={{ fontSize: "2rem" }}>{service.icon}</span>
                                <div>
                                    <h3 style={{ color: "var(--text-primary)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                                        {service.title}
                                    </h3>
                                    {service.featured && (
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.25rem 0.5rem", background: "rgba(59, 130, 246, 0.15)", borderRadius: "4px" }}>
                                            Most Popular
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p style={{ fontSize: "0.9375rem", marginBottom: "1.5rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                                {service.description}
                            </p>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {service.tags.map((tag) => (
                                    <span key={tag} style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-muted)" }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
