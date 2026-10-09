import React from 'react';
import Link from '@/components/Link';
import { useLanguage } from '@/components/LanguageProvider';
import { formatBrand } from '@/utils/formatBrand';
import TurnstileWidget from '@/components/TurnstileWidget';

interface FormPrivacyAndSubmitProps {
  id: string;
  isSubmitting: boolean;
  submitText: string;
  submittingText: string;
  type: 'contact' | 'join';
}

export default function FormPrivacyAndSubmit({ id, isSubmitting, submitText, submittingText, type }: FormPrivacyAndSubmitProps) {
  const { t } = useLanguage();
  
  const textContact = formatBrand(t(
    "Les informations recueillies sont traitées par MENUA CONSULTING afin de répondre à votre demande et d’en assurer le suivi. Les champs signalés par un astérisque sont obligatoires. Pour connaître les destinataires, les durées de conservation et exercer vos droits, consultez notre",
    "The collected information is processed by MENUA CONSULTING to process your enquiry and manage ongoing communications. Fields marked with an asterisk are mandatory. For information on recipients, data retention periods and exercising your statutory rights, please review our"
  ));

  const textJoin = formatBrand(t(
    "Les informations transmises sont utilisées uniquement pour l’étude de votre candidature. Elles peuvent être conservées jusqu’à 2 ans après le dernier échange, conformément à notre",
    "The information you provide is used solely to assess your application. It may be retained for up to 2 years after our last interaction, in accordance with our"
  ));

  const text = type === 'contact' ? textContact : textJoin;

  return (
    <>
      <div>
        <label htmlFor={id} className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
          <input type="checkbox" id={id} className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
          <span>
            {t("J’ai pris connaissance de la", "I have read the")} <Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "Privacy Policy")}</Link>. <span className="text-red-500">*</span>
          </span>
        </label>
        <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
          {text}{" "}<Link href="/politique-de-confidentialite" className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
        </p>
      </div>

      <TurnstileWidget />

      <div className="flex justify-center pt-2">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-[#141824] text-white px-10 py-4 font-bold uppercase tracking-wider text-[0.85rem] hover:bg-[#1f2638] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
          {isSubmitting ? submittingText : submitText}
        </button>
      </div>
    </>
  );
}
