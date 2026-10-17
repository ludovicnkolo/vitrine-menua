import React from "react";
import { useTranslation } from "react-i18next";

const CmsSettingsTab = ({
  tab,
  loadingSettings,
  formSettings,
  setFormSettings,
  newBlacklistEmail,
  setNewBlacklistEmail,
  handleAddBlacklistEmail,
  handleRemoveBlacklistEmail,
  saveFormSettings,
}) => {
  const { t } = useTranslation();

  if (tab !== "parametrage") return null;

  return (
    <div style={{ maxWidth: "1280px" }}>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-bold text-[var(--text-main)]"
          style={{ fontSize: "1.5rem", margin: "0 0 0.25rem 0" }}
        >
          {t("cms.formSettingsTitle", "Paramètres des formulaires du site")}
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#64748B", margin: 0 }}>
          {t(
            "cms.formSettingsSub",
            "Contrôlez l'ouverture des formulaires en ligne et la sécurité anti-spam"
          )}
        </p>
      </div>

      {loadingSettings ? (
        <div
          className="text-center"
          style={{ padding: "3rem", color: "#64748B" }}
        >
          {t("common.loading", "Chargement des paramètres...")}
        </div>
      ) : (
        <div>
          {/* Form toggles */}
          <div
            className="grid gap-6 mb-6"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {/* Contact Card */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid #E2E8F0",
                borderTop: "4px solid #2563EB",
                borderRadius: "12px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                className="font-bold text-[var(--text-main)]"
                style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}
              >
                {t("cms.contactCardTitle", "Formulaire de Contact Public")}
              </h3>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.78rem",
                  color: "#64748B",
                }}
              >
                {t(
                  "cms.contactCardSub",
                  "Recueille les demandes des prospects intéressés via le formulaire de contact du site web."
                )}
              </p>

              <label
                className="flex items-center cursor-pointer"
                style={{
                  gap: "0.75rem",
                  padding: "0.85rem 1.25rem",
                  background: "#F0FDF4",
                  border: "1px solid #86EFAC",
                  borderRadius: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={formSettings.contactFormEnabled}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      contactFormEnabled: e.target.checked,
                    })
                  }
                  className="cursor-pointer"
                  style={{ width: "18px", height: "18px", accentColor: "#2563EB" }}
                />
                <div>
                  <div
                    className="font-bold"
                    style={{ fontSize: "0.85rem", color: "#15803D" }}
                  >
                    {formSettings.contactFormEnabled
                      ? t(
                          "cms.contactEnabled",
                          "Activé (Accepte les soumissions)"
                        )
                      : t(
                          "cms.contactDisabled",
                          "Désactivé (Bloque les soumissions)"
                        )}
                  </div>
                </div>
              </label>
            </div>

            {/* Recrutement Card */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid #E2E8F0",
                borderTop: "4px solid #9333EA",
                borderRadius: "12px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                className="font-bold text-[var(--text-main)]"
                style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}
              >
                {t(
                  "cms.recruitmentCardTitle",
                  "Formulaire Recrutement (Carrières)"
                )}
              </h3>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.78rem",
                  color: "#64748B",
                }}
              >
                {t(
                  "cms.recruitmentCardSub",
                  "Recueille les candidatures via le formulaire de recrutement du site web."
                )}
              </p>

              <label
                className="flex items-center cursor-pointer"
                style={{
                  gap: "0.75rem",
                  padding: "0.85rem 1.25rem",
                  background: "#F0FDF4",
                  border: "1px solid #86EFAC",
                  borderRadius: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={formSettings.recrutementFormEnabled}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      recrutementFormEnabled: e.target.checked,
                    })
                  }
                  className="cursor-pointer"
                  style={{ width: "18px", height: "18px", accentColor: "#2563EB" }}
                />
                <div>
                  <div
                    className="font-bold"
                    style={{ fontSize: "0.85rem", color: "#15803D" }}
                  >
                    {formSettings.recrutementFormEnabled
                      ? t(
                          "cms.recruitmentEnabled",
                          "Activé (Accepte les candidatures)"
                        )
                      : t(
                          "cms.recruitmentDisabled",
                          "Désactivé (Bloque les candidatures)"
                        )}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Anti-Spam Section */}
          <div
            className="p-6 mb-6"
            style={{
              background: "#FFF",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: "0.4rem" }}
            >
              <span style={{ fontSize: "1rem" }}>🛑</span>
              <h3
                className="font-bold text-[var(--text-main)]"
                style={{ fontSize: "0.95rem" }}
              >
                {t(
                  "cms.antiSpamTitle",
                  "Adresses Email bloquées (Protection Anti-Spam)"
                )}
              </h3>
            </div>
            <p
              style={{
                margin: "0 0 1.25rem 0",
                fontSize: "0.8rem",
                color: "#64748B",
              }}
            >
              {t(
                "cms.antiSpamSub",
                "Les adresses répertoriées ici ne peuvent pas soumettre de formulaires de contact ou de candidatures"
              )}
            </p>

            <div
              style={{
                height: "1px",
                background: "#F1F5F9",
                marginBottom: "1.25rem",
              }}
            />

            <label
              className="block font-semibold mb-2"
              style={{ fontSize: "0.8rem", color: "#374151" }}
            >
              {t(
                "cms.addBlacklistLabel",
                "Ajouter une nouvelle adresse indésirable :"
              )}
            </label>
            <div
              className="flex"
              style={{ gap: "0.75rem", marginBottom: "1.25rem" }}
            >
              <input
                type="email"
                placeholder="spam@example.com"
                value={newBlacklistEmail}
                onChange={(e) => setNewBlacklistEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBlacklistEmail();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "0.65rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #3B82F6",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleAddBlacklistEmail}
                className="text-white font-semibold cursor-pointer bg-[var(--primary)] hover:opacity-90 transition-opacity"
                style={{
                  padding: "0.65rem 1.25rem",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                }}
              >
                {t("cms.addBlacklistBtn", "+ Ajouter")}
              </button>
            </div>

            <div
              className="font-semibold mb-2"
              style={{ fontSize: "0.8rem", color: "var(--text-main)" }}
            >
              {t("cms.blockedCount", {
                count: formSettings.blacklistedEmails?.length || 0,
                defaultValue: `Adresses actuellement bloquées (${
                  formSettings.blacklistedEmails?.length || 0
                } active(s)) :`,
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {(formSettings.blacklistedEmails?.length === 0 ||
                !formSettings.blacklistedEmails) && (
                <span style={{ color: "#94A3B8", fontSize: "0.82rem" }}>
                  {t("cms.noBlockedEmail", "Aucun email bloqué.")}
                </span>
              )}
              {formSettings.blacklistedEmails?.map((email) => (
                <div
                  key={email}
                  className="inline-flex items-center gap-2 font-medium"
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.82rem",
                  }}
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlacklistEmail(email)}
                    className="cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      lineHeight: 1,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      padding: "0 2px",
                    }}
                    title={`Débloquer ${email}`}
                    aria-label={`Débloquer ${email}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {t(
                "cms.settingsNotice",
                "Toute modification des formulaires prend effet immédiatement sur le site public."
              )}
            </span>
            <button
              type="button"
              onClick={saveFormSettings}
              className="text-white font-semibold cursor-pointer bg-[var(--primary)] hover:opacity-90 transition-opacity"
              style={{
                padding: "0.65rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.88rem",
              }}
            >
              {t("cms.saveSettingsBtn", "Enregistrer les paramètres")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsSettingsTab;
