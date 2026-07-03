import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ── DM Sans = police corps — g simple boucle nativement ── */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* ── Playfair Display (titres) ── */
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: "Menua Consulting | Externalisation Back & Middle Office",
  description:
    "Menua Consulting sécurise l'exécution de vos opérations back et middle office pour banques, cabinets de gestion de patrimoine, sociétés financières et experts-comptables en France.",
  keywords: [
    "externalisation back office",
    "middle office",
    "conformité AMF",
    "gestion de patrimoine",
    "cabinets financiers France",
  ],
  openGraph: {
    title: "Menua Consulting | Externalisation Back & Middle Office",
    description:
      "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
    type: "website",
    locale: "fr_FR",
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans min-h-screen flex flex-col antialiased bg-[#F5F2EB] text-[#223930]`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
