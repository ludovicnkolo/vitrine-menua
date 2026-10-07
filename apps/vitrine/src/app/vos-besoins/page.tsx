import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Vos Besoins",
  description: "Finance, conformité, data : nous répondons à vos besoins de renfort opérationnel et de support fonctionnel.",
  alternates: {
    canonical: 'https://menuaconsulting.com/fr/vos-besoins',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/vos-besoins',
      'en-GB': 'https://menuaconsulting.com/en/your-needs',
      'x-default': 'https://menuaconsulting.com/fr/vos-besoins',
    },
  },
  openGraph: {
    title: "Vos Besoins | Menua Consulting",
    description: "Finance, conformité, data : renfort opérationnel et support fonctionnel.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/fr/vos-besoins',
  },
};

export default function Page() {
  return <ClientPage />;
}
