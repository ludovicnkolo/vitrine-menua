import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Nous Rejoindre | Menua Consulting",
  description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office.",
};

export default function Page() {
  return <ClientPage />;
}
