import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Menua Consulting | Externalisation Back & Middle Office",
  description: "Menua Consulting accompagne les équipes finance, comptabilité, assurance, gestion de patrimoine, conformité, data et IT dans l’externalisation opérationnelle de fonctions back & middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr',
      'en-US': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com/fr',
    }
  },
  openGraph: {
    title: "Menua Consulting | Externalisation Back & Middle Office",
    description: "Menua Consulting accompagne les équipes finance, comptabilité, assurance, gestion de patrimoine, conformité, data et IT dans l’externalisation opérationnelle de fonctions back & middle office.",
    url: 'https://menuaconsulting.com/fr',
    siteName: 'Menua Consulting',
    locale: 'fr_FR',
  },
};

export default function Page() {
  return <ClientPage />;
}
