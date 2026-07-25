"use client";
import React, { useState } from "react";
import Link from "@/components/Link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function NousRejoindre() {
  const { t, lang } = useLanguage();
  const [profileType, setProfileType] = useState<"individual" | "company">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const apiUrl = process.env.NODE_ENV === 'production' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
      const res = await fetch(`${apiUrl}/api/forms/join?lang=${lang.toLowerCase()}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitStatus({ type: "success", message: data.message || "Votre candidature a été envoyée avec succès." });
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Impossible d'envoyer la candidature." });
      setTimeout(() => setSubmitStatus(null), 3000);
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
            src="/img/nous-rejoindre-hero-new.webp" 
            alt="Nous rejoindre" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous rejoindre", "Join Us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Rejoignez une organisation exigeante, orientée vers l’exécution, la qualité des livrables et la continuité opérationnelle.",
                "Join a demanding organization, oriented towards execution, quality of deliverables and operational continuity."
              )}
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
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed">
                {formatBrand(t(
                  "MENUA CONSULTING recherche des profils autonomes, rigoureux, fiables et organisés, capables d’intervenir à distance sur des fonctions back et middle office, en français ou en anglais, dans le respect de procédures, de délais et de standards de qualité élevés.",
                  "MENUA CONSULTING is looking for autonomous, rigorous, reliable and organized profiles, capable of intervening remotely on back and middle office functions, in French or in English, in compliance with procedures, deadlines and high quality standards."
                ))}
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-[60%] bg-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h3 className="text-[1.4rem] sm:text-[1.6rem] xl:text-[1.8rem] whitespace-nowrap font-semibold text-[#141824] mb-10 uppercase tracking-wide">{t("Formulaire de recrutement", "Recruitment Form")}</h3>
            
            <form className="space-y-10" onSubmit={handleSubmit}>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vous êtes", "You are")}</p>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-24">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="profileType" 
                      value="individual" 
                      checked={profileType === "individual"} 
                      onChange={() => setProfileType("individual")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Particulier", "Individual")}</span>
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
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Société", "Company")}</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Informations", "Information")}</p>
                
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

                {profileType === "company" && (
                  <div className="grid grid-cols-1 gap-8 mb-8">
                    <div>
                      <label htmlFor="company" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Raison sociale", "Company Name")} <span className="text-red-500">*</span></label>
                      <input id="company" type="text" name="company" placeholder={t("Nom de votre société", "Your company name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
                    </div>
                  </div>
                )}
              </div>


              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Profil et Expertise", "Profile and Expertise")}</p>
                
                <div className="mt-6">
                  <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-4 block">
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
                    ].map((opt, i) => {
                      const isOther = opt === t("Autre", "Other") || opt === "Autre" || opt === "Other";
                      return (
                      <div key={i} className={`flex items-start gap-3 text-[1.05rem] text-[#141824] font-light group ${isOther ? 'flex-col sm:flex-row' : ''}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="skills" 
                            value={opt} 
                            className="accent-[#141824] mt-1 shrink-0 w-5 h-5 border-[#d1d5db] text-[#141824]"
                            onChange={(e) => {
                              if (isOther && e.target.checked) {
                                document.getElementById('otherSkillInput')?.focus();
                              }
                            }}
                          /> 
                          <span className="group-hover:text-[#6e7891] transition-colors whitespace-nowrap">{opt}</span>
                        </label>
                        {isOther && (
                          <input id="otherSkillInput" type="text" name="otherSkill" maxLength={30} placeholder={t("Précisez", "Specify")} className="w-full sm:w-auto flex-grow border-b border-[#d1d5db] bg-transparent px-2 py-0.5 text-[0.95rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
                        )}
                      </div>
                    )})}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label htmlFor="experience" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Années d'expérience", "Years of experience")} <span className="text-red-500">*</span></label>
                    <select id="experience" name="experience" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none" required>
                      <option value="">{t("Sélectionnez", "Select")}</option>
                      <option value="Moins de 2 ans">{t("Moins de 2 ans", "Less than 2 years")}</option>
                      <option value="2 à 5 ans">{t("2 à 5 ans", "2 to 5 years")}</option>
                      <option value="5 à 10 ans">{t("5 à 10 ans", "5 to 10 years")}</option>
                      <option value="Plus de 10 ans">{t("Plus de 10 ans", "More than 10 years")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="languages" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Langues parlées", "Languages spoken")} <span className="text-red-500">*</span></label>
                    <input id="languages" type="text" name="languages" placeholder={t("Ex: Français, Anglais...", "E.g. French, English...")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label htmlFor="location" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Lieu de résidence", "Place of residence")}</label>
                    <input id="location" type="text" name="location" placeholder={t("Ex: Paris, France", "E.g. Paris, France")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="availability" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Disponibilité", "Availability")} <span className="text-red-500">*</span></label>
                    <select id="availability" name="availability" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors appearance-none" required>
                      <option value="">{t("Sélectionnez votre disponibilité", "Select your availability")}</option>
                      <option>{t("Immédiate", "Immediate")}</option>
                      <option>{t("Sous 15 jours", "Within 15 days")}</option>
                      <option>{t("Sous 1 mois", "Within 1 month")}</option>
                      <option>{t("À définir", "To be defined")}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="linkedin" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Lien LinkedIn ou Portfolio", "LinkedIn Link or Portfolio")}</label>
                  <input id="linkedin" type="url" name="linkedin" placeholder="https://" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors" />
                </div>
              </div>

              <div className="bg-[#f5f7fa] py-3 px-4 border-l-4 border-[#141824]">
                <p className="text-[0.85rem] text-[#6e7891] italic leading-relaxed">
                  {formatBrand(t(
                    "Aucun document n’est demandé à ce stade. Si votre profil est retenu, MENUA CONSULTING vous contactera afin de vous indiquer les éventuelles pièces complémentaires à transmettre.",
                    "No document is required at this stage. If your profile is selected, MENUA CONSULTING will contact you to indicate the additional documents to provide."
                  ))}
                </p>
              </div>

              <div>
                <label htmlFor="message" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Brève description de vos motivations", "Brief description of your motivations")} <span className="text-red-500">*</span></label>
                <textarea id="message" name="message" rows={5} className="w-full border border-[#141824]/30 bg-white/40 p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors" required></textarea>
              </div>

              <div>
                <label className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
                  <input type="checkbox" className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
                  <span>
                    {t("J’ai pris connaissance de la", "I have read the")} <Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "Privacy Policy")}</Link>. <span className="text-red-500">*</span>
                  </span>
                </label>
                <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
                  {formatBrand(t(
                    "Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin de répondre à votre demande et d'en assurer le suivi. Elles peuvent être conservées jusqu'à 3 ans après le dernier échange. Vous disposez de droits sur vos données personnelles et pouvez les exercer à l'adresse : contact@menuaconsulting.com. Pour en savoir plus, consultez notre",
                    "The information collected via this form is processed by MENUA CONSULTING in order to respond to your request and ensure its follow-up. They can be kept for up to 3 years after the last exchange. You have rights over your personal data and can exercise them at the address: contact@menuaconsulting.com. To learn more, consult our"
                  ))}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
                </p>
              </div>



              <div className="flex justify-center pt-6">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? t("Envoi en cours...", "Sending...") : t("Soumettre", "Submit")}
                </button>
              </div>
            </form>
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
