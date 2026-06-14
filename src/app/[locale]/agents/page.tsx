import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Agents from "@/components/Agents";
import AgentLab from "@/components/AgentLab";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

const TITLE = "AI Agent Host — Autonomous Agents for Billion-Dollar Markets";
const DESCRIPTION =
    "Live, autonomous AI agents built by Rohit Raj — try them in your browser. An AI home-services dispatcher that quotes and books, a contract risk reviewer, an educational portfolio X-ray, and an MCP manifest security scanner. Each runs deterministically with no API key.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    return createPageMetadata(TITLE, DESCRIPTION, "/agents", locale);
}

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
                            Seven of them are live below: try them.
                        </p>
                    </div>
                </div>

                <AgentLab />

                <Agents locale={locale as Locale} variant="full" />
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
