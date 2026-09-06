import { Metadata } from 'next';
import ClientPage from '../../mentions-legales/ClientPage';

export const metadata: Metadata = {
  title: "Legal Notices",
  description: "Legal notices of the Menua Consulting website.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/legal-notices',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/mentions-legales',
      'en-US': 'https://menuaconsulting.com/en/legal-notices',
    },
  },
  openGraph: {
    title: "Legal Notices | Menua Consulting",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/legal-notices',
  },
};

export default function Page() {
  return <ClientPage />;
}
