"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "@/components/Link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import SubmitStatusModal from "@/components/SubmitStatusModal";
import ContactInfoFields from "@/components/ContactInfoFields";
import FormPrivacyAndSubmit from "@/components/FormPrivacyAndSubmit";
import { handleFormSubmit } from "@/utils/formSubmitHandler";

const LANGUAGES = [
  { value: "Allemand",    label_fr: "Allemand",           label_en: "German" },
  { value: "Anglais",     label_fr: "Anglais",            label_en: "English" },
  { value: "Arabe",       label_fr: "Arabe",              label_en: "Arabic" },
  { value: "Coréen",      label_fr: "Coréen",             label_en: "Korean" },
  { value: "Espagnol",    label_fr: "Espagnol",           label_en: "Spanish" },
  { value: "Français",    label_fr: "Français",           label_en: "French" },
  { value: "Italien",     label_fr: "Italien",            label_en: "Italian" },
  { value: "Japonais",    label_fr: "Japonais",           label_en: "Japanese" },
  { value: "Mandarin",    label_fr: "Mandarin (chinois)", label_en: "Mandarin (Chinese)" },
  { value: "Néerlandais", label_fr: "Néerlandais",        label_en: "Dutch" },
  { value: "Polonais",    label_fr: "Polonais",           label_en: "Polish" },
  { value: "Portugais",   label_fr: "Portugais",          label_en: "Portuguese" },
];

