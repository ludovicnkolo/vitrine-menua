import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallToAction from "@/components/layout/CallToAction";

const articlesData: Record<string, any> = {
  "kyc-lcft-nouvelles-obligations": {
    title: "KYC & LCB-FT – Les nouvelles obligations réglementaires à anticiper",
    date: "Juin 2025",
    cat: "Conformité / LCB-FT",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Le paysage réglementaire de la Lutte Contre le Blanchiment et le Financement du Terrorisme (LCB-FT) connaît une nouvelle accélération. Les autorités de contrôle (AMF, ACPR, Banque de France) renforcent leurs exigences en matière de dispositifs KYC (Know Your Customer), imposant aux acteurs financiers une vigilance accrue sur l’ensemble du cycle de vie du client.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les 3 évolutions majeures à intégrer :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Renforcement des obligations de vérification des bénéficiaires effectifs :</strong> 
            Les seuils de détection sont abaissés et les délais de mise à jour des données sont raccourcis. Les établissements doivent désormais justifier d’une revue annuelle pour les clients à risque.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Actualisation des listes de sanctions et PEP :</strong> 
            Les bases de données évoluent en temps réel. Une veille dynamique devient indispensable pour éviter les non-conformités.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Conservation et traçabilité renforcées :</strong> 
            Les exigences de conservation des preuves documentaires (justificatifs d&apos;identité, de domicile, pièces juridiques) s&apos;étendent à 10 ans après la sortie de relation.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Comment MENUA CONSULTING vous accompagne :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          Nous prenons en charge l&apos;exécution opérationnelle de vos revues KYC. Nos équipes traitent les campagnes de mise à jour, contrôlent la complétude des dossiers et préparent les alertes pour validation par vos équipes conformité habilitées, dans le respect strict du principe des 4 yeux.
        </p>
      </>
    ),
  },
  "externalisation-securiser-continuite": {
    title: "Externalisation back office – Comment sécuriser la continuité opérationnelle ?",
    date: "Mai 2025",
    cat: "Opérations / Externalisation",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          L&apos;externalisation des fonctions back office est un levier puissant de performance, mais elle expose à des risques de rupture si le dispositif de suivi et de contrôle n&apos;est pas parfaitement structuré. La continuité opérationnelle ne se décrète pas : elle se construit, avec des garde-fous solides.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les 4 piliers d&apos;une externalisation sécurisée :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Une intégration rigoureuse :</strong> 
            L&apos;équipe externalisée doit être formée à vos outils métier, à vos process internes et à votre culture d&apos;entreprise. Une intégration réussie réduit de 80% les risques d&apos;erreur.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Un plan de continité (BCP) :</strong> 
            En cas d&apos;absence d&apos;un collaborateur externalisé, un backup est systématiquement prévu. Chez MENUA CONSULTING, nous garantissons une redondance des compétences sur chaque mission.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Des points de contrôle réguliers :</strong> 
            Des revues hebdomadaires et des tableaux de bord partagés permettent de suivre l&apos;avancement et d&apos;anticiper les éventuels dérives de délais.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Une traçabilité granulaire :</strong> 
            Chaque action réalisée par nos équipes est documentée et horodatée. En cas de question de votre part, nous pouvons remonter à la source de l&apos;opération en quelques secondes.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Conclusion :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          L&apos;externalisation est un accélérateur, à condition qu&apos;elle soit pilotée comme un véritable prolongement de votre organisation interne. C&apos;est exactement la philosophie de MENUA CONSULTING.
        </p>
      </>
    ),
  },
  "reporting-erreurs-frequentes": {
    title: "Reporting financier – Les erreurs les plus fréquentes et comment les éviter",
    date: "Avril 2025",
    cat: "Finance / Reporting",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Un reporting financier fiable est le fondement d&apos;une prise de décision éclairée. Pourtant, les directions financières et les contrôleurs de gestion sont confrontés à des erreurs récurrentes qui fragilisent la confiance des parties prenantes.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les 5 erreurs les plus fréquentes :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">La mauvaise qualification des flux :</strong> 
            Confondre dépenses d&apos;investissement et charges d&apos;exploitation, ou mal ventiler les coûts par centre de responsabilité.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Les erreurs de périmètre de consolidation :</strong> 
            Oublier une filiale ou une joint-venture dans le reporting consolidé.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">L&apos;incohérence des sources de données :</strong> 
            Utiliser des extractions de données à des dates différentes (ex: Stock à J-1 vs J-10).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">L&apos;absence d&apos;analyse des écarts :</strong> 
            Fournir les chiffres bruts sans commenter les écarts entre le réalisé et le budget ou le prévisionnel.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Des tableaux de bord trop complexes :</strong> 
            Noyer le lecteur sous des centaines de lignes sans focus sur les KPI stratégiques.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Nos solutions :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          MENUA CONSULTING intervient pour fiabiliser vos reportings. Nous structurons vos données, automatisons les contrôles de cohérence et préparons des livrables clairs, avec une mise en avant des écarts significatifs et des recommandations opérationnelles.
        </p>
      </>
    ),
  },
  "dora-etablissements-financiers": {
    title: "DORA – Ce que les établissements financiers doivent savoir",
    date: "Juin 2025",
    cat: "Réglementation / DORA",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Le Digital Operational Resilience Act (DORA) est entré en pleine application. Ce règlement européen impose aux acteurs financiers et à leurs prestataires ICT (Technologies de l&apos;Information et de la Communication) un cadre strict pour garantir la résilience numérique.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Ce que DORA change concrètement :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Gestion des risques ICT :</strong> 
            Les établissements doivent identifier, classer et gérer les risques liés à leurs systèmes d&apos;information comme ils le font pour les risques financiers.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Tests de résilience :</strong> 
            Des tests de pénétration et des exercices de simulation de crise (TLP - Threat-Led Penetration Testing) deviennent obligatoires tous les 3 ans pour les entités critiques.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Signalement des incidents :</strong> 
            Tout incident ICT majeur doit être notifié aux autorités de contrôle dans des délais très stricts (72h).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Surveillance des prestataires :</strong> 
            Les contrats avec les prestataires cloud et ICT doivent inclure des clauses spécifiques sur la continuité, la sous-traitance et les droits d&apos;audit.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Notre appui :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          MENUA CONSULTING assiste les directions opérationnelles dans la mise en conformité documentaire et la revue des contrats ICT, en lien avec leurs équipes juridiques et IT.
        </p>
      </>
    ),
  },
  "clotures-comptables-anticiper-pics": {
    title: "Clôtures comptables – Anticiper les pics d'activité",
    date: "Mai 2025",
    cat: "Comptabilité / Gestion",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Les clôtures mensuelles, trimestrielles et surtout annuelles sont des moments de tension extrême pour les équipes comptables. Anticiper ces pics d&apos;activité est essentiel pour préserver la santé de vos équipes et la qualité des livrables.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos recommandations opérationnelles :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Planification en amont :</strong> 
            Définir un calendrier précis des cut-offs (arrêtés des écritures, rapprochements bancaires, inventaires) au moins 3 semaines avant la clôture.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Délégation des tâches récurrentes :</strong> 
            Externaliser les tâches à forte répétitivité (lettrage, saisie des pièces, rapprochements) pour libérer vos experts sur les sujets à haute valeur ajoutée.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Mise en place d&apos;un contrôle continu :</strong> 
            Ne pas attendre la clôture pour vérifier la cohérence des comptes. Un contrôle hebdomadaire réduit le temps de clôture de 30%.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Comment nous vous aidons :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          MENUA CONSULTING met à disposition des renforts opérationnels pendant vos périodes de clôture. Nos collaborateurs s&apos;intègrent à votre outil comptable et exécutent les tâches de saisie et de rapprochement selon vos procédures.
        </p>
      </>
    ),
  },
  "cgp-enjeux-administratifs-devoir-conseil": {
    title: "CGP – Enjeux administratifs du devoir de conseil",
    date: "Mai 2025",
    cat: "Gestion de patrimoine / CGP",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Le devoir de conseil du Conseiller en Gestion de Patrimoine (CGP) ne se limite pas à la recommandation financière. Il s&apos;accompagne d&apos;une lourde charge administrative (traçabilité, formalisation, conservation) qui pèse sur l&apos;efficacité opérationnelle du cabinet.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les 3 principaux enjeux administratifs :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">La traçabilité des recommandations :</strong> 
            Chaque conseil donné doit être formalisé, motivé (analyse de la situation du client) et archivé. Cela génère une volumétrie documentaire importante.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">La gestion des formulaires de souscription :</strong> 
            Les OPCM, assurance-vie, comptes-titres... chaque souscription implique des formulaires spécifiques dont la complétude est systématiquement contrôlée par les compagnies.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Les revues périodiques :</strong> 
            La réglementation MIFID II impose une revue régulière de l&apos;adéquation des investissements, nécessitant des mises à jour fréquentes des bases clients.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Notre solution :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          MENUA CONSULTING prend en charge le volet administratif du devoir de conseil. Nous préparons les dossiers d&apos;entrée en relation, collectons les pièces, pré-remplissons les formulaires et assurons le suivi des revues périodiques.
        </p>
      </>
    ),
  },
  "remediation-kyc-strategies": {
    title: "Remédiation KYC – Stratégies et bonnes pratiques",
    date: "Avril 2025",
    cat: "Conformité / KYC / AML",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          La remédiation KYC (rattrapage des dossiers clients incomplets ou obsolètes) est un défi récurrent pour les établissements financiers. Souvent perçue comme une corvée réglementaire, elle peut pourtant être transformée en opportunité de fiabilisation du référentiel client.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Stratégies efficaces :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Priorisation par le risque :</strong> 
            Cibler en premier les clients à haut risque (PEP, secteurs sensibles, nationalités spécifiques) pour concentrer l&apos;effort là où le risque de non-conformité est maximal.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Communication proactive :</strong> 
            Adopter un ton de service dans les échanges avec les clients pour collecter les pièces manquantes (ex : &quot;Nous mettons à jour vos données pour mieux vous protéger&quot;).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Standardisation des checklists :</strong> 
            Utiliser une grille d&apos;analyse unique et exhaustive pour chaque dossier, évitant les oublis et facilitant le contrôle en 4 yeux.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Notre appui :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          Nous traitons vos campagnes de remédiation de bout en bout. Collecte, vérification, relances clients, mise à jour en base et préparation des dossiers pour validation par vos équipes conformité.
        </p>
      </>
    ),
  },
  "data-quality-finance": {
    title: "Data quality en finance – Enjeux et solutions",
    date: "Mars 2025",
    cat: "Data / Finance",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          La qualité des données (Data Quality) est devenue un enjeu stratégique majeur en finance. Des données erronées ou mal structurées impactent directement le reporting réglementaire (BCE, ACPR), les décisions de gestion et la performance opérationnelle.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les causes principales de la mauvaise qualité des données :</h3>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-[#3A4660]">
          <li>Silos d&apos;information entre les services (front, middle, back).</li>
          <li>Saisies manuelles multiples sans contrôle de cohérence.</li>
          <li>Absence de standardisation des formats (dates, codes devise, noms de contreparties).</li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les solutions concrètes :</h3>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-[#3A4660]">
          <li>Mise en place de règles de validation automatique à l&apos;entrée des données.</li>
          <li>Nettoyage et dédoublonnage des bases clients/fournisseurs.</li>
          <li>Création d&apos;un référentiel unique (Master Data Management) partagé par tous les services.</li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Notre intervention :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          MENUA CONSULTING réalise des missions ponctuelles de data cleaning et de structuration de bases. Nous contrôlons, standardisons et consolidons vos données pour garantir la fiabilité de vos reportings.
        </p>
      </>
    ),
  },
  "middle-office-perimetre-sous-estime": {
    title: "Middle office – Un périmètre souvent sous-estimé",
    date: "Mars 2025",
    cat: "Opérations / Middle Office",
    content: (
      <>
        <p className="mb-6 font-semibold text-[#1B3680] text-lg">
          Le Middle Office est souvent victime de son positionnement ambigu, entre le Front Office (commercial) et le Back Office (administratif/comptable). Pourtant, il joue un rôle critique dans la sécurisation des opérations et la gestion des risques.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Les missions clés du Middle Office souvent sous-estimées :</h3>
        <ul className="space-y-4 text-[#3A4660] mb-8">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Le contrôle des opérations :</strong> 
            Vérifier que les transactions initiées par le Front Office sont correctement capturées, validées et transmises au Back Office.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">La gestion des collatéraux :</strong> 
            Suivre les appels de marge et les garanties dans les opérations de financement ou dérivés.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Le suivi des litiges et des exceptions :</strong> 
            Traiter les opérations en suspens ou les anomalies (breaks) avant qu&apos;elles n&apos;impactent la trésorerie.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Le reporting de risque opérationnel :</strong> 
            Produire des indicateurs sur les incidents de traitement.
          </li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">La vision MENUA CONSULTING :</h3>
        <p className="text-[#3A4660] bg-[#F2F0ED] p-6 border-l-2 border-[#B8922A]">
          Nous considérons le Middle Office comme le verrou stratégique de la chaîne opérationnelle. En l&apos;externalisant, nous vous apportons une sécurité renforcée, une réduction des erreurs de transmission et une meilleure gestion des exceptions.
        </p>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(articlesData).map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = articlesData[resolvedParams.slug];

  if (!article) return notFound();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO ARTICLE ── */}
      <section className="relative w-full min-h-[45vh] flex items-end justify-center overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 z-0">
          <img src="/actualites_hero.png" alt="Actualités" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/75 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative z-10 max-w-3xl w-full mx-auto px-8">
          <Breadcrumb 
            items={[
              { label: "Actualités", href: "/actualites" },
              { label: "Article" }
            ]}
            light={true}
          />
          <div className="flex items-center gap-3 mb-5 mt-8">
            <span className="text-[#DAF0F7] text-xs font-bold uppercase tracking-widest">{article.cat}</span>
            <span className="text-white/30">|</span>
            <span className="text-white/60 text-xs font-semibold">{article.date}</span>
          </div>
          <h1
            className="text-white mb-2"
            
          >
            {article.title}
          </h1>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <article className="px-8 py-16 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[#0E1B2E] text-base md:text-lg leading-relaxed space-y-6">
            {article.content}
          </div>

          <div className="mt-16 pt-8 border-t border-[#D8DCE8] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F2F0ED]">
                <img src="/rosette.jpg" alt="MENUA CONSULTING" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1B3680]">Par MENUA CONSULTING</p>
                <p className="text-xs text-[#6B7794]">Expertise opérationnelle</p>
              </div>
            </div>
            <Link href="/actualites" className="flex items-center gap-2 text-sm font-bold text-[#1C40C2] uppercase tracking-wider hover:text-[#142E9A] transition-colors">
              <ArrowLeft size={14} /> Retour aux actualités
            </Link>
          </div>
        </div>
      </article>

      <CallToAction />
    </main>
  );
}
