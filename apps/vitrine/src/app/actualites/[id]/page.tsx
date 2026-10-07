import { Metadata } from 'next';
import ClientPageArticle from './ClientPageArticle';

async function getArticle(id: string) {
  try {
    const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const actualId = uuidMatch ? uuidMatch[0] : id;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    const res = await fetch(`${backendUrl}/api/cms/public/${actualId}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);

  if (!article) {
    return {
      title: "Article introuvable | Menua Consulting",
      description: "L'article demandé n'existe pas ou n'est plus disponible.",
    };
  }

  const title = article.title || "Article | Menua Consulting";
  
  let summary = "Lecture de l'article sur Menua Consulting.";
  if (article.contentHtml) {
    const textOnly = article.contentHtml.replace(/<[^>]+>/g, '').trim();
    if (textOnly) {
      summary = textOnly.substring(0, 160) + (textOnly.length > 160 ? "..." : "");
    }
  }

  return {
    title: `${title} | Menua Consulting`,
    description: summary,
    alternates: {
      canonical: `https://menuaconsulting.com/fr/actualites/${resolvedParams.id}`,
      languages: {
        'fr-FR': `https://menuaconsulting.com/fr/actualites/${resolvedParams.id}`,
        'en-GB': `https://menuaconsulting.com/en/news/${resolvedParams.id}`,
        'x-default': `https://menuaconsulting.com/fr/actualites/${resolvedParams.id}`,
      },
    },
    openGraph: {
      title: `${title} | Menua Consulting`,
      description: summary,
      locale: 'fr_FR',
      url: `https://menuaconsulting.com/fr/actualites/${resolvedParams.id}`,
      ...(article.coverImageUrl && { images: [{ url: article.coverImageUrl }] })
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);
  
  return <ClientPageArticle id={resolvedParams.id} initialData={article} />;
}
