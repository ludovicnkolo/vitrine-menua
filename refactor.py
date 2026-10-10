import os
import re
import shutil

en_pages = [
    ('apps/vitrine/src/app/en/page.tsx', '../ClientPage', 'Home'),
    ('apps/vitrine/src/app/en/contact-us/page.tsx', '@/app/nous-contacter/ClientPage', 'Contact'),
    ('apps/vitrine/src/app/en/why-choose-us/page.tsx', '@/app/pourquoi-menua/ClientPage', 'WhyMenua'),
    ('apps/vitrine/src/app/en/your-needs/page.tsx', '@/app/vos-besoins/ClientPage', 'YourNeeds'),
    ('apps/vitrine/src/app/en/news/page.tsx', '@/app/actualites/ClientPage', 'News'),
    ('apps/vitrine/src/app/en/news/[id]/page.tsx', '@/app/actualites/[id]/ClientPageArticle', 'NewsArticle'),
    ('apps/vitrine/src/app/en/privacy-policy/page.tsx', '@/app/politique-de-confidentialite/ClientPage', 'PrivacyPolicy'),
    ('apps/vitrine/src/app/en/our-solutions/page.tsx', '@/app/nos-solutions/ClientPage', 'OurSolutions'),
    ('apps/vitrine/src/app/en/about-us/page.tsx', '@/app/nous-connaitre/ClientPage', 'AboutUs'),
    ('apps/vitrine/src/app/en/legal-notices/page.tsx', '@/app/mentions-legales/ClientPage', 'LegalNotices'),
    ('apps/vitrine/src/app/en/join-us/page.tsx', '@/app/nous-rejoindre/ClientPage', 'JoinUs')
]

components_dir = 'apps/vitrine/src/components/pages'
os.makedirs(components_dir, exist_ok=True)

def resolve_fr_route(import_path):
    if import_path.startswith('@/app/'):
        return import_path.replace('@/app/', 'apps/vitrine/src/app/')
    elif import_path == '../ClientPage':
        return 'apps/vitrine/src/app/ClientPage'
    return None

def extract_meta(content):
    title = ""
    desc = ""
    fr_url = ""
    en_url = ""
    
    m_title = re.search(r"title:\s*[\"']([^\"']+)[\"']", content)
    if m_title:
        title = m_title.group(1)
        
    m_desc = re.search(r"description:\s*[\"']([^\"']+)[\"']", content)
    if m_desc:
        desc = m_desc.group(1)
        
    m_fr = re.search(r"['\"]fr-FR['\"]:\s*`?\$\{?SITE_URL\}?([^\n'`,]+)`?", content)
    if not m_fr:
        m_fr = re.search(r"['\"]fr-FR['\"]:\s*['\"]https://[^/]+([^\n'\"`]+)['\"]", content)
    if m_fr:
        fr_url = m_fr.group(1)

    m_en = re.search(r"['\"]en-GB['\"]:\s*`?\$\{?SITE_URL\}?([^\n'`,]+)`?", content)
    if not m_en:
        m_en = re.search(r"['\"]en-GB['\"]:\s*['\"]https://[^/]+([^\n'\"`]+)['\"]", content)
    if m_en:
        en_url = m_en.group(1)
        
    if not title.endswith('| Menua Consulting') and title != 'Menua Consulting':
        title = f"{title} | Menua Consulting"
        
    return title, desc, fr_url, en_url

template = """import { Metadata } from 'next';
import {COMP_NAME} from '@/components/pages/{COMP_NAME}';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';

const title = {TITLE};
const description = {DESC};
const canonicalUrl = `${SITE_URL}{EN_URL}`;
const ogImageUrl = `${SITE_URL}/img/accueil-actus.webp`;

export const metadata: Metadata = {
  title: {SHORT_TITLE},
  description,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'fr-FR': `${SITE_URL}{FR_URL}`,
      'en-GB': canonicalUrl,
      'x-default': `${SITE_URL}{FR_URL}`,
    },
  },
  openGraph: {
    title,
    description,
    locale: 'en_GB',
    url: canonicalUrl,
    type: 'website',
    images: [
      {
        url: ogImageUrl,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImageUrl],
  },
};

export default function Page() {
  return <{COMP_NAME} />;
}
"""

for en_path, import_path, name in en_pages:
    print(f"Processing {en_path}")
    comp_name = f"{name}ClientPage"
    
    fr_comp_path = resolve_fr_route(import_path) + '.tsx'
    new_comp_path = f"{components_dir}/{comp_name}.tsx"
    
    if os.path.exists(fr_comp_path):
        print(f"  Moving {fr_comp_path} to {new_comp_path}")
        shutil.move(fr_comp_path, new_comp_path)
        
        # We need to update the fr page.tsx to point to the new component
        fr_page_path = os.path.dirname(fr_comp_path) + '/page.tsx'
        if os.path.exists(fr_page_path):
            with open(fr_page_path, 'r') as f:
                fr_content = f.read()
            # Replace the import
            old_import_name = "ClientPageArticle" if "Article" in comp_name else "ClientPage"
            fr_content = re.sub(
                r"import\s+" + old_import_name + r"\s+from\s+['\"]./(" + old_import_name + r")['\"];",
                f"import {comp_name} from '@/components/pages/{comp_name}';",
                fr_content
            )
            fr_content = re.sub(
                r"import\s+" + old_import_name + r"\s+from\s+['\"]../(" + old_import_name + r")['\"];",
                f"import {comp_name} from '@/components/pages/{comp_name}';",
                fr_content
            )
            # Replace component usage
            fr_content = re.sub(r"<\s*" + old_import_name + r"\s*/?>", f"<{comp_name} />", fr_content)
            with open(fr_page_path, 'w') as f:
                f.write(fr_content)
    
    # Read existing EN content
    if os.path.exists(en_path):
        with open(en_path, 'r') as f:
            en_content = f.read()
            
        title, desc, fr_url, en_url = extract_meta(en_content)
        
        if not fr_url:
            print(f"  Could not find FR URL for {en_path}")
            fr_url = "/fr"
        if not en_url:
            print(f"  Could not find EN URL for {en_path}")
            en_url = "/en"
            
        short_title = title.split(' | ')[0]
        
        new_en_content = template.replace('{COMP_NAME}', comp_name)
        new_en_content = new_en_content.replace('{TITLE}', repr(title))
        new_en_content = new_en_content.replace('{SHORT_TITLE}', repr(short_title))
        new_en_content = new_en_content.replace('{DESC}', repr(desc))
        new_en_content = new_en_content.replace('{FR_URL}', fr_url)
        new_en_content = new_en_content.replace('{EN_URL}', en_url)
        
        with open(en_path, 'w') as f:
            f.write(new_en_content)
