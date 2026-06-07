// Topic samples drawn from cadence/cadence/data/topic_queue.json. Each seeds a
// full pipeline run (draft + SEO lint) on the live demo.
export interface TopicSample {
    id: string;
    label: string;
    topic: string;
    keyword: string;
    niche: string;
}

export const SAMPLES: TopicSample[] = [
    {
        id: "plg",
        label: "Product-led growth",
        topic: "Product-led growth vs sales-led growth",
        keyword: "product-led growth",
        niche: "SaaS marketing",
    },
    {
        id: "ai-content",
        label: "Automate content with AI",
        topic: "How to automate content creation with AI",
        keyword: "automate content creation",
        niche: "AI tools for business",
    },
    {
        id: "solo-seo",
        label: "Solo founder SEO",
        topic: "Solo founder SEO strategy on a bootstrap budget",
        keyword: "solo founder seo",
        niche: "solo founder",
    },
    {
        id: "batch",
        label: "Batch content (keyword trap)",
        topic: "How to write a week of content in one day",
        keyword: "batch content creation",
        niche: "solo founder",
    },
];
