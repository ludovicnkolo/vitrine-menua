import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Connaître",
  description: "Découvrez Menua Consulting, spécialiste de l’externalisation opérationnelle back & middle office pour la finance, la comptabilité, l’assurance, la gestion de patrimoine, la conformité, la data et l’IT.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/nous-connaitre',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-connaitre',
      'en-US': 'https://menuaconsulting.com/en/about-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-connaitre',
    },
  },
  openGraph: {
    title: "Nous Connaître | Menua Consulting",
    description: "Découvrez Menua Consulting, spécialiste de l’externalisation opérationnelle back & middle office pour la finance, la comptabilité, l’assurance, la gestion de patrimoine, la conformité, la data et l’IT.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/nous-connaitre',
  },
};

export default function Page() {
  return <ClientPage />;
}
