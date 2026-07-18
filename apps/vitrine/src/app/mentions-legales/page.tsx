import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  
  title: "Mentions Légales",
  description: "Mentions légales du site Menua Consulting.",
  alternates: { canonical: '/mentions-legales' },
};

export default function Page() {
  return <ClientPage />;
}
