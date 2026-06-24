"use client";

import React, { useState } from "react";

interface SiretToggleProps {
  isEn: boolean;
  labelStyle: React.CSSProperties;
  fieldStyle: React.CSSProperties;
  defaultIsCompany?: boolean;
}

export function SiretToggle({ isEn, labelStyle, fieldStyle, defaultIsCompany = true }: SiretToggleProps) {
  const [isCompany, setIsCompany] = useState(defaultIsCompany);

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <p style={labelStyle}>{isEn ? "Legal Status *" : "Statut juridique *"}</p>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.84rem", color: "var(--text-dark)" }}>
          <input 
            type="radio" 
            name="statutJuridique" 
            value="ENTREPRISE" 
            checked={isCompany} 
            onChange={() => setIsCompany(true)} 
            style={{ accentColor: "var(--green-dark)" }}
          />
          {isEn ? "Company" : "Entreprise / Société"}
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.84rem", color: "var(--text-dark)" }}>
          <input 
            type="radio" 
            name="statutJuridique" 
            value="PARTICULIER" 
            checked={!isCompany} 
            onChange={() => setIsCompany(false)} 
            style={{ accentColor: "var(--green-dark)" }}
          />
          {isEn ? "Individual / Candidate" : "Personne physique / Candidat individuel"}
        </label>
      </div>

      {isCompany && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label htmlFor="societe" style={labelStyle}>{isEn ? "Company Name *" : "Nom de la société *"}</label>
            <input id="societe" name="societe" type="text" required style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="siret" style={labelStyle}>{isEn ? "Company Registration Number (SIRET) *" : "Numéro d'identification (SIRET) *"}</label>
            <input id="siret" name="siret" type="text" required style={fieldStyle} />
          </div>
        </div>
      )}
    </div>
  );
}
