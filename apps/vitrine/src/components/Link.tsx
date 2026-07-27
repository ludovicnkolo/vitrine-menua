"use client";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useLanguage } from "./LanguageProvider";
import React from "react";

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>, NextLinkProps {
  href: string;
  children?: React.ReactNode;
}

export const enRouteMap: Record<string, string> = {
  "/nous-connaitre": "/about-us",
  "/vos-besoins": "/your-needs",
  "/nos-solutions": "/our-solutions",
  "/pourquoi-menua": "/why-choose-us",
  "/actualites": "/news",
  "/nous-rejoindre": "/join-us",
  "/nous-contacter": "/contact-us",
  "/mentions-legales": "/legal-notices",
  "/politique-de-confidentialite": "/privacy-policy"
};

export const frRouteMap: Record<string, string> = Object.entries(enRouteMap).reduce((acc, [fr, en]) => {
  acc[en] = fr;
  return acc;
}, {} as Record<string, string>);

export default function Link({ href, children, ...props }: LinkProps) {
  const { lang } = useLanguage();
  const prefix = lang === "EN" ? "/en" : "/fr";
  
  let finalHref = href;
  if (typeof href === "string" && href.startsWith("/") && !href.startsWith("/en/") && !href.startsWith("/fr/") && href !== "/en" && href !== "/fr") {
    
    let pathToTranslate = href;
    let suffix = "";
    const hashIndex = href.indexOf('#');
    const queryIndex = href.indexOf('?');
    const splitIndex = Math.min(
      hashIndex !== -1 ? hashIndex : href.length,
      queryIndex !== -1 ? queryIndex : href.length
    );

    if (splitIndex !== href.length) {
      pathToTranslate = href.substring(0, splitIndex);
      suffix = href.substring(splitIndex);
    }

    if (lang === "EN" && enRouteMap[pathToTranslate]) {
      pathToTranslate = enRouteMap[pathToTranslate];
    }

    const translatedHref = pathToTranslate + suffix;
    finalHref = translatedHref === "/" ? prefix : `${prefix}${translatedHref}`;
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
