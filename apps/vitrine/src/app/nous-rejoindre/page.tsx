import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Rejoindre",
  description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/nous-rejoindre',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-rejoindre',
      'en-GB': 'https://menuaconsulting.com/en/join-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-rejoindre',
    },
  },
  openGraph: {
    title: "Nous Rejoindre | Menua Consulting",
    description: "Rejoignez Menua Consulting. Recrutement de profils opérationnels rigoureux.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/nous-rejoindre',
  },
};

export default function Page() {
  return <ClientPage />;
}
