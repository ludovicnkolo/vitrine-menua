"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, BarChart2, Shield, User, Globe, Users, Upload } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousRejoindre() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-transparent">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous-rejoindre-hero.jpg"
            alt="Nous Rejoindre"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#436850] from-20% via-[#436850]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Carrières", "Careers")}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.5rem] font-bold leading-[1.1] text-white mb-8">
                {t("Nous rejoindre", "Join Us")}
              </h1>
              <div className="text-white text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4 mb-8" style={{ color: 'white' }}>
                <p>
                  {t(
                    "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés.",
                    "MENUA CONSULTING recruits autonomous, rigorous, reliable, and organized operational profiles."
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  document.getElementById('candidature-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 bg-[#E0D6C8] text-[#223930] px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-transparent hover:text-[#E0D6C8] border border-[#E0D6C8] w-fit"
              >
                {t("Déposer ma candidature", "Submit my application")} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="bg-[#E3C29E] w-full px-8 py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Profiles) */}
          <div className="w-full lg:w-1/3 bg-[#F5F2EB] p-8 md:p-12">
            <h2 className="text-[#223930] text-[1.1rem] font-bold uppercase mb-8 text-center tracking-wider">
              {t("Profils recherchés", "Profiles Sought")}
            </h2>
            <div className="w-10 h-[1.5px] bg-[#d5a864] mx-auto mb-10" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 mb-16">
              {[
                { icon: Briefcase, title: t("Back &\nmiddle office", "Back &\nmiddle office") },
                { icon: FileText, title: t("Comptabilité &\nsupport administratif", "Accounting &\nadmin support") },
                { icon: BarChart2, title: t("Reporting &\ndata", "Reporting &\ndata") },
                { icon: Shield, title: t("Risques &\nconformité (KYC / AML)", "Risk &\ncompliance (KYC / AML)") },
                { icon: User, title: t("Support opérationnel CGP /\ngestion de patrimoine", "Operational support CGP /\nwealth management") },
                { icon: Globe, title: t("Profils bilingues\nfrançais / anglais", "Bilingual profiles\nFrench / English") },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#223930] bg-[#223930] text-[#E0D6C8] flex items-center justify-center shrink-0">
                    <p.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-[#223930] text-[0.8rem] leading-snug whitespace-pre-line">
                    {p.title}
                  </h3>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#E0D6C8]/40 mb-10" />

            <div className="flex items-center gap-4 mb-6">
              <Users size={32} className="text-[#223930] font-light" strokeWidth={1} />
              <h2 className="font-serif text-2xl font-bold text-[#223930]">
                {t("Notre engagement", "Our commitment")}
              </h2>
            </div>
            <div className="w-10 h-[1.5px] bg-[#d5a864] mb-6" />
            <p className="text-[#223930] text-sm leading-relaxed font-medium">
              {t(
                "Nous valorisons la rigueur, l'esprit d'équipe, la discrétion et la volonté de s'inscrire dans la durée aux côtés de nos clients.",
                "We value rigor, team spirit, discretion and the desire to build long-term relationships with our clients."
              )}
            </p>
          </div>

          {/* Right Column (Form) */}
          <div id="candidature-form" className="w-full lg:w-2/3 border border-[#E0D6C8]/30 p-8 md:p-12">
            <h2 className="font-serif text-2xl font-bold text-center text-[#223930] mb-4">
              {t("Formulaire de candidature", "Application Form")}
            </h2>
            <div className="w-10 h-[2px] bg-[#d5a864] mx-auto mb-12" />

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Nom", "Last Name")} <span className="text-[#d5a864]">*</span></label>
                  <input type="text" placeholder={t("Votre nom", "Your last name")} className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Prénom", "First Name")} <span className="text-[#d5a864]">*</span></label>
                  <input type="text" placeholder={t("Votre prénom", "Your first name")} className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">Email <span className="text-[#d5a864]">*</span></label>
                  <input type="email" placeholder="votre.email@exemple.com" className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Téléphone", "Phone")} <span className="text-[#d5a864]">*</span></label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Pays", "Country")} <span className="text-[#d5a864]">*</span></label>
                  <select className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930]">
                    <option value="">{t("Sélectionnez votre pays", "Select your country")}</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Canada">Canada</option>
                    <option value="Maroc">Maroc</option>
                    <option value="Tunisie">Tunisie</option>
                    <option value="Algérie">Algérie</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Royaume-Uni">Royaume-Uni</option>
                    <option value="Allemagne">Allemagne</option>
                    <option value="Espagne">Espagne</option>
                    <option value="Italie">Italie</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Type de contrat", "Contract type")} <span className="text-[#d5a864]">*</span></label>
                  <select className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#223930]">
                    <option value="">{t("Sélectionnez un type", "Select a type")}</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance/Indépendant">Freelance/Indépendant</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#223930] mb-3 block">
                  {t("Domaines d'expertise", "Areas of expertise")} <span className="text-[#d5a864]">*</span> <span className="font-normal italic text-gray-500">({t("plusieurs choix possibles", "multiple choices possible")})</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    t("Back & middle office", "Back & middle office"),
                    t("Comptabilité & support administratif", "Accounting & admin support"),
                    t("Reporting & data", "Reporting & data"),
                    t("Contrôle de gestion", "Management control"),
                    t("Risques & conformité (KYC / AML)", "Risk & compliance (KYC / AML)"),
                    t("Support opérationnel CGP / gestion de patrimoine", "Operational support CGP / wealth management"),
                    t("Autre", "Other"),
                  ].map((opt, i) => (
                    <label key={i} className="flex items-start gap-2 text-[0.8rem] text-[#223930] cursor-pointer font-medium">
                      <input type="checkbox" className="accent-[#223930] mt-1 shrink-0" /> {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#223930] mb-3 block">
                  {t("Langues", "Languages")} <span className="text-[#d5a864]">*</span> <span className="font-normal italic text-gray-500">({t("plusieurs choix possibles", "multiple choices possible")})</span>
                </label>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  <label className="flex items-center gap-2 text-[0.8rem] text-[#223930] cursor-pointer font-medium">
                    <input type="checkbox" className="accent-[#223930]" /> Français
                  </label>
                  <label className="flex items-center gap-2 text-[0.8rem] text-[#223930] cursor-pointer font-medium">
                    <input type="checkbox" className="accent-[#223930]" /> Anglais
                  </label>
                  <label className="flex items-center gap-2 text-[0.8rem] text-[#223930] cursor-pointer font-medium col-span-2">
                    <input type="checkbox" className="accent-[#223930]" /> {t("Autre (préciser dans le message)", "Other (specify in message)")}
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#223930] mb-2 block">CV <span className="text-[#d5a864]">*</span></label>
                <div className="w-full border border-dashed border-[#223930]/40 bg-[#F5F2EB]/50 rounded hover:bg-[#F5F2EB] transition-colors py-8 flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={24} className="text-[#223930] mb-2" strokeWidth={1.5} />
                  <p className="text-[#223930] text-sm font-bold mb-1">{t("Cliquez pour ajouter votre CV", "Click to add your CV")}</p>
                  <p className="text-gray-500 text-xs">PDF, DOC ou DOCX - 5 Mo max</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#223930] mb-2 block">{t("Message", "Message")} <span className="font-normal italic text-gray-500">(optionnel)</span></label>
                <textarea rows={4} placeholder={t("Votre message", "Your message")} className="w-full border border-[#E0D6C8] bg-transparent px-4 py-3 text-sm text-[#223930] focus:outline-none focus:border-[#223930] resize-none"></textarea>
              </div>

              <label className="flex items-start gap-3 text-[0.8rem] text-[#223930] cursor-pointer font-medium pt-2">
                <input type="checkbox" className="accent-[#223930] mt-0.5 shrink-0" />
                <span>
                  {t("J'accepte la", "I accept the")} <Link href="/politique-de-confidentialite" className="text-[#d5a864] hover:underline">{t("politique de confidentialité", "privacy policy")}</Link> {t("et le traitement de mes données personnelles dans le cadre de ma candidature.", "and the processing of my personal data as part of my application.")} <span className="text-[#d5a864]">*</span>
                </span>
              </label>

              <button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#223930] text-white px-8 py-4 text-xs font-bold tracking-[0.1em] uppercase hover:bg-[#1a2c25] transition-colors">
                {t("Envoyer ma candidature", "Send my application")} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
