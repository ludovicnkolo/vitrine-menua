import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const pourquoiMenuaData: Record<string, { title: string, description: string, image: string, content: string }> = {
  "nos-benefices": {
    title: "Nos bénéfices",
    description: "Vous gagnez du temps, améliorez votre productivité et renforcez votre fiabilité.",
    image: "/pourquoi-menua-hero.jpg",
    content: "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d’affaires.\n\nCette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d’activité et de fidéliser durablement votre clientèle.\n\n### Bénéfices pour votre organisation :\n- Gain de temps\n- Réduction des charges internes\n- Productivité accrue\n- Efficacité renforcée\n- Fiabilité des opérations\n- Fidélisation de la clientèle\n- Chiffre d’affaires soutenu"
  },
  "notre-differenciation": {
    title: "Notre différenciation",
    description: "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.",
    image: "/notebook.jpg",
    content: "### Pourquoi nous choisir ?\nSpécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.\n\nNotre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d’intervention en français comme en anglais nous permettent d’intervenir dans des environnements exigeants, structurés et ouverts à l’international.\n\n### Notre force :\n- Spécialisation back et middle office\n- Approche 100% opérationnelle\n- Intégration à votre organisation\n- Exécution fiable et continue\n- Supervision qualité des livrables\n- Intervention bilingue français / anglais"
  },
  "nos-engagements": {
    title: "Nos engagements",
    description: "MENUA CONSULTING s’engage sur l’essentiel : la qualité, le respect des délais et la traçabilité.",
    image: "/nous-rejoindre-hero.jpg",
    content: "MENUA CONSULTING s’engage sur l’essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.\n\nNos interventions s’appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.\n\n### Notre expertise garantit :\n- Qualité des livrables\n- Respect des délais\n- Traçabilité des opérations\n- Contrôle à quatre yeux\n- Communication claire et régulière\n- Formation des ressources mobilisées\n- Respect de vos exigences opérationnelles, qualité et réglementaires"
  }
};

export default async function PourquoiMenuaDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = pourquoiMenuaData[slug];

  if (!pageData) {
    notFound();
  }

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
            <Link href="/pourquoi-menua" className="hover:text-white transition-colors">Pourquoi Menua ?</Link>
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
              <h3 className="font-serif text-2xl font-bold mb-4">Rejoignez nos clients</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Faites appel à des experts dédiés à l'exécution de vos opérations de back et middle office.
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
