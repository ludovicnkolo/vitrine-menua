import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité et de gestion des données personnelles de Menua Consulting.",
  alternates: {
    canonical: 'https://menuaconsulting.com/politique-de-confidentialite',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/politique-de-confidentialite',
      'en-US': 'https://menuaconsulting.com/en/privacy-policy',
      'x-default': 'https://menuaconsulting.com/politique-de-confidentialite',
    },
  },
  openGraph: {
    title: "Politique de Confidentialité | Menua Consulting",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/politique-de-confidentialite',
  },
};

export default function Page() {
  return <ClientPage />;
}
