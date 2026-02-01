import { locales } from "@/lib/i18n";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://rohitraj.tech";

    const routes = [
        "", // home
        "/about",
        "/contact",
        "/projects",
        "/repos",
        "/notes",
    ];

    const sitemap: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        for (const route of routes) {
            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === "" ? "weekly" : "monthly",
                priority: route === "" ? 1.0 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((loc) => [loc, `${baseUrl}/${loc}${route}`])
                    ),
                },
            });
        }
    }

    return sitemap;
}
