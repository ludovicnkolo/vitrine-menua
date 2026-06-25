import Link from "next/link";

export default function MentionsLegales() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans pt-24">
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Mentions légales</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-12">Mentions légales</h1>

          <div className="space-y-10 text-gray-300 text-sm leading-relaxed">
            <p>Le présent site est édité par MENUA CONSULTING, société par actions simplifiée unipersonnelle (SASU), au capital social de 15 000 €, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris, immatriculée au Registre du commerce et des sociétés de Paris sous le numéro 993 749 779 R.C.S. Paris.</p>
            <div className="bg-[#0d222b] rounded-xl p-8 space-y-2">
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">SIREN :</span> <span className="text-white font-medium">993 749 779</span></div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">SIRET :</span> <span className="text-white font-medium">993 749 779 00019</span></div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider">TVA intracommunautaire :</span> <span className="text-white font-medium">FR36993749779</span></div>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Éditeur du site</h2>
              <p>MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris<br/>Email : <a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a><br/>Téléphone : <a href="tel:+33686877914" className="text-[#c89b53] hover:underline">+33 6 86 87 79 14</a></p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Directrice de la publication</h2>
              <p>Rosette Fouelefack, Présidente de MENUA CONSULTING</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Hébergement</h2>
              <p className="text-gray-500 italic">Le site est hébergé par : (à compléter ultérieurement)</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Propriété intellectuelle</h2>
              <p>L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images, documents et éléments de structure, est protégé par les dispositions applicables en matière de propriété intellectuelle, sauf mention contraire.</p>
              <p className="mt-3">Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation préalable de MENUA CONSULTING.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Responsabilité</h2>
              <p>MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble des contenus publiés.</p>
              <p className="mt-3">Les informations présentes sur le site sont fournies à titre informatif. Elles ne constituent ni une prestation réglementée exercée en son nom propre, ni un conseil en investissement, ni un conseil patrimonial personnalisé, ni une recommandation financière.</p>
              <p className="mt-3">MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées, dans le respect du cadre, des procédures et de la supervision de ses clients.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Confidentialité</h2>
              <p>MENUA CONSULTING attache une importance particulière à la confidentialité des informations qui lui sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations professionnelles.</p>
              <p className="mt-3">Les informations communiquées via le site sont destinées exclusivement au traitement des demandes adressées à MENUA CONSULTING, sous réserve des précisions apportées dans la <Link href="/politique-de-confidentialite" className="text-[#c89b53] hover:underline">Politique de confidentialité</Link>.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-white mb-4">Contact</h2>
              <p>Pour toute question relative au site ou à son contenu, vous pouvez contacter MENUA CONSULTING à l'adresse suivante : <a href="mailto:contact@menuaconsulting.com" className="text-[#c89b53] hover:underline">contact@menuaconsulting.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
