import React from "react";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
}

export function PageHeader({ title, subtitle, imageSrc }: PageHeaderProps) {
  if (imageSrc) {
    return (
      <section
        style={{
          position: "relative",
          paddingTop: "12rem",
          paddingBottom: "8rem",
          overflow: "hidden",
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(13,30,53,0.7) 0%, rgba(13,30,53,0.9) 100%)",
            zIndex: 1,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "860px", color: "#fff" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="section-lbl section-lbl--light" style={{ color: "var(--gold)" }}>MENUA CONSULTING</p>
            <div className="section-lbl-line" style={{ background: "var(--gold)" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.85)",
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
