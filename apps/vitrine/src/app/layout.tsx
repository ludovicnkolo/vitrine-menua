import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://menuaconsulting.com'),
  title: {
    default: "Menua Consulting",
    template: "%s | Menua Consulting",
  },
  description:
    "Menua Consulting sécurise l'exécution de vos opérations back et middle office. Notre expertise couvre les métiers financiers, comptables, patrimoniaux, réglementés, IT et data.",
  keywords: [
    "externalisation back office",
    "middle office",
    "conformité AMF",
    "gestion de patrimoine",
    "cabinets financiers France",
  ],
  alternates: {
    canonical: 'https://menuaconsulting.com/fr',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr',
      'en-GB': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com/fr',
    },
  },
  openGraph: {
    title: "Menua Consulting | Externalisation Back & Middle Office",
    description:
      "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
    url: 'https://menuaconsulting.com/fr',
    siteName: 'Menua Consulting',
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_GB",
    images: [{ url: '/img/logo-clean-light.webp', width: 1200, height: 630, alt: 'Menua Consulting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menua Consulting',
    description: 'Externalisation opérationnelle back et middle office.',
    images: ['/img/logo-clean-light.webp'],
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import ScrollObserver from "@/components/ScrollObserver";
import { headers } from "next/headers";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Menua Consulting',
              url: 'https://menuaconsulting.com',
              logo: 'https://menuaconsulting.com/img/logo-clean-light.webp',
              email: 'contact@menuaconsulting.com',
              telephone: '+33686877914',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '92 rue des Pyrénées',
                postalCode: '75020',
                addressLocality: 'Paris',
                addressCountry: 'FR'
              },
              areaServed: 'FR',
              serviceType: 'Externalisation opérationnelle back et middle office'
            })
          }}
        />
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
