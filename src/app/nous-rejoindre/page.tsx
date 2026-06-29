"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe, Clock, ShieldCheck, PieChart, BarChart3, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousRejoindre() {
  const { t } = useLanguage();
  const [profilType, setProfilType] = useState<"individuel" | "entreprise">("individuel");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <main className="flex flex-col w-full bg-[#1B3680] text-white font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous-rejoindre-hero.jpg"
            alt={t("Rejoignez-nous","Join Us")}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680] from-20% via-[#1B3680]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#B8922A]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#B8922A]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#B8922A]" />
            
            <div className="relative">
              <div className="text-[#B8922A] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                <Link href="/" className="hover:text-white transition-colors">{t("Accueil", "Home")}</Link>
                <span className="mx-2 text-white/50">›</span>
                <span className="text-white">{t("Nous rejoindre", "Join Us")}</span>
              </div>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Rejoignez-nous", "Join Us")}
              </h1>
              <p className="text-gray-300 text-[0.95rem] md:text-[1.1rem] leading-[1.6] max-w-2xl font-normal mb-8">
                {t(
                  "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en France comme à l'international.",
                  "MENUA CONSULTING recruits autonomous, rigorous, reliable, and organized operational profiles, capable of working remotely on back and middle office functions, in France and internationally."
                )}
              </p>
              <div className="space-y-4">
                {[
                  {icon:Briefcase, text:t("Environnement stimulant – Projets variés et exigeants","Stimulating environment – Varied and demanding projects")},
                  {icon:Clock, text:t("Évolution et formations","Career development and training")},
                  {icon:Users, text:t("Équipe experte et bienveillante","Expert and caring team")},
                  {icon:Globe, text:t("Opportunités à l'international","International opportunities")}
                ].map((item,i)=>(
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-[#B8922A]"><item.icon size={20} strokeWidth={1.5}/></div>
                    <p className="text-[0.9rem] md:text-[0.95rem]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#FAFBFC] text-[#0E1B2E] rounded-t-[3rem] relative z-20 px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            {t(
              "MENUA CONSULTING recherche des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, principalement dans un cadre international. Les profils recherchés doivent être orientés exécution, à l'aise avec le travail à distance et capables de respecter des procédures, des délais et des standards de qualité élevés.",
              "MENUA CONSULTING is looking for autonomous, rigorous, reliable, and organized operational profiles, capable of working remotely on back and middle office functions, mainly in an international context. The profiles sought must be execution-oriented, comfortable with remote work, and capable of adhering to procedures, deadlines, and high quality standards."
            )}
          </p>
        </div>
      </section>

      {/* PROFILS */}
      <section className="bg-[#FAFBFC] text-[#0E1B2E] px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-14">{t("Profils recherchés","Profiles Sought")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {icon:Briefcase, title:t("Back et\nmiddle office","Back and\nmiddle office")},
              {icon:PieChart, title:t("Comptabilité et\nsupport administratif","Accounting and\nadministrative support")},
              {icon:BarChart3, title:t("Reporting, data et\ncontrôle de gestion","Reporting, data and\nmanagement control")},
              {icon:ShieldCheck, title:t("Risques, conformité,\nKYC / AML","Risks, compliance,\nKYC / AML")},
              {icon:Users, title:t("Support opérationnel\naux acteurs de la\ngestion de patrimoine / CGP","Operational support\nfor wealth management\nactors / CGP")},
              {icon:Globe, title:t("Profils bilingues\nfrançais / anglais","Bilingual profiles\nFrench / English")},
              {icon:Globe, title:t("Autres langues\nappréciées","Other languages\nwelcomed")},
              {icon:Clock, title:t("Profils disponibles pour\ndes missions ponctuelles\nou récurrentes","Profiles available for\npunctual or recurring\nmissions")},
            ].map((p,i)=>(
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#B8922A]/30 bg-white flex items-center justify-center mb-4 shadow-sm">
                  <p.icon className="text-[#B8922A]" size={24} strokeWidth={1.5}/>
                </div>
                <h3 className="font-semibold text-xs leading-snug whitespace-pre-line">{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM CTA */}
      <section className="bg-[#FAFBFC] text-[#0E1B2E] px-8 pb-24 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col items-center pt-16 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">{t("Prêt à nous rejoindre ?","Ready to join us?")}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">{t("Remplissez notre formulaire pour nous soumettre votre candidature ou votre proposition de partenariat.","Fill out our form to submit your application or partnership proposal.")}</p>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-3 bg-[#1C40C2] hover:bg-[#142E9A] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
             {t("Accéder au formulaire de recrutement","Access the recruitment form")} <ArrowRight size={18}/>
          </button>
        </div>
      </section>

    </main>
      
      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-[#0E1B2E]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-serif text-xl font-bold text-[#0E1B2E]">{t("Formulaire de recrutement","Recruitment Form")}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 md:p-10 flex flex-col md:flex-row gap-12 text-[#0E1B2E]">
              {/* LEFT INFO */}
              <div className="md:w-2/5">
                <h2 className="font-serif text-2xl font-bold mb-6">{t("Formulaire de recrutement","Recruitment Form")}</h2>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {t(
                    "Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin d'étudier votre candidature et d'en assurer le suivi. Votre dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de votre part.",
                    "The information collected via this form is processed by MENUA CONSULTING to review your application and manage follow-up. Your file may be kept for up to 2 years after the last contact, unless you object."
                  )}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t("Vous disposez de droits sur vos données personnelles à l'adresse","You have rights over your personal data at")}{" "}
                  <a href="mailto:contact@menuaconsulting.com" className="text-[#B8922A] hover:underline">contact@menuaconsulting.com</a>.{" "}
                  {t("Pour en savoir plus, consultez notre","To learn more, see our")}{" "}<Link href="/politique-de-confidentialite" className="text-[#B8922A] hover:underline">{t("Politique de confidentialité","Privacy Policy")}</Link>.
                </p>
              </div>

              {/* RIGHT FORM */}
              <div className="flex-1">
                {/* TYPE TOGGLE */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Vous souhaitez *","You wish to *")}</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setProfilType("individuel")}
                      className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="individuel"?"bg-[#1B3680] text-white border-[#1B3680]":"bg-white text-gray-600 border-gray-300 hover:border-[#B8922A]"}`}>
                      {t("Candidater (personne physique)","Apply (individual)")}
                    </button>
                    <button type="button" onClick={() => setProfilType("entreprise")}
                      className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="entreprise"?"bg-[#1B3680] text-white border-[#1B3680]":"bg-white text-gray-600 border-gray-300 hover:border-[#B8922A]"}`}>
                      {t("Proposer un partenariat (entreprise)","Propose a partnership (company)")}
                    </button>
                  </div>
                  {profilType === "entreprise" && (
                    <div className="mt-3 bg-[#B8922A]/10 border border-[#B8922A]/30 rounded-lg px-4 py-3">
                      <p className="text-[#B8922A] text-xs">{t("Vous êtes une entreprise souhaitant travailler avec MENUA CONSULTING. Un champ SIRET / numéro d'identification est requis.","You are a company wishing to work with MENUA CONSULTING. A SIRET / identification number field is required.")}</p>
                    </div>
                  )}
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom complet *","Full Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Prénom *","First Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                  </div>

                  {profilType === "entreprise" && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom de l'entreprise *","Company Name *")}</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("SIRET / Numéro d'identification de l'entreprise *","SIRET / Company identification number *")}</label>
                        <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Email professionnel *","Professional Email *")}</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Téléphone *","Phone *")}</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Fonction actuelle *","Current Position *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Pays de résidence *","Country of residence *")}</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                        <option value=""></option>
                        <option>France</option><option>Belgique / Belgium</option><option>Suisse / Switzerland</option><option>Luxembourg</option><option>{t("Autre","Other")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Langues parlées *","Languages spoken *")}</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                        <option value="">{t("Sélectionnez...","Select...")}</option>
                        <option>{t("Français","French")}</option><option>{t("Anglais","English")}</option><option>{t("Français / Anglais","French / English")}</option><option>{t("Autre","Other")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Disponibilité *","Availability *")}</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                        <option value="">{t("Sélectionnez","Select")}</option>
                        <option>{t("Immédiate","Immediate")}</option><option>{t("Sous 1 mois","Within 1 month")}</option><option>{t("Sous 3 mois","Within 3 months")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{profilType === "entreprise" ? t("Domaine(s) d'expertise proposé(s) *","Area(s) of expertise offered *") : t("Fonctions / Métiers *","Functions / Roles *")}</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                        <option value="">{t("Sélectionnez une ou plusieurs options","Select one or more options")}</option>
                        <option>Back office</option><option>Middle office</option><option>{t("Contrôle de gestion","Management control")}</option>
                        <option>{t("Conformité / KYC","Compliance / KYC")}</option><option>{t("Comptabilité","Accounting")}</option><option>{t("Reporting / Data","Reporting / Data")}</option>
                        <option>{t("Support CGP / Gestion de patrimoine","Support CGP / Wealth management")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Expérience (années) *","Experience (years) *")}</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                        <option value="">{t("Sélectionnez","Select")}</option>
                        <option>0-2 {t("ans","years")}</option><option>2-5 {t("ans","years")}</option><option>5-10 {t("ans","years")}</option><option>10+ {t("ans","years")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-[#1B3680]/5 border border-[#B8922A]/30 rounded-xl px-5 py-4">
                    <p className="text-[#0E1B2E] text-xs leading-relaxed">
                      <span className="font-semibold text-[#B8922A]">{t("Aucun document n'est requis à ce stade.","No documents are required at this stage.")}</span>{" "}
                      {t(
                        "Pour garantir la sécurité et la confidentialité de vos informations, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre candidature retient notre attention, nous vous contacterons directement pour convenir de la suite du processus.",
                        "To guarantee the security and confidentiality of your information, we do not collect any attachments during this first contact. If your application catches our attention, we will contact you directly to agree on the next steps."
                      )}
                    </p>
                  </div>
                  <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" className="accent-[#B8922A] mt-0.5 shrink-0"/>
                    <span>{t("J'accepte que mes données soient traitées conformément à la","I accept that my data is processed in accordance with the")}{" "}<Link href="/politique-de-confidentialite" className="text-[#B8922A] underline">{t("politique de confidentialité","privacy policy")}</Link>. *</span>
                  </label>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="inline-flex items-center gap-3 bg-[#1C40C2] hover:bg-[#142E9A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                      {profilType === "entreprise" ? t("Envoyer ma proposition","Send my proposal") : t("Envoyer ma candidature","Send my application")} <ArrowRight size={16}/>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
