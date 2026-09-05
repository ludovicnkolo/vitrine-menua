import { Metadata } from 'next';
import ClientPageArticle from './ClientPageArticle';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: "Article | Menua Consulting",
    description: "Lecture de l'article sur Menua Consulting.",
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ClientPageArticle id={resolvedParams.id} />;
}
