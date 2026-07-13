"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function PolitiqueConfidentialite() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("1. Responsable du traitement", "1. Data Controller"),
      content: t(
        "Le responsable du traitement est MENUA CONSULTING, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris. Pour toute question relative à la protection des données personnelles, vous pouvez écrire à l'adresse suivante : contact@menuaconsulting.com.",
        "The data controller is MENUA CONSULTING, headquartered at 92 rue des Pyrénées – 75020 Paris. For any questions regarding personal data protection, you can write to: contact@menuaconsulting.com."
      )
    },
    {
      title: t("2. Données collectées", "2. Data Collected"),
      content: t(
        "Les données collectées via le site sont celles que vous communiquez volontairement dans les formulaires de contact et de recrutement. Elles peuvent inclure notamment : nom, société, fonction, adresse email, numéro de téléphone, type de besoin, niveau d'urgence, message, ainsi que les informations contenues dans une candidature et les documents transmis à cette occasion.",
        "The data collected via the site is what you voluntarily provide in the contact and recruitment forms. It may include: name, company, position, email address, phone number, type of need, urgency level, message, as well as information contained in an application and the documents submitted on that occasion."
      )
    },
    {
      title: t("3. Finalités des traitements", "3. Purposes of Processing"),
      content: t(
        "Ces données sont utilisées pour répondre à vos demandes de contact, analyser votre besoin, traiter les candidatures reçues, organiser le suivi des échanges et, le cas échéant, poursuivre un échange professionnel en lien avec votre demande.",
        "This data is used to respond to your contact requests, analyze your need, process received applications, organize the follow-up of exchanges, and, if applicable, continue a professional exchange related to your request."
      )
    },
    {
      title: t("4. Base légale", "4. Legal Basis"),
      content: t(
        "Les traitements mis en œuvre reposent sur l'intérêt légitime de MENUA CONSULTING à répondre aux sollicitations reçues et à gérer ses échanges professionnels, ainsi que, lorsque cela est nécessaire, sur votre consentement.",
        "The processing implemented is based on the legitimate interest of MENUA CONSULTING in responding to received requests and managing its professional exchanges, as well as, when necessary, on your consent."
      )
    },
    {
      title: t("5. Destinataires des données", "5. Data Recipients"),
      content: t(
        "Les données sont destinées exclusivement à MENUA CONSULTING et, lorsque cela est nécessaire, à ses prestataires techniques habilités, notamment pour l'hébergement du site, la gestion technique des formulaires ou l'acheminement sécurisé des messages.",
        "The data is intended exclusively for MENUA CONSULTING and, when necessary, for its authorized technical service providers, particularly for website hosting, technical form management, or secure message routing."
      )
    },
    {
      title: t("6. Durée de conservation", "6. Retention Period"),
      content: t(
        "Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au traitement de la demande et au suivi des échanges. Le cas échéant, elles peuvent être conservées pendant une durée maximale de 3 ans à compter du dernier échange.\n\nLes données relatives aux candidatures peuvent être conservées pendant la durée du processus de recrutement. Lorsqu'un candidat n'est pas retenu, son dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de sa part.\n\nAu-delà, les données sont supprimées ou archivées conformément aux obligations légales applicables.",
        "Data from the contact form is kept for the time necessary to process the request and follow up on exchanges. If applicable, it may be kept for a maximum of 3 years from the last exchange.\n\nData relating to applications may be kept for the duration of the recruitment process. When a candidate is not selected, their file may be kept for up to 2 years after the last contact, unless they object.\n\nBeyond this, the data is deleted or archived in accordance with applicable legal obligations."
      )
    },
    {
      title: t("7. Droits des personnes", "7. Individual Rights"),
      content: t(
        "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition et, lorsque cela est applicable, d'un droit à la portabilité de vos données.\n\nVous pouvez également retirer votre consentement lorsque le traitement repose sur celui-ci.",
        "In accordance with the GDPR and the French Data Protection Act, you have the right of access, rectification, erasure, restriction of processing, objection, and, where applicable, the right to data portability.\n\nYou may also withdraw your consent when the processing is based on it."
      )
    },
    {
      title: t("8. Exercice des droits", "8. Exercising Your Rights"),
      content: t(
        "Pour exercer vos droits ou poser une question relative à vos données personnelles, vous pouvez contacter MENUA CONSULTING à l'adresse suivante : contact@menuaconsulting.com.\n\nSi vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL.",
        "To exercise your rights or ask a question about your personal data, you can contact MENUA CONSULTING at: contact@menuaconsulting.com.\n\nIf you believe, after contacting us, that your rights are not being respected, you can file a complaint with the CNIL (French data protection authority)."
      )
    },
    {
      title: t("9. Sécurité des données", "9. Data Security"),
      content: t(
        "MENUA CONSULTING met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte, l'altération, l'accès non autorisé ou la divulgation non autorisée.",
        "MENUA CONSULTING implements appropriate technical and organizational measures to protect personal data against loss, alteration, unauthorized access, or unauthorized disclosure."
      )
    },
    {
      title: t("10. Cookies et traceurs", "10. Cookies and Trackers"),
      content: t(
        "Le site peut utiliser des cookies ou traceurs nécessaires à son bon fonctionnement. Lorsque des cookies non strictement nécessaires sont utilisés, notamment à des fins de mesure d'audience ou de statistiques, le consentement de l'utilisateur est recueilli conformément à la réglementation applicable.",
        "The site may use cookies or trackers necessary for its proper functioning. When non-strictly necessary cookies are used, particularly for audience measurement or statistical purposes, the user's consent is collected in accordance with applicable regulations."
      )
    },
    {
      title: t("11. Mise à jour", "11. Update"),
      content: t(
        "La présente politique de confidentialité peut être modifiée à tout moment afin de tenir compte des évolutions légales, réglementaires ou techniques du site. La version publiée sur le site est celle en vigueur à la date de consultation.",
        "This privacy policy may be modified at any time to take into account legal, regulatory, or technical changes to the site. The version published on the site is the one in effect at the time of consultation."
      )
    },
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#f5f7fa] pt-32 pb-16">
      <section className="relative w-full mb-20">
        <div className="laplace-container max-w-4xl">
          <p className="animate-fade-in-up stagger-1 text-[#3874ff] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-[#a0aabf]">/</span>
            <span>{t("Politique de confidentialité", "Privacy Policy")}</span>
          </p>
          <h1 className="animate-fade-in-up stagger-1 mb-8 text-[#141824]">
            {t("Politique de confidentialité", "Privacy Policy")}
          </h1>
          <p className="animate-fade-in-up stagger-2 text-[#6e7891] text-[1.1rem] leading-relaxed mb-12">
            {formatBrand(t(
              "MENUA CONSULTING attache une importance particulière à la protection des données personnelles collectées via son site internet. La présente politique de confidentialité a pour objet d'informer les utilisateurs sur les données collectées, les finalités des traitements, les durées de conservation et les droits dont ils disposent.",
              "MENUA CONSULTING attaches particular importance to the protection of personal data collected via its website. This privacy policy aims to inform users about the data collected, the purposes of processing, retention periods, and the rights they have."
            ))}
          </p>

          <div className="animate-fade-in-up stagger-3 space-y-12 text-[#6e7891] text-body leading-relaxed laplace-card p-8 md:p-12">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-[1.2rem] font-bold text-[#141824] mb-4">{section.title}</h2>
                {section.content.split("\n\n").map((para, j) => (
                  <p key={j} className="mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
    </main>
  );
}
