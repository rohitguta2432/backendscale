import { locales } from "@/lib/i18n";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog-posts";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://rohitraj.tech";
    const now = new Date();

    // Static routes — use site-launch date as a stable lastModified anchor
    const staticAnchor = new Date("2026-04-22");
    const staticRoutes = [
        "",
        "/about",
        "/contact",
        "/projects",
        "/repos",
        "/notes",
        "/reliability",
        "/reliability/api-testing",
        "/reliability/kafka-testing",
        "/reliability/load-testing",
        "/reliability/observability",
    ];

    const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
    const serviceRoutes = ["/services", ...services.map((service) => `/services/${service.slug}`)];

    // Build a slug → real-date map for posts so each post has its own lastModified
    const postDateBySlug = new Map<string, Date>();
    for (const post of blogPosts) {
        const real = post.updated ?? post.date;
        if (real) postDateBySlug.set(post.slug, new Date(real));
    }
    const blogRoutes = blogPosts.map((post) => `/notes/${post.slug}`);

    const allRoutes = [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...blogRoutes];

    const sitemap: MetadataRoute.Sitemap = [];

    // Only include English URLs to maximize crawl budget on a new domain.
    // Non-English pages were causing "Discovered – currently not indexed" (90 pages).
    for (const route of allRoutes) {
        let lastModified: Date = staticAnchor;
        if (route.startsWith("/notes/")) {
            const slug = route.replace("/notes/", "");
            lastModified = postDateBySlug.get(slug) ?? now;
        } else if (route.startsWith("/projects/") || route.startsWith("/services/")) {
            lastModified = staticAnchor;
        }

        // Build alternates.languages with x-default = English
        const languageAlternates: Record<string, string> = Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}${route}`])
        );
        languageAlternates["x-default"] = `${baseUrl}/en${route}`;

        sitemap.push({
            url: `${baseUrl}/en${route}`,
            lastModified,
            // priority + changeFrequency removed — Google has ignored them since 2023
            alternates: {
                languages: languageAlternates,
            },
        });
    }

    return sitemap;
}
