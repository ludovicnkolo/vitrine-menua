"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import SectionBlock from "@/components/SectionBlock";
import LegalPageHeader from "@/components/LegalPageHeader";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-5xl">
          <LegalPageHeader 
            title={t("Mentions légales", "Legal Notice")} 
            lastUpdate={t("Dernière mise à jour : juillet 2026.", "Last update: July 2026.")} 
          />
          <div className="space-y-14 text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
            
            {/* 9.1 ÉDITEUR */}
            <SectionBlock title={t("Éditeur", "Publisher")}>
              <p className="mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU) au capital de 15 000 €, siège social : 92 rue des Pyrénées, 75020 Paris. Immatriculation : 993 749 779 R.C.S. Paris.",
                  "MENUA CONSULTING, a simplified single-shareholder joint-stock company (SASU) with a share capital of €15,000, head office: 92 rue des Pyrénées, 75020 Paris. Registration: 993 749 779 R.C.S. Paris."
                ))}
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
                  <span className="text-[#141824] font-bold block mb-1">{t("Numéro de TVA intracommunautaire", "Intra-community VAT number")}</span>
                  <span className="text-[#6e7891]">FR36 993 749 779</span>
                </div>
              </div>

              <p>
                {t("Contact :", "Contact:")} <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] hover:underline font-medium">contact@menuaconsulting.com</a> — <a href="tel:+33686877914" className="text-[#141824] hover:underline font-medium">+33 6 86 87 79 14</a>
              </p>
            </SectionBlock>

            {/* 9.2 DIRECTRICE DE LA PUBLICATION */}
            <SectionBlock title={t("Directrice de la publication", "Publication Director")}>
              <p>{formatBrand(t("Rosette Fouelefack, Présidente de MENUA CONSULTING.", "Rosette Fouelefack, President of MENUA CONSULTING."))}</p>
            </SectionBlock>

            {/* 9.3 HÉBERGEUR */}
            <SectionBlock title={t("Hébergeur", "Hosting")}>
              <p>
                OVH SAS<br/>
                2 rue Kellermann<br/>
                59100 Roubaix — France<br/>
                {t("Téléphone : 1007 depuis la France / +33 9 72 10 10 07 depuis l’étranger.", "Phone: 1007 from France / +33 9 72 10 10 07 from abroad.")}
              </p>
            </SectionBlock>

            {/* 9.4 CADRE D'INTERVENTION */}
            <SectionBlock title={t("Cadre d’intervention", "Scope of Intervention")}>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING n’exerce aucune activité réglementée en son nom propre. La société n’intervient ni en qualité de conseiller en investissements financiers, ni en qualité d’intermédiaire en assurance, ni en qualité d’intermédiaire en opérations de banque et en services de paiement. Elle ne détient aucun fonds, effet ou valeur pour le compte de tiers.",
                "MENUA CONSULTING does not exercise any regulated activity in its own name. The company does not act as a financial investment advisor, nor as an insurance intermediary, nor as an intermediary in banking operations and payment services. It does not hold any funds, securities, or values on behalf of third parties."
              ))}</p>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING réalise des prestations d’externalisation opérationnelle et de support back et middle office au moyen de ressources opérationnelles spécialisées. Les prestations sont exécutées selon le périmètre contractuel, les procédures, les outils, les habilitations et les circuits de validation définis avec le client.",
                "MENUA CONSULTING provides operational outsourcing and back and middle-office support services using specialized operational resources. Services are performed in accordance with the contractual scope, procedures, systems, authorizations and approval workflows agreed with the client."
              ))}</p>
              <p>{t(
                "Lorsque le périmètre concerne une activité réglementée, comptable, juridique, fiscale, patrimoniale ou financière, les conseils, décisions, arbitrages, validations et actes réservés restent sous la responsabilité du client ou de ses professionnels habilités.",
                "When the scope relates to regulated accounting, legal, tax, wealth management or financial activities, all advice, discretionary decisions, investment switch/reallocation decisions, final approvals and reserved statutory acts remain the sole responsibility of the client or its authorized professionals."
              )}</p>
            </SectionBlock>

            {/* 9.5 INFORMATIONS, PROPRIÉTÉ INTELLECTUELLE ET RESPONSABILITÉ */}
            <SectionBlock title={t("Informations, propriété intellectuelle et responsabilité", "Information, intellectual property and liability")}>
              <p className="mb-4">{formatBrand(t(
                "Les informations publiées sont fournies à titre informatif et ne constituent ni une consultation juridique, ni un conseil comptable ou fiscal, ni un conseil patrimonial personnalisé, ni une recommandation financière. Sauf mention contraire, les textes, éléments graphiques, logos, images et documents du site sont protégés. Toute reproduction ou adaptation nécessite l’autorisation écrite préalable de MENUA CONSULTING.",
                "The information published is provided for informational purposes and does not constitute a legal consultation, accounting or tax advice, personalized wealth advice, or financial recommendation. Unless otherwise stated, the texts, graphic elements, logos, images and documents of the site are protected. Any reproduction or adaptation requires the prior written authorization of MENUA CONSULTING."
              ))}</p>
              <p>{formatBrand(t(
                "MENUA CONSULTING s’efforce d’assurer l’exactitude et la mise à jour des informations diffusées, sans pouvoir en garantir l’exhaustivité permanente. Les liens vers des sites tiers sont fournis à titre informatif ; MENUA CONSULTING n’en maîtrise ni le contenu ni les pratiques de confidentialité.",
                "MENUA CONSULTING strives to ensure the accuracy and updating of the information disseminated, without being able to guarantee its permanent completeness. Links to third-party sites are provided for informational purposes; MENUA CONSULTING does not control their content or privacy practices."
              ))}</p>
            </SectionBlock>

            {/* 9.6 COOKIES ET CONTACT */}
            <SectionBlock title={t("Cookies et contact", "Cookies and contact")}>
              <p>{t(
                "Le site peut utiliser des traceurs strictement nécessaires à son fonctionnement. Tout traceur non essentiel n’est déposé qu’après recueil du consentement lorsque celui-ci est requis. Pour toute question : contact@menuaconsulting.com.",
                "The site may use trackers strictly necessary for its operation. Any non-essential tracker is deposited only after collecting consent when required. For any questions: contact@menuaconsulting.com."
              )}</p>
            </SectionBlock>

          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
