"use client";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative px-8 py-20 lg:py-24 overflow-hidden bg-[#223930]">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-white text-[1.5rem] md:text-[2rem] font-bold uppercase mb-4 tracking-wide">
          {t("Une expertise opérationnelle au service de\nvos performances.", "Operational expertise at the service of\nyour performance.").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
        </h2>
        <p className="text-white text-[1rem] max-w-3xl leading-relaxed mb-10 font-medium">
          {t(
            "Vous avez un besoin spécifique en matière d'externalisation de vos opérations ? Nos équipes sont à votre disposition pour étudier votre demande et vous proposer un dispositif d'accompagnement sur mesure.",
            "Do you have a specific need regarding the outsourcing of your operations? Our teams are at your disposal to study your request and offer you a tailor-made support setup."
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/nous-contacter"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black border border-white px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-black hover:text-white hover:border-black"
          >
            {t("Présenter un besoin", "Present a need")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/nous-rejoindre"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent text-white border border-white px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-white hover:text-black"
          >
            {t("Rejoindre l'équipe", "Join the team")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
