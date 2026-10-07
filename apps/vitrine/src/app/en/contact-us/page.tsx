import { Metadata } from 'next';
import ClientPage from '../../nous-contacter/ClientPage';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Menua Consulting to discuss your operational outsourcing needs and back/middle office support.",
  alternates: {
    canonical: 'https://menuaconsulting.com/en/contact-us',
    languages: {
      'fr-FR': 'https://menuaconsulting.com/fr/nous-contacter',
      'en-GB': 'https://menuaconsulting.com/en/contact-us',
      'x-default': 'https://menuaconsulting.com/fr/nous-contacter',
    },
  },
  openGraph: {
    title: "Contact Us | Menua Consulting",
    description: "Get in touch with Menua Consulting to discuss your operational outsourcing needs across back and middle office functions.",
    locale: 'en_GB',
    url: 'https://menuaconsulting.com/en/contact-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us | Menua Consulting",
    description: "Get in touch with Menua Consulting to discuss your operational outsourcing needs across back and middle office functions.",
  },
};

export default function Page() {
  return <ClientPage />;
}
