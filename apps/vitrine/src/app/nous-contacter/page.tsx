"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, Building2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousContacter() {
  const { t } = useLanguage();
  const [clientType, setClientType] = useState<"company" | "individual">("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
         setSubmitStatus({ type: "error", message: "Seuls les fichiers au format PDF sont acceptés." });
         setSelectedFileName(null);
         e.target.value = "";
      } else if (file.size > 10 * 1024 * 1024) {
         setSubmitStatus({ type: "error", message: "Le fichier PDF est trop volumineux (maximum 10 Mo)." });
         setSelectedFileName(null);
         e.target.value = "";
      } else {
         setSelectedFileName(file.name);
         setSubmitStatus(null);
      }
    } else {
      setSelectedFileName(null);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFileName(null);
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
          setSubmitStatus({ type: "error", message: "Seuls les fichiers au format PDF sont acceptés." });
          setIsSubmitting(false);
          return;
        }
        if (fileField.size > 10 * 1024 * 1024) { // Limite de 10 Mo
          setSubmitStatus({ type: "error", message: "Le fichier PDF est trop volumineux (maximum 10 Mo)." });
          setIsSubmitting(false);
          return;
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/forms/contact`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus({ type: "success", message: data.message || "Votre demande a été envoyée avec succès." });
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Impossible d'envoyer le formulaire." });
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
            src="/img/contact-hero.jpg" 
            alt="Nous contacter" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous contacter", "Contact us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.",
                "Present your operational need, we will answer you with a first analysis and a suitable proposal."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-12 md:pt-[5.75rem] pb-16 md:pb-24">
        <div className="laplace-container flex flex-col lg:flex-row gap-12 lg:gap-16">

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
          <div className="w-full lg:w-[60%] bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#141824] mb-10 text-center uppercase tracking-wider">{t("Formulaire de contact", "Contact Form")}</h2>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vous êtes", "You are")}</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="clientType" 
                      value="company" 
                      checked={clientType === "company"} 
                      onChange={() => setClientType("company")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Une entreprise (cliente, partenaire ou prestataire)", "A company (client, partner or provider)")}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="clientType" 
                      value="individual" 
                      checked={clientType === "individual"} 
                      onChange={() => setClientType("individual")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Une personne physique / particulier", "An individual")}</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vos coordonnées", "Your contact details")}</p>
                
                {clientType === "company" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Société", "Company")} <span className="text-red-500">*</span></label>
                      <input type="text" name="company" placeholder={t("Nom de votre société", "Your company name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                    </div>
                    <div>
                      <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("SIRET / Numéro d'identification", "SIRET / ID Number")} <span className="text-red-500">*</span></label>
                      <input type="text" name="siret" placeholder={t("Ex: 123 456 789 00012", "E.g. 123 456 789 00012")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{clientType === "company" ? t("Nom du contact", "Contact Name") : t("Nom", "Name")} <span className="text-red-500">*</span></label>
                    <input type="text" name="name" placeholder={t("Votre nom", "Your name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Fonction", "Position")} <span className="text-red-500">*</span></label>
                    <input type="text" name="position" placeholder={t("Votre fonction", "Your position")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Email professionnel", "Professional email")} <span className="text-red-500">*</span></label>
                  <input type="email" name="email" placeholder="votre.email@exemple.com" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                </div>
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Téléphone", "Phone")} <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" placeholder="+33 6 12 34 56 78" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Niveau d'urgence", "Urgency level")} <span className="text-red-500">*</span></label>
                  <select name="urgency" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none" required>
                    <option value="">{t("Sélectionnez l'urgence", "Select urgency")}</option>
                    <option value="Immédiat">{t("Immédiat", "Immediate")}</option>
                    <option value="Sous quelques jours">{t("Sous quelques jours", "Within a few days")}</option>
                    <option value="Sous quelques semaines">{t("Sous quelques semaines", "Within a few weeks")}</option>
                    <option value="À planifier">{t("À planifier", "To be planned")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-4 block">{t("Type de besoin", "Type of need")} <span className="text-red-500">*</span></label>
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
                    <label key={i} className="flex items-start gap-3 text-[1.05rem] text-[#141824] font-light cursor-pointer group">
                      <input type="checkbox" name="needs" value={opt} className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]" /> 
                      <span className="group-hover:text-[#6e7891] transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">
                  {t("Décrivez votre besoin", "Describe your need")} <span className="text-red-500">*</span>
                </label>
                <p className="text-[0.95rem] text-[#6e7891] font-light mb-4 leading-relaxed">
                  {t(
                    "Décrivez votre besoin opérationnel ou joignez une fiche de mission en pdf bien sûr, un cahier des charges ou un document de cadrage afin de faciliter notre première analyse.",
                    "Describe your operational need or attach a mission sheet in pdf of course, a specification or a scoping document to facilitate our initial analysis."
                  )}
                </p>
                <textarea name="description" rows={5} placeholder={t("Saisissez ou collez votre descriptif ici...", "Type or paste your description here...")} className="w-full border border-[#d1d5db] bg-transparent p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors placeholder:text-[#a0aabf] mb-4"></textarea>
                
                <div className={`w-full border-2 border-dashed ${selectedFileName ? 'border-green-500 bg-green-50/30' : 'border-[#d1d5db] bg-[#f5f7fa]'} p-6 text-center hover:bg-[#e8e1d7]/30 transition-colors cursor-pointer rounded-sm`}>
                   <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                     {selectedFileName ? (
                       <div className="flex flex-col items-center">
                         <span className="text-green-700 font-bold text-[1rem] mb-2">{selectedFileName}</span>
                         <span className="text-[#6e7891] text-[0.85rem]">{t("Cliquez ici pour remplacer le document", "Click here to replace the document")}</span>
                         <button 
                           onClick={handleRemoveFile}
                           className="mt-4 px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200"
                         >
                           {t("Supprimer ce document", "Remove this document")}
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center">
                         <span className="text-[#141824] font-medium text-[1rem] mb-2">{t("Ou joignez un document (PDF uniquement)", "Or attach a document (PDF only)")}</span>
                         <span className="text-[#6e7891] text-[0.85rem]">{t("Cliquez ici pour parcourir vos fichiers", "Click here to browse your files")}</span>
                       </div>
                     )}
                     <input type="file" name="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                   </label>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
                  <input type="checkbox" className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
                  <span>
                    {t("J'accepte la", "I accept the")} <Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "Privacy Policy")}</Link> {t("et le traitement de mes données.", "and the processing of my data.")} <span className="text-red-500">*</span>
                  </span>
                </label>
                <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
                  {t(
                    "Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin de répondre à votre demande et d'en assurer le suivi. Elles peuvent être conservées jusqu'à 3 ans après le dernier échange. Vous disposez de droits sur vos données personnelles et pouvez les exercer à l'adresse : contact@menuaconsulting.com. Pour en savoir plus, consultez notre",
                    "The information collected via this form is processed by MENUA CONSULTING in order to respond to your request and ensure its follow-up. They can be kept for up to 3 years after the last exchange. You have rights over your personal data and can exercise them at the address: contact@menuaconsulting.com. To learn more, consult our"
                  )}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
                </p>
              </div>

              {submitStatus && (
                <div className={`p-4 font-bold border-l-4 ${submitStatus.type === "success" ? "bg-green-50 text-green-800 border-green-500" : "bg-red-50 text-red-800 border-red-500"}`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="flex justify-end pt-6">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? t("Envoi en cours...", "Sending...") : t("Envoyer ma demande", "Send my request")} {!isSubmitting && <ArrowRight size={20} className="ml-3" />}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>



    </main>
  );
}
