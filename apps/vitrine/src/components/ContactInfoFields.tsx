"use client";
import React, { useEffect, useRef } from 'react';
import { useLanguage } from "@/components/LanguageProvider";

interface ContactInfoFieldsProps {
  emailError?: string | null;
}

export default function ContactInfoFields({ emailError }: ContactInfoFieldsProps = {}) {
  const { t } = useLanguage();
  const emailRef = useRef<HTMLInputElement>(null);
  const emailWrapperRef = useRef<HTMLDivElement>(null);

  // Dès qu'une erreur email apparaît, on scrolle vers le champ et on le focus
  useEffect(() => {
    if (emailError && emailRef.current && emailWrapperRef.current) {
      // Scroll smooth vers le champ email
      emailWrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus sur le champ après le scroll
      setTimeout(() => {
        emailRef.current?.focus();
      }, 400);
    }
  }, [emailError]);

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
        {/* Email field wrapper — sera scrollé vers en cas d'erreur */}
        <div ref={emailWrapperRef}>
          <label htmlFor="email" className="text-[0.85rem] font-bold tracking-widest text-[#141824] mb-3 block">
            {t("E-mail", "Email")} <span className="text-red-500">*</span>
          </label>
          <div className={`relative transition-all duration-300 ${emailError ? 'animate-shake' : ''}`}>
            <input
              ref={emailRef}
              id="email"
              type="email"
              name="email"
              placeholder="votre.email@exemple.com"
              className={`w-full border-b-2 ${emailError ? 'border-red-500' : 'border-[#d1d5db]'} bg-transparent px-0 py-3 text-[1.05rem] ${emailError ? 'text-red-600' : 'text-[#141824]'} focus:outline-none transition-all duration-300 placeholder:text-[#a0aabf]`}
              required
            />
          </div>
          {emailError && (
            <div className="flex items-center gap-2 mt-2">
              <svg className="shrink-0 text-red-500 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-500 text-xs font-bold leading-tight">{emailError}</p>
            </div>
          )}
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
