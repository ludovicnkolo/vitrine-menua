import { Metadata } from 'next';
import PrivacyPolicyClientPage from '@/components/pages/PrivacyPolicyClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité et de gestion des données personnelles de Menua Consulting.",
  alternates: {
    canonical: `${SITE_URL}/fr/politique-de-confidentialite`,
    languages: {
      'fr-FR': `${SITE_URL}/fr/politique-de-confidentialite`,
      'en-GB': `${SITE_URL}/en/privacy-policy`,
      'x-default': `${SITE_URL}/fr/politique-de-confidentialite`,
    },
  },
  openGraph: {
    title: "Politique de Confidentialité | Menua Consulting",
    locale: 'fr_FR',
    url: `${SITE_URL}/fr/politique-de-confidentialite`,
  },
  };
}

export default function Page() {
  return <PrivacyPolicyClientPage />;
}
