import Link from "next/link";
import type { HomeDictionary, Locale } from "@/lib/i18n";

interface HireBlockProps {
    dict: HomeDictionary;
    locale: Locale;
}

const FALLBACK: NonNullable<HomeDictionary["hire"]> = {
    eyebrow: "Founding Engineer for Hire",
    heading: "A founding engineer for hire in India — without the cost of a team.",
    intro:
        "Most early-stage founders need one senior engineer who can ship the whole stack: AI, backend, mobile, infra, and the awkward integrations in between. That is exactly the gap a founding engineer for hire in India closes — at 30–40% of the cost of a US contractor and with daily timezone overlap on Slack or WhatsApp.",
    points: [
        "Senior full-stack + AI engineer, based in Pune, India — shipping to startups worldwide.",
        "End-to-end ownership: backend, frontend, mobile, infra, observability, deployment.",
        "Production AI MVP live in 6 weeks; first commit pushed to your GitHub on day 5.",
        "You own the code, the IP, and the repo from week 1 — MIT or commercial license.",
    ],
    cta: "Book a free 30-min call",
};

export default function HireBlock({ dict, locale }: HireBlockProps) {
    const hire = dict.hire ?? FALLBACK;

    return (
        <section
            className="reliability-section"
            aria-labelledby="hire-heading"
            id="founding-engineer-for-hire"
        >
            <div className="container">
                <div className="reliability-header">
                    <span className="reliability-label">{hire.eyebrow}</span>
                    <h2 id="hire-heading" className="reliability-heading">
                        {hire.heading}
                    </h2>
                </div>

                <div style={{ maxWidth: 720, textAlign: "left" }}>
                    <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: 24 }}>
                        {hire.intro}
                    </p>
                    <ul style={{ textAlign: "left", display: "block", padding: 0, listStyle: "none", margin: "0 0 32px" }}>
                        {hire.points.map((point) => (
                            <li
                                key={point}
                                style={{
                                    padding: "8px 0 8px 28px",
                                    position: "relative",
                                    fontSize: 16,
                                    lineHeight: 1.55,
                                    color: "var(--text-primary)",
                                }}
                            >
                                <span style={{ position: "absolute", left: 0, color: "var(--accent)", fontWeight: 700 }}>→</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <Link href={`/${locale}/contact`} className="btn btn-primary">
                            {hire.cta}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
