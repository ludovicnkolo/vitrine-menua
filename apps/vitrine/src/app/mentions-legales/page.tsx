import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Mentions Légales | Menua Consulting",
  description: "Mentions légales du site Menua Consulting.",
};

export default function Page() {
  return <ClientPage />;
}
