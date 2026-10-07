import { Metadata } from 'next';
import ClientPage from '../ClientPage';

export const metadata: Metadata = {
  title: "Menua Consulting | Back & Middle Office Outsourcing",
  description: "Menua Consulting supports finance, accounting, insurance, wealth management, compliance, data and IT teams with operational outsourcing across back and middle office functions.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr',
      'en-GB': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com/fr',
    },
  },
  openGraph: {
    title: "Menua Consulting | Back & Middle Office Outsourcing",
    description: "Menua Consulting supports finance, accounting, insurance, wealth management, compliance, data and IT teams with operational outsourcing across back and middle office functions.",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Menua Consulting | Back & Middle Office Outsourcing",
    description: "Menua Consulting supports finance, accounting, insurance, wealth management, compliance, data and IT teams with operational outsourcing across back and middle office functions.",
  },
  keywords: [
    "back office outsourcing",
    "middle office support",
    "compliance services",
    "wealth management support",
    "financial services outsourcing"
  ],
};

export default function Page() {
  return <ClientPage />;
}
