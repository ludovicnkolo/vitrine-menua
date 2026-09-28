import { Metadata } from 'next';
import ClientPage from '../../nous-connaitre/ClientPage';

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover the expertise and structured operational organisation of Menua Consulting, your trusted partner in operational back and middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/about-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-connaitre',
      'en-US': 'https://menuaconsulting.com/en/about-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-connaitre',
    },
  },
  openGraph: {
    title: "About Us | Menua Consulting",
    description: "A structured operational organisation supporting businesses in the reliable execution of back and middle office functions.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/about-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us | Menua Consulting",
    description: "A structured operational organisation supporting businesses in the reliable execution of back and middle office functions.",
  },
};

export default function Page() {
  return <ClientPage />;
}
