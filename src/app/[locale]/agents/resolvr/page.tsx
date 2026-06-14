import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import {
    createPageMetadata,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateTechArticleSchema,
    SITE_CONFIG,
} from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "hi" }, { locale: "fr" }, { locale: "de" }, { locale: "ar" }];
}

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = "/agents/resolvr";
const DATE_PUBLISHED = "2026-06-14";
const DATE_MODIFIED = "2026-06-14";
const REPO_URL = "https://github.com/rohitguta2432/resolvr";
const SCREENSHOT = "/agents/resolvr.png";

const SEO_TITLE = "Self-Hosted AI Customer Support Agent (Ollama) | Resolvr";
const SEO_DESCRIPTION =
    "Resolvr is an open-source, self-hosted AI customer support agent on local Ollama. It classifies tickets, RAG-answers from your KB, and escalates behind a safety gate — zero per-token cost.";
const SEO_KEYWORDS = [
    "self-hosted AI customer support agent",
    "open source AI customer support agent",
    "Ollama customer support agent",
    "AI support agent that runs locally",
    "local LLM customer support agent",
    "privacy-first AI customer support",
    "open source Intercom Fin alternative self-hosted",
    "AI customer support no per-ticket cost",
    "GDPR compliant self-hosted AI support",
    "RAG customer support agent FastAPI React",
    "resolve vs escalate AI support safety gate",
    "how to build an AI customer support agent with Ollama",
    "on-premise AI helpdesk no cloud",
    "best self-hosted AI customer support agent 2026",
];

const DEFINITION =
    "Resolvr is an open-source, self-hosted AI customer support agent that classifies a support ticket, retrieves knowledge-base articles via RAG, decides resolve-vs-escalate behind a safety gate, and drafts a reply — running on local Ollama (qwen2.5:14b) so customer data never leaves your server, at zero per-token cost.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const meta = createPageMetadata(SEO_TITLE, SEO_DESCRIPTION, PAGE_PATH, locale, {
        image: { src: SCREENSHOT, alt: "Resolvr — self-hosted AI customer support agent running on local Ollama" },
    });
    return {
        ...meta,
        keywords: SEO_KEYWORDS,
        authors: [{ name: "Rohit Raj", url: SITE_CONFIG.url }],
        openGraph: {
            ...meta.openGraph,
            type: "article",
            publishedTime: DATE_PUBLISHED,
            modifiedTime: DATE_MODIFIED,
            authors: [SITE_CONFIG.url],
            tags: SEO_KEYWORDS,
        },
    };
}

const steps = [
    {
        tool: "classify_ticket",
        title: "1 · Classify",
        body: "A deterministic classifier tags the ticket with category (billing, technical, account, how-to, refund, security, legal, abuse), intent, sentiment, and priority. No LLM call — so the routing is reproducible and testable.",
    },
    {
        tool: "search_kb",
        title: "2 · Retrieve (RAG)",
        body: "Semantic retrieval over your help-center articles: the query is embedded with a local Ollama model and ranked by cosine similarity. Grounding the reply in real KB passages is what stops the agent from inventing policy.",
    },
    {
        tool: "decide_action",
        title: "3 · Decide",
        body: "A configurable confidence threshold decides resolve-vs-escalate. A hard safety gate forces escalation on security, legal, abuse, and refund tickets; low retrieval confidence escalates with full context attached.",
    },
    {
        tool: "draft_resolution",
        title: "4 · Draft",
        body: "For resolvable tickets, local Ollama drafts a reply strictly from the retrieved KB. Escalations get a courteous holding reply plus an internal routing note for the human who picks it up.",
    },
];

