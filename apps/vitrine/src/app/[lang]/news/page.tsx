import { Metadata } from 'next';
import NewsClientPage, { Publication } from '@/components/pages/NewsClientPage';
import { fetchPublishedNews } from '@/lib/cms';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'News & Insights | Menua Consulting';
const description = 'Follow Menua Consulting\'s news, analysis and insights on operational, back and middle office challenges.';
const canonicalUrl = `${SITE_URL}/en/news`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr': `${SITE_URL}/fr/actualites`,
        'en': `${SITE_URL}/en/news`,
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
      siteName: 'Menua Consulting',
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

export default async function Page() {
  let publications: Publication[] = [];

  try {
    publications = (await fetchPublishedNews()) ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités en anglais (SSR):", error);
  }

  return <NewsClientPage initialPublications={publications} />;
}
