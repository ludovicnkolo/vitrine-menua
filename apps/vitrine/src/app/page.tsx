import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Menua Consulting",
  description: "Externalisation opérationnelle des fonctions back et middle office pour les acteurs financiers, patrimoniaux, comptables, réglementés, IT et data.",
  alternates: {
    canonical: 'https://menuaconsulting.com',
    languages: {
      'fr-FR': 'https://menuaconsulting.com',
      'en-US': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com',
    }
  },
};

export default function Page() {
  return <ClientPage />;
}
