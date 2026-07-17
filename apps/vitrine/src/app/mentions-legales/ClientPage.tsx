"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-5xl">
          <p className="  text-[#6e7891] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-[#a0aabf]">/</span>
            <span>{t("Mentions légales", "Legal Notice")}</span>
          </p>
          <h1 className="text-[1.5rem] md:text-[2rem] font-bold uppercase tracking-widest mb-4 text-[#141824]">
            {t("Mentions légales", "Legal Notice")}
          </h1>
          <p className="text-[#6e7891] font-medium mb-12">{t("Dernière mise à jour : juin 2026.", "Last update: June 2026.")}</p>
          <div className="space-y-14 text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
            
            {/* ÉDITEUR DU SITE */}
            <div>
              <p className="mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU) au capital social de 15 000 €.",
                  "MENUA CONSULTING, a simplified single-shareholder joint-stock company (SASU) with a share capital of €15,000."
                ))}<br/>
                {t("Siège social : 92 rue des Pyrénées – 75020 Paris", "Head office: 92 rue des Pyrénées – 75020 Paris")}<br/>
                {t("Immatriculée au Registre du commerce et des sociétés de Paris sous le numéro 993 749 779 R.C.S. Paris.", "Registered with the Paris Trade and Companies Register under number 993 749 779 R.C.S. Paris.")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-[#141824] font-bold block mb-1">SIREN</span>
                  <span className="text-[#6e7891]">993 749 779</span>
                </div>
                <div>
                  <span className="text-[#141824] font-bold block mb-1">SIRET</span>
                  <span className="text-[#6e7891]">993 749 779 00019</span>
                </div>
                <div>
                  <span className="text-[#141824] font-bold block mb-1">{t("TVA Intracommunautaire", "Intra-community VAT")}</span>
                  <span className="text-[#6e7891]">FR36993749779</span>
                </div>
              </div>

              <h3 className="text-[#141824] font-bold text-[0.95rem] uppercase tracking-widest mb-3 mt-8">{t("Contact", "Contact")}</h3>
              <p>
                {t("Email :", "Email:")} <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] hover:underline font-medium">contact@menuaconsulting.com</a><br/>
                {t("Téléphone :", "Phone:")} <a href="tel:+33686877914" className="text-[#141824] hover:underline font-medium">+33 6 86 87 79 14</a>
              </p>
            </div>

            {/* DIRECTEUR DE LA PUBLICATION */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Directrice de la publication", "Publication Director")}</h2>
              <p>{formatBrand(t("Rosette Fouelefack, Présidente de MENUA CONSULTING", "Rosette Fouelefack, President of MENUA CONSULTING"))}</p>
            </div>



            {/* CADRE D'INTERVENTION */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Cadre d'intervention", "Scope of Intervention")}</h2>
              
              <h3 className="text-[#141824] font-bold text-[0.95rem] uppercase tracking-widest mb-3">{t("Statuts Réglementaires", "Regulatory Status")}</h3>
              <p className="mb-4">{formatBrand(t(
                "La société n'exerce aucune activité réglementée en son nom propre. MENUA CONSULTING n'intervient ni en qualité de conseiller en investissements financiers (CIF), ni en qualité d'intermédiaire en assurance, ni en qualité d'intermédiaire en opérations de banque et services de paiement (IOBSP).",
                "The company does not exercise any regulated activity in its own name. MENUA CONSULTING does not act as a financial investment advisor (CIF), nor as an insurance intermediary, nor as an intermediary in banking operations and payment services (IOBSP)."
              ))}</p>
              <p className="mb-4">{t(
                "La société ne procède à aucune détention de fonds, d'effets ou de valeurs pour le compte de tiers.",
                "The company does not hold any funds, securities, or values on behalf of third parties."
              )}</p>
              
              <h3 className="text-[#141824] font-bold text-[0.95rem] uppercase tracking-widest mb-3 mt-8">{t("Nature des prestations", "Nature of services")}</h3>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées.",
                "MENUA CONSULTING operates exclusively within the framework of operational outsourcing services, back and middle office support, and the provision of specialized resources."
              ))}</p>
              <p>{t(
                "Les prestations sont réalisées dans le strict respect des procédures, des méthodes et de la supervision des organisations clientes (banques, cabinets de conseil en gestion de patrimoine, structures réglementées).",
                "Services are performed in strict compliance with the procedures, methods, and supervision of client organizations (banks, wealth management consulting firms, regulated structures)."
              )}</p>
            </div>

            {/* ABSENCE DE CONSEIL */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Absence de conseil", "Absence of Advice")}</h2>
              <p className="mb-4">{t(
                "Les informations publiées sur ce site sont fournies à titre exclusivement informatif.",
                "The information published on this site is provided for informational purposes only."
              )}</p>
              <p>{t(
                "Elles ne constituent ni une consultation juridique, ni un conseil comptable, ni un conseil fiscal, ni un conseil patrimonial personnalisé, ni une recommandation financière.",
                "It does not constitute a legal consultation, accounting advice, tax advice, personalized wealth advice, or financial recommendation."
              )}</p>
            </div>

            {/* PROPRIÉTÉ INTELLECTUELLE */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Propriété intellectuelle", "Intellectual Property")}</h2>
              <p className="mb-4">{t(
                "L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images, documents et éléments de structure, est protégé par les dispositions applicables en matière de propriété intellectuelle, sauf mention contraire.",
                "All content on this site, including texts, graphic elements, logos, images, documents, and structural elements, is protected by applicable intellectual property provisions, unless otherwise stated."
              )}</p>
              <p className="mb-4">{formatBrand(t(
                "Les dénominations MENUA CONSULTING, son logo et les éléments distinctifs associés sont protégés.",
                "The names MENUA CONSULTING, its logo, and associated distinctive elements are protected."
              ))}</p>
              <p>{formatBrand(t(
                "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation préalable expresse de MENUA CONSULTING.",
                "Any reproduction, representation, modification, publication, or adaptation, in whole or in part, of the site's elements is prohibited without the express prior authorization of MENUA CONSULTING."
              ))}</p>
            </div>

            {/* RESPONSABILITÉ */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Responsabilité", "Liability")}</h2>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble des contenus publiés.",
                "MENUA CONSULTING strives to ensure the accuracy and updating of the information published on the site. However, the company cannot guarantee the completeness or absence of errors in all published content."
              ))}</p>
              <p>{formatBrand(t(
                "MENUA CONSULTING ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
                "MENUA CONSULTING cannot be held responsible for direct or indirect damages resulting from the use of the site or the inability to access it."
              ))}</p>
            </div>

            {/* LIENS EXTERNES */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Liens externes", "External Links")}</h2>
              <p className="mb-4">{t(
                "Le site peut contenir des liens vers des sites tiers.",
                "The site may contain links to third-party sites."
              )}</p>
              <p>{formatBrand(t(
                "MENUA CONSULTING ne peut être tenue responsable du contenu, du fonctionnement ou de la politique de confidentialité de ces sites externes.",
                "MENUA CONSULTING cannot be held responsible for the content, operation, or privacy policy of these external sites."
              ))}</p>
            </div>

            {/* CGU */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Conditions Générales d'Utilisation (CGU)", "General Terms of Use (CGU)")}</h2>
              <p>{formatBrand(t(
                "L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation. Ces conditions peuvent être modifiées ou complétées à tout moment par MENUA CONSULTING.",
                "The use of the site implies full and complete acceptance of the general terms of use. These terms may be modified or supplemented at any time by MENUA CONSULTING."
              ))}</p>
            </div>

            {/* COOKIES ET TRACEURS */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Cookies et traceurs", "Cookies and trackers")}</h2>
              <p>{formatBrand(t(
                "Le site peut utiliser des cookies nécessaires à son bon fonctionnement et à l'analyse de son audience. Pour plus d'informations sur la gestion de ces cookies, veuillez consulter notre Politique de confidentialité.",
                "The site may use cookies necessary for its proper functioning and audience analysis. For more information on managing these cookies, please consult our Privacy Policy."
              ))}</p>
            </div>

            {/* CRÉDITS */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Crédits", "Credits")}</h2>
              
              <h3 className="text-[#141824] font-bold text-[0.95rem] uppercase tracking-widest mb-3">{t("Images", "Images")} <span className="font-sans font-medium">&amp;</span> {t("Droits d'auteur", "Copyright")}</h3>
              <p className="mb-4">{formatBrand(t(
                "Les photographies, illustrations, icônes et autres éléments graphiques présents sur le site sont la propriété exclusive de MENUA CONSULTING ou font l'objet d'une licence d'utilisation conforme.",
                "Photographs, illustrations, icons, and other graphic elements on the site are the exclusive property of MENUA CONSULTING or are subject to a compliant user license."
              ))}</p>
              <p className="mb-4">{t(
                "Les marques citées demeurent la propriété de leurs titulaires respectifs.",
                "The mentioned trademarks remain the property of their respective owners."
              )}</p>
              <p>{formatBrand(t(
                "Les photographies et illustrations sont issues de bases de données libres de droits ou constituent des créations graphiques générées sur mesure pour le compte de MENUA CONSULTING.",
                "Photographs and illustrations are sourced from royalty-free databases or are custom-generated graphic creations on behalf of MENUA CONSULTING."
              ))}</p>
            </div>

            {/* CONFIDENTIALITÉ */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Confidentialité", "Confidentiality")}</h2>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING attache une importance stricte à la confidentialité des informations qui lui sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations professionnelles.",
                "MENUA CONSULTING attaches strict importance to the confidentiality of information transmitted to it in the context of its exchanges, contact requests, applications, or professional relationships."
              ))}</p>
              <p>{formatBrand(t(
                "Les informations communiquées via le site sont destinées exclusivement au traitement des demandes adressées à MENUA CONSULTING, sous réserve des précisions apportées dans notre",
                "The information communicated via the site is intended exclusively for the processing of requests addressed to MENUA CONSULTING, subject to the details provided in our"
              ))}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] font-medium hover:underline">{t("Politique de confidentialité", "Privacy Policy")}</Link>.</p>
            </div>

            {/* CONTACT */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Contact", "Contact")}</h2>
              <p>{formatBrand(t(
                "Pour toute question relative au site, à son utilisation ou à son contenu, vous pouvez contacter MENUA CONSULTING à l'adresse suivante :",
                "For any questions regarding the site, its use, or its content, you can contact MENUA CONSULTING at the following address:"
              ))}</p>
              <p className="mt-4">
                <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] font-medium hover:underline">contact@menuaconsulting.com</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
