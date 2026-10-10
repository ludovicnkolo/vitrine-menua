'use client';

import React, { useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import Link from '@/components/Link';
import { useLanguage } from '@/components/LanguageProvider';
import { generateSlug } from '@/utils/slug';

export interface Section {
  subtitle?: string;
  subtitle_en?: string;
  text?: string;
  text_en?: string;
  imageKey?: string;
  imageUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  title_en?: string;
  contentHtml?: string;
  contentHtml_en?: string;
  sections?: Section[] | string;
  sections_en?: Section[] | string;
  category?: string;
  category_en?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
}

interface ClientPageArticleProps {
  id: string;
  initialData: Publication;
}

export default function ClientPageArticle({ id, initialData }: ClientPageArticleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const isEN = lang === 'EN';
  const displayTitle = (isEN && initialData.title_en) ? initialData.title_en : initialData.title;
  const rawDisplayContent = (isEN && initialData.contentHtml_en) ? initialData.contentHtml_en : initialData.contentHtml;
  
  // Sanitize content with DOMPurify
  const displayContent = useMemo(() => {
    if (!rawDisplayContent) return '';
    return DOMPurify.sanitize(rawDisplayContent);
  }, [rawDisplayContent]);

  const displayCategory = (isEN && initialData.category_en) ? initialData.category_en : initialData.category;
  const basePath = isEN ? '/en/news' : '/actualites';

  // Synchronisation de l'URL avec le slug linguistique et purge du mode preview via le routeur Next.js
  useEffect(() => {
    if (!initialData || !displayTitle) return;

    const expectedSlug = generateSlug(displayTitle, initialData.id);
    const pathSegments = pathname.split('/');
    const currentSlug = pathSegments[pathSegments.length - 1];

    const currentParams = new URLSearchParams(searchParams.toString());
    const hasPreview = currentParams.has('preview');

    if (hasPreview) {
      currentParams.delete('preview');
    }

    const isSlugMismatch = currentSlug !== expectedSlug;
    if (isSlugMismatch || hasPreview) {
      pathSegments[pathSegments.length - 1] = expectedSlug;
      const newPath = pathSegments.join('/');
      const queryString = currentParams.toString();
      const targetUrl = queryString ? `${newPath}?${queryString}` : newPath;

      router.replace(targetUrl, { scroll: false });
    }
  }, [displayTitle, initialData, pathname, searchParams, router]);

  // Parsing et fusion optimisés des sections
  const sections = useMemo<Section[]>(() => {
    const parseSections = (data?: Section[] | string): Section[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const fr = parseSections(initialData.sections);
    const en = parseSections(initialData.sections_en);

    return fr.map((frSec, idx) => {
      const enSec = en[idx];
      if (isEN && enSec) {
        return {
          ...frSec,
          subtitle: enSec.subtitle || frSec.subtitle,
          text: enSec.text || frSec.text,
        };
      }
      return frSec;
    });
  }, [initialData.sections, initialData.sections_en, isEN]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isEN ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#fafafa]">
      <article className="container mx-auto px-4 md:px-6 pt-32 pb-24 flex flex-col items-center">
        <div className="w-full max-w-4xl relative">
          
          {/* Image de couverture */}
          <div className="w-full h-[350px] md:h-[450px] bg-[#1a1f2e] relative overflow-hidden">
            {initialData.coverImageUrl ? (
              <Image
                src={initialData.coverImageUrl}
                alt={displayTitle}
                fill
                priority
                className="object-cover opacity-95"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/10 font-bold tracking-[0.2em] uppercase text-2xl md:text-4xl text-center">
                  MENUA CONSULTING
                </span>
              </div>
            )}
          </div>

          {/* En-tête titre */}
          <header className="relative z-10 bg-white p-8 md:p-12 shadow-xl -mt-20 md:-mt-28 mx-4 md:mx-12">
            <div className="flex flex-wrap items-center justify-between mb-4">
              {displayCategory && (
                <span className="bg-[#e8e1d7] text-[#141824] px-4 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                  {displayCategory}
                </span>
              )}
              <time
                dateTime={initialData.publishedAt || initialData.createdAt}
                className="text-[#141824]/60 text-[0.75rem] font-medium tracking-wide uppercase ml-auto"
              >
                {formatDate(initialData.publishedAt || initialData.createdAt)}
              </time>
            </div>

            <h1 className="text-[#141824] text-3xl md:text-4xl font-bold leading-tight mt-4 uppercase">
              {displayTitle}
            </h1>
          </header>

          {/* Corps de l'article */}
          <div className="mt-12 px-4 md:px-12">
            {displayContent && (
              <div
                className="prose prose-lg max-w-none text-[#333] font-light leading-relaxed whitespace-pre-wrap prose-headings:font-bold prose-headings:text-[#141824] prose-headings:uppercase prose-a:text-[#c1a070] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}

            {/* Sections */}
            {sections.length > 0 && (
              <div className="mt-12 space-y-16">
                {sections.map((sec, idx) => {
                  const imageSrc = sec.imageUrl || sec.imageKey;
                  return (
                    <section key={idx} className="border-t border-[#e8e1d7] pt-12">
                      {sec.subtitle && (
                        <h2 className="text-[#141824] text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                          {sec.subtitle}
                        </h2>
                      )}

                      {imageSrc && (
                        <div className="relative w-full h-[420px] mb-8 overflow-hidden rounded-xl shadow-md">
                          <Image
                            src={imageSrc}
                            alt={sec.subtitle || `Section ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 896px"
                          />
                        </div>
                      )}

                      {sec.text && (
                        <p className="text-[#333] font-light leading-relaxed text-lg whitespace-pre-wrap">
                          {sec.text}
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {/* Navigation retour */}
            <footer className="mt-20 pt-8 border-t border-[#e8e1d7]">
              <Link
                href={basePath}
                className="inline-flex items-center gap-3 text-[#141824] font-bold uppercase tracking-wider text-sm hover:text-[#c1a070] transition-colors"
              >
                <ArrowLeft size={18} /> {t('RETOUR AUX ACTUALITÉS', 'BACK TO NEWS')}
              </Link>
            </footer>
          </div>

        </div>
      </article>
    </main>
  );
}
