import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Vos Besoins",
  description: "Finance, conformité, data : nous répondons à vos besoins de renfort opérationnel et de gestion déléguée.",
  alternates: {
    canonical: 'https://menuaconsulting.com/vos-besoins',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/vos-besoins',
      'en-US': 'https://menuaconsulting.com/en/your-needs',
      'x-default': 'https://menuaconsulting.com/vos-besoins',
    },
  },
  openGraph: {
    title: "Vos Besoins | Menua Consulting",
    description: "Finance, conformité, data : renfort opérationnel et gestion déléguée.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/vos-besoins',
  },
};

export default function Page() {
  return <ClientPage />;
}
