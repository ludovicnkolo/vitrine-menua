import type { Metadata } from "next";
import { Inter, Playfair_Display, Lobster_Two } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lobsterTwo = Lobster_Two({
  subsets: ["latin"],
  variable: "--font-lobster",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://menuaconsulting.com'),
  title: {
    default: "Menua Consulting",
    template: "%s | Menua Consulting",
  },
  description:
    "Menua Consulting sécurise l'exécution de vos opérations back et middle office pour banques, cabinets de gestion de patrimoine, sociétés financières et experts-comptables en France.",
  keywords: [
    "externalisation back office",
    "middle office",
    "conformité AMF",
    "gestion de patrimoine",
    "cabinets financiers France",
  ],
  alternates: {
    languages: {
      'fr-FR': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "Menua Consulting",
    description:
      "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
    url: 'https://menuaconsulting.com',
    siteName: 'Menua Consulting',
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import ScrollObserver from "@/components/ScrollObserver";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} ${lobsterTwo.variable} min-h-screen flex flex-col antialiased bg-[#f5f7fa] text-[#141824]`}>
        <LanguageProvider>
          <ScrollObserver />
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
