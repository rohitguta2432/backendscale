import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rohit Raj — Backend & AI Systems",
  description:
    "Building AI-enabled backend systems. Documenting real problems and solutions. Current work, architecture notes, and repositories.",
  keywords: [
    "backend engineering",
    "AI systems",
    "system design",
    "distributed systems",
    "software architecture",
    "Rohit Raj",
    "rohitraj.tech",
  ],
  authors: [{ name: "Rohit Raj" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Rohit Raj — Backend & AI Systems",
    description: "Building AI-enabled backend systems. Documenting real problems and solutions.",
    siteName: "Rohit Raj",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Raj — Backend & AI Systems",
    description: "Building AI-enabled backend systems. Documenting real problems and solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
