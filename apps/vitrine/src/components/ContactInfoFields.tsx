import React from 'react';
import { useLanguage } from "@/components/LanguageProvider";

interface ContactInfoFieldsProps {
  emailError?: string | null;
}

export default function ContactInfoFields({ emailError }: ContactInfoFieldsProps = {}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label htmlFor="lastName" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
            {t("Nom", "Last Name")} <span className="text-red-500">*</span>
          </label>
          <input id="lastName" type="text" name="lastName" placeholder={t("Votre nom", "Your last name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
        </div>
        <div>
          <label htmlFor="firstName" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
            {t("Prénom", "First Name")} <span className="text-red-500">*</span>
          </label>
          <input id="firstName" type="text" name="firstName" placeholder={t("Votre prénom", "Your first name")} className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label htmlFor="email" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
            {t("E-mail", "Email")} <span className="text-red-500">*</span>
          </label>
          <input id="email" type="email" name="email" placeholder="votre.email@exemple.com" className={`w-full border-b ${emailError ? 'border-red-500' : 'border-[#d1d5db]'} bg-transparent px-0 py-3 text-[1.05rem] ${emailError ? 'text-red-500' : 'text-[#141824]'} focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]`} required />
          {emailError && <p className="text-red-500 text-xs mt-2 font-bold">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
            {t("Téléphone", "Phone")}
          </label>
          <input id="phone" type="tel" name="phone" placeholder="+33 6 12 34 56 78" className="w-full border-b border-[#d1d5db] bg-transparent px-0 py-3 text-[1.05rem] text-[#141824] focus:outline-none focus:border-[#141824] transition-colors placeholder:text-[#a0aabf]" />
        </div>
      </div>
    </>
  );
}
