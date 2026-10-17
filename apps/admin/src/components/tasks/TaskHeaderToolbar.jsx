import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const TaskHeaderToolbar = ({
  mode,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className="font-semibold text-[var(--text-main)]"
            style={{ fontSize: "1.5rem" }}
          >
            {mode === "MISSION"
              ? t("workspace.tabs.missions", "Missions")
              : t("workspace.tabs.taches", "Tâches")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {t("task.subtitle", "Suivi opérationnel et gestion des tâches")}
          </p>
        </div>
      </div>

      <div
        className="flex gap-4 mb-6 p-4"
        style={{
          background: "var(--surface)",
          borderRadius: "8px",
          border: "1px solid var(--border)",
        }}
      >
        <div className="relative" style={{ flex: 1 }}>
          <Search
            size={18}
            className="absolute"
            style={{
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder={t(
              "task.searchPlaceholder",
              "Rechercher par référence, responsable..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full text-[var(--text-main)]"
            style={{
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-main)",
            }}
          />
        </div>
        <select
          className="input-field text-[var(--text-main)] cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-main)",
            minWidth: "200px",
          }}
        >
          <option value="all">
            {t("task.allStatuses", "Tous les statuts")}
          </option>
          {mode === "TACHE" ? (
            <>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="EN_RELECTURE">En relecture</option>
              <option value="EN_APPROBATION">En approbation</option>
              <option value="APPROUVEE">Approuvée</option>
              <option value="A_CORRIGER">À corriger</option>
              <option value="BLOQUE">Bloqué</option>
              <option value="EN_ATTENTE">En attente</option>
            </>
          ) : (
            <>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="BLOQUE">Bloqué</option>
              <option value="EN_ATTENTE">En attente</option>
            </>
          )}
        </select>
      </div>
    </>
  );
};

export default TaskHeaderToolbar;
