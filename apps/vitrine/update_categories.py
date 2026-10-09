import sys

file_path = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/vitrine/src/app/actualites/ClientPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

old_display_category = "const displayCategory = (pub: any) => (isEN && pub.category_en) ? pub.category_en : pub.category;"

new_display_category = """const displayCategory = (pub: any) => {
  const categoryKey = pub.category;
  if (!categoryKey) return "";
  const filterList = [
    { key: "TOUTES LES ACTUALITÉS", fr: "TOUTES LES ACTUALITÉS", en: "ALL NEWS" },
    { key: "FINANCE ET COMPTABILITÉ", fr: "FINANCE ET COMPTABILITÉ", en: "FINANCE AND ACCOUNTING" },
    { key: "BACK ET MIDDLE OFFICE", fr: "BACK ET MIDDLE OFFICE", en: "BACK & MIDDLE OFFICE" },
    { key: "DATA ET REPORTING", fr: "DATA ET REPORTING", en: "DATA AND REPORTING" },
    { key: "RISQUES, CONFORMITÉ ET KYC", fr: "RISQUES, CONFORMITÉ ET KYC", en: "RISK, COMPLIANCE AND KYC" },
    { key: "GESTION DE PATRIMOINE", fr: "GESTION DE PATRIMOINE", en: "WEALTH MANAGEMENT" },
    { key: "ORGANISATION ET EXTERNALISATION", fr: "ORGANISATION ET EXTERNALISATION", en: "ORGANISATION AND OUTSOURCING" }
  ];
  const filter = filterList.find(f => f.key === categoryKey);
  if (filter) {
    return isEN ? filter.en : filter.fr;
  }
  return (isEN && pub.category_en) ? pub.category_en : categoryKey;
};"""

content = content.replace(old_display_category, new_display_category)

old_badge_1 = """                {featuredPub.category && (
                  <div className="absolute top-4 left-4 bg-[#e8e1d7] text-[#141824] px-4 py-2 text-[0.8rem] font-bold uppercase tracking-wider">
                    {displayCategory(featuredPub)}
                  </div>
                )}"""
new_badge_1 = """                {featuredPub.category && (
                  <div className="absolute top-4 left-4 bg-[#e8e1d7] text-[#141824] px-4 py-2 text-[0.8rem] font-bold uppercase tracking-wider z-20">
                    {displayCategory(featuredPub)}
                  </div>
                )}"""
content = content.replace(old_badge_1, new_badge_1)

old_badge_2 = """                    {pub.category && (
                      <div className="absolute top-3 left-3 bg-[#e8e1d7] text-[#141824] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider">
                        {displayCategory(pub)}
                      </div>
                    )}"""
new_badge_2 = """                    {pub.category && (
                      <div className="absolute top-3 left-3 bg-[#e8e1d7] text-[#141824] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider z-20">
                        {displayCategory(pub)}
                      </div>
                    )}"""
content = content.replace(old_badge_2, new_badge_2)

with open(file_path, 'w') as f:
    f.write(content)

print("Done updating actualites")
