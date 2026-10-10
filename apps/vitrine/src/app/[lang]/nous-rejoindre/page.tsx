import { Metadata } from 'next';
import JoinUsClientPage from '@/components/pages/JoinUsClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: "Nous Rejoindre",
  description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office.",
  alternates: {
    canonical: `${SITE_URL}/fr/nous-rejoindre`,
    languages: {
      'fr-FR': `${SITE_URL}/fr/nous-rejoindre`,
      'en-GB': `${SITE_URL}/en/join-us`,
      'x-default': `${SITE_URL}/fr/nous-rejoindre`,
    },
  },
  openGraph: {
    title: "Nous Rejoindre | Menua Consulting",
    description: "Rejoignez Menua Consulting. Recrutement de profils opérationnels rigoureux.",
    locale: 'fr_FR',
    url: `${SITE_URL}/fr/nous-rejoindre`,
  },
  };
}

export default function Page() {
  return <JoinUsClientPage />;
}
