import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Agents from "@/components/Agents";
import DispatchrDemo from "@/components/DispatchrDemo";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

const TITLE = "AI Agent Host — Autonomous Agents for Billion-Dollar Markets";
const DESCRIPTION =
    "Live, autonomous AI agents built by Rohit Raj. Try Dispatchr — an AI home-services dispatcher that quotes and books on its own — running right here in your browser. Plus an autonomous startup operator and a generative-engine-optimization engine.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    return createPageMetadata(TITLE, DESCRIPTION, "/agents", locale);
}

const TOOLS = [
    { name: "get_price_estimate", desc: "quotes only from a real price book" },
    { name: "find_available_slots", desc: "offers genuine open technician slots" },
    { name: "book_job", desc: "books the appointment end-to-end" },
    { name: "escalate_to_human", desc: "hands off on any safety emergency" },
];

export default async function AgentsPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <span className="agent-host-eyebrow">AI Agent Host</span>
                        <h1 className="page-title">Autonomous agents that finish the job</h1>
                        <p className="page-description">
                            I don&apos;t just talk about AI agents — I build and run them. These are autonomous systems that
                            decide, call tools, and complete real work on their own, each aimed at a billion-dollar market.
                            One of them is live below: talk to it.
                        </p>
                    </div>
                </div>

                <section className="agent-live" id="try">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Live agent — Dispatchr</h2>
                            <p className="section-description">
                                A working AI dispatcher for a home-services company, running on this site. No API key, no
                                cloud LLM — a deterministic policy drives the exact same tool-calling loop a production model
                                would, so the demo is reproducible and the booking actually happens. Swap in any
                                OpenAI-compatible model and the loop is unchanged.
                            </p>
                        </div>

                        <div className="agent-live-grid">
                            <DispatchrDemo />

                            <aside className="agent-live-side">
                                <div className="agent-live-panel">
                                    <h3 className="agent-live-panel-title">What it can do on its own</h3>
                                    <ul className="agent-tool-list">
                                        {TOOLS.map((t) => (
                                            <li key={t.name}>
                                                <code>{t.name}</code>
                                                <span>{t.desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="agent-live-panel">
                                    <h3 className="agent-live-panel-title">Quality gate</h3>
                                    <dl className="agent-eval">
                                        <div><dt>Eval cases passed</dt><dd>26 / 26</dd></div>
                                        <div><dt>Emergency-escalation recall</dt><dd>100%</dd></div>
                                        <div><dt>Over-escalation rate</dt><dd>0%</dd></div>
                                        <div><dt>Price integrity</dt><dd>100%</dd></div>
                                    </dl>
                                    <p className="agent-live-hint">
                                        Try: a normal repair, then a safety line like &ldquo;I smell gas&rdquo; — watch it
                                        refuse to quote and escalate instead.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <Agents locale={locale as Locale} variant="full" />
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
