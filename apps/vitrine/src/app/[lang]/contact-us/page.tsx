import { Metadata } from 'next';
import ContactClientPage from '@/components/pages/ContactClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = 'Contact Us | Menua Consulting';
const description = 'Contact Menua Consulting to discuss your operational outsourcing needs and back/middle office support.';
const canonicalUrl = `${SITE_URL}/en/contact-us`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: 'Contact Us',
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}/fr/nous-contacter`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}/fr/nous-contacter`,
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
  return <ContactClientPage />;
}
