"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, Clock, Users, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousContacter() {
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [demandeurType, setDemandeurType] = useState<"entreprise" | "independant">("entreprise");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <main className="flex flex-col w-full bg-[#1B3680] text-white font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous-contacter-hero.jpg"
            alt={t("Contact", "Contact")}
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
                <span className="text-white">{t("Nous contacter", "Contact Us")}</span>
              </div>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Nous contacter", "Contact Us")}
              </h1>
              <p className="text-gray-300 text-[0.95rem] md:text-[1.1rem] leading-[1.6] max-w-2xl font-normal">
                {t(
                  "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.",
                  "Present your operational need, and we will respond with an initial analysis and a tailored proposal."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COORDONNÉES */}
      <section className="bg-[#FAFBFC] text-[#0E1B2E] px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200 pb-10">
          {[
            {icon:MapPin, title:t("Adresse","Address"), content:<>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris</>},
            {icon:Mail, title:"Email", content:<a href="mailto:contact@menuaconsulting.com" className="text-gray-600 text-sm hover:text-[#B8922A]">contact@menuaconsulting.com</a>},
            {icon:Phone, title:t("Téléphone","Phone"), content:<a href="tel:+33686877914" className="text-gray-600 text-sm hover:text-[#B8922A]">+33 6 86 87 79 14</a>},
          ].map((item,i)=>(
            <div key={i} className="flex items-start gap-4">
              <div className="text-[#B8922A]"><item.icon size={22} strokeWidth={1.5}/></div>
              <div><h3 className="font-bold text-sm mb-1">{item.title}</h3><p className="text-gray-600 text-sm">{item.content}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA BLOCK */}
      <section className="bg-[#FAFBFC] text-[#0E1B2E] px-8 py-20 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h2 className="text-[#0E1B2E] text-[1.8rem] leading-[2.2rem] font-bold uppercase mb-4">{t("Une question, un besoin ?","A question, a need?")}<br/>{t("Contactez-nous.","Contact us.")}</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-8">{t("Notre équipe est à votre écoute pour comprendre vos enjeux et vous proposer une réponse adaptée.","Our team is here to understand your challenges and offer you a tailored response.")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {icon:Clock, title:t("Réactivité","Responsiveness"), desc:t("Un retour sous 24h ouvrées.","A response within 24 working hours.")},
                {icon:Users, title:t("Écoute","Listening"), desc:t("Un suivi de bout en bout et personnalisé.","End-to-end, personalized follow-up.")},
                {icon:ShieldCheck, title:t("Expertise","Expertise"), desc:t("Des solutions opérationnelles sur-mesure.","Tailor-made operational solutions.")},
              ].map((item,i)=>(
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-[#B8922A]"><item.icon size={22} strokeWidth={1.5}/></div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-3 bg-[#1C40C2] hover:bg-[#142E9A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
              {t("Accéder au formulaire de contact","Access the contact form")} <ArrowRight size={16}/>
            </button>
          </div>
          <div className="md:w-2/5 h-72 rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img src="/nous-contacter-hero.jpg" alt={t("Contact","Contact")} className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>
    </main>
      
      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-[#0E1B2E]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-[#0E1B2E] text-[1.1rem] leading-[1.3rem] font-bold uppercase">{t("Formulaire de contact","Contact Form")}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 md:p-10 flex flex-col md:flex-row gap-12 text-[#0E1B2E]">
              {/* LEFT INFO */}
              <div className="md:w-2/5 space-y-6">
                <h2 className="text-[#0E1B2E] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem]">{t("Pourquoi nous contacter ?","Why contact us?")}</h2>
                {[
                  {icon:Clock, title:t("Réponse rapide","Quick Response"), desc:t("Nous nous engageons à vous répondre dans les meilleurs délais.","We commit to responding to you as soon as possible.")},
                  {icon:Users, title:t("Analyse personnalisée","Personalized Analysis"), desc:t("Nous analysons votre besoin pour vous proposer une solution adaptée.","We analyze your need to propose a tailored solution.")},
                  {icon:ShieldCheck, title:t("Expertise opérationnelle","Operational Expertise"), desc:t("Interventions sur des missions complexes avec rigueur et fiabilité.","Interventions on complex missions with rigor and reliability.")},
                  {icon:ShieldCheck, title:t("Confiance & confidentialité","Trust & Confidentiality"), desc:t("Vos informations sont traitées avec la plus grande confidentialité.","Your information is handled with the utmost confidentiality.")},
                ].map((item,i)=>(
                  <div key={i} className="flex gap-4">
                    <div className="text-[#B8922A] shrink-0 mt-0.5"><item.icon size={20} strokeWidth={1.5}/></div>
                    <div><h3 className="font-bold text-sm mb-1">{item.title}</h3><p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p></div>
                  </div>
                ))}
                <div className="rounded-2xl overflow-hidden h-44 mt-4 hidden md:block">
                  <img src="/notebook.jpg" alt="notebook" className="w-full h-full object-cover"/>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className="flex-1">
                <h2 className="text-[#0E1B2E] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem] hidden md:block">{t("Formulaire de contact","Contact Form")}</h2>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                  {t(
                    "Les informations recueillies sont traitées par MENUA CONSULTING afin de répondre à votre demande. Elles peuvent être conservées jusqu'à 3 ans après le dernier échange. Droits exercés à :",
                    "The information collected is processed by MENUA CONSULTING to respond to your request. It may be kept for up to 3 years after the last exchange. Rights exercised at:"
                  )}{" "}<a href="mailto:contact@menuaconsulting.com" className="text-[#B8922A] hover:underline">contact@menuaconsulting.com</a>.{" "}
                  {t("Voir notre","See our")}{" "}<Link href="/politique-de-confidentialite" className="text-[#B8922A] hover:underline">{t("Politique de confidentialité","Privacy Policy")}</Link>.
                </p>

                {/* TYPE TOGGLE */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Vous représentez *","You represent *")}</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setDemandeurType("entreprise")}
                      className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="entreprise"?"bg-[#1B3680] text-white border-[#1B3680]":"bg-white text-gray-600 border-gray-300 hover:border-[#B8922A]"}`}>
                      {t("Une entreprise / organisation","A company / organization")}
                    </button>
                    <button type="button" onClick={() => setDemandeurType("independant")}
                      className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="independant"?"bg-[#1B3680] text-white border-[#1B3680]":"bg-white text-gray-600 border-gray-300 hover:border-[#B8922A]"}`}>
                      {t("Un professionnel individuel","An individual professional")}
                    </button>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom *","Last Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Société *","Company *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                  </div>

                  {demandeurType === "entreprise" && (
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("SIRET / Numéro d'identification de l'entreprise *","SIRET / Company identification number *")}</label>
                      <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Fonction *","Position *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Email professionnel *","Professional Email *")}</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Téléphone *","Phone *")}</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A]"/></div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Type de besoin *","Type of need *")}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      {[
                        t("Renfort opérationnel","Operational reinforcement"),
                        t("Externalisation back office","Back office outsourcing"),
                        t("Externalisation middle office","Middle office outsourcing"),
                        t("Finance & reporting","Finance & reporting"),
                        t("Contrôle de gestion","Management control"),
                        t("Risques & conformité","Risks & compliance"),
                        t("Support comptable & data","Accounting & data support"),
                        t("Support opérationnel CGP / gestion de patrimoine","Operational support CGP / wealth management"),
                        t("Autre besoin opérationnel","Other operational need"),
                      ].map((opt,i)=>(
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                          <input type="checkbox" className="accent-[#B8922A]"/>{opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Niveau d'urgence *","Urgency level *")}</label>
                    <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#B8922A] bg-white">
                      <option value="">{t("Sélectionnez une option","Select an option")}</option>
                      <option>{t("Immédiat","Immediate")}</option>
                      <option>{t("Sous quelques jours","Within a few days")}</option>
                      <option>{t("Sous quelques semaines","Within a few weeks")}</option>
                      <option>{t("À planifier","To be planned")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Décrivez votre besoin *","Describe your need *")}</label>
                    <textarea rows={4} placeholder={t("Décrivez votre besoin en quelques lignes...","Describe your need in a few lines...")} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#0E1B2E] focus:outline-none focus:border-[#B8922A] resize-none"></textarea>
                  </div>

                  <div className="bg-[#1B3680]/5 border border-[#B8922A]/30 rounded-xl px-5 py-4">
                    <p className="text-[#0E1B2E] text-xs leading-relaxed">
                      <span className="font-semibold text-[#B8922A]">{t("Aucun document n'est requis à ce stade.","No documents are required at this stage.")}</span>{" "}
                      {t(
                        "Pour garantir la sécurité et la confidentialité de vos échanges, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre demande retient notre attention, nous vous recontacterons directement pour convenir de la meilleure façon d'avancer ensemble.",
                        "To guarantee the security and confidentiality of your exchanges, we do not collect any attachments during this first contact. If your request catches our attention, we will contact you directly to agree on the best way to move forward together."
                      )}
                    </p>
                  </div>

                  <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={()=>setAgreed(!agreed)} className="accent-[#B8922A] mt-0.5 shrink-0"/>
                    <span>{t("J'accepte que mes données soient traitées conformément à la","I accept that my data is processed in accordance with the")}{" "}<Link href="/politique-de-confidentialite" className="text-[#B8922A] underline">{t("politique de confidentialité","privacy policy")}</Link>. *</span>
                  </label>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="inline-flex items-center gap-3 bg-[#1C40C2] hover:bg-[#142E9A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                      {t("Envoyer ma demande","Send my request")} <ArrowRight size={16}/>
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
