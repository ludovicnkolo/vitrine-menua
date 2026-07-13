import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Menua Consulting",
  description: "Politique de confidentialité et de gestion des données personnelles de Menua Consulting.",
};

export default function Page() {
  return <ClientPage />;
}
