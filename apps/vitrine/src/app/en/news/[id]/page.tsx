import { Metadata } from 'next';
import ClientPageArticle from '../../../actualites/[id]/ClientPageArticle';
import { fetchArticleByIdOrSlug } from '@/lib/cms';
import { generateSlug } from '@/utils/slug';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);

  if (!article) {
    return {
      title: "Article not found",
      description: "The requested article does not exist or is no longer available.",
    };
  }

  const title = article.title_en || article.title || "News";
  const slugFr = generateSlug(article.title, article.id);
  const slugEn = generateSlug(article.title_en || article.title, article.id);
  
  let summary = "Read article on Menua Consulting.";
  const contentToExtract = article.contentHtml_en || article.contentHtml;
  if (contentToExtract) {
    const textOnly = contentToExtract.replace(/<[^>]+>/g, '').trim();
    if (textOnly) {
      summary = textOnly.substring(0, 160) + (textOnly.length > 160 ? "..." : "");
    }
  }

  return {
    title,
    description: summary,
    alternates: {
      canonical: `https://menuaconsulting.com/en/news/${slugEn}`,
      languages: {
        'fr-FR': `https://menuaconsulting.com/fr/actualites/${slugFr}`,
        'en-GB': `https://menuaconsulting.com/en/news/${slugEn}`,
        'x-default': `https://menuaconsulting.com/fr/actualites/${slugFr}`,
      },
    },
    openGraph: {
      title: `${title} | Menua Consulting`,
      description: summary,
      locale: 'en_GB',
      url: `https://menuaconsulting.com/en/news/${slugEn}`,
      ...(article.coverImageUrl && { images: [{ url: article.coverImageUrl }] })
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);
  
  return <ClientPageArticle id={resolvedParams.id} initialData={article} />;
}
