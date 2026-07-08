"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="mt-12 w-full relative overflow-hidden bg-[#0D1B2A] py-5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex flex-col text-center lg:text-left">
          <h3 className="h3-section text-white mb-0">
            {t("L'expertise au service de votre performance.", "Expertise serving your performance.")}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link href="/nous-contacter" className="flex items-center gap-2 text-white font-bold text-[0.95rem] uppercase tracking-widest hover:text-[#e8e1d7] transition-colors">
            {t("PRÉSENTER UN BESOIN", "PRESENT A NEED")} <ArrowRight size={14} />
          </Link>
          <Link href="/nous-rejoindre" className="flex items-center gap-2 text-white font-bold text-[0.95rem] uppercase tracking-widest hover:text-[#e8e1d7] transition-colors">
            {t("NOUS REJOINDRE", "JOIN US")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
