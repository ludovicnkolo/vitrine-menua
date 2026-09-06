import { Metadata } from 'next';
import ClientPage from '../../nous-connaitre/ClientPage';

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover the expertise and structured operational organization of Menua Consulting, your trusted partner in operational back and middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/about-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nous-connaitre',
      'en-US': 'https://menuaconsulting.com/en/about-us',
    },
  },
  openGraph: {
    title: "About Us | Menua Consulting",
    description: "A structured operational organization supporting businesses in the reliable execution of back and middle office functions.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/about-us',
  },
};

export default function Page() {
  return <ClientPage />;
}
