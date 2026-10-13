import { Metadata } from 'next';
import AboutUsClientPage from '@/components/pages/AboutUsClientPage';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  return {
    title: isEn ? "About Us" : "Nous Connaître",
    description: isEn
      ? "Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT."
      : "Découvrez Menua Consulting, spécialiste de l’externalisation opérationnelle back & middle office pour la finance, la comptabilité, l’assurance, la gestion de patrimoine, la conformité, la data et l’IT.",
    alternates: {
      canonical: isEn ? 'https://menuaconsulting.com/en/about-us' : 'https://menuaconsulting.com/fr/nous-connaitre',
      languages: {
        'fr': 'https://menuaconsulting.com/fr/nous-connaitre',
        'en': 'https://menuaconsulting.com/en/about-us',
        'fr-FR': 'https://menuaconsulting.com/fr/nous-connaitre',
        'en-GB': 'https://menuaconsulting.com/en/about-us',
        'x-default': 'https://menuaconsulting.com/fr/nous-connaitre',
      },
    },
    openGraph: {
      title: isEn ? "About Us | Menua Consulting" : "Nous Connaître | Menua Consulting",
      description: isEn
        ? "Discover Menua Consulting, an operational outsourcing firm supporting back and middle office functions across finance, accounting, insurance, wealth management, compliance, data and IT."
        : "Découvrez Menua Consulting, spécialiste de l’externalisation opérationnelle back & middle office pour la finance, la comptabilité, l’assurance, la gestion de patrimoine, la conformité, la data et l’IT.",
      locale: isEn ? 'en_GB' : 'fr_FR',
      url: isEn ? 'https://menuaconsulting.com/en/about-us' : 'https://menuaconsulting.com/fr/nous-connaitre',
    },
  };
}

export default function Page() {
  return <AboutUsClientPage />;
}
