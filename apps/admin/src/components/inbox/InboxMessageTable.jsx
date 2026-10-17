import React from "react";
import { Mail, Eye, Trash } from "lucide-react";
import TabsNavigation from "../TabsNavigation";
import PaginationControls from "../PaginationControls";
import InternalChatTab from "../InternalChatTab";
import { formatDate } from "../../utils/helpers";
import { formatPriority, getStatusBadge, getPriorityBadge, isSuperAdmin, getDisplayStatus } from "./inboxHelpers";

const InboxMessageTable = ({
  tab,
  handleTabChange,
  userRole,
  normalizeRole,
  searchQuery,
  setSearchQuery,
  filterDate,
  setFilterDate,
  filterTraite,
  setFilterTraite,
  limit,
  setLimit,
  isSyncing,
  handleSyncEmails,
  showToast,
  setPendingChanges,
  setShowSaveConfirm,
  messages = [],
  loading,
  t,
  page,
  totalPages,
  setPage,
  users = [],
  currentUser,
  setProcessMsg,
  handleDeleteMessage,
  fetchMessages,
}) => {
  return (
    <>
          <div
            className="flex flex-col gap-4 mb-6"
          >
            <TabsNavigation
              tabs={
                normalizeRole(userRole).includes("collaborateur") || normalizeRole(userRole).includes("relecteur")
                  ? [{ id: "interne", label: "Interne" }]
                  : [
                      { id: "contact", label: "Contact" },
                      { id: "recrutement", label: "Recrutement" },
                      { id: "interne", label: "Interne" },
                      { id: "personnel", label: "Boîte e-mail" },
                    ]
              }
              activeTab={tab}
              onTabChange={handleTabChange}
            />
            {tab !== "interne" && (
              <div
                className="flex gap-4 w-full items-center"
              >
                <div className="relative" style={{flex:1}}>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-[var(--text-main)]" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",outline:"none",background:"var(--surface)"}}
                  />
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--surface)",outline:"none"}}
                />
                <select
                  value={filterTraite}
                  onChange={(e) => setFilterTraite(e.target.value)}
                  className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--surface)",outline:"none",minWidth:"150px"}}
                >
                  <option value="all">{t("common.allStatuses", "Tous les statuts")}</option>
                  {tab === "contact" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="DISCUSSION">{t("status.DISCUSSION", "Discussion")}</option>
                      <option value="SANS_SUITE">{t("status.SANS_SUITE", "Sans suite")}</option>
                      <option value="GAGNE">{t("status.GAGNE", "Gagné")}</option>
                    </>
                  )}
                  {tab === "recrutement" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="ENTRETIEN">{t("status.ENTRETIEN", "Entretien")}</option>
                      <option value="RETENU">{t("status.RETENU", "Retenu")}</option>
                      <option value="REFUSE">{t("status.REFUSE", "Refusé")}</option>
                    </>
                  )}
                  {tab === "personnel" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="ENTRETIEN">{t("status.ENTRETIEN", "Entretien")}</option>
                      <option value="DISCUSSION">{t("status.DISCUSSION", "Discussion")}</option>
                      <option value="GAGNE">{t("status.GAGNE", "Gagné")}</option>
                      <option value="RETENU">{t("status.RETENU", "Retenu")}</option>
                      <option value="REFUSE">{t("status.REFUSE", "Refusé")}</option>
                      <option value="SANS_SUITE">{t("status.SANS_SUITE", "Sans suite")}</option>
                    </>
                  )}
                  {tab === "interne" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="TRAITE">{t("status.TRAITE", "Traité")}</option>
                      <option value="CLASSE">{t("status.CLASSE", "Classé sans suite")}</option>
                    </>
                  )}
                </select>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="text-[var(--text-main)] p-2 cursor-pointer" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"var(--surface)",outline:"none"}}
                >
                  <option value={12}>{t("common.perPage", { count: 12, defaultValue: "12 par page" })}</option>
                  <option value={25}>{t("common.perPage", { count: 25, defaultValue: "25 par page" })}</option>
                  <option value={50}>{t("common.perPage", { count: 50, defaultValue: "50 par page" })}</option>
                </select>

                {tab === "personnel" && isSuperAdmin(currentUser?.role?.name || currentUser?.role || userRole) && (
                  <button
                    type="button"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                    className="btn btn-primary flex gap-2 items-center" style={{padding:"0.5rem 1rem"}}
                  >
                    <Mail size={16} />
                    {isSyncing ? "Synchronisation..." : "Synchroniser Emails"}
                  </button>
                )}
              </div>
            )}
          </div>
          {tab === "interne" ? (
            <InternalChatTab
              currentUser={currentUser}
              users={users}
              showToast={showToast}
            />
          ) : (
            <>
              <div className="table-wrapper">
                <table className="w-full" style={{tableLayout:"fixed"}}>
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>{t("inbox.columns.no")}</th>
                      <th style={{ width: tab === "personnel" ? "24%" : "22%" }}>
                        {t("inbox.columns.name")}
                      </th>
                      <th style={{ width: tab === "personnel" ? "26%" : "22%" }}>
                        {t("inbox.columns.email")}
                      </th>
                      <th style={{ width: (tab === "personnel" || tab === "contact" || tab === "recrutement") ? "120px" : "130px", whiteSpace: "nowrap" }}>
                        {t("inbox.columns.status")}
                      </th>
                      {(tab === "personnel" ||
                        tab === "contact" ||
                        tab === "recrutement") && (
                        <th style={{ width: "110px", whiteSpace: "nowrap" }}>
                          {t("inbox.columns.priority")}
                        </th>
                      )}
                      {(tab === "interne") && (
                        <th style={{ width: "120px", whiteSpace: "nowrap" }}>
                          {t("inbox.columns.type")}
                        </th>
                      )}
                      <th className="table-date-cell" style={{ width: "165px" }}>{t("inbox.columns.date")}</th>
                      <th className="text-center" style={{width:"95px",whiteSpace:"nowrap"}}>
                        {t("inbox.columns.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (loading) {
                        return (
                          <tr>
                            <td
                              colSpan="10"
                              className="text-center p-8"
                            >
                              {t("common.loading", "Chargement des messages...")}
                            </td>
                          </tr>
                        );
                      }

                      const renderMessageRow = (
                        m,
                        index,
                        col2,
                        col3,
                        typeBadgeText,
                        typeBadgeBg,
                        typeBadgeColor,
                      ) => {
                        const isExpired = (msg) => {
                          const d = msg.dateRappel || msg.dateEntretien;
                          if (!d) return false;
                          if (
                            [
                              "TERMINE",
                              "ARCHIVE",
                              "CLASSE",
                              "GAGNE",
                              "RETENU",
                              "REFUSE",
                              "SANS_SUITE",
                            ].includes(msg.status)
                          )
                            return false;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const date = new Date(d);
                          date.setHours(0, 0, 0, 0);
                          return date <= today;
                        };
                        return (
                          <tr
                            key={m.id}
                          >
                            <td
                              className="font-medium" style={{color:"var(--text-muted)"}}
                            >
                              {index + 1}
                            </td>
                            <td>
                              <div
                                className="truncate-name"
                                style={{ maxWidth: "100%" }}
                                title={col2}
                              >
                                {col2}
                              </div>
                            </td>
                            <td>
                              <div
                                className="truncate-name"
                                style={{
                                  color: "var(--text-muted)",
                                  maxWidth: "100%",
                                }}
                                title={col3}
                              >
                                {col3}
                              </div>
                            </td>
                            <td>
                              <span
                                className="status-badge-inbox inline-flex items-center gap-1 font-semibold"
                                style={{
                                  padding: "0.25rem 0.65rem",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  background: getStatusBadge(m.status).bg,
                                  color: getStatusBadge(m.status).color,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {getDisplayStatus(m.status, t)}
                              </span>
                            </td>
                            {(tab === "personnel" ||
                              tab === "contact" ||
                              tab === "recrutement") && (
                              <td style={{ whiteSpace: "nowrap" }}>
                                <span
                                  className="priority-badge-inbox inline-flex items-center gap-1 font-semibold"
                                  style={{
                                    padding: "0.25rem 0.65rem",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    background: getPriorityBadge(m.priorite).bg,
                                    color: getPriorityBadge(m.priorite).color,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {formatPriority(m.priorite, t)}
                                </span>
                              </td>
                            )}
                            {(tab === "interne") && (
                              <td>
                                <span
                                  style={{
                                    color: typeBadgeColor,
                                  }}
                                >
                                  {typeBadgeText}
                                </span>
                              </td>
                            )}
                            <td
                              className="table-date-cell"
                              style={{
                                color: "var(--text-muted)",
                                width: "160px",
                              }}
                            >
                              {formatDate(m.createdAt)}
                            </td>
                            <td>
                              <div
                                className="flex items-center justify-center" style={{gap:"4px"}}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProcessMsg(m);
                                    if (setPendingChanges) setPendingChanges({});
                                    if (setShowSaveConfirm) setShowSaveConfirm(false);
                                  }}
                                  className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--btn-action-view-bg, #F1F5F9)", border: "1px solid var(--btn-action-view-border, #E2E8F0)", color: "var(--btn-action-view-color, #64748B)" }}
                                  title="Consulter le message"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(m)}
                                  className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--btn-action-delete-bg, #FEF2F2)", border: "1px solid var(--btn-action-delete-border, #FECACA)", color: "var(--btn-action-delete-color, #DC2626)" }}
                                  title="Supprimer le message"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      };

                      const sortedMessages = messages;

                      if (tab === "contact") {
                        return sortedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            /* type badge unused for contact — pass empty */
                            m.raisonSocial || "",
                            "#F1F5F9",
                            "#64748B",
                          ),
                        );
                      }

                      if (tab === "recrutement") {
                        return sortedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            /* type badge unused for recrutement — pass empty */
                            "",
                            "#F1F5F9",
                            "#64748B",
                          ),
                        );
                      }

                      if (tab === "interne") {
                        const groupedMessages = [];
                        const seenGroups = new Set();

                        sortedMessages.forEach((m) => {
                          const groupId =
                            m.tacheId || m.missionId || m.dossierId || m.id;
                          if (!seenGroups.has(groupId)) {
                            seenGroups.add(groupId);

                            // Find all messages in this group
                            const groupMsgs = sortedMessages.filter(
                              (x) =>
                                (x.tacheId && x.tacheId === groupId) ||
                                (x.missionId && x.missionId === groupId) ||
                                (x.dossierId && x.dossierId === groupId) ||
                                x.id === groupId,
                            );

                            // The overall status is defined by the latest message in the thread
                            const latestMsg = groupMsgs.reduce(
                              (prev, current) =>
                                new Date(prev.createdAt) >
                                new Date(current.createdAt)
                                  ? prev
                                  : current,
                            );

                            // Replace the status with the latest message's status
                            groupedMessages.push({
                              ...latestMsg,
                              originalMessage: m,
                            });
                          }
                        });

                        groupedMessages.sort(
                          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                        );

                        return groupedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom || "Système",
                            m.email || "-",
                            m.sourceType || m.subType || "Interne",
                            "#F1F5F9",
                            "#64748B",
                            <span title={m.sourceRef || m.formulaireId || m.id}>
                              {m.sourceRef ||
                                (m.formulaireId
                                  ? m.formulaireId.split("-")[0]
                                  : m.id)}
                            </span>,
                            {
                              color: "var(--text-muted)",
                              fontSize: "0.75rem",
                              fontFamily: "monospace",
                            },
                          ),
                        );
                      }

                      // Fallback (tab === "personnel" / Boîte e-mail)
                      return sortedMessages.map((m, i) =>
                        renderMessageRow(
                          m,
                          i,
                          m.nomPrenom,
                          m.email,
                          m.sourceType || m.subType || "Indéfini",
                          "#F1F5F9",
                          "#64748B",
                          m.objet,
                          {
                            fontWeight: m.status === "NOUVEAU" ? 600 : 400,
                          },
                        ),
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </>
          )}
        </>
  );
};

export default InboxMessageTable;
