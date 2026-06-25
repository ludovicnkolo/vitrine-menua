"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Settings } from "lucide-react";
import { use } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Translation = { fr: string; en: string };
type PageData = { title: Translation; description: Translation; image: string; content: Translation };

const nosSolutionsData: Record<string, PageData> = {
  "urgence": {
    title: { 
      fr: "Urgence – Capacité de réaction", 
      en: "Urgency – Responsiveness" 
    },
    description: { 
      fr: "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat.",
      en: "Rapid mobilization of operational resources to meet an immediate need."
    },
    image: "/headphones.jpg",
    content: { 
      fr: "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d’activité et assurer la continuité de votre service.\n\n### Comment ?\n- Surcharge d’activité ou pic de dossiers\n- Remplacement temporaire d’un collaborateur absent\n- Renfort ponctuel en période de clôture ou de reporting\n- Traitement accéléré de dossiers en retard ou en attente\n- Mise à disposition progressive de ressources pour sécuriser la montée en charge",
      en: "Rapid mobilization of operational resources to meet an immediate need, absorb a peak in activity, and ensure the continuity of your service.\n\n### How?\n- Activity overload or peak in files\n- Temporary replacement of an absent employee\n- Punctual reinforcement during closing or reporting periods\n- Accelerated processing of delayed or pending files\n- Progressive provision of resources to secure the ramp-up"
    }
  },
  "duree": {
    title: { 
      fr: "Durée – Flexibilité contractuelle", 
      en: "Duration – Contractual Flexibility" 
    },
    description: { 
      fr: "Des dispositifs d’externalisation flexibles, adaptés dans le temps.",
      en: "Flexible outsourcing arrangements, adaptable over time."
    },
    image: "/vos-besoins-hero.jpg",
    content: { 
      fr: "MENUA CONSULTING propose des dispositifs d’externalisation flexibles, adaptés au traitement d’un nombre défini de dossiers comme à la gestion récurrente d’un portefeuille plus important.\n\n### Notre expertise nous permet de vous garantir :\n- Mission courte pour traiter un besoin identifié sur une période limitée\n- Mission longue pour accompagner la gestion d’un portefeuille de dossiers dans la durée\n- Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles\n- Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs\n- Ajustement du dispositif selon l’évolution de la charge et des priorités du client",
      en: "MENUA CONSULTING offers flexible outsourcing arrangements, adapted to the processing of a defined number of files as well as the recurring management of a larger portfolio.\n\n### Our expertise allows us to guarantee:\n- Short mission to address an identified need over a limited period\n- Long mission to support the management of a portfolio of files over time\n- Continuous outsourcing to sustainably entrust all or part of your operational activities\n- Punctual intervention on a volume of accounting, financial, wealth, or administrative files\n- Adjustment of the arrangement according to the evolution of the client's load and priorities"
    }
  },
  "volume": {
    title: { 
      fr: "Volume – Dimensionnement d'équipe", 
      en: "Volume – Team Sizing" 
    },
    description: { 
      fr: "Adaptation de nos ressources au volume de dossiers, de flux ou d’opérations à traiter.",
      en: "Adaptation of our resources to the volume of files, flows, or operations to be processed."
    },
    image: "/nos-solutions-hero.jpg",
    content: { 
      fr: "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d’opérations à traiter, tout en veillant à la continuité et à la sécurisation de l’exécution.\n\n### Nos dispositifs :\n- Une ressource dédiée sur un périmètre précis\n- Un renfort ponctuel pour absorber une surcharge d’activité\n- Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés\n- Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client\n- Une organisation permettant d’assurer la continuité du traitement en cas d’absence ou de variation d’activité",
      en: "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows, or operations to be processed, while ensuring continuity and secure execution.\n\n### Our arrangements:\n- A dedicated resource on a specific scope\n- Punctual reinforcement to absorb an activity overload\n- An operational team to manage a large volume or multiple simultaneous flows\n- A scalable arrangement adjusted according to the client's load, priorities, and requirements\n- An organization to ensure continuity of processing in case of absence or variation in activity"
    }
  },
  "mode-d-organisation": {
    title: { 
      fr: "Mode d'organisation", 
      en: "Organization Mode" 
    },
    description: { 
      fr: "Nous structurons nos interventions selon le format le plus adapté à vos contraintes.",
      en: "We structure our interventions according to the format best suited to your constraints."
    },
    image: "/notebook.jpg",
    content: { 
      fr: "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.\n\nNous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.\n\n### Mode d’interventions :\n- Dispositif dédié pour un service ou un périmètre clairement identifié\n- Intervention par mission pour un besoin borné dans le temps ou un projet spécifique\n- Prise en charge de flux ou de process récurrents\n- Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes\n- Suivi structuré avec points de contrôle réguliers",
      en: "MENUA CONSULTING structures its interventions according to the format best suited to your constraints: dedicated arrangement, mission-based operation, or handling of defined flows and processes.\n\nWe integrate our teams into your existing operating modes to guarantee a fluid, traceable execution that complies with your internal standards.\n\n### Modes of intervention:\n- Dedicated arrangement for a clearly identified service or scope\n- Mission-based intervention for a time-bound need or specific project\n- Handling of recurring flows or processes\n- Processing of files, memberships, or operations according to rules defined with your teams\n- Structured tracking with regular control points"
    }
  },
  "langues": {
    title: { 
      fr: "Langues – FR / EN et autres", 
      en: "Languages – FR / EN and others" 
    },
    description: { 
      fr: "Nous intervenons en français et en anglais.",
      en: "We operate in French and English."
    },
    image: "/finance-globe.jpg",
    content: { 
      fr: "Nous intervenons de manière native et fluide en français et en anglais, garantissant un suivi parfait dans des environnements internationaux.\n\nD’autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.",
      en: "We operate natively and fluently in French and English, ensuring perfect tracking in international environments.\n\nOther languages can be studied according to the specific needs of your teams."
    }
  }
};

