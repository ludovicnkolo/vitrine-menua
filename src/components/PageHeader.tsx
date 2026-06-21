import React from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section
      style={{
        paddingTop: "9rem",
        paddingBottom: "5rem",
        background: "var(--beige-bg)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
          <p className="section-lbl">MENUA CONSULTING</p>
          <div className="section-lbl-line" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "var(--text-dark)",
            lineHeight: 1.3,
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-mid)",
            lineHeight: 1.85,
            maxWidth: "680px",
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
