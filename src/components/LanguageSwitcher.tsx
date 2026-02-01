"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { locales, localeNames, localeFlags, getLocalizedPath, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
    currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLocaleChange = (newLocale: Locale) => {
        // Set cookie for persistence
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

        // Navigate to new locale path
        const newPath = getLocalizedPath(pathname, newLocale);
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button
                className="language-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <span className="language-flag">{localeFlags[currentLocale]}</span>
                <span className="language-code">{currentLocale.toUpperCase()}</span>
                <svg
                    className={`language-chevron ${isOpen ? "open" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="language-dropdown">
                    {locales.map((locale) => (
                        <button
                            key={locale}
                            className={`language-option ${locale === currentLocale ? "active" : ""}`}
                            onClick={() => handleLocaleChange(locale)}
                        >
                            <span className="language-flag">{localeFlags[locale]}</span>
                            <span className="language-name">{localeNames[locale]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
