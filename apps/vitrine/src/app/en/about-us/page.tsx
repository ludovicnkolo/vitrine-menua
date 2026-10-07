import { Metadata } from 'next';
import ClientPage from '../../nous-connaitre/ClientPage';

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/about-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-connaitre',
      'en-GB': 'https://menuaconsulting.com/en/about-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-connaitre',
    },
  },
  openGraph: {
    title: "About Us | Menua Consulting",
    description: "Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT.",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en/about-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us | Menua Consulting",
    description: "Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT.",
  },
};

export default function Page() {
  return <ClientPage />;
}
