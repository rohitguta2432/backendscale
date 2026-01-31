import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BackendScale | Backend Systems Consulting",
  description:
    "Senior backend consultant helping startups fix slow APIs, eliminate Kafka bottlenecks, and design scalable event-driven architectures. 10+ years experience with Spring Boot, Kafka, Redis, and AI integration.",
  keywords: [
    "backend consulting",
    "Spring Boot consultant",
    "Kafka expert",
    "Redis optimization",
    "event-driven architecture",
    "API performance",
    "backend systems",
    "startup CTO",
    "AI integration",
  ],
  authors: [{ name: "BackendScale" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "BackendScale | Backend Systems Consulting",
    description:
      "Fix slow APIs, eliminate Kafka bottlenecks, and scale your backend with confidence.",
    siteName: "BackendScale",
  },
  twitter: {
    card: "summary_large_image",
    title: "BackendScale | Backend Systems Consulting",
    description:
      "Fix slow APIs, eliminate Kafka bottlenecks, and scale your backend with confidence.",
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
