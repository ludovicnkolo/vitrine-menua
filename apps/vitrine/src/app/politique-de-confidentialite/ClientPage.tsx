"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import SectionBlock from "@/components/SectionBlock";
import LegalPageHeader from "@/components/LegalPageHeader";

export default function PolitiqueConfidentialite() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-5xl">
          <LegalPageHeader 
            title={t("Politique de confidentialité", "Privacy Policy")} 
            lastUpdate={t("Dernière mise à jour : juillet 2026.", "Last update: July 2026.")} 
          />
          <div className="space-y-14 text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
            
            {/* 10.1 RESPONSABLE */}
            <SectionBlock title={t("Responsable", "Controller")}>
              <p>{formatBrand(t(
                "MENUA CONSULTING, SASU située 92 rue des Pyrénées, 75020 Paris, est responsable des traitements réalisés au moyen du site. Contact : contact@menuaconsulting.com.",
                "MENUA CONSULTING, a SASU located at 92 rue des Pyrénées, 75020 Paris, is responsible for the processing carried out by means of the site. Contact: contact@menuaconsulting.com."
              ))}</p>
            </SectionBlock>

            {/* 10.2 DONNÉES, FINALITÉS ET BASES LÉGALES */}
            <SectionBlock title={t("Données, finalités et bases légales", "Data, purposes and legal bases")}>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong className="text-[#141824]">{t("Demandes de contact :", "Contact requests:")}</strong>{" "}
                  {t("identité, société, coordonnées, besoin et éventuel PDF — réponse et suivi de la demande, sur le fondement de l’intérêt légitime et, lorsque nécessaire, de mesures précontractuelles.", "identity, company, contact details, need and potential PDF — response and follow-up to the request, based on legitimate interest and, when necessary, pre-contractual measures.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Candidatures :", "Applications:")}</strong>{" "}
                  {t("identité, coordonnées, compétences, langues, disponibilité, localisation et liens professionnels — étude du profil et gestion d’un vivier, dans le cadre de mesures précontractuelles et de l’intérêt légitime ; accord lorsque requis pour une conservation prolongée.", "identity, contact details, skills, languages, availability, location and professional links — profile study and talent pool management, as part of pre-contractual measures and legitimate interest; consent when required for prolonged retention.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Relations clients :", "Client relations:")}</strong>{" "}
                  {t("contacts professionnels, échanges, données contractuelles et opérationnelles — exécution du contrat, suivi de la relation et respect des obligations légales.", "professional contacts, exchanges, contractual and operational data — contract execution, relationship monitoring and compliance with legal obligations.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Sécurité :", "Security:")}</strong>{" "}
                  {t("journaux techniques, connexions et actions — sécurisation des systèmes, prévention des abus et traçabilité.", "technical logs, connections and actions — system securing, abuse prevention and traceability.")}
                </li>
              </ul>
            </SectionBlock>

            {/* 10.3 CHAMPS OBLIGATOIRES */}
            <SectionBlock title={t("Champs obligatoires", "Mandatory fields")}>
              <p>{formatBrand(t(
                "Les champs obligatoires sont signalés par un astérisque. Sans ces informations, MENUA CONSULTING peut ne pas être en mesure de répondre à la demande ou d’étudier le profil. Les autres informations sont facultatives.",
                "Mandatory fields are indicated by an asterisk. Without this information, MENUA CONSULTING may not be able to respond to the request or study the profile. Other information is optional."
              ))}</p>
            </SectionBlock>

            {/* 10.4 DESTINATAIRES */}
            <SectionBlock title={t("Destinataires", "Recipients")}>
              <p className="mb-4">{formatBrand(t(
                "Les données sont accessibles aux personnes habilitées de MENUA CONSULTING, dans la limite de leurs fonctions et des missions attribuées. Elles peuvent être traitées par des prestataires techniques encadrés contractuellement pour l’hébergement, la maintenance, la messagerie, la sécurité et le fonctionnement du CRM.",
                "The data is accessible to authorized persons of MENUA CONSULTING, within the limits of their functions and assigned missions. It may be processed by technical service providers contractually bound for hosting, maintenance, messaging, security and CRM operations."
              ))}</p>
              <p>{formatBrand(t(
                "MENUA CONSULTING ne vend ni ne cède les données à des tiers à des fins de prospection commerciale.",
                "MENUA CONSULTING does not sell or transfer data to third parties for commercial prospecting purposes."
              ))}</p>
            </SectionBlock>

            {/* 10.5 ACCÈS HORS ESPACE ÉCONOMIQUE EUROPÉEN */}
            <SectionBlock title={t("Accès hors Espace économique européen", "Access outside the European Economic Area")}>
              <p className="mb-4">{formatBrand(t(
                "Dans le cadre de certaines missions, MENUA CONSULTING peut mobiliser des collaborateurs, partenaires ou prestataires situés en France, dans l’Union européenne ou dans des pays situés hors de l’Espace économique européen, notamment au Cameroun et, le cas échéant, dans d’autres pays africains. Lorsque cela est strictement nécessaire à l’exécution de la mission, certaines données peuvent leur être rendues accessibles dans la seule limite du périmètre qui leur est confié et sous la supervision de MENUA CONSULTING.",
                "As part of certain missions, MENUA CONSULTING may mobilize employees, partners or service providers located in France, in the European Union or in countries outside the European Economic Area, particularly in Cameroon and, where appropriate, in other African countries. When strictly necessary for the execution of the mission, certain data may be made accessible to them solely within the limits of the scope entrusted to them and under the supervision of MENUA CONSULTING."
              ))}</p>
              <p className="mb-4">{formatBrand(t(
                "Avant tout accès depuis un pays situé hors de l’Espace économique européen, MENUA CONSULTING met en place les garanties contractuelles et les mesures de sécurité requises par la réglementation applicable. Les accès sont individualisés, limités aux seules données nécessaires, traçables, contrôlés et révocables. Ils sont encadrés par des engagements de confidentialité et, lorsque cela est requis, par les clauses contractuelles types de la Commission européenne ainsi que par les mesures complémentaires appropriées.",
                "Before any access from a country outside the European Economic Area, MENUA CONSULTING implements the contractual guarantees and security measures required by applicable regulations. Access is individualized, limited to strictly necessary data, traceable, controlled and revocable. They are governed by confidentiality commitments and, when required, by standard contractual clauses of the European Commission as well as appropriate complementary measures."
              ))}</p>
              <p>{t(
                "Aucune donnée n’est rendue accessible depuis un pays tiers en l’absence de nécessité opérationnelle liée à la mission et tant que le cadre contractuel, organisationnel et technique applicable n’a pas été validé.",
                "No data is made accessible from a third country in the absence of an operational need related to the mission and as long as the applicable contractual, organizational and technical framework has not been validated."
              )}</p>
            </SectionBlock>

            {/* 10.6 CONSERVATION */}
            <SectionBlock title={t("Conservation", "Retention")}>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong className="text-[#141824]">{t("Demandes de contact et prospects :", "Contact requests and prospects:")}</strong>{" "}
                  {t("durée du suivi, puis jusqu’à trois ans à compter du dernier contact actif.", "duration of follow-up, then up to three years from the last active contact.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Candidatures :", "Applications:")}</strong>{" "}
                  {t("durée du processus, puis conservation éventuelle jusqu’à deux ans après le dernier contact, sous réserve de l’information de la personne et de son droit d’opposition.", "duration of the process, then possible retention for up to two years after the last contact, subject to informing the individual and their right to object.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Données contractuelles :", "Contractual data:")}</strong>{" "}
                  {t("durée de la relation, puis archivage selon les obligations légales et les délais applicables.", "duration of the relationship, then archived according to legal obligations and applicable timeframes.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Journaux de sécurité :", "Security logs:")}</strong>{" "}
                  {t("durée proportionnée aux besoins de sécurité et de traçabilité définis dans la documentation interne.", "duration proportionate to the security and traceability needs defined in internal documentation.")}
                </li>
              </ul>
            </SectionBlock>

            {/* 10.7 SÉCURITÉ */}
            <SectionBlock title={t("Sécurité", "Security")}>
              <p>{formatBrand(t(
                "MENUA CONSULTING met en œuvre des mesures destinées à préserver la confidentialité, l’intégrité, la disponibilité et la traçabilité des données, notamment la gestion des habilitations, l’authentification renforcée, la journalisation, les sauvegardes, le chiffrement des communications et la limitation des accès selon les missions.",
                "MENUA CONSULTING implements measures intended to preserve the confidentiality, integrity, availability and traceability of data, in particular authorization management, strong authentication, logging, backups, communications encryption and access limitation according to missions."
              ))}</p>
            </SectionBlock>

            {/* 10.8 DROITS */}
            <SectionBlock title={t("Droits", "Rights")}>
              <p className="mb-4">{t(
                "Vous pouvez, selon les conditions prévues par la réglementation, demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données, et vous opposer à certains traitements. Lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment.",
                "You can, under the conditions provided by regulations, request access to, rectification, erasure, limitation or portability of your data, and object to certain processing. When processing is based on your consent, you can withdraw it at any time."
              )}</p>
              <p className="mb-4">{t("Pour exercer vos droits :", "To exercise your rights:")} <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] hover:underline font-medium">contact@menuaconsulting.com</a>.</p>
              <p>{t(
                "Vous pouvez également saisir la CNIL si vous estimez que vos droits ne sont pas respectés.",
                "You can also contact the CNIL if you consider that your rights are not respected."
              )}</p>
            </SectionBlock>

            {/* 10.9 COOKIES ET MISE À JOUR */}
            <SectionBlock title={t("Cookies et mise à jour", "Cookies and updates")}>
              <p className="mb-4">{t(
                "Tout traceur non essentiel est soumis au consentement préalable lorsque celui-ci est requis. Le choix peut être modifié ou retiré à tout moment aussi simplement qu’il a été donné.",
                "Any non-essential tracker is subject to prior consent when required. The choice can be modified or withdrawn at any time as easily as it was given."
              )}</p>
              <p>{t(
                "La présente politique peut être mise à jour pour tenir compte des évolutions légales, organisationnelles ou techniques.",
                "This policy may be updated to reflect legal, organizational or technical developments."
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
