import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function PourquoiMenua() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO */}
      <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/70 to-transparent z-10 w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/pourquoi-menua-hero.jpg" alt="Pourquoi Menua" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-24">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Pourquoi Menua ?</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">
            Pourquoi choisir<br/>Menua Consulting ?
          </h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-base max-w-md leading-relaxed">
            MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-24">
        <div className="max-w-5xl mx-auto">

          {/* BENEFICES */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl font-bold mb-4">Nos bénéfices</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-8">
              En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires. Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {["Gain de temps","Réduction des charges internes","Productivité accrue","Efficacité renforcée","Fiabilité des opérations","Fidélisation de la clientèle","Chiffre d'affaires soutenu"].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />{item}
                </div>
              ))}
            </div>
          </div>

          {/* DIFFERENTIATION */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl font-bold mb-4">Notre différenciation</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-8">
              Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons. Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {["Spécialisation back et middle office","Approche 100% opérationnelle","Intégration à votre organisation","Exécution fiable et continue","Supervision qualité des livrables","Intervention bilingue français / anglais"].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />{item}
                </div>
              ))}
            </div>
          </div>

          {/* ENGAGEMENTS */}
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4">Nos engagements</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mb-8">
              MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes. Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {["Qualité des livrables","Respect des délais","Traçabilité des opérations","Contrôle à quatre yeux","Communication claire et régulière","Formation des ressources mobilisées","Respect de vos exigences opérationnelles, qualité et réglementaires"].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto bg-[#0d222b] rounded-2xl p-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{n:"30+",l:"années d'expérience"},{n:"100+",l:"clients opérationnels"},{n:"2",l:"langues FR / EN"}].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-bold font-serif text-[#c89b53] mb-3">{stat.n}</div>
                <div className="text-gray-300 text-sm">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#c89b53] text-7xl font-serif leading-none mb-6">"</div>
          <blockquote className="font-serif text-2xl font-medium leading-snug mb-8">
            Une collaboration fluide, des livrables fiables<br/>et une équipe réactive sur nos besoins critiques.
          </blockquote>
          <cite className="text-gray-500 text-sm not-italic">– Responsable Finance, Groupe International</cite>
          <div className="text-[#c89b53] text-7xl font-serif leading-none mt-4 flex justify-end">"</div>
        </div>
      </section>

      {/* CONTACT MINI */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">Accueil › Nous contacter</div>
            <h2 className="font-serif text-4xl font-bold mb-4">Une question, un besoin ?<br/>Contactez-nous.</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-8">Notre équipe est à votre écoute pour comprendre vos enjeux et vous proposer une réponse adaptée.</p>
            <Link href="/nous-contacter" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
          <div className="md:w-2/5 h-64 rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img src="/nous-contacter-hero.jpg" alt="Contact" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
