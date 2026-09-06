import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Connaître",
  description: "Découvrez l'expertise et l'organisation de Menua Consulting, votre partenaire de confiance en externalisation financière.",
  alternates: {
    canonical: 'https://menuaconsulting.com/nous-connaitre',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nous-connaitre',
      'en-US': 'https://menuaconsulting.com/en/about-us',
    },
  },
  openGraph: {
    title: "Nous Connaître | Menua Consulting",
    description: "Une organisation opérationnelle structurée pour accompagner les entreprises dans l'exécution fiable de leurs fonctions back & middle office.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/nous-connaitre',
  },
};

export default function Page() {
  return <ClientPage />;
}
