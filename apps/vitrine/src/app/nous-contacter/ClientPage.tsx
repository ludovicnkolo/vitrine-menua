"use client";
import React, { useState, useEffect } from "react";
import Link from "@/components/Link";
import { ArrowRight, MapPin, Mail, Phone, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import SubmitStatusModal from "@/components/SubmitStatusModal";
import ContactInfoFields from "@/components/ContactInfoFields";
import FormPrivacyAndSubmit from "@/components/FormPrivacyAndSubmit";
import { handleFormSubmit } from "@/utils/formSubmitHandler";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function NousContacter() {
  const { t, lang } = useLanguage();
  const [clientType, setClientType] = useState<"company" | "individual">("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formEnabled, setFormEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/forms/status`)
      .then(r => r.json())
      .then(data => setFormEnabled(data?.data?.contactFormEnabled !== false))
      .catch(() => setFormEnabled(true)); // En cas d'erreur, ne pas bloquer
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await handleFormSubmit({
        e,
        endpoint: "/api/forms/contact",
        lang,
        setSubmitStatus,
        setIsSubmitting,
        setEmailError,
        onSuccess: () => {
        },
        successMessage: "Votre demande a été envoyée avec succès.",
        errorMessage: "Impossible d'envoyer le formulaire."
      });
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Impossible d'envoyer le formulaire." });
      setIsSubmitting(false);
    }
  };


  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 6.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/nous-contacter-hero-new.webp" 
            alt="Nous contacter" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 landscape:lg:pt-72 pb-20 portrait:sm:pb-16 landscape:pb-10 landscape:lg:pb-44 xl:pb-20 mt-16 landscape:mt-0 landscape:lg:mt-16">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-12 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Nous contacter", "Contact us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Présentez-nous votre besoin opérationnel. Nous reviendrons vers vous afin de préciser le périmètre, les priorités et le dispositif envisageable.",
                "Present us with your operational need. We will get back to you to specify the scope, priorities and possible setup."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-white pt-8 md:pt-[4.75rem] pb-16 md:pb-24 landscape:pb-8 landscape:lg:pb-48">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12">
          {/* BREADCRUMB */}
          <div className="w-full mb-8 md:mb-4">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Nous contacter", "Contact us")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column (Coordonnées) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 shadow-xl">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#141824] mb-6 uppercase tracking-wider">{t("Coordonnées", "Contact details")}</h2>
              
              <div className="flex items-start gap-5 mb-10 pb-10 border-b border-[#e8e1d7]">
                <div className="w-14 shrink-0"></div>
                <div className="pt-1">
                  <p className="text-[#141824] text-[1rem] font-bold tracking-widest uppercase mb-2">{t("Menua Consulting", "Menua Consulting")}</p>
                  <p className="text-[#6e7891] text-[1.05rem] font-light">{t("92 rue des Pyrénées", "92 rue des Pyrénées")}</p>
                  <p className="text-[#6e7891] text-[1.05rem] font-light">{t("75020 Paris", "75020 Paris")}</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <a href="tel:+33686877914" className="text-[#141824] text-[1.05rem] font-bold hover:text-[#a0aabf] transition-colors">+33 6 86 87 79 14</a>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e1d7]/30 text-[#141824] flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] text-[1.05rem] font-bold hover:text-[#a0aabf] transition-colors break-all">contact@menuaconsulting.com</a>
                </div>
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 portrait:max-sm:px-6 portrait:max-sm:py-4 landscape:px-6 landscape:py-2 shadow-xl border-t-4 border-t-[#e8e1d7] text-center">
              <h3 className="text-[1.4rem] font-semibold mb-6 portrait:max-sm:mb-2 landscape:mb-2 leading-snug">{t("Retrouvez nos analyses et publications.", "Find our analyses and publications.")}</h3>
              <p className="text-[#e5e9f0] mb-8 portrait:max-sm:mb-3 landscape:mb-4 font-light text-[1.05rem]">
                {t("Suivez notre actualité professionnelle sur LinkedIn.", "Follow our professional news on LinkedIn.")}
              </p>
              <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#e8e1d7] text-[#141824] px-8 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-white transition-colors duration-300">
                {t("Suivre Menua Consulting", "Follow Menua Consulting")}
              </a>
            </div>
          </div>

          {/* Right Column (Formulaire) */}
          <div className="w-full lg:w-[60%] bg-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#141824] mb-10 text-center uppercase tracking-wider">{t("Formulaire de contact", "Contact Form")}</h2>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vous êtes", "You are")}</p>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-24">
                  <label htmlFor="clientTypeCompany" className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      id="clientTypeCompany"
                      name="clientType" 
                      value="company" 
                      checked={clientType === "company"} 
                      onChange={() => setClientType("company")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Société", "Company")}</span>
                  </label>
                  <label htmlFor="clientTypeIndividual" className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      id="clientTypeIndividual"
                      name="clientType" 
                      value="individual" 
                      checked={clientType === "individual"} 
                      onChange={() => setClientType("individual")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Particulier", "Individual")}</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vos coordonnées", "Your contact details")}</p>
                <ContactInfoFields emailError={emailError} />

                {clientType === "company" && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div>
                      <label htmlFor="company" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Raison sociale", "Company")} <span className="text-red-500">*</span></label>
                      <input id="company" type="text" name="company" placeholder={t("Nom de votre société", "Your company name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-4 block">{t("Type de besoin", "Type of need")}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    t("Renfort opérationnel", "Operational reinforcement"),
                    t("Externalisation back office", "Back office outsourcing"),
                    t("Externalisation middle office", "Middle office outsourcing"),
                    t("Finance et reporting", "Finance and reporting"),
                    t("Contrôle de gestion", "Management control"),
                    t("Risques et conformité", "Risk and compliance"),
                    t("Support comptable et data", "Accounting and data support"),
                    t("Support opérationnel CGP / gestion de patrimoine", "Wealth Management Support"),
                    t("Autre besoin opérationnel", "Other operational need"),
                  ].map((opt) => (
                    <label key={opt} htmlFor={`need_${opt.replace(/\s+/g, '_')}`} className="flex items-start gap-3 text-[1.05rem] text-[#141824] font-light cursor-pointer group">
                      <input type="checkbox" id={`need_${opt.replace(/\s+/g, '_')}`} name="needs" value={opt} className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]" /> 
                      <span className="group-hover:text-[#6e7891] transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
                  {t("Décrivez votre besoin", "Describe your need")} <span className="text-red-500">*</span>
                </label>

                <textarea name="description" rows={5} required placeholder={t("Saisissez ou collez votre descriptif ici...", "Type or paste your description here...")} className="w-full border border-[#141824]/30 bg-white/40 p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors placeholder:text-[#a0aabf]"></textarea>
              </div>

              {formEnabled === false ? (
                <div className="text-center py-6 px-4 bg-[#141824]/5 border border-[#141824]/20 rounded">
                  <p className="text-[#141824] font-semibold text-[1.05rem] mb-1">
                    {t("Formulaire temporairement indisponible", "Form temporarily unavailable")}
                  </p>
                  <p className="text-[#6e7891] text-[0.9rem]">
                    {t("Ce formulaire est actuellement fermé. Veuillez nous contacter directement par téléphone ou email.", "This form is currently closed. Please contact us directly by phone or email.")}
                  </p>
                </div>
              ) : (
                <FormPrivacyAndSubmit 
                  id="privacyPolicyContact"
                  isSubmitting={isSubmitting}
                  submitText={t("Envoyer", "Send")}
                  submittingText={t("Envoi en cours...", "Sending...")}
                  type="contact"
                />
              )}
            </form>
          </div>

          </div>
        </div>
      </section>


      <SubmitStatusModal status={submitStatus} onClose={() => setSubmitStatus(null)} />
    </main>
  );
}
