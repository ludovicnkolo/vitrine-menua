import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Menua Consulting",
  description: "Cabinet de conseil spécialisé dans l'externalisation opérationnelle des fonctions back et middle office pour les acteurs financiers.",
  alternates: { canonical: '/' },
};

export default function Page() {
  return <ClientPage />;
}
