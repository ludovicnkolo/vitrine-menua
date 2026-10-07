import { Metadata } from 'next';
import ClientPage from '../../nous-rejoindre/ClientPage';

export const metadata: Metadata = {
  title: "Join Us",
  description: "Join Menua Consulting. We recruit rigorous operational talent to support back and middle office missions.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/join-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-rejoindre',
      'en-GB': 'https://menuaconsulting.com/en/join-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-rejoindre',
    },
  },
  openGraph: {
    title: "Join Us | Menua Consulting",
    description: "Build your career with Menua Consulting in specialized back and middle office operational functions.",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en/join-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Join Us | Menua Consulting",
    description: "Build your career with Menua Consulting in specialized back and middle office operational functions.",
  },
};

export default function Page() {
  return <ClientPage />;
}
