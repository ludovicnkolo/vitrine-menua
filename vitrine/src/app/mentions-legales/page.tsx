"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#f5f7fa] pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-4xl">
          <p className="animate-fade-in-up stagger-1 text-[#3874ff] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-[#a0aabf]">/</span>
            <span>{t("Mentions légales", "Legal Notice")}</span>
          </p>
          <h1 className="animate-fade-in-up stagger-1 mb-12 text-[#141824]">
            {t("Mentions légales", "Legal Notice")}
          </h1>

          <div className="animate-fade-in-up stagger-2 space-y-12 text-[#6e7891] text-body leading-relaxed laplace-card p-8 md:p-12">
            <p className="text-[1.1rem]">
              {t(
                "Le présent site est édité par MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU), au capital social de 15 000 €, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris, immatriculée au Registre du commerce et des sociétés de Paris sous le numéro 993 749 779 R.C.S. Paris.",
                "This site is published by MENUA CONSULTING, a simplified single-shareholder joint-stock company (SASU), with a share capital of €15,000, headquartered at 92 rue des Pyrénées – 75020 Paris, registered with the Paris Trade and Companies Register under number 993 749 779 R.C.S. Paris."
              )}
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
              <p>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris<br/>Email : <a href="mailto:contact@menuaconsulting.com" className="text-[#3874ff] hover:underline">contact@menuaconsulting.com</a><br/>{t("Téléphone", "Phone")} : <a href="tel:+33686877914" className="text-[#3874ff] hover:underline">+33 6 86 87 79 14</a></p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Directrice de la publication", "Publication Director")}</h2>
              <p>{t("Rosette Fouelefack, Présidente de MENUA CONSULTING", "Rosette Fouelefack, President of MENUA CONSULTING")}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Hébergement", "Hosting")}</h2>
              <p className="italic text-[#a0aabf]">{t("Le site est hébergé par : (à compléter ultérieurement)", "The site is hosted by: (to be completed later)")}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Propriété intellectuelle", "Intellectual Property")}</h2>
              <p className="mb-4">{t(
                "L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images, documents et éléments de structure, est protégé par les dispositions applicables en matière de propriété intellectuelle, sauf mention contraire.",
                "All content on this site, including texts, graphic elements, logos, images, documents, and structural elements, is protected by applicable intellectual property provisions, unless otherwise stated."
              )}</p>
              <p>{t(
                "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation préalable de MENUA CONSULTING.",
                "Any reproduction, representation, modification, publication, or adaptation, in whole or in part, of the site's elements is prohibited without the prior authorization of MENUA CONSULTING."
              )}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Responsabilité", "Liability")}</h2>
              <p className="mb-4">{t(
                "MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble des contenus publiés.",
                "MENUA CONSULTING strives to ensure the accuracy and updating of the information published on the site. However, the company cannot guarantee the completeness or absence of errors in all published content."
              )}</p>
              <p className="mb-4">{t(
                "Les informations présentes sur le site sont fournies à titre informatif. Elles ne constituent ni une prestation réglementée exercée en son nom propre, ni un conseil en investissement, ni un conseil patrimonial personnalisé, ni une recommandation financière.",
                "The information on the site is provided for informational purposes only. It does not constitute a regulated service performed in its own name, investment advice, personalized wealth advice, or financial recommendation."
              )}</p>
              <p>{t(
                "MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées, dans le respect du cadre, des procédures et de la supervision de ses clients.",
                "MENUA CONSULTING operates exclusively within the framework of operational outsourcing services, back and middle office support, and the provision of specialized resources, in compliance with the framework, procedures, and supervision of its clients."
              )}</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Confidentialité", "Confidentiality")}</h2>
              <p className="mb-4">{t(
                "MENUA CONSULTING attache une importance particulière à la confidentialité des informations qui lui sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations professionnelles.",
                "MENUA CONSULTING attaches particular importance to the confidentiality of information transmitted to it in the context of its exchanges, contact requests, applications, or professional relationships."
              )}</p>
              <p>{t(
                "Les informations communiquées via le site sont destinées exclusivement au traitement des demandes adressées à MENUA CONSULTING, sous réserve des précisions apportées dans la",
                "The information communicated via the site is intended exclusively for the processing of requests addressed to MENUA CONSULTING, subject to the details provided in the"
              )}{" "}<Link href="/politique-de-confidentialite" className="text-[#3874ff] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.</p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{t("Contact", "Contact")}</h2>
              <p>{t(
                "Pour toute question relative au site ou à son contenu, vous pouvez contacter MENUA CONSULTING à l'adresse suivante :",
                "For any questions regarding the site or its content, you can contact MENUA CONSULTING at the following address:"
              )}{" "}<a href="mailto:contact@menuaconsulting.com" className="text-[#3874ff] hover:underline font-bold">contact@menuaconsulting.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
