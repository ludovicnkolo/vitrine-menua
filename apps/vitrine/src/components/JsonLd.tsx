"use client";
import React, { useEffect, useState } from "react";

export default function JsonLd() {
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/en")) {
      setIsEn(true);
    }
  }, []);

  return (
    <script
      type="application/ld+json"
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
          serviceType: isEn ? 'Back and middle-office operational outsourcing' : 'Externalisation opérationnelle back et middle office'
        })
      }}
    />
  );
}
