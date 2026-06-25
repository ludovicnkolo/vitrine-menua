"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function MentionsLegales() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans pt-24">
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil","Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Mentions légales","Legal Notice")}</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-12">{t("Mentions légales","Legal Notice")}</h1>

          <div className="space-y-10 text-gray-300 text-sm leading-relaxed">
            <p>{t(
              "Le présent site est édité par MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU), au capital social de 15 000 €, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris, immatriculée au Registre du commerce et des sociétés de Paris sous le numéro 993 749 779 R.C.S. Paris.",
              "This site is published by MENUA CONSULTING, a simplified single-shareholder joint-stock company (SASU), with a share capital of €15,000, headquartered at 92 rue des Pyrénées – 75020 Paris, registered with the Paris Trade and Companies Register under number 993 749 779 R.C.S. Paris."
            )}</p>
            <div className="bg-[#0d222b] rounded-xl p-8 space-y-2">
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">SIREN :</span> <span className="text-white font-medium">993 749 779</span></div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">SIRET :</span> <span className="text-white font-medium">993 749 779 00019</span></div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">{t("TVA intracommunautaire","VAT number")} :</span> <span className="text-white font-medium">FR36993749779</span></div>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Éditeur du site","Site Publisher")}</h2>
              <p>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris<br/>Email : <a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a><br/>{t("Téléphone","Phone")} : <a href="tel:+33686877914" className="text-[#c89b53] hover:underline">+33 6 86 87 79 14</a></p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Directrice de la publication","Publication Director")}</h2>
              <p>{t("Rosette Fouelefack, Présidente de MENUA CONSULTING","Rosette Fouelefack, President of MENUA CONSULTING")}</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Hébergement","Hosting")}</h2>
              <p className="text-gray-500 italic">{t("Le site est hébergé par : (à compléter ultérieurement)","The site is hosted by: (to be completed later)")}</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Propriété intellectuelle","Intellectual Property")}</h2>
              <p>{t(
                "L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images, documents et éléments de structure, est protégé par les dispositions applicables en matière de propriété intellectuelle, sauf mention contraire.",
                "All content on this site, including texts, graphic elements, logos, images, documents, and structural elements, is protected by applicable intellectual property provisions, unless otherwise stated."
              )}</p>
              <p className="mt-3">{t(
                "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation préalable de MENUA CONSULTING.",
                "Any reproduction, representation, modification, publication, or adaptation, in whole or in part, of the site's elements is prohibited without the prior authorization of MENUA CONSULTING."
              )}</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Responsabilité","Liability")}</h2>
              <p>{t(
                "MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble des contenus publiés.",
                "MENUA CONSULTING strives to ensure the accuracy and updating of the information published on the site. However, the company cannot guarantee the completeness or absence of errors in all published content."
              )}</p>
              <p className="mt-3">{t(
                "Les informations présentes sur le site sont fournies à titre informatif. Elles ne constituent ni une prestation réglementée exercée en son nom propre, ni un conseil en investissement, ni un conseil patrimonial personnalisé, ni une recommandation financière.",
                "The information on the site is provided for informational purposes only. It does not constitute a regulated service performed in its own name, investment advice, personalized wealth advice, or financial recommendation."
              )}</p>
              <p className="mt-3">{t(
                "MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées, dans le respect du cadre, des procédures et de la supervision de ses clients.",
                "MENUA CONSULTING operates exclusively within the framework of operational outsourcing services, back and middle office support, and the provision of specialized resources, in compliance with the framework, procedures, and supervision of its clients."
              )}</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Confidentialité","Confidentiality")}</h2>
              <p>{t(
                "MENUA CONSULTING attache une importance particulière à la confidentialité des informations qui lui sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations professionnelles.",
                "MENUA CONSULTING attaches particular importance to the confidentiality of information transmitted to it in the context of its exchanges, contact requests, applications, or professional relationships."
              )}</p>
              <p className="mt-3">{t(
                "Les informations communiquées via le site sont destinées exclusivement au traitement des demandes adressées à MENUA CONSULTING, sous réserve des précisions apportées dans la",
                "The information communicated via the site is intended exclusively for the processing of requests addressed to MENUA CONSULTING, subject to the details provided in the"
              )}{" "}<Link href="/politique-de-confidentialite" className="text-[#c89b53] hover:underline">{t("Politique de confidentialité","Privacy Policy")}</Link>.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">{t("Contact","Contact")}</h2>
              <p>{t(
                "Pour toute question relative au site ou à son contenu, vous pouvez contacter MENUA CONSULTING à l'adresse suivante :",
                "For any questions regarding the site or its content, you can contact MENUA CONSULTING at the following address:"
              )}{" "}<a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
