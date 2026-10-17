export const EMPTY_SECTION = () => ({
  subtitle: "",
  subtitle_en: "",
  text: "",
  text_en: "",
  imageKey: "",
  imagePreview: "",
  uploading: false,
});

export const CATEGORIES = [
  "FINANCE ET COMPTABILITÉ",
  "BACK ET MIDDLE OFFICE",
  "DATA ET REPORTING",
  "RISQUES, CONFORMITÉ ET KYC",
  "GESTION DE PATRIMOINE",
  "ORGANISATION ET EXTERNALISATION",
];

export const CATEGORY_TRANSLATIONS = {
  "FINANCE ET COMPTABILITÉ": "FINANCE AND ACCOUNTING",
  "BACK ET MIDDLE OFFICE": "BACK AND MIDDLE OFFICE",
  "DATA ET REPORTING": "DATA AND REPORTING",
  "RISQUES, CONFORMITÉ ET KYC": "RISK, COMPLIANCE AND KYC",
  "GESTION DE PATRIMOINE": "WEALTH MANAGEMENT",
  "ORGANISATION ET EXTERNALISATION": "ORGANISATION AND OUTSOURCING",
};

export const fieldLabelStyle = {
  display: "block",
  marginBottom: "0.45rem",
  fontWeight: 600,
  fontSize: "0.82rem",
  color: "#374151",
};

export const textInputStyle = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  fontSize: "0.875rem",
  outline: "none",
  color: "var(--text-main)",
  boxSizing: "border-box",
};

export const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  background: "#F1F5F9",
  border: "1px solid #CBD5E1",
  borderBottom: "none",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  padding: "0.35rem 0.5rem",
};

export const toolbarBtnStyle = {
  background: "#FFF",
  border: "1px solid #E2E8F0",
  borderRadius: "4px",
  padding: "0.2rem 0.5rem",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#334155",
  cursor: "pointer",
  lineHeight: 1.2,
};

export const toolbarDividerStyle = {
  width: "1px",
  height: "16px",
  background: "#CBD5E1",
  margin: "0 0.25rem",
};

export const sectionIconBtnStyle = {
  background: "#FFF",
  border: "1px solid #E2E8F0",
  borderRadius: "4px",
  cursor: "pointer",
  padding: "0.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748B",
};
