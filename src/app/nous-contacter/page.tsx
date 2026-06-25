"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, Clock, Users, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousContacter() {
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [demandeurType, setDemandeurType] = useState<"entreprise" | "independant">("entreprise");

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO — height adapts to content */}
      <section className="relative w-full flex items-end overflow-hidden pt-36 pb-20 bg-[#051014]">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#051014] z-10"></div>
          <img src="/nous-contacter-hero.jpg" alt={t("Contact", "Contact")} className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Nous contacter", "Contact Us")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">{t("Nous contacter", "Contact Us")}</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            {t(
              "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.",
              "Present your operational need, and we will respond with an initial analysis and a tailored proposal."
            )}
          </p>
        </div>
      </section>

      {/* COORDONNÉES */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200 pb-10">
          {[
            {icon:MapPin, title:t("Adresse","Address"), content:<>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris</>},
            {icon:Mail, title:"Email", content:<a href="mailto:contact@menuaconsulting.com" className="text-gray-600 text-sm hover:text-[#c89b53]">contact@menuaconsulting.com</a>},
            {icon:Phone, title:t("Téléphone","Phone"), content:<a href="tel:+33686877914" className="text-gray-600 text-sm hover:text-[#c89b53]">+33 6 86 87 79 14</a>},
          ].map((item,i)=>(
            <div key={i} className="flex items-start gap-4">
              <div className="text-[#c89b53]"><item.icon size={22} strokeWidth={1.5}/></div>
              <div><h3 className="font-bold text-sm mb-1">{item.title}</h3><p className="text-gray-600 text-sm">{item.content}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          {/* LEFT INFO */}
          <div className="md:w-2/5 space-y-6">
            <h2 className="font-serif text-2xl font-bold">{t("Pourquoi nous contacter ?","Why contact us?")}</h2>
            {[
              {icon:Clock, title:t("Réponse rapide","Quick Response"), desc:t("Nous nous engageons à vous répondre dans les meilleurs délais.","We commit to responding to you as soon as possible.")},
              {icon:Users, title:t("Analyse personnalisée","Personalized Analysis"), desc:t("Nous analysons votre besoin pour vous proposer une solution adaptée.","We analyze your need to propose a tailored solution.")},
              {icon:ShieldCheck, title:t("Expertise opérationnelle","Operational Expertise"), desc:t("Interventions sur des missions complexes avec rigueur et fiabilité.","Interventions on complex missions with rigor and reliability.")},
              {icon:ShieldCheck, title:t("Confiance & confidentialité","Trust & Confidentiality"), desc:t("Vos informations sont traitées avec la plus grande confidentialité.","Your information is handled with the utmost confidentiality.")},
            ].map((item,i)=>(
              <div key={i} className="flex gap-4">
                <div className="text-[#c89b53] shrink-0 mt-0.5"><item.icon size={20} strokeWidth={1.5}/></div>
                <div><h3 className="font-bold text-sm mb-1">{item.title}</h3><p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden h-44 mt-4">
              <img src="/notebook.jpg" alt="notebook" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold mb-2">{t("Formulaire de contact","Contact Form")}</h2>
            <p className="text-gray-500 text-xs mb-5 leading-relaxed">
              {t(
                "Les informations recueillies sont traitées par MENUA CONSULTING afin de répondre à votre demande. Elles peuvent être conservées jusqu'à 3 ans après le dernier échange. Droits exercés à :",
                "The information collected is processed by MENUA CONSULTING to respond to your request. It may be kept for up to 3 years after the last exchange. Rights exercised at:"
              )}{" "}<a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a>.{" "}
              {t("Voir notre","See our")}{" "}<Link href="/politique-de-confidentialite" className="text-[#c89b53] hover:underline">{t("Politique de confidentialité","Privacy Policy")}</Link>.
            </p>

            {/* TYPE TOGGLE */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Vous représentez *","You represent *")}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDemandeurType("entreprise")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="entreprise"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  {t("Une entreprise / organisation","A company / organization")}
                </button>
                <button type="button" onClick={() => setDemandeurType("independant")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="independant"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  {t("Un professionnel individuel","An individual professional")}
                </button>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Nom *","Last Name *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Société *","Company *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>

              {demandeurType === "entreprise" && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("SIRET / Numéro d'identification de l'entreprise *","SIRET / Company identification number *")}</label>
                  <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Fonction *","Position *")}</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Email professionnel *","Professional Email *")}</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Téléphone *","Phone *")}</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-3 block">{t("Type de besoin *","Type of need *")}</label>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
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
                      <input type="checkbox" className="accent-[#c89b53]"/>{opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Niveau d'urgence *","Urgency level *")}</label>
                <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                  <option value="">{t("Sélectionnez une option","Select an option")}</option>
                  <option>{t("Immédiat","Immediate")}</option>
                  <option>{t("Sous quelques jours","Within a few days")}</option>
                  <option>{t("Sous quelques semaines","Within a few weeks")}</option>
                  <option>{t("À planifier","To be planned")}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("Décrivez votre besoin *","Describe your need *")}</label>
                <textarea rows={4} placeholder={t("Décrivez votre besoin en quelques lignes...","Describe your need in a few lines...")} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53] resize-none"></textarea>
              </div>

              <div className="bg-[#051014]/5 border border-[#c89b53]/30 rounded-xl px-5 py-4">
                <p className="text-[#051014] text-xs leading-relaxed">
                  <span className="font-semibold text-[#c89b53]">{t("Aucun document n'est requis à ce stade.","No documents are required at this stage.")}</span>{" "}
                  {t(
                    "Pour garantir la sécurité et la confidentialité de vos échanges, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre demande retient notre attention, nous vous recontacterons directement pour convenir de la meilleure façon d'avancer ensemble.",
                    "To guarantee the security and confidentiality of your exchanges, we do not collect any attachments during this first contact. If your request catches our attention, we will contact you directly to agree on the best way to move forward together."
                  )}
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={()=>setAgreed(!agreed)} className="accent-[#c89b53] mt-0.5 shrink-0"/>
                <span>{t("J'accepte que mes données soient traitées conformément à la","I accept that my data is processed in accordance with the")}{" "}<Link href="/politique-de-confidentialite" className="text-[#c89b53] underline">{t("politique de confidentialité","privacy policy")}</Link>. *</span>
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                  {t("Envoyer ma demande","Send my request")} <ArrowRight size={16}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[220px]">
          <div className="flex-1 bg-[#0d222b] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-6">{t("Une question urgente ?","An urgent question?")}<br/>{t("Contactez-nous directement.","Contact us directly.")}</h2>
            <Link href="tel:+33686877914" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
              {t("Nous appeler maintenant","Call us now")} <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="md:w-5/12 min-h-[180px] relative">
            <img src="/headphones.jpg" alt={t("Téléphone","Phone")} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d222b] to-transparent"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
