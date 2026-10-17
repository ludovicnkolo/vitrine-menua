import React from "react";

export const formatPriority = (p, t) => {
  if (!p) return t ? t("priority.NORMAL", "Normal") : "Normal";
  const s = String(p).trim().toUpperCase();
  if (s === "URGENT" || s === "URGENTE") return t ? t("priority.URGENT", "Urgent") : "Urgent";
  if (s === "PRIORITAIRE" || s === "HAUTE" || s === "ELEVE" || s === "ELEVEE") return t ? t("priority.PRIORITAIRE", "Prioritaire") : "Prioritaire";
  if (s === "FAIBLE" || s === "BASSE") return t ? t("priority.FAIBLE", "Faible") : "Faible";
  if (s === "NORMAL" || s === "NORMALE") return t ? t("priority.NORMAL", "Normal") : "Normal";
  const title = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  return t ? t(`priority.${s}`, title) : title;
};

export const MessageDetailCard = ({ label, value, children, sublabel, inline }) => (
  <div
    style={{
      background: "#F8FAFC",
      borderRadius: "6px",
      padding: "0.55rem 0.85rem",
      border: "1px solid #F1F5F9",
      display: "flex",
      flexDirection: inline ? "row" : "column",
      alignItems: inline ? "center" : "stretch",
      justifyContent: inline ? "space-between" : "flex-start",
      gap: inline ? "1rem" : "0.2rem",
    }}
  >
    <div
      className="font-medium flex items-center justify-between"
      style={{ fontSize: "0.75rem", color: "#64748B" }}
    >
      <span>{label} :</span>
      {sublabel && (
        <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{sublabel}</span>
      )}
    </div>
    <div
      className="font-semibold text-[var(--text-main)]"
      style={{ fontSize: "0.88rem", wordBreak: "break-word" }}
    >
      {children || value}
    </div>
  </div>
);

export default MessageDetailCard;
