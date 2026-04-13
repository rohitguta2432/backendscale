"use client";

import { testimonials } from '@/data/testimonials';

interface TestimonialsProps {
    limit?: number;
}

export default function Testimonials({ limit }: TestimonialsProps) {
    const items = limit ? testimonials.slice(0, limit) : testimonials;

    return (
        <section
            aria-labelledby="testimonials-heading"
            style={{
                padding: "4rem 1rem",
                maxWidth: "1100px",
                margin: "0 auto",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <span
                    style={{
                        color: "var(--accent)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    Testimonials
                </span>
                <h2
                    id="testimonials-heading"
                    style={{
                        color: "var(--text-primary)",
                        fontSize: "2rem",
                        fontWeight: 700,
                        marginTop: "0.5rem",
                    }}
                >
                    What Clients Say
                </h2>
            </div>

            <div
                className="testimonials-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${items.length > 2 ? 3 : items.length}, 1fr)`,
                    gap: "1.5rem",
                }}
            >
                {items.map((t, i) => (
                    <article
                        key={i}
                        style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.75rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <div
                            style={{
                                color: "var(--accent)",
                                fontSize: "1.5rem",
                                lineHeight: 1,
                            }}
                        >
                            &#8220;
                        </div>
                        <p
                            style={{
                                color: "var(--text-secondary)",
                                lineHeight: 1.7,
                                fontSize: "0.95rem",
                                margin: 0,
                                flex: 1,
                            }}
                        >
                            {t.text}
                        </p>
                        <div
                            style={{
                                borderTop: "1px solid var(--border)",
                                paddingTop: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    color: "var(--text-primary)",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }}
                            >
                                {t.name}
                            </div>
                            <div
                                style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "0.8rem",
                                    marginTop: "0.15rem",
                                }}
                            >
                                {t.role}
                            </div>
                            <span
                                style={{
                                    display: "inline-block",
                                    marginTop: "0.5rem",
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    padding: "0.2rem 0.5rem",
                                    fontSize: "0.75rem",
                                    color: "var(--accent)",
                                }}
                            >
                                {t.project}
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .testimonials-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
