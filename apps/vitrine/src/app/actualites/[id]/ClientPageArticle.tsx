'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from '@/components/Link';
import { useLanguage } from '@/components/LanguageProvider';
import { generateSlug } from '@/utils/slug';

interface Section {
  subtitle?: string;
  subtitle_en?: string;
  text?: string;
  text_en?: string;
  imageKey?: string;
  imageUrl?: string;
}

interface Publication {
  id: string;
  title: string;
  title_en?: string;
  contentHtml?: string;
  contentHtml_en?: string;
  sections?: Section[];
  sections_en?: Section[];
  category?: string;
  category_en?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default function ClientPageArticle({ id, initialData }: { id: string, initialData?: Publication | null }) {
  const { lang, t } = useLanguage();
  const [publication, setPublication] = useState<Publication | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) return; // Skip fetch if SSR provided data
    
    const fetchArticle = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const preview = params.get('preview');
        const queryStr = preview === 'true' ? '?preview=true' : '';
        
        // L'id peut être un UUID brut, ou un slug suivi d'un UUID (ex: mon-titre-1234-abcd...)
        const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        const actualId = uuidMatch ? uuidMatch[0] : id;
        
        const res = await fetch(`/api/cms/public/${actualId}${queryStr}`);
        const data = await res.json();
        if (data.success) {
          setPublication(data.data);
        } else {
          setError(data.error || (lang === 'EN' ? 'Article not found.' : 'Article introuvable.'));
        }
      } catch (err) {
        setError(lang === 'EN' ? 'Error loading article.' : 'Erreur lors du chargement de l\'article.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, initialData]);

  const isEN = lang === 'EN';
  const displayTitle = publication 
    ? (isEN && publication.title_en ? publication.title_en : publication.title) 
    : '';

  // Ensure the URL slug matches the current language
  useEffect(() => {
    if (publication && displayTitle) {
      const expectedSlug = generateSlug(displayTitle, publication.id);
      const currentPath = window.location.pathname;
      const parts = currentPath.split('/');
      const currentSlug = parts[parts.length - 1];
      
      let newSearch = window.location.search;
      let urlChanged = false;
      
      // Nettoyer le paramètre preview de l'URL pour la rendre propre
      if (newSearch.includes('preview=true')) {
        const searchParams = new URLSearchParams(newSearch);
        searchParams.delete('preview');
        newSearch = searchParams.toString();
        newSearch = newSearch ? '?' + newSearch : '';
        urlChanged = true;
      }

      if (currentSlug && currentSlug !== expectedSlug) {
        parts[parts.length - 1] = expectedSlug;
        urlChanged = true;
      }
      
      if (urlChanged) {
        const newPath = parts.join('/');
        window.history.replaceState(null, '', newPath + newSearch);
      }
    }
  }, [publication, displayTitle]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const locale = lang === 'EN' ? 'en-GB' : 'fr-FR';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  if (loading) {
    return (
      <main className="flex flex-col w-full min-h-[70vh] bg-[#f5f7fa] items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e8e1d7] border-t-[#141824] rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !publication) {
    return (
      <main className="flex flex-col w-full min-h-[70vh] bg-[#f5f7fa] items-center justify-center p-8">
        <h2 className="text-[#141824] text-2xl font-bold mb-4">{t('Erreur', 'Error')}</h2>
        <p className="text-[#6e7891] mb-8">{error || t('Article introuvable.', 'Article not found.')}</p>
        <Link href={lang === 'EN' ? '/en/news' : '/actualites'} className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-sm border-b-2 border-[#141824] pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors">
          <ArrowLeft size={16} /> {t('RETOUR AUX ACTUALITÉS', 'BACK TO NEWS')}
        </Link>
      </main>
    );
  }

  const basePath = isEN ? '/en/news' : '/actualites';
  const displayContent  = (isEN && publication.contentHtml_en) ? publication.contentHtml_en : publication.contentHtml;
  const displayCategory = (isEN && publication.category_en)    ? publication.category_en    : publication.category;

  // Sections: prefer sections_en in EN mode, fall back to FR sections
  let rawSections: Section[] = [];
  if (publication.sections_en) {
    try {
      const parsed = typeof publication.sections_en === 'string'
        ? JSON.parse(publication.sections_en)
        : publication.sections_en;
      rawSections = Array.isArray(parsed) ? parsed : [];
    } catch (_) {}
  }
  const frSections: Section[] = Array.isArray(publication.sections) ? publication.sections : [];
  
  // In EN: merge sections_en text/subtitle onto FR image keys
  const sections: Section[] = frSections.map((frSec, idx) => {
    const enSec = rawSections[idx];
    if (isEN && enSec) {
      return {
        ...frSec,
        subtitle: enSec.subtitle || frSec.subtitle,
        text: enSec.text || frSec.text,
      };
    }
    return frSec;
  });

  return (
    <main className="flex flex-col w-full bg-[#fafafa]">
      <section className="container mx-auto px-4 md:px-6 pt-32 pb-24 flex flex-col items-center">
        
        <div className="w-full max-w-4xl relative">
          
          {/* Image couverture */}
          <div className="w-full h-[350px] md:h-[450px] bg-[#1a1f2e] relative overflow-hidden">
            {publication.coverImageUrl ? (
               <img src={publication.coverImageUrl} alt={displayTitle} className="w-full h-full object-cover opacity-95" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/10 font-bold tracking-[0.2em] uppercase text-2xl md:text-4xl text-center">MENUA CONSULTING</span>
              </div>
            )}
          </div>
          
          {/* Overlay titre */}
          <div className="relative z-10 bg-white p-8 md:p-12 shadow-xl -mt-20 md:-mt-28 mx-4 md:mx-12">
            <div className="flex flex-wrap items-center justify-between mb-4">
               {displayCategory && (
                 <span className="bg-[#e8e1d7] text-[#141824] px-4 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                   {displayCategory}
                 </span>
               )}
               <span className="text-[#141824]/60 text-[0.75rem] font-medium tracking-wide uppercase ml-auto">
                 {formatDate(publication.publishedAt || publication.createdAt)}
               </span>
            </div>
            
            <h1 className="text-[#141824] text-3xl md:text-4xl font-bold leading-tight mt-4 uppercase">
              {displayTitle}
            </h1>
          </div>

          {/* Contenu principal */}
          <div className="mt-12 px-4 md:px-12">
            {displayContent && (
              <div 
                className="prose prose-lg max-w-none text-[#333] font-light leading-relaxed whitespace-pre-wrap prose-headings:font-bold prose-headings:text-[#141824] prose-headings:uppercase prose-a:text-[#c1a070] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}

            {/* ── SECTIONS ── */}
            {sections.length > 0 && (
              <div className="mt-12 space-y-16">
                {sections.map((sec, idx) => (
                  <div key={idx} className="border-t border-[#e8e1d7] pt-12">
                    
                    {/* Sous-titre */}
                    {sec.subtitle && (
                      <h2 className="text-[#141824] text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
                        {sec.subtitle}
                      </h2>
                    )}

                    {/* Image de section */}
                    {(sec.imageUrl || sec.imageKey) && (
                      <div className="w-full mb-8 overflow-hidden rounded-xl shadow-md">
                        <img
                          src={sec.imageUrl || sec.imageKey}
                          alt={sec.subtitle || `Section ${idx + 1}`}
                          className="w-full max-h-[420px] object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* Texte de section */}
                    {sec.text && (
                      <div className="text-[#333] font-light leading-relaxed text-lg whitespace-pre-wrap">
                        {sec.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Retour */}
            <div className="mt-20 pt-8 border-t border-[#e8e1d7]">
              <Link href={basePath} className="inline-flex items-center gap-3 text-[#141824] font-bold uppercase tracking-wider text-sm hover:text-[#c1a070] transition-colors">
                <ArrowLeft size={18} /> {t('RETOUR AUX ACTUALITÉS', 'BACK TO NEWS')}
              </Link>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