export default function NousRejoindre() {
  const { t, lang } = useLanguage();
  const [profileType, setProfileType] = useState<"individual" | "company">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // ── Languages multi-select state ──────────────────────────────────────────
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [languagesError, setLanguagesError] = useState<string | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleLanguage(value: string) {
    setSelectedLanguages(prev =>
      prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Validation compétences clés
    const form = e.currentTarget;
    const checkedSkills = form.querySelectorAll('input[name="skills"]:checked');
    if (checkedSkills.length === 0) {
      e.preventDefault();
      const msg = lang === 'EN'
        ? 'Please select at least one key skill.'
        : 'Veuillez sélectionner au moins une compétence clé.';
      setSkillsError(msg);
      skillsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setSkillsError(null), 4000);
      return;
    }
    setSkillsError(null);

    // Validation langues
    if (selectedLanguages.length === 0) {
      e.preventDefault();
      const msg = lang === 'EN'
        ? 'Please select at least one language.'
        : 'Veuillez sélectionner au moins une langue.';
      setLanguagesError(msg);
      langDropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setLanguagesError(null), 4000);
      return;
    }
    setLanguagesError(null);

    await handleFormSubmit({
      e,
      endpoint: "/api/forms/join",
      lang,
      setSubmitStatus,
      setIsSubmitting,
      setEmailError,
      successMessage: "Votre candidature a été envoyée avec succès.",
      errorMessage: "Impossible d'envoyer la candidature."
    });
  };

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 7.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/nous-rejoindre-hero-new.webp" 
            alt="Nous rejoindre" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/meeting.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous rejoindre", "Join us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Rejoignez une organisation exigeante, orientée vers l'exécution, la qualité des livrables et la continuité opérationnelle.",
                "Join a demanding organisation focused on delivery, quality and operational continuity."
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
              <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#141824] mb-6 uppercase tracking-wider">{t("Profils recherchés", "Profiles sought")}</h2>

              <div className="flex flex-col gap-6 mb-8">
                {[
                  t("Back et middle office", "Back and middle-office specialists"),
                  t("Comptabilité et support administratif", "Accounting and administrative support"),
                  t("Reporting, data et contrôle de gestion", "Reporting, data and management control"),
                  t("Risques, conformité, KYC / AML", "Risk, compliance, KYC / AML"),
                  t("Support opérationnel aux acteurs de la gestion de patrimoine / CGP", "Operational support for wealth management professionals"),
                  t("Profils bilingues français / anglais", "Bilingual French / English professionals"),
                  t("Autres langues appréciées", "Additional languages are an advantage"),
                  t("Profils disponibles pour des missions ponctuelles ou récurrentes", "Professionals available for one-off or recurring engagements")
                ].map((title) => (
                  <div key={title} className="flex items-start gap-3 pl-4 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <h4 className="font-bold text-[#141824] text-[1.05rem] leading-snug">{title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141824] text-white p-10 shadow-xl border-t-4 border-t-[#e8e1d7]">
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed">
                {formatBrand(t(
                  "MENUA CONSULTING recherche des profils autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en français ou en anglais, dans le respect de procédures, de délais et de standards de qualité élevés.",
                  "MENUA CONSULTING is looking for self-sufficient, rigorous, reliable and organised professionals, capable of working remotely on back and middle-office functions (in French or English), while adhering to procedures, deadlines and high quality standards."
                ))}
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-[60%] bg-[#e8e1d7] border-t-4 border-t-[#141824] p-10 lg:p-16 shadow-xl">
            <h3 className="text-[1.4rem] sm:text-[1.6rem] xl:text-[1.8rem] font-semibold text-[#141824] mb-10 uppercase tracking-wide break-words">{t("Formulaire de recrutement", "Recruitment Form")}</h3>
            
            <form className="space-y-10" onSubmit={handleSubmit}>

              <div>
                <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-6 border-b border-[#e8e1d7] pb-3">{t("Vous êtes", "You are")}</p>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-24">
                  <label htmlFor="profileTypeIndividual" className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      id="profileTypeIndividual"
                      name="profileType" 
                      value="individual" 
                      checked={profileType === "individual"} 
                      onChange={() => setProfileType("individual")}
                      className="accent-[#141824] w-5 h-5 cursor-pointer"
                    />
                    <span className="text-[1.05rem] text-[#141824] group-hover:text-[#6e7891] transition-colors">{t("Particulier", "Individual")}</span>
                  </label>
                  <label htmlFor="profileTypeCompany" className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      id="profileTypeCompany"
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
                <ContactInfoFields emailError={emailError} />

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
                
                <div className="mt-6" ref={skillsRef}>
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
                    ].map((opt) => {
                      const isOther = opt === t("Autre", "Other") || opt === "Autre" || opt === "Other";
                      return (
                      <div key={opt} className={`flex items-start gap-3 text-[1.05rem] text-[#141824] font-light group ${isOther ? 'flex-col sm:flex-row' : ''}`}>
                        <label htmlFor={`skill_${opt.replace(/\s+/g, '_')}`} className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            id={`skill_${opt.replace(/\s+/g, '_')}`}
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
                  {skillsError && (
                    <div className="flex items-center gap-2 mt-3">
                      <svg className="shrink-0 text-red-500 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-500 text-xs font-bold">{skillsError}</p>
                    </div>
                  )}
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

                  {/* ── Langues parlées – multi-select custom ── */}
                  <div ref={langDropdownRef} className="relative">
                    <label className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
                      {t("Langues parlées", "Languages spoken")} <span className="text-red-500">*</span>
                    </label>

                    {/* Valeur transmise au backend */}
                    <input type="hidden" name="languages" value={selectedLanguages.join(", ")} />

                    {/* Bouton déclencheur */}
                    <button
                      type="button"
                      onClick={() => setLangDropdownOpen(o => !o)}
                      className={`w-full flex items-center justify-between border-b py-3 px-0 text-[1.05rem] focus:outline-none transition-colors ${
                        selectedLanguages.length > 0
                          ? "border-[#141824] text-[#141824]"
                          : languagesError
                          ? "border-red-500 text-[#a0aabf]"
                          : "border-[#d1d5db] text-[#a0aabf]"
                      }`}
                    >
                      <span className="truncate">
                        {selectedLanguages.length === 0
                          ? t("Sélectionnez vos langues", "Select your languages")
                          : selectedLanguages.map(val => {
                              const item = LANGUAGES.find(l => l.value === val);
                              return item ? (lang === 'EN' ? item.label_en : item.label_fr) : val;
                            }).join(", ")}
                      </span>
                      <svg
                        className={`w-4 h-4 shrink-0 ml-2 text-[#6e7891] transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.755a.75.75 0 111.08 1.04l-4.24 4.293a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Panneau déroulant */}
                    {langDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#d1d5db] shadow-lg max-h-64 overflow-y-auto">
                        {[...LANGUAGES]
                          .sort((a, b) => {
                            const la = lang === 'EN' ? a.label_en : a.label_fr;
                            const lb = lang === 'EN' ? b.label_en : b.label_fr;
                            return la.localeCompare(lb);
                          })
                          .map(item => {
                            const isSelected = selectedLanguages.includes(item.value);
                            const displayLabel = lang === 'EN' ? item.label_en : item.label_fr;
                            return (
                              <label
                                key={item.value}
                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-[0.95rem] ${
                                  isSelected ? "bg-[#f0ede8] text-[#141824] font-medium" : "text-[#141824] hover:bg-[#f8f6f3]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleLanguage(item.value)}
                                  className="accent-[#141824] w-4 h-4 shrink-0"
                                />
                                <span>{displayLabel}</span>
                              </label>
                            );
                          })}
                      </div>
                    )}


                    {/* Tags des langues sélectionnées */}
                    {selectedLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedLanguages.map(val => {
                          const item = LANGUAGES.find(langItem => langItem.value === val);
                          const displayLabel = item ? (lang === 'EN' ? item.label_en : item.label_fr) : val;
                          return (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1.5 bg-[#141824] text-white text-[0.78rem] font-medium px-2.5 py-1"
                          >
                            {displayLabel}
                            <button
                              type="button"
                              onClick={() => toggleLanguage(val)}
                              className="hover:text-[#e8e1d7] transition-colors leading-none"
                              aria-label={`Retirer ${displayLabel}`}
                            >
                              ×
                            </button>
                          </span>
                        )})}
                      </div>
                    )}

                    {/* Message d'erreur */}
                    {languagesError && (
                      <div className="flex items-center gap-2 mt-2">
                        <svg className="shrink-0 text-red-500 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-500 text-xs font-bold">{languagesError}</p>
                      </div>
                    )}
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
                    "Aucun document n'est demandé à ce stade. Si votre profil est retenu, MENUA CONSULTING vous contactera afin de vous indiquer les éventuelles pièces complémentaires à transmettre.",
                    "No document is required at this stage. If your profile is selected, MENUA CONSULTING will contact you to indicate the additional documents to provide."
                  ))}
                </p>
              </div>

              <div>
                <label htmlFor="message" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">{t("Vos motivations en quelques mots", "Describe your motivation")} <span className="text-red-500">*</span></label>
                <textarea id="message" name="message" rows={5} className="w-full border border-[#141824]/30 bg-white/40 p-4 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] resize-none transition-colors" required></textarea>
              </div>

              <FormPrivacyAndSubmit 
                id="privacyPolicyJoin"
                isSubmitting={isSubmitting}
                submitText={t("Soumettre", "Submit")}
                submittingText={t("Envoi en cours...", "Sending...")}
                type="join"
              />
            </form>
          </div>
        </div>
      </section>



      <SubmitStatusModal status={submitStatus} />
    </main>
  );
}
