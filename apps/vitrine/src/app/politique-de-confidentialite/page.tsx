import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité et de gestion des données personnelles de Menua Consulting.",
  alternates: { canonical: '/politique-de-confidentialite' },
};

export default function Page() {
  return <ClientPage />;
}