const faqs = [
    {
        question: "What is Resolvr?",
        answer:
            "Resolvr is an open-source, self-hosted AI customer support agent that classifies a support ticket, retrieves knowledge-base articles via RAG, decides resolve-vs-escalate behind a safety gate, and drafts a reply. It runs on local Ollama models, so customer data never leaves your server, at zero per-token cost.",
    },
    {
        question: "Can I run an AI support agent fully self-hosted so customer data never leaves my server?",
        answer:
            "Yes. Resolvr runs inference on local Ollama by default, so no ticket text is sent to any third-party API. This makes it suitable for GDPR, HIPAA, and air-gapped deployments. A cloud-API fallback exists but is opt-in and off by default.",
    },
    {
        question: "Is there an open-source alternative to Intercom Fin or Zendesk AI that I can self-host?",
        answer:
            "Resolvr is an open-source, self-hostable alternative to Intercom Fin and Zendesk AI. Unlike those SaaS tools it runs on your own server with no per-resolution or per-token fee, and unlike helpdesks such as Chatwoot or Zammad it is an agent-first classify → RAG → resolve/escalate pipeline rather than an inbox with bolt-on AI.",
    },
    {
        question: "How much does Resolvr cost per ticket?",
        answer:
            "Resolvr has zero per-token and zero per-resolution cost — the only cost is the server you already run. This contrasts with per-resolution SaaS pricing such as Intercom Fin's roughly $0.99 per resolution. Note that below a couple of million tokens a day, a cloud API can be cheaper than dedicated GPU infrastructure, which is exactly what the opt-in cloud fallback is for.",
    },
    {
        question: "How does Resolvr decide whether to resolve a ticket or escalate to a human?",
        answer:
            "Resolvr makes a deterministic resolve-vs-escalate decision behind a configurable safety gate. A hard gate always escalates security, legal, abuse, and refund tickets, and low retrieval confidence escalates with full context. Everything else is auto-resolved with a reply grounded in retrieved KB articles.",
    },
    {
        question: "Do AI support agents hallucinate, and how does Resolvr prevent it?",
        answer:
            "Resolvr reduces hallucination two ways: the reply is grounded strictly in knowledge-base articles retrieved via RAG, and a confidence-thresholded safety gate hands low-confidence cases to a human instead of sending them. Its pytest eval suite enforces 100% must-escalate recall on security, legal, and abuse tickets.",
    },
    {
        question: "Which open-source LLM does Resolvr run on Ollama?",
        answer:
            "Resolvr defaults to qwen2.5:14b on local Ollama and works with other Ollama models such as Llama 3.1 and Mistral. Smaller 7B–8B models run on modest GPUs; the hardest tickets can use the opt-in cloud-API fallback when needed.",
    },
    {
        question: "Is self-hosted AI customer support GDPR compliant?",
        answer:
            "Self-hosting is the cleanest GDPR story because no customer data is sent to a third-party processor — there is no external API call to cover with a DPA. Because Resolvr runs true local inference (not PII-masking before a cloud call), ticket data physically stays on your infrastructure, supporting GDPR, data-residency, and air-gapped requirements.",
    },
    {
        question: "What stack is Resolvr built on, and how do I deploy it?",
        answer:
            "Resolvr is built on FastAPI (Python) and React/Vite, with Ollama-based embeddings and cosine-similarity RAG, deterministic classification, and a pytest eval-gated safety layer. It is open source on GitHub and can be deployed end-to-end on your own server; the build guide includes copy-pasteable Ollama and FastAPI steps.",
    },
];

const compareRows = [
    { name: "Resolvr", selfHost: "Yes", localLLM: "Yes (Ollama)", dataLeaves: "No (local by default)", perRes: "None", rag: "Built-in", gate: "Yes", license: "Open source" },
    { name: "Intercom Fin", selfHost: "No (SaaS)", localLLM: "No", dataLeaves: "Yes (cloud)", perRes: "~$0.99/resolution", rag: "Yes", gate: "Handoff only", license: "Proprietary" },
    { name: "Zendesk AI", selfHost: "No (SaaS)", localLLM: "No", dataLeaves: "Yes (cloud)", perRes: "Per-resolution add-on", rag: "Yes", gate: "Handoff only", license: "Proprietary" },
    { name: "Chatwoot + Captain", selfHost: "Yes", localLLM: "Varies", dataLeaves: "Depends on model", perRes: "None (self-host)", rag: "Add-on", gate: "Helpdesk handoff", license: "Open source" },
    { name: "Zammad", selfHost: "Yes", localLLM: "Varies", dataLeaves: "Depends on model", perRes: "None (self-host)", rag: "Add-on", gate: "Helpdesk handoff", license: "Open source" },
];

const relatedLinks = [
    { href: "/agents", label: "All autonomous agents in the Agent Host" },
    { href: "/projects", label: "Full project catalog with architecture details" },
    { href: "/notes", label: "Engineering notes — AI agents, RAG, and LLM systems" },
    { href: "/services", label: "Hire Rohit: build a custom AI agent for your stack" },
];

