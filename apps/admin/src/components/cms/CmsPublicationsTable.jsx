import React from "react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PaginationControls from "../PaginationControls";

const CmsPublicationsTable = ({
  loading,
  filteredPubs = [],
  paginatedPubs = [],
  page,
  limit,
  totalPages,
  setPage,
  openModal,
  handleDelete,
  isSuperAdmin,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="table-wrapper">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
              <th
                className="text-left font-mono"
                style={{
                  padding: "0.85rem 1rem",
                  paddingLeft: "1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "55px",
                  maxWidth: "55px",
                }}
              >
                N°
              </th>
              <th
                className="text-left font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "32%",
                  maxWidth: "320px",
                }}
              >
                {t("cms.columns.title", "Titre")}
              </th>
              <th
                className="text-left font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "20%",
                  maxWidth: "200px",
                }}
              >
                {t("cms.columns.category", "Catégorie")}
              </th>
              <th
                className="text-center font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "115px",
                  maxWidth: "115px",
                }}
              >
                {t("cms.columns.status", "Statut")}
              </th>
              <th
                className="table-date-cell text-center font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "140px",
                  maxWidth: "140px",
                }}
              >
                {t("cms.columns.createdAt", "Créé le")}
              </th>
              <th
                className="table-date-cell text-center font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "140px",
                  maxWidth: "140px",
                }}
              >
                {t("cms.columns.updatedAt", "Modifié le")}
              </th>
              <th
                className="text-center font-bold"
                style={{
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.72rem",
                  color: "#64748B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  width: "95px",
                  maxWidth: "95px",
                }}
              >
                {t("cms.columns.actions", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center"
                  style={{ padding: "3rem", color: "#64748B", fontSize: "0.9rem" }}
                >
                  {t("common.loading", "Chargement des actualités...")}
                </td>
              </tr>
            ) : filteredPubs.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center"
                  style={{ padding: "3rem", color: "#64748B", fontSize: "0.9rem" }}
                >
                  {t("common.noResult", "Aucune actualité trouvée.")}
                </td>
              </tr>
            ) : (
              paginatedPubs.map((pub, index) => {
                const formatDateTime = (dateVal) => {
                  if (!dateVal) return "—";
                  const d = new Date(dateVal);
                  if (isNaN(d.getTime())) return "—";
                  const dateStr = d.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const timeStr = d.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return `${dateStr} ${timeStr}`;
                };

                return (
                  <tr
                    key={pub.id}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* N° */}
                    <td
                      className="text-left font-mono"
                      style={{
                        padding: "0.85rem 1rem",
                        paddingLeft: "1.25rem",
                        width: "55px",
                        maxWidth: "55px",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <div className="truncate-name" style={{ maxWidth: "100%" }}>
                        {String((page - 1) * limit + index + 1).padStart(2, "0")}
                      </div>
                    </td>

                    {/* Titre */}
                    <td
                      style={{
                        padding: "0.85rem 1.25rem",
                        verticalAlign: "middle",
                        width: "32%",
                        maxWidth: "320px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openModal(pub)}
                        className="truncate-name font-bold text-[var(--text-main)] text-left hover:text-[var(--primary)] hover:underline cursor-pointer block w-full"
                        style={{
                          fontSize: "0.88rem",
                          background: "none",
                          border: "none",
                          padding: 0,
                          maxWidth: "100%",
                        }}
                        title={pub.title}
                      >
                        {pub.title}
                      </button>
                    </td>

                    {/* Catégorie */}
                    <td
                      style={{
                        padding: "0.85rem 1.25rem",
                        verticalAlign: "middle",
                        width: "20%",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        className="truncate-name font-medium text-[var(--text-main)]"
                        style={{ fontSize: "0.85rem", maxWidth: "100%" }}
                        title={pub.category || "Organisation et Externalisation"}
                      >
                        {pub.category || "Organisation et Externalisation"}
                      </div>
                    </td>

                    {/* Statut */}
                    <td
                      className="text-center"
                      style={{
                        padding: "0.85rem 1.25rem",
                        verticalAlign: "middle",
                        width: "115px",
                        maxWidth: "115px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: pub.status === "PUBLIE" ? "#ECFDF5" : "#FEF3C7",
                          color: pub.status === "PUBLIE" ? "#059669" : "#D97706",
                          border:
                            pub.status === "PUBLIE"
                              ? "1px solid #A7F3D0"
                              : "1px solid #FDE68A",
                        }}
                      >
                        <span style={{ fontSize: "0.65rem" }}>●</span>
                        {pub.status === "PUBLIE"
                          ? t("status.PUBLIE", "PUBLIÉ")
                          : t("status.BROUILLON", "BROUILLON")}
                      </span>
                    </td>

                    {/* Créé le */}
                    <td
                      className="table-date-cell text-center"
                      style={{
                        padding: "0.85rem 1.25rem",
                        verticalAlign: "middle",
                        width: "140px",
                        maxWidth: "140px",
                      }}
                    >
                      <span
                        className="text-[var(--text-main)]"
                        style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
                      >
                        {formatDateTime(pub.createdAt)}
                      </span>
                    </td>

                    {/* Modifié le */}
                    <td
                      className="table-date-cell text-center"
                      style={{
                        padding: "0.85rem 1.25rem",
                        verticalAlign: "middle",
                        width: "140px",
                        maxWidth: "140px",
                      }}
                    >
                      <span
                        className="text-[var(--text-main)]"
                        style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
                      >
                        {formatDateTime(pub.updatedAt || pub.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="text-center"
                      style={{
                        padding: "0.55rem 1.25rem",
                        verticalAlign: "middle",
                        width: "95px",
                        maxWidth: "95px",
                      }}
                    >
                      <div
                        className="inline-flex flex-col items-center"
                        style={{ gap: "3px" }}
                      >
                        {/* Sommet de la pyramide : Modifier */}
                        <button
                          type="button"
                          onClick={() => openModal(pub)}
                          title={t("common.edit", "Modifier")}
                          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: "#EFF6FF",
                            border: "1px solid #BFDBFE",
                            color: "#2563EB",
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        {/* Base de la pyramide : Voir + Supprimer */}
                        <div
                          className="flex items-center justify-center"
                          style={{ gap: "4px" }}
                        >
                          {/* Voir / Aperçu */}
                          <button
                            type="button"
                            onClick={() => {
                              const vitrineUrl =
                                window.location.hostname === "localhost"
                                  ? "http://localhost:3000"
                                  : "https://menuaconsulting.com";
                              window.open(
                                `${vitrineUrl}/fr/actualites/${pub.id}?preview=true`,
                                "_blank"
                              );
                            }}
                            title={t("common.view", "Consulter l'article")}
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: "#F1F5F9",
                              border: "1px solid #E2E8F0",
                              color: "#64748B",
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          {/* Supprimer */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(pub.id)}
                              title={t("common.delete", "Supprimer")}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "6px",
                                background: "#FEF2F2",
                                border: "1px solid #FECACA",
                                color: "#DC2626",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </>
  );
};

export default CmsPublicationsTable;
