import { Metadata } from 'next';
import ClientPage from '../../politique-de-confidentialite/ClientPage';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy and personal data management policy of Menua Consulting.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/privacy-policy',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/politique-de-confidentialite',
      'en-GB': 'https://menuaconsulting.com/en/privacy-policy',
      'x-default': 'https://menuaconsulting.com/fr/politique-de-confidentialite',
    },
  },
  openGraph: {
    title: "Privacy Policy | Menua Consulting",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/privacy-policy',
  },
};

export default function Page() {
  return <ClientPage />;
}
