import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog-posts";
import { getDictionary, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { createPageMetadata, generateBlogPostingSchema } from "@/lib/seo-config";
import type { Metadata } from "next";

interface BlogPostPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    const params = [];
    for (const locale of locales) {
        for (const post of blogPosts) {
            params.push({ locale, slug: post.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post || !isValidLocale(locale)) {
        return { title: "Post Not Found | Rohit Raj" };
    }

    return {
        ...createPageMetadata(
            `${post.title} | Rohit Raj`,
            post.excerpt,
            `/notes/${slug}`,
            locale
        ),
        keywords: post.keywords,
    };
}

// Simple Markdown Renderer
function renderMarkdown(content: string) {
    const segments = [];
    let lastIndex = 0;
    // Match code blocks: ```lang ... ```
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeRegex.exec(content)) !== null) {
        // Add text before code
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
        }
        // Add code block
        segments.push({
            type: 'code',
            lang: match[1] || 'text',
            content: match[2].trim() // Trim extra newlines
        });
        lastIndex = codeRegex.lastIndex;
    }
    // Add remaining text
    if (lastIndex < content.length) {
        segments.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return segments.map((segment, i) => {
        if (segment.type === 'code') {
            return (
                <div key={i} style={{
                    margin: '1.5rem 0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#1e1e1e', // Dark theme for code
                    border: '1px solid #333',
                }}>
                    <div style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#252526',
                        borderBottom: '1px solid #333',
                        color: '#9cdcfe',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>{segment.lang}</span>
                    </div>
                    <pre style={{
                        margin: 0,
                        padding: '1rem',
                        overflowX: 'auto',
                        color: '#d4d4d4',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                    }}>
                        <code>{segment.content}</code>
                    </pre>
                </div>
            );
        } else {
            // Process text formatting (bold, paragraphs, lists)
            const textParts = segment.content.split('\n\n'); // Split paragraphs
            return (
                <div key={i}>
                    {textParts.map((part, j) => {
                        if (!part.trim()) return null;

                        // Check for lists
                        if (part.trim().startsWith('- ') || part.trim().match(/^\d+\. /)) {
                            const listItems = part.trim().split('\n').filter(line => line.trim());
                            const isOrdered = listItems[0].match(/^\d+\. /);
                            const ListTag = isOrdered ? 'ol' : 'ul';

                            return (
                                <ListTag key={j} style={{
                                    paddingLeft: '1.5rem',
                                    marginBottom: '1.5rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {listItems.map((item, k) => {
                                        const cleanItem = item.replace(/^(\- |\d+\. )/, '');
                                        // Simple bold parser for list items
                                        const parts = cleanItem.split(/(\*\*.*?\*\*)/g);
                                        return (
                                            <li key={k} style={{ marginBottom: '0.5rem' }}>
                                                {parts.map((p, l) => {
                                                    if (p.startsWith('**') && p.endsWith('**')) {
                                                        return <strong key={l} style={{ color: 'var(--text-primary)' }}>{p.slice(2, -2)}</strong>;
                                                    }
                                                    // Parse code snippets inside list items
                                                    if (p.includes('`')) {
                                                        const codeParts = p.split(/(`.*?`)/g);
                                                        return codeParts.map((cp, m) => {
                                                            if (cp.startsWith('`') && cp.endsWith('`')) {
                                                                return <code key={`${l}-${m}`} style={{
                                                                    backgroundColor: 'var(--bg-secondary)',
                                                                    padding: '0.1rem 0.3rem',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.9em',
                                                                    fontFamily: 'var(--font-mono)'
                                                                }}>{cp.slice(1, -1)}</code>;
                                                            }
                                                            return cp;
                                                        });
                                                    }
                                                    return p;
                                                })}
                                            </li>
                                        );
                                    })}
                                </ListTag>
                            );
                        }

                        // Paragraph
                        // Render bold and inline code in paragraph
                        const parts = part.split(/(\*\*.*?\*\*|`.*?`)/g);

                        return (
                            <p key={j} style={{
                                marginBottom: '1.5rem',
                                lineHeight: 1.8,
                                color: 'var(--text-secondary)',
                                fontSize: '1.05rem'
                            }}>
                                {parts.map((p, k) => {
                                    if (p.startsWith('**') && p.endsWith('**')) {
                                        return <strong key={k} style={{ color: 'var(--text-primary)' }}>{p.slice(2, -2)}</strong>;
                                    }
                                    if (p.startsWith('`') && p.endsWith('`')) {
                                        return <code key={k} style={{
                                            backgroundColor: 'var(--bg-secondary)',
                                            padding: '0.1rem 0.3rem',
                                            borderRadius: '4px',
                                            fontSize: '0.9em',
                                            fontFamily: 'var(--font-mono)',
                                            color: 'var(--text-primary)'
                                        }}>{p.slice(1, -1)}</code>;
                                    }
                                    return p;
                                })}
                            </p>
                        );
                    })}
                </div>
            );
        }
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) notFound();

    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) notFound();

    const dict = await getDictionary(locale as Locale);

    const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateBlogPostingSchema(post)),
                }}
            />
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main" style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* Article Header */}
                <header style={{ marginBottom: '3rem' }}>
                    <Link
                        href={`/${locale}/notes`}
                        style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginBottom: '1.5rem'
                        }}
                    >
                        ← Back to Notes
                    </Link>
                    <h1 style={{
                        fontSize: '2.25rem',
                        fontWeight: 700,
                        lineHeight: 1.25,
                        marginBottom: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        {post.title}
                    </h1>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem'
                    }}>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                    </div>
                    <p style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                    }}>
                        {post.excerpt}
                    </p>
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {post.keywords.slice(0, 4).map((kw) => (
                            <span key={kw} style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.6rem',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '2px',
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                {kw}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Article Body */}
                <article>
                    {post.sections.map((section, i) => (
                        <section key={i} style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                color: 'var(--text-primary)',
                                paddingTop: '0.5rem'
                            }}>
                                {section.heading}
                            </h2>
                            <div style={{
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8,
                                fontSize: '1.05rem',
                            }}>
                                {renderMarkdown(section.content)}
                            </div>
                        </section>
                    ))}
                </article>

                {/* Related Project */}
                {post.relatedProject && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--card-bg)',
                    }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            RELATED PROJECT
                        </p>
                        <Link
                            href={`/${locale}/projects/${post.relatedProject}`}
                            style={{
                                color: 'var(--accent)',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            View {post.relatedProject.charAt(0).toUpperCase() + post.relatedProject.slice(1)} →
                        </Link>
                    </div>
                )}

                {/* CTA */}
                {post.cta && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '2rem',
                        textAlign: 'center',
                        border: '1px solid var(--accent)',
                        backgroundColor: 'var(--card-bg)',
                    }}>
                        <p style={{
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '1rem'
                        }}>
                            {post.cta.text}
                        </p>
                        <Link
                            href={`/${locale}${post.cta.href}`}
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 2rem',
                                backgroundColor: 'var(--accent)',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        >
                            Let&apos;s Talk →
                        </Link>
                    </div>
                )}

                {/* Read Next */}
                {otherPosts.length > 0 && (
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h3 style={{
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--text-muted)',
                            marginBottom: '1.5rem'
                        }}>
                            Read Next
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {otherPosts.map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/${locale}/notes/${p.slug}`}
                                    style={{
                                        textDecoration: 'none',
                                        padding: '1rem',
                                        border: '1px solid var(--border)',
                                        display: 'block',
                                    }}
                                >
                                    <h4 style={{
                                        fontSize: '1.05rem',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {p.title}
                                    </h4>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        margin: 0
                                    }}>
                                        {p.excerpt.slice(0, 100)}...
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Link href={`/${locale}/notes`} style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                        ← All Notes
                    </Link>
                    <Link href={`/${locale}/projects`} style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                        Projects →
                    </Link>
                </nav>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
