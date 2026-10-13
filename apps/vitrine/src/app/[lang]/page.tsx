import { Metadata } from 'next';
import HomeClientPage from '@/components/pages/HomeClientPage';
import { fetchPublishedNews } from '@/lib/cms';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  const titleEn = 'Menua Consulting | Back & Middle Office Outsourcing Firm in Paris';
  const descriptionEn = 'Operational outsourcing firm based in Paris: Menua Consulting supports financial, accounting, insurance and investment management teams across back & middle office functions.';
  
  const titleFr = 'Menua Consulting | Cabinet d’Externalisation Back & Middle Office à Paris';
  const descriptionFr = 'Cabinet d’externalisation opérationnelle à Paris : Menua Consulting accompagne les directions financières, comptables, bancaires et gestion d’actifs sur leurs fonctions back & middle office.';

  const canonicalUrl = isEn ? `${SITE_URL}/en` : `${SITE_URL}/fr`;
  const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

  return {
    title: { absolute: isEn ? titleEn : titleFr },
    description: isEn ? descriptionEn : descriptionFr,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-FR': `${SITE_URL}/fr`,
        'en-GB': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title: isEn ? titleEn : titleFr,
      description: isEn ? descriptionEn : descriptionFr,
      locale: isEn ? 'en_GB' : 'fr_FR',
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: isEn ? titleEn : titleFr,
        },
      ],
      siteName: 'Menua Consulting',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? titleEn : titleFr,
      description: isEn ? descriptionEn : descriptionFr,
      images: [ogImageUrl],
    },
  };
}

export default async function Page() {
  const publications = await fetchPublishedNews();
  return <HomeClientPage initialPublications={publications} />;
}
