"use client";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative px-8 py-6 lg:py-8 overflow-hidden bg-[#223930]">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-white text-[1.5rem] md:text-[2rem] font-bold uppercase mb-2 tracking-wide">
          {t("L’expertise au service de votre performance.", "Expertise at the service of your performance.")}
        </h2>
        <p className="text-white text-[1rem] max-w-3xl leading-relaxed mb-6 font-medium">
          {t(
            "Des solutions d’externalisation sur mesure, rapides et efficaces.",
            "Tailor-made outsourcing solutions, fast and efficient."
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/nous-contacter"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black border border-white px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-black hover:text-white hover:border-black"
          >
            {t("Décrire votre projet", "Describe your project")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/nous-rejoindre"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent text-white border border-white px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-white hover:text-black"
          >
            {t("Nous rejoindre", "Join us")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
