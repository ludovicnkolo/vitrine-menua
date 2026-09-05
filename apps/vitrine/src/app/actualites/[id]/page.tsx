import { Metadata } from 'next';
import ClientPageArticle from './ClientPageArticle';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: "Article | Menua Consulting",
    description: "Lecture de l'article sur Menua Consulting.",
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <ClientPageArticle id={params.id} />;
}
