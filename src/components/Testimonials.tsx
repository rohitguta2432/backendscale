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
            className="testimonials-section"
        >
            <div className="container">
                <div className="testimonials-header">
                    <span className="testimonials-eyebrow">Testimonials</span>
                    <h2 id="testimonials-heading" className="testimonials-heading">
                        What Clients Say
                    </h2>
                </div>

                <div className="testimonials-grid">
                    {items.map((t, i) => (
                        <article key={i} className="testimonial-card">
                            <blockquote className="testimonial-quote">
                                <p>{t.text}</p>
                            </blockquote>
                            <div className="testimonial-author">
                                <div className="testimonial-name">{t.name}</div>
                                <div className="testimonial-role">{t.role}</div>
                                <span className="testimonial-project">{t.project}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
