import { Metadata } from 'next';
import ClientPage from '../../vos-besoins/ClientPage';

export const metadata: Metadata = {
  title: "Your Needs",
  description: "Finance, compliance, data and wealth management: operational support and delegated management tailored to your needs.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/your-needs',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/vos-besoins',
      'en-GB': 'https://menuaconsulting.com/en/your-needs',
      'x-default': 'https://menuaconsulting.com/fr/vos-besoins',
    },
  },
  openGraph: {
    title: "Your Needs | Menua Consulting",
    description: "Tailored operational support for finance, compliance, accounting and wealth management teams.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/your-needs',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Your Needs | Menua Consulting",
    description: "Tailored operational support for finance, compliance, accounting and wealth management teams.",
  },
};

export default function Page() {
  return <ClientPage />;
}
