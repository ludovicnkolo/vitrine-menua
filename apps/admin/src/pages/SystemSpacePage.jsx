import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Check, ChevronDown } from "lucide-react";
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
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Super-administrateur ET Administrateur technique voient l'onglet Audit
  // Collaborateur, Relecteur, Responsable opérationnel ne voient que Configuration
  const canSeeAudit =
    userRole === "Super-administrateur" ||
    userRole === "ADMIN" ||
    userRole === "Administrateur technique";

  const tabs = [
    ...(canSeeAudit ? [{ id: "audit", label: "Audit" }] : []),
    { id: "configuration", label: "Configuration" },
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

  const handleSavePreferences = () => {
    localStorage.setItem("adminTheme", theme);
    localStorage.setItem("adminLang", lang);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
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
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              {/* Header */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h1
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("systemSpace.title", "Configuration de la Plateforme")}
                </h1>
                <p style={{ color: "#64748B", margin: 0, fontSize: "0.85rem" }}>
                  {t("systemSpace.subtitle", "Personnalisez l'environnement de travail, les préférences d'affichage et la localisation")}
                </p>
              </div>

              {/* 2 Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* Card 1: Apparence */}
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {t("systemSpace.appearance", "Apparence de l'interface")}
                  </h3>
                  <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#64748B" }}>
                    {t("systemSpace.appearanceDesc", "Choisissez le thème d'affichage adapté à votre confort visuel")}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {/* Mode Clair */}
                    <div
                      onClick={() => handleThemeChange("light")}
                      style={{
                        position: "relative",
                        border: theme === "light" ? "2px solid #3B82F6" : "1px solid #E2E8F0",
                        background: theme === "light" ? "#EFF6FF" : "#FFF",
                        borderRadius: "10px",
                        padding: "1.5rem 1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {theme === "light" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "#2563EB",
                            color: "#FFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "1.75rem",
                          color: "#F59E0B",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <Sun size={28} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0F172A" }}>
                        {t("systemSpace.lightMode", "Mode Clair")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#64748B",
                          marginTop: "0.35rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {t("systemSpace.lightModeDesc", "Recommandé pour un usage de jour en forte luminosité")}
                      </div>
                    </div>

                    {/* Mode Sombre */}
                    <div
                      onClick={() => handleThemeChange("dark")}
                      style={{
                        position: "relative",
                        border: theme === "dark" ? "2px solid #3B82F6" : "1px solid #E2E8F0",
                        background: theme === "dark" ? "#EFF6FF" : "#FFF",
                        borderRadius: "10px",
                        padding: "1.5rem 1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {theme === "dark" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "#2563EB",
                            color: "#FFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "1.75rem",
                          color: "#8B5CF6",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <Moon size={28} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0F172A" }}>
                        {t("systemSpace.darkMode", "Mode Sombre")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#64748B",
                          marginTop: "0.35rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {t("systemSpace.darkModeDesc", "Idéal pour réduire la fatigue oculaire et en environnement sombre")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Langue / Language */}
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {t("systemSpace.language", "Langue / Language")}
                  </h3>
                  <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#64748B" }}>
                    {t("systemSpace.languageDesc", "Sélectionnez la langue principale de l'interface d'administration")}
                  </p>

                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t("systemSpace.languageSelect", "Langue d'affichage du portail (Select interactif) :")}
                  </label>

                  {/* Dropdown Container */}
                  <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#2563EB",
                        color: "#FFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.45rem",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      {lang.toUpperCase()}
                    </div>
                    <select
                      value={lang}
                      onChange={(e) => handleLangChange(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 2.5rem 0.65rem 3.5rem",
                        borderRadius: "8px",
                        border: "1.5px solid #3B82F6",
                        background: "#FFF",
                        color: "#0F172A",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="fr">{t("systemSpace.frenchOption", "Français (France) - Langue par défaut")}</option>
                      <option value="en">{t("systemSpace.englishOption", "English (US) - Second language")}</option>
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: "absolute",
                        right: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#0F172A",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "0.4rem" }}>
                    {t("systemSpace.availableOptions", "Options disponibles dans la liste déroulante :")}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => handleLangChange("fr")}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: lang === "fr" ? "1px solid #3B82F6" : "1px solid #E2E8F0",
                        background: lang === "fr" ? "#EFF6FF" : "#F1F5F9",
                        color: lang === "fr" ? "#1D4ED8" : "#475569",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      [FR] Français
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLangChange("en")}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: lang === "en" ? "1px solid #3B82F6" : "1px solid #E2E8F0",
                        background: lang === "en" ? "#EFF6FF" : "#F1F5F9",
                        color: lang === "en" ? "#1D4ED8" : "#475569",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      [EN] English
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Card / Footer */}
              <div
                style={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  {t("systemSpace.infoNotice", "Info : Les modifications des paramètres généraux sont appliquées immédiatement pour votre session.")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {savedFeedback && (
                    <span style={{ fontSize: "0.82rem", color: "#16A34A", fontWeight: 600 }}>
                      {t("systemSpace.preferencesSaved", "✓ Préférences enregistrées")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    style={{
                      background: "#0F172A",
                      color: "#FFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.65rem 1.5rem",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                    }}
                  >
                    {t("systemSpace.savePreferences", "Enregistrer les préférences")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </SpacePageLayout>
  );
};

export default SystemSpacePage;
