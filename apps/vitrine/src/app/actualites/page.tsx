import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Actualités & Expertise",
  description: "Suivez les actualités, analyses et décryptages de Menua Consulting sur les enjeux du back et middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/actualites',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/actualites',
      'en-US': 'https://menuaconsulting.com/en/news',
      'x-default': 'https://menuaconsulting.com/fr/actualites',
    },
  },
  openGraph: {
    title: "Actualités & Expertise | Menua Consulting",
    description: "Analyses, repères et publications consacrés aux enjeux opérationnels des entreprises et cabinets.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/actualites',
  },
};

async function getPublications() {
  try {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000';
    const res = await fetch(`${backendUrl}/api/cms/public?type=ACTUALITE`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.error("SSR getPublications error:", err);
  }
  return [];
}

export default async function Page() {
  const publications = await getPublications();
  return <ClientPage initialPublications={publications} />;
}
