import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Target, ShieldCheck, Globe, BarChart3 } from "lucide-react";

export default function NousConnaitre() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">

      {/* HERO */}
      <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/40 to-transparent z-10 w-1/2"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/nous-rejoindre-hero.jpg" alt="Nous connaître" className="w-full h-full object-cover opacity-80 rounded-bl-[6rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Nous connaître</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight mb-6">
            Nous <span className="text-[#c89b53] italic font-normal">connaître</span>
          </h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-8"></div>
          <div className="space-y-3 max-w-md">
            <p className="text-gray-300 text-sm leading-relaxed">
              MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation.
            </p>
          </div>
        </div>
      </section>

      {/* PRESENTATION DU CABINET */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-14 items-start mb-24">
            <div className="flex-1">
              <h2 className="font-serif text-3xl font-bold mb-8">Présentation du cabinet</h2>
              <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
                <p>MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, de la gestion de patrimoine et data.</p>
                <p>Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.</p>
                <p>Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.</p>
                <p>Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.</p>
              </div>
            </div>
            <div className="md:w-2/5 h-80 rounded-2xl overflow-hidden shadow-xl shrink-0">
              <img src="/trust-circle.jpg" alt="Cabinet Menua" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* APPROCHE + METHODOLOGIE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Notre approche</h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed mb-8">
                <p>MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.</p>
                <p>Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.</p>
                <p>Notre approche repose sur trois piliers : <strong>continuité opérationnelle</strong>, <strong>traçabilité des actions</strong> et <strong>fiabilité des livrables</strong>.</p>
                <p>Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.</p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Notre méthodologie en 5 étapes</h2>
              <div className="space-y-5">
                {[
                  { num: "01", label: "Découverte", desc: "Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention." },
                  { num: "02", label: "Vérifications préalables", desc: "Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle." },
                  { num: "03", label: "Analyse", desc: "Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables." },
                  { num: "04", label: "Mise en œuvre & formation", desc: "Déploiement des équipes et intégration aux outils, process et standards de votre organisation." },
                  { num: "05", label: "Suivi dans la durée", desc: "Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables." },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-full bg-[#051014] text-[#c89b53] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{step.num}</div>
                    <div className="flex-1 border-b border-gray-200 pb-4">
                      <div className="font-bold text-sm text-[#051014] mb-1">{step.label}</div>
                      <div className="text-gray-500 text-xs leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section className="bg-[#0d222b] px-8 py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-14 items-center">
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Accréditations, certifications<br/>& cadre d'intervention
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
              <p>MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.</p>
              <p>La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.</p>
              <p>Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).</p>
              <p className="text-gray-500 text-xs italic">MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients.</p>
            </div>
            <ul className="space-y-3">
              {["Certification AMF via la dirigeante","Certification en Contrôle Interne et Gestion des Risques","Expérience en environnements réglementés","Séparation des espaces et des périmètres habilités","Respect des exigences réglementaires des clients"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5" size={16} />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-56 flex items-center justify-center shrink-0">
            <div className="w-48 h-48 rounded-full border-4 border-[#c89b53] bg-[#051014] flex flex-col items-center justify-center shadow-2xl">
              <div className="text-[#c89b53] font-serif text-4xl font-bold">AMF</div>
              <div className="text-gray-400 text-[0.5rem] tracking-widest uppercase mt-2 text-center px-6 leading-relaxed">Enregistrement<br/>par la dirigeante</div>
              <div className="mt-3 text-[#c89b53]"><ShieldCheck size={24} strokeWidth={1.5} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTRE EQUIPE */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2">Notre équipe</h2>
          <p className="text-gray-500 text-sm mb-14">Une direction impliquée au plus près des opérations</p>

          <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
            <div className="w-52 h-64 rounded-2xl overflow-hidden shadow-lg shrink-0">
              <img src="/meeting.jpg" alt="Rosette Fouelefack" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold mb-1">Rosette Fouelefack</h3>
              <div className="text-[#c89b53] text-sm font-semibold mb-5">Directrice Générale</div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>Rosette Fouelefack est directrice générale de MENUA CONSULTING. Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants.</p>
                <p>Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.</p>
                <p>MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.</p>
                <p>Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-12">
            {[
              { icon: Target, label: "Direction\nimpliquée" },
              { icon: Users, label: "Organisation\nagile" },
              { icon: ShieldCheck, label: "Contrôle\nà 4 yeux" },
              { icon: BarChart3, label: "Supervision\ncontinue" },
            ].map((pillar, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center mb-3 shadow-sm">
                  <pillar.icon className="text-[#c89b53]" size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-xs whitespace-pre-line leading-snug">{pillar.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[260px]">
          <div className="flex-1 bg-[#0d222b] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Un besoin particulier ?<br/>Nous construisons une solution adaptée.</h2>
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
