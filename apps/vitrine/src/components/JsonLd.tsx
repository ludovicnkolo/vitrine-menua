import React from "react";

interface JsonLdProps {
  isEn?: boolean;
}

export default function JsonLd({ isEn = false }: JsonLdProps) {
  return (
    <script
      id="schema-org-jsonld"
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Menua Consulting',
          url: isEn ? 'https://menuaconsulting.com/en' : 'https://menuaconsulting.com',
          logo: 'https://menuaconsulting.com/img/logo-clean-light.webp',
          email: 'contact@menuaconsulting.com',
          telephone: '+33686877914',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '92 rue des Pyrénées',
            postalCode: '75020',
            addressLocality: 'Paris',
            addressCountry: 'FR'
          },
          areaServed: 'FR',
          serviceType: isEn ? 'Operational outsourcing for back and middle office functions' : 'Externalisation opérationnelle back et middle office'
        })
      }}
    />
  );
}
