"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight, Quote } from "lucide-react";
import { use } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Translation = { fr: string; en: string };
type PageData = { title: Translation; description: Translation; image: string; content: Translation };

const nousConnaitreData: Record<string, PageData> = {
  "presentation-du-cabinet": {
    title: { 
      fr: "Présentation du cabinet", 
      en: "Firm Overview" 
    },
    description: { 
      fr: "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, de la gestion de patrimoine et data.",
      en: "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management, and data."
    },
    image: "/nous-rejoindre-hero.jpg",
    content: { 
      fr: "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d’exécuter des missions exigeantes avec rigueur, continuité et fiabilité.\n\nNos collaborateurs s’intègrent aux organisations clientes afin de prendre en charge l’exécution opérationnelle, d’optimiser les charges internes et de sécuriser la continuité des opérations.\n\nCette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
      en: "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability.\n\nOur employees integrate into client organizations to take charge of operational execution, optimize internal costs, and secure the continuity of operations.\n\nThis organization allows clients to focus on their core business, while guaranteeing controlled, fluid, and sustainable processes."
    }
  },
  "notre-approche": {
    title: { 
      fr: "Notre approche", 
      en: "Our Approach" 
    },
    description: { 
      fr: "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l’exécution.",
      en: "MENUA CONSULTING adopts a resolutely operational posture: clients define the needs, methods, and priorities; we ensure the execution."
    },
    image: "/vos-besoins-hero.jpg",
    content: { 
      fr: "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.\n\nNotre approche repose sur trois piliers : continuité opérationnelle, traçabilité des actions et fiabilité des livrables.\n\nNos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.",
      en: "We operate in financial, accounting, wealth, and regulated environments, strictly adhering to internal procedures, validation circuits, and the specific quality requirements of each organization.\n\nOur approach is based on three pillars: operational continuity, traceability of actions, and reliability of deliverables.\n\nOur teams can intervene in French and English, ensuring fluid management of exchanges, reporting, and operations in an international context."
    }
  },
  "notre-methodologie": {
    title: { 
      fr: "Notre méthodologie", 
      en: "Our Methodology" 
    },
    description: { 
      fr: "Une méthodologie stricte pour sécuriser l'exécution de vos opérations.",
      en: "A strict methodology to secure the execution of your operations."
    },
    image: "/nos-solutions-hero.jpg",
    content: { 
      fr: "### Découverte\nAnalyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.\n\n### Vérifications préalables\nVérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.\n\n### Analyse\nConstruction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation et les livrables attendus.\n\n### Mise en œuvre & formation\nDéploiement des équipes et intégration aux outils, process et standards de votre organisation.\n\n### Suivi dans la durée\nPilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.",
      en: "### Discovery\nAnalysis of your organization, your processes, and your constraints in order to precisely define the scope of intervention.\n\n### Preliminary Checks\nVerification of the legal identity, administrative situation, and operational consistency of the client or partner, in order to secure the onboarding process.\n\n### Analysis\nConstruction of an operational proposal adapted to your needs, including the profiles, organizational mode, and expected deliverables.\n\n### Implementation & Training\nDeployment of teams and integration with the tools, processes, and standards of your organization.\n\n### Long-term Monitoring\nContinuous management of the mission, regular adjustments, and quality control of deliverables."
    }
  },
  "accreditations-et-certifications": {
    title: { 
      fr: "Accréditations & certifications", 
      en: "Accreditations & Certifications" 
    },
    description: { 
      fr: "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
      en: "MENUA CONSULTING operates in environments subject to high regulatory requirements."
    },
    image: "/pourquoi-menua-hero.jpg",
    content: { 
      fr: "La dirigeante dispose notamment de la certification AMF, d’une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d’une expérience acquise au sein d’environnements financiers, patrimoniaux et réglementés.\n\nLe cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).\n\nMENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d’agrément et de supervision de ses clients.\n\nCe dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
      en: "The CEO notably holds the AMF certification, a certification in Internal Control and Risk Management for financial institutions, as well as experience acquired within financial, wealth, and regulated environments.\n\nThe firm intervenes in coordination with the authorized teams of its clients (banks, firms, regulated structures).\n\nMENUA CONSULTING does not carry out any regulated activity in its own name. The firm provides specialized operational resources integrated into the approval and supervision frameworks of its clients.\n\nThis system guarantees compliance, the quality of operations, and the security of processes."
    }
  },
  "notre-equipe": {
    title: { 
      fr: "Notre équipe", 
      en: "Our Team" 
    },
    description: { 
      fr: "Une direction impliquée au plus près des opérations.",
      en: "Management involved as close as possible to operations."
    },
    image: "/notebook.jpg",
    content: { 
      fr: "Rosette Fouelefack est directrice générale de MENUA CONSULTING.\n\nElle dispose d’une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d’environnements exigeants.\n\nElle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.\n\nMENUA CONSULTING s’appuie sur une organisation agile, composée d’une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.\n\nChaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d’exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.\n\nMENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.",
      en: "Rosette Fouelefack is the CEO of MENUA CONSULTING.\n\nShe has experience in finance, risk management, wealth management, and back & middle office operations acquired in demanding environments.\n\nShe directly supervises the structuring of missions, the building of teams, the validation of deliverables, and the quality control system.\n\nMENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced employees or partners mobilized according to client needs.\n\nEach mission is framed by monitoring, validation, and control procedures, in order to guarantee a level of execution that meets the client's expectations and the standards of rigor expected on the French market.\n\nMENUA CONSULTING relies on a four-eyes principle and continuous supervision of operations to guarantee reliability, rigor, and continuity of service."
    }
  }
};

