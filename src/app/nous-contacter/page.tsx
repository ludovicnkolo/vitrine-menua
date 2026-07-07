"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, Building2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousContacter() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 6.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/meeting.jpg" 
            alt="Contact" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous contacter", "Contact us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Une réponse experte et sur mesure à vos besoins d'externalisation.",
                "An expert and tailor-made response to your outsourcing needs."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-[#f5f7fa] section-padding">
        <div className="laplace-container flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left Column (Coordonnées) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 shadow-xl">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.8rem] font-bold text-[#141824] mb-6 uppercase tracking-wider">{t("Contact Rapide", "Quick Contact")}</h2>
              
              <div className="flex items-start gap-5 mb-10">
                <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div className="pt-1">
                  <p className="text-[#141824] text-[1rem] font-bold tracking-widest uppercase mb-2">Menua Consulting</p>
                  <p className="text-[#6e7891] text-[1.05rem] font-light">112 Avenue de Paris</p>
                  <p className="text-[#6e7891] text-[1.05rem] font-light">94300 Vincennes, France</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <a href="tel:+33123456789" className="text-[#141824] text-[1.05rem] font-bold hover:text-[#a0aabf] transition-colors">+33 1 23 45 67 89</a>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <a href="mailto:contact@menua-consulting.com" className="text-[#141824] text-[1.05rem] font-bold hover:text-[#a0aabf] transition-colors">contact@menua-consulting.com</a>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <p className="text-[#6e7891] text-[1.05rem] font-medium">
                    {t("Lundi au Vendredi, 9h00 – 18h00", "Monday to Friday, 9:00 AM – 6:00 PM")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 shadow-xl border-t-4 border-t-[#e8e1d7] text-center">
              <h3 className="text-[1.4rem] font-bold mb-6 leading-snug">{t("Retrouvez nos analyses et publications.", "Find our analyses and publications.")}</h3>
              <p className="text-[#e5e9f0] mb-8 font-light text-[1.05rem]">
                {t("Suivez notre actualité professionnelle sur LinkedIn.", "Follow our professional news on LinkedIn.")}
              </p>
              <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#e8e1d7] text-[#141824] px-8 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-white transition-colors duration-300">
                {t("Suivre Menua Consulting", "Follow Menua Consulting")}
              </a>
            </div>
          </div>

          {/* Right Column (Formulaire) */}
          <div className="w-full lg:w-[60%] bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h2 className="text-[1.8rem] font-bold text-[#141824] mb-10 text-center uppercase tracking-wider">{t("Formulaire de contact", "Contact Form")}</h2>
            
            <form className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Nom et Prénom", "Full Name")} <span className="text-red-500">*</span></label>
                  <input type="text" placeholder={t("Votre nom et prénom", "Your full name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                </div>
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Société", "Company")} <span className="text-red-500">*</span></label>
                  <input type="text" placeholder={t("Nom de votre société", "Your company name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Fonction", "Position")} <span className="text-red-500">*</span></label>
                  <input type="text" placeholder={t("Votre fonction", "Your position")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                </div>
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Adresse email professionnelle", "Professional email address")} <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="votre.email@exemple.com" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Téléphone", "Phone")} <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                </div>
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Objet", "Subject")} <span className="text-red-500">*</span></label>
                  <select className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none">
                    <option value="">{t("Sélectionnez l'objet", "Select the subject")}</option>
                    <option value="Demande de renfort">{t("Demande de renfort", "Request for reinforcement")}</option>
                    <option value="Externalisation BPO">{t("Externalisation BPO", "BPO Outsourcing")}</option>
                    <option value="Expertise">{t("Expertise", "Expertise")}</option>
                    <option value="Autre">{t("Autre", "Other")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Message", "Message")} <span className="text-red-500">*</span></label>
                <textarea rows={5} placeholder={t("Texte libre", "Free text")} className="w-full border border-[#d1d5db] bg-transparent p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors placeholder:text-[#a0aabf]"></textarea>
              </div>

              <label className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
                <input type="checkbox" className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
                <span>
                  {t("J'accepte la", "I accept the")} <Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "privacy policy")}</Link> {t("et le traitement de mes données.", "and the processing of my data.")} <span className="text-red-500">*</span>
                </span>
              </label>

              <div className="flex justify-end pt-6">
                <button type="submit" className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto">
                  {t("Envoyer ma demande", "Send my request")} <ArrowRight size={20} className="ml-3" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
