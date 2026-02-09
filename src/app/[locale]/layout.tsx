import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, locales, isRTL, type Locale } from "@/lib/i18n";
import { generateBreadcrumbSchema, SITE_CONFIG } from "@/lib/seo-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};

    const dict = await getDictionary(locale);
    const baseUrl = "https://rohitraj.tech";

    return {
        title: dict.meta.home.title,
        description: dict.meta.home.description,
        keywords: [
            "backend engineering",
            "AI systems",
            "system design",
            "distributed systems",
            "software architecture",
            "Rohit Raj",
            "rohitraj.tech",
        ],
        authors: [{ name: "Rohit Raj" }],
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                en: `${baseUrl}/en`,
                hi: `${baseUrl}/hi`,
                fr: `${baseUrl}/fr`,
                de: `${baseUrl}/de`,
                ar: `${baseUrl}/ar`,
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "hi" ? "hi_IN" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : locale === "ar" ? "ar_SA" : "en_US",
            title: dict.meta.home.title,
            description: dict.meta.home.description,
            siteName: "Rohit Raj",
            url: `${baseUrl}/${locale}`,
        },
        twitter: {
            card: "summary_large_image",
            title: dict.meta.home.title,
            description: dict.meta.home.description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const direction = isRTL(locale as Locale) ? "rtl" : "ltr";

    return (
        <>
            <head>
                <link rel="alternate" hrefLang="en" href="https://rohitraj.tech/en" />
                <link rel="alternate" hrefLang="hi" href="https://rohitraj.tech/hi" />
                <link rel="alternate" hrefLang="fr" href="https://rohitraj.tech/fr" />
                <link rel="alternate" hrefLang="de" href="https://rohitraj.tech/de" />
                <link rel="alternate" hrefLang="ar" href="https://rohitraj.tech/ar" />
                <link rel="alternate" hrefLang="x-default" href="https://rohitraj.tech/en" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(
                            generateBreadcrumbSchema([
                                { name: 'Home', url: `${SITE_CONFIG.url}/${locale}` },
                            ])
                        ),
                    }}
                />
            </head>
            <div lang={locale} dir={direction} className={direction === "rtl" ? "rtl" : ""}>
                <a href="#main" className="skip-link">
                    Skip to main content
                </a>
                {children}
            </div>
        </>
    );
}

