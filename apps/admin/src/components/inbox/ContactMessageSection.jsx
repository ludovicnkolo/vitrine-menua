import React from "react";
import MessageDetailCard, { formatPriority } from "./MessageDetailCard";
import { extractFieldFromHtml, extractBlockFromHtml } from "../../utils/helpers";

const ContactMessageSection = ({
  processMsg,
  pendingChanges = {},
  setPendingChange,
  getVerifaliaBadge,
  renderStatusDropdown,
  tab,
}) => {
  return (
                <div
                  className="grid gap-6 mb-6" style={{gridTemplateColumns:"1fr 1fr"}}
                >
                  {/* Colonne gauche */}
                  <div className="flex flex-col gap-6">
                    {/* INFORMATIONS DU CONTACT */}
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
                        INFORMATIONS DU CONTACT
                      </div>
                      <div className="flex flex-col" style={{gap:"0.6rem"}}>
                         {/* Organisation / Société — affiché uniquement si renseigné */}
                         {(processMsg.raisonSocial ||
                           extractFieldFromHtml(processMsg.bodyHtml, "Organisation / Société")
                         ) && (
                           <MessageDetailCard
                             label="Organisation / Société"
                             value={
                               processMsg.raisonSocial ||
                               extractFieldFromHtml(processMsg.bodyHtml, "Organisation / Société") ||
                               extractFieldFromHtml(processMsg.bodyHtml, "Société") ||
                               "Non renseigné"
                             }
                           />
                         )}
                         <MessageDetailCard
                           label="Nom complet"
                           value={
                             processMsg.nomPrenom ||
                             extractFieldFromHtml(
                               processMsg.bodyHtml,
                               "Nom complet",
                             ) ||
                             "Non renseigné"
                           }
                         />
                         <MessageDetailCard
                           label="Téléphone"
                           value={
                             processMsg.telephone ||
                             extractFieldFromHtml(
                               processMsg.bodyHtml,
                               "Téléphone",
                             ) ||
                             "Non renseigné"
                           }
                         />
                         <MessageDetailCard
                           label="Email"
                           value={
                             processMsg.email ||
                             extractFieldFromHtml(processMsg.bodyHtml, "Email") ||
                             "Non renseigné"
                           }
                         />
                       </div>
                    </div>

                    {/* QUALIFICATION DE LA DEMANDE */}
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
                        QUALIFICATION DE LA DEMANDE
                      </div>
                      <div className="flex flex-col" style={{gap:"0.6rem"}}>
                        <MessageDetailCard
                          inline
                          label="Statut vérification email"
                          value={
                            processMsg.verifaliaStatus ? (
                              <span className="font-bold" style={{color:"#059669"}}>
                                {getVerifaliaBadge(processMsg.verifaliaStatus).text}
                              </span>
                            ) : (
                              "Non vérifié"
                            )
                          }
                        />
                        <MessageDetailCard
                          label="Type de besoin"
                          value={
                            processMsg.contact?.typeBesoin ||
                            extractFieldFromHtml(
                              processMsg.bodyHtml,
                              "Type de besoin",
                            ) ||
                            extractFieldFromHtml(
                              processMsg.bodyHtml,
                              "Type de demande",
                            ) ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Besoin") ||
                            processMsg.objet ||
                            "Non renseigné"
                          }
                        />
                        <MessageDetailCard
                          label="Priorité"
                          sublabel="MENU SELECT (MODIFIABLE)"
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
                            style={{
                              width: "100%",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "6px",
                              border: `1px solid ${
                                formatPriority(pendingChanges.priorite !== undefined ? pendingChanges.priorite : processMsg.priorite) === "Urgent"
                                  ? "#EF4444"
                                  : formatPriority(pendingChanges.priorite !== undefined ? pendingChanges.priorite : processMsg.priorite) === "Prioritaire"
                                  ? "#F59E0B"
                                  : "#CBD5E1"
                              }`,
                              outline: "none",
                              background: "#FFF",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color:
                                formatPriority(pendingChanges.priorite !== undefined ? pendingChanges.priorite : processMsg.priorite) === "Urgent"
                                  ? "#EF4444"
                                  : "var(--text-main)",
                              cursor: "pointer",
                            }}
                          >
                            <option value="Normal">● Normal</option>
                            <option value="Prioritaire">● Prioritaire</option>
                            <option value="Urgent" disabled={DEFINITIVE_MESSAGE_STATUSES.includes(pendingChanges.status !== undefined ? pendingChanges.status : processMsg?.status)}>● Urgent{DEFINITIVE_MESSAGE_STATUSES.includes(pendingChanges.status !== undefined ? pendingChanges.status : processMsg?.status) ? " (interdit en statut définitif)" : ""}</option>
                          </select>
                        </MessageDetailCard>
                        <MessageDetailCard
                          label="Statut"
                          sublabel="MENU SELECT (MODIFIABLE)"
                        >
                          {renderStatusDropdown(processMsg, tab, true)}
                        </MessageDetailCard>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite : Description / Contenu */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="flex flex-col gap-4 h-full" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem"}}
                    >
                      <div
                        className="text-[var(--text-main)]" style={{fontWeight:800,fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.05em"}}
                      >
                        Description / Contenu
                      </div>

                      <div
                        className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid #F1F5F9"}}
                      >
                        <div className="font-bold" style={{fontSize:"0.95rem",color:"#2563EB",marginBottom:"0.25rem"}}>
                          Objet : {processMsg.objet || "Demande de contact"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Formulaire de contact soumis sur la plateforme
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
                        }}
                      >
                        <div className="text-[var(--text-main)]" style={{fontSize:"0.95rem",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>
                          {extractBlockFromHtml(processMsg.bodyHtml, "Description du besoin") ||
                           processMsg.description ||
                           processMsg.bodyText ||
                           (processMsg.bodyHtml && !processMsg.bodyHtml.includes("<") ? processMsg.bodyHtml : null) ||
                           "Assumenda aliquip in"}
                        </div>
                        <div className="mt-4" style={{fontSize:"0.75rem",color:"#94A3B8"}}>
                          (Message complet transmis par le visiteur)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  );
};

export default ContactMessageSection;
