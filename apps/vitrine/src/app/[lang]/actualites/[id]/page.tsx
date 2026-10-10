import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import NewsArticleClientPage from '@/components/pages/NewsArticleClientPage';
import { fetchArticleByIdOrSlug } from '@/lib/cms';
import { generateSlug } from '@/utils/slug';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Déduplique les requêtes CMS entre generateMetadata et Page si fetch n'est pas utilisé en interne
const getArticle = cache(async (id: string) => {
  return fetchArticleByIdOrSlug(id);
});

function createSummary(htmlContent?: string): string {
  if (!htmlContent) return "Lecture de l'article sur Menua Consulting.";
  
  // Nettoyage sommaire des balises et entités courantes
  const cleanText = htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanText.length > 160 ? `${cleanText.slice(0, 157)}...` : cleanText;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Article introuvable",
      description: "L'article demandé n'existe pas ou n'est plus disponible.",
      robots: { index: false, follow: false },
    };
  }

  const title = article.title || "Actualités";
  const slugFr = generateSlug(article.title, article.id);
  const slugEn = generateSlug(article.title_en || article.title, article.id);
  const summary = createSummary(article.contentHtml);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

  return {
    title,
    description: summary,
    alternates: {
      canonical: `${siteUrl}/fr/actualites/${slugFr}`,
      languages: {
        'fr-FR': `${siteUrl}/fr/actualites/${slugFr}`,
        'en-GB': `${siteUrl}/en/news/${slugEn}`,
        'x-default': `${siteUrl}/fr/actualites/${slugFr}`,
      },
    },
    openGraph: {
      title: `${title} | Menua Consulting`,
      description: summary,
      locale: 'fr_FR',
      url: `${siteUrl}/fr/actualites/${slugFr}`,
      ...(article.coverImageUrl && { images: [{ url: article.coverImageUrl }] }),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return <NewsArticleClientPage id={id} initialData={article} />;
}
