import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallToAction from "@/components/layout/CallToAction";

const pagesData: Record<string, any> = {
  "nos-benefices": {
    title: "Gagnez en efficacité, fiabilité et performance durable.",
    content: (
      <>
        <p className="mb-6">
          En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous transformez votre organisation opérationnelle. Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d&apos;activité et de fidéliser durablement votre clientèle.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos 7 bénéfices clés :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Gain de temps :</strong> 
            Libérez vos équipes internes des tâches chronophages pour qu&apos;elles se concentrent sur le cœur stratégique de votre métier.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Réduction des charges internes :</strong> 
            Optimisez votre structure de coûts en transformant des charges fixes (salaires, locaux, formations) en charges variables et maîtrisées.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Productivité accrue :</strong> 
            Nos équipes, rodées aux process exigeants, exécutent vos flux avec une efficacité supérieure, réduisant les délais de traitement.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Efficacité renforcée :</strong> 
            Nous fluidifions vos circuits internes et apportons une méthodologie éprouvée pour chaque type de dossier.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Fiabilité des opérations :</strong> 
            Grâce à des procédures de contrôle strictes et à la traçabilité de chaque action, nous sécurisons l&apos;intégrité de vos données et de vos opérations.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Fidélisation de la clientèle :</strong> 
            Un back-office fluide et sans erreur améliore l&apos;expérience de vos clients finaux, qui bénéficient d&apos;une réactivité et d&apos;une précision accrues.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Chiffre d&apos;affaires soutenu :</strong> 
            En étant plus réactif et plus fiable, vous pouvez traiter plus de dossiers dans les mêmes délais, développant ainsi votre capacité commerciale et votre CA.
          </li>
        </ul>
      </>
    ),
  },
  "notre-differenciation": {
    title: "Spécialistes du back et du middle office, nous exécutons.",
    content: (
      <>
        <p className="mb-6">
          Ce qui distingue MENUA CONSULTING des cabinets de conseil traditionnels, c&apos;est notre ADN résolument opérationnel. Nous ne livrons pas des préconisations, nous livrons des dossiers traités, des reportings fiabilisés et des flux sécurisés.
        </p>
        <p className="mb-6">
          Notre capacité à nous immerger dans vos outils et votre culture d&apos;entreprise, couplée à une double compétence linguistique, fait de nous un partenaire agile dans des environnements complexes et internationaux.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos 6 atouts différenciants :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Spécialisation back et middle office :</strong> 
            Nous ne dispersons pas nos compétences. Notre cœur de métier, ce sont les fonctions supports critiques (finance, conformité, comptabilité, patrimoine).
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Approche 100% opérationnelle :</strong> 
            Nous prenons le relais de vos équipes sur l&apos;exécution quotidienne. Vous définissez le cap, nous tenons la barre.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Intégration à votre organisation :</strong> 
            Nous ne travaillons pas en silo. Nos collaborateurs s&apos;immergent dans vos process, utilisent vos outils métier et respectent vos circuits de validation internes.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Exécution fiable et continue :</strong> 
            Nous assurons la permanence des opérations, même en cas d&apos;absence, de congés ou de pics d&apos;activité imprévus.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Supervision qualité des livrables :</strong> 
            Chaque livrable est soumis à un contrôle rigoureux avant d&apos;être restitué, garantissant un niveau de qualité constant.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Intervention bilingue français / anglais :</strong> 
            Nous gérons vos reportings et vos échanges en français comme en anglais, facilitant vos relations avec des clients ou partenaires internationaux.
          </li>
        </ul>
      </>
    ),
  },
  "nos-engagements": {
    title: "Une promesse de rigueur, de transparence et de conformité.",
    content: (
      <>
        <p className="mb-6">
          MENUA CONSULTING s&apos;engage sur l&apos;essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes. Nos interventions s&apos;appuient sur un socle de bonnes pratiques destiné à sécuriser vos processus et à renforcer votre confiance.
        </p>
        <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6">Nos 7 engagements fondateurs :</h3>
        <ul className="space-y-4 text-[#3A4660]">
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Contrôle à quatre yeux garanti :</strong> 
            Aucune donnée critique ne sort de nos équipes sans avoir été validée par un second niveau de contrôle interne.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Qualité des livrables :</strong> 
            Nous garantissons des résultats conformes à vos attentes et aux normes en vigueur dans votre secteur.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Respect des délais :</strong> 
            La ponctualité est une discipline. Nous nous engageons à tenir les échéances que vous nous fixez.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Traçabilité des opérations :</strong> 
            Chaque action est documentée et horodatée. Vous disposez d&apos;une vision claire de l&apos;avancement et des actions menées.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Communication claire et régulière :</strong> 
            Nous vous tenons informé de l&apos;avancement via des points de suivi et des tableaux de bord adaptés à votre besoin.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Formation des ressources mobilisées :</strong> 
            Nos collaborateurs sont formés en continu aux réglementations et aux bonnes pratiques de vos métiers.
          </li>
          <li className="bg-white p-5 border border-[#D8DCE8] border-l-4 border-l-[#1C40C2]">
            <strong className="text-[#1B3680] block mb-1">Respect de vos exigences opérationnelles et réglementaires :</strong> 
            Nous nous adaptons à votre cadre normatif (AMF, ACPR, RGPD, etc.) sans jamais transiger sur la conformité.
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
              { label: "Pourquoi Menua", href: "/pourquoi-menua" },
              { label: breadcrumbTitle }
            ]} 
            light={true}
          />
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-4 mt-8">Pourquoi Menua</p>
          <h1
            className="text-white mb-2"
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
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
