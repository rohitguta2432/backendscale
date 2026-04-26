import type { HomeDictionary } from "@/lib/i18n";

interface FAQProps {
    dict: HomeDictionary;
}

const DEFAULT_FAQ: NonNullable<HomeDictionary["faq"]> = {
    eyebrow: "FAQ",
    heading: "Common questions before we start",
    items: [
        { q: "What if 6 weeks slips?", a: "Fixed scope means we descope features, not extend timeline." },
        { q: "Who owns the code?", a: "You. Full repo handover on week 6." },
        { q: "Am I locked into your tech stack?", a: "No. I'll ship in your stack if your team has one." },
        { q: "Refund policy?", a: "50% back if we miss the week-3 production deploy milestone." },
    ],
};

export default function FAQ({ dict }: FAQProps) {
    const faq = dict.faq ?? DEFAULT_FAQ;

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="faq-section"
        >
            <div className="container">
                <div className="faq-header">
                    <span className="faq-eyebrow">{faq.eyebrow}</span>
                    <h2 id="faq-heading" className="faq-heading">
                        {faq.heading}
                    </h2>
                </div>

                <div className="faq-list">
                    {faq.items.map((item) => (
                        <details key={item.q} className="faq-item">
                            <summary className="faq-question">
                                <span>{item.q}</span>
                                <svg className="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </summary>
                            <div className="faq-answer">
                                <p>{item.a}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
