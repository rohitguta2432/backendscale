import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIProjects from "@/components/AIProjects";
import ReliabilitySection from "@/components/ReliabilitySection";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
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
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <Hero dict={dict.home} locale={locale as Locale} />
                <AIProjects dict={dict.home} />
                <ReliabilitySection dictionary={dict.home} locale={locale as Locale} />
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
