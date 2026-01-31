export default function Contact() {
    return (
        <section
            id="contact"
            style={{
                position: "relative",
                textAlign: "center",
            }}
        >
            <div className="divider" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <span className="section-label">Get Started</span>
                <h2 style={{ marginBottom: "0.5rem" }}>Ready to Build Something Great?</h2>
                <p style={{ marginBottom: "2.5rem", maxWidth: "500px", margin: "0 auto 2.5rem" }}>
                    Whether you have a specific problem or a new idea to explore,
                    let&apos;s have a conversation. No pressure — just honest advice.
                </p>

                {/* Contact Buttons */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                        marginBottom: "2rem",
                    }}
                >
                    <a
                        href="mailto:hello@rohitguta.dev"
                        className="btn btn-primary"
                        style={{ minWidth: "220px" }}
                    >
                        Email Me
                    </a>
                    <a
                        href="https://calendly.com/rohitguta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ minWidth: "220px" }}
                    >
                        Book a Call
                    </a>
                </div>

                {/* Alternative Contact */}
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                    }}
                >
                    Also available on{" "}
                    <a
                        href="https://www.linkedin.com/in/rohitraj2/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>{" "}
                    •{" "}
                    <a
                        href="https://github.com/rohitguta2432"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </p>
            </div>

            {/* Footer */}
            <footer
                style={{
                    marginTop: "5rem",
                    padding: "2rem 0",
                    borderTop: "1px solid var(--border)",
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 700,
                                fontSize: "1.125rem",
                                color: "var(--text-primary)",
                            }}
                        >
                            RohitGuta
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            © {new Date().getFullYear()} RohitGuta. All rights reserved.
                        </span>
                    </div>
                </div>
            </footer>
        </section>
    );
}
