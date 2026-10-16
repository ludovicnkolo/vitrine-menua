import { generateSlug } from '@/utils/slug';

export interface Publication {
  id: string;
  title: string;
  title_en?: string;
  type: string;
  category?: string;
  category_en?: string;
  contentHtml?: string;
  contentHtml_en?: string;
  sections?: any[];
  sections_en?: any;
  coverImage?: string;
  coverImageUrl?: string;
  status?: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: {
    name?: string;
  };
}

export function getBackendUrl(): string {
  // During local 'npm run build', NODE_ENV is 'production' but we are not in docker.
  // So we default to 127.0.0.1:4000 if BACKEND_URL is not explicitly set.
  const defaultUrl = process.env.BACKEND_URL_DOCKER === 'true' ? 'http://backend:4000' : 'http://127.0.0.1:4000';
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    defaultUrl
  );
}

export async function fetchPublishedNews(): Promise<Publication[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/cms/public?type=ACTUALITE`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Error fetching CMS news:', err);
  }
  return [];
}

export async function fetchArticleByIdOrSlug(idOrSlug: string): Promise<Publication | null> {
  try {
    const uuidMatch = idOrSlug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const actualId = uuidMatch ? uuidMatch[0] : idOrSlug;
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/cms/public/${actualId}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Error fetching article:', err);
  }
  return null;
}
