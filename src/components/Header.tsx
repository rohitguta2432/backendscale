"use client";

import { useEffect, useState } from "react";

export default function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = savedTheme || (systemDark ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: "1rem 0",
                background: "var(--header-bg)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border)",
                transition: "all 300ms ease",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* Logo */}
                <a
                    href="#"
                    style={{
                        fontWeight: 800,
                        fontSize: "1.25rem",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span
                        style={{
                            width: "32px",
                            height: "32px",
                            background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1rem",
                            color: "white",
                        }}
                    >
                        R
                    </span>
                    RohitGuta
                </a>

                {/* Navigation */}
                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5rem",
                    }}
                >
                    <div className="nav-links" style={{ display: "flex", gap: "2rem" }}>
                        <a
                            href="#services"
                            style={{
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                fontSize: "0.9375rem",
                                fontWeight: 500,
                            }}
                        >
                            Services
                        </a>
                        <a
                            href="#work"
                            style={{
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                fontSize: "0.9375rem",
                                fontWeight: 500,
                            }}
                        >
                            Work
                        </a>
                        <a
                            href="#about"
                            style={{
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                fontSize: "0.9375rem",
                                fontWeight: 500,
                            }}
                        >
                            About
                        </a>
                    </div>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        >
                            {theme === "light" ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            )}
                        </button>
                    )}

                    <a
                        href="#contact"
                        className="btn btn-primary"
                        style={{
                            padding: "0.625rem 1.25rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        Let&apos;s Talk
                    </a>
                </nav>
            </div>
        </header>
    );
}
