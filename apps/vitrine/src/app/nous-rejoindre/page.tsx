import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Nous Rejoindre",
  description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office.",
  alternates: { canonical: '/nous-rejoindre' },
};

export default function Page() {
  return <ClientPage />;
}
