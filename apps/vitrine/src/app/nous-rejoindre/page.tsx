"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function NousRejoindre() {
  const { t } = useLanguage();
  const [profileType, setProfileType] = useState<"individual" | "company">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/forms/join`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus({ type: "success", message: data.message || "Votre candidature a été envoyée avec succès." });
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Impossible d'envoyer la candidature." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 7.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/besoins-hero.jpg" 
            alt="Nous rejoindre" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous rejoindre", "Join Us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {formatBrand(t(
                "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en France comme à l'international.",
                "MENUA CONSULTING is recruiting autonomous, rigorous, reliable and organized operational profiles, capable of intervening remotely on back and middle office functions, in France and internationally."
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION (Laplace Styling) ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.75rem] pb-16 md:pb-24">
        <div className="laplace-container flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left Column (Profiles) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 shadow-xl">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#141824] mb-6 uppercase tracking-wider">{t("Profils recherchés", "Profiles Sought")}</h2>

              <div className="flex flex-col gap-6 mb-8">
                {[
                  t("Back et middle office", "Back and middle office"),
                  t("Comptabilité et support administratif", "Accounting and admin support"),
                  t("Reporting, data et contrôle de gestion", "Reporting, data and management control"),
                  t("Risques, conformité, KYC / AML", "Risk, compliance, KYC / AML"),
                  t("Support opérationnel aux acteurs de la gestion de patrimoine / CGP", "Operational support to wealth management players / CGP"),
                  t("Profils bilingues français / anglais", "Bilingual profiles French / English"),
                  t("Autres langues appréciées", "Other languages appreciated"),
                  t("Profils disponibles pour des missions ponctuelles ou récurrentes", "Profiles available for occasional or recurring missions")
                ].map((title, i) => (
                  <div key={i} className="flex items-start gap-3 pl-4 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <h4 className="font-bold text-[#141824] text-[1.05rem] leading-snug">{title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 shadow-xl border-t-4 border-t-[#e8e1d7]">
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING recherche des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, principalement dans un cadre international.",
                  "MENUA CONSULTING is looking for autonomous, rigorous, reliable and organized operational profiles, capable of intervening remotely on back and middle office functions, mainly in an international context."
                ))}
              </p>
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed">
                {t(
                  "Les profils recherchés doivent être orientés exécution, à l'aise avec le travail à distance et capables de respecter des procédures, des délais et des standards de qualité élevés.",
                  "The profiles sought must be execution-oriented, comfortable with remote work and capable of respecting procedures, deadlines and high quality standards."
                )}
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-[60%] bg-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h3 className="text-[1.8rem] font-semibold text-[#141824] mb-10 uppercase tracking-wider">{t("Formulaire de recrutement", "Recruitment Form")}</h3>
            
            <form className="space-y-10" onSubmit={handleSubmit}>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vous êtes", "You are")}</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="profileType" 
                      value="individual" 
                      checked={profileType === "individual"} 
                      onChange={() => setProfileType("individual")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Une personne physique / candidat individuel", "An individual / individual candidate")}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="profileType" 
                      value="company" 
                      checked={profileType === "company"} 
                      onChange={() => setProfileType("company")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Une entreprise prestataire ou partenaire", "A service provider or partner company")}</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Informations", "Information")}</p>
                
                {profileType === "company" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Nom de l'entreprise", "Company Name")} <span className="text-red-500">*</span></label>
                      <input type="text" name="company" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                    </div>
                    <div>
                      <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("SIRET / Numéro d'identification", "SIRET / ID Number")} <span className="text-red-500">*</span></label>
                      <input type="text" name="siret" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Nom", "Last Name")} <span className="text-red-500">*</span></label>
                    <input type="text" name="lastName" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Prénom", "First Name")} <span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Téléphone", "Phone")} <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                </div>
              </div>


              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Profil et Expertise", "Profile and Expertise")}</p>
                
                <div className="mt-6">
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-4 block">
                    {t("Compétences clés", "Key skills")} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    {[
                      t("Back et middle office", "Back and middle office"),
                      t("Comptabilité", "Accounting"),
                      t("Reporting et Data", "Reporting and Data"),
                      t("Risques et Conformité", "Risk and Compliance"),
                      t("Support opérationnel CGP", "Wealth Management Support"),
                      t("Autre", "Other")
                    ].map((opt, i) => (
                      <label key={i} className="flex items-start gap-3 text-[1.05rem] text-[#141824] font-light cursor-pointer group">
                        <input type="checkbox" name="skills" value={opt} className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]" /> 
                        <span className="group-hover:text-[#6e7891] transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Années d'expérience", "Years of experience")} <span className="text-red-500">*</span></label>
                    <select name="experience" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none" required>
                      <option value="">{t("Sélectionnez", "Select")}</option>
                      <option>Moins de 2 ans</option>
                      <option>2 à 5 ans</option>
                      <option>5 à 10 ans</option>
                      <option>Plus de 10 ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Langues parlées", "Languages spoken")} <span className="text-red-500">*</span></label>
                    <input type="text" name="languages" placeholder={t("Ex: Français, Anglais...", "E.g. French, English...")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Pays / Ville", "Country / City")} <span className="text-red-500">*</span></label>
                    <input type="text" name="location" placeholder={t("Ex: France, Paris", "E.g. France, Paris")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                  <div>
                    <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Disponibilité", "Availability")} <span className="text-red-500">*</span></label>
                    <select name="availability" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none" required>
                      <option value="">{t("Sélectionnez votre disponibilité", "Select your availability")}</option>
                      <option>{t("Immédiate", "Immediate")}</option>
                      <option>{t("Sous 15 jours", "Within 15 days")}</option>
                      <option>{t("Sous 1 mois", "Within 1 month")}</option>
                      <option>{t("À définir", "To be defined")}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Lien LinkedIn ou Portfolio", "LinkedIn Link or Portfolio")}</label>
                  <input type="url" name="linkedin" placeholder="https://" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" />
                </div>
              </div>

              <div className="bg-[#f5f7fa] p-5 border-l-4 border-[#141824]">
                <p className="text-[0.95rem] text-[#141824] font-medium leading-relaxed">
                  {t(
                    "Aucun document n'est exigible pour le moment. Nous vous reviendrons par la suite pour toute modalité ultérieure.",
                    "No document is required at this time. We will get back to you later for any further arrangements."
                  )}
                </p>
              </div>

              <div>
                <label className="text-[0.85rem] font-bold uppercase tracking-widest text-[#141824] mb-3 block">{t("Message", "Message")} <span className="text-red-500">*</span></label>
                <textarea name="message" rows={5} className="w-full border border-[#141824]/30 bg-white/40 p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors" required></textarea>
              </div>

              <div>
                <label className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
                  <input type="checkbox" className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
                  <span>
                    {t("J'accepte le traitement de mes données.", "I accept the processing of my data.")} <span className="text-red-500">*</span>
                  </span>
                </label>
                <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
                  {formatBrand(t(
                    "Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin d'étudier votre candidature et d'en assurer le suivi. Votre dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de votre part. Vous disposez de droits sur vos données personnelles à l'adresse : contact@menuaconsulting.com. Pour en savoir plus, consultez notre",
                    "The information collected via this form is processed by MENUA CONSULTING in order to study your application and ensure its follow-up. Your file may be kept for up to 2 years after the last contact, unless you object. You have rights over your personal data at the address: contact@menuaconsulting.com. To learn more, consult our"
                  ))}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
                </p>
              </div>

              {submitStatus && (
                <div className={`p-4 font-bold border-l-4 ${submitStatus.type === "success" ? "bg-green-50 text-green-800 border-green-500" : "bg-red-50 text-red-800 border-red-500"}`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="flex justify-center pt-6">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? t("Envoi en cours...", "Sending...") : t("Envoyer ma candidature", "Send my application")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>



    </main>
  );
}
