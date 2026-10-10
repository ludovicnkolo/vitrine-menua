import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsArticleClientPage from '@/components/pages/NewsArticleClientPage';
import { fetchArticleByIdOrSlug } from '@/lib/cms';
import { generateSlug } from '@/utils/slug';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);

  if (!article) {
    return {
      title: "Article not found",
      description: "The requested article does not exist or is no longer available.",
    };
  }

  const baseTitle = article.title_en || article.title || "News";
  const title = `${baseTitle} | Menua Consulting`;
  const slugFr = generateSlug(article.title, article.id);
  const slugEn = generateSlug(article.title_en || article.title, article.id);
  
  let description = "Read article on Menua Consulting.";
  const contentToExtract = article.contentHtml_en || article.contentHtml;
  if (contentToExtract) {
    const textOnly = contentToExtract.replace(/<[^>]+>/g, '').trim();
    if (textOnly) {
      description = textOnly.substring(0, 160) + (textOnly.length > 160 ? "..." : "");
    }
  }

  const canonicalUrl = `${SITE_URL}/en/news/${slugEn}`;
  const images = article.coverImageUrl ? [{ url: article.coverImageUrl, alt: title }] : undefined;

  return {
    title: baseTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-FR': `${SITE_URL}/fr/actualites/${slugFr}`,
        'en-GB': canonicalUrl,
        'x-default': `${SITE_URL}/fr/actualites/${slugFr}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: 'en_GB',
      url: canonicalUrl,
      type: 'article',
      ...(images && { images })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images && { images: [images[0].url] })
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await fetchArticleByIdOrSlug(resolvedParams.id);
  
  if (!article) {
    notFound();
  }
  
  return <NewsArticleClientPage id={resolvedParams.id} initialData={article} />;
}
