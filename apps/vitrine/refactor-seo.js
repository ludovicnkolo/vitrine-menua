const fs = require('fs');
const path = require('path');

const seoData = {
  '': {
    title: 'Menua Consulting | Externalisation Back & Middle Office',
    description: "Cabinet de conseil spécialisé dans l'externalisation opérationnelle des fonctions back et middle office pour les acteurs financiers."
  },
  'nos-solutions': {
    title: "Nos Solutions d'Externalisation | Menua Consulting",
    description: "Découvrez nos solutions sur-mesure d'externalisation pour sécuriser et fluidifier vos opérations back et middle office."
  },
  'nous-connaitre': {
    title: "Nous Connaître | Menua Consulting",
    description: "Découvrez l'expertise et l'organisation de Menua Consulting, votre partenaire de confiance en externalisation financière."
  },
  'nous-rejoindre': {
    title: "Nous Rejoindre | Menua Consulting",
    description: "Rejoignez Menua Consulting. Nous recrutons des profils opérationnels rigoureux pour intervenir sur des fonctions back et middle office."
  },
  'nous-contacter': {
    title: "Nous Contacter | Menua Consulting",
    description: "Contactez Menua Consulting pour échanger sur vos besoins en externalisation opérationnelle et support back/middle office."
  },
  'vos-besoins': {
    title: "Vos Besoins | Menua Consulting",
    description: "Finance, conformité, data : nous répondons à vos besoins de renfort opérationnel et de gestion déléguée."
  },
  'pourquoi-menua': {
    title: "Pourquoi Menua Consulting ?",
    description: "Un partenaire opérationnel fiable pour renforcer vos équipes et sécuriser la continuité de vos activités."
  },
  'actualites': {
    title: "Actualités & Expertise | Menua Consulting",
    description: "Suivez les actualités, analyses et décryptages de Menua Consulting sur les enjeux du back et middle office."
  },
  'mentions-legales': {
    title: "Mentions Légales | Menua Consulting",
    description: "Mentions légales du site Menua Consulting."
  },
  'politique-de-confidentialite': {
    title: "Politique de Confidentialité | Menua Consulting",
    description: "Politique de confidentialité et de gestion des données personnelles de Menua Consulting."
  }
};

const srcDir = path.join(__dirname, 'src/app');

Object.keys(seoData).forEach(route => {
  const dirPath = path.join(srcDir, route);
  const pagePath = path.join(dirPath, 'page.tsx');
  const clientPagePath = path.join(dirPath, 'ClientPage.tsx');

  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf8');

    // Only refactor if it has "use  client" and hasn't been refactored yet
    if (content.includes('"use client"') || content.includes("'use client'")) {
      // 1. Rename page.tsx to ClientPage.tsx
      fs.renameSync(pagePath, clientPagePath);

      // 2. Create the new Server Component page.tsx
      const { title, description } = seoData[route];
      const newPageContent = `import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "${title}",
  description: "${description}",
};

export default function Page() {
  return <ClientPage />;
}
`;
      fs.writeFileSync(pagePath, newPageContent, 'utf8');
      console.log(`Refactored ${route === '' ? 'Home' : route} for SEO`);
    } else {
      console.log(`Skipped ${route} (already a server component or missing "use client")`);
    }
  } else {
    console.log(`Warning: ${pagePath} not found.`);
  }
});
