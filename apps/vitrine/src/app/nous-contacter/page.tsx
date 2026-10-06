import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Contacter",
  description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/nous-contacter',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-contacter',
      'en-GB': 'https://menuaconsulting.com/en/contact-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-contacter',
    },
  },
  openGraph: {
    title: "Nous Contacter | Menua Consulting",
    description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/nous-contacter',
  },
};

export default function Page() {
  return <ClientPage />;
}
