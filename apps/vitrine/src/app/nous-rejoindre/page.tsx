import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Rejoindre",
  description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office.",
  alternates: {
    canonical: 'https://menuaconsulting.com/nous-rejoindre',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nous-rejoindre',
      'en-US': 'https://menuaconsulting.com/en/join-us',
    },
  },
  openGraph: {
    title: "Nous Rejoindre | Menua Consulting",
    description: "Rejoignez Menua Consulting. Recrutement de profils opérationnels rigoureux.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/nous-rejoindre',
  },
};

export default function Page() {
  return <ClientPage />;
}
