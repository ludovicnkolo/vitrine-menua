import type { Metadata } from "next";
import { Inter, Playfair_Display, Lobster_Two } from "next/font/google";

import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import ScrollObserver from "@/components/ScrollObserver";
import JsonLd from "@/components/JsonLd";

// Optimisation native des polices avec next/font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lobster = Lobster_Two({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lobster",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://menuaconsulting.com";

export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const localePath = isEn ? "en" : "fr";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Menua Consulting",
      template: "%s | Menua Consulting",
    },
    description: isEn
      ? "Menua Consulting secures the execution of your back and middle office operations. Our expertise covers financial, accounting, wealth management, regulated, IT and data sectors."
      : "Menua Consulting sécurise l'exécution de vos opérations back et middle office. Notre expertise couvre les métiers financiers, comptables, patrimoniaux, réglementés, IT et data.",
    alternates: {
      canonical: `${SITE_URL}/${localePath}`,
      languages: {
        "fr-FR": `${SITE_URL}/fr`,
        "en-GB": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title: isEn
        ? "Menua Consulting | Back & Middle Office Outsourcing"
        : "Menua Consulting | Externalisation Back & Middle Office",
      description: isEn
        ? "We secure the execution of your back and middle office operations, allowing your teams to focus on strategic decisions."
        : "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
      url: `${SITE_URL}/${localePath}`,
      siteName: "Menua Consulting",
      type: "website",
      locale: isEn ? "en_GB" : "fr_FR",
      alternateLocale: isEn ? "fr_FR" : "en_GB",
      images: [
        {
          url: "/img/logo-clean-light.webp",
          width: 1200,
          height: 630,
          alt: "Menua Consulting",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Menua Consulting",
      description: isEn
        ? "Back and middle office operational outsourcing."
        : "Externalisation opérationnelle back et middle office.",
      images: ["/img/logo-clean-light.webp"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const isEn = lang === "en";
  const locale = isEn ? "en" : "fr";
  const initialLang = isEn ? "EN" : "FR";

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      translate="no"
      className={`notranslate ${inter.variable} ${playfair.variable} ${lobster.variable}`}
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#f5f7fa] text-[#141824] font-sans">
        <JsonLd isEn={isEn} />
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
