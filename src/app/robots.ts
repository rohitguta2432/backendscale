import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            // Explicitly allow AI search crawlers
            {
                userAgent: "GPTBot",
                allow: "/",
            },
            {
                userAgent: "OAI-SearchBot",
                allow: "/",
            },
            {
                userAgent: "ClaudeBot",
                allow: "/",
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
        ],
        sitemap: "https://rohitraj.tech/sitemap.xml",
    };
}
