import { Metadata } from 'next';
import ClientPage from '../../nous-contacter/ClientPage';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Menua Consulting to discuss your operational outsourcing needs and back/middle office support.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/contact-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/nous-contacter',
      'en-US': 'https://menuaconsulting.com/en/contact-us',
      'x-default': 'https://menuaconsulting.com/nous-contacter',
    },
  },
  openGraph: {
    title: "Contact Us | Menua Consulting",
    description: "Get in touch with Menua Consulting to discuss your operational delegation needs.",
    locale: 'en_US',
    url: 'https://menuaconsulting.com/en/contact-us',
  },
};

export default function Page() {
  return <ClientPage />;
}
