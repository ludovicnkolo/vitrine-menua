"use client";
import Link from "next/link";
import { ChevronDown, Zap, Calendar, BarChart3, Network } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nos_solutions_hero.png"
            alt="Nos Solutions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#223930] from-20% via-[#223930]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Dispositifs", "Solutions")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Nos solutions", "Our solutions")}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  {t(
                    "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles.",
                    "We design tailor-made outsourcing solutions, adapted to your operational constraints."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID CONTENT ── */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-20 bg-[#FDFDFD]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* URGENCY */}
          <div id="urgence" className="bg-white border border-[#E0D6C8]/60 p-8 lg:p-10 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                <Zap className="text-white" size={26} strokeWidth={1.5} />
              </div>
              <h2 className="text-[#223930] text-[1.25rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Urgence", "Emergency")}
              </h2>
            </div>
            <p className="text-[#223930] text-[0.95rem] leading-[1.6] mb-8 font-medium">
              {t(
                "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.",
                "Rapid mobilization of operational resources to meet an immediate need, absorb an overload of activity and ensure the continuity of your service."
              )}
            </p>
            <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium mb-12 marker:text-[#223930]">
              <li>{t("Surcharge d'activité imprévue ou ponctuelle", "Unexpected or occasional activity overload")}</li>
              <li>{t("Remplacement temporaire d'un collaborateur clé", "Temporary replacement of a key collaborator")}</li>
              <li>{t("Renfort en période de clôture", "Reinforcement during closing period")}</li>
              <li>{t("Traitement accéléré de dossiers en retard", "Accelerated processing of overdue files")}</li>
              <li>{t("Absences, congés payés ou maladie", "Absences, paid leave or illness")}</li>
            </ul>
            <div className="mt-auto flex justify-end">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* DURATION */}
          <div id="duree" className="bg-white border border-[#E0D6C8]/60 p-8 lg:p-10 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                <Calendar className="text-white" size={26} strokeWidth={1.5} />
              </div>
              <h2 className="text-[#223930] text-[1.25rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Durée", "Duration")}
              </h2>
            </div>
            <p className="text-[#223930] text-[0.95rem] leading-[1.6] mb-8 font-medium">
              MENUA CONSULTING {t(
                "propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille.",
                "offers flexible outsourcing solutions, adapted to the processing of a defined number of files as well as the recurring management of a portfolio."
              )}
            </p>
            <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium mb-12 marker:text-[#223930]">
              <li>{t("Mission courte durée", "Short term mission")}</li>
              <li>{t("Mission longue durée", "Long term mission")}</li>
              <li>{t("Externalisation continue", "Continuous outsourcing")}</li>
              <li>{t("Intervention ponctuelle ou récurrente", "Occasional or recurring intervention")}</li>
              <li>{t("Accompagnement de projets de transition", "Support for transition projects")}</li>
              <li>{t("Remplacement pendant un congé maternité ou sabbatique", "Replacement during maternity or sabbatical leave")}</li>
            </ul>
            <div className="mt-auto flex justify-end">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* VOLUME */}
          <div id="volume" className="bg-white border border-[#E0D6C8]/60 p-8 lg:p-10 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                <BarChart3 className="text-white" size={26} strokeWidth={1.5} />
              </div>
              <h2 className="text-[#223930] text-[1.25rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Volume", "Volume")}
              </h2>
            </div>
            <p className="text-[#223930] text-[0.95rem] leading-[1.6] mb-8 font-medium">
              MENUA CONSULTING {t(
                "adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter.",
                "adapts the sizing of its resources to the volume of files, flows or operations to be processed."
              )}
            </p>
            <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium mb-12 marker:text-[#223930]">
              <li>{t("Prise en charge d'un portefeuille défini", "Management of a defined portfolio")}</li>
              <li>{t("Gestion de flux de dossiers spécifiques", "Management of specific file flows")}</li>
              <li>{t("Traitement de volumes variables ou saisonniers", "Processing of variable or seasonal volumes")}</li>
              <li>{t("Dimensionnement des ressources selon l'activité", "Sizing of resources according to activity")}</li>
              <li>{t("Flexibilité pour absorber les pics de charge", "Flexibility to absorb peak loads")}</li>
            </ul>
            <div className="mt-auto flex justify-end">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ORGANISATION */}
          <div id="organisation" className="bg-white border border-[#E0D6C8]/60 p-8 lg:p-10 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                <Network className="text-white" size={26} strokeWidth={1.5} />
              </div>
              <h2 className="text-[#223930] text-[1.25rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Organisation", "Organization")}
              </h2>
            </div>
            <p className="text-[#223930] text-[0.95rem] leading-[1.6] mb-8 font-medium">
              MENUA CONSULTING {t(
                "structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux.",
                "structures its interventions according to the format most suited to your constraints: dedicated setup, mission-based operation or flow management."
              )}
            </p>
            <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium mb-12 marker:text-[#223930]">
              <li>{t("Dispositif dédié et exclusif", "Dedicated and exclusive setup")}</li>
              <li>{t("Intervention par mission ou projet", "Intervention by mission or project")}</li>
              <li>{t("Prise en charge de process récurrents", "Handling of recurring processes")}</li>
              <li>{t("Suivi structuré avec reporting d'avancement", "Structured follow-up with progress reporting")}</li>
              <li>{t("Intégration aux outils et systèmes du client", "Integration with client tools and systems")}</li>
            </ul>
            <div className="mt-auto flex justify-end">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── LANGUES BANNER ── */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="bg-[#F5F2EB] py-10 px-10 flex flex-col md:flex-row items-center gap-8 rounded-sm">
          <div className="flex gap-4 items-center shrink-0">
            {/* French Flag */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#223930]/10 flex shadow-sm">
              <div className="w-1/3 h-full bg-[#0055A4]" />
              <div className="w-1/3 h-full bg-white" />
              <div className="w-1/3 h-full bg-[#EF4135]" />
            </div>
            {/* UK Flag (Simplified representation) */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#223930]/10 bg-[#012169] relative shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-2 bg-white absolute rotate-45" />
                <div className="w-full h-2 bg-white absolute -rotate-45" />
                <div className="w-full h-1 bg-[#C8102E] absolute rotate-45" />
                <div className="w-full h-1 bg-[#C8102E] absolute -rotate-45" />
                <div className="w-full h-4 bg-white absolute" />
                <div className="h-full w-4 bg-white absolute" />
                <div className="w-full h-2 bg-[#C8102E] absolute" />
                <div className="h-full w-2 bg-[#C8102E] absolute" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[#223930] text-[1.15rem] font-bold mb-2">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="text-[#223930] text-[0.95rem] font-medium">
              {t("D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
