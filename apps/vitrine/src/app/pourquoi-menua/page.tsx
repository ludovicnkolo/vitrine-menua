import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Pourquoi Menua Consulting ?",
  description: "Un partenaire opérationnel fiable pour renforcer vos équipes et sécuriser la continuité de vos activités.",
  alternates: {
    canonical: 'https://menuaconsulting.com/pourquoi-menua',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/pourquoi-menua',
      'en-US': 'https://menuaconsulting.com/en/why-choose-us',
    },
  },
  openGraph: {
    title: "Pourquoi Menua Consulting ? | Menua Consulting",
    description: "Rigueur opérationnelle, maîtrise de la charge interne et continuité d'activité.",
    locale: 'fr_FR',
    url: 'https://menuaconsulting.com/pourquoi-menua',
  },
};

export default function Page() {
  return <ClientPage />;
}
