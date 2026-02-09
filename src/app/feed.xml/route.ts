import { blogPosts } from "@/data/blog-posts";

export async function GET() {
    const baseUrl = "https://rohitraj.tech";
    const now = new Date().toUTCString();

    const items = blogPosts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/en/notes/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/en/notes/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.keywords.map((kw) => `<category>${kw}</category>`).join("\n      ")}
    </item>`
        )
        .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rohit Raj — Engineering Blog</title>
    <link>${baseUrl}</link>
    <description>Technical writing on AI engineering, reliability, and founding engineer insights.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
