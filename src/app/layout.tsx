import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RohitGuta | AI & Software Consultant",
  description:
    "Building the future with AI, Machine Learning, and cutting-edge technology. Expert AI product development, LLM integration, and full-stack engineering.",
  keywords: [
    "AI consultant",
    "AI product development",
    "LLM integration",
    "ChatGPT",
    "GenAI",
    "machine learning",
    "full stack developer",
    "software consultant",
  ],
  authors: [{ name: "Rohit Gupta" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "RohitGuta | AI & Software Consultant",
    description:
      "Building the future with AI and cutting-edge technology.",
    siteName: "RohitGuta",
  },
  twitter: {
    card: "summary_large_image",
    title: "RohitGuta | AI & Software Consultant",
    description:
      "Building the future with AI and cutting-edge technology.",
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
