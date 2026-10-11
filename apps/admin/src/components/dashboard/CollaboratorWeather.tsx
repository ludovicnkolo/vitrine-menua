import React from "react";
import { useTranslation } from "react-i18next";

export interface CollaboratorData {
  name: string;
  role?: string;
  roleCategory?: string;
  tachesEnCours?: number;
  etat?: string;
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
    const r = (collab.role || collab.roleCategory || "").toLowerCase();
    if (r.includes("responsable") || r.includes("relecteur")) return "RE";
    if (r.includes("collab") || r.includes("production")) return "CO";
    return collab.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col bg-white border border-[#E2E8F0] border-t-4 border-t-blue-600 rounded-xl py-5 px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-[var(--text-main)] m-0 mb-1 text-[1rem]">
            {t("dashboard.workloadWeather", "Météo de Charge (En cours)")}
          </h3>
          <p className="m-0 text-[0.78rem] text-slate-500">
            {t(
              "dashboard.workloadSub",
              "Répartition de la charge opérationnelle par collaborateur et rôle"
            )}
          </p>
        </div>
        <select
          value={selectedRoleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="text-[var(--text-main)] cursor-pointer py-1.5 pl-3 pr-6 rounded-lg border-[1.5px] border-blue-500 bg-white text-[0.8rem] outline-none"
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
          const hasTasks = count > 0;
          const stripeColor = hasTasks ? "border-l-blue-600" : "border-l-emerald-500";
          const initials = getInitials(collab);

          return (
            <div
              key={idx}
              className={`flex items-center justify-between bg-white border border-slate-100 border-l-4 ${stripeColor} rounded-lg py-2.5 px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-3">
                <div className="font-bold flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 text-[0.75rem]">
                  {initials}
                </div>
                <div>
                  <div className="font-bold text-[var(--text-main)] text-[0.85rem]">
                    {collab.name}
                  </div>
                  <div className="text-[0.72rem] text-slate-500 mt-[1px]">
                    {t("common.role", "Rôle")} :{" "}
                    {t(
                      `role.${collab.role || collab.roleCategory}`,
                      collab.role || collab.roleCategory || "Production"
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Badges */}
              <div className="flex items-center gap-2">
                {hasTasks ? (
                  <span className="font-semibold inline-flex items-center bg-blue-50 text-blue-600 rounded-full py-1 px-2.5 text-[0.75rem] gap-1">
                    <span className="text-[0.65rem]">●</span> {t("dashboard.inActivity", "En activité")}
                  </span>
                ) : (
                  <span className="font-semibold inline-flex items-center bg-emerald-50 text-emerald-600 rounded-full py-1 px-2.5 text-[0.75rem] gap-1">
                    <span className="text-[0.65rem]">●</span> {t("dashboard.available", "Disponible")}
                  </span>
                )}

                <span
                  className={`py-1 px-2.5 text-[0.75rem] font-semibold rounded-md border ${
                    hasTasks
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
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
