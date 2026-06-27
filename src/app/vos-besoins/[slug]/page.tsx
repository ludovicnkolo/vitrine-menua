import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallToAction from "@/components/layout/CallToAction";

// --- Données des sous-pages "Vos Besoins" ---
const pagesData: Record<string, any> = {
  "finance-reporting": {
    title: "Production, structuration et fiabilisation de vos reportings financiers.",
    content: (
      <>
        <p className="mb-6">
          Nous accompagnons les directions financières, les responsables de contrôle de gestion et les équipes comptables dans la production et la structuration de reportings financiers destinés au pilotage de la performance, au suivi de l’activité et à l’aide à la décision.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos services couverts :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Reporting financier :</strong> 
            Élaboration de tableaux de bord, KPI / Dashboards sur mesure, analyse de performance et support à la direction financière.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Consolidation des données :</strong> 
            Analyse financière, préparation de reportings pour direction financière et suivi d’activité.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Suivi périodique :</strong> 
            Reporting mensuel / trimestriel, reporting de trésorerie et reporting de rentabilité.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Contrôle de gestion :</strong> 
            Appui opérationnel au suivi budgétaire, analyse des écarts et pilotage de la performance pour mieux maîtriser coûts, marges et ressources.
          </li>
        </ul>
      </>
    ),
  },
  "risques-conformite": {
    title: "Appui opérationnel aux équipes risques et conformité.",
    content: (
      <>
        <p className="mb-6">
          Nous intervenons en soutien des équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect strict des procédures internes et des exigences réglementaires applicables (AMF, ACPR, LCB-FT, etc.).
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos services couverts :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">KYC & LCB-FT :</strong> 
            Gestion des processus Know Your Customer, Lutte contre le blanchiment et le financement du terrorisme (AML), contrôle documentaire et analyse de complétude des dossiers clients.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Gestion documentaire :</strong> 
            Vérification des pièces justificatives, entrée en relation client, revue périodique des dossiers et remédiation KYC.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Traitement des alertes :</strong> 
            Analyse des mouvements inhabituels, traitement des alertes de conformité et support aux équipes risques.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Préparation et validation :</strong> 
            Suivi des procédures internes et préparation de dossiers pour validation par les équipes habilitées (principe des 4 yeux).
          </li>
        </ul>
      </>
    ),
  },
  "support-comptable-data": {
    title: "Fiabilisation, structuration et traitement de vos données comptables et administratives.",
    content: (
      <>
        <p className="mb-6">
          Nous apportons un appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos services couverts :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Comptabilité courante :</strong> 
            Saisie comptable, rapprochements bancaires, lettrage des comptes, contrôle et classement des pièces comptables.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Fiscalité et révision :</strong> 
            Préparation des déclarations de TVA et des éléments comptables pour révision.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Gestion des factures :</strong> 
            Suivi des factures clients et fournisseurs, relances administratives liées aux pièces manquantes.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Data & reporting :</strong> 
            Data cleaning, structuration et mise à jour de bases de données, contrôle de cohérence, consolidation de données comptables et opérationnelles.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Archivage :</strong> 
            Archivage et organisation documentaire pour une traçabilité optimale.
          </li>
        </ul>
      </>
    ),
  },
  "gestion-patrimoine-cgp": {
    title: "L’exécution administrative et opérationnelle au service des conseillers en gestion de patrimoine.",
    content: (
      <>
        <p className="mb-6">
          Nous apportons un appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos services couverts :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Entrée en relation :</strong> 
            Préparation des dossiers d’entrée en relation, collecte et contrôle des pièces justificatives, contrôle de complétude.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Suivi client :</strong> 
            Mise à jour des informations clients, préparation et pré-remplissage de formulaires (souscriptions, arbitrages, rachats partiels ou totaux).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Support opérationnel :</strong> 
            Suivi des demandes clients, organisation et archivage documentaire, mise à jour des bases clients.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Validation :</strong> 
            Préparation de dossiers pour validation par les conseillers habilités et suivi des opérations patrimoniales dans le respect des procédures internes.
          </li>
        </ul>
      </>
    ),
  },
  "autres-besoins-operationnels": {
    title: "Une réponse agile à vos besoins ponctuels, transverses ou spécifiques.",
    content: (
      <>
        <p className="mb-6">
          Nous prenons en charge des besoins opérationnels ponctuels, transverses ou spécifiques qui ne relèvent pas exclusivement d’une fonction financière, comptable, patrimoniale, conformité ou data.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos services couverts :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Renfort ponctuel :</strong> 
            Missions de renfort opérationnel, support administratif financier, traitement de dossiers en volume.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Organisation :</strong> 
            Classement, archivage et organisation documentaire, préparation et mise à jour de fichiers de suivi.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Process & procédures :</strong> 
            Assistance à la formalisation de procédures internes, aide à la structuration de process opérationnels.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Gestion des pics d’activité :</strong> 
            Support en période de surcharge, remplacement ou appui temporaire d’équipe, coordination entre équipes internes et prestataires externalisés.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Cas particuliers :</strong> 
            Étude de besoins spécifiques non listés dans les rubriques précédentes.
          </li>
        </ul>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(pagesData).map((slug) => ({ slug }));
}

export default async function SubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = pagesData[slug];

  if (!data) return notFound();

  const breadcrumbTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO SUBPAGE ── */}
      <section className="relative w-full min-h-[40vh] flex items-end justify-center overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 z-0">
          <img src="/subpage_hero.png" alt="Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl w-full mx-auto px-8">
          <Breadcrumb 
            items={[
              { label: "Vos besoins", href: "/vos-besoins" },
              { label: breadcrumbTitle }
            ]} 
            light={true}
          />
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-4 mt-8">Vos besoins</p>
          <h1
            className="text-white mb-2"
            
          >
            {data.title}
          </h1>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-[#3A4660] text-lg leading-relaxed">
          {data.content}
        </div>
      </section>
      <CallToAction />
    </main>
  );
}
