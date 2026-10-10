import { Metadata } from 'next';
import YourNeedsClientPage from '@/components/pages/YourNeedsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Your Needs | Menua Consulting';
const description = 'Finance, compliance, data and wealth management: operational support and operational outsourcing tailored to your needs.';
const canonicalUrl = `${SITE_URL}/en/your-needs`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Your Needs',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/vos-besoins`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/vos-besoins`,
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
  return <YourNeedsClientPage />;
}
