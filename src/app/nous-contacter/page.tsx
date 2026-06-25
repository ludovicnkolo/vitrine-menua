"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, Clock, Users, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function NousContacter() {
  const [agreed, setAgreed] = useState(false);
  const [demandeurType, setDemandeurType] = useState<"entreprise" | "independant">("entreprise");

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO */}
      <section className="relative w-full min-h-[55vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#051014] z-10"></div>
          <img src="/nous-contacter-hero.jpg" alt="Contact" className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-24">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Nous contacter</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">Nous contacter</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.
          </p>
        </div>
      </section>

      {/* COORDONNÉES */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200 pb-10">
          {[
            {icon:MapPin,title:"Adresse",content:<>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris</>},
            {icon:Mail,title:"Email",content:<a href="mailto:contact@menuaconsulting.com" className="text-gray-600 text-sm hover:text-[#c89b53]">contact@menuaconsulting.com</a>},
            {icon:Phone,title:"Téléphone",content:<a href="tel:+33686877914" className="text-gray-600 text-sm hover:text-[#c89b53]">+33 6 86 87 79 14</a>},
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
            <h2 className="font-serif text-2xl font-bold">Pourquoi nous contacter ?</h2>
            {[
              {icon:Clock,title:"Réponse rapide",desc:"Nous nous engageons à vous répondre dans les meilleurs délais."},
              {icon:Users,title:"Analyse personnalisée",desc:"Nous analysons votre besoin pour vous proposer une solution adaptée."},
              {icon:ShieldCheck,title:"Expertise opérationnelle",desc:"Interventions sur des missions complexes avec rigueur et fiabilité."},
              {icon:ShieldCheck,title:"Confiance & confidentialité",desc:"Vos informations sont traitées avec la plus grande confidentialité."},
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
            <h2 className="font-serif text-2xl font-bold mb-2">Formulaire de contact</h2>
            <p className="text-gray-500 text-xs mb-5 leading-relaxed">
              Les informations recueillies sont traitées par MENUA CONSULTING afin de répondre à votre demande. Elles peuvent être conservées jusqu'à 3 ans après le dernier échange. Droits exercés à : <a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a>. Voir notre <Link href="/politique-de-confidentialite" className="text-[#c89b53] hover:underline">Politique de confidentialité</Link>.
            </p>

            {/* TYPE TOGGLE */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-600 mb-3 block">Vous représentez *</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDemandeurType("entreprise")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="entreprise"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  Une entreprise / organisation
                </button>
                <button type="button" onClick={() => setDemandeurType("independant")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${demandeurType==="independant"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  Un professionnel individuel
                </button>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Nom *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Société *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>

              {demandeurType === "entreprise" && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">SIRET / Numéro d'identification de l'entreprise *</label>
                  <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Fonction *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Email professionnel *</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Téléphone *</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-3 block">Type de besoin *</label>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {["Renfort opérationnel","Externalisation back office","Externalisation middle office","Finance & reporting","Contrôle de gestion","Risques & conformité","Support comptable & data","Support opérationnel CGP / gestion de patrimoine","Autre besoin opérationnel"].map((opt,i)=>(
                    <label key={i} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input type="checkbox" className="accent-[#c89b53]"/>{opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Niveau d'urgence *</label>
                <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                  <option value="">Sélectionnez une option</option>
                  <option>Immédiat</option><option>Sous quelques jours</option><option>Sous quelques semaines</option><option>À planifier</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Décrivez votre besoin *</label>
                <textarea rows={4} placeholder="Décrivez votre besoin en quelques lignes..." className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53] resize-none"></textarea>
              </div>

              {/* NO FILE UPLOAD — first contact only */}
              <div className="bg-[#051014]/5 border border-[#c89b53]/30 rounded-xl px-5 py-4">
                <p className="text-[#051014] text-xs leading-relaxed">
                  <span className="font-semibold text-[#c89b53]">Aucun document n'est requis à ce stade.</span>{" "}
                  Pour garantir la sécurité et la confidentialité de vos échanges, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre demande retient notre attention, nous vous recontacterons directement pour convenir de la meilleure façon d'avancer ensemble.
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={()=>setAgreed(!agreed)} className="accent-[#c89b53] mt-0.5 shrink-0"/>
                <span>J'accepte que mes données soient traitées conformément à la <Link href="/politique-de-confidentialite" className="text-[#c89b53] underline">politique de confidentialité</Link>. *</span>
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                  Envoyer ma demande <ArrowRight size={16}/>
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
            <h2 className="font-serif text-3xl font-bold mb-6">Une question urgente ?<br/>Contactez-nous directement.</h2>
            <Link href="tel:+33686877914" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
              Nous appeler maintenant <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="md:w-5/12 min-h-[180px] relative">
            <img src="/headphones.jpg" alt="Phone" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d222b] to-transparent"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
