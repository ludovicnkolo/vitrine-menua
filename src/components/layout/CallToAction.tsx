"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#122560] px-8 py-20 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#DAF0F7]/60 text-[0.65rem] font-bold tracking-widest uppercase mb-6">
          {t("Prenons contact", "Get in touch")}
        </p>
        <h2
          className="text-white mb-8"
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 600,
          }}
        >
          {t(
            "Un besoin opérationnel spécifique ?",
            "A specific operational need?"
          )}
        </h2>
        <p className="text-white/60 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          {t(
            "Contactez-nous dès maintenant pour échanger sur votre contexte. Nous vous proposerons une solution adaptée à votre volumétrie, vos contraintes et vos objectifs.",
            "Contact us now to discuss your context. We will offer a solution adapted to your volume, constraints and objectives."
          )}
        </p>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-3 bg-[#1C40C2] text-white hover:bg-[#142E9A] px-10 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200"
        >
          {t("Présenter un besoin", "Submit a request")} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
