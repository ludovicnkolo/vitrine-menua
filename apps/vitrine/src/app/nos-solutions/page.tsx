import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nos Solutions d'Externalisation",
  description: "Découvrez nos solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/nos-solutions',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nos-solutions',
      'en-US': 'https://menuaconsulting.com/en/our-solutions',
      'x-default': 'https://menuaconsulting.com/nos-solutions',
    },
  },
  openGraph: {
    title: "Nos Solutions d'Externalisation | Menua Consulting",
    description: "Solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/nos-solutions',
  },
};

export default function Page() {
  return <ClientPage />;
}
