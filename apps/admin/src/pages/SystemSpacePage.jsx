import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Check, ChevronDown } from "lucide-react";
import SpacePageLayout from "../components/SpacePageLayout";
import i18n from "../i18n";

// --- Lazy Loading de la vue Audit pour alléger le bundle ---
const AuditPage = lazy(() => import("./AuditPage.tsx"));

const TabLoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center text-sm text-[var(--text-muted)]">
    <span className="animate-pulse">Chargement du journal d'audit...</span>
  </div>
);

// Drapeaux vectoriels réalistes (Français / USA) conformes aux maquettes
const FlagFR = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] shadow-sm flex-shrink-0"
    style={{ border: "1px solid rgba(0,0,0,0.12)" }}
    aria-label="Drapeau Français"
  >
    <rect width="8" height="16" fill="#002395" />
    <rect x="8" width="8" height="16" fill="#FFFFFF" />
    <rect x="16" width="8" height="16" fill="#ED2939" />
  </svg>
);

const FlagEN = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] shadow-sm flex-shrink-0"
    style={{ border: "1px solid rgba(0,0,0,0.12)" }}
    aria-label="Drapeau Anglais"
  >
    <rect width="24" height="16" fill="#B22234" />
    <rect y="1.23" width="24" height="1.23" fill="#FFFFFF" />
    <rect y="3.69" width="24" height="1.23" fill="#FFFFFF" />
    <rect y="6.15" width="24" height="1.23" fill="#FFFFFF" />
    <rect y="8.61" width="24" height="1.23" fill="#FFFFFF" />
    <rect y="11.07" width="24" height="1.23" fill="#FFFFFF" />
    <rect y="13.53" width="24" height="1.23" fill="#FFFFFF" />
    <rect width="9.6" height="8.6" fill="#3C3B6E" />
  </svg>
);

