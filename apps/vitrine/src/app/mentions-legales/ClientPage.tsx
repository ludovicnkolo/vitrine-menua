"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#f5f7fa] pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-4xl">
          <p className="  text-[#6e7891] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-[#a0aabf]">/</span>
            <span>{t("Mentions légales", "Legal Notice")}</span>
          </p>
          <h1 className="  mb-4 text-[#141824]">
            {t("Mentions légales", "Legal Notice")}
          </h1>
          <p className="text-red-500 font-bold mb-12">{t("Dernière mise à jour : juin 2026.", "Last update: June 2026.")}</p>

          <div className="  space-y-12 text-[#6e7891] text-body leading-relaxed laplace-card p-8 md:p-12">
            <p className="text-[1.1rem]">
              {formatBrand(t(
                "Le présent site est édité par MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU), au capital social de 15 000 €, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris, immatriculée au Registre du commerce et des sociétés de Paris sous le numéro 993 749 779 R.C.S. Paris.",
                "This site is published by MENUA CONSULTING, a simplified single-shareholder joint-stock company (SASU), with a share capital of €15,000, headquartered at 92 rue des Pyrénées – 75020 Paris, registered with the Paris Trade and Companies Register under number 993 749 779 R.C.S. Paris."
              ))}
            </p>

            <div className="bg-[#141824] rounded-lg p-8 space-y-3">
              <div className="flex items-center gap-4 border-b border-[#31374a] pb-3">
                <span className="text-[#a0aabf] text-xs uppercase tracking-widest w-24">SIREN</span> 
                <span className="text-white font-medium">993 749 779</span>
              </div>
              <div className="flex items-center gap-4 border-b border-[#31374a] py-3">
                <span className="text-[#a0aabf] text-xs uppercase tracking-widest w-24">SIRET</span> 
                <span className="text-white font-medium">993 749 779 00019</span>
              </div>
              <div className="flex items-center gap-4 pt-3">
                <span className="text-[#a0aabf] text-xs uppercase tracking-widest w-24">{t("TVA", "VAT")}</span> 
                <span className="text-white font-medium">FR36993749779</span>
              </div>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Éditeur du site", "Site Publisher")}</h2>
              <p>{formatBrand(t("MENUA CONSULTING", "MENUA CONSULTING"))}<br/>{t("92 rue des Pyrénées – 75020 Paris", "92 rue des Pyrénées – 75020 Paris")}<br/>{t("Email", "Email")} : <a href="mailto:contact@menuaconsulting.com" className="text-[#3874ff] hover:underline">contact@menuaconsulting.com</a><br/>{t("Téléphone", "Phone")} : <a href="tel:+33686877914" className="text-[#3874ff] hover:underline">+33 6 86 87 79 14</a></p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Directrice de la publication", "Publication Director")}</h2>
              <p>{formatBrand(t("Rosette Fouelefack, Présidente de MENUA CONSULTING", "Rosette Fouelefack, President of MENUA CONSULTING"))}</p>
            </div>



            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Cadre d'intervention", "Scope of Intervention")}</h2>
              <p className="mb-4 text-red-500">{formatBrand(t(
                "MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées.",
                "MENUA CONSULTING operates exclusively within the framework of operational outsourcing services, back and middle office support, and the provision of specialized resources."
              ))}</p>
              <p className="mb-4 text-red-500">{formatBrand(t(
                "La société n'exerce aucune activité réglementée en son nom propre et n'intervient ni en qualité de conseiller en investissements financiers, ni en qualité d'intermédiaire en assurance, ni en qualité d'intermédiaire en opérations de banque et services de paiement.",
                "The company does not exercise any regulated activity in its own name and does not act as a financial investment advisor, nor as an insurance intermediary, nor as an intermediary in banking operations and payment services."
              ))}</p>
              <p className="text-red-500">{formatBrand(t(
                "Les prestations sont réalisées dans le respect des procédures, des méthodes et de la supervision des organisations clientes.",
                "Services are performed in compliance with the procedures, methods, and supervision of client organizations."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Absence de conseil", "Absence of Advice")}</h2>
              <p className="mb-4 text-red-500">{t(
                "Les informations publiées sur ce site sont fournies à titre exclusivement informatif.",
                "The information published on this site is provided for informational purposes only."
              )}</p>
              <p className="text-red-500">{t(
                "Elles ne constituent ni une consultation juridique, ni un conseil comptable, ni un conseil fiscal, ni un conseil patrimonial, ni une recommandation financière.",
                "It does not constitute legal consultation, accounting advice, tax advice, wealth advice, or financial recommendation."
              )}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Propriété intellectuelle", "Intellectual Property")}</h2>
              <p className="mb-4">{t(
                "L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images, documents et éléments de structure, est protégé par les dispositions applicables en matière de propriété intellectuelle, sauf mention contraire.",
                "All content on this site, including texts, graphic elements, logos, images, documents, and structural elements, is protected by applicable intellectual property provisions, unless otherwise stated."
              )}</p>
              <p className="mb-4 text-red-500">{formatBrand(t(
                "Les dénominations MENUA CONSULTING, son logo et les éléments distinctifs associés sont protégés.",
                "The names MENUA CONSULTING, its logo, and associated distinctive elements are protected."
              ))}</p>
              <p>{formatBrand(t(
                "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation préalable de MENUA CONSULTING.",
                "Any reproduction, representation, modification, publication, or adaptation, in whole or in part, of the site's elements is prohibited without the prior authorization of MENUA CONSULTING."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Responsabilité", "Liability")}</h2>
              <p className="mb-4 text-red-500">{formatBrand(t(
                "MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble des contenus publiés. MENUA CONSULTING ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site.",
                "MENUA CONSULTING strives to ensure the accuracy and updating of the information published on the site. However, the company cannot guarantee the completeness or absence of errors in all published content. MENUA CONSULTING cannot be held responsible for direct or indirect damages resulting from the use of the site."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Liens externes", "External Links")}</h2>
              <p className="mb-4 text-red-500">{t(
                "Le site peut contenir des liens vers des sites tiers.",
                "The site may contain links to third-party sites."
              )}</p>
              <p className="mb-8 text-red-500">{formatBrand(t(
                "MENUA CONSULTING ne peut être tenue responsable du contenu ou du fonctionnement de ces sites.",
                "MENUA CONSULTING cannot be held responsible for the content or operation of these sites."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Conditions Générales d'Utilisation (CGU)", "General Terms of Use (CGU)")}</h2>
              <p className="mb-8 text-red-500">{formatBrand(t(
                "L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation. Ces conditions peuvent être modifiées ou complétées à tout moment.",
                "The use of the site implies full and complete acceptance of the general terms of use. These terms may be modified or supplemented at any time."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Cookies et traceurs", "Cookies and trackers")}</h2>
              <p className="mb-8 text-red-500">{formatBrand(t(
                "Le site peut utiliser des cookies nécessaires à son bon fonctionnement et à l'analyse de son audience. Pour plus d'informations, veuillez consulter notre Politique de confidentialité.",
                "The site may use cookies necessary for its proper functioning and audience analysis. For more information, please consult our Privacy Policy."
              ))}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4 text-red-500">{t("Crédits", "Credits")}</h2>
              <p className="mb-4 text-red-500">{t(
                "Les photographies, illustrations, icônes et autres éléments graphiques présents sur le site sont la propriété de MENUA CONSULTING ou font l'objet d'une licence d'utilisation. Les marques citées demeurent la propriété de leurs titulaires respectifs.",
                "The photographs, illustrations, icons, and other graphic elements on the site are the property of MENUA CONSULTING or are subject to a user license. The mentioned trademarks remain the property of their respective owners."
              )}</p>
              <p className="mb-8 text-red-500">{t(
                "Les photographies et illustrations sont issues de bases de données libres de droits ou constituent des créations graphiques générées sur mesure pour MENUA CONSULTING.",
                "Photographs and illustrations are sourced from royalty-free databases or are custom-generated graphic creations for MENUA CONSULTING."
              )}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Confidentialité", "Confidentiality")}</h2>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING attache une importance particulière à la confidentialité des informations qui lui sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations professionnelles.",
                "MENUA CONSULTING attaches particular importance to the confidentiality of information transmitted to it in the context of its exchanges, contact requests, applications, or professional relationships."
              ))}</p>
              <p>{formatBrand(t(
                "Les informations communiquées via le site sont destinées exclusivement au traitement des demandes adressées à MENUA CONSULTING, sous réserve des précisions apportées dans la",
                "The information communicated via the site is intended exclusively for the processing of requests addressed to MENUA CONSULTING, subject to the details provided in the"
              ))}{" "}<Link href="/politique-de-confidentialite" className="text-[#3874ff] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Contact", "Contact")}</h2>
              <p>{formatBrand(t(
                "Pour toute question relative au site ou à son contenu, vous pouvez contacter MENUA CONSULTING à l'adresse suivante :",
                "For any questions regarding the site or its content, you can contact MENUA CONSULTING at the following address:"
              ))}{" "}<a href="mailto:contact@menuaconsulting.com" className="text-[#3874ff] hover:underline font-bold">contact@menuaconsulting.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
