import type { Metadata } from 'next';
import NewsClientPage, { Publication } from '@/components/pages/NewsClientPage';
import { fetchPublishedNews } from '@/lib/cms';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  
  const title = isEn ? "News & Insights | Menua Consulting" : "Actualités & Expertise | Menua Consulting";
  const description = isEn 
    ? "Follow Menua Consulting's news, analysis and insights on operational, back and middle office challenges." 
    : "Suivez les actualités, analyses et décryptages de Menua Consulting sur les enjeux opérationnels, back et middle office.";
  const canonicalUrl = isEn ? `${SITE_URL}/en/news` : `${SITE_URL}/fr/actualites`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-FR': `${SITE_URL}/fr/actualites`,
        'en-GB': `${SITE_URL}/en/news`,
        'x-default': `${SITE_URL}/fr/actualites`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Menua Consulting',
      locale: isEn ? 'en_GB' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: '/img/accueil-actus.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/img/accueil-actus.webp'],
    },
  };
}

export const revalidate = 60;

export default async function Page() {
  let publications: Publication[] = [];

  try {
    publications = (await fetchPublishedNews()) ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités (SSR):", error);
  }

  return <NewsClientPage initialPublications={publications} />;
}
