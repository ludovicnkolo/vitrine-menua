import { Metadata } from 'next';
import AboutUsClientPage from '@/components/pages/AboutUsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'About Us | Menua Consulting';
const description = 'Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT.';
const canonicalUrl = `${SITE_URL}/en/about-us`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'About Us',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr': `${SITE_URL}/fr/nous-connaitre`,
      'en': `${SITE_URL}/en/about-us`,
      'fr-FR': `${SITE_URL}/fr/nous-connaitre`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/nous-connaitre`,
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
  return <AboutUsClientPage />;
}
