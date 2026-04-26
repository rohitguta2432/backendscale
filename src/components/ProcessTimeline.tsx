import type { HomeDictionary } from "@/lib/i18n";

interface ProcessTimelineProps {
    dict: HomeDictionary;
}

const DEFAULT_PROCESS: NonNullable<HomeDictionary["process"]> = {
    eyebrow: "Process",
    heading: "How a 6-week MVP sprint works",
    subtitle: "Fixed scope. Daily Slack. First production commit by day 5.",
    weeks: [
        { label: "Week 1", title: "Discovery & architecture", items: ["Problem framing call", "Architecture doc", "Tech stack lock-in"] },
        { label: "Week 2", title: "Core backend & auth", items: ["Database schema", "Auth flow", "First production deploy on day 5"] },
        { label: "Week 3", title: "AI / data layer", items: ["LLM integration", "Vector store + retrieval", "Cost guardrails"] },
        { label: "Week 4", title: "Frontend & UX", items: ["UI flows", "Mobile responsive", "Analytics events"] },
        { label: "Week 5", title: "Hardening", items: ["Load tests", "Observability", "Security pass"] },
        { label: "Week 6", title: "Launch", items: ["Bug bash", "Public deploy", "Code handover + docs"] },
    ],
};

export default function ProcessTimeline({ dict }: ProcessTimelineProps) {
    const process = dict.process ?? DEFAULT_PROCESS;

    return (
        <section
            id="process"
            aria-labelledby="process-heading"
            className="process-section"
        >
            <div className="container">
                <div className="process-header">
                    <span className="process-eyebrow">{process.eyebrow}</span>
                    <h2 id="process-heading" className="process-heading">
                        {process.heading}
                    </h2>
                    <p className="process-subtitle">{process.subtitle}</p>
                </div>

                <ol className="process-timeline">
                    {process.weeks.map((week, i) => (
                        <li key={week.label} className="process-week">
                            <div className="process-week-marker">
                                <span className="process-week-num">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="process-week-body">
                                <span className="process-week-label">{week.label}</span>
                                <h3 className="process-week-title">{week.title}</h3>
                                <ul className="process-week-items">
                                    {week.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
