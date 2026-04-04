import { locales } from "@/lib/i18n";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog-posts";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://rohitraj.tech";
    const now = new Date();

    // Static routes
    const staticRoutes = [
        "", // home
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

    // Dynamic project routes from data
    const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

    // Dynamic service routes from data
    const serviceRoutes = ["/services", ...services.map((service) => `/services/${service.slug}`)];

    // Dynamic blog post routes
    const blogRoutes = blogPosts.map((post) => `/notes/${post.slug}`);

    // Combine all routes
    const allRoutes = [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...blogRoutes];

    const sitemap: MetadataRoute.Sitemap = [];



    // Only include English URLs to maximize crawl budget on a new domain.
    // Non-English pages were causing "Discovered – currently not indexed" (90 pages).
    for (const route of allRoutes) {
        let priority = 0.7;
        let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

        if (route === "") {
            priority = 1.0;
            changeFrequency = "weekly";
        } else if (route === "/projects" || route.startsWith("/projects/")) {
            priority = 0.9;
            changeFrequency = "weekly";
        } else if (route === "/about" || route === "/contact") {
            priority = 0.8;
            changeFrequency = "monthly";
        } else if (route.startsWith("/reliability")) {
            priority = 0.8;
            changeFrequency = "weekly";
        } else if (route === "/services" || route.startsWith("/services/")) {
            priority = 0.9;
            changeFrequency = "weekly";
        } else if (route.startsWith("/notes/")) {
            priority = 0.85;
            changeFrequency = "weekly";
        }

        sitemap.push({
            url: `${baseUrl}/en${route}`,
            lastModified: now,
            changeFrequency,
            priority,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((loc) => [loc, `${baseUrl}/${loc}${route}`])
                ),
            },
        });
    }

    return sitemap;
}
