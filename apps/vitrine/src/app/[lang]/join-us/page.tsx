import { Metadata } from 'next';
import JoinUsClientPage from '@/components/pages/JoinUsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Join Us | Menua Consulting';
const description = 'Join Menua Consulting. We recruit rigorous operational talent to support back and middle office missions.';
const canonicalUrl = `${SITE_URL}/en/join-us`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Join Us',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/nous-rejoindre`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/nous-rejoindre`,
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
  return <JoinUsClientPage />;
}
