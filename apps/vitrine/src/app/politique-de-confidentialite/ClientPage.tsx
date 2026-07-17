"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function PolitiqueConfidentialite() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-5xl">
          <p className="  text-[#6e7891] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-[#a0aabf]">/</span>
            <span>{t("Politique de confidentialité", "Privacy Policy")}</span>
          </p>
          
          <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-widest mb-4 text-[#141824]">
            {t("Politique de confidentialité", "Privacy Policy")}
          </h1>
          <p className="text-[#6e7891] font-medium mb-12">{t("Dernière mise à jour : juin 2026.", "Last update: June 2026.")}</p>

          <div className="space-y-14 text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
            
            {/* INTRODUCTION */}
            <div>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING s'engage à respecter la confidentialité et à protéger les données personnelles vous concernant, que vous soyez clients, prospects, candidats ou partenaires. Ces données sont collectées et traitées à l'occasion de nos échanges, demandes de contact ou prestations d'externalisation opérationnelle.",
                "MENUA CONSULTING is committed to respecting confidentiality and protecting your personal data, whether you are clients, prospects, candidates, or partners. This data is collected and processed during our exchanges, contact requests, or operational outsourcing services."
              ))}</p>
              <p>{t(
                "À cet égard, la société respecte les législations européenne et française en matière de protection des données personnelles, principalement le règlement européen UE n°2016/679 dit « RGPD » et la loi n°78-17 dite « Informatique et Libertés ».",
                "In this regard, the company complies with European and French legislation on personal data protection, mainly the European Regulation EU 2016/679 known as the GDPR and the French Data Protection Act."
              )}</p>
            </div>

            {/* RESPONSABLE ET FINALITÉS */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Responsable de traitement et finalités", "Data Controller and Purposes")}</h2>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING agit en qualité de Responsable de traitement au sens de l'article 4 du RGPD pour les données collectées via son site. Les finalités et bases légales des traitements sont les suivantes :",
                "MENUA CONSULTING acts as Data Controller within the meaning of Article 4 of the GDPR for data collected via its site. The purposes and legal bases of processing are as follows:"
              ))}</p>
              
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                  <strong className="text-[#141824]">{t("Gestion des demandes de contact et prospection :", "Management of contact requests and prospecting:")}</strong>{" "}
                  {t("ce traitement est nécessaire aux fins des intérêts légitimes poursuivis par MENUA CONSULTING pour répondre à vos sollicitations (article 6 (f) du RGPD).", "this processing is necessary for the legitimate interests pursued by MENUA CONSULTING to respond to your requests (Article 6 (f) GDPR).")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Gestion des candidatures (Nous rejoindre) :", "Management of applications (Join us):")}</strong>{" "}
                  {t("ce traitement est nécessaire à l'exécution de mesures précontractuelles ou repose sur votre consentement (article 6 (a) et (b) du RGPD).", "this processing is necessary for the performance of pre-contractual measures or is based on your consent (Article 6 (a) and (b) GDPR).")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Gestion de la relation contractuelle d'externalisation :", "Management of the outsourcing contractual relationship:")}</strong>{" "}
                  {t("ce traitement est nécessaire à l'exécution du contrat conclu avec la société (article 6 (b) du RGPD).", "this processing is necessary for the execution of the contract concluded with the company (Article 6 (b) GDPR).")}
                </li>
              </ul>
            </div>

            {/* DONNÉES CONCERNÉES */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Quelles sont les données concernées ?", "What data is collected?")}</h2>
              <p>{t(
                "Les données collectées via le site sont celles que vous communiquez volontairement dans les formulaires de contact et de recrutement. Elles peuvent inclure notamment : vos données d'identification (nom, prénom), vos données professionnelles (société, fonction), vos données de contact (adresse email, numéro de téléphone), ainsi que les détails de votre besoin opérationnel ou les informations contenues dans votre CV et lettre de motivation.",
                "The data collected via the site is what you voluntarily provide in the contact and recruitment forms. It may include: your identification data (last name, first name), your professional data (company, position), your contact data (email address, phone number), as well as details of your operational need or information contained in your resume and cover letter."
              )}</p>
            </div>

            {/* DURÉE DE CONSERVATION */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Quelle est la durée de conservation ?", "What is the retention period?")}</h2>
              <p className="mb-4">{formatBrand(t(
                "MENUA CONSULTING conserve vos données personnelles pour la durée strictement nécessaire à l'accomplissement des finalités pour lesquelles elles sont traitées :",
                "MENUA CONSULTING keeps your personal data for the time strictly necessary to fulfill the purposes for which it is processed:"
              ))}</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-[#141824]">{t("Demandes de contact / Prospects :", "Contact requests / Prospects:")}</strong>{" "}
                  {t("conservation pendant la durée nécessaire au suivi, et jusqu'à 3 ans à compter du dernier contact émanant de votre part.", "retention for the time necessary for follow-up, and up to 3 years from your last contact.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Candidatures :", "Applications:")}</strong>{" "}
                  {t("conservation pendant la durée du processus de recrutement. Si votre candidature n'est pas retenue, le dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de votre part.", "retention for the duration of the recruitment process. If your application is not selected, the file may be kept up to 2 years after the last contact, unless you object.")}
                </li>
                <li>
                  <strong className="text-[#141824]">{t("Clients :", "Clients:")}</strong>{" "}
                  {t("conservation le temps de la relation contractuelle, puis archivage pour une durée de 5 ans à compter de la fin de la mission (délai de prescription légale).", "retention for the duration of the contractual relationship, then archived for a period of 5 years from the end of the mission (legal prescription period).")}
                </li>
              </ul>
            </div>

            {/* DESTINATAIRES */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Qui sont les destinataires de ces données ?", "Who are the recipients of this data?")}</h2>
              <p className="mb-4">{formatBrand(t(
                "Les données sont destinées exclusivement aux services internes de MENUA CONSULTING (direction et équipe de gestion).",
                "The data is intended exclusively for the internal departments of MENUA CONSULTING (management and management team)."
              ))}</p>
              <p className="mb-4">{formatBrand(t(
                "Elles sont également susceptibles d'être transmises à des sous-traitants techniques strictement encadrés (au sens de la réglementation RGPD) pour les besoins exclusifs du fonctionnement du site :",
                "They may also be transmitted to strictly regulated technical subcontractors (within the meaning of the GDPR regulations) for the exclusive operational needs of the site:"
              ))}</p>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>{t("Hébergeurs de serveurs localisés dans l'Union Européenne.", "Server hosting providers located in the European Union.")}</li>
                <li>{t("Outils techniques d'acheminement sécurisé des formulaires.", "Technical tools for secure form routing.")}</li>
              </ul>
              <p>{formatBrand(t(
                "En aucun cas vos données ne feront l'objet d'une transmission, cession ou revente à des organismes extérieurs à des fins de prospection commerciale.",
                "Under no circumstances will your data be transmitted, assigned, or resold to external organizations for commercial prospecting purposes."
              ))}</p>
            </div>

            {/* VOS DROITS RGPD */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Vos droits RGPD", "Your GDPR Rights")}</h2>
              <p className="mb-4">{t(
                "Conformément à la loi n°78-17 du 6 janvier 1978 et au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement ou de limitation du traitement des données à caractère personnel vous concernant. Vous pouvez vous opposer au traitement de vos données ou, le cas échéant, retirer votre consentement à tout moment.",
                "In accordance with the French Data Protection Act and the GDPR, you have the right to access, rectify, erase, or limit the processing of personal data concerning you. You can object to the processing of your data or, where applicable, withdraw your consent at any time."
              )}</p>
              <p className="mb-4">{formatBrand(t(
                "Pour exercer ces droits, vous pouvez vous adresser à MENUA CONSULTING par courrier électronique en indiquant vos nom, prénom et objet de la demande, à l'adresse suivante :",
                "To exercise these rights, you can contact MENUA CONSULTING by email, indicating your name, surname, and the subject of your request, at the following address:"
              ))}</p>
              <p className="mb-6">
                <a href="mailto:contact@menuaconsulting.com" className="text-[#141824] font-medium hover:underline">contact@menuaconsulting.com</a>
              </p>
              <p>{formatBrand(t(
                "Conformément à la loi, si vous estimez après nous avoir contactés que vos droits ne sont pas respectés, vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente en France (la CNIL : https://www.cnil.fr/).",
                "In accordance with the law, if you believe after contacting us that your rights are not respected, you have the right to lodge a complaint with the competent supervisory authority in France (the CNIL: https://www.cnil.fr/)."
              ))}</p>
            </div>

            {/* SÉCURITÉ DES DONNÉES */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Sécurité des données", "Data Security")}</h2>
              <p>{formatBrand(t(
                "MENUA CONSULTING s'engage à prendre les mesures techniques et organisationnelles appropriées afin de préserver la sécurité et la confidentialité de vos données personnelles, et d'empêcher qu'elles ne soient déformées, endommagées, ou que des tiers non autorisés y aient accès.",
                "MENUA CONSULTING is committed to taking appropriate technical and organizational measures to preserve the security and confidentiality of your personal data, and to prevent them from being distorted, damaged, or accessed by unauthorized third parties."
              ))}</p>
            </div>

            {/* GESTION DES COOKIES */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Gestion des cookies", "Cookie Management")}</h2>
              <p>{formatBrand(t(
                "Notre site internet peut utiliser des cookies strictement nécessaires à son bon fonctionnement. Lorsque des cookies non indispensables sont utilisés (notamment à des fins de mesure d'audience ou de statistiques d'utilisation), votre consentement libre et éclairé est systématiquement recueilli au préalable, conformément à la réglementation applicable.",
                "Our website may use cookies strictly necessary for its proper functioning. When non-essential cookies are used (particularly for audience measurement or usage statistics), your free and informed consent is systematically collected beforehand, in accordance with applicable regulations."
              ))}</p>
            </div>

            {/* MODIFICATIONS */}
            <div>
              <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">{t("Mise à jour de la politique", "Policy Update")}</h2>
              <p>{formatBrand(t(
                "La présente Politique de confidentialité est susceptible d'évoluer dans le temps pour tenir compte des évolutions légales, réglementaires ou techniques. La version publiée sur le site est celle en vigueur à la date de votre consultation.",
                "This Privacy Policy is likely to evolve over time to take into account legal, regulatory, or technical developments. The version published on the site is the one in effect on the date of your consultation."
              ))}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
