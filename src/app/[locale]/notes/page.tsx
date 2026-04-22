import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata, generateCollectionPageSchema, SITE_CONFIG } from "@/lib/seo-config";
import { blogPosts } from "@/data/blog-posts";
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

    const collectionSchema = generateCollectionPageSchema({
        name: dict.meta.notes.title,
        description: dict.meta.notes.description,
        url: `${SITE_CONFIG.url}/${locale}/notes`,
        items: blogPosts.map((p) => ({
            name: p.title,
            url: `${SITE_CONFIG.url}/${locale}/notes/${p.slug}`,
        })),
    });
    const collectionJson = JSON.stringify(collectionSchema);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: collectionJson }}
            />
            <NotesPageClient
                locale={locale as Locale}
                commonDict={dict.common}
                pagesDict={dict.pages}
            />
        </>
    );
}
