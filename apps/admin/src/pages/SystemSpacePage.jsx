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
            <div className="mx-auto" style={{maxWidth:"1280px"}}>
              {/* Header */}
              <div className="mb-6">
                <h1
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"1.6rem",margin:"0 0 0.25rem 0"}}
                >
                  {t("systemSpace.title", "Configuration de la Plateforme")}
                </h1>
                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.85rem" }}>
                  {t("systemSpace.subtitle", "Personnalisez l'environnement de travail, les préférences d'affichage et la localisation")}
                </p>
              </div>

              {/* 2 Cards Grid */}
              <div
                className="grid gap-6 mb-6" style={{gridTemplateColumns:"1fr 1fr"}}
              >
                {/* Card 1: Apparence */}
                <div
                  className="bg-[var(--surface)] p-6" style={{border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"var(--shadow-sm)"}}
                >
                  <h3
                    className="font-bold text-[var(--text-main)]" style={{margin:"0 0 0.25rem 0",fontSize:"1rem"}}
                  >
                    {t("systemSpace.appearance", "Apparence de l'interface")}
                  </h3>
                  <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {t("systemSpace.appearanceDesc", "Choisissez le thème d'affichage adapté à votre confort visuel")}
                  </p>

                  <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
                    {/* Mode Clair */}
                    <div
                      onClick={() => handleThemeChange("light")}
                      style={{
                        position: "relative",
                        border: theme === "light" ? "2px solid #3B82F6" : "1px solid var(--border)",
                        background: theme === "light" ? "#EFF6FF" : "var(--surface)",
                        borderRadius: "10px",
                        padding: "1.5rem 1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {theme === "light" && (
                        <div
                          className="absolute text-white flex items-center justify-center" style={{top:"8px",right:"8px",width:"18px",height:"18px",borderRadius:"50%",background:"#2563EB",fontSize:"11px"}}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div
                        className="flex justify-center mb-2" style={{fontSize:"1.75rem",color:"#F59E0B"}}
                      >
                        <Sun size={28} />
                      </div>
                      <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                        {t("systemSpace.lightMode", "Mode Clair")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
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
                        border: theme === "dark" ? "2px solid #3B82F6" : "1px solid var(--border)",
                        background: theme === "dark" ? "#1e3a5f" : "var(--surface)",
                        borderRadius: "10px",
                        padding: "1.5rem 1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {theme === "dark" && (
                        <div
                          className="absolute text-white flex items-center justify-center" style={{top:"8px",right:"8px",width:"18px",height:"18px",borderRadius:"50%",background:"#2563EB",fontSize:"11px"}}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div
                        className="flex justify-center mb-2" style={{fontSize:"1.75rem",color:"#8B5CF6"}}
                      >
                        <Moon size={28} />
                      </div>
                      <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                        {t("systemSpace.darkMode", "Mode Sombre")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
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
                  className="bg-[var(--surface)] p-6" style={{border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"var(--shadow-sm)"}}
                >
                  <h3
                    className="font-bold text-[var(--text-main)]" style={{margin:"0 0 0.25rem 0",fontSize:"1rem"}}
                  >
                    {t("systemSpace.language", "Langue / Language")}
                  </h3>
                  <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {t("systemSpace.languageDesc", "Sélectionnez la langue principale de l'interface d'administration")}
                  </p>

                  <label
                    className="block font-semibold text-[var(--text-main)] mb-2" style={{fontSize:"0.8rem"}}
                  >
                    {t("systemSpace.languageSelect", "Langue d'affichage du portail (Select interactif) :")}
                  </label>

                  {/* Dropdown Container */}
                  <div className="relative mb-4">
                    <div
                      className="absolute text-white font-bold" style={{left:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"#2563EB",fontSize:"0.75rem",padding:"0.2rem 0.45rem",borderRadius:"4px",pointerEvents:"none",zIndex:1}}
                    >
                      {lang.toUpperCase()}
                    </div>
                    <select
                      value={lang}
                      onChange={(e) => handleLangChange(e.target.value)}
                      className="w-full bg-[var(--surface)] text-[var(--text-main)] font-medium cursor-pointer" style={{padding:"0.65rem 2.5rem 0.65rem 3.5rem",borderRadius:"8px",border:"1.5px solid #3B82F6",fontSize:"0.88rem",outline:"none",appearance:"none"}}
                    >
                      <option value="fr">{t("systemSpace.frenchOption", "Français (France) - Langue par défaut")}</option>
                      <option value="en">{t("systemSpace.englishOption", "English (US) - Second language")}</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute text-[var(--text-main)]" style={{right:"0.85rem",top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}
                    />
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    {t("systemSpace.availableOptions", "Options disponibles dans la liste déroulante :")}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleLangChange("fr")}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: lang === "fr" ? "1px solid #3B82F6" : "1px solid var(--border)",
                        background: lang === "fr" ? "#EFF6FF" : "var(--bg-color)",
                        color: lang === "fr" ? "#1D4ED8" : "var(--text-muted)",
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
                        border: lang === "en" ? "1px solid #3B82F6" : "1px solid var(--border)",
                        background: lang === "en" ? "#EFF6FF" : "var(--bg-color)",
                        color: lang === "en" ? "#1D4ED8" : "var(--text-muted)",
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
                className="bg-[var(--surface)] flex justify-between items-center flex-wrap gap-4" style={{border:"1px solid var(--border)",borderRadius:"10px",padding:"1rem 1.5rem"}}
              >
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {t("systemSpace.infoNotice", "Info : Les modifications des paramètres généraux sont appliquées immédiatement pour votre session.")}
                </div>
                <div className="flex items-center gap-4">
                  {savedFeedback && (
                    <span className="font-semibold" style={{fontSize:"0.82rem",color:"#16A34A"}}>
                      {t("systemSpace.preferencesSaved", "✓ Préférences enregistrées")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="text-white font-semibold cursor-pointer" style={{background:"var(--text-main)",border:"none",borderRadius:"8px",padding:"0.65rem 1.5rem",fontSize:"0.88rem"}}
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
