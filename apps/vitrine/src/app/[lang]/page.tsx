import { Metadata } from 'next';
import HomeClientPage from '@/components/pages/HomeClientPage';
import { fetchPublishedNews } from '@/lib/cms';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  const titleEn = 'Menua Consulting | Back & Middle Office Outsourcing | Menua Consulting';
  const descriptionEn = 'Menua Consulting supports finance, accounting, insurance, wealth management, compliance, data and IT teams with operational outsourcing across back and middle office functions.';
  
  const titleFr = 'Menua Consulting | Externalisation Back & Middle Office';
  const descriptionFr = 'Menua Consulting accompagne les équipes finance, comptabilité, assurance, gestion de patrimoine, conformité, data et IT dans l’externalisation opérationnelle de fonctions back & middle office.';

  const canonicalUrl = isEn ? `${SITE_URL}/en` : `${SITE_URL}/fr`;
  const ogImageUrl = isEn ? `${SITE_URL}/img/accueil-actus.webp` : `${SITE_URL}/fr`; // keeping the original logic, maybe ogImageUrl for fr wasn't set but we can use default or ogImageUrl

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
      images: isEn ? [{ url: ogImageUrl, alt: titleEn }] : undefined,
      siteName: 'Menua Consulting',
    },
    twitter: isEn ? {
      card: 'summary_large_image',
      title: titleEn,
      description: descriptionEn,
      images: [ogImageUrl],
    } : undefined,
  };
}

export default async function Page() {
  const publications = await fetchPublishedNews();
  return <HomeClientPage initialPublications={publications} />;
}
