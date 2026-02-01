import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { defaultMetadata, generateAllSchemas } from "@/lib/seo-config";

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

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
});

// Export centralized SEO metadata
export const metadata: Metadata = defaultMetadata;

// JSON-LD Schema Component (invisible to users, readable by Google)
function JsonLdSchema() {
  const schemas = generateAllSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable} ${notoArabic.variable}`}>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <JsonLdSchema />

        {/* Additional SEO meta tags */}
        <meta name="author" content="Rohit Raj" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />

        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
