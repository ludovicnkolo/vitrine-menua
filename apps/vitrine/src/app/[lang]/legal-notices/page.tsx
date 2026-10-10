import { Metadata } from 'next';
import LegalNoticesClientPage from '@/components/pages/LegalNoticesClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Legal Notices | Menua Consulting';
const description = 'Legal notices of the Menua Consulting website.';
const canonicalUrl = `${SITE_URL}/en/legal-notices`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Legal Notices',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/mentions-legales`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/mentions-legales`,
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
  return <LegalNoticesClientPage />;
}
