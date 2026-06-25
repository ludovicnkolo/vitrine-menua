import Link from "next/link";

export default function PolitiqueConfidentialite() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans pt-24">
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Politique de confidentialité</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-4">Politique de confidentialité</h1>
          <p className="text-gray-400 text-sm mb-12 leading-relaxed">
            MENUA CONSULTING attache une importance particulière à la protection des données personnelles collectées via son site internet. La présente politique de confidentialité a pour objet d'informer les utilisateurs sur les données collectées, les finalités des traitements, les durées de conservation et les droits dont ils disposent.
          </p>

          <div className="space-y-10 text-gray-300 text-sm leading-relaxed">
            {[
              {
                title: "1. Responsable du traitement",
                content: "Le responsable du traitement est MENUA CONSULTING, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris. Pour toute question relative à la protection des données personnelles, vous pouvez écrire à l'adresse suivante : contact@menuaconsulting.com."
              },
              {
                title: "2. Données collectées",
                content: "Les données collectées via le site sont celles que vous communiquez volontairement dans les formulaires de contact et de recrutement. Elles peuvent inclure notamment : nom, société, fonction, adresse email, numéro de téléphone, type de besoin, niveau d'urgence, message, ainsi que les informations contenues dans une candidature et les documents transmis à cette occasion."
              },
              {
                title: "3. Finalités des traitements",
                content: "Ces données sont utilisées pour répondre à vos demandes de contact, analyser votre besoin, traiter les candidatures reçues, organiser le suivi des échanges et, le cas échéant, poursuivre un échange professionnel en lien avec votre demande."
              },
              {
                title: "4. Base légale",
                content: "Les traitements mis en œuvre reposent sur l'intérêt légitime de MENUA CONSULTING à répondre aux sollicitations reçues et à gérer ses échanges professionnels, ainsi que, lorsque cela est nécessaire, sur votre consentement."
              },
              {
                title: "5. Destinataires des données",
                content: "Les données sont destinées exclusivement à MENUA CONSULTING et, lorsque cela est nécessaire, à ses prestataires techniques habilités, notamment pour l'hébergement du site, la gestion technique des formulaires ou l'acheminement sécurisé des messages."
              },
              {
                title: "6. Durée de conservation",
                content: "Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au traitement de la demande et au suivi des échanges. Le cas échéant, elles peuvent être conservées pendant une durée maximale de 3 ans à compter du dernier échange.\n\nLes données relatives aux candidatures peuvent être conservées pendant la durée du processus de recrutement. Lorsqu'un candidat n'est pas retenu, son dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de sa part.\n\nAu-delà, les données sont supprimées ou archivées conformément aux obligations légales applicables."
              },
              {
                title: "7. Droits des personnes",
                content: "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition et, lorsque cela est applicable, d'un droit à la portabilité de vos données.\n\nVous pouvez également retirer votre consentement lorsque le traitement repose sur celui-ci."
              },
              {
                title: "8. Exercice des droits",
                content: "Pour exercer vos droits ou poser une question relative à vos données personnelles, vous pouvez contacter MENUA CONSULTING à l'adresse suivante : contact@menuaconsulting.com.\n\nSi vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL."
              },
              {
                title: "9. Sécurité des données",
                content: "MENUA CONSULTING met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte, l'altération, l'accès non autorisé ou la divulgation non autorisée."
              },
              {
                title: "10. Cookies et traceurs",
                content: "Le site peut utiliser des cookies ou traceurs nécessaires à son bon fonctionnement. Lorsque des cookies non strictement nécessaires sont utilisés, notamment à des fins de mesure d'audience ou de statistiques, le consentement de l'utilisateur est recueilli conformément à la réglementation applicable."
              },
              {
                title: "11. Mise à jour",
                content: "La présente politique de confidentialité peut être modifiée à tout moment afin de tenir compte des évolutions légales, réglementaires ou techniques du site. La version publiée sur le site est celle en vigueur à la date de consultation."
              },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="font-serif text-xl font-bold text-white mb-4">{section.title}</h2>
                {section.content.split("\n\n").map((para, j) => (
                  <p key={j} className="mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
