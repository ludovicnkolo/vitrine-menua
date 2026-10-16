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

/**
 * Retourne la liste ordonnée des URLs candidates pour joindre l'API CMS
 * que ce soit dans Docker (http://backend:4000), en local (127.0.0.1:4000)
 * ou via le domaine public (https://menuaconsulting.com).
 */
export function getBackendCandidateUrls(): string[] {
  const candidates: string[] = [];

  // 1. Variable d'environnement explicite
  if (process.env.BACKEND_URL) {
    candidates.push(process.env.BACKEND_URL);
  }

  // 2. Réseau interne Docker Compose
  candidates.push('http://backend:4000');

  // 3. API URL client/hôte configurée
  if (process.env.NEXT_PUBLIC_API_URL) {
    candidates.push(process.env.NEXT_PUBLIC_API_URL);
  }

  // 4. Hôte local (dev ou SSR sur machine hôte)
  candidates.push('http://127.0.0.1:4000');
  candidates.push('http://localhost:4000');

  // 5. URL de production publique (fallback ultime résilient)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    candidates.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  candidates.push('https://menuaconsulting.com');

  // Déduplication tout en préservant l'ordre de priorité
  return Array.from(new Set(candidates.map((u) => u.replace(/\/+$/, ''))));
}

export function getBackendUrl(): string {
  const candidates = getBackendCandidateUrls();
  return candidates[0] || 'http://backend:4000';
}

/**
 * Récupère les actualités publiées pour le SSR et la génération du sitemap
 */
export async function fetchPublishedNews(): Promise<Publication[]> {
  const candidates = getBackendCandidateUrls();

  for (const base of candidates) {
    try {
      const endpoint = base.endsWith('/api')
        ? `${base}/cms/public?type=ACTUALITE`
        : `${base}/api/cms/public?type=ACTUALITE`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
        next: { revalidate: 60 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch {
      // Échec rapide vers le candidat suivant
      continue;
    }
  }

  return [];
}

/**
 * Récupère un article par son ID ou son slug canonique
 */
export async function fetchArticleByIdOrSlug(idOrSlug: string): Promise<Publication | null> {
  const uuidMatch = idOrSlug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  const actualId = uuidMatch ? uuidMatch[0] : idOrSlug;
  const candidates = getBackendCandidateUrls();

  for (const base of candidates) {
    try {
      const endpoint = base.endsWith('/api')
        ? `${base}/cms/public/${actualId}`
        : `${base}/api/cms/public/${actualId}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
        next: { revalidate: 60 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}
