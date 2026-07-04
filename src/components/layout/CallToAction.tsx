"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative px-8 py-5 overflow-hidden bg-[#223930]">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: text */}
        <div className="flex flex-col text-left">
          <h2 className="text-white text-xl lg:text-[1.3rem] font-bold uppercase mb-1 tracking-wide">
            {t("L'expertise au service de votre performance.", "Expertise at the service of your performance.")}
          </h2>
          <p className="text-white/70 text-[0.85rem] leading-relaxed font-normal">
            {t(
              "Des solutions d'externalisation sur-mesure, réactives et efficaces.",
              "Tailor-made, reactive and efficient outsourcing solutions."
            )}
          </p>
        </div>
        {/* Right: buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link
            href="/nous-contacter"
            className="flex items-center justify-center gap-3 bg-[#D9B151] text-[#122017] border border-[#D9B151] px-6 py-3 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-transparent hover:text-[#D9B151] whitespace-nowrap"
          >
            {t("PRÉSENTER UN BESOIN", "PRESENT A NEED")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/nous-rejoindre"
            className="flex items-center justify-center gap-3 bg-transparent text-white border border-white px-6 py-3 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-white hover:text-[#223930] whitespace-nowrap"
          >
            {t("NOUS REJOINDRE", "JOIN US")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
