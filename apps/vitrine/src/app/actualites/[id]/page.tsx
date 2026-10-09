import { Metadata } from 'next';
import ClientPageArticle from './ClientPageArticle';
import { fetchArticleByIdOrSlug } from '@/lib/cms';
import { generateSlug } from '@/utils/slug';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);

  if (!article) {
    return {
      title: "Article introuvable",
      description: "L'article demandé n'existe pas ou n'est plus disponible.",
    };
  }

  const title = article.title || "Actualités";
  const slugFr = generateSlug(article.title, article.id);
  const slugEn = generateSlug(article.title_en || article.title, article.id);
  
  let summary = "Lecture de l'article sur Menua Consulting.";
  if (article.contentHtml) {
    const textOnly = article.contentHtml.replace(/<[^>]+>/g, '').trim();
    if (textOnly) {
      summary = textOnly.substring(0, 160) + (textOnly.length > 160 ? "..." : "");
    }
  }

  return {
    title,
    description: summary,
    alternates: {
      canonical: `https://menuaconsulting.com/fr/actualites/${slugFr}`,
      languages: {
        'fr-FR': `https://menuaconsulting.com/fr/actualites/${slugFr}`,
        'en-GB': `https://menuaconsulting.com/en/news/${slugEn}`,
        'x-default': `https://menuaconsulting.com/fr/actualites/${slugFr}`,
      },
    },
    openGraph: {
      title: `${title} | Menua Consulting`,
      description: summary,
      locale: 'fr_FR',
      url: `https://menuaconsulting.com/fr/actualites/${slugFr}`,
      ...(article.coverImageUrl && { images: [{ url: article.coverImageUrl }] })
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);
  
  return <ClientPageArticle id={resolvedParams.id} initialData={article} />;
}
