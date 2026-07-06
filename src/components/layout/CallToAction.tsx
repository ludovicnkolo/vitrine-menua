"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="mt-12 w-full relative overflow-hidden bg-[#304239] py-5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex flex-col text-center lg:text-left">
          <h3 className="h3-section mb-0">
            {t("L'expertise au service de votre performance.", "Expertise serving your performance.")}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link href="/nous-contacter" className="link-action">
            {t("PRÉSENTER UN BESOIN", "PRESENT A NEED")} <ArrowRight size={14} />
          </Link>
          <Link href="/nous-rejoindre" className="link-action">
            {t("NOUS REJOINDRE", "JOIN US")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
