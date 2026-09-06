import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Contacter",
  description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/nous-contacter',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nous-contacter',
      'en-US': 'https://menuaconsulting.com/en/contact-us',
    },
  },
  openGraph: {
    title: "Nous Contacter | Menua Consulting",
    description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/nous-contacter',
  },
};

export default function Page() {
  return <ClientPage />;
}
