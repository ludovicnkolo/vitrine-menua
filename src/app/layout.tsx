import type { Metadata } from "next";
import { Rosario, Playfair_Display } from "next/font/google";
import "./globals.css";

const optimaAlternative = Rosario({
  subsets: ["latin"],
  variable: "--font-optima",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const operettaAlternative = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-operetta",
  weight: ["400", "500", "600", "700"],
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
      <body className={`${optimaAlternative.variable} ${operettaAlternative.variable} min-h-screen flex flex-col antialiased bg-[#ffffff] text-[#222222]`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
