import { Metadata } from 'next';
import WhyMenuaClientPage from '@/components/pages/WhyMenuaClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Why Choose Menua Consulting? | Menua Consulting';
const description = 'A reliable operational partner to reinforce your teams and secure the continuity of your business activities.';
const canonicalUrl = `${SITE_URL}/en/why-choose-us`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Why Choose Menua Consulting?',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/pourquoi-menua`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/pourquoi-menua`,
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
  return <WhyMenuaClientPage />;
}