// Composant interne pour l'onglet Configuration
// Conserve les sélections en état local jusqu'à ce que l'utilisateur clique sur "Enregistrer les préférences"
const ConfigurationView = ({ savedTheme, savedLang, onSave, savedFeedback }) => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(savedTheme);
  const [selectedLang, setSelectedLang] = useState(savedLang);

  useEffect(() => {
    setSelectedTheme(savedTheme);
  }, [savedTheme]);

  useEffect(() => {
    setSelectedLang(savedLang);
  }, [savedLang]);

  const isDarkMode = savedTheme === "dark";

  return (
    <div className="mx-auto" style={{ maxWidth: "1280px" }}>
      {/* Header : Style éditorial serif Image 2 avec sous-titre conservé */}
      <div className="mb-6">
        <h1
          className="font-serif text-[var(--text-main)]"
          style={{
            fontFamily: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
            fontSize: "2.35rem",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: "0 0 0.35rem 0",
          }}
        >
          {t("systemSpace.titleShort", "Configuration")}
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.875rem" }}>
          {t(
            "systemSpace.subtitle",
            "Personnalisez l'environnement de travail, les préférences d'affichage et la localisation"
          )}
        </p>
      </div>

      {/* Grille de 2 Cartes */}
      <div
        className="grid gap-6 mb-6"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Carte 1 : Apparence */}
        <div
          className="p-6 transition-all duration-200"
          style={{
            background: isDarkMode ? "#131B2E" : "#FFFFFF",
            border: isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0",
            borderRadius: "12px",
            boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.35)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h3
            className="font-bold text-[var(--text-main)]"
            style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem" }}
          >
            {t("systemSpace.appearance", "Apparence")}
          </h3>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Option Mode Clair */}
            <div
              onClick={() => setSelectedTheme("light")}
              className="cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center"
              style={{
                borderRadius: "10px",
                padding: "1.35rem 1rem",
                textAlign: "center",
                border: selectedTheme === "light"
                  ? (isDarkMode ? "2px solid #3B82F6" : "1.5px solid #3B82F6")
                  : (isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0"),
                background: selectedTheme === "light"
                  ? (isDarkMode ? "#1E293B" : "#EFF6FF")
                  : (isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#FFFFFF"),
                boxShadow: selectedTheme === "light"
                  ? "0 0 0 1px #3B82F6, 0 4px 12px rgba(59, 130, 246, 0.12)"
                  : "none",
              }}
            >
              {selectedTheme === "light" && (
                <div
                  className="absolute text-white flex items-center justify-center shadow-sm"
                  style={{
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#2563EB",
                    fontSize: "11px",
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
              )}
              <div className="mb-2" style={{ color: isDarkMode ? "#F59E0B" : "#1E293B" }}>
                <Sun size={26} strokeWidth={2.2} />
              </div>
              <div
                className="font-medium"
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-main)",
                }}
              >
                {t("systemSpace.lightMode", "Mode Clair")}
              </div>
            </div>

            {/* Option Mode Sombre */}
            <div
              onClick={() => setSelectedTheme("dark")}
              className="cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center"
              style={{
                borderRadius: "10px",
                padding: "1.35rem 1rem",
                textAlign: "center",
                border: selectedTheme === "dark"
                  ? "2px solid #6366F1"
                  : (isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0"),
                background: selectedTheme === "dark"
                  ? "#1E2640"
                  : (isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#FFFFFF"),
                boxShadow: selectedTheme === "dark"
                  ? "0 0 0 1px #6366F1, 0 4px 16px rgba(99, 102, 241, 0.25)"
                  : "none",
              }}
            >
              {selectedTheme === "dark" && (
                <div
                  className="absolute text-white flex items-center justify-center shadow-sm"
                  style={{
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#6366F1",
                    fontSize: "11px",
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
              )}
              <div
                className="mb-2"
                style={{
                  color: selectedTheme === "dark" ? "#A855F7" : "#1E293B",
                }}
              >
                <Moon size={26} strokeWidth={2.2} />
              </div>
              <div
                className="font-medium"
                style={{
                  fontSize: "0.95rem",
                  color: selectedTheme === "dark" ? "#F8FAFC" : "var(--text-main)",
                }}
              >
                {t("systemSpace.darkMode", "Mode Sombre")}
              </div>
            </div>
          </div>
        </div>

        {/* Carte 2 : Langue */}
        <div
          className="p-6 transition-all duration-200"
          style={{
            background: isDarkMode ? "#131B2E" : "#FFFFFF",
            border: isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0",
            borderRadius: "12px",
            boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.35)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h3
            className="font-bold text-[var(--text-main)]"
            style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem" }}
          >
            {t("systemSpace.language", "Langue")}
          </h3>

          <label
            className="block font-medium text-[var(--text-main)] mb-2"
            style={{ fontSize: "0.88rem" }}
          >
            {t("systemSpace.languageLabel", "Langue")}
          </label>

          {/* Dropdown interactif avec vrai drapeau */}
          <div className="relative">
            <div
              className="absolute flex items-center pointer-events-none"
              style={{
                left: "0.9rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              {selectedLang === "fr" ? <FlagFR /> : <FlagEN />}
            </div>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full font-medium cursor-pointer transition-all duration-200"
              style={{
                padding: "0.68rem 2.5rem 0.68rem 3.4rem",
                borderRadius: "8px",
                border: isDarkMode ? "1.5px solid #6366F1" : "1.5px solid #3B82F6",
                background: isDarkMode ? "#0F172A" : "#FFFFFF",
                color: "var(--text-main)",
                fontSize: "0.9rem",
                outline: "none",
                appearance: "none",
                boxShadow: isDarkMode
                  ? "0 0 0 3px rgba(99, 102, 241, 0.2)"
                  : "0 0 0 3px rgba(59, 130, 246, 0.12)",
              }}
            >
              <option value="fr">{t("systemSpace.frenchOptionShort", "Français (FR)")}</option>
              <option value="en">{t("systemSpace.englishOptionShort", "English (EN)")}</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute text-[var(--text-muted)] pointer-events-none"
              style={{ right: "0.9rem", top: "50%", transform: "translateY(-50%)" }}
            />
          </div>
        </div>
      </div>

      {/* Barre du bas / Footer */}
      <div
        className="flex justify-between items-center flex-wrap gap-4 transition-all duration-200"
        style={{
          background: isDarkMode ? "#131B2E" : "#FFFFFF",
          border: isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.35)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          {t(
            "systemSpace.infoNotice",
            "Info : Cliquez sur \"Enregistrer les préférences\" pour appliquer et mémoriser vos modifications."
          )}
        </div>
        <div className="flex items-center gap-4">
          {savedFeedback && (
            <span className="font-semibold" style={{ fontSize: "0.82rem", color: "#16A34A" }}>
              {t("systemSpace.preferencesSaved", "✓ Préférences enregistrées")}
            </span>
          )}
          <button
            type="button"
            onClick={() => onSave(selectedTheme, selectedLang)}
            className="font-medium cursor-pointer transition-all duration-150 shadow-sm"
            style={{
              background: "#1E293B",
              border: isDarkMode ? "1px solid #38BDF8" : "1px solid transparent",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "0.65rem 1.6rem",
              fontSize: "0.88rem",
            }}
          >
            {t("systemSpace.savePreferences", "Enregistrer les préférences")}
          </button>
        </div>
      </div>
    </div>
  );
};

const SystemSpacePage = ({ userRole }) => {
  const { t } = useTranslation();

  // Préférences enregistrées et persistées en localStorage
  const [savedTheme, setSavedTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminTheme") || "light";
    }
    return "light";
  });

  const [savedLang, setSavedLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminLang") || i18n.language || "fr";
    }
    return "fr";
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  // Synchronisation globale du thème au montage et écoute des changements
  useEffect(() => {
    const syncTheme = () => {
      const storedTheme = localStorage.getItem("adminTheme") || "light";
      const storedLang = localStorage.getItem("adminLang") || "fr";
      setSavedTheme(storedTheme);
      setSavedLang(storedLang);
      const isDark = storedTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark", isDark);
      if (i18n.language !== storedLang) {
        i18n.changeLanguage(storedLang);
      }
    };
    syncTheme();

    window.addEventListener("adminThemeChanged", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("adminThemeChanged", syncTheme);
      window.removeEventListener("storage", syncTheme);

      // En sortant de l'Espace Système sans enregistrer, garantir la stricte restauration des préférences enregistrées
      const storedTheme = localStorage.getItem("adminTheme") || "light";
      const storedLang = localStorage.getItem("adminLang") || "fr";
      const isDark = storedTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark", isDark);
      if (i18n.language !== storedLang) {
        i18n.changeLanguage(storedLang);
      }
    };
  }, []);

  // Nettoyage sécurisé du feedback temporisé
  useEffect(() => {
    if (!savedFeedback) return;
    const timer = setTimeout(() => setSavedFeedback(false), 3000);
    return () => clearTimeout(timer);
  }, [savedFeedback]);

  // Contrôle des habilitations robuste
  const canSeeAudit = useMemo(() => {
    const role = userRole?.trim().toLowerCase();
    return role === "super-administrateur" || role === "administrateur technique";
  }, [userRole]);

  // Configuration mémorisée des onglets
  const tabs = useMemo(() => {
    const tabList = [];
    if (canSeeAudit) {
      tabList.push({
        id: "audit",
        label: t("systemSpace.tabs.audit", "Audit"),
        labelKey: "systemSpace.tabs.audit",
      });
    }
    tabList.push({
      id: "configuration",
      label: t("systemSpace.tabs.config", "Configuration"),
      labelKey: "systemSpace.tabs.config",
    });
    return tabList;
  }, [canSeeAudit, t]);

  const handleSavePreferences = (newTheme, newLang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminTheme", newTheme);
      localStorage.setItem("adminLang", newLang);
      setSavedTheme(newTheme);
      setSavedLang(newLang);
      const isDark = newTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark", isDark);
      window.dispatchEvent(new Event("adminThemeChanged"));
    }
    i18n.changeLanguage(newLang);
    setSavedFeedback(true);
  };

  return (
    <SpacePageLayout
      initialTab={canSeeAudit ? "audit" : "configuration"}
      tabs={tabs}
    >
      {(tab) => (
        <>
          {tab === "audit" && canSeeAudit && (
            <Suspense fallback={<TabLoadingFallback />}>
              <AuditPage />
            </Suspense>
          )}
          {tab === "configuration" && (
            <ConfigurationView
              key={tab}
              savedTheme={savedTheme}
              savedLang={savedLang}
              onSave={handleSavePreferences}
              savedFeedback={savedFeedback}
            />
          )}
        </>
      )}
    </SpacePageLayout>
  );
};

export default SystemSpacePage;
