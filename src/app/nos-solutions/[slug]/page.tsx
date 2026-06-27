import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallToAction from "@/components/layout/CallToAction";

const pagesData: Record<string, any> = {
  "urgence": {
    title: "Une mobilisation rapide pour garantir la continuité de votre service.",
    content: (
      <>
        <p className="mb-6">
          Nous savons que vos besoins peuvent être immédiats. MENUA CONSULTING est en capacité de mobiliser des ressources opérationnelles dans des délais très courts pour répondre à un besoin urgent, absorber une surcharge d&apos;activité ou assurer la continuité de votre service sans rupture.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos cas d’usage principaux :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Surcharge d&apos;activité ou pic de dossiers :</strong> 
            Nous renforçons vos équipes pour faire face à un afflux ponctuel de travail.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Remplacement temporaire d&apos;un collaborateur absent :</strong> 
            Nous assurons l’intérim opérationnel pour éviter tout retard dans vos traitements.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Renfort ponctuel en période de clôture ou de reporting :</strong> 
            Nous intervenons lors des pics mensuels, trimestriels ou annuels pour sécuriser les délais.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Traitement accéléré de dossiers en retard ou en attente :</strong> 
            Nous résorbons les backlogs existants pour remettre vos process à jour.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Mise à disposition progressive de ressources :</strong> 
            Nous sécurisons la montée en charge en déployant nos collaborateurs par paliers, selon votre rythme.
          </li>
        </ul>
        <div className="mt-8 p-6 bg-[#F2F0ED] border border-[#D8DCE8] text-sm">
          <strong className="text-[#1B3680] uppercase tracking-wider text-xs mb-2 block">Notre recommandation</strong>
          <p className="text-[#3A4660]">Vous avez un pic d&apos;activité imprévu ? Consultez-nous pour un déploiement sous quelques jours avec nos ressources immédiatement opérationnelles.</p>
        </div>
      </>
    ),
  },
  "duree": {
    title: "Des engagements adaptés à votre horizon de mission.",
    content: (
      <>
        <p className="mb-6">
          MENUA CONSULTING propose des dispositifs d&apos;externalisation flexibles, adaptés au traitement d&apos;un nombre défini de dossiers comme à la gestion récurrente d&apos;un portefeuille plus important. Nous ajustons la durée de nos interventions à votre cycle opérationnel.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos dispositifs :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Mission courte :</strong> 
            Pour traiter un besoin identifié sur une période limitée (ex : un projet spécifique, une clôture annuelle).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Mission longue :</strong> 
            Pour accompagner la gestion d&apos;un portefeuille de dossiers dans la durée (ex : suivi comptable sur 6 mois).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Externalisation continue :</strong> 
            Pour confier durablement tout ou partie de vos activités opérationnelles à nos équipes.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Intervention ponctuelle :</strong> 
            Sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs, sans engagement de durée.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Ajustement du dispositif :</strong> 
            Nous adaptons le format et la durée de notre intervention selon l&apos;évolution de votre charge et de vos priorités.
          </li>
        </ul>
        <div className="mt-8 p-6 bg-[#F2F0ED] border border-[#D8DCE8] text-sm">
          <strong className="text-[#1B3680] uppercase tracking-wider text-xs mb-2 block">Pourquoi ce choix ?</strong>
          <p className="text-[#3A4660]">La flexibilité contractuelle vous permet de maîtriser vos coûts en ajustant la charge externe à vos volumes réels, sans engagement lourd.</p>
        </div>
      </>
    ),
  },
  "volume": {
    title: "Une équipe dimensionnée à votre volumétrie et à vos flux.",
    content: (
      <>
        <p className="mb-6">
          MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d&apos;opérations à traiter, tout en veillant à la continuité et à la sécurisation de l&apos;exécution. Nous ne sous-dimensionnons jamais une mission.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos dispositifs :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Une ressource dédiée :</strong> 
            Un collaborateur unique est affecté à un périmètre précis, garantissant une connaissance parfaite de votre dossier.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Un renfort ponctuel :</strong> 
            Un ou plusieurs collaborateurs viennent absorber une surcharge d&apos;activité temporaire.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Une équipe opérationnelle :</strong> 
            Nous déployons une équipe complète pour gérer un volume important ou plusieurs flux simultanés (ex : gestion d’un portefeuille de 500 dossiers).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Un dispositif évolutif :</strong> 
            L’équipe est ajustée dynamiquement selon la charge, les priorités et les exigences du client.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Une organisation robuste :</strong> 
            Nous assurons la continuité du traitement en cas d&apos;absence (principe de backup) ou de variation d&apos;activité.
          </li>
        </ul>
        <div className="mt-8 p-6 bg-[#F2F0ED] border border-[#D8DCE8] text-sm">
          <strong className="text-[#1B3680] uppercase tracking-wider text-xs mb-2 block">Notre recommandation</strong>
          <p className="text-[#3A4660]">Si vous traitez plus de 100 dossiers par mois, optez pour une équipe dédiée afin d&apos;industrialiser le traitement tout en gardant une qualité constante.</p>
        </div>
      </>
    ),
  },
  "mode-organisation": {
    title: "Une intégration fluide à vos processus et vos outils.",
    content: (
      <>
        <p className="mb-6">
          MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis. Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos modes d&apos;intervention :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Dispositif dédié :</strong> 
            Pour un service ou un périmètre clairement identifié (ex : le back-office d’un pôle patrimoine).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Intervention par mission :</strong> 
            Pour un besoin borné dans le temps ou un projet spécifique (ex : audit de données, mise en place d’un nouveau reporting).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Prise en charge de flux ou de process récurrents :</strong> 
            Nous exécutons des tâches opérationnelles régulières selon des règles définies avec vos équipes.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Traitement de dossiers, adhésions ou opérations :</strong> 
            Nous suivons vos process en vigueur, sans externalisation du jugement métier (qui reste internalisé chez vous).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Suivi structuré :</strong> 
            Nous mettons en place des points de contrôle réguliers (revues hebdomadaires, tableaux de bord de suivi) pour une transparence totale.
          </li>
        </ul>
        <div className="mt-8 p-6 bg-[#F2F0ED] border border-[#D8DCE8] text-sm">
          <strong className="text-[#1B3680] uppercase tracking-wider text-xs mb-2 block">Pourquoi ce choix ?</strong>
          <p className="text-[#3A4660]">Une intégration parfaite à vos outils (ERP, logiciels métier) évite les ruptures de données et accélère la prise en main par nos équipes.</p>
        </div>
      </>
    ),
  },
  "langues": {
    title: "Une capacité d'intervention multilingue pour vos opérations internationales.",
    content: (
      <>
        <p className="mb-6">
          Dans un contexte financier et patrimonial de plus en plus international, la maîtrise des langues est un atout opérationnel majeur. MENUA CONSULTING garantit une gestion fluide des échanges, des reportings et des opérations, quelle que soit la langue de travail de vos équipes.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Langues maîtrisées :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1 flex items-center gap-2">🇫🇷 Français :</strong> 
            Langue principale d’intervention, maîtrise native pour une parfaite intégration dans les environnements francophones (France, Luxembourg, Suisse, Afrique).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1 flex items-center gap-2">🇬🇧 English :</strong> 
            Langue secondaire maîtrisée pour les reportings, les échanges avec des équipes internationales et la gestion de dossiers en anglais.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1 flex items-center gap-2">🌍 Autres langues :</strong> 
            Nous étudions la possibilité d’intervenir dans d’autres langues (ex : espagnol, allemand, italien) selon les besoins spécifiques de vos équipes.
          </li>
        </ul>
        <div className="mt-8 p-6 bg-[#F2F0ED] border border-[#D8DCE8] text-sm">
          <strong className="text-[#1B3680] uppercase tracking-wider text-xs mb-2 block">Notre recommandation</strong>
          <p className="text-[#3A4660]">Si vous opérez à l&apos;international, la centralisation de votre back-office multilingue chez MENUA CONSULTING harmonise la qualité de traitement.</p>
        </div>
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
              { label: "Nos solutions", href: "/nos-solutions" },
              { label: breadcrumbTitle }
            ]} 
            light={true}
          />
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-4 mt-8">Nos solutions</p>
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
