import { locales } from "@/lib/i18n";
import { projects } from "@/data/projects";
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

    // Combine all routes
    const allRoutes = [...staticRoutes, ...projectRoutes];

    const sitemap: MetadataRoute.Sitemap = [];

    // Add root URL (for Google)
    sitemap.push({
        url: baseUrl,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0,
    });

    // Add all localized routes
    for (const locale of locales) {
        for (const route of allRoutes) {
            // Determine priority based on route type
            let priority = 0.7;
            let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

            if (route === "") {
                priority = 1.0;
                changeFrequency = "weekly";
            } else if (route === "/projects" || route.startsWith("/projects/")) {
                priority = 0.9; // High priority for project pages (founder keywords)
                changeFrequency = "weekly";
            } else if (route === "/about" || route === "/contact") {
                priority = 0.8;
                changeFrequency = "monthly";
            } else if (route.startsWith("/reliability")) {
                priority = 0.8;
                changeFrequency = "weekly";
            }

            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
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
    }

    return sitemap;
}
