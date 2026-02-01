"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { repositories, contributions, projectNotes, filterCategories } from "@/data/github";
import type { Locale, CommonDictionary, PagesDictionary } from "@/lib/i18n";

type FilterType = 'all' | 'open-source' | 'ai-systems' | 'backend-infrastructure' | 'experiments';

interface NotesPageClientProps {
    locale: Locale;
    commonDict: CommonDictionary;
    pagesDict: PagesDictionary;
}

function TypeBadge({ type }: { type: string }) {
    const colors: Record<string, string> = {
        'open-source': 'var(--status-active)',
        'experiment': 'var(--status-iterating)',
        'infrastructure': 'var(--accent)',
    };

    return (
        <span
            className="type-badge"
            style={{
                backgroundColor: colors[type] || 'var(--text-muted)',
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '2px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}
        >
            {type.replace('-', ' ')}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'active': 'var(--status-active)',
        'maintenance': 'var(--status-iterating)',
        'archived': 'var(--text-muted)',
    };

    return (
        <span
            style={{
                backgroundColor: colors[status] || 'var(--text-muted)',
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '2px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase'
            }}
        >
            {status}
        </span>
    );
}

function ContributionCard({ contribution }: { contribution: typeof contributions[0] }) {
    return (
        <article className="contribution-card" style={{
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                    {contribution.title}
                </h3>
                <TypeBadge type={contribution.type} />
            </div>

            <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem'
            }}>
                <a href={contribution.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                    {contribution.repo}
                </a>
                <span style={{ margin: '0 0.5rem' }}>·</span>
                <span>{contribution.date}</span>
            </p>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                {contribution.summary}
            </p>

            {contribution.impact && (
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--status-active)',
                    marginBottom: '0.75rem'
                }}>
                    → {contribution.impact}
                </p>
            )}

            {contribution.modules && contribution.modules.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {contribution.modules.map((mod) => (
                        <code key={mod} style={{
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--card-bg)',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '2px'
                        }}>
                            {mod}
                        </code>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <a
                    href={contribution.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--accent)',
                        textDecoration: 'none'
                    }}
                >
                    GitHub →
                </a>
            </div>
        </article>
    );
}

function RepoSummaryCard({ repo }: { repo: typeof repositories[0] }) {
    if (repo.isFork && repo.status === 'archived') return null;

    return (
        <div className="repo-card" style={{
            border: '1px solid var(--border)',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'var(--card-bg)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <code style={{ fontSize: '1rem', fontWeight: 600 }}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {repo.name}
                    </a>
                </code>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {repo.language && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{repo.language}</span>
                    )}
                    <StatusBadge status={repo.status} />
                </div>
            </div>

            {repo.problemSolved && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {repo.problemSolved}
                </p>
            )}

            {repo.contributionScope && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {repo.contributionScope}
                </p>
            )}

            {repo.modules && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {repo.modules.map((m) => (
                        <code key={m} style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-color)', padding: '0.125rem 0.25rem' }}>
                            {m}
                        </code>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProjectNoteCard({ note, dict }: { note: typeof projectNotes[0]; dict: PagesDictionary }) {
    return (
        <article style={{
            border: '1px solid var(--border)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: 'var(--card-bg)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                    <code>{note.projectName}</code>
                </h3>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {note.category.replace('-', ' ')}
                </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
                    {dict.notes.whyExists}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {note.whyExists}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
                    {dict.notes.coreChallenge}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {note.coreTechnicalChallenge}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {dict.notes.architecture}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                    {note.architectureSnapshot.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.5 }}>{item}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {dict.notes.tradeoffs}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                    {note.tradeoffs.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.5 }}>{item}</li>
                    ))}
                </ul>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)'
            }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-active)' }}>
                    {note.currentState}
                </span>
                <a
                    href={note.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.85rem', color: 'var(--accent)' }}
                >
                    View Repository →
                </a>
            </div>
        </article>
    );
}

export default function NotesPageClient({ locale, commonDict, pagesDict }: NotesPageClientProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredNotes = activeFilter === 'all'
        ? projectNotes
        : projectNotes.filter(n => n.category === activeFilter);

    const filteredContributions = activeFilter === 'all'
        ? contributions
        : contributions.filter(c => {
            if (activeFilter === 'open-source') return c.type === 'open-source';
            if (activeFilter === 'ai-systems') return c.type === 'ai-systems';
            if (activeFilter === 'backend-infrastructure') return c.repo === 'sqs';
            if (activeFilter === 'experiments') return c.type === 'experiment';
            return true;
        });

    return (
        <>
            <Header locale={locale} dict={commonDict} />
            <main id="main" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                {/* Header */}
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {pagesDict.notes.title}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {pagesDict.notes.description}
                    </p>
                </header>

                {/* Filters */}
                <nav style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border)',
                    flexWrap: 'wrap'
                }}>
                    {filterCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id as FilterType)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: activeFilter === cat.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                                backgroundColor: activeFilter === cat.id ? 'var(--accent)' : 'transparent',
                                color: activeFilter === cat.id ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontFamily: 'var(--font-sans)'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>

                {/* Contribution Feed */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '1.5rem'
                    }}>
                        {pagesDict.notes.contributionFeed}
                    </h2>

                    {filteredContributions.length > 0 ? (
                        filteredContributions.map((contribution, i) => (
                            <ContributionCard key={i} contribution={contribution} />
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {pagesDict.notes.noContributions}
                        </p>
                    )}
                </section>

                {/* Open-Source Repository Summary */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '1.5rem'
                    }}>
                        {pagesDict.notes.repositorySummary}
                    </h2>

                    {repositories
                        .filter(r => r.status !== 'archived' || !r.isFork)
                        .slice(0, 6)
                        .map((repo) => (
                            <RepoSummaryCard key={repo.name} repo={repo} />
                        ))
                    }

                    <p style={{
                        textAlign: 'center',
                        marginTop: '1.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <a
                            href="https://github.com/rohitguta2432?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent)' }}
                        >
                            {pagesDict.notes.viewAllRepos}
                        </a>
                    </p>
                </section>

                {/* Project Notes */}
                <section>
                    <h2 style={{
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '1.5rem'
                    }}>
                        {pagesDict.notes.projectNotes}
                    </h2>

                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <ProjectNoteCard key={note.slug} note={note} dict={pagesDict} />
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {pagesDict.notes.noNotes}
                        </p>
                    )}
                </section>

                {/* Navigation */}
                <nav style={{
                    marginTop: '4rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Link href={`/${locale}/projects`} style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                        ← {commonDict.nav.projects}
                    </Link>
                    <Link href={`/${locale}/repos`} style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                        {commonDict.nav.repos} →
                    </Link>
                </nav>
            </main>
            <Footer dict={commonDict} locale={locale} />
        </>
    );
}
