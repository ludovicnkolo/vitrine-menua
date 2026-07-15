"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("");
          // Stop observing if we only want it to animate once
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Triggers when 10% of the element is visible
    });

    const timer = setTimeout(() => {
      document.querySelectorAll(".").forEach((el) => {
        observer.observe(el);
      });
    }, 150); // slight delay to ensure DOM is fully rendered

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
