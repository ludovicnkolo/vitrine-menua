"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Globe, MapPin, Mail, Phone, CheckCircle2, Building2, User } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousContacter() {
  const { t } = useLanguage();
  const [profileType, setProfileType] = useState<"entreprise" | "individuel">("entreprise");
  const [entrepriseType, setEntrepriseType] = useState<string>("");

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src="/nous-contacter-hero.jpg" alt="Nous Contacter" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("Contact", "Contact")}</span>
                <span className="block mt-2">{t("Nous contacter", "Contact Us")}</span>
              </h1>
              <div className="mb-8 max-w-2xl">
                <p className="p-1">{t("Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.", "Present your operational need, we will respond with an initial analysis and a tailored proposal.")}</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="mt-12 bg-white w-full px-8 py-16 lg:py-24" id="contact-form">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">

          {/* Left Column (Coordonnées & Raisons) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-[#8e8478] p-8 md:p-10 border border-white/20 rounded-2xl shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-black mb-4">{t("Coordonnées", "Contact Details")}</h2>
              <div className="w-10 h-[1.5px] bg-[#d5a864] mb-8" />
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-white/10 text-black flex items-center justify-center shrink-0 mt-1"><Building2 size={18} /></div>
                <div>
                  <p className="text-black text-[0.85rem] font-bold tracking-[0.1em] uppercase mb-1">Menua Consulting</p>
                  <p className="text-black text-sm">92 rue des Pyrénées</p>
                  <p className="text-black text-sm">75020 Paris</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-black flex items-center justify-center shrink-0"><Mail size={18} /></div>
                  <a href="mailto:contact@menuaconsulting.com" className="text-black text-sm font-medium hover:text-[#d5a864] transition-colors">contact@menuaconsulting.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-black flex items-center justify-center shrink-0"><Phone size={18} /></div>
                  <a href="tel:+33686877914" className="text-black text-sm font-medium hover:text-[#d5a864] transition-colors">06 86 87 79 14</a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-black flex items-center justify-center shrink-0"><MapPin size={18} /></div>
                  <p className="text-black text-sm font-medium">Interventions partout en France.<br/>Français / Anglais</p>
                </div>
              </div>
            </div>

            <div className="bg-[#8e8478] p-8 md:p-10 border border-white/20 rounded-2xl">
              <h2 className="font-serif text-2xl font-bold text-black mb-4">{t("Pourquoi nous contacter ?", "Why contact us?")}</h2>
              <div className="w-10 h-[1.5px] bg-[#d5a864] mb-8" />
              <ul className="space-y-4">
                {[t("Renfort opérationnel","Operational reinforcement"),t("Externalisation back office","Back office outsourcing"),t("Externalisation middle office","Middle office outsourcing"),t("Finance et reporting","Finance and reporting"),t("Contrôle de gestion","Management control"),t("Risques et conformité","Risk and compliance"),t("Support comptable et data","Accounting and data support"),t("Gestion de patrimoine","Wealth management")].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-black text-[0.85rem] font-medium"><CheckCircle2 size={16} className="text-[#d5a864] shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#8e8478] p-8 md:p-10 border border-white/20 flex flex-col items-center text-center rounded-2xl">
              <div className="flex items-center gap-4 mb-6 w-full">
                <div className="w-12 h-12 rounded-full bg-white/10 text-black flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                <p className="text-black text-[0.85rem] font-medium text-left leading-snug">{t("Retrouvez nos analyses\net publications.", "Find our analyses\nand publications.")}</p>
              </div>
              <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between border border-[#d5a864] text-black bg-transparent hover:bg-[#d5a864] hover:text-[#122017] px-4 py-3 text-[0.65rem] font-bold tracking-[0.1em] uppercase transition-colors">
                {t("Suivre Menua Consulting", "Follow Menua Consulting")} <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-2/3 bg-[#8e8478] border border-white/20 p-8 md:p-12 rounded-2xl">
            <h2 className="font-serif text-2xl font-bold text-center text-black mb-4">{t("Formulaire de contact", "Contact Form")}</h2>
            <div className="w-10 h-[2px] bg-[#d5a864] mx-auto mb-10" />

            {/* ── Type de profil ── */}
            <div className="mb-8">
              <p className="text-xs font-bold text-black mb-4 uppercase tracking-wider">{t("Vous êtes *", "You are *")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setProfileType("entreprise")} className={`flex items-center gap-4 border-2 px-5 py-4 text-left transition-all rounded-sm ${profileType === "entreprise" ? "border-[#d5a864] bg-[#d5a864]/10" : "border-white/30 hover:border-white/60 bg-white/5"}`}>
                  <Building2 size={22} className={profileType === "entreprise" ? "text-[#d5a864]" : "text-white/50"} strokeWidth={1.5} />
                  <div>
                    <p className="text-[0.8rem] font-bold text-black">{t("Une entreprise", "A company")}</p>
                    <p className="text-[0.7rem] text-black/60">{t("Client, partenaire ou prestataire", "Client, partner or service provider")}</p>
                  </div>
                </button>
                <button type="button" onClick={() => setProfileType("individuel")} className={`flex items-center gap-4 border-2 px-5 py-4 text-left transition-all rounded-sm ${profileType === "individuel" ? "border-[#d5a864] bg-[#d5a864]/10" : "border-white/30 hover:border-white/60 bg-white/5"}`}>
                  <User size={22} className={profileType === "individuel" ? "text-[#d5a864]" : "text-white/50"} strokeWidth={1.5} />
                  <div>
                    <p className="text-[0.8rem] font-bold text-black">{t("Une personne physique", "An individual")}</p>
                    <p className="text-[0.7rem] text-black/60">{t("Candidat ou contact individuel", "Candidate or individual contact")}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* ── Sous-type entreprise ── */}
            {profileType === "entreprise" && (
              <div className="mb-8">
                <p className="text-xs font-bold text-white mb-3 uppercase tracking-wider">{t("Nature de la relation *", "Nature of the relationship *")}</p>
                <div className="flex flex-wrap gap-3">
                  {[{val:"client",label:t("Entreprise cliente","Client company")},{val:"partenaire",label:t("Partenaire","Partner")},{val:"prestataire",label:t("Prestataire / Sous-traitant","Service provider / Subcontractor")}].map(({ val, label }) => (
                    <button key={val} type="button" onClick={() => setEntrepriseType(val)} className={`px-4 py-2 text-[0.75rem] font-bold tracking-wider uppercase border transition-all rounded-sm ${entrepriseType === val ? "bg-[#d5a864] text-[#122017] border-[#d5a864]" : "bg-white/5 text-white/80 border-white/30 hover:border-white/60"}`}>{label}</button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-black mb-2 block">{t("Nom", "Last Name")} <span className="text-[#d5a864]">*</span></label>
                  <input type="text" placeholder={t("Votre nom", "Your last name")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-black mb-2 block">{t("Prénom", "First Name")}</label>
                  <input type="text" placeholder={t("Votre prénom", "Your first name")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-black mb-2 block">Email <span className="text-[#d5a864]">*</span></label>
                  <input type="email" placeholder="votre.email@exemple.com" className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-black mb-2 block">{t("Téléphone", "Phone")}</label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                </div>
              </div>

              {/* Champs entreprise conditionnels */}
              {profileType === "entreprise" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-black mb-2 block">{t("Société", "Company")} <span className="text-[#d5a864]">*</span></label>
                      <input type="text" placeholder={t("Nom de votre société", "Your company name")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-black mb-2 block">{t("Fonction", "Position")}</label>
                      <input type="text" placeholder={t("Votre fonction", "Your position")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black mb-2 block">
                      {t("SIRET / Numéro d'identification de l'entreprise", "SIRET / Company registration number")}
                      <span className="ml-2 font-normal italic text-white/50 text-[0.7rem]">({t("optionnel", "optional")})</span>
                    </label>
                    <input type="text" placeholder={t("Ex : 123 456 789 00012", "Ex: 123 456 789 00012")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm" />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-black mb-2 block">{t("Niveau d'urgence", "Urgency level")} <span className="text-[#d5a864]">*</span></label>
                <select className="w-full border border-white/30 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-white rounded-sm">
                  <option value="" className="text-black">{t("Sélectionnez un niveau", "Select a level")}</option>
                  <option value="Immédiat (sous 48h)" className="text-black">{t("Immédiat (sous 48h)", "Immediate (within 48h)")}</option>
                  <option value="Moyen (sous 1 mois)" className="text-black">{t("Moyen (sous 1 mois)", "Medium (within 1 month)")}</option>
                  <option value="Faible (projet à plus d'un mois)" className="text-black">{t("Faible (projet à plus d'un mois)", "Low (project in more than 1 month)")}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-black mb-3 block">
                  {t("Type de besoin", "Type of need")} <span className="text-[#d5a864]">*</span> <span className="font-normal italic text-white/50">({t("plusieurs choix possibles", "multiple choices possible")})</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[t("Renfort opérationnel","Operational reinforcement"),t("Risques & conformité","Risk & compliance"),t("Externalisation back office","Back office outsourcing"),t("Support comptable & data","Accounting & data support"),t("Externalisation middle office","Middle office outsourcing"),t("Support opérationnel CGP / gestion de patrimoine","Operational support CGP / wealth management"),t("Finance & reporting","Finance & reporting"),t("Autre besoin opérationnel","Other operational need"),t("Contrôle de gestion","Management control")].map((opt, i) => (
                    <label key={i} className="flex items-start gap-2 text-[0.8rem] text-black cursor-pointer font-medium">
                      <input type="checkbox" className="accent-[#d5a864] mt-1 shrink-0" /> {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black mb-2 block">{t("Message", "Message")} <span className="text-[#d5a864]">*</span></label>
                <textarea rows={5} placeholder={t("Décrivez votre besoin en quelques lignes...", "Describe your need in a few lines...")} className="w-full border border-white/30 bg-white/5 placeholder:text-white/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white resize-none rounded-sm"></textarea>
              </div>

              <label className="flex items-start gap-3 text-[0.8rem] text-black cursor-pointer font-medium pt-2">
                <input type="checkbox" className="accent-[#d5a864] mt-0.5 shrink-0" />
                <span>
                  {t("J'accepte la", "I accept the")} <Link href="/politique-de-confidentialite" className="text-[#d5a864] hover:underline">{t("politique de confidentialité", "privacy policy")}</Link> {t("et le traitement de mes données conformément au RGPD.", "and the processing of my data according to GDPR.")} <span className="text-[#d5a864]">*</span>
                </span>
              </label>

              <div className="flex justify-end">
                <button type="submit" className="inline-flex items-center gap-3 bg-[#1A0E08] text-white border border-[#1A0E08] px-8 py-3.5 text-xs font-bold tracking-[0.1em] uppercase hover:bg-transparent hover:text-[#1A0E08] transition-colors rounded-sm shadow-md w-fit">
                  {t("Envoyer ma demande", "Send my request")} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
