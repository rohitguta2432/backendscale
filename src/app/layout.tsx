import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RohitGuta | Software Consultancy",
  description:
    "Expert software consultant helping businesses build, optimize, and scale their digital products. From greenfield projects to complex problem-solving.",
  keywords: [
    "software consultant",
    "full stack developer",
    "technical consulting",
    "software development",
    "system architecture",
    "AI integration",
    "web development",
    "mobile development",
  ],
  authors: [{ name: "Rohit Gupta" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "RohitGuta | Software Consultancy",
    description:
      "Build, optimize, and scale your software with expert consulting.",
    siteName: "RohitGuta",
  },
  twitter: {
    card: "summary_large_image",
    title: "RohitGuta | Software Consultancy",
    description:
      "Build, optimize, and scale your software with expert consulting.",
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
