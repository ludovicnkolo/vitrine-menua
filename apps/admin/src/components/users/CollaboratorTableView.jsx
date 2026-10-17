import React from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import { formatDate, getRoleBadge, getStatusBadge } from "../../utils/helpers";

const CollaboratorTableView = ({
  paginatedUsers = [],
  loading,
  t,
  pageUsers,
  PAGE_SIZE,
  setConsultUser,
  setEditUser,
  handleDeleteUser,
}) => {
  return (
              <table className="w-full" style={{tableLayout:"fixed"}}>
                <thead>
                  <tr>
                    <th className="text-center font-mono" style={{ width: "50px" }}>N°</th>
                    <th className="text-left" style={{ width: "23%", paddingLeft: "1.25rem" }}>{t("users.columns.name", "Nom")}</th>
                    <th style={{ width: "20%" }}>{t("users.columns.email", "Email")}</th>
                    <th className="text-center" style={{ width: "18%" }}>{t("users.columns.role", "Rôle")}</th>
                    <th className="text-center" style={{ width: "100px" }}>{t("users.columns.status", "Statut")}</th>
                    <th className="table-date-cell text-center" style={{ width: "155px" }}>{t("users.columns.lastLogin", "Dernière Connexion")}</th>
                    <th className="text-center" style={{ width: "90px" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                        {loading ? t("common.loading", "Chargement...") : t("users.noUsers", "Aucun collaborateur trouvé.")}
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u, index) => (
                    <tr key={u.id}>
                      <td
                        className="text-center font-mono"
                        style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                      >
                        <div className="truncate-name font-normal text-center" style={{ maxWidth: "100%" }}>
                          {String((pageUsers - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                        </div>
                      </td>
                      <td className="text-left" style={{ paddingLeft: "1.25rem" }}>
                        <div className="truncate-name text-left font-medium text-[var(--text-main)]" style={{ maxWidth: "100%" }} title={u.name}>
                          {u.name}
                        </div>
                      </td>
                      <td>
                        <div
                          className="truncate-name"
                          style={{
                            maxWidth: "100%",
                            color: "var(--text-muted)",
                          }}
                          title={u.email}
                        >
                          {u.email}
                        </div>
                      </td>
                      <td className="text-center">
                        {getRoleBadge(u.role?.name || "Non défini")}
                      </td>
                      <td className="text-center">
                        <span
                          style={{
                            color: !u.isBlocked
                              ? "var(--success)"
                              : "var(--danger)",
                          }}
                        >
                          {!u.isBlocked ? t("common.active", "Actif") : t("common.inactive", "Inactif")}
                        </span>
                      </td>
                      <td
                        className="table-date-cell text-center" style={{color:"var(--text-muted)",width:"155px"}}
                      >
                        {u.lastLogin
                          ? formatDate(u.lastLogin)
                          : t("users.neverConnected", "Jamais connecté")}
                      </td>
                      <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                        <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                          {/* Sommet de la pyramide : Modifier */}
                          <button
                            type="button"
                            onClick={() => setEditUser(u)}
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                            title={t("common.edit", "Modifier")}
                          >
                            <Pencil size={14} />
                          </button>
                          {/* Base de la pyramide : Consulter + Supprimer */}
                          <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => setConsultUser(u)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                              title={t("common.view", "Consulter")}
                            >
                              <Eye size={14} />
                            </button>
                            {u.role?.name !== "Super-administrateur" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                                title={t("common.delete", "Supprimer")}
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
  );
};

export default CollaboratorTableView;
