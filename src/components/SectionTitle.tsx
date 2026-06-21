import React from "react";

export function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="section-label-wrap" style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <p className={light ? "section-lbl section-lbl--light" : "section-lbl"} style={{ marginBottom: 0 }}>{children}</p>
      <div className="section-lbl-line" />
    </div>
  );
}
