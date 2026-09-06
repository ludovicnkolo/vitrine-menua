import { Metadata } from 'next';
import ClientPage from '../ClientPage';

export const metadata: Metadata = {
  title: "Operational Back and Middle Office Outsourcing",
  description: "Operational outsourcing of back and middle office functions for financial institutions, wealth managers, accounting firms, regulated actors, IT and data.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en',
    languages: {
      'fr-FR': 'https://menuaconsulting.com',
      'en-US': 'https://menuaconsulting.com/en',
      'x-default': 'https://menuaconsulting.com',
    },
  },
  openGraph: {
    title: "Menua Consulting | Operational Back and Middle Office Outsourcing",
    description: "We secure the execution of your back and middle office operations, allowing your teams to focus on strategic decisions.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en',
  },
};

export default function Page() {
  return <ClientPage />;
}
