import Link from "next/link";
import { ArrowRight, CheckCircle2, PieChart, BarChart3, ShieldCheck, FileSpreadsheet, Briefcase, Users } from "lucide-react";

const domains = [
  {
    icon: PieChart,
    img: "/finance-globe.jpg",
    title: "Finance & reporting",
    intro: "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
    items: ["Reporting financier et KPI / Dashboard","Analyse de performance","Support direction financière","Consolidation des données","Préparation de reportings pour direction financière","Suivi d'activité mensuel / trimestriel","Reporting de trésorerie et de rentabilité","Suivi des indicateurs"],
  },
  {
    icon: BarChart3,
    img: "/meeting.jpg",
    title: "Contrôle de gestion",
    intro: "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
    items: ["Suivi budgétaire","Analyse des écarts entre réalisé, budget et prévisionnel","Tableaux de bord et pilotage de performance","Suivi des coûts, charges et marges","Analyse de rentabilité","Préparation de reportings de gestion","Suivi du chiffre d'affaires et des objectifs","Consolidation des données de gestion"],
  },
  {
    icon: ShieldCheck,
    img: "/safe.jpg",
    title: "Risques & conformité",
    intro: "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires.",
    items: ["KYC / LCB-FT / AML","Contrôle documentaire et analyse de complétude","Vérification des pièces justificatives","Entrée en relation client et revue périodique","Remédiation KYC","Traitement des alertes de conformité","Analyse des mouvements inhabituels","Support aux équipes risques et conformité","Préparation de dossiers pour validation par les équipes habilitées"],
  },
  {
    icon: FileSpreadsheet,
    img: "/data-screen.jpg",
    title: "Support comptable & data",
    intro: "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
    items: ["Saisie comptable","Rapprochements bancaires et lettrage des comptes","Contrôle et classement des pièces comptables","Préparation des déclarations de TVA","Suivi des factures clients et fournisseurs","Relances administratives","Data cleaning et structuration des bases de données","Contrôle de cohérence des données","Préparation de fichiers de reporting","Consolidation de données comptables et opérationnelles","Archivage et organisation documentaire"],
  },
  {
    icon: Users,
    img: "/nous-rejoindre-hero.jpg",
    title: "Gestion de patrimoine & support CGP",
    intro: "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
    items: ["Préparation des dossiers d'entrée en relation","Collecte et contrôle des pièces justificatives","Contrôle de complétude des dossiers clients","Mise à jour des informations clients","Préparation et pré-remplissage de formulaires","Support administratif aux souscriptions, arbitrages et rachats","Suivi des demandes clients","Organisation et archivage documentaire","Suivi des opérations patrimoniales dans le respect des procédures internes"],
  },
  {
    icon: Briefcase,
    img: "/office-lounge.jpg",
    title: "Autres besoins opérationnels",
    intro: "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
    items: ["Missions ponctuelles de renfort opérationnel","Support administratif financier","Traitement de dossiers en volume","Classement, archivage et organisation documentaire","Préparation et mise à jour de fichiers de suivi","Assistance à la formalisation de procédures internes","Aide à la structuration de process opérationnels","Support en période de surcharge d'activité","Remplacement ou appui temporaire d'équipe","Coordination entre équipes internes et prestataires externalisés"],
  },
];

export default function VosBesoins() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">

      {/* HERO */}
      <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/70 to-transparent z-10 w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/vos-besoins-hero.jpg" alt="Vos besoins" className="w-full h-full object-cover opacity-70" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-24">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Vos besoins</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight mb-6">
            Vos <span className="text-[#c89b53] italic font-normal">besoins</span>
          </h1>
          <p className="text-gray-300 max-w-lg text-base leading-relaxed">
            MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.
          </p>
        </div>
      </section>

      {/* DOMAINES D'INTERVENTION */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-20">Nos domaines d'intervention</h2>
          <div className="space-y-16">
            {domains.map((domain, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-10 items-start`}>
                <div className="w-full md:w-56 shrink-0">
                  <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg mx-auto">
                    <img src={domain.img} alt={domain.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#051014] flex items-center justify-center">
                      <domain.icon className="text-[#c89b53]" size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl font-bold">{domain.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{domain.intro}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {domain.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={15} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-2xl bg-[#0d222b] p-14">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <img src="/staircase.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0d222b]"></div>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { number: "+150", label: "missions réalisées", sub: "au service de nos clients" },
              { number: "98%", label: "de clients satisfaits", sub: "sur nos dernières missions" },
              { number: "40+", label: "experts mobilisables", sub: "en France et à l'international" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-5">
                <div className="text-[#c89b53]"><PieChart size={36} strokeWidth={1.5} /></div>
                <div>
                  <div className="text-4xl font-bold text-[#c89b53] font-serif">{stat.number}</div>
                  <div className="text-white font-semibold text-sm mt-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#c89b53] text-7xl font-serif leading-none mb-6">"</div>
          <blockquote className="font-serif text-2xl md:text-3xl font-medium leading-snug mb-8 text-[#051014]">
            Une collaboration fluide, des livrables fiables<br/>et une équipe réactive sur nos besoins critiques.
          </blockquote>
          <cite className="text-gray-500 text-sm not-italic">– Responsable Finance, Groupe International</cite>
          <div className="text-[#c89b53] text-7xl font-serif leading-none mt-4 flex justify-end">"</div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[280px]">
          <div className="flex-1 bg-[#0d222b] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-4 text-white">Un besoin particulier ?<br/>Nous construisons une solution adaptée.</h2>
            <Link href="/nous-contacter" className="mt-6 inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
              Présenter un besoin <ArrowRight size={16} />
            </Link>
          </div>
          <div className="md:w-5/12 min-h-[220px] relative">
            <img src="/nous-contacter-hero.jpg" alt="Contact" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d222b] to-transparent"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
