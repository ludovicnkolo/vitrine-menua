import { Metadata } from 'next';
import ClientPage from '../../nos-solutions/ClientPage';

export const metadata: Metadata = {
  title: "Our Solutions",
  description: "Discover our tailored outsourcing solutions to secure and streamline your back and middle office operations.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/our-solutions',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nos-solutions',
      'en-US': 'https://menuaconsulting.com/en/our-solutions',
      'x-default': 'https://menuaconsulting.com/fr/nos-solutions',
    },
  },
  openGraph: {
    title: "Our Solutions | Menua Consulting",
    description: "Operational outsourcing solutions tailored for finance and wealth management institutions.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/our-solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Solutions | Menua Consulting",
    description: "Operational outsourcing solutions tailored for finance and wealth management institutions.",
  },
};

export default function Page() {
  return <ClientPage />;
}
