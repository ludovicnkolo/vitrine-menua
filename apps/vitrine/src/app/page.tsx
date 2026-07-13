import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Menua Consulting | Externalisation Back & Middle Office",
  description: "Cabinet de conseil spécialisé dans l'externalisation opérationnelle des fonctions back et middle office pour les acteurs financiers.",
};

export default function Page() {
  return <ClientPage />;
}
