"use client";
import React, { useState } from "react";
import Link from "@/components/Link";
import { ArrowRight, MapPin, Mail, Phone, Building2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function NousContacter() {
  const { t, lang } = useLanguage();
  const [clientType, setClientType] = useState<"company" | "individual">("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
         setFileError("Seuls les fichiers au format PDF sont acceptés.");
         setSelectedFileName(null);
         e.target.value = "";
      } else if (file.size > 5 * 1024 * 1024) {
         setFileError("Le fichier PDF est trop volumineux (maximum 5 Mo).");
         setSelectedFileName(null);
         e.target.value = "";
      } else {
         setSelectedFileName(file.name);
         setFileError(null);
      }
    } else {
      setSelectedFileName(null);
      setFileError(null);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFileName(null);
    setFileError(null);
    const fileInput = document.querySelector('input[name="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Validation du fichier PDF s'il est fourni
      const fileField = formData.get("file") as File | null;
      if (fileField && fileField.size > 0) {
        if (fileField.type !== "application/pdf") {
          setFileError("Seuls les fichiers au format PDF sont acceptés.");
          setTimeout(() => setFileError(null), 3000);
          setIsSubmitting(false);
          return;
        }
        if (fileField.size > 5 * 1024 * 1024) { // Limite de 5 Mo
          setFileError("Le fichier PDF est trop volumineux (maximum 5 Mo).");
          setTimeout(() => setFileError(null), 3000);
          setIsSubmitting(false);
          return;
        }
      }

      const apiUrl = process.env.NODE_ENV === 'production' ? '' : process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/forms/contact?lang=${encodeURIComponent(lang.toLowerCase())}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus({ type: "success", message: data.message || "Votre demande a été envoyée avec succès." });
        (e.target as HTMLFormElement).reset();
        setSelectedFileName(null);
        setFileError(null);
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Impossible d'envoyer le formulaire." });
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 6.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/nous-contacter-hero-new.webp" 
            alt="Nous contacter" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous contacter", "Contact us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Présentez-nous votre besoin opérationnel. Nous reviendrons vers vous afin de préciser le périmètre, les priorités et le dispositif envisageable.",
                "Present us with your operational need. We will get back to you to specify the scope, priorities and possible setup."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.75rem] pb-16 md:pb-24">
        <div className="laplace-container">
          {/* BREADCRUMB */}
          <div className="absolute -top-8 md:-top-[4rem] left-6 md:left-12 lg:left-0 z-50">
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
                  <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] text-[1.05rem] font-bold hover:text-[#a0aabf] transition-colors">contact@menuaconsulting.com</a>
                </div>
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 shadow-xl border-t-4 border-t-[#e8e1d7] text-center">
              <h3 className="text-[1.4rem] font-semibold mb-6 leading-snug">{t("Retrouvez nos analyses et publications.", "Find our analyses and publications.")}</h3>
              <p className="text-[#e5e9f0] mb-8 font-light text-[1.05rem]">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label htmlFor="lastName" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Nom", "Last Name")} <span className="text-red-500">*</span></label>
                    <input id="lastName" type="text" name="lastName" placeholder={t("Votre nom", "Your last name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Prénom", "First Name")} <span className="text-red-500">*</span></label>
                    <input id="firstName" type="text" name="firstName" placeholder={t("Votre prénom", "Your first name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label htmlFor="email" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("E-mail", "Email")} <span className="text-red-500">*</span></label>
                    <input id="email" type="email" name="email" placeholder="votre.email@exemple.com" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Téléphone", "Phone")}</label>
                    <input id="phone" type="tel" name="phone" placeholder="+33 6 12 34 56 78" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                  </div>
                </div>

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
                  ].map((opt, i) => (
                    <label key={i} htmlFor={`need_${i}`} className="flex items-start gap-3 text-[1.05rem] text-[#141824] font-light cursor-pointer group">
                      <input type="checkbox" id={`need_${i}`} name="needs" value={opt} className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]" /> 
                      <span className="group-hover:text-[#6e7891] transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
                  {t("Décrivez votre besoin", "Describe your need")} <span className="text-red-500">*</span>
                </label>
                <p className="text-[0.95rem] text-[#6e7891] font-light mb-4 leading-relaxed">
                  {t(
                    "Décrivez votre besoin en détail.",
                    "Describe your need in detail."
                  )}
                </p>
                <textarea name="description" rows={5} placeholder={t("Saisissez ou collez votre descriptif ici...", "Type or paste your description here...")} className="w-full border border-[#141824]/30 bg-white/40 p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors placeholder:text-[#a0aabf] mb-4"></textarea>
                
                <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-2 block">
                  {t("Pièce jointe", "Attachment")}
                </label>
                <p className="text-[#141824] font-medium italic text-[0.85rem] mb-4">
                  {t("Si vous en disposez, vous pouvez joindre une fiche de mission, un cahier des charges ou un document décrivant votre besoin.", "If available, you can attach an assignment brief, specifications, or a document describing your needs.")}
                </p>

                <div className={`w-full border-2 border-dashed ${selectedFileName ? 'border-green-500 bg-green-50/30' : 'border-[#d1d5db] bg-[#f5f7fa]'} py-2 px-4 text-center hover:bg-[#e8e1d7]/30 transition-colors cursor-pointer rounded-sm`}>
                   <label htmlFor="fileUploadContact" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                     {selectedFileName ? (
                       <div className="flex flex-col items-center">
                         <span className="text-green-700 font-bold text-[1rem] mb-2">{selectedFileName}</span>
                         <span className="text-[#6e7891] text-[0.85rem]">{t("Cliquez ici pour remplacer le document", "Click here to replace the document")}</span>
                         <button type="button" 
                           onClick={handleRemoveFile}
                           className="mt-4 px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200"
                         >
                           {t("Supprimer ce document", "Remove this document")}
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center">
                         <UploadCloud className="w-6 h-6 text-[#6e7891] mb-1 opacity-80" />
                         <span className="text-[#6e7891] text-[0.85rem] text-center">
                           {t("Déposez votre document ici", "Drop your document here")}
                         </span>
                         {fileError && <span className="text-red-500 text-[0.7rem] font-bold mt-2">{fileError}</span>}
                       </div>
                     )}
                     <input type="file" id="fileUploadContact" name="file" className="hidden" accept=".pdf,application/pdf" onChange={handleFileChange} />
                   </label>
                </div>
              </div>

              <div>
                <label htmlFor="privacyPolicyContact" className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
                  <input type="checkbox" id="privacyPolicyContact" className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
                  <span>
                    {t("J’ai pris connaissance de la", "I have read the")} <Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "Privacy Policy")}</Link>. <span className="text-red-500">*</span>
                  </span>
                </label>
                <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
                  {formatBrand(t(
                    "Les informations recueillies sont traitées par MENUA CONSULTING afin de répondre à votre demande et d’en assurer le suivi. Les champs signalés par un astérisque sont obligatoires. Pour connaître les destinataires, les durées de conservation et exercer vos droits, consultez notre",
                    "The collected information is processed by MENUA CONSULTING in order to respond to your request and ensure its follow-up. Fields marked with an asterisk are mandatory. To know the recipients, the retention periods and to exercise your rights, consult our"
                  ))}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
                </p>
              </div>



              <div className="flex justify-center pt-6">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? t("Envoi en cours...", "Sending...") : t("Envoyer", "Send")}
                </button>
              </div>
            </form>
          </div>

          </div>
        </div>
      </section>


      {submitStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141824]/20 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-[#fcfbf9] px-4 py-6 flex flex-col items-center justify-center max-w-[200px] w-[85%] shadow-[0_5px_15px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
            
            {/* Corner Decorative Accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e8e1d7] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e8e1d7] opacity-50"></div>

            {submitStatus.type === "success" ? (
              <>
                <div className="relative w-14 h-14 flex items-center justify-center mb-3">
                  {/* Golden Circle Border */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#cda052] bg-white shadow-[0_0_10px_rgba(205,160,82,0.1)]"></div>
                  
                  {/* Thick Golden Checkmark */}
                  <svg className="w-6 h-6 z-10" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" />
                        <stop offset="50%" stopColor="#aa7c11" />
                        <stop offset="100%" stopColor="#8a610c" />
                      </linearGradient>
                    </defs>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  {/* Sparkles / Stars */}
                  <svg className="absolute -top-3 -left-2 w-3 h-3 text-[#d4af37] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <svg className="absolute top-1 -right-3 w-4 h-4 text-[#d4af37] animate-pulse delay-100" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <svg className="absolute bottom-1 -left-3 w-3 h-3 text-[#d4af37] animate-pulse delay-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  
                  {/* Little dots */}
                  <div className="absolute top-0 left-2 w-0.5 h-0.5 rounded-full bg-[#d4af37]"></div>
                  <div className="absolute bottom-2 -right-1 w-1 h-1 rounded-full bg-[#d4af37]"></div>
                </div>
                
                <p className="font-bold tracking-widest text-[0.65rem] text-[#141824] uppercase text-center leading-relaxed">Envoi réussi</p>
              </>
            ) : (
              <>
                <div className="relative w-14 h-14 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-2 border-red-400 bg-white shadow-[0_0_10px_rgba(248,113,113,0.15)]"></div>
                  <AlertCircle className="w-6 h-6 text-red-500 z-10 stroke-[2]" />
                </div>
                <h3 className="text-[#141824] text-[0.7rem] font-bold uppercase tracking-wider mb-1 text-center">Erreur</h3>
                <p className="font-bold tracking-widest text-[0.65rem] text-[#6e7891] uppercase text-center leading-relaxed">{submitStatus.message}</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
