import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return {
        title: dict.meta.about.title,
        description: dict.meta.about.description,
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">{dict.pages.about.title}</h1>
                    </div>
                </div>

                <section>
                    <div className="container about-content">
                        <h2 className="about-name">Rohit Raj</h2>
                        <p className="about-bio">{dict.pages.about.bio1}</p>
                        <p className="about-bio" style={{ marginTop: "1rem" }}>
                            {dict.pages.about.bio2}
                        </p>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} />
        </>
    );
}
