import { Metadata } from 'next';
import ClientPage from '../../actualites/ClientPage';

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Explore the latest news, analyses and operational insights from Menua Consulting on back and middle office challenges.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/news',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/actualites',
      'en-US': 'https://menuaconsulting.com/en/news',
      'x-default': 'https://menuaconsulting.com/actualites',
    },
  },
  openGraph: {
    title: "News & Insights | Menua Consulting",
    description: "Analyses, benchmarks and publications dedicated to operational challenges.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/news',
  },
};

export default function Page() {
  return <ClientPage />;
}
