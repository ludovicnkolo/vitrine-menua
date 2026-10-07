import type { Metadata } from "next";
import "./globals.css";

import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") === "en" ? "en" : "fr";
  const isEn = locale === "en";

  return {
    metadataBase: new URL('https://menuaconsulting.com'),
    title: {
      default: "Menua Consulting",
      template: "%s | Menua Consulting",
    },
    description: isEn
      ? "Menua Consulting secures the execution of your back and middle office operations. Our expertise covers financial, accounting, wealth management, regulated, IT and data sectors."
      : "Menua Consulting sécurise l'exécution de vos opérations back et middle office. Notre expertise couvre les métiers financiers, comptables, patrimoniaux, réglementés, IT et data.",
    keywords: isEn
      ? ["back office outsourcing", "middle office", "AMF compliance", "wealth management", "financial firms France"]
      : ["externalisation back office", "middle office", "conformité AMF", "gestion de patrimoine", "cabinets financiers France"],
    alternates: {
      canonical: 'https://menuaconsulting.com/fr',
      languages: {
        'fr-FR': 'https://menuaconsulting.com/fr',
        'en-GB': 'https://menuaconsulting.com/en',
        'x-default': 'https://menuaconsulting.com/fr',
      },
    },
    openGraph: {
      title: isEn ? "Menua Consulting | Back & Middle Office Outsourcing" : "Menua Consulting | Externalisation Back & Middle Office",
      description: isEn
        ? "We secure the execution of your back and middle office operations, allowing your teams to focus on strategic decisions."
        : "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
      url: 'https://menuaconsulting.com/fr',
      siteName: 'Menua Consulting',
      type: "website",
      locale: isEn ? "en_GB" : "fr_FR",
      alternateLocale: isEn ? "fr_FR" : "en_GB",
      images: [{ url: '/img/logo-clean-light.webp', width: 1200, height: 630, alt: 'Menua Consulting' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Menua Consulting',
      description: isEn ? 'Back and middle office operational outsourcing.' : 'Externalisation opérationnelle back et middle office.',
      images: ['/img/logo-clean-light.webp'],
    },
  };
}

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import ScrollObserver from "@/components/ScrollObserver";
import JsonLd from "@/components/JsonLd";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") === "en" ? "en" : "fr";
  const initialLang = locale === "en" ? "EN" : "FR";

  return (
    <html lang={locale} data-scroll-behavior="smooth" translate="no" className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`min-h-screen flex flex-col antialiased bg-[#f5f7fa] text-[#141824]`}>
        <JsonLd />
        <LanguageProvider initialLang={initialLang}>
          <ScrollObserver />
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
