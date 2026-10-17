import React from "react";
import MessageDetailCard, { formatPriority } from "./MessageDetailCard";
import AttachmentSelect from "../AttachmentSelect";
import { formatDate } from "../../utils/helpers";
import { isSuperAdmin, isOperationalManager } from "./inboxHelpers";
import { DEFINITIVE_MESSAGE_STATUSES } from "../../utils/constants";

const InternalMessageSection = ({
  processMsg,
  tab,
  pendingChanges = {},
  setPendingChange,
  renderStatusDropdown,
  currentUser,
  userRole,
  users = [],
  conversationMessages = [],
  setPreviewFile,
}) => {
  return (
                <div
                  className="grid gap-6 mb-6" style={{gridTemplateColumns:"1fr 1fr"}}
                >
                  {/* Colonne gauche : Métadonnées & Sélecteurs du Message */}
                  <div className="flex flex-col gap-6">
                    <div
                      style={{
                        background: "#FFF",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "1.25rem",
                      }}
                    >
                      <div
                        className="text-[var(--text-main)] mb-4" style={{fontWeight:800,fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.05em"}}
                      >
                        Métadonnées & Sélecteurs du Message
                      </div>
                      <div className="flex flex-col" style={{gap:"0.6rem"}}>
                        <MessageDetailCard
                          label="Nom"
                          value={processMsg.nomPrenom || "Non renseigné"}
                        />
                        <MessageDetailCard
                          label="Email"
                          value={processMsg.email || "Non renseigné"}
                        />
                        <MessageDetailCard
                          label="Fichiers joints"
                          sublabel="SELECT"
                        >
                          <AttachmentSelect
                            files={[
                              processMsg.cv,
                              processMsg.attachment,
                              processMsg.contact?.pieceJointe,
                            ]}
                            onPreview={setPreviewFile}
                          />
                        </MessageDetailCard>
                        {tab === "personnel" && (
                          <>
                            <MessageDetailCard
                              label="Étiquette"
                              sublabel="SELECT"
                            >
                              <select
                                value={
                                  pendingChanges.etiquette !== undefined
                                    ? pendingChanges.etiquette
                                    : processMsg.etiquette || ""
                                }
                                onChange={(e) =>
                                  setPendingChange("etiquette", e.target.value)
                                }
                                className="w-full font-bold cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #2563EB",outline:"none",background:"#FFF",fontSize:"0.85rem",color:"#2563EB"}}
                              >
                                <option value="">● Général</option>
                                <option value="Contact">● Contact</option>
                                <option value="Recrutement">● Recrutement</option>
                              </select>
                            </MessageDetailCard>
                            <MessageDetailCard
                              label="Statut"
                              sublabel="SELECT"
                            >
                              {renderStatusDropdown(processMsg, tab, true)}
                            </MessageDetailCard>
                            <MessageDetailCard
                              label="Priorité"
                              sublabel="SELECT"
                            >
                              <select
                                value={
                                  pendingChanges.priorite !== undefined
                                    ? pendingChanges.priorite
                                    : formatPriority(processMsg.priorite)
                                }
                                onChange={(e) =>
                                  setPendingChange("priorite", e.target.value)
                                }
                                className="w-full font-bold cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #CBD5E1",outline:"none",background:"#FFF",fontSize:"0.85rem"}}
                              >
                                <option value="Normal">● Normal</option>
                                <option value="Prioritaire">● Prioritaire</option>
                                <option value="Urgent" disabled={DEFINITIVE_MESSAGE_STATUSES.includes(pendingChanges.status !== undefined ? pendingChanges.status : processMsg?.status)}>● Urgent{DEFINITIVE_MESSAGE_STATUSES.includes(pendingChanges.status !== undefined ? pendingChanges.status : processMsg?.status) ? " (interdit en statut définitif)" : ""}</option>
                              </select>
                            </MessageDetailCard>
                            {isSuperAdmin(currentUser?.role?.name || currentUser?.role || userRole) && (
                              <MessageDetailCard
                                label="Mettre en copie"
                                sublabel="SELECT"
                              >
                                <select
                                  value={
                                    pendingChanges.assignedToId !== undefined
                                      ? pendingChanges.assignedToId
                                      : processMsg.assignedToId || ""
                                  }
                                  onChange={(e) =>
                                    setPendingChange("assignedToId", e.target.value)
                                  }
                                  className="w-full font-medium cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #CBD5E1",outline:"none",background:"#FFF",fontSize:"0.85rem"}}
                                >
                                  <option value="">Aucun</option>
                                  {users
                                    .filter(u => isOperationalManager(u.role?.name || u.role))
                                    .map((u) => (
                                      <option key={u.id} value={u.id}>
                                        {u.name} (Responsable)
                                      </option>
                                  ))}
                                </select>
                              </MessageDetailCard>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite : Fil de conversation */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="flex flex-col gap-4 h-full" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem"}}
                    >
                      <div
                        className="text-[var(--text-main)]" style={{fontWeight:800,fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.05em"}}
                      >
                        Fil de conversation
                      </div>

                      <div
                        className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid #F1F5F9"}}
                      >
                        <div className="font-bold" style={{fontSize:"0.95rem",color:"#2563EB",marginBottom:"0.25rem"}}>
                          Objet : {processMsg.objet || "Fil de conversation"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Fil officiel de correspondance lié à ce contact
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#FFF",
                          borderRadius: "8px",
                          padding: "1.25rem",
                          border: "1px solid var(--border)",
                          flex: 1,
                          minHeight: "220px",
                          overflowY: "auto",
                        }}
                      >
                        {tab === "interne" ? (
                          <div className="flex flex-col gap-4">
                            {conversationMessages.map((m) => {
                              const isMe = m.email === currentUser?.email || m.nomPrenom === currentUser?.name;
                              return (
                                <div
                                  key={m.id}
                                  style={{
                                    alignSelf: isMe ? "flex-end" : "flex-start",
                                    background: isMe ? "#1E3A8A" : "#F1F5F9",
                                    color: isMe ? "#FFF" : "var(--text-main)",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    border: isMe ? "none" : "1px solid var(--border)",
                                    maxWidth: "80%",
                                  }}
                                >
                                  <div className="flex justify-between gap-4" style={{marginBottom:"0.25rem",fontSize:"0.75rem",opacity:0.8}}>
                                    <strong>{m.nomPrenom}</strong>
                                    <span>{formatDate(m.createdAt)}</span>
                                  </div>
                                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.9rem" }}>
                                    {m.bodyText || m.bodyHtml || "Aucun contenu."}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-[var(--text-main)]" style={{fontSize:"0.95rem",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>
                            {processMsg.description || processMsg.bodyText || (processMsg.bodyHtml && !processMsg.bodyHtml.includes("<") ? processMsg.bodyHtml : null) || "Bonjour,\n\nMessage lié à ce fil."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
  );
};

export default InternalMessageSection;
