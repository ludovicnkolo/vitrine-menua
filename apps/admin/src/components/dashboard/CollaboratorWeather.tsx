import React from "react";
import { useTranslation } from "react-i18next";

export interface CollaboratorData {
  name: string;
  role?: string;
  roleCategory?: string;
  tachesEnCours?: number;
}

export interface CollaboratorWeatherProps {
  collabs: CollaboratorData[];
  selectedRoleFilter: string;
  onRoleFilterChange: (role: string) => void;
}

const CollaboratorWeather: React.FC<CollaboratorWeatherProps> = ({
  collabs,
  selectedRoleFilter,
  onRoleFilterChange,
}) => {
  const { t } = useTranslation();

  const getInitials = (collab: CollaboratorData) => {
    const name = (collab.name || "").trim();
    if (!name) return "CO";
    const words = name.split(/\s+/).filter((w) => w && !/^[.\-–—]+$/.test(w));
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] border-t-4 border-t-blue-600 rounded-xl py-5 px-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-[var(--text-main)] m-0 mb-1 text-[1rem]">
            {t("dashboard.workloadWeather", "Météo de Charge (En cours)")}
          </h3>
          <p className="m-0 text-[0.78rem] text-[var(--text-muted)]">
            {t(
              "dashboard.workloadSub",
              "Répartition de la charge opérationnelle par collaborateur et rôle"
            )}
          </p>
        </div>
        <select
          value={selectedRoleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="text-[var(--text-main)] cursor-pointer py-1.5 pl-3 pr-6 rounded-lg border-[1.5px] border-blue-500 bg-[var(--bg-main)] text-[0.8rem] outline-none"
        >
          <option value="all">{t("common.allRoles", "Tous les rôles")}</option>
          <option value="responsable">{t("role.Responsable opérationnel", "Responsable")}</option>
          <option value="relecteur">{t("role.Relecteur", "Relecteur")}</option>
          <option value="collaborateur">{t("role.Collaborateur", "Collaborateur")}</option>
        </select>
      </div>

      {/* List of collaborators */}
      <div className="flex flex-col gap-2 flex-1">
        {collabs.map((collab, idx) => {
          const count = collab.tachesEnCours || 0;
          const initials = getInitials(collab);

          return (
            <div
              key={idx}
              className="flex items-center justify-between bg-[var(--bg-main)] border border-[var(--border)] border-l-4 border-l-blue-600 rounded-lg py-2.5 px-3.5 shadow-sm"
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  translate="no"
                  className="notranslate font-bold flex items-center justify-center w-8 h-8 min-w-[32px] max-w-[32px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[0.75rem] shrink-0 overflow-hidden select-none"
                >
                  <span translate="no" className="notranslate truncate">
                    {initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[var(--text-main)] text-[0.85rem] truncate">
                    {collab.name}
                  </div>
                  <div className="text-[0.72rem] text-[var(--text-muted)] mt-[1px] truncate">
                    {t("common.role", "Rôle")} :{" "}
                    {t(
                      `role.${collab.role || collab.roleCategory}`,
                      collab.role || collab.roleCategory || "Production"
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Badge Tâches uniquement */}
              <div className="flex items-center shrink-0">
                <span
                  className={`py-1 px-2.5 text-[0.75rem] font-semibold rounded-md border ${
                    count > 0
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {count} {t("dashboard.tasks", "tâche(s)")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollaboratorWeather;
