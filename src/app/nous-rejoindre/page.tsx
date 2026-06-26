"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe, Clock, ShieldCheck, PieChart, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousRejoindre() {
  const { t } = useLanguage();
  const [profilType, setProfilType] = useState<"individuel" | "entreprise">("individuel");

  return (
    <main className="flex flex-col w-full bg-[#0F2B45] text-white font-sans">
      {/* HERO — height adapts to content */}
      <section className="relative w-full flex items-end overflow-hidden pt-36 pb-20 bg-[#0F2B45]">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2B45] via-[#0F2B45]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B45] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#0F2B45] z-10"></div>
          <img src="/nous-rejoindre-hero.jpg" alt={t("Rejoignez-nous","Join Us")} className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]"/>
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#C89B5E] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil","Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Nous rejoindre","Join Us")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">{t("Rejoignez-nous","Join Us")}</h1>
          <div className="w-12 h-1 bg-[#C89B5E] mb-6"></div>
          <p className="text-gray-300 text-base max-w-md leading-relaxed mb-8">
            {t(
              "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en France comme à l'international.",
              "MENUA CONSULTING recruits autonomous, rigorous, reliable, and organized operational profiles, capable of working remotely on back and middle office functions, in France and internationally."
            )}
          </p>
          <div className="space-y-3">
            {[
              {icon:Briefcase, text:t("Environnement stimulant – Projets variés et exigeants","Stimulating environment – Varied and demanding projects")},
              {icon:Clock, text:t("Évolution et formations","Career development and training")},
              {icon:ShieldCheck, text:t("Culture d'excellence","Culture of excellence")},
            ].map((item,i)=>(
              <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="text-[#C89B5E]"><item.icon size={18} strokeWidth={1.5}/></div>{item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#F8F9FA] text-[#1E2A3A] rounded-t-[3rem] relative z-20 px-8 py-14">
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
      <section className="bg-[#F8F9FA] text-[#1E2A3A] px-8 pb-20">
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
                <div className="w-16 h-16 rounded-full border-2 border-[#C89B5E]/30 bg-white flex items-center justify-center mb-4 shadow-sm">
                  <p.icon className="text-[#C89B5E]" size={24} strokeWidth={1.5}/>
                </div>
                <h3 className="font-semibold text-xs leading-snug whitespace-pre-line">{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-[#F8F9FA] text-[#1E2A3A] px-8 pb-24 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start pt-16">
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
              <a href="mailto:contact@menuaconsulting.com" className="text-[#C89B5E] hover:underline">contact@menuaconsulting.com</a>.{" "}
              {t("Pour en savoir plus, consultez notre","To learn more, see our")}{" "}<Link href="/politique-de-confidentialite" className="text-[#C89B5E] hover:underline">{t("Politique de confidentialité","Privacy Policy")}</Link>.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1">
            {/* TYPE TOGGLE */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Vous souhaitez *","You wish to *")}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setProfilType("individuel")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="individuel"?"bg-[#0F2B45] text-white border-[#0F2B45]":"bg-white text-gray-600 border-gray-300 hover:border-[#C89B5E]"}`}>
                  {t("Candidater (personne physique)","Apply (individual)")}
                </button>
                <button type="button" onClick={() => setProfilType("entreprise")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="entreprise"?"bg-[#0F2B45] text-white border-[#0F2B45]":"bg-white text-gray-600 border-gray-300 hover:border-[#C89B5E]"}`}>
                  {t("Proposer un partenariat (entreprise)","Propose a partnership (company)")}
                </button>
              </div>
              {profilType === "entreprise" && (
                <div className="mt-3 bg-[#C89B5E]/10 border border-[#C89B5E]/30 rounded-lg px-4 py-3">
                  <p className="text-[#C89B5E] text-xs">{t("Vous êtes une entreprise souhaitant travailler avec MENUA CONSULTING. Un champ SIRET / numéro d'identification est requis.","You are a company wishing to work with MENUA CONSULTING. A SIRET / identification number field is required.")}</p>
                </div>
              )}
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom complet *","Full Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Prénom *","First Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/></div>
              </div>

              {profilType === "entreprise" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom de l'entreprise *","Company Name *")}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("SIRET / Numéro d'identification de l'entreprise *","SIRET / Company identification number *")}</label>
                    <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Email professionnel *","Professional Email *")}</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Téléphone *","Phone *")}</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Fonction actuelle *","Current Position *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#1E2A3A] focus:outline-none focus:border-[#C89B5E]"/></div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Pays de résidence *","Country of residence *")}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C89B5E] bg-white">
                    <option value=""></option>
                    <option>France</option><option>Belgique / Belgium</option><option>Suisse / Switzerland</option><option>Luxembourg</option><option>{t("Autre","Other")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Langues parlées *","Languages spoken *")}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C89B5E] bg-white">
                    <option value="">{t("Sélectionnez...","Select...")}</option>
                    <option>{t("Français","French")}</option><option>{t("Anglais","English")}</option><option>{t("Français / Anglais","French / English")}</option><option>{t("Autre","Other")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Disponibilité *","Availability *")}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C89B5E] bg-white">
                    <option value="">{t("Sélectionnez","Select")}</option>
                    <option>{t("Immédiate","Immediate")}</option><option>{t("Sous 1 mois","Within 1 month")}</option><option>{t("Sous 3 mois","Within 3 months")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{profilType === "entreprise" ? t("Domaine(s) d'expertise proposé(s) *","Area(s) of expertise offered *") : t("Fonctions / Métiers *","Functions / Roles *")}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C89B5E] bg-white">
                    <option value="">{t("Sélectionnez une ou plusieurs options","Select one or more options")}</option>
                    <option>Back office</option><option>Middle office</option><option>{t("Contrôle de gestion","Management control")}</option>
                    <option>{t("Conformité / KYC","Compliance / KYC")}</option><option>{t("Comptabilité","Accounting")}</option><option>{t("Reporting / Data","Reporting / Data")}</option>
                    <option>{t("Support CGP / Gestion de patrimoine","Support CGP / Wealth management")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Expérience (années) *","Experience (years) *")}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C89B5E] bg-white">
                    <option value="">{t("Sélectionnez","Select")}</option>
                    <option>0-2 {t("ans","years")}</option><option>2-5 {t("ans","years")}</option><option>5-10 {t("ans","years")}</option><option>10+ {t("ans","years")}</option>
                  </select>
                </div>
              </div>
              <div className="bg-[#0F2B45]/5 border border-[#C89B5E]/30 rounded-xl px-5 py-4">
                <p className="text-[#1E2A3A] text-xs leading-relaxed">
                  <span className="font-semibold text-[#C89B5E]">{t("Aucun document n'est requis à ce stade.","No documents are required at this stage.")}</span>{" "}
                  {t(
                    "Pour garantir la sécurité et la confidentialité de vos informations, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre candidature retient notre attention, nous vous contacterons directement pour convenir de la suite du processus.",
                    "To guarantee the security and confidentiality of your information, we do not collect any attachments during this first contact. If your application catches our attention, we will contact you directly to agree on the next steps."
                  )}
                </p>
              </div>
              <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-[#C89B5E] mt-0.5 shrink-0"/>
                <span>{t("J'accepte que mes données soient traitées conformément à la","I accept that my data is processed in accordance with the")}{" "}<Link href="/politique-de-confidentialite" className="text-[#C89B5E] underline">{t("politique de confidentialité","privacy policy")}</Link>. *</span>
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                  {profilType === "entreprise" ? t("Envoyer ma proposition","Send my proposal") : t("Envoyer ma candidature","Send my application")} <ArrowRight size={16}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2B45] px-8 py-16">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[200px]">
          <div className="flex-1 bg-[#1A2D4A] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-6">{t("Une question urgente ?","An urgent question?")}<br/>{t("Contactez-nous directement.","Contact us directly.")}</h2>
            <Link href="tel:+33686877914" className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
              {t("Nous appeler maintenant","Call us now")} <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="md:w-5/12 min-h-[180px] relative">
            <img src="/headphones.jpg" alt={t("Téléphone","Phone")} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A2D4A] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* CONTACT MINI */}
      <section className="bg-[#F8F9FA] text-[#1E2A3A] px-8 py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="text-[#C89B5E] text-[0.65rem] tracking-wider uppercase mb-4">{t("Accueil › Nous contacter","Home › Contact Us")}</div>
            <h2 className="font-serif text-4xl font-bold mb-4">{t("Une question, un besoin ?","A question, a need?")}<br/>{t("Contactez-nous.","Contact us.")}</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-8">{t("Notre équipe est à votre écoute pour comprendre vos enjeux et vous proposer une réponse adaptée.","Our team is here to understand your challenges and offer you a tailored response.")}</p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                {icon:Clock, title:t("Réactivité","Responsiveness"), desc:t("Un retour sous 24h ouvrées.","A response within 24 working hours.")},
                {icon:Users, title:t("Écoute","Listening"), desc:t("Un suivi de bout en bout et personnalisé.","End-to-end, personalized follow-up.")},
                {icon:ShieldCheck, title:t("Expertise","Expertise"), desc:t("Des solutions opérationnelles sur-mesure.","Tailor-made operational solutions.")},
              ].map((item,i)=>(
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-[#C89B5E]"><item.icon size={22} strokeWidth={1.5}/></div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/nous-contacter" className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
              {t("Nous contacter","Contact Us")} <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="md:w-2/5 h-72 rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img src="/nous-contacter-hero.jpg" alt={t("Contact","Contact")} className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>
    </main>
  );
}
