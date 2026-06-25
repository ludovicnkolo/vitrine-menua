import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const nousConnaitreData: Record<string, { title: string, description: string, image: string, content: string }> = {
  "presentation-du-cabinet": {
    title: "Présentation du cabinet",
    description: "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, de la gestion de patrimoine et data.",
    image: "/nous-rejoindre-hero.jpg",
    content: "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d’exécuter des missions exigeantes avec rigueur, continuité et fiabilité.\n\nNos collaborateurs s’intègrent aux organisations clientes afin de prendre en charge l’exécution opérationnelle, d’optimiser les charges internes et de sécuriser la continuité des opérations.\n\nCette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes."
  },
  "notre-approche": {
    title: "Notre approche",
    description: "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l’exécution.",
    image: "/vos-besoins-hero.jpg",
    content: "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.\n\nNotre approche repose sur trois piliers : continuité opérationnelle, traçabilité des actions et fiabilité des livrables.\n\nNos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international."
  },
  "notre-methodologie": {
    title: "Notre méthodologie",
    description: "Une méthodologie stricte pour sécuriser l'exécution de vos opérations.",
    image: "/nos-solutions-hero.jpg",
    content: "### Découverte\nAnalyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.\n\n### Vérifications préalables\nVérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.\n\n### Analyse\nConstruction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation et les livrables attendus.\n\n### Mise en œuvre & formation\nDéploiement des équipes et intégration aux outils, process et standards de votre organisation.\n\n### Suivi dans la durée\nPilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables."
  },
  "accreditations-et-certifications": {
    title: "Accréditations & certifications",
    description: "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
    image: "/pourquoi-menua-hero.jpg",
    content: "La dirigeante dispose notamment de la certification AMF, d’une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d’une expérience acquise au sein d’environnements financiers, patrimoniaux et réglementés.\n\nLe cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).\n\nMENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d’agrément et de supervision de ses clients.\n\nCe dispositif garantit la conformité, la qualité des opérations et la sécurité des processus."
  },
  "notre-equipe": {
    title: "Notre équipe",
    description: "Une direction impliquée au plus près des opérations.",
    image: "/notebook.jpg",
    content: "Rosette Fouelefack est directrice générale de MENUA CONSULTING.\n\nElle dispose d’une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d’environnements exigeants.\n\nElle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.\n\nMENUA CONSULTING s’appuie sur une organisation agile, composée d’une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.\n\nChaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d’exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.\n\nMENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service."
  }
};

export default async function NousConnaitreDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = nousConnaitreData[slug];

  if (!pageData) {
    notFound();
  }

  // Petit parser de markdown simple pour les titres h3 (utilisés dans la méthodo)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-xl font-bold mt-8 mb-3 text-[#051014]">{paragraph.replace('### ', '')}</h3>;
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO COMPACT */}
      <section className="relative w-full min-h-[45vh] flex items-end overflow-hidden pt-24">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/80 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-[#051014]/20 to-transparent z-10"></div>
          <img src={pageData.image} alt={pageData.title} className="w-full h-full object-cover opacity-60" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-16">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4 flex items-center flex-wrap gap-2">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="text-gray-600">›</span>
            <Link href="/nous-connaitre" className="hover:text-white transition-colors">Nous connaître</Link>
            <span className="text-gray-600">›</span>
            <span className="text-white">{pageData.title}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            {pageData.title}
          </h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {pageData.description}
          </p>
        </div>
      </section>

      {/* CONTENU DÉTAILLÉ */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 relative rounded-t-[3rem] -mt-8 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          
          {/* MAIN CONTENT */}
          <div className="md:w-2/3">
            <h2 className="font-serif text-3xl font-bold mb-8 text-[#051014]">En détail</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              {renderContent(pageData.content)}
            </div>
          </div>
          
          {/* SIDEBAR CTA */}
          <div className="md:w-1/3">
            <div className="bg-[#051014] text-white p-8 rounded-2xl sticky top-32 shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-4">Besoin d'accompagnement ?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                MENUA CONSULTING accompagne les entreprises dans l’externalisation opérationnelle.
              </p>
              <Link href="/nous-contacter" className="flex items-center justify-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-4 rounded text-xs font-bold tracking-wider uppercase transition-colors w-full">
                Nous contacter <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
