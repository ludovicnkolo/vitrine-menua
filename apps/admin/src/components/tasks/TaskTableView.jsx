import React from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import { getSafeApiUrl } from "../../utils/helpers";

const TaskTableView = ({
  tasks = [],
  mode,
  getDeadlineEvaluation,
  canEditTaskRow,
  openEditTask,
  setConsultTask,
  currentUser,
  fetchData,
}) => {
  return (
    <div className="table-wrapper">
        <table className="w-full" style={{tableLayout:"fixed"}}>
          <thead>
            <tr>
              <th className="text-center" style={{width:"50px"}}>N°</th>
              <th className="text-left" style={{width:"28%",paddingLeft:"1.25rem"}}>
                {mode === "MISSION" ? "Mission" : "Tâche"}
              </th>
              <th className="text-left" style={{width:"20%"}}>Assigné à</th>
              <th
                className="table-date-cell text-center" style={{width:"135px"}}
              >
                Échéance
              </th>
              <th className="text-center" style={{width:"120px"}}>Statut</th>
              <th className="table-date-cell text-center" style={{width:"165px"}}>Créé le</th>
              <th className="text-center" style={{width:"80px"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, index) => {
              const deadline = getDeadlineEvaluation(t);
              const isLocked =
                ["BLOQUE", "EN_ATTENTE"].includes(t.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.mission?.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.mission?.dossier?.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.dossier?.status);
              const itemReference =
                t.reference ||
                (mode === "MISSION"
                  ? `MSN-${String(index + 1).padStart(2, "0")}`
                  : `TCH-${String(index + 1).padStart(2, "0")}`);
              return (
                <tr
                  key={t.id}
                  style={
                    t.status === "EN_ATTENTE"
                      ? { backgroundColor: "#FFFDF0", opacity: 0.88 }
                      : isLocked
                      ? { backgroundColor: "#F8FAFC", opacity: 0.75 }
                      : {}
                  }
                >
                  <td className="text-center">
                    <div
                      className="truncate-name font-normal text-center" style={{maxWidth:"100%"}}
                      title={String(index + 1).padStart(2, "0")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </td>
                  <td className="text-left" style={{paddingLeft:"1.25rem"}}>
                    <div
                      className="truncate-name font-medium text-[var(--text-main)]" style={{maxWidth:"100%"}}
                      title={itemReference}
                    >
                      {itemReference}
                    </div>
                  </td>

                  <td className="text-left">
                    <div
                      className="truncate-name"
                      style={{ margin: 0, maxWidth: "100%" }}
                      title={t.assignedTo?.name || "Non assigné"}
                    >
                      {t.assignedTo?.name || "Non assigné"}
                    </div>
                  </td>
                  <td className="table-date-cell text-center">
                    {(() => {
                      if (deadline.status === "NONE") {
                        return (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                            Aucune
                          </span>
                        );
                      }
                      if (deadline.status === "DONE") {
                        return (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            {deadline.label}
                          </span>
                        );
                      }
                      if (deadline.isCritical) {
                        return (
                          <span
                            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded"
                            style={{
                              backgroundColor: "#FEE2E2",
                              border: "1px solid #FECACA",
                              color: "#991B1B",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              lineHeight: 1.2,
                            }}
                            title={
                              deadline.isOverdue
                                ? "Échéance dépassée (en retard)"
                                : "Échéance critique : arrive à terme sous 24h ou moins"
                            }
                          >
                            <AlertTriangle
                              size={13}
                              style={{ color: "#DC2626", strokeWidth: 2.5, flexShrink: 0 }}
                              aria-hidden="true"
                            />
                            <span>{deadline.label}</span>
                          </span>
                        );
                      }
                      return (
                        <span
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded"
                          style={{
                            backgroundColor: "#F0FDF4",
                            border: "1px solid #DCFCE7",
                            color: "#166534",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            lineHeight: 1.2,
                          }}
                          title="Échéance dans les délais (> 24h)"
                        >
                          <span>{deadline.label}</span>
                        </span>
                      );
                    })()}
                  </td>
                  <td className="text-center">
                    {getStatusBadge(t.status)}
                  </td>
                  <td
                    className="table-date-cell text-center" style={{color:"var(--text-muted)"}}
                  >
                    {formatDate(t.createdAt)}
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                    <div className="flex flex-col items-center" style={{ gap: "3px" }}>
                      {/* Sommet de la pyramide : Modifier */}
                      {canEditTaskRow(t) && (
                        <button
                          type="button"
                          onClick={() => openEditTask(t)}
                          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                          title={mode === "MISSION" ? "Modifier la mission" : "Modifier la tâche"}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {/* Base de la pyramide : Consulter + Supprimer */}
                      <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => setConsultTask(t)}
                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                        title={mode === "MISSION" ? "Consulter la mission" : "Consulter la tâche"}
                      >
                        <Eye size={14} />
                      </button>
                      {(currentUser?.role === "Super-administrateur" ||
                        currentUser?.role?.name === "Super-administrateur" ||
                        currentUser?.role === "Responsable opérationnel" ||
                        currentUser?.role?.name ===
                          "Responsable opérationnel") && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              await window.customConfirm(
                                mode === "MISSION" 
                                  ? "Êtes-vous sûr de vouloir supprimer cette mission ?\n\nATTENTION : Cette action supprimera également, de façon hiérarchique, toutes les tâches associées vers la corbeille."
                                  : "Êtes-vous sûr de vouloir supprimer cette tâche ?\n\nElle sera déplacée vers la corbeille.",
                                mode === "MISSION" ? "Avertissement de suppression de la mission" : "Supprimer la tâche"
                              )
                            ) {
                              try {
                                const token =
                                  sessionStorage.getItem("adminToken");
                                const res = await fetch(
                                  new URL(
                                    getSafeApiUrl(
                                      `/api/crm/${mode === "MISSION" ? "tasks" : "taches"}/${encodeURIComponent(t.id)}`,
                                    ),
                                  ).toString(),
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                if (res.ok) fetchData();
                              } catch (e) {
                                console.error("Erreur suppr mission:", e);
                              }
                            }
                          }}
                          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                          title={mode === "MISSION" ? "Supprimer la mission" : "Supprimer la tâche"}
                        >
                          <Trash size={14} />
                        </button>
                      )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
};

export default TaskTableView;
