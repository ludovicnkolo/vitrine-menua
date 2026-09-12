import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Menua Consulting",
  description: "Externalisation opérationnelle des fonctions back et middle office pour les acteurs financiers, patrimoniaux, comptables, réglementés, IT et data.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr',
      'en-US': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com/fr',
    }
  },
};

export default function Page() {
  return <ClientPage />;
}
