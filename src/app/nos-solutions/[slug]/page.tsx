import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const nosSolutionsData: Record<string, { title: string, description: string, image: string, content: string }> = {
  "urgence": {
    title: "Urgence – Capacité de réaction",
    description: "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat.",
    image: "/headphones.jpg",
    content: "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d’activité et assurer la continuité de votre service.\n\n### Comment ?\n- Surcharge d’activité ou pic de dossiers\n- Remplacement temporaire d’un collaborateur absent\n- Renfort ponctuel en période de clôture ou de reporting\n- Traitement accéléré de dossiers en retard ou en attente\n- Mise à disposition progressive de ressources pour sécuriser la montée en charge"
  },
  "duree": {
    title: "Durée – Flexibilité contractuelle",
    description: "Des dispositifs d’externalisation flexibles, adaptés dans le temps.",
    image: "/vos-besoins-hero.jpg",
    content: "MENUA CONSULTING propose des dispositifs d’externalisation flexibles, adaptés au traitement d’un nombre défini de dossiers comme à la gestion récurrente d’un portefeuille plus important.\n\n### Notre expertise nous permet de vous garantir :\n- Mission courte pour traiter un besoin identifié sur une période limitée\n- Mission longue pour accompagner la gestion d’un portefeuille de dossiers dans la durée\n- Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles\n- Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs\n- Ajustement du dispositif selon l’évolution de la charge et des priorités du client"
  },
  "volume": {
    title: "Volume – Dimensionnement d'équipe",
    description: "Adaptation de nos ressources au volume de dossiers, de flux ou d’opérations à traiter.",
    image: "/nos-solutions-hero.jpg",
    content: "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d’opérations à traiter, tout en veillant à la continuité et à la sécurisation de l’exécution.\n\n### Nos dispositifs :\n- Une ressource dédiée sur un périmètre précis\n- Un renfort ponctuel pour absorber une surcharge d’activité\n- Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés\n- Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client\n- Une organisation permettant d’assurer la continuité du traitement en cas d’absence ou de variation d’activité"
  },
  "mode-d-organisation": {
    title: "Mode d'organisation",
    description: "Nous structurons nos interventions selon le format le plus adapté à vos contraintes.",
    image: "/notebook.jpg",
    content: "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.\n\nNous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.\n\n### Mode d’interventions :\n- Dispositif dédié pour un service ou un périmètre clairement identifié\n- Intervention par mission pour un besoin borné dans le temps ou un projet spécifique\n- Prise en charge de flux ou de process récurrents\n- Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes\n- Suivi structuré avec points de contrôle réguliers"
  },
  "langues": {
    title: "Langues – FR / EN et autres",
    description: "Nous intervenons en français et en anglais.",
    image: "/finance-globe.jpg",
    content: "Nous intervenons de manière native et fluide en français et en anglais, garantissant un suivi parfait dans des environnements internationaux.\n\nD’autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes."
  }
};

export default async function NosSolutionsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = nosSolutionsData[slug];

  if (!pageData) {
    notFound();
  }

  // Parseur markdown pour extraire les listes à puces
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-xl font-bold mt-8 mb-4 text-[#051014]">{block.replace('### ', '')}</h3>;
      }
      if (block.includes('\n- ')) {
        const lines = block.split('\n');
        return (
          <ul key={idx} className="space-y-3 mb-6">
            {lines.filter(line => line.startsWith('- ')).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700 leading-relaxed">{item.replace('- ', '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-4">{block}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
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
            <Link href="/nos-solutions" className="hover:text-white transition-colors">Nos solutions</Link>
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

      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 relative rounded-t-[3rem] -mt-8 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="md:w-2/3">
            <h2 className="font-serif text-3xl font-bold mb-8 text-[#051014]">En détail</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              {renderContent(pageData.content)}
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-[#051014] text-white p-8 rounded-2xl sticky top-32 shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-4">Besoin d'une solution sur-mesure ?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Nous concevons des dispositifs d’externalisation adaptés à vos contraintes.
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
