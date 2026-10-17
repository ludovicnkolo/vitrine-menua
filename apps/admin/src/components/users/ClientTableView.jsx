import React from "react";
import { Eye, Pencil, Trash, CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const ClientTableView = ({
  paginatedClients = [],
  loading,
  t,
  pageClients,
  PAGE_SIZE,
  setConsultExternal,
  setEditExternal,
  handleDeleteClient,
}) => {
  return (
              <table className="w-full" style={{tableLayout:"fixed"}}>
                <thead>
                  <tr>
                    <th className="text-center font-mono" style={{ width: "50px" }}>N°</th>
                    <th className="text-left" style={{ width: "24%", paddingLeft: "1.25rem" }}>{t("users.columns.name", "Société / Nom")}</th>
                    <th style={{ width: "24%" }}>{t("users.columns.email", "Email")}</th>
                    <th className="text-center" style={{ width: "100px" }}>{t("users.columns.type", "Type")}</th>
                    <th className="text-center" style={{ width: "90px" }}>{t("users.columns.status", "État")}</th>
                    <th className="text-center" style={{ width: "140px" }}>Accès Portail</th>
                    <th className="table-date-cell text-center" style={{ width: "150px" }}>Créé le</th>
                    <th className="text-center" style={{ width: "95px" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[var(--text-muted)]">
                        {loading ? t("common.loading", "Chargement...") : t("users.noClients", "Aucun client trouvé.")}
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((c, index) => {
                      const isClientActive = String(c.status || "ACTIF").toUpperCase() === "ACTIF";
                      return (
                    <tr key={c.id}>
                      <td
                        className="text-center font-mono"
                        style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                      >
                        <div className="truncate-name font-normal text-center" style={{ maxWidth: "100%" }}>
                          {String((pageClients - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                        </div>
                      </td>
                      <td className="text-left" style={{ paddingLeft: "1.25rem" }}>
                        <div
                          className="truncate-name text-left font-medium text-[var(--text-main)]"
                          style={{ maxWidth: "100%" }}
                          title={(c.type === "Société" || c.type === "SOCIETE") ? c.entreprise?.raisonSociale || c.name : c.name}
                        >
                          {(c.type === "Société" || c.type === "SOCIETE") ? c.entreprise?.raisonSociale || "N/A" : c.name}
                        </div>
                      </td>
                      <td>
                        <div
                          className="truncate-name"
                          style={{
                            maxWidth: "100%",
                            color: "var(--text-muted)",
                          }}
                          title={c.email}
                        >
                          {c.email}
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className="font-medium"
                          style={{
                            color:
                              c.type === "Société" || c.type === "SOCIETE"
                                ? "var(--badge-societe-color, #2563EB)"
                                : c.type === "Anonyme" || c.type === "ANONYME"
                                  ? "var(--text-muted)"
                                  : "var(--badge-part-color, #7E22CE)",
                          }}
                        >
                          {c.type === "SOCIETE" || c.type === "Société"
                            ? t("users.types.company", "Société")
                            : c.type === "PARTICULIER"
                              ? t("users.types.individual", "Particulier")
                              : c.type === "ANONYME"
                                ? t("users.types.anonymous", "Anonyme")
                                : c.type || t("users.types.individual", "Particulier")}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleClientStatus(c)}
                          className="cursor-pointer hover:opacity-80 transition inline-flex items-center gap-1 font-semibold"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.55rem",
                            borderRadius: "12px",
                            backgroundColor: isClientActive ? "#ECFDF5" : "#FEF2F2",
                            color: isClientActive ? "#059669" : "#DC2626",
                            border: `1px solid ${isClientActive ? "#A7F3D0" : "#FECACA"}`,
                          }}
                          title={`Statut : ${isClientActive ? "Actif" : "Inactif"}. Cliquer pour ${isClientActive ? "désactiver (bloquer les dossiers)" : "réactiver"}.`}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isClientActive ? "#059669" : "#DC2626" }}></span>
                          {isClientActive ? t("common.active", "Actif") : t("common.inactive", "Inactif")}
                        </button>
                      </td>
                      <td className="text-center">
                        {c.user?.status === "Actif" ? (
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "12px",
                              backgroundColor: "#ECFDF5",
                              color: "#059669",
                              border: "1px solid #A7F3D0",
                            }}
                            title="Mot de passe configuré — Accès portail actif"
                          >
                            <CheckCircle2 size={11} /> Actif
                          </span>
                        ) : c.user ? (
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "12px",
                              backgroundColor: "#FFFBEB",
                              color: "#D97706",
                              border: "1px solid #FDE68A",
                            }}
                            title="Invitation envoyée — En attente de configuration du mot de passe"
                          >
                            <Clock size={11} /> Invitation
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 font-medium"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "12px",
                              backgroundColor: "var(--border)",
                              color: "var(--text-muted)",
                              border: "1px solid var(--border)",
                            }}
                            title="Aucun compte portail créé"
                          >
                            Non configuré
                          </span>
                        )}
                      </td>
                      <td className="table-date-cell text-center" style={{width:"150px"}}>
                        <span style={{ color: "var(--text-muted)" }}>
                          {c.createdAt ? formatDate(c.createdAt) : "N/A"}
                        </span>
                      </td>
                      <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                        <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                          {/* Sommet de la pyramide : Modifier */}
                          <button
                            type="button"
                            onClick={() => {
                              const isPart = c.type === "Particulier" || c.type === "PARTICULIER";
                              setEditExternal({
                                ...c,
                                status: c.status || "ACTIF",
                                accountStatus: c.user?.isBlocked ? "SUSPENDU" : "ACTIF",
                                raisonSociale: c.entreprise?.raisonSociale || c.entreprise?.nom || c.raisonSociale || (!isPart ? c.name : "") || "",
                                siret: c.entreprise?.siret || c.siret || "",
                                emailEntreprise: c.entreprise?.emailEntreprise || c.emailEntreprise || "",
                                telephoneEntreprise: c.entreprise?.telephoneEntreprise || c.telephoneEntreprise || "",
                                type: isPart ? "Particulier" : "Société",
                                contactSecondaire: c.contactSecondaire || "",
                              });
                            }}
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
                              onClick={() => setConsultExternal(c)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                              title={t("common.view", "Consulter")}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(c.id)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                              title={t("common.delete", "Supprimer")}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    );
                  }))}
                </tbody>
              </table>
  );
};

export default ClientTableView;
