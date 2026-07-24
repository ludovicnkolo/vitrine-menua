"use client";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useLanguage } from "./LanguageProvider";
import React from "react";

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>, NextLinkProps {
  href: string;
  children?: React.ReactNode;
}

export default function Link({ href, children, ...props }: LinkProps) {
  const { lang } = useLanguage();
  const prefix = lang === "EN" ? "/en" : "/fr";
  
  let finalHref = href;
  if (typeof href === "string" && href.startsWith("/") && !href.startsWith("/en/") && !href.startsWith("/fr/") && href !== "/en" && href !== "/fr") {
    finalHref = href === "/" ? prefix : `${prefix}${href}`;
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
