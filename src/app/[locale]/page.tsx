import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HireBlock from "@/components/HireBlock";
import AIProjects from "@/components/AIProjects";
import ProcessTimeline from "@/components/ProcessTimeline";
import ReliabilitySection from "@/components/ReliabilitySection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { webSiteSchema, generateFAQSchema } from "@/lib/seo-config";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const dict = await getDictionary(locale as Locale);

    const faqSchema = dict.home.faq
        ? generateFAQSchema(
              dict.home.faq.items.map((item) => ({
                  question: item.q,
                  answer: item.a,
              }))
          )
        : null;

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
            {faqSchema && (
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            )}
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <Hero dict={dict.home} locale={locale as Locale} />
                <HireBlock dict={dict.home} locale={locale as Locale} />
                <AIProjects dict={dict.home} />
                <ProcessTimeline dict={dict.home} />
                <ReliabilitySection dictionary={dict.home} locale={locale as Locale} />
                <Testimonials />
                <FAQ dict={dict.home} />
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