export default async function ResolvrPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: `${SITE_CONFIG.url}/${locale}` },
        { name: "AI Agents", url: `${SITE_CONFIG.url}/${locale}/agents` },
        { name: "Resolvr", url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}` },
    ]);

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Resolvr",
        alternateName: "Resolvr — Autonomous Support Resolution Agent",
        description: DEFINITION,
        image: `${SITE_CONFIG.url}${SCREENSHOT}`,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Customer Support Automation",
        operatingSystem: "Linux, macOS, Windows (Docker)",
        url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}`,
        codeRepository: REPO_URL,
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        author: { "@type": "Person", name: SITE_CONFIG.author.name, url: SITE_CONFIG.url },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        keywords: SEO_KEYWORDS.join(", "),
        featureList: [
            "Self-hosted on local Ollama",
            "RAG over your knowledge base",
            "Resolve-vs-escalate safety gate",
            "Opt-in cloud-API fallback",
            "FastAPI + React, open source",
        ],
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to build a self-hosted AI customer support agent with Ollama",
        description:
            "Stand up an open-source, self-hosted AI customer support agent on local Ollama with a FastAPI + React stack.",
        totalTime: "PT20M",
        tool: [{ "@type": "HowToTool", name: "Ollama" }, { "@type": "HowToTool", name: "Python 3.12+" }, { "@type": "HowToTool", name: "Node.js 18+" }],
        step: [
            { "@type": "HowToStep", name: "Pull local models", text: "Install Ollama and pull a generation model and an embedding model: ollama pull qwen2.5:14b and ollama pull nomic-embed-text." },
            { "@type": "HowToStep", name: "Clone and install", text: "Clone the Resolvr repo and run make setup to create the Python venv and install the frontend." },
            { "@type": "HowToStep", name: "Index your knowledge base", text: "Drop your help-center articles into the KB; Resolvr embeds them on first boot for cosine-similarity retrieval." },
            { "@type": "HowToStep", name: "Run the agent", text: "Run make dev to start the FastAPI backend and React frontend, then submit a ticket and watch classify → retrieve → decide → draft." },
        ],
    };

    const faqSchema = generateFAQSchema(faqs);

    const techArticleSchema = generateTechArticleSchema(
        {
            headline: "Self-Hosted AI Customer Support Agent on Ollama — Resolvr",
            description: SEO_DESCRIPTION,
            path: PAGE_PATH,
            datePublished: DATE_PUBLISHED,
            dateModified: DATE_MODIFIED,
            keywords: SEO_KEYWORDS,
            proficiencyLevel: "Intermediate",
            image: { src: SCREENSHOT, alt: "Resolvr running" },
        },
        locale,
    );

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(techArticleSchema)}</script>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                {/* Hero — direct-answer block */}
                <section className="rel-hero">
                    <div className="container">
                        <nav className="rel-breadcrumb" aria-label="Breadcrumb">
                            <Link href={`/${locale}`}>Home</Link>
                            <span aria-hidden="true">→</span>
                            <Link href={`/${locale}/agents`}>AI Agents</Link>
                            <span aria-hidden="true">→</span>
                            <span className="rel-breadcrumb-current">Resolvr</span>
                        </nav>
                        <span className="rel-eyebrow" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", borderColor: "rgba(99,102,241,0.25)" }}>
                            <span aria-hidden="true">🎧</span> Self-hosted · open source · runs on Ollama
                        </span>
                        <h1 className="rel-headline">
                            Resolvr — Self-Hosted, Open-Source AI Customer Support Agent (Runs on Local Ollama)
                        </h1>
                        <p className="rel-lead">{DEFINITION}</p>
                        <div className="rel-byline">
                            <span>By <Link href={`/${locale}/about`}>Rohit Raj</Link> · Founding Engineer</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={DATE_MODIFIED}>Last updated June 14, 2026</time>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
                            <Link href={`/${locale}/agents#try`} className="btn btn-primary">Try the live demo →</Link>
                            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View on GitHub</a>
                        </div>
                    </div>
                </section>

                {/* Screenshot */}
                <section className="rel-section">
                    <div className="container">
                        <figure className="agent-screenshot" style={{ maxWidth: 980, margin: "0 auto" }}>
                            <Image src={SCREENSHOT} alt="Resolvr resolving a support ticket — React UI, FastAPI backend, reply drafted live by local Ollama" width={1440} height={980} sizes="(max-width: 1000px) 100vw, 980px" style={{ width: "100%", height: "auto" }} />
                            <figcaption>Resolvr running locally: a ticket auto-resolved with a reply drafted by Ollama (qwen2.5:14b), grounded in the knowledge base.</figcaption>
                        </figure>
                    </div>
                </section>

                {/* What is Resolvr */}
                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What is Resolvr?</h2>
                            <p className="section-description">An agent-first support pipeline you own end-to-end — not an inbox with a chatbot bolted on.</p>
                        </div>
                        <div className="rel-grid-2">
                            <article className="rel-card">
                                <h3 className="rel-card-title">Self-hosted &amp; private</h3>
                                <p>Inference runs on <strong>local Ollama</strong>. By default no ticket text is sent to any third-party API, so customer data physically stays on your box — the cleanest path to GDPR, HIPAA, and air-gapped support.</p>
                            </article>
                            <article className="rel-card">
                                <h3 className="rel-card-title">Open source &amp; hackable</h3>
                                <p>The whole pipeline is on <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub</a> — FastAPI + React, MIT-style. Read it, fork it, swap the model, point it at your own knowledge base.</p>
                            </article>
                            <article className="rel-card">
                                <h3 className="rel-card-title">Zero per-token cost</h3>
                                <p>No per-resolution or per-token fee. The only cost is the server you already run. An <strong>opt-in cloud-API fallback</strong> covers the hardest tickets when you want frontier quality.</p>
                            </article>
                            <article className="rel-card">
                                <h3 className="rel-card-title">Safety-gated, not reckless</h3>
                                <p>Honest scope: Resolvr does autonomous <strong>triage, RAG answering, and safety-gated drafting + escalation</strong> — not end-to-end account changes or refunds. Tool/action execution is on the roadmap.</p>
                            </article>
                        </div>
                        <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Stack: FastAPI (Python) + React/Vite · Ollama embeddings + cosine RAG · deterministic classify/decide · pytest eval-gated.
                        </p>
                    </div>
                </section>

                {/* How it works */}
                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">How does Resolvr work? The classify → RAG → safety-gate → draft pipeline</h2>
                            <p className="section-description">Four tools run in sequence. Classification, retrieval, and the resolve/escalate decision are deterministic; the LLM only writes the final reply.</p>
                        </div>
                        <div className="rel-grid-2">
                            {steps.map((s) => (
                                <article key={s.tool} className="rel-card">
                                    <h3 className="rel-card-title">{s.title}</h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontFamily: "var(--font-mono, monospace)" }}>{s.tool}</p>
                                    <p>{s.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Privacy / GDPR */}
                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Can it run fully self-hosted so customer data never leaves the box?</h2>
                        </div>
                        <p className="rel-lead" style={{ maxWidth: 820 }}>
                            Yes. Because inference runs on local Ollama, no ticket text is sent to any external model by default — which is a materially stronger privacy story than &ldquo;privacy-first&rdquo; SaaS that PII-masks and then sends the rest to a cloud LLM.
                        </p>
                        <ul className="rel-metric-list" style={{ maxWidth: 820 }}>
                            <li><strong>No third-party processor</strong> — there&apos;s no external API call to cover with a DPA, which simplifies the GDPR and data-residency story for EU SaaS and regulated teams.</li>
                            <li><strong>True local inference</strong> — data physically stays on your infrastructure, so it fits air-gapped and sovereignty requirements.</li>
                            <li><strong>Opt-in fallback</strong> — the cloud-API tier is off by default, so the privacy guarantee holds unless you explicitly enable it.</li>
                        </ul>
                    </div>
                </section>

                {/* Cost */}
                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What does it cost vs Intercom Fin or Zendesk AI?</h2>
                        </div>
                        <p className="rel-lead" style={{ maxWidth: 820 }}>
                            Resolvr has <strong>zero per-token and zero per-resolution cost</strong> — the only cost is the server you already run. That&apos;s the wedge for teams hit by per-resolution SaaS pricing, where bills scale directly with ticket volume.
                        </p>
                        <p style={{ maxWidth: 820, color: "var(--text-secondary)" }}>
                            One honest caveat so this stays credible: below roughly a couple of million tokens a day, a cloud API can be cheaper than running dedicated GPU infrastructure. Resolvr&apos;s value is <strong>privacy and control plus no marginal cost at volume</strong> — and the opt-in cloud fallback covers low-volume or hardest-ticket cases without locking you in.
                        </p>
                    </div>
                </section>

                {/* Comparison table */}
                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Resolvr vs Intercom Fin, Zendesk AI, Chatwoot &amp; Zammad</h2>
                            <p className="section-description">As of 2026, based on public documentation. The dimensions that matter for a self-hosted, privacy-first deployment.</p>
                        </div>
                        <div className="resolvr-table-wrap">
                            <table className="resolvr-compare">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Self-host</th>
                                        <th>Local LLM</th>
                                        <th>Data leaves box</th>
                                        <th>Per-resolution fee</th>
                                        <th>Built-in RAG</th>
                                        <th>Resolve/escalate gate</th>
                                        <th>License</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compareRows.map((r) => (
                                        <tr key={r.name} className={r.name === "Resolvr" ? "resolvr-compare-self" : ""}>
                                            <td>{r.name}</td>
                                            <td>{r.selfHost}</td>
                                            <td>{r.localLLM}</td>
                                            <td>{r.dataLeaves}</td>
                                            <td>{r.perRes}</td>
                                            <td>{r.rag}</td>
                                            <td>{r.gate}</td>
                                            <td>{r.license}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p style={{ marginTop: "0.75rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                            Chatwoot and Zammad are excellent self-hostable helpdesks with AI add-ons; Resolvr is the agent itself — the classify → RAG → resolve/escalate pipeline — rather than the inbox around it.
                        </p>
                    </div>
                </section>

                {/* Safety gate */}
                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">When should an AI support agent resolve vs escalate?</h2>
                        </div>
                        <p className="rel-lead" style={{ maxWidth: 820 }}>
                            A <strong>safety gate</strong> is a rule layer that overrides the model: certain ticket categories must always reach a human, and anything the agent isn&apos;t confident about is escalated rather than guessed.
                        </p>
                        <ul className="rel-metric-list" style={{ maxWidth: 820 }}>
                            <li><strong>Hard gate</strong> — security, legal, abuse, and refund tickets always escalate, regardless of how confident retrieval is.</li>
                            <li><strong>Confidence threshold</strong> — when the best KB match is weak, the ticket escalates with full context attached instead of getting a shaky answer.</li>
                            <li><strong>Eval-gated</strong> — a pytest suite enforces <strong>100% must-escalate recall</strong> on security/legal/abuse and ≥90% action accuracy before anything ships.</li>
                        </ul>
                        <p style={{ maxWidth: 820, color: "var(--text-secondary)" }}>
                            That combination — RAG grounding plus a confidence-thresholded gate — is the direct answer to the &ldquo;but won&apos;t it hallucinate?&rdquo; objection: low-confidence cases go to a human instead of being sent.
                        </p>
                    </div>
                </section>

                {/* Build it yourself */}
                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Build it yourself: a self-hosted AI support agent on Ollama (FastAPI + React)</h2>
                            <p className="section-description">The whole thing is open source. Four steps from zero to a running agent.</p>
                        </div>
                        <ol className="rel-metric-list" style={{ maxWidth: 820 }}>
                            <li><strong>Pull local models</strong> — <code>ollama pull qwen2.5:14b</code> and <code>ollama pull nomic-embed-text</code>.</li>
                            <li><strong>Clone &amp; install</strong> — clone <a href={REPO_URL} target="_blank" rel="noopener noreferrer">the repo</a> and run <code>make setup</code> to create the Python venv and install the frontend.</li>
                            <li><strong>Index your KB</strong> — drop your help-center articles in; Resolvr embeds them on first boot for cosine-similarity retrieval.</li>
                            <li><strong>Run it</strong> — <code>make dev</code> starts the FastAPI backend and React frontend; submit a ticket and watch classify → retrieve → decide → draft.</li>
                        </ol>
                        <p style={{ marginTop: "0.5rem" }}>
                            Full instructions, the eval suite, and a Docker Compose setup are in the <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub README</a>. Stars welcome — they help the project rank.
                        </p>
                    </div>
                </section>

                {/* When not to use */}
                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">When Resolvr is not the right fit</h2>
                        </div>
                        <ul className="rel-metric-list" style={{ maxWidth: 820 }}>
                            <li>You don&apos;t want to own a GPU/server — a fully managed SaaS like Fin or Zendesk AI will be less operational work.</li>
                            <li>You need frontier-model quality on the hardest, most ambiguous tickets — local models trail GPT-class models there (use the cloud fallback, or a managed tool).</li>
                            <li>You need turnkey Zendesk/Intercom inbox integration today — Resolvr ships as the agent + a demo UI, not a full helpdesk.</li>
                        </ul>
                        <p style={{ maxWidth: 820, color: "var(--text-secondary)" }}>
                            Who it <em>is</em> for: privacy- and data-residency-driven teams, regulated EU SaaS, teams frustrated by per-resolution pricing, and developers who want a self-hostable, hackable agent they fully control.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Frequently Asked Questions</h2>
                        </div>
                        <div className="rel-faq">
                            {faqs.map((f) => (
                                <details key={f.question} className="rel-faq-item">
                                    <summary>{f.question}</summary>
                                    <p>{f.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related */}
                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Related</h2>
                        </div>
                        <ul className="rel-related">
                            {relatedLinks.map((r) => (
                                <li key={r.href}><Link href={`/${locale}${r.href}`}>{r.label} →</Link></li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="rel-back-nav">
                    <div className="container">
                        <Link href={`/${locale}/agents`} className="btn btn-secondary">← Back to the Agent Host</Link>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
