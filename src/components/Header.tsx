"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale, CommonDictionary } from "@/lib/i18n";

interface HeaderProps {
    locale: Locale;
    dict: CommonDictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: `/${locale}`, label: dict.nav.home },
        { href: `/${locale}/projects`, label: dict.nav.projects },
        { href: `/${locale}/repos`, label: dict.nav.repos },
        { href: `/${locale}/notes`, label: dict.nav.notes },
        { href: `/${locale}/about`, label: dict.nav.about },
        { href: `/${locale}/contact`, label: dict.nav.contact },
    ];

    const isActive = (href: string) => {
        if (href === `/${locale}`) {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="header">
            <div className="container header-inner">
                <Link href={`/${locale}`} className="logo">
                    Rohit Raj
                </Link>

                <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href={`/${locale}/projects`}
                        className="btn btn-primary btn-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {dict.nav.viewCurrentWork}
                    </Link>
                    <LanguageSwitcher currentLocale={locale} />
                </nav>

                <div className="header-actions-mobile">
                    <LanguageSwitcher currentLocale={locale} />
                    <button
                        className="mobile-menu-btn"
                        aria-label="Menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
