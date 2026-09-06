"use client";
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  useEffect(() => {
    if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let widgetId: string | null = null;
    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetId) {
        clearInterval(interval);
        try {
          widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "light",
            appearance: "interaction-only",
          });
        } catch (err) {
          console.warn("Turnstile render note:", err);
        }
      }
    }, 150);

    return () => {
      clearInterval(interval);
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (err) {
          // ignore
        }
      }
    };
  }, [siteKey]);

  return (
    <div ref={containerRef} className="cf-turnstile"></div>
  );
}
