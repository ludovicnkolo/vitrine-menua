import { Metadata } from 'next';
import ClientPage from '../../pourquoi-menua/ClientPage';

export const metadata: Metadata = {
  title: "Why Choose Menua Consulting?",
  description: "A reliable operational partner to reinforce your teams and secure the continuity of your business activities.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/why-choose-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/pourquoi-menua',
      'en-US': 'https://menuaconsulting.com/en/why-choose-us',
      'x-default': 'https://menuaconsulting.com/pourquoi-menua',
    },
  },
  openGraph: {
    title: "Why Choose Menua Consulting? | Menua Consulting",
    description: "Operational rigor, internal workload control, and business continuity support.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/why-choose-us',
  },
};

export default function Page() {
  return <ClientPage />;
}
