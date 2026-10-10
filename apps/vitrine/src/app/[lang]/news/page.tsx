import { Metadata } from 'next';
import NewsClientPage from '@/components/pages/NewsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'News & Insights | Menua Consulting';
const description = 'Explore the latest news, analyses and operational insights from Menua Consulting on back and middle office challenges.';
const canonicalUrl = `${SITE_URL}/en/news`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'News & Insights',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/actualites`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/actualites`,
    },
  },
  openGraph: {
    title,
    description,
    locale: 'en_GB',
    url: canonicalUrl,
    type: 'website',
    images: [
      {
        url: ogImageUrl,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImageUrl],
  },
  };
}

export default function Page() {
  return <NewsClientPage />;
}
