import { Metadata } from 'next';
import { headers } from 'next/headers';
import ClientPage from './ClientPage';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get('x-locale') === 'en' ? 'en' : 'fr';
  const isEn = locale === 'en';

  return {
    title: isEn ? "Our Outsourcing Solutions" : "Nos Solutions d'Externalisation",
    description: isEn
      ? "Discover our tailored operational outsourcing solutions to secure and streamline your back and middle office operations."
      : "Découvrez nos solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office.",
    alternates: {
      canonical: isEn ? 'https://menuaconsulting.com/en/our-solutions' : 'https://menuaconsulting.com/fr/nos-solutions',
      languages: {
        'fr-FR': 'https://menuaconsulting.com/fr/nos-solutions',
        'en-GB': 'https://menuaconsulting.com/en/our-solutions',
        'x-default': 'https://menuaconsulting.com/fr/nos-solutions',
      },
    },
    openGraph: {
      title: isEn ? "Our Solutions | Menua Consulting" : "Nos Solutions d'Externalisation | Menua Consulting",
      description: isEn
        ? "Tailored operational outsourcing solutions to secure and streamline your back and middle office."
        : "Solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office.",
      locale: isEn ? 'en_GB' : 'fr_FR',
      url: isEn ? 'https://menuaconsulting.com/en/our-solutions' : 'https://menuaconsulting.com/fr/nos-solutions',
    },
  };
}

export default function Page() {
  return <ClientPage />;
}