export default function NousConnaitreDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const pageData = nousConnaitreData[slug];

  if (!pageData) {
    notFound();
  }

  const lang = (language === 'EN' ? 'en' : 'fr') as keyof Translation;
  
  // Petit parser de markdown simple pour les titres h3 (utilisés dans la méthodo)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-2xl font-bold mt-10 mb-4 text-[#051014] flex items-center gap-3"><span className="w-8 h-[1px] bg-[#c89b53]"></span>{paragraph.replace('### ', '')}</h3>;
      }
      if (idx === 0) {
        // Drop cap for the first paragraph
        return (
          <p key={idx} className="text-gray-700 leading-loose mb-6 text-lg font-light">
            <span className="float-left text-5xl font-serif text-[#c89b53] pr-3 pt-2 leading-none">{paragraph.charAt(0)}</span>
            {paragraph.slice(1)}
          </p>
        );
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-6 font-light">{paragraph}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#f4f4f3] text-[#051014] font-sans min-h-screen">
      {/* HERO FULL WIDTH */}
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
            <Link href="/nous-connaitre" className="hover:text-white transition-colors">{t("Nous connaître", "About Us")}</Link>
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

      {/* CONTENU DÉTAILLÉ - CONSTRAINED WIDTH */}
      <section className="px-8 py-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* MAIN CONTENT */}
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#051014] rounded-full flex items-center justify-center text-[#c89b53]">
                    <Quote size={20} />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#051014]">{t("En détail", "In detail")}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent(pageData.content[lang])}
                </div>
              </div>
            </div>
            
            {/* SIDEBAR CTA */}
            <div className="lg:w-1/3">
              <div className="bg-[#051014] text-white p-10 rounded-2xl sticky top-32 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-6 leading-snug">{t("Besoin d'accompagnement ?", "Need assistance?")}</h3>
                <div className="w-8 h-1 bg-[#c89b53] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                  {t(
                    "MENUA CONSULTING accompagne les entreprises dans l’externalisation opérationnelle avec rigueur et expertise.",
                    "MENUA CONSULTING supports companies in operational outsourcing with rigor and expertise."
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
