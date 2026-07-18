import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Pourquoi Menua Consulting ?",
  description: "Un partenaire opérationnel fiable pour renforcer vos équipes et sécuriser la continuité de vos activités.",
  alternates: { canonical: '/pourquoi-menua' },
};

export default function Page() {
  return <ClientPage />;
}
