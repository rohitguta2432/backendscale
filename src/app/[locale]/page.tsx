import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIProjects from "@/components/AIProjects";
import ProcessTimeline from "@/components/ProcessTimeline";
import ReliabilitySection from "@/components/ReliabilitySection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { webSiteSchema } from "@/lib/seo-config";
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

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <Hero dict={dict.home} locale={locale as Locale} />
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
