import React from "react";
import MessageDetailCard, { formatPriority } from "./MessageDetailCard";
import { extractFieldFromHtml, extractBlockFromHtml } from "../../utils/helpers";

const RecruitmentMessageSection = ({
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
{/* Type de contact supprimé — formulaire recrutement ne distingue pas particulier/société */}
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
                          label="Email"
                          value={
                            processMsg.email ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Email") ||
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
                          label="Lieu de résidence"
                          value={
                            processMsg.recrutement?.lieuResidence ||
                            extractFieldFromHtml(
                              processMsg.bodyHtml,
                              "Localisation",
                            ) ||
                            "Non renseigné"
                          }
                        />
                        <MessageDetailCard label="Profil LinkedIn">
                          {processMsg.recrutement?.lienLinkedin ? (
                            <a
                              href={processMsg.recrutement.lienLinkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--primary)", textDecoration: "underline" }}
                            >
                              {processMsg.recrutement.lienLinkedin}
                            </a>
                          ) : extractFieldFromHtml(processMsg.bodyHtml, "LinkedIn / Portfolio") ? (
                            <a
                              href={extractFieldFromHtml(processMsg.bodyHtml, "LinkedIn / Portfolio")}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--primary)", textDecoration: "underline" }}
                            >
                              {extractFieldFromHtml(processMsg.bodyHtml, "LinkedIn / Portfolio")}
                            </a>
                          ) : (
                            "Non renseigné"
                          )}
                        </MessageDetailCard>
                      </div>
                    </div>

                    {/* Description / Contenu */}
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
                        Description / Contenu
                      </div>
                      <div
                        className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid #F1F5F9"}}
                      >
                        <div className="font-bold mb-2" style={{fontSize:"0.95rem",color:"#2563EB"}}>
                          Objet : {processMsg.objet || "Demande de collaboration"}
                        </div>
                        <div className="text-[var(--text-main)]" style={{fontSize:"0.9rem",lineHeight:"1.5",whiteSpace:"pre-wrap"}}>
                          {extractBlockFromHtml(processMsg.bodyHtml, "Message / Motivations") ||
                           processMsg.description ||
                           processMsg.bodyText ||
                           "rfqrf3"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite */}
                  <div className="flex flex-col gap-6">
                    {/* PROFIL PROFESSIONNEL */}
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
                        PROFIL PROFESSIONNEL
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
                          label="Années d'expérience"
                          value={
                            processMsg.recrutement?.anneeExperience ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Années d'expérience") ||
                            "2 à 5 ans"
                          }
                        />
                        <MessageDetailCard
                          label="Langues"
                          value={
                            processMsg.recrutement?.langue ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Langues") ||
                            "Anglais"
                          }
                        />
                        <MessageDetailCard
                          label="Disponibilité"
                          value={
                            extractFieldFromHtml(processMsg.bodyHtml, "Disponibilité") ||
                            "Sous 1 mois"
                          }
                        />
                        <MessageDetailCard
                          label="Compétences clés"
                          value={
                            processMsg.recrutement?.competenceCle ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Compétences") ||
                            extractFieldFromHtml(processMsg.bodyHtml, "Compétences clés") ||
                            "Back et middle office"
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
                            className="w-full font-bold cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #CBD5E1",outline:"none",background:"#FFF",fontSize:"0.85rem"}}
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

                    {/* Green confirmation banner */}
                    <div
                      style={{
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "10px",
                        padding: "1rem 1.25rem",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#166534", marginBottom: "0.25rem" }}>
                        ✓ Vérification du profil candidat terminée
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#15803D" }}>
                        Toutes les métadonnées sont prêtes pour transmission au responsable recrutement.
                      </div>
                    </div>
                  </div>
                </div>
  );
};

export default RecruitmentMessageSection;
