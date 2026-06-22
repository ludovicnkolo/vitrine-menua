import type { Metadata } from "next";
import "../../globals.css";
import "../vitrine.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Menua Consulting | Back & Middle Office Outsourcing" : "Menua Consulting | Externalisation Back & Middle Office",
    description: isEn
      ? "Menua Consulting – Your expert partner in operational outsourcing of financial, accounting, and regulated back and middle office functions."
      : "Menua Consulting – Votre partenaire expert en externalisation opérationnelle des fonctions back et middle office financières, comptables et réglementées.",
  };
}

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar lang={lang} />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
