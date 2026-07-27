import React from 'react';
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";

interface LegalPageHeaderProps {
  title: string;
  lastUpdate: string;
}

const LegalPageHeader = ({ title, lastUpdate }: LegalPageHeaderProps) => {
  const { t } = useLanguage();

  return (
    <>
      <p className="text-[#6e7891] text-[0.8rem] font-bold tracking-widest uppercase mb-4">
        <Link href="/" className="hover:text-[#141824] transition-colors">{t("Accueil", "Home")}</Link>
        <span className="mx-2 text-[#a0aabf]">/</span>
        <span>{title}</span>
      </p>
      
      <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-widest mb-4 text-[#141824]">
        {title}
      </h1>
      <p className="text-[#6e7891] font-medium mb-12">{lastUpdate}</p>
    </>
  );
};

export default LegalPageHeader;
