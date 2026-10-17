import React from "react";
import { Mail, Files, Loader2 } from "lucide-react";
import { extractFieldFromHtml } from "../../utils/helpers";
import ContactMessageSection from "./ContactMessageSection";
import RecruitmentMessageSection from "./RecruitmentMessageSection";
import InternalMessageSection from "./InternalMessageSection";

const MessageDetailView = ({
  processMsg,
  setProcessMsg,
  tab,
  handleSaveAll,
  isSaving,
  hasPendingChanges,
  pendingChanges = {},
  setPendingChanges,
  setPendingChange,
  setShowSaveConfirm,
  showRappelBanner,
  setShowRappelBanner,
  getVerifaliaBadge,
  renderStatusDropdown,
  currentUser,
  userRole,
  users = [],
  conversationMessages = [],
  setPreviewFile,
}) => {
  if (!processMsg) return null;

  return (
          <div className="fade-in p-4">
            <div className="w-full" style={{padding:"0"}}>
              {/* En-tête supérieur de consultation */}
              <div
                className="flex justify-between items-center mb-6 gap-4" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",padding:"1.25rem 1.5rem"}}
              >
                <div className="flex items-center gap-4">
                  {tab === "recrutement" ? (
                    <div
                      className="flex items-center justify-center font-bold" style={{width:"48px",height:"48px",borderRadius:"10px",background:"#FAF5FF",border:"1px solid #F3E8FF",color:"#9333EA",fontSize:"1rem"}}
                    >
                      CV
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center" style={{width:"48px",height:"48px",borderRadius:"10px",background:"#EFF6FF",border:"1px solid #DBEAFE"}}
                    >
                      <Mail size={24} color="#2563EB" />
                    </div>
                  )}
                  <div>
                    <h2
                      className="text-[var(--text-main)]" style={{fontSize:"1.15rem",fontWeight:800,letterSpacing:"0.02em"}}
                    >
                      {(() => {
                        if (tab === "contact")
                          return "CONSULTATION DU MESSAGE : FORMULAIRE DE CONTACT";
                        if (tab === "recrutement")
                          return "CONSULTATION DU MESSAGE : CANDIDATURE";
                        if (tab === "interne")
                          return "CONSULTATION DU MESSAGE : INTERNE";
                        if (tab === "personnel")
                          return "CONSULTATION DU MESSAGE : PERSONNEL";
                        return "CONSULTATION DU MESSAGE";
                      })()}
                    </h2>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748B",
                        marginTop: "0.3rem",
                      }}
                    >
                      {(() => {
                        if (tab === "contact") {
                          const ste = processMsg.raisonSocial || extractFieldFromHtml(processMsg.bodyHtml, "Société") || "Non renseigné";
                          const contactName = processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, "Nom complet") || "Non renseigné";
                          const contactEmail = processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, "Email") || "Non renseigné";
                          return `Société : ${ste} • Contact : ${contactName} • Email : ${contactEmail}`;
                        }
                        if (tab === "recrutement") {
                          const nom = processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, "Nom complet") || "Non renseigné";
                          const email = processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, "Email") || "Non renseigné";
                          const tel = processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, "Téléphone") || "Non renseigné";
                          return `Candidat : ${nom} • Email : ${email} • Téléphone : ${tel}`;
                        }
                        if (tab === "personnel" || tab === "interne") {
                          const nom = processMsg.nomPrenom || "Non renseigné";
                          const email = processMsg.email || "Non renseigné";
                          return `De : ${nom} • Email : ${email} • Pièce jointe : -- Sélectionner un fichier pour l'ouvrir --`;
                        }
                        return `De : ${processMsg.nomPrenom || processMsg.email || "Contact"}`;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center shrink-0" style={{gap:"0.75rem", flexShrink: 0}}>
                  {processMsg.dossierId && (
                    <button
                      type="button"
                      onClick={() => (window.location.href = `/dossiers?open=${processMsg.dossierId}`)}
                      className="btn btn-outline-success font-semibold flex items-center whitespace-nowrap shrink-0" style={{padding:"0.55rem 1rem",fontSize:"0.85rem",gap:"0.4rem",whiteSpace:"nowrap",flexShrink:0}}
                    >
                      <Files size={16} /> Dossier Lié
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="whitespace-nowrap shrink-0"
                    style={{
                      padding: "0.55rem 1.4rem",
                      borderRadius: "6px",
                      background: hasPendingChanges ? "#1E3A8A" : "#64748B",
                      color: "#FFF",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      border: "none",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      opacity: isSaving ? 0.7 : (hasPendingChanges ? 1 : 0.85),
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    Enregistrer
                    {hasPendingChanges && (
                      <span
                        style={{
                          background: "rgba(255,255,255,0.25)",
                          borderRadius: "10px",
                          padding: "0.1rem 0.4rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        {Object.keys(pendingChanges).length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessMsg(null);
                      setPendingChanges({});
                      setShowSaveConfirm(false);
                    }}
                    className="inline-flex items-center justify-center font-semibold cursor-pointer whitespace-nowrap shrink-0 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:opacity-90 transition-opacity"
                    style={{
                      padding: "0.55rem 1.4rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      border: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    ← Retour
                  </button>
                </div>
              </div>

              {/* Bannière d'info "À rappeler" ou "Entretien" */}
              {(processMsg.status === "A_RAPPELER" ||
                processMsg.status === "ENTRETIEN") &&
                showRappelBanner && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      background:
                        processMsg.status === "ENTRETIEN"
                          ? "#EEF2FF"
                          : "#FFFBEB",
                      border: `1px solid ${processMsg.status === "ENTRETIEN" ? "#C7D2FE" : "#FDE68A"}`,
                      borderRadius: "10px",
                      padding: "1rem 1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color:
                            processMsg.status === "ENTRETIEN"
                              ? "#4338CA"
                              : "#92400E",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {processMsg.status === "ENTRETIEN"
                          ? "Entretien planifié"
                          : "Rappel prévu"}
                      </div>
                      {(processMsg.dateRappel || processMsg.dateEntretien) && (
                        <div
                          className="text-[var(--text-main)]" style={{marginBottom:"0.25rem"}}
                        >
                          <strong>Date :</strong>{" "}
                          {new Date(
                            processMsg.dateRappel || processMsg.dateEntretien,
                          ).toLocaleString("fr-FR", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </div>
                      )}
                      {processMsg.noteRappel && (
                        <div
                          style={{
                            color: "var(--text-muted)",
                          }}
                        >
                          <strong>Note :</strong> {processMsg.noteRappel}
                        </div>
                      )}
                      {processMsg.lienVisio && (
                        <div>
                          <strong>Lien visio :</strong>{" "}
                          <a
                            href={processMsg.lienVisio}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#4F46E5" }}
                          >
                            {processMsg.lienVisio}
                          </a>
                        </div>
                      )}
                      {!processMsg.dateRappel &&
                        !processMsg.dateEntretien &&
                        !processMsg.noteRappel &&
                        !processMsg.lienVisio && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              fontStyle: "italic",
                            }}
                          >
                            Aucune information enregistrée pour ce rappel.
                          </div>
                        )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRappelBanner(false)}
                      className="cursor-pointer" style={{background:"none",border:"none",color:"var(--text-muted)",fontSize:"1.1rem",padding:"0",lineHeight:1}}
                      title="Fermer"
                    >
                      &#x2715;
                    </button>
                  </div>
                )}
              {(processMsg.status === "A_RAPPELER" ||
                processMsg.status === "ENTRETIEN") &&
                !showRappelBanner && (
                  <div className="text-right mb-2">
                    <button
                      type="button"
                      onClick={() => setShowRappelBanner(true)}
                      style={{
                        fontSize: "0.8rem",
                        color:
                          processMsg.status === "ENTRETIEN"
                            ? "#4338CA"
                            : "#92400E",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {processMsg.status === "ENTRETIEN"
                        ? "Voir les infos entretien"
                        : "Voir les infos rappel"}
                    </button>
                  </div>
                )}

              {/* Vue Contact (Image 2) */}

              {tab === "contact" && (
                <ContactMessageSection
                  processMsg={processMsg}
                  pendingChanges={pendingChanges}
                  setPendingChange={setPendingChange}
                  getVerifaliaBadge={getVerifaliaBadge}
                  renderStatusDropdown={renderStatusDropdown}
                  tab={tab}
                />
              )}

              {tab === "recrutement" && (
                <RecruitmentMessageSection
                  processMsg={processMsg}
                  pendingChanges={pendingChanges}
                  setPendingChange={setPendingChange}
                  getVerifaliaBadge={getVerifaliaBadge}
                  renderStatusDropdown={renderStatusDropdown}
                  tab={tab}
                />
              )}

              {(tab === "personnel" || tab === "interne") && (
                <InternalMessageSection
                  processMsg={processMsg}
                  tab={tab}
                  pendingChanges={pendingChanges}
                  setPendingChange={setPendingChange}
                  renderStatusDropdown={renderStatusDropdown}
                  currentUser={currentUser}
                  userRole={userRole}
                  users={users}
                  conversationMessages={conversationMessages}
                  setPreviewFile={setPreviewFile}
                />
              )}
            </div>
          </div>
  );
};

export default MessageDetailView;
