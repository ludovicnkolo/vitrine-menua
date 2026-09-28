import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AuditPage from "./AuditPage";
import SpacePageLayout from "../components/SpacePageLayout";
import i18n from "../i18n";

const SystemSpacePage = ({ userRole }) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(
    localStorage.getItem("adminTheme") || "light",
  );
  const [lang, setLang] = useState(
    localStorage.getItem("adminLang") || i18n.language || "fr",
  );

  // Super-administrateur ET Administrateur technique voient l'onglet Audit
  // Collaborateur, Relecteur, Responsable opérationnel ne voient que Configuration
  const canSeeAudit =
    userRole === "Super-administrateur" ||
    userRole === "ADMIN" ||
    userRole === "Administrateur technique";

  const tabs = [
    ...(canSeeAudit ? [{ id: "audit", label: t("systemSpace.audit") }] : []),
    { id: "configuration", label: t("systemSpace.title") },
  ];

  const handleThemeChange = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleLangChange = (newLang) => {
    if (newLang !== "fr" && newLang !== "en") return;
    setLang(newLang);
    localStorage.setItem("adminLang", newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <SpacePageLayout
      initialTab={canSeeAudit ? "audit" : "configuration"}
      tabs={tabs}
    >
      {(tab) => (
        <>
          {tab === "audit" && canSeeAudit && <AuditPage />}
          {tab === "configuration" && (
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  marginBottom: "1.5rem",
                }}
              >
                {t("systemSpace.title")}
              </h1>

              <div
                className="card"
                style={{ maxWidth: "600px", marginBottom: "2rem" }}
              >
                <h3
                  style={{
                    marginBottom: "1rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                  }}
                >
                  {t("systemSpace.appearance")}
                </h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      border:
                        theme === "light"
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border)",
                      borderRadius: "8px",
                      background: "var(--surface)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      ☀️
                    </div>
                    {t("systemSpace.lightMode")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      border:
                        theme === "dark"
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border)",
                      borderRadius: "8px",
                      background: "var(--surface)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      🌙
                    </div>
                    {t("systemSpace.darkMode")}
                  </button>
                </div>
              </div>

              <div className="card" style={{ maxWidth: "600px" }}>
                <h3
                  style={{
                    marginBottom: "1rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                  }}
                >
                  {t("systemSpace.language")}
                </h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {t("systemSpace.languageDesc")}
                </p>
                <select
                  value={lang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    fontSize: "1rem",
                  }}
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </SpacePageLayout>
  );
};

export default SystemSpacePage;
