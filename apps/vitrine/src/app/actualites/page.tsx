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

export default function Page() {
  return <ClientPage />;
}
