import { Metadata } from 'next';
import LegalNoticesClientPage from '@/components/pages/LegalNoticesClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: "Mentions Légales",
  description: "Mentions légales du site Menua Consulting.",
  alternates: {
    canonical: `${SITE_URL}/fr/mentions-legales`,
    languages: {
      'fr-FR': `${SITE_URL}/fr/mentions-legales`,
      'en-GB': `${SITE_URL}/en/legal-notices`,
      'x-default': `${SITE_URL}/fr/mentions-legales`,
    },
  },
  openGraph: {
    title: "Mentions Légales | Menua Consulting",
    locale: 'fr_FR',
    url: `${SITE_URL}/fr/mentions-legales`,
  },
  };
}

export default function Page() {
  return <LegalNoticesClientPage />;
}
