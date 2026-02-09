import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NotesPageClient from "./NotesPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return createPageMetadata(
        dict.meta.notes.title,
        dict.meta.notes.description,
        '/notes',
        locale
    );
}

export default async function NotesPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    return (
        <NotesPageClient
            locale={locale as Locale}
            commonDict={dict.common}
            pagesDict={dict.pages}
        />
    );
}
