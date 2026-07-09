const fs = require('fs');
const path = require('path');

const pages = [
  'politique-de-confidentialite',
  'nous-rejoindre',
  'mentions-legales',
  'actualites',
  'nos-solutions',
  'nous-contacter',
  'nous-connaitre',
  'pourquoi-menua',
  'vos-besoins'
];

const translations = {
  'politique-de-confidentialite': {
    enTitle: "Privacy Policy – MENUA CONSULTING",
    enDesc: "Privacy policy and personal data protection of MENUA CONSULTING – GDPR, rights of individuals, retention periods."
  },
  'nous-rejoindre': {
    enTitle: "Join Us – MENUA CONSULTING",
    enDesc: "MENUA CONSULTING is recruiting operational profiles in back & middle office, accounting, compliance, wealth management. Apply via our recruitment form."
  },
  'mentions-legales': {
    enTitle: "Legal Notice – MENUA CONSULTING",
    enDesc: "Legal notice of MENUA CONSULTING – SASU with a share capital of €15,000, Paris RCS 993 749 779, publisher of the site and mandatory legal information."
  },
  'actualites': {
    enTitle: "News – MENUA CONSULTING",
    enDesc: "Follow the news of MENUA CONSULTING: our latest posts, our analyses and our advice in operational outsourcing."
  },
  'nos-solutions': {
    enTitle: "Our Solutions – MENUA CONSULTING",
    enDesc: "Discover the operational outsourcing solutions of MENUA CONSULTING: from the provision of resources to the complete taking over of processes."
  },
  'nous-contacter': {
    enTitle: "Contact Us – MENUA CONSULTING",
    enDesc: "Present your operational need to MENUA CONSULTING. Contact form, contact details and urgency levels."
  },
  'nous-connaitre': {
    enTitle: "Get to Know Us – MENUA CONSULTING",
    enDesc: "Discover MENUA CONSULTING, your partner in operational outsourcing and specialized support for your back and middle office functions."
  },
  'pourquoi-menua': {
    enTitle: "Why Menua – MENUA CONSULTING",
    enDesc: "Why choose MENUA CONSULTING? Discover our commitments, our methodology and our values to support you in your operational challenges."
  },
  'vos-besoins': {
    enTitle: "Your Needs – MENUA CONSULTING",
    enDesc: "Finance & reporting, management control, risks & compliance, accounting & data support, wealth management: discover how MENUA CONSULTING meets your operational needs."
  }
};

pages.forEach(page => {
  const filePath = path.join(__dirname, 'src', 'app', '[lang]', page, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the export const metadata block
    const match = content.match(/export const metadata: Metadata = {\n\s+title: "([^"]+)",\n\s+description:\n\s+"([^"]+)",\n};/);
    if (match) {
      const frTitle = match[1];
      const frDesc = match[2];
      const { enTitle, enDesc } = translations[page];
      
      const newMetadata = `export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const isEn = lang === 'en';
  return {
    title: isEn ? "${enTitle}" : "${frTitle}",
    description: isEn
      ? "${enDesc}"
      : "${frDesc}",
  };
}`;
      
      content = content.replace(match[0], newMetadata);
      fs.writeFileSync(filePath, content);
      console.log(`Updated metadata for ${page}`);
    } else {
      console.log(`Could not find metadata block for ${page}`);
    }
  }
});
