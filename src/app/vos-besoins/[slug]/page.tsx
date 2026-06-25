import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Données des sous-pages "Vos besoins"
const besoinsData: Record<string, { title: string, description: string, role: string, image: string, items: string[] }> = {
  "finance-et-reporting": {
    title: "Finance & reporting",
    description: "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
    role: "C'est une offre cœur métier",
    image: "/finance-globe.jpg",
    items: [
      "Reporting financier, KPI | Dashboard",
      "Analyse de performance",
      "Support direction financière",
      "Consolidation de données",
      "Analyse financière",
      "Préparation de reportings pour direction financière",
      "Suivi d'activité",
      "Reporting mensuel / trimestriel",
      "Reporting de trésorerie",
      "Reporting de rentabilité",
      "Suivi des indicateurs"
    ]
  },
  "controle-de-gestion": {
    title: "Contrôle de gestion",
    description: "Appui opérationnel au suivi budgétaire, à l’analyse des écarts et au pilotage de la performance afin d’aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
    role: "Optimisation interne des coûts et performance",
    image: "/notebook.jpg",
    items: [
      "Suivi budgétaire",
      "Analyse des écarts entre réalisé, budget et prévisionnel",
      "Tableaux de bord",
      "Pilotage de performance",
      "Suivi des coûts, charges et marges",
      "Analyse de rentabilité",
      "Suivi des indicateurs opérationnels",
      "Préparation de reportings de gestion",
      "Suivi du chiffre d’affaires et des objectifs",
      "Mise à jour de fichiers de pilotage",
      "Consolidation des données de gestion",
      "Support aux directions financières et responsables opérationnels"
    ]
  },
  "risques-et-conformite": {
    title: "Risques & conformité",
    description: "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
    role: "Sécurisation et conformité",
    image: "/vos-besoins-hero.jpg",
    items: [
      "KYC",
      "LCB-FT",
      "AML",
      "Contrôle documentaire",
      "Analyse et complétude des dossiers clients",
      "Vérification des pièces justificatives",
      "Entrée en relation client",
      "Revue périodique des dossiers",
      "Remédiation KYC",
      "Traitement des alertes de conformité",
      "Analyse des mouvements inhabituels",
      "Support aux équipes risques & conformité",
      "Suivi des procédures internes",
      "Préparation de dossiers pour validation par les équipes habilitées"
    ]
  },
  "support-comptable-et-data": {
    title: "Support comptable & data",
    description: "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
    role: "Back-office opérationnel",
    image: "/nous-rejoindre-hero.jpg",
    items: [
      "Saisie comptable",
      "Rapprochements bancaires",
      "Lettrage des comptes",
      "Contrôle et classement des pièces comptables",
      "Préparation des déclarations de TVA",
      "Préparation des éléments comptables pour révision",
      "Suivi des factures clients et fournisseurs",
      "Relances administratives liées aux pièces manquantes",
      "Data cleaning",
      "Structuration et mise à jour de bases de données",
      "Contrôle de cohérence des données",
      "Préparation de fichiers de reporting",
      "Consolidation de données comptables et opérationnelles",
      "Archivage et organisation documentaire"
    ]
  },
  "gestion-de-patrimoine": {
    title: "Gestion de patrimoine & Support CGP",
    description: "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
    role: "Accompagnement administratif patrimonial",
    image: "/headphones.jpg",
    items: [
      "Préparation des dossiers d’entrée en relation",
      "Collecte et contrôle des pièces justificatives",
      "Contrôle de complétude des dossiers clients",
      "Mise à jour des informations clients",
      "Préparation et pré-remplissage de formulaires",
      "Support administratif aux souscriptions",
      "Support aux arbitrages",
      "Support aux rachats partiels ou totaux",
      "Suivi des demandes clients",
      "Organisation et archivage documentaire",
      "Mise à jour des bases clients",
      "Préparation de dossiers pour validation par les conseillers habilités",
      "Suivi des opérations patrimoniales dans le respect des procédures internes"
    ]
  },
  "autres-besoins": {
    title: "Autres besoins opérationnels",
    description: "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d’une fonction financière, comptable, patrimoniale, conformité ou data.",
    role: "Support flexible et sur-mesure",
    image: "/nos-solutions-hero.jpg",
    items: [
      "Missions ponctuelles de renfort opérationnel",
      "Support administratif financier",
      "Traitement de dossiers en volume",
      "Classement, archivage et organisation documentaire",
      "Préparation et mise à jour de fichiers de suivi",
      "Support à la gestion d’opérations transverses",
      "Assistance à la formalisation de procédures internes",
      "Aide à la structuration de process opérationnels",
      "Préparation de documents administratifs",
      "Suivi de demandes internes ou clients",
      "Support en période de surcharge d’activité",
      "Remplacement ou appui temporaire d’équipe",
      "Coordination entre équipes internes et prestataires externalisés",
      "Étude de besoins spécifiques non listés dans les rubriques précédentes"
    ]
  }
};

export default async function BesoinDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const besoin = besoinsData[slug];

  if (!besoin) {
    notFound();
  }

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO COMPACT */}
      <section className="relative w-full min-h-[45vh] flex items-end overflow-hidden pt-24">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/80 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-[#051014]/20 to-transparent z-10"></div>
          <img src={besoin.image} alt={besoin.title} className="w-full h-full object-cover opacity-60" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-16">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4 flex items-center flex-wrap gap-2">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="text-gray-600">›</span>
            <Link href="/vos-besoins" className="hover:text-white transition-colors">Vos besoins</Link>
            <span className="text-gray-600">›</span>
            <span className="text-white">{besoin.title}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            {besoin.title}
          </h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {besoin.description}
          </p>
        </div>
      </section>

      {/* CONTENU DÉTAILLÉ */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 relative rounded-t-[3rem] -mt-8 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          
          {/* MAIN CONTENT */}
          <div className="md:w-2/3">
            <div className="mb-10 inline-block border border-[#c89b53]/30 bg-[#c89b53]/10 px-4 py-2 rounded-full">
              <span className="text-[#c89b53] text-xs font-bold tracking-widest uppercase">{besoin.role}</span>
            </div>
            
            <h2 className="font-serif text-3xl font-bold mb-8">Contenus et besoins couverts</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {besoin.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#c89b53]/30 transition-colors">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* SIDEBAR CTA */}
          <div className="md:w-1/3">
            <div className="bg-[#051014] text-white p-8 rounded-2xl sticky top-32 shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-4">Un besoin sur ce périmètre ?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Nos équipes interviennent en support pour sécuriser et renforcer l'exécution de vos opérations.
              </p>
              <Link href="/nous-contacter" className="flex items-center justify-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-4 rounded text-xs font-bold tracking-wider uppercase transition-colors w-full">
                Nous solliciter <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
