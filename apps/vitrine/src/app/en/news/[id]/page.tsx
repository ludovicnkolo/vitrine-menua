import { Metadata } from 'next';
import ClientPageArticle from '../../../actualites/[id]/ClientPageArticle';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: "Article | Menua Consulting",
    description: "Read article on Menua Consulting.",
    alternates: {
      canonical: `https://menuaconsulting.com/en/news/${resolvedParams.id}`,
      languages: {
        'fr-FR': `https://menuaconsulting.com/actualites/${resolvedParams.id}`,
        'en-US': `https://menuaconsulting.com/en/news/${resolvedParams.id}`,
      },
    },
    openGraph: {
      title: "Article | Menua Consulting",
      locale: 'en_US',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ClientPageArticle id={resolvedParams.id} />;
}
