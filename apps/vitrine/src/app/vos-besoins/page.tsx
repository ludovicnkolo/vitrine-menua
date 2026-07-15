import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Vos Besoins",
  description: "Finance, conformité, data : nous répondons à vos besoins de renfort opérationnel et de gestion déléguée.",
};

export default function Page() {
  return <ClientPage />;
}
