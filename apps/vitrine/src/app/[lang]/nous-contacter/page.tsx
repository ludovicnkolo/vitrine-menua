import { Metadata } from 'next';
import ContactClientPage from '@/components/pages/ContactClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: "Nous Contacter",
  description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
  alternates: {
    canonical: `${SITE_URL}/fr/nous-contacter`,
    languages: {
      'fr-FR': `${SITE_URL}/fr/nous-contacter`,
      'en-GB': `${SITE_URL}/en/contact-us`,
      'x-default': `${SITE_URL}/fr/nous-contacter`,
    },
  },
  openGraph: {
    title: "Nous Contacter | Menua Consulting",
    description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
    locale: 'fr_FR',
    url: `${SITE_URL}/fr/nous-contacter`,
  },
  };
}

export default function Page() {
  return <ContactClientPage />;
}
