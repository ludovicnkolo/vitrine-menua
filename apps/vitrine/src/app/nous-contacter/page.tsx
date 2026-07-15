import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Contacter",
  description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office.",
};

export default function Page() {
  return <ClientPage />;
}
