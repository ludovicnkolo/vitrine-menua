import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site Menua Consulting.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/mentions-legales',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/mentions-legales',
      'en-GB': 'https://menuaconsulting.com/en/legal-notices',
      'x-default': 'https://menuaconsulting.com/fr/mentions-legales',
    },
  },
  openGraph: {
    title: "Mentions Légales | Menua Consulting",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/mentions-legales',
  },
};

export default function Page() {
  return <ClientPage />;
}
