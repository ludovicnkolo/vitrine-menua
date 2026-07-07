"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, BarChart2, Shield, User, Globe, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousRejoindre() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 7.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/office-lounge.jpg" 
            alt="Nous rejoindre" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="animate-fade-in-up stagger-1 text-[#e8e1d7] text-[0.9rem] font-bold tracking-widest uppercase mb-6">
              {t("Carrières & Prestataires", "Careers & Providers")}
            </p>
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Nous rejoindre", "Join Us")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés.",
                "MENUA CONSULTING recruits autonomous, rigorous, reliable and organized operational profiles."
              )}
              <br className="hidden lg:block" />
              {t(
                "Nous valorisons la rigueur, l'esprit d'équipe, la discrétion et la volonté de s'inscrire dans la durée aux côtés de nos clients.",
                "We value rigor, team spirit, discretion and the desire to build long-term relationships with our clients."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-24 pb-32">
        <div className="laplace-container flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left Column (Profiles) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 shadow-xl">
              <h2 className="text-[1.8rem] font-bold text-[#141824] mb-6">{t("Profils recherchés", "Profiles Sought")}</h2>
              <div className="w-16 h-1 bg-[#141824] mb-10" />

              <div className="flex flex-col gap-6 mb-8">
                {[
                  { icon: Briefcase, title: t("Back & middle office", "Back & middle office") },
                  { icon: BarChart2, title: t("Comptabilité & support administratif", "Accounting & admin support") },
                  { icon: Shield, title: t("Reporting & data", "Reporting & data") },
                  { icon: User, title: t("Risques & Conformité (KYC / AML)", "Risk & Compliance (KYC / AML)") },
                  { icon: Briefcase, title: t("Support opérationnel CGP", "Operational support CGP") },
                  { icon: Globe, title: t("Profils bilingues français / anglais", "Bilingual profiles French / English") },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                      <p.icon size={20} />
                    </div>
                    <h4 className="font-bold text-[#141824] text-[1.05rem] leading-snug">{p.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 shadow-xl border-t-4 border-t-[#e8e1d7]">
              <div className="flex items-center gap-4 mb-6">
                <Users size={32} className="text-[#e8e1d7]" />
                <h3 className="text-[1.4rem] font-bold">{t("Aucun CV requis", "No CV required")}</h3>
              </div>
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed">
                {t(
                  "Présentez-vous brièvement dans le formulaire. Si votre profil retient notre attention, nous vous contacterons par email pour demander des documents complémentaires.",
                  "Briefly introduce yourself in the form. If your profile catches our attention, we will contact you by email to request additional documents."
                )}
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-[60%] bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h3 className="text-[1.8rem] font-bold text-[#141824] mb-2">{t("Formulaire de candidature / prestataire", "Application / Provider Form")}</h3>
            <p className="text-[#6e7891] mb-10 text-[1.05rem]">{t("Candidat individuel ou structure prestataire", "Individual candidate or provider structure")}</p>
            
            <form className="space-y-10">

              {/* ── Identité ── */}
              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Identité", "Identity")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Nom", "Last Name")} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder={t("Votre nom", "Your last name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Prénom", "First Name")} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder={t("Votre prénom", "Your first name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="votre.email@exemple.com" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Téléphone", "Phone")} <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                </div>
              </div>

              {/* ── Localisation et Disponibilité ── */}
              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Localisation et Disponibilité", "Location and Availability")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Pays", "Country")} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder={t("Votre pays", "Your country")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Ville", "City")} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder={t("Votre ville", "Your city")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Disponibilité", "Availability")} <span className="text-red-500">*</span></label>
                  <select className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none">
                    <option value="">{t("Sélectionnez votre disponibilité", "Select your availability")}</option>
                    <option>{t("Immédiate", "Immediate")}</option>
                    <option>{t("Sous 15 jours", "Within 15 days")}</option>
                    <option>{t("Sous 1 mois", "Within 1 month")}</option>
                    <option>{t("À définir", "To be defined")}</option>
                  </select>
                </div>
              </div>

              {/* ── Profil et Compétences ── */}
              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Profil et Compétences", "Profile and Skills")}</p>
                <div className="mt-6">
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Type de contrat souhaité", "Desired contract type")} <span className="text-red-500">*</span></label>
                  <select className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none">
                    <option value="">{t("Sélectionnez un type", "Select a type")}</option>
                    <option>CDI</option><option>CDD</option><option>Freelance / Indépendant</option>
                    <option>Prestataire</option>
                  </select>
                </div>

                <div className="mt-8">
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-4 block">
                    {t("Compétences", "Skills")} <span className="text-red-500">*</span> <span className="font-light normal-case tracking-normal text-[#6e7891]">({t("plusieurs choix possibles", "multiple choices possible")})</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    {[
                      t("Back & middle office", "Back & middle office"),
                      t("Comptabilité", "Accounting"),
                      t("Data", "Data"),
                      t("Risques & Conformité", "Risk & Compliance"),
                      t("Support CGP", "Operational support CGP"),
                    ].map((opt, i) => (
                      <label key={i} className="flex items-start gap-3 text-[1.05rem] text-[#141824] font-light cursor-pointer group">
                        <input type="checkbox" className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]" /> 
                        <span className="group-hover:text-[#6e7891] transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Message ── */}
              <div>
                <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Message", "Message")} <span className="text-red-500">*</span></label>
                <textarea rows={5} placeholder={t("Présentez-vous brièvement. Aucun CV requis. Si votre profil retient notre attention, nous vous contacterons par email pour demander des documents complémentaires.", "Briefly introduce yourself. No CV required. If your profile catches our attention, we will contact you by email to request additional documents.")} className="w-full border border-[#d1d5db] bg-transparent p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors placeholder:text-[#a0aabf]"></textarea>
              </div>

              <div className="flex justify-end pt-6">
                <button type="submit" className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto">
                  {t("Envoyer ma candidature", "Send my application")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
