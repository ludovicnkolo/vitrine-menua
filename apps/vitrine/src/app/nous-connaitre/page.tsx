import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Connaître",
  description: "Découvrez l'expertise et l'organisation de Menua Consulting, votre partenaire de confiance en externalisation financière.",
};

export default function Page() {
  return <ClientPage />;
}
