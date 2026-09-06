import React from 'react';
import Link from 'next/link';
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
    "The collected information is processed by MENUA CONSULTING in order to respond to your request and ensure its follow-up. Fields marked with an asterisk are mandatory. To know the recipients, the retention periods and to exercise your rights, consult our"
  ));

  const textJoin = formatBrand(t(
    "Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin de répondre à votre demande et d'en assurer le suivi. Elles peuvent être conservées jusqu'à 2 ans après le dernier échange. Vous disposez de droits sur vos données personnelles et pouvez les exercer à l'adresse : contact@menuaconsulting.com. Pour en savoir plus, consultez notre",
    "The information collected via this form is processed by MENUA CONSULTING in order to respond to your request and ensure its follow-up. They can be kept for up to 2 years after the last exchange. You have rights over your personal data and can exercise them at the address: contact@menuaconsulting.com. To learn more, consult our"
  ));

  const text = type === 'contact' ? textContact : textJoin;

  return (
    <>
      <div>
        <label htmlFor={id} className="flex items-start gap-4 text-[1.05rem] text-[#6e7891] cursor-pointer group font-light">
          <input type="checkbox" id={id} className="accent-[#141824] mt-1 shrink-0 w-5 h-5" required />
          <span>
            {t("J’ai pris connaissance de la", "I have read the")} <Link href={t("/politique-de-confidentialite", "/en/privacy-policy")} className="text-[#141824] hover:underline font-bold">{t("politique de confidentialité", "Privacy Policy")}</Link>. <span className="text-red-500">*</span>
          </span>
        </label>
        <p className="text-[0.85rem] text-[#6e7891] font-light mt-4 leading-relaxed">
          {text}{" "}<Link href={t("/politique-de-confidentialite", "/en/privacy-policy")} className="text-[#141824] hover:underline font-bold">{t("Politique de confidentialité", "Privacy Policy")}</Link>.
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
