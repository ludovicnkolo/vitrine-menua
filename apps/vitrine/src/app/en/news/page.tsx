import { Metadata } from 'next';
import ClientPage from '../../actualites/ClientPage';

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Explore the latest news, analyses and operational insights from Menua Consulting on back and middle office challenges.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/news',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/actualites',
      'en-GB': 'https://menuaconsulting.com/en/news',
      'x-default': 'https://menuaconsulting.com/fr/actualites',
    },
  },
  openGraph: {
    title: "News & Insights | Menua Consulting",
    description: "Analyses, benchmarks and publications dedicated to operational challenges.",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en/news',
  },
  twitter: {
    card: 'summary_large_image',
    title: "News & Insights | Menua Consulting",
    description: "Analyses, benchmarks and publications dedicated to operational challenges.",
  },
};

import { fetchPublishedNews } from '@/lib/cms';

export default async function Page() {
  const publications = await fetchPublishedNews();
  return <ClientPage initialPublications={publications} />;
}
