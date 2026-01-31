export default function Contact() {
    return (
        <section
            id="contact"
            style={{
                borderTop: "1px solid var(--border)",
                textAlign: "center",
            }}
        >
            <div className="container" style={{ maxWidth: "600px" }}>
                <span className="section-label">Get Started</span>
                <h2>Let&apos;s Talk</h2>
                <p style={{ marginBottom: "var(--space-8)" }}>
                    Whether you have a specific problem or want to discuss your backend
                    architecture, I&apos;m here to help. No sales pitch—just a
                    straightforward conversation.
                </p>

                {/* Contact Methods */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-4)",
                        alignItems: "center",
                        marginBottom: "var(--space-8)",
                    }}
                >
                    <a
                        href="mailto:hello@backendscale.dev"
                        className="btn btn-primary"
                        style={{ minWidth: "240px" }}
                    >
                        hello@backendscale.dev
                    </a>
                    <a
                        href="https://calendly.com/backendscale"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ minWidth: "240px" }}
                    >
                        Book a Call
                    </a>
                </div>

                {/* Alternative Contact */}
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        marginBottom: "var(--space-16)",
                    }}
                >
                    Or reach me on{" "}
                    <a
                        href="https://linkedin.com/in/backendscale"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>{" "}
                    •{" "}
                    <a href="tel:+1234567890" style={{ color: "var(--text-muted)" }}>
                        +1 (234) 567-890
                    </a>
                </p>
            </div>

            {/* Footer */}
            <footer
                style={{
                    borderTop: "1px solid var(--border)",
                    padding: "var(--space-6) 0",
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                }}
            >
                <div className="container">
                    © {new Date().getFullYear()} BackendScale. All rights reserved.
                </div>
            </footer>
        </section>
    );
}
