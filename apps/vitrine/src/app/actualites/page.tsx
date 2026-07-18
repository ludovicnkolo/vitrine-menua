import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Actualités & Expertise",
  description: "Suivez les actualités, analyses et décryptages de Menua Consulting sur les enjeux du back et middle office.",
  alternates: { canonical: '/actualites' },
};

export default function Page() {
  return <ClientPage />;
}
