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
            className="px-4 py-20 max-w-[1100px] mx-auto"
        >
            <div className="text-center mb-12">
                <span
                    className="text-[var(--accent)] text-sm font-semibold uppercase tracking-[0.05em]"
                >
                    Testimonials
                </span>
                <h2
                    id="testimonials-heading"
                    className="text-[var(--text-primary)] text-3xl font-bold mt-2"
                >
                    What Clients Say
                </h2>
            </div>

            <div
                className="testimonials-grid grid gap-6"
                style={{
                    gridTemplateColumns: `repeat(${items.length > 2 ? 3 : items.length}, 1fr)`,
                }}
            >
                {items.map((t, i) => (
                    <article
                        key={i}
                        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-7 flex flex-col gap-4"
                    >
                        <div
                            className="text-[var(--accent)] text-2xl leading-none"
                        >
                            &#8220;
                        </div>
                        <p
                            className="text-[var(--text-secondary)] leading-[1.7] text-[0.95rem] m-0 flex-1"
                        >
                            {t.text}
                        </p>
                        <div
                            className="border-t border-[var(--border)] pt-4"
                        >
                            <div
                                className="text-[var(--text-primary)] font-semibold text-[0.9rem]"
                            >
                                {t.name}
                            </div>
                            <div
                                className="text-[var(--text-secondary)] text-[0.8rem] mt-0.5"
                            >
                                {t.role}
                            </div>
                            <span
                                className="inline-block mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md py-0.5 px-2 text-xs text-[var(--accent)]"
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
