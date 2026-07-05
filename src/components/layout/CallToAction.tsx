"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="mt-12 w-full relative overflow-hidden bg-[#1A0E08] py-5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex flex-col text-center lg:text-left">
          <h2 className="text-white text-lg lg:text-[1.3rem] font-bold mb-2">
            {t("L'expertise au service de votre performance.", "Expertise serving your performance.")}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/nous-contacter"
            className="flex items-center gap-1 px-3 py-1 transition-all whitespace-nowrap text-[10px] font-bold tracking-wide uppercase text-[#E0D6C8] hover:text-white hover:bg-[#3E2510]/50 rounded-full"
            style={{ border: "1px solid #5A3A1E" }}
          >
            {t("PRÉSENTER UN BESOIN", "PRESENT A NEED")} <ArrowRight size={12} />
          </Link>
          <Link
            href="/nous-rejoindre"
            className="flex items-center gap-1 px-3 py-1 transition-all whitespace-nowrap text-[10px] font-bold tracking-wide uppercase text-[#C49A6C] hover:text-white hover:bg-[#8B6240]/40 rounded-full"
            style={{ border: "1px solid #8B6240" }}
          >
            {t("NOUS REJOINDRE", "JOIN US")} <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
