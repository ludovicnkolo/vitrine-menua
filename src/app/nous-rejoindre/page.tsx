"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Globe, Clock, ShieldCheck, PieChart, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function NousRejoindre() {
  const [profilType, setProfilType] = useState<"individuel" | "entreprise">("individuel");

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO */}
      <section className="relative w-full min-h-[65vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#051014] z-10"></div>
          <img src="/nous-rejoindre-hero.jpg" alt="Rejoignez-nous" className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]"/>
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-24">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Nous rejoindre</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">Rejoignez-nous</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-base max-w-md leading-relaxed mb-8">
            MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en France comme à l'international.
          </p>
          <div className="space-y-3">
            {[{icon:Briefcase,text:"Environnement stimulant – Projets variés et exigeants"},{icon:Clock,text:"Évolution et formations"},{icon:ShieldCheck,text:"Culture d'excellence"}].map((item,i)=>(
              <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="text-[#c89b53]"><item.icon size={18} strokeWidth={1.5}/></div>{item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            MENUA CONSULTING recherche des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, principalement dans un cadre international. Les profils recherchés doivent être orientés exécution, à l'aise avec le travail à distance et capables de respecter des procédures, des délais et des standards de qualité élevés.
          </p>
        </div>
      </section>

      {/* PROFILS */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-14">Profils recherchés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {icon:Briefcase,title:"Back et\nmiddle office"},
              {icon:PieChart,title:"Comptabilité et\nsupport administratif"},
              {icon:BarChart3,title:"Reporting, data et\ncontrôle de gestion"},
              {icon:ShieldCheck,title:"Risques, conformité,\nKYC / AML"},
              {icon:Users,title:"Support opérationnel\naux acteurs de la\ngestion de patrimoine / CGP"},
              {icon:Globe,title:"Profils bilingues\nfrançais / anglais"},
              {icon:Globe,title:"Autres langues\nappréciées"},
              {icon:Clock,title:"Profils disponibles pour\ndes missions ponctuelles\nou récurrentes"},
            ].map((p,i)=>(
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#c89b53]/30 bg-white flex items-center justify-center mb-4 shadow-sm">
                  <p.icon className="text-[#c89b53]" size={24} strokeWidth={1.5}/>
                </div>
                <h3 className="font-semibold text-xs leading-snug whitespace-pre-line">{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-24 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start pt-16">
          {/* LEFT INFO */}
          <div className="md:w-2/5">
            <h2 className="font-serif text-2xl font-bold mb-6">Formulaire de recrutement</h2>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin d'étudier votre candidature et d'en assurer le suivi. Votre dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de votre part.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Vous disposez de droits sur vos données personnelles à l'adresse{" "}
              <a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a>.{" "}
              Pour en savoir plus, consultez notre <Link href="/politique-de-confidentialite" className="text-[#c89b53] hover:underline">Politique de confidentialité</Link>.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="flex-1">

            {/* TYPE TOGGLE */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-600 mb-3 block">Vous souhaitez *</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setProfilType("individuel")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="individuel"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  Candidater (personne physique)
                </button>
                <button type="button" onClick={() => setProfilType("entreprise")}
                  className={`flex-1 py-3 px-4 rounded border text-xs font-semibold transition-colors ${profilType==="entreprise"?"bg-[#051014] text-white border-[#051014]":"bg-white text-gray-600 border-gray-300 hover:border-[#c89b53]"}`}>
                  Proposer un partenariat (entreprise)
                </button>
              </div>
              {profilType === "entreprise" && (
                <div className="mt-3 bg-[#c89b53]/10 border border-[#c89b53]/30 rounded-lg px-4 py-3">
                  <p className="text-[#c89b53] text-xs">Vous êtes une entreprise souhaitant travailler avec MENUA CONSULTING. Un champ SIRET / numéro d'identification est requis.</p>
                </div>
              )}
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Nom complet *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Prénom *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>

              {profilType === "entreprise" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nom de l'entreprise *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">SIRET / Numéro d'identification de l'entreprise *</label>
                    <input type="text" placeholder="Ex : 993 749 779 00019" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Email professionnel *</label><input type="email" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Téléphone *</label><input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Fonction actuelle *</label><input type="text" className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#051014] focus:outline-none focus:border-[#c89b53]"/></div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Pays de résidence *</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                    <option value=""></option><option>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option><option>Autre</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Langues parlées *</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                    <option value="">Sélectionnez...</option><option>Français</option><option>Anglais</option><option>Français / Anglais</option><option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Disponibilité *</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                    <option value="">Sélectionnez</option><option>Immédiate</option><option>Sous 1 mois</option><option>Sous 3 mois</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{profilType === "entreprise" ? "Domaine(s) d'expertise proposé(s) *" : "Fonctions / Métiers *"}</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                    <option value="">Sélectionnez une ou plusieurs options</option>
                    <option>Back office</option><option>Middle office</option><option>Contrôle de gestion</option>
                    <option>Conformité / KYC</option><option>Comptabilité</option><option>Reporting / Data</option>
                    <option>Support CGP / Gestion de patrimoine</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Expérience (années) *</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#c89b53] bg-white">
                    <option value="">Sélectionnez</option><option>0-2 ans</option><option>2-5 ans</option><option>5-10 ans</option><option>10+ ans</option>
                  </select>
                </div>
              </div>
              {/* NO FILE UPLOAD — first contact only */}
              <div className="bg-[#051014]/5 border border-[#c89b53]/30 rounded-xl px-5 py-4">
                <p className="text-[#051014] text-xs leading-relaxed">
                  <span className="font-semibold text-[#c89b53]">Aucun document n'est requis à ce stade.</span>{" "}
                  Pour garantir la sécurité et la confidentialité de vos informations, nous ne collectons aucune pièce jointe lors de ce premier contact. Si votre candidature retient notre attention, nous vous contacterons directement pour convenir de la suite du processus.
                </p>
              </div>
              <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-[#c89b53] mt-0.5 shrink-0"/>
                <span>J'accepte que mes données soient traitées conformément à la <Link href="/politique-de-confidentialite" className="text-[#c89b53] underline">politique de confidentialité</Link>. *</span>
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                  {profilType === "entreprise" ? "Envoyer ma proposition" : "Envoyer ma candidature"} <ArrowRight size={16}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA URGENTE */}
      <section className="bg-[#051014] px-8 py-16">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[200px]">
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

      {/* CONTACT MINI */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">Accueil › Nous contacter</div>
            <h2 className="font-serif text-4xl font-bold mb-4">Une question, un besoin ?<br/>Contactez-nous.</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-8">Notre équipe est à votre écoute pour comprendre vos enjeux et vous proposer une réponse adaptée.</p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[{icon:Clock,title:"Réactivité",desc:"Un retour sous 24h ouvrées."},{icon:Users,title:"Écoute",desc:"Un suivi de bout en bout et personnalisé."},{icon:ShieldCheck,title:"Expertise",desc:"Des solutions opérationnelles sur-mesure."}].map((item,i)=>(
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-[#c89b53]"><item.icon size={22} strokeWidth={1.5}/></div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/nous-contacter" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
              Nous contacter <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="md:w-2/5 h-72 rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img src="/nous-contacter-hero.jpg" alt="Contact" className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>
    </main>
  );
}
