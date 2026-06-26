"use client";
import Link from "next/link";
import { ArrowRight, Shield, Award, ShieldCheck, Search, FileText, CheckCircle2, RotateCw, MapPin, Globe2, Laptop, Network, Users, BookOpen, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FA] font-sans pt-24">
      {/* ── HEADER INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2B45] mb-6">
            {t("Notre cabinet", "Our Firm")}
          </h1>
          <p className="text-[#1E2A3A] text-lg max-w-2xl mx-auto leading-relaxed">
            {t(
              "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office.",
              "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* ── 1.1 PRÉSENTATION DU CABINET ──────────────────────────────────── */}
      <section id="presentation-du-cabinet" className="bg-[#F8F9FA] px-8 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6">
              {t("MENUA CONSULTING", "MENUA CONSULTING")}
            </h2>
            <div className="text-[#1E2A3A] space-y-6 text-base leading-relaxed">
              <p>
                {t(
                  "MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
                  "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
                )}
              </p>
              <p>
                {t(
                  "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
                  "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability."
                )}
              </p>
              <p>
                {t(
                  "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
                  "Our employees integrate into client organizations to take charge of operational execution, optimize internal costs and secure business continuity."
                )}
              </p>
              <p className="font-semibold text-[#0F2B45]">
                {t(
                  "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                  "This organization allows clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes."
                )}
              </p>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[#0F2B45]/20 mix-blend-multiply z-10"></div>
              <img src="/nous-rejoindre-hero.jpg" alt="MENUA Consulting Bureau" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 1.2 NOTRE APPROCHE ───────────────────────────────────────────── */}
      <section id="notre-approche" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-8 text-center">
            {t("Notre approche", "Our approach")}
          </h2>
          <div className="text-[#1E2A3A] text-center text-lg max-w-4xl mx-auto mb-12 space-y-6 leading-relaxed">
            <p>
              {t(
                "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.",
                "MENUA CONSULTING adopts a resolutely operational posture: clients define the needs, methods, and priorities, we ensure the execution."
              )}
            </p>
            <p>
              {t(
                "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.",
                "We operate in financial, accounting, wealth and regulated environments, strictly respecting internal procedures, validation circuits and quality requirements specific to each organization."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <RotateCw className="text-[#4A8C7A] mb-6" size={36} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Continuité opérationnelle", "Operational continuity")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Nous assurons la permanence et la fluidité de vos opérations.", "We ensure the permanence and fluidity of your operations.")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <FileText className="text-[#4A8C7A] mb-6" size={36} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Traçabilité des actions", "Action traceability")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Chaque intervention est documentée et vérifiable.", "Each intervention is documented and verifiable.")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <CheckCircle2 className="text-[#4A8C7A] mb-6" size={36} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Fiabilité des livrables", "Reliability of deliverables")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Nous garantissons des résultats conformes à vos attentes.", "We guarantee results that meet your expectations.")}</p>
            </div>
          </div>
          <p className="text-center font-medium text-[#0F2B45] max-w-3xl mx-auto">
            {t("Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.", "Our teams can intervene in French and English, guaranteeing smooth management of exchanges, reporting and operations in an international context.")}
          </p>
        </div>
      </section>

      {/* ── 1.3 NOTRE MÉTHODOLOGIE ───────────────────────────────────────── */}
      <section id="notre-methodologie" className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-16 text-center">
            {t("Notre méthodologie", "Our methodology")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {[
              { num: "01", icon: Search, title: t("Découverte", "Discovery"), desc: t("Analyse de votre organisation, de vos processus et de vos contraintes.", "Analysis of your organization, processes and constraints.") },
              { num: "02", icon: ShieldCheck, title: t("Vérifications préalables", "Preliminary checks"), desc: t("Vérification de l'identité juridique et de la situation administrative.", "Verification of legal identity and administrative situation.") },
              { num: "03", icon: FileText, title: t("Analyse", "Analysis"), desc: t("Construction d'une proposition opérationnelle adaptée à vos besoins.", "Construction of an operational proposal adapted to your needs.") },
              { num: "04", icon: Users, title: t("Mise en œuvre", "Implementation"), desc: t("Déploiement des équipes et intégration aux outils et process.", "Deployment of teams and integration with tools and processes.") },
              { num: "05", icon: RotateCw, title: t("Suivi dans la durée", "Long-term tracking"), desc: t("Pilotage continu de la mission et contrôle qualité des livrables.", "Continuous mission management and quality control of deliverables.") },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 flex flex-col text-center border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#4A8C7A]/30 transition-colors">
                <div className="text-[#C89B5E] font-serif text-5xl font-bold opacity-30 mb-4">{step.num}</div>
                <div className="flex justify-center mb-4"><step.icon className="text-[#4A8C7A]" size={28} /></div>
                <h3 className="font-bold text-[#0F2B45] text-sm tracking-widest uppercase mb-3">{step.title}</h3>
                <p className="text-[#3D4F64] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1.4 ACCRÉDITATIONS ───────────────────────────────────────────── */}
      <section id="accreditations" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-8 text-center">
            {t("Accréditations & Certifications", "Accreditations & Certifications")}
          </h2>
          <div className="text-[#1E2A3A] text-center text-lg max-w-4xl mx-auto mb-12 leading-relaxed">
            <p className="mb-6">{t("MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.", "MENUA CONSULTING operates in environments subject to high regulatory requirements.")}</p>
            <p className="font-semibold text-[#0F2B45] mb-4">{t("La dirigeante dispose notamment de :", "The manager has in particular:")}</p>
            <ul className="text-left md:text-center space-y-2 mb-8">
              <li>• {t("La certification AMF", "AMF Certification")}</li>
              <li>• {t("Une certification en Contrôle Interne et Gestion des Risques des institutions financières", "Certification in Internal Control and Risk Management of financial institutions")}</li>
              <li>• {t("Une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés", "Experience acquired in financial, wealth and regulated environments")}</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-[#0F2B45] px-8 py-4 rounded-xl flex flex-col items-center gap-2 shadow-lg w-72 text-center border border-[#1A2D4A]">
              <Award className="text-[#C89B5E] mb-2" size={28} />
              <span className="text-white text-xs font-bold tracking-widest uppercase">CERTIFICATION</span>
              <span className="text-[#C89B5E] text-sm font-semibold">AMF</span>
            </div>
            <div className="bg-[#0F2B45] px-8 py-4 rounded-xl flex flex-col items-center gap-2 shadow-lg w-72 text-center border border-[#1A2D4A]">
              <Shield className="text-[#C89B5E] mb-2" size={28} />
              <span className="text-white text-xs font-bold tracking-widest uppercase">CERTIFICATION</span>
              <span className="text-[#C89B5E] text-sm font-semibold">Contrôle Interne & Gestion des Risques</span>
            </div>
            <div className="bg-[#0F2B45] px-8 py-4 rounded-xl flex flex-col items-center gap-2 shadow-lg w-72 text-center border border-[#1A2D4A]">
              <ShieldCheck className="text-[#C89B5E] mb-2" size={28} />
              <span className="text-white text-xs font-bold tracking-widest uppercase">SUPERVISION CLIENT</span>
              <span className="text-[#C89B5E] text-sm font-semibold">Environnements réglementés</span>
            </div>
          </div>

          <div className="bg-white border-2 border-[#C89B5E] rounded-xl p-8 max-w-4xl mx-auto shadow-sm flex flex-col md:flex-row items-start gap-6">
            <AlertTriangle className="text-[#C89B5E] shrink-0 mt-1" size={32} />
            <div className="text-[#1E2A3A] space-y-4 text-sm leading-relaxed">
              <p>
                <strong className="text-[#0F2B45]">{t("MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre.", "MENUA CONSULTING does not carry out regulated activities in its own name.")}</strong> {t("Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients.", "The firm provides specialized operational resources integrated into the approval and supervision frameworks of its clients.")}
              </p>
              <p>
                {t("Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.", "This system guarantees compliance, quality of operations and process security.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1.5 NOTRE ÉQUIPE ─────────────────────────────────────────────── */}
      <section id="notre-equipe" className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6 text-center">
            {t("Notre équipe", "Our team")}
          </h2>
          <p className="text-[#1E2A3A] text-center text-lg max-w-3xl mx-auto mb-16">
            {t("Une direction impliquée au plus près des opérations.", "Management involved as close as possible to operations.")}
          </p>
          <div className="bg-white rounded-2xl p-10 flex flex-col md:flex-row items-center md:items-start gap-12 shadow-lg border border-gray-100">
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden border-[6px] border-[#F8F9FA] shadow-md bg-gray-200 mb-6">
                <img src="/rosette.jpg" alt="Rosette Fouelefack" className="w-full h-full object-cover" />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#F8F9FA] border border-[#C89B5E] text-[#C89B5E] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                <CheckCircle2 size={16} /> {t("Contrôle 4 yeux", "Four-eyes control")}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <h3 className="font-serif text-3xl font-bold text-[#0F2B45]">Rosette Fouelefack</h3>
              <p className="text-[#4A8C7A] font-bold text-sm tracking-widest uppercase mb-6">{t("Directrice générale", "General Manager")}</p>
              
              <div className="text-[#1E2A3A] leading-relaxed space-y-4 text-sm">
                <p>
                  {t(
                    "Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants.",
                    "She has experience in finance, risk management, wealth management and back & middle office operations acquired in demanding environments."
                  )}
                </p>
                <p>
                  {t(
                    "Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.",
                    "She directly supervises the structuring of missions, the constitution of teams, the validation of deliverables and the quality control system."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                    "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced employees or partners mobilized according to customer needs."
                  )}
                </p>
                <p>
                  {t(
                    "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.",
                    "Each mission is supervised by monitoring, validation and control procedures, to guarantee a level of execution in line with customer expectations and the standards of rigor expected on the French market."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1.6 NOS IMPLANTATIONS ────────────────────────────────────────── */}
      <section id="nos-implantations" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-8 text-center">
            {t("Nos implantations", "Our locations")}
          </h2>
          <p className="text-[#1E2A3A] text-center text-lg max-w-3xl mx-auto mb-12">
            {t(
              "MENUA CONSULTING est basé à Paris, avec une capacité d'intervention en France métropolitaine et à l'international.",
              "MENUA CONSULTING is based in Paris, with an intervention capacity in metropolitan France and internationally."
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-start gap-6">
              <MapPin className="text-[#4A8C7A] shrink-0 mt-1" size={32} />
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-2">{t("France métropolitaine", "Metropolitan France")}</h3>
                <p className="text-[#3D4F64] font-medium">{t("Paris (siège social)", "Paris (Headquarters)")}</p>
                <p className="text-[#3D4F64]">92 rue des Pyrénées – 75020 Paris</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-start gap-6">
              <Globe2 className="text-[#4A8C7A] shrink-0 mt-1" size={32} />
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-2">{t("International", "International")}</h3>
                <p className="text-[#3D4F64]">{t("Interventions possibles dans les principaux centres financiers internationaux (Luxembourg, Suisse, Royaume-Uni, etc.)", "Possible interventions in the main international financial centers (Luxembourg, Switzerland, United Kingdom, etc.)")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-4">
            <Laptop className="text-[#C89B5E]" size={24} />
            <p className="text-[#1E2A3A] font-medium text-center">
              {t(
                "Nos équipes interviennent à distance pour l'exécution des opérations, ou en présentiel selon les besoins et la configuration de la mission.",
                "Our teams intervene remotely for the execution of operations, or on-site according to the needs and configuration of the mission."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 1.7 L'INTERPROFESSIONNALITÉ ──────────────────────────────────── */}
      <section id="interprofessionnalite" className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-8 text-center">
            {t("L'interprofessionnalité", "Interprofessionalism")}
          </h2>
          <div className="text-[#1E2A3A] text-center text-lg max-w-4xl mx-auto mb-16 space-y-4">
            <p>
              {t(
                "MENUA CONSULTING est le partenaire privilégié des professionnels du droit, du chiffre et du conseil en gestion de patrimoine.",
                "MENUA CONSULTING is the privileged partner of legal, accounting and wealth management consulting professionals."
              )}
            </p>
            <p className="font-medium text-[#0F2B45]">
              {t(
                "Nous accompagnons les experts-comptables, avocats, notaires et CGP dans l'externalisation des fonctions back et middle office de leurs clients.",
                "We support chartered accountants, lawyers, notaries and IFAs in the outsourcing of back and middle office functions for their clients."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <Network className="text-[#4A8C7A] mb-6" size={40} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Structuration", "Structuring")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Mise en place d'un pôle patrimonial ou opérationnel au sein de votre cabinet.", "Implementation of a wealth or operational division within your firm.")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <HeartHandshake className="text-[#4A8C7A] mb-6" size={40} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Accompagnement", "Support")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Prise en charge de l'exécution opérationnelle pour vos clients.", "Taking charge of operational execution for your clients.")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <BookOpen className="text-[#4A8C7A] mb-6" size={40} />
              <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Formation", "Training")}</h3>
              <p className="text-[#3D4F64] text-sm leading-relaxed">{t("Renforcement des compétences de vos équipes sur les enjeux back & middle office.", "Strengthening your teams' skills on back & middle office issues.")}</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/nous-contacter"
              className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-lg"
            >
              {t("Plus d'informations", "More information")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
