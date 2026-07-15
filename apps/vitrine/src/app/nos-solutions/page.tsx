import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nos Solutions d'Externalisation",
  description: "Découvrez nos solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office.",
};

export default function Page() {
  return <ClientPage />;
}
