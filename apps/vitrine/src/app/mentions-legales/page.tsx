import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site Menua Consulting.",
  alternates: {
    canonical: 'https://menuaconsulting.com/mentions-legales',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/mentions-legales',
      'en-US': 'https://menuaconsulting.com/en/legal-notices',
    },
  },
  openGraph: {
    title: "Mentions Légales | Menua Consulting",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/mentions-legales',
  },
};

export default function Page() {
  return <ClientPage />;
}
