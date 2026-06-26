"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Gem } from "lucide-react";
import { use } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Translation = { fr: string; en: string };
type PageData = { title: Translation; description: Translation; image: string; content: Translation };

const pourquoiMenuaData: Record<string, PageData> = {
  "nos-benefices": {
    title: { 
      fr: "Nos bénéfices", 
      en: "Our Benefits" 
    },
    description: { 
      fr: "Vous gagnez du temps, améliorez votre productivité et renforcez votre fiabilité.",
      en: "You save time, improve your productivity, and strengthen your reliability."
    },
    image: "/pourquoi-menua-hero.jpg",
    content: { 
      fr: "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d’affaires.\n\nCette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d’activité et de fidéliser durablement votre clientèle.\n\n### Bénéfices pour votre organisation :\n- Gain de temps\n- Réduction des charges internes\n- Productivité accrue\n- Efficacité renforcée\n- Fiabilité des opérations\n- Fidélisation de la clientèle\n- Chiffre d’affaires soutenu",
      en: "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity, strengthen your reliability, and sustainably support your revenue.\n\nThis organization allows you to reduce your internal costs, better absorb your business volumes, and sustainably build customer loyalty.\n\n### Benefits for your organization:\n- Time savings\n- Reduction of internal costs\n- Increased productivity\n- Enhanced efficiency\n- Reliability of operations\n- Customer loyalty\n- Sustained revenue"
    }
  },
  "notre-differenciation": {
    title: { 
      fr: "Notre différenciation", 
      en: "Our Differentiation" 
    },
    description: { 
      fr: "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.",
      en: "Specialists in back and middle office, we do not stop at analysis: we execute."
    },
    image: "/notebook.jpg",
    content: { 
      fr: "### Pourquoi nous choisir ?\nSpécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.\n\nNotre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d’intervention en français comme en anglais nous permettent d’intervenir dans des environnements exigeants, structurés et ouverts à l’international.\n\n### Notre force :\n- Spécialisation back et middle office\n- Approche 100% opérationnelle\n- Intégration à votre organisation\n- Exécution fiable et continue\n- Supervision qualité des livrables\n- Intervention bilingue français / anglais",
      en: "### Why choose us?\nSpecialists in back and middle office, we do not stop at analysis: we execute.\n\nOur 100% operational approach, our integration into client organizations, and our ability to operate in both French and English allow us to intervene in demanding, structured, and internationally open environments.\n\n### Our strength:\n- Back and middle office specialization\n- 100% operational approach\n- Integration into your organization\n- Reliable and continuous execution\n- Quality supervision of deliverables\n- Bilingual French / English intervention"
    }
  },
  "nos-engagements": {
    title: { 
      fr: "Nos engagements", 
      en: "Our Commitments" 
    },
    description: { 
      fr: "MENUA CONSULTING s’engage sur l’essentiel : la qualité, le respect des délais et la traçabilité.",
      en: "MENUA CONSULTING commits to the essentials: quality, meeting deadlines, and traceability."
    },
    image: "/nous-rejoindre-hero.jpg",
    content: { 
      fr: "MENUA CONSULTING s’engage sur l’essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.\n\nNos interventions s’appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.\n\n### Notre expertise garantit :\n- Qualité des livrables\n- Respect des délais\n- Traçabilité des opérations\n- Contrôle à quatre yeux\n- Communication claire et régulière\n- Formation des ressources mobilisées\n- Respect de vos exigences opérationnelles, qualité et réglementaires",
      en: "MENUA CONSULTING commits to the essentials: the quality of deliverables, meeting deadlines, traceability of operations, and clear communication with your teams.\n\nOur interventions are based on a four-eyes control, structured working methods, training of mobilized resources, and compliance with your operational, quality, and regulatory requirements.\n\n### Our expertise guarantees:\n- Quality of deliverables\n- Meeting deadlines\n- Traceability of operations\n- Four-eyes control\n- Clear and regular communication\n- Training of mobilized resources\n- Compliance with your operational, quality, and regulatory requirements"
    }
  }
};

export default function PourquoiMenuaDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const pageData = pourquoiMenuaData[slug];

  if (!pageData) {
    notFound();
  }

  const lang = (language === 'EN' ? 'en' : 'fr') as keyof Translation;

  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-2xl font-bold mt-10 mb-4 text-[#1E2A3A] flex items-center gap-3"><span className="w-8 h-[1px] bg-[#C89B5E]"></span>{block.replace('### ', '')}</h3>;
      }
      if (block.includes('\n- ')) {
        const lines = block.split('\n');
        return (
          <ul key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 mb-8">
            {lines.filter(line => line.startsWith('- ')).map((item, i) => (
              <li key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-[#fbfbfb] hover:bg-white hover:shadow-md hover:border-[#C89B5E]/40 transition-all duration-300 group">
                <CheckCircle2 className="text-[#C89B5E] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-sm text-gray-700 leading-relaxed font-medium">{item.replace('- ', '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      if (idx === 0) {
        return (
          <p key={idx} className="text-gray-700 leading-loose mb-6 text-lg font-light">
            <span className="float-left text-5xl font-serif text-[#C89B5E] pr-3 pt-2 leading-none">{block.charAt(0)}</span>
            {block.slice(1)}
          </p>
        );
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-6 font-light">{block}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#F8F9FA] text-[#1E2A3A] font-sans min-h-screen">
      <section className="relative w-full min-h-[75vh] flex items-end overflow-hidden pt-32 bg-[#0F2B45]">
        <div className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2B45] via-[#0F2B45]/90 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B45] via-[#0F2B45]/40 to-transparent z-10"></div>
          <img src={pageData.image} alt={pageData.title[lang]} className="w-full h-full object-cover opacity-50" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto pb-20">
          <div className="text-[#C89B5E] text-[0.65rem] tracking-[0.2em] uppercase mb-6 flex items-center flex-wrap gap-3 font-bold">
            <Link href="/" className="hover:text-white transition-colors">{t("Accueil", "Home")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <Link href="/pourquoi-menua" className="hover:text-white transition-colors">{t("Pourquoi Menua ?", "Why Menua?")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <span className="text-white">{pageData.title[lang]}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 max-w-4xl text-white">
            {pageData.title[lang]}
          </h1>
          <div className="w-16 h-[2px] bg-[#C89B5E] mb-8"></div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            {pageData.description[lang]}
          </p>
        </div>
      </section>

      <section className="px-8 py-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#0F2B45] rounded-full flex items-center justify-center text-[#C89B5E]">
                    <Gem size={20} />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#1E2A3A]">{t("En détail", "In detail")}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent(pageData.content[lang])}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-[#0F2B45] text-white p-10 rounded-2xl sticky top-32 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-6 leading-snug">{t("Rejoignez nos clients", "Join our clients")}</h3>
                <div className="w-8 h-1 bg-[#C89B5E] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                  {t(
                    "Faites appel à des experts dédiés à l'exécution de vos opérations de back et middle office.",
                    "Call on dedicated experts to execute your back and middle office operations."
                  )}
                </p>
                <Link href="/nous-contacter" className="flex items-center justify-center gap-4 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-6 py-4 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#C89B5E]/20 w-full group">
                  {t("Nous contacter", "Contact us")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