export default function NosSolutionsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const pageData = nosSolutionsData[slug];

  if (!pageData) {
    notFound();
  }

  const lang = (language === 'EN' ? 'en' : 'fr') as keyof Translation;

  // Parseur markdown pour extraire les listes à puces
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-2xl font-bold mt-10 mb-4 text-[#051014] flex items-center gap-3"><span className="w-8 h-[1px] bg-[#c89b53]"></span>{block.replace('### ', '')}</h3>;
      }
      if (block.includes('\n- ')) {
        const lines = block.split('\n');
        return (
          <ul key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 mb-8">
            {lines.filter(line => line.startsWith('- ')).map((item, i) => (
              <li key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-[#fbfbfb] hover:bg-white hover:shadow-md hover:border-[#c89b53]/40 transition-all duration-300 group">
                <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-sm text-gray-700 leading-relaxed font-medium">{item.replace('- ', '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      if (idx === 0) {
        return (
          <p key={idx} className="text-gray-700 leading-loose mb-6 text-lg font-light">
            <span className="float-left text-5xl font-serif text-[#c89b53] pr-3 pt-2 leading-none">{block.charAt(0)}</span>
            {block.slice(1)}
          </p>
        );
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-6 font-light">{block}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#f4f4f3] text-[#051014] font-sans min-h-screen">
      <section className="relative w-full min-h-[75vh] flex items-end overflow-hidden pt-32 bg-[#051014]">
        <div className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/90 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-[#051014]/40 to-transparent z-10"></div>
          <img src={pageData.image} alt={pageData.title[lang]} className="w-full h-full object-cover opacity-50" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-[0.2em] uppercase mb-6 flex items-center flex-wrap gap-3 font-bold">
            <Link href="/" className="hover:text-white transition-colors">{t("Accueil", "Home")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <Link href="/nos-solutions" className="hover:text-white transition-colors">{t("Nos solutions", "Our Solutions")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <span className="text-white">{pageData.title[lang]}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 max-w-4xl text-white">
            {pageData.title[lang]}
          </h1>
          <div className="w-16 h-[2px] bg-[#c89b53] mb-8"></div>
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
                  <div className="w-12 h-12 bg-[#051014] rounded-full flex items-center justify-center text-[#c89b53]">
                    <Settings size={20} />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#051014]">{t("En détail", "In detail")}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent(pageData.content[lang])}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-[#051014] text-white p-10 rounded-2xl sticky top-32 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-6 leading-snug">{t("Besoin d'une solution sur-mesure ?", "Need a custom solution?")}</h3>
                <div className="w-8 h-1 bg-[#c89b53] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                  {t(
                    "Nous concevons des dispositifs d’externalisation adaptés à vos contraintes.",
                    "We design outsourcing setups adapted to your constraints."
                  )}
                </p>
                <Link href="/nous-contacter" className="flex items-center justify-center gap-4 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-4 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#c89b53]/20 w-full group">
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
