import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Calendar, Layers, Users, Globe } from "lucide-react";

export default function NosSolutions() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">

      {/* HERO */}
      <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/70 to-transparent z-10 w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/nos-solutions-hero.jpg" alt="Nos solutions" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-24">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Nos solutions</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight mb-6">
            Nos <span className="text-[#c89b53] italic font-normal">solutions</span>
          </h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 max-w-lg text-base leading-relaxed">
            Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles d'urgence, de durée, de volume et d'organisation.
          </p>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-20">Des solutions flexibles et sur-mesure</h2>

          <div className="space-y-20">
            {/* URGENCE */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center shadow-md shrink-0">
                <Clock className="text-[#c89b53]" size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Urgence</h3>
                <p className="text-[#c89b53] text-xs font-semibold uppercase tracking-wider mb-4">Capacité de réaction</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.</p>
                <ul className="space-y-2">
                  {["Surcharge d'activité ou pic de dossiers","Remplacement temporaire d'un collaborateur absent","Renfort ponctuel en période de clôture ou de reporting","Traitement accéléré de dossiers en retard ou en attente","Mise à disposition progressive de ressources pour sécuriser la montée en charge"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={15} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DURÉE */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center shadow-md shrink-0">
                <Calendar className="text-[#c89b53]" size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Durée</h3>
                <p className="text-[#c89b53] text-xs font-semibold uppercase tracking-wider mb-4">Flexibilité contractuelle</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.</p>
                <ul className="space-y-2">
                  {["Mission courte pour traiter un besoin identifié sur une période limitée","Mission longue pour accompagner la gestion d'un portefeuille dans la durée","Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles","Intervention ponctuelle sur un volume de dossiers comptables, financiers ou administratifs","Ajustement du dispositif selon l'évolution de la charge et des priorités du client"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={15} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* VOLUME */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center shadow-md shrink-0">
                <Layers className="text-[#c89b53]" size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Volume</h3>
                <p className="text-[#c89b53] text-xs font-semibold uppercase tracking-wider mb-4">Dimensionnement de l'équipe</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.</p>
                <ul className="space-y-2">
                  {["Une ressource dédiée sur un périmètre précis","Un renfort ponctuel pour absorber une surcharge d'activité","Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés","Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client","Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={15} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ORGANISATION */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center shadow-md shrink-0">
                <Users className="text-[#c89b53]" size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Mode d'organisation</h3>
                <p className="text-[#c89b53] text-xs font-semibold uppercase tracking-wider mb-4">Comment le travail est exécuté</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes. Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.</p>
                <ul className="space-y-2">
                  {["Dispositif dédié pour un service ou un périmètre clairement identifié","Intervention par mission pour un besoin borné dans le temps ou un projet spécifique","Prise en charge de flux ou de process récurrents","Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes","Suivi structuré avec points de contrôle réguliers"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={15} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* LANGUES */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center shadow-md shrink-0">
                <Globe className="text-[#c89b53]" size={36} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Langues</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Nous intervenons en français et en anglais. D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXEMPLES */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-[#0d222b] p-12 flex-1">
            <h2 className="font-serif text-2xl font-bold mb-8">Exemples d'interventions</h2>
            <ul className="space-y-5">
              {["Production et fiabilisation de reporting","Préparation et suivi de performances","Contrôles et rapprochements bancaires","Suivi de KYC et révisions de bord","Gestion de bases de données et reporting","Traitement de dossiers en volume","Renfort en période de clôture","Support aux équipes patrimoniales"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={18} />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-5/12 min-h-[300px] relative">
            <img src="/staircase.jpg" alt="Architecture" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d222b] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#051014] px-8 pb-20">
        <div className="max-w-5xl mx-auto bg-[#0d222b] rounded-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{n:"+150",l:"missions réalisées",s:"au service de nos clients"},{n:"98%",l:"de clients satisfaits",s:"sur nos dernières missions"},{n:"40+",l:"experts mobilisables",s:"en France et à l'international"}].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-bold font-serif text-[#c89b53] mb-2">{stat.n}</div>
                <div className="text-white font-semibold text-sm">{stat.l}</div>
                <div className="text-gray-500 text-xs mt-1">{stat.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[280px]">
          <div className="flex-1 bg-[#0d222b] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Discutons de votre projet<br/>et de la meilleure approche.</h2>
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
