import { Metadata } from 'next';
import ClientPage from '../../mentions-legales/ClientPage';

export const metadata: Metadata = {
  title: "Legal Notices",
  description: "Legal notices of the Menua Consulting website.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/legal-notices',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/mentions-legales',
      'en-GB': 'https://menuaconsulting.com/en/legal-notices',
      'x-default': 'https://menuaconsulting.com/fr/mentions-legales',
    },
  },
  openGraph: {
    title: "Legal Notices | Menua Consulting",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en/legal-notices',
  },
};

export default function Page() {
  return <ClientPage />;
}
