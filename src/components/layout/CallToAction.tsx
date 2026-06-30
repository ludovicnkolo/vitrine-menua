"use client";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#223930] px-8 py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d5a864] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-[#E0D6C8] text-[2rem] md:text-[2.5rem] font-bold uppercase mb-6 tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("Une expertise opérationnelle au service de vos performances.", "Operational expertise at the service of your performance.")}
        </h2>
        <p className="text-white/90 text-[1.1rem] max-w-3xl leading-relaxed mb-10 font-medium">
          {t(
            "Vous avez un besoin spécifique en matière d'externalisation de vos opérations ? Nos équipes sont à votre disposition pour étudier votre demande et vous proposer un dispositif d'accompagnement sur mesure.",
            "Do you have a specific need regarding the outsourcing of your operations? Our teams are at your disposal to study your request and offer you a tailor-made support setup."
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/nous-contacter"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#E0D6C8] text-[#223930] border border-[#E0D6C8] px-8 py-3.5 text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-transparent hover:text-[#E0D6C8]"
          >
            {t("Présenter un besoin", "Present a need")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/nous-rejoindre"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent text-[#E0D6C8] border border-[#E0D6C8] px-8 py-3.5 text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-[#E0D6C8] hover:text-[#223930]"
          >
            {t("Rejoindre l'équipe", "Join the team")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
