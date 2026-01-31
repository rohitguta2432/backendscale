import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NexusAI | AI Product Development & Consulting",
  description:
    "Transform your business with cutting-edge AI. We build intelligent products, integrate LLMs, and engineer scalable systems that give you an unfair advantage.",
  keywords: [
    "AI consulting",
    "AI product development",
    "LLM integration",
    "ChatGPT consulting",
    "GenAI solutions",
    "machine learning",
    "AI strategy",
    "software development",
  ],
  authors: [{ name: "NexusAI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NexusAI | AI Product Development & Consulting",
    description: "Transform your business with cutting-edge AI innovation.",
    siteName: "NexusAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusAI | AI Product Development & Consulting",
    description: "Transform your business with cutting-edge AI innovation.",
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
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
