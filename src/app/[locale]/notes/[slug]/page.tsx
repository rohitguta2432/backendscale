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
                                whiteSpace: 'pre-wrap',
                            }}>
                                {section.content}
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
