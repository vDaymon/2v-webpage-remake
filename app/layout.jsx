import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · 2V Digital",
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    site: SITE.twitter,
    creator: SITE.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo-2v.png", type: "image/png" }],
    shortcut: "/logo-2v.png",
    apple: "/logo-2v.png",
  },
  // Pegá tu código de Google Search Console en SITE.googleVerification
  verification: SITE.googleVerification ? { google: SITE.googleVerification } : undefined,
  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a0e2e" },
    { media: "(prefers-color-scheme: light)", color: "#F4EFFA" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo-2v.png`,
        width: 512,
        height: 512,
      },
      description: SITE.description,
      email: SITE.email,
      sameAs: SITE.sameAs,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SITE.phoneE164,
          contactType: "sales",
          areaServed: ["AR", "LATAM"],
          availableLanguage: ["Spanish", "English"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "es-AR",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#business`,
      name: SITE.name,
      image: `${SITE.url}/logo-2v.png`,
      url: SITE.url,
      telephone: SITE.phoneE164,
      email: SITE.email,
      priceRange: "$$",
      description: SITE.description,
      areaServed: ["AR", "LATAM", "Europa"],
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      sameAs: SITE.sameAs,
      makesOffer: [
        "Diseño web y SEO",
        "Marketing digital",
        "Software a medida",
        "E-commerce",
        "Branding",
      ].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark" data-cursor="on">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
