import { Metadata } from 'next';
import WhyMenuaClientPage from '@/components/pages/WhyMenuaClientPage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(SITE_URL),
  title: "Pourquoi Menua Consulting ?",
  description: "Un accompagnement opérationnel fiable pour renforcer vos équipes et sécuriser la continuité de vos activités.",
  alternates: {
    canonical: `${SITE_URL}/fr/pourquoi-menua`,
    languages: {
      'fr-FR': `${SITE_URL}/fr/pourquoi-menua`,
      'en-GB': `${SITE_URL}/en/why-choose-us`,
      'x-default': `${SITE_URL}/fr/pourquoi-menua`,
    },
  },
  openGraph: {
    title: "Pourquoi Menua Consulting ? | Menua Consulting",
    description: "Rigueur opérationnelle, maîtrise de la charge interne et continuité d'activité.",
    locale: 'fr_FR',
    url: `${SITE_URL}/fr/pourquoi-menua`,
  },
  };
}

export default function Page() {
  return <WhyMenuaClientPage />;
}
