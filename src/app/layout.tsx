import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

/* ── Nunito Sans = police principale Laplace Groupe ── */
const fontNunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

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
      <body className={`${fontNunito.variable} font-sans min-h-screen flex flex-col antialiased bg-[#f5f7fa] text-[#31374a]`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
