import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallToAction from "@/components/layout/CallToAction";

// --- Données des sous-pages "Nous Connaître" ---
const pagesData: Record<string, any> = {
  "presentation-du-cabinet": {
    title: "Un partenaire de confiance pour vos opérations financières et réglementées.",
    content: (
      <>
        <p className="mb-4">
          MENUA CONSULTING accompagne les entreprises dans l&apos;externalisation opérationnelle de fonctions back et middle office.
        </p>
        <p className="mb-4">
          Basé à Paris, le cabinet intervient dans des environnements financiers, comptables, patrimoniaux et réglementés. Nous mettons à disposition des entreprises, cabinets d’expertise comptable et acteurs financiers des équipes opérationnelles dédiées, capables d’exécuter des missions exigeantes.
        </p>
        <p className="mb-4 font-semibold text-[#1B3680]">
          Nos collaborateurs s&apos;intègrent pleinement aux organisations clientes afin de :
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-[#3A4660]">
          <li>Prendre en charge l’exécution opérationnelle au quotidien.</li>
          <li>Optimiser les charges internes et la gestion des pics d’activité.</li>
          <li>Sécuriser la continuité des opérations, même en cas d’absence ou de turnover.</li>
        </ul>
        <p>
          Grâce à cette organisation, nos clients peuvent se recentrer sur leur stratégie et leur cœur de métier, tout en bénéficiant de processus financiers maîtrisés, fluides et pérennes.
        </p>
      </>
    ),
  },
  "notre-approche": {
    title: "Une posture résolument opérationnelle et orientée résultats.",
    content: (
      <>
        <p className="mb-4">
          MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités ; nous assurons l&apos;exécution.
        </p>
        <p className="mb-6">
          Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Nos piliers fondamentaux :</h3>
        <ul className="space-y-4 mb-6">
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-[#B8922A] rounded-full mt-2.5 shrink-0"></div>
            <p><strong>Continuité opérationnelle :</strong> Nous assurons la permanence et la fluidité de vos opérations, quel que soit le contexte.</p>
          </li>
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-[#B8922A] rounded-full mt-2.5 shrink-0"></div>
            <p><strong>Traçabilité des actions :</strong> Chaque intervention est documentée, horodatée et vérifiable, garantissant une transparence totale.</p>
          </li>
          <li className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-[#B8922A] rounded-full mt-2.5 shrink-0"></div>
            <p><strong>Fiabilité des livrables :</strong> Nous garantissons des résultats conformes à vos attentes et aux normes en vigueur.</p>
          </li>
        </ul>
        <p className="font-semibold text-[#1B3680] bg-[#DAF0F7]/30 p-4 border-l-2 border-[#1C40C2]">
          Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.
        </p>
      </>
    ),
  },
  "notre-methodologie": {
    title: "Un cadre structuré pour une exécution sans faille.",
    content: (
      <>
        <p className="mb-8">
          Notre méthodologie repose sur un processus en 5 étapes clés, garantissant une intégration rapide et un suivi rigoureux de chaque mission.
        </p>
        <div className="space-y-6">
          {[
            { num: "01", title: "Découverte", desc: "Analyse approfondie de votre organisation, de vos processus internes, de vos contraintes réglementaires et de vos objectifs opérationnels." },
            { num: "02", title: "Vérifications préalables", desc: "Vérification de l'identité juridique, de la situation administrative et des éventuelles obligations spécifiques liées à votre secteur." },
            { num: "03", title: "Analyse et proposition", desc: "Construction d'une proposition opérationnelle sur mesure, adaptée à vos besoins, à vos outils et à votre volumétrie." },
            { num: "04", title: "Mise en œuvre", desc: "Déploiement des équipes opérationnelles, intégration aux outils et processus existants, et lancement de la mission." },
            { num: "05", title: "Suivi dans la durée", desc: "Pilotage continu de la mission, points de contrôle réguliers, reporting de performance et contrôle qualité des livrables." },
          ].map((step, idx) => (
            <div key={idx} className="bg-white border border-[#D8DCE8] p-6 flex gap-6">
              <span className="font-serif text-3xl font-bold text-[#B8922A] opacity-50">{step.num}</span>
              <div>
                <h4 className="font-bold text-[#1B3680] mb-2">{step.title}</h4>
                <p className="text-[#3A4660] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  "accreditations": {
    title: "Une expertise reconnue dans des environnements réglementés.",
    content: (
      <>
        <p className="mb-4">
          MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées. La dirigeante dispose notamment de :
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-[#3A4660]">
          <li>La certification AMF (Autorité des Marchés Financiers).</li>
          <li>Une certification en Contrôle Interne et Gestion des Risques des institutions financières.</li>
          <li>Une expérience solide acquise au sein d&apos;environnements financiers, patrimoniaux et réglementés.</li>
        </ul>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Notre cadre de supervision :</h3>
        <p className="mb-4">
          MENUA CONSULTING n&apos;exerce pas d&apos;activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d&apos;agrément et de supervision de ses clients.
        </p>
        <p className="p-4 bg-[#F2F0ED] border-l-2 border-[#B8922A] text-sm text-[#3A4660]">
          Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus, tout en laissant la responsabilité réglementaire et la supervision client à nos partenaires agréés.
        </p>
      </>
    ),
  },
  "notre-equipe": {
    title: "Une direction impliquée au plus près des opérations.",
    content: (
      <>
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
          <div className="w-48 h-48 shrink-0 rounded-full overflow-hidden border-4 border-[#F2F0ED]">
            <img src="/rosette.jpg" alt="Rosette Fouelefack" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1B3680] mb-1">Rosette Fouelefack</h3>
            <p className="text-[#1C40C2] text-xs font-bold tracking-widest uppercase mb-4">Directrice générale</p>
            <p className="mb-4 text-[#3A4660]">
              Rosette Fouelefack dispose d&apos;une expérience approfondie en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d&apos;environnements exigeants (grandes institutions financières et cabinets de conseil).
            </p>
            <p className="font-semibold text-[#1B3680] mb-2">Elle supervise directement :</p>
            <ul className="list-disc pl-6 space-y-1 text-[#3A4660] text-sm">
              <li>La structuration des missions.</li>
              <li>La constitution des équipes dédiées.</li>
              <li>La validation finale des livrables.</li>
              <li>Le dispositif global de contrôle qualité (principe des 4 yeux).</li>
            </ul>
          </div>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Une organisation agile :</h3>
        <p className="mb-4">
          MENUA CONSULTING s&apos;appuie sur une organisation agile, composée d&apos;une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins spécifiques de chaque client.
        </p>
        <p>
          Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d&apos;exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.
        </p>
      </>
    ),
  },
  "nos-implantations": {
    title: "Une capacité d'intervention en France et à l'international.",
    content: (
      <>
        <p className="mb-8">
          MENUA CONSULTING est basé à Paris, avec une capacité d&apos;intervention en France métropolitaine et à l&apos;international.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#D8DCE8] p-6">
            <h4 className="font-bold text-[#1B3680] mb-2 uppercase text-sm tracking-wider">France métropolitaine</h4>
            <p className="text-[#3A4660]">Paris (siège social) – 92 rue des Pyrénées – 75020 Paris.</p>
          </div>
          <div className="bg-white border border-[#D8DCE8] p-6">
            <h4 className="font-bold text-[#1B3680] mb-2 uppercase text-sm tracking-wider">International</h4>
            <p className="text-[#3A4660] mb-2">Interventions possibles dans les principaux centres financiers internationaux, notamment :</p>
            <ul className="list-disc pl-4 text-[#3A4660] text-sm">
              <li>Luxembourg</li>
              <li>Suisse</li>
              <li>Royaume-Uni</li>
            </ul>
          </div>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-4">Modalités d&apos;intervention :</h3>
        <p className="p-4 bg-[#DAF0F7]/30 border-l-2 border-[#1C40C2] text-[#3A4660]">
          Nos équipes interviennent à distance pour l&apos;exécution quotidienne des opérations, ou en présentiel selon les besoins spécifiques et la configuration de la mission.
        </p>
      </>
    ),
  },
  "interprofessionnalite": {
    title: "Le partenaire privilégié des experts-comptables, avocats, notaires et CGP.",
    content: (
      <>
        <p className="mb-4">
          MENUA CONSULTING est le partenaire privilégié des professionnels du droit, du chiffre et du conseil en gestion de patrimoine.
        </p>
        <p className="mb-8">
          Nous accompagnons les experts-comptables, avocats, notaires et Conseillers en Gestion de Patrimoine (CGP) dans l&apos;externalisation des fonctions back et middle office de leurs clients.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos offres dédiées aux cabinets :</h3>
        <div className="space-y-6">
          <div className="bg-white border border-[#D8DCE8] p-6 border-l-4 border-l-[#1C40C2]">
            <h4 className="font-bold text-[#1B3680] mb-2">Structuration</h4>
            <p className="text-[#3A4660] text-sm">Mise en place d&apos;un pôle patrimonial ou opérationnel au sein de votre cabinet, sans avoir à recruter en interne.</p>
          </div>
          <div className="bg-white border border-[#D8DCE8] p-6 border-l-4 border-l-[#1C40C2]">
            <h4 className="font-bold text-[#1B3680] mb-2">Accompagnement</h4>
            <p className="text-[#3A4660] text-sm">Prise en charge de l&apos;exécution opérationnelle pour vos propres clients (gestion administrative, suivi comptable, reportings).</p>
          </div>
          <div className="bg-white border border-[#D8DCE8] p-6 border-l-4 border-l-[#1C40C2]">
            <h4 className="font-bold text-[#1B3680] mb-2">Formation</h4>
            <p className="text-[#3A4660] text-sm">Renforcement des compétences de vos équipes sur les enjeux back & middle office, la réglementation et les bonnes pratiques.</p>
          </div>
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

  // Create human-readable title for breadcrumb
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
              { label: "Nous connaître", href: "/nous-connaitre" },
              { label: breadcrumbTitle }
            ]} 
            light={true}
          />
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-4 mt-8">Nous connaître</p>
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
