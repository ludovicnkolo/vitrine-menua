import React from "react";
import { AlertTriangle } from "lucide-react";
import { getDeadlineEvaluation } from "../../utils/helpers";

const DOSSIER_PILL_MAP = {
  NOUVEAU: { text: "Nouveau", bg: "#EFF6FF", color: "#2563EB", dot: "#2563EB" },
  EN_COURS: { text: "En cours", bg: "#FEF3C7", color: "#B45309", dot: "#D97706" },
  EN_APPROBATION: { text: "En approbation", bg: "#FAF5FF", color: "#7E22CE", dot: "#9333EA" },
  VERIFIER: { text: "À vérifier", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
  A_CORRIGER: { text: "À corriger", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
  TERMINE: { text: "Terminé", bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  ARCHIVE: { text: "Archivé", bg: "#F1F5F9", color: "#475569", dot: "#64748B" },
  BLOQUE: { text: "Bloqué", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
  EN_ATTENTE: { text: "En attente", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
  ANNULEE: { text: "Annulé", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
};

const renderPillBadge = (status) => {
  const s = String(status || "NOUVEAU").toUpperCase();
  const c = DOSSIER_PILL_MAP[s] || { text: s, bg: "#F1F5F9", color: "#475569", dot: "#64748B" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: c.bg,
        color: c.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.2rem 0.65rem",
        borderRadius: "9999px",
      }}
    >
      <span style={{ fontSize: "0.75rem", color: c.dot }}>●</span>
      {c.text}
    </span>
  );
};

const getTaskSubject = (desc) => {
  if (!desc) return "";
  const match = desc.match(/\[OBJET\]:\s*(.*?)(?=\n\[|$)/);
  return match ? match[1].trim() : desc.split("\n")[0];
};

const DossierTasksCard = ({ associatedTasks = [], onSelectTask }) => {
  const activeTasks = associatedTasks.filter(
    (t) => !["TERMINE", "ARCHIVE", "ANNULEE"].includes(t.status)
  );

  const tasksByStatus = associatedTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const statusNameMap = {
    NOUVEAU: "Nouveau",
    EN_COURS: "En cours",
    EN_APPROBATION: "En approbation",
    VERIFIER: "À vérifier",
    A_CORRIGER: "À corriger",
    TERMINE: "Terminé",
    ARCHIVE: "Archivé",
    BLOQUE: "Bloqué",
    EN_ATTENTE: "En attente",
  };

  const breakdownList = Object.entries(tasksByStatus).map(
    ([st, cnt]) =>
      `${cnt} mission${cnt > 1 ? "s" : ""} en statut ${statusNameMap[st] || st}`
  );

  const breakdownString =
    breakdownList.length > 0
      ? breakdownList.join(", ") + "."
      : "Aucune mission active.";

  return (
    <div
      className="p-6"
      style={{
        background: "#FFF",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="font-bold text-[var(--text-main)]"
        style={{ fontSize: "0.95rem", marginBottom: "0.2rem" }}
      >
        Vues des missions associées
      </div>
      <div className="mb-4" style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
        Suivi direct des missions rattachées à ce dossier
      </div>

      {associatedTasks.length > 0 ? (
        <div className="flex flex-col" style={{ gap: "0.75rem" }}>
          {associatedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="cursor-pointer"
              style={{
                background: "#FFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "0.85rem 1.1rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(37,99,235,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="flex justify-between items-center"
                style={{ marginBottom: "0.35rem" }}
              >
                <span
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  Mission {task.reference || task.id}
                </span>
                {renderPillBadge(task.status)}
              </div>
              <div
                className="flex items-center gap-2 flex-wrap"
                style={{ fontSize: "0.8rem", color: "#64748B" }}
              >
                <span>
                  Objet : {getTaskSubject(task.description) || task.subject || "-"}
                </span>
                <span>•</span>
                {(() => {
                  const dl = getDeadlineEvaluation(task);
                  if (dl.status === "NONE") {
                    return (
                      <span>
                        Créé le {new Date(task.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    );
                  }
                  if (dl.isCritical) {
                    return (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-red-700 bg-red-100"
                        title={
                          dl.isOverdue
                            ? "Échéance dépassée (en retard)"
                            : "Échéance critique (< 24h)"
                        }
                      >
                        <AlertTriangle size={12} style={{ color: "#DC2626" }} />
                        Échéance : {dl.label}
                      </span>
                    );
                  }
                  return (
                    <span className="font-semibold text-green-700">
                      Échéance : {dl.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="p-6 text-center"
          style={{
            background: "#F8FAFC",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Aucune mission associée pour le moment.
        </div>
      )}

      {associatedTasks.length > 0 && (
        <div
          style={{
            marginTop: "1.25rem",
            background: "#F0FDF4",
            border: "1px solid #DCFCE7",
            borderRadius: "8px",
            padding: "0.85rem 1.1rem",
            color: "#166534",
          }}
        >
          <div
            className="font-bold flex items-center"
            style={{ fontSize: "0.875rem", gap: "0.4rem" }}
          >
            ✓ État d'avancement global : {activeTasks.length} mission
            {activeTasks.length > 1 ? "s" : ""} active
            {activeTasks.length > 1 ? "s" : ""}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#15803D",
              marginTop: "0.25rem",
            }}
          >
            {breakdownString}
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierTasksCard;
