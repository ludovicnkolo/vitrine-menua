import { Metadata } from 'next';
import OurSolutionsClientPage from '@/components/pages/OurSolutionsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Our Solutions | Menua Consulting';
const description = 'Discover our tailored outsourcing solutions to secure and streamline your back and middle office operations.';
const canonicalUrl = `${SITE_URL}/en/our-solutions`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Our Solutions',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/nos-solutions`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/nos-solutions`,
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
  return <OurSolutionsClientPage />;
}
