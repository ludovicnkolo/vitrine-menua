'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  contentHtml: string;
  category?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default function ClientPageArticle({ id }: { id: string }) {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/cms/public/${id}`);
        const data = await res.json();
        if (data.success) {
          setPublication(data.data);
        } else {
          setError(data.error || 'Article introuvable.');
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'article.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
        <h2 className="text-[#141824] text-2xl font-bold mb-4">Erreur</h2>
        <p className="text-[#6e7891] mb-8">{error || 'Article introuvable.'}</p>
        <a href="/actualites" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-sm border-b-2 border-[#141824] pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors">
          <ArrowLeft size={16} /> RETOUR AUX ACTUALITÉS
        </a>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full bg-[#fafafa]">
      <section className="container mx-auto px-4 md:px-6 pt-32 pb-24 flex flex-col items-center">
        
        <div className="w-full max-w-4xl relative">
          
          {/* Image Box */}
          <div className="w-full h-[350px] md:h-[450px] bg-[#1a1f2e] relative overflow-hidden">
            {publication.coverImageUrl ? (
               <img src={publication.coverImageUrl} alt={publication.title} className="w-full h-full object-cover opacity-95" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/10 font-bold tracking-[0.2em] uppercase text-2xl md:text-4xl text-center">MENUA CONSULTING</span>
              </div>
            )}
          </div>
          
          {/* Overlay Box */}
          <div className="relative z-10 bg-white p-8 md:p-12 shadow-xl -mt-20 md:-mt-28 mx-4 md:mx-12">
            <div className="flex flex-wrap items-center justify-between mb-4">
               {publication.category && (
                 <span className="bg-[#e8e1d7] text-[#141824] px-4 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                   {publication.category}
                 </span>
               )}
               <span className="text-[#141824]/60 text-[0.75rem] font-medium tracking-wide uppercase ml-auto">
                 {formatDate(publication.publishedAt || publication.createdAt)}
               </span>
            </div>
            
            <h1 className="text-[#141824] text-3xl md:text-4xl font-bold leading-tight mt-4 uppercase">
              {publication.title}
            </h1>
          </div>

          {/* ARTICLE CONTENT */}
          <div className="mt-12 px-4 md:px-12">
            <div 
              className="prose prose-lg max-w-none text-[#333] font-light leading-relaxed prose-headings:font-bold prose-headings:text-[#141824] prose-headings:uppercase prose-a:text-[#c1a070] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: publication.contentHtml || '' }}
            />
            
            <div className="mt-20 pt-8 border-t border-[#e8e1d7]">
              <a href="/actualites" className="inline-flex items-center gap-3 text-[#141824] font-bold uppercase tracking-wider text-sm hover:text-[#c1a070] transition-colors">
                <ArrowLeft size={18} /> RETOUR AUX ACTUALITÉS
              </a>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
