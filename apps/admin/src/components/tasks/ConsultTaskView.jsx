import React, { useState } from "react";
import {
  FileText,
  Paperclip,
  CheckSquare,
  Target,
  AlertTriangle,
} from "lucide-react";
import SmsModal from "../SmsModal";
import FeedbackThread from "../FeedbackThread";
import FeedbackModal from "../FeedbackModal";
import FilePreviewModal from "../FilePreviewModal";
import TaskConsultModal from "../TaskConsultModal";
import {
  getSubjectFromTask,
  getMessageFromTask,
  getDeadlineEvaluation,
} from "../../utils/helpers";

const ConsultTaskView = ({
  consultTask,
  setConsultTask,
  mode,
  currentUser,
  isSuperAdmin,
  isResp,
  isController,
  pendingStatus,
  setPendingStatus,
  handleWorkflowAction,
  setConfirmingStatus,
  setEditTask,
  setTaskFile,
  setCreateTaskModal,
  previewFile,
  setPreviewFile,
  showSmsModal,
  setShowSmsModal,
  showAdminFeedbackModal,
  setShowAdminFeedbackModal,
  showManagerFeedbackModal,
  setShowManagerFeedbackModal,
  handleFeedbackSubmit,
  isFeedbackSubmitting,
  getAllowedStatuses,
}) => {
  const [localConsultSubTask, setLocalConsultSubTask] = useState(null);

  if (!consultTask) return null;

    const subj = getSubjectFromTask(consultTask.description);
    const msg = getMessageFromTask(consultTask.description);

    const dossierAssociated =
      mode === "MISSION"
        ? consultTask.dossier?.name
          ? `${consultTask.dossier.name} (${consultTask.dossier.reference || "DOS-" + consultTask.dossier.id})`
          : consultTask.dossierId || "-"
        : consultTask.mission?.reference || consultTask.missionId || "-";

    const createdByName = consultTask.createdBy?.name || "Système";
    const createdByRole = consultTask.createdBy?.role?.name || "-";

    const assignedToName = consultTask.assignedTo?.name || "Non assigné";
    const assignedToRole = consultTask.assignedTo?.role?.name || "-";

    const relecteurName = consultTask.relecteur?.name
      ? `${consultTask.relecteur.name} (${consultTask.relecteur.role?.name || "-"})`
      : "Non assigné (-)";

    const createdAtFormatted = new Date(consultTask.createdAt).toLocaleString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const echeanceFormatted = consultTask.echeance
      ? new Date(consultTask.echeance).toLocaleDateString("fr-FR")
      : "Non définie";

    const role = currentUser?.role?.name || currentUser?.role || "";

    const isTaskAssigned =
      consultTask?.assignedToId === currentUser?.id ||
      consultTask?.assignedTo?.id === currentUser?.id;
    const isMissionOwner =
      consultTask?.mission?.assignedToId === currentUser?.id ||
      consultTask?.dossier?.traitantId === currentUser?.id ||
      consultTask?.mission?.dossier?.traitantId === currentUser?.id;

    const canEditTask =
      role !== "Administrateur technique" &&
      (isSuperAdmin || isResp || isTaskAssigned || isMissionOwner) &&
      !(
        (consultTask?.status === "EN_FINALISATION" ||
          consultTask?.status === "EN_CONTROLE" ||
          consultTask?.status === "TERMINE") &&
        !isController
      ) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.dossier?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.dossier?.status);

    const statusOptions = getAllowedStatuses(
      consultTask.status || "NOUVEAU",
      role,
      mode,
      consultTask
    );
    const isStatusLocked = statusOptions.length === 1;

    const renderTaskPillBadge = (status) => {
      const s = String(status || "NOUVEAU").toUpperCase();
      const map = {
        NOUVEAU: { text: "Nouveau", bg: "#EFF6FF", color: "#2563EB", dot: "#2563EB" },
        EN_COURS: { text: "En cours", bg: "#FEF3C7", color: "#B45309", dot: "#D97706" },
        EN_RELECTURE: { text: "En relecture", bg: "#FAF5FF", color: "#7E22CE", dot: "#9333EA" },
        EN_APPROBATION: { text: "En approbation", bg: "#FAF5FF", color: "#7E22CE", dot: "#9333EA" },
        VERIFIER: { text: "À vérifier", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
        A_CORRIGER: { text: "À corriger", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
        APPROUVEE: { text: "Approuvée", bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
        TERMINE: { text: "Terminé", bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
        ARCHIVE: { text: "Archivé", bg: "#F1F5F9", color: "#475569", dot: "#64748B" },
        BLOQUE: { text: "Bloqué", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
        EN_ATTENTE: { text: "En attente", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
      };
      const c = map[s] || { text: s, bg: "#F1F5F9", color: "#475569", dot: "#64748B" };
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

    return (
      <div className="fade-in w-full" style={{padding:"0"}}>
        {/* Header Card conforming to Screenshots 2 & 3 */}
        <div
          className="flex justify-between items-center mb-6 flex-wrap gap-4" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
        >
          {/* Left info with colored icon */}
          <div className="flex items-center gap-4">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: mode === "MISSION" ? "#ECFDF5" : "#FAF5FF",
                border: `1px solid ${mode === "MISSION" ? "#A7F3D0" : "#F3E8FF"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {mode === "MISSION" ? (
                <Target size={24} color="#059669" />
              ) : (
                <CheckSquare size={24} color="#9333EA" />
              )}
            </div>
            <div>
              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                <h2
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}
                >
                  {mode === "MISSION" ? "Consultation mission :" : "Consultation tâche :"}{" "}
                  {consultTask.reference || consultTask.id}
                </h2>
                {renderTaskPillBadge(consultTask.status)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#64748B",
                  marginTop: "0.25rem",
                }}
              >
                Nom : {consultTask.reference || consultTask.id} • Objet : {subj || "-"} •{" "}
                {mode === "MISSION"
                  ? `Dossier associé : ${dossierAssociated}`
                  : `Mission Liée : ${dossierAssociated}`}
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
            {mode === "MISSION" &&
              !["TERMINE", "ARCHIVE", "BLOQUE", "EN_ATTENTE"].includes(consultTask.status) &&
              !["BLOQUE", "EN_ATTENTE"].includes(consultTask.dossier?.status) &&
              (isSuperAdmin || isResp || consultTask.assignedToId === currentUser?.id || consultTask.dossier?.traitantId === currentUser?.id) && (
                <button
                  type="button"
                  onClick={() => setCreateTaskModal(true)}
                  className="text-white font-semibold cursor-pointer flex items-center" style={{background:"#1E3A8A",border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem",gap:"0.4rem"}}
                >
                  + Créer une tâche
                </button>
              )}



            <button
              type="button"
              onClick={() => {
                setConsultTask(null);
                setTaskFile(null);
              }}
              className="inline-flex items-center font-semibold cursor-pointer bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:opacity-90 transition-opacity" style={{border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem"}}
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Two-Column Grid Conforming to Screenshots 2 & 3 */}
        <div
          className="grid gap-6" style={{gridTemplateColumns:"1fr 1.1fr",alignItems:"start"}}
        >
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Card 1: IDENTIFICATION */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"1.25rem"}}
              >
                {mode === "MISSION"
                  ? "Identification de la mission"
                  : "Identification de la tâche"}
              </div>

              <div className="flex flex-col" style={{gap:"0.85rem"}}>
                {/* Nom */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Nom :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {consultTask.reference || consultTask.id}
                  </div>
                </div>

                {/* Objet */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Objet :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",wordBreak:"break-word"}}>
                    {subj || "-"}
                  </div>
                </div>

                {/* Dossier associé / Mission Liée */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    {mode === "MISSION" ? "Dossier associé :" : "Mission Liée :"}
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {dossierAssociated}
                  </div>
                </div>

                {/* Dossier rattaché pour la tâche */}
                {mode !== "MISSION" && (
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                      Dossier rattaché :
                    </div>
                    <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {consultTask.mission?.dossier?.name
                        ? `${consultTask.mission.dossier.name} (${consultTask.mission.dossier.reference || "DOS-" + consultTask.mission.dossier.id})`
                        : consultTask.dossierTache?.name || "-"}
                    </div>
                  </div>
                )}

                {/* Optional Dossier Tâche for Task */}
                {mode !== "MISSION" && consultTask.dossierTache && (
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                      Dossier tâche :
                    </div>
                    <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {consultTask.dossierTache.name}
                    </div>
                  </div>
                )}

                {/* Optional Dossiers Autorisés for Task */}
                {mode !== "MISSION" &&
                  consultTask.authorizedDossiers &&
                  consultTask.authorizedDossiers.length > 0 && (
                    <div
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                        Dossiers autorisés :
                      </div>
                      <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                        {consultTask.authorizedDossiers.map((d) => d.name).join(", ")}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Card 2: Consignes / Description */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",marginBottom:"0.75rem"}}
              >
                Consignes / Description
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "1rem 1.25rem",
                }}
              >
                <div
                  className="text-[var(--text-main)] font-medium" style={{whiteSpace:"pre-wrap",fontSize:"0.9rem"}}
                >
                  {msg || (mode === "MISSION" ? "Aucune consigne fournie pour cette mission." : "Aucune consigne fournie pour cette tâche.")}
                </div>
                <div
                  className="mt-2" style={{fontSize:"0.75rem",color:"#94A3B8"}}
                >
                  {mode === "MISSION"
                    ? "Consignes opérationnelles enregistrées pour la réalisation de cette mission."
                    : "Directives précises pour l'exécution et la clôture de cette tâche."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Card 3: GESTION */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"1.25rem"}}
              >
                {mode === "MISSION"
                  ? "Gestion de la mission"
                  : "Gestion de la tâche"}
              </div>

              <div className="flex flex-col" style={{gap:"0.85rem"}}>
                {/* Créé par */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Créé par :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {createdByName}{" "}
                    <span className="font-medium" style={{color:"#64748B",fontSize:"0.85rem"}}>
                      ({createdByRole})
                    </span>
                  </div>
                </div>

                {/* Assigné à */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Assigné à :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {assignedToName}{" "}
                    <span className="font-medium" style={{color:"#64748B",fontSize:"0.85rem"}}>
                      ({assignedToRole})
                    </span>
                  </div>
                </div>

                {/* Relecteur */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Relecteur :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {relecteurName}
                  </div>
                </div>

                {/* Date de création */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Date de création :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {createdAtFormatted}
                  </div>
                </div>

                {/* Échéance */}
                {(() => {
                  const consultDeadline = getDeadlineEvaluation(consultTask);
                  return (
                    <div
                      style={{
                        background: consultDeadline.isCritical ? "#FEF2F2" : "#F8FAFC",
                        border: consultDeadline.isCritical ? "1px solid #FECACA" : "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <div className="font-medium flex items-center justify-between" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                        <span>Échéance :</span>
                        {consultDeadline.isCritical && (
                          <span className="flex items-center gap-1 font-bold text-red-700 text-[0.72rem]">
                            <AlertTriangle size={12} style={{ color: "#DC2626" }} /> Critique (&le; 24h)
                          </span>
                        )}
                      </div>
                      <div
                        className="font-bold flex items-center gap-1.5"
                        style={{
                          fontSize: "0.95rem",
                          color: consultDeadline.isCritical
                            ? "#991B1B"
                            : consultDeadline.status === "OK"
                              ? "#166534"
                              : "var(--text-main)",
                        }}
                      >
                        {consultDeadline.isCritical && (
                          <AlertTriangle size={14} style={{ color: "#DC2626" }} />
                        )}
                        <span>{echeanceFormatted}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Statut avec select et bouton Enregistrer conditionnel */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.35rem"}}>
                    Statut :
                  </div>
                  <div className="flex items-center flex-wrap" style={{gap:"0.6rem"}}>
                    <select
                      value={pendingStatus || consultTask.status || "NOUVEAU"}
                      onChange={(e) => setPendingStatus(e.target.value)}
                      disabled={isStatusLocked}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        background: isStatusLocked ? "#F3F4F6" : "#FFF",
                        outline: "none",
                        cursor: isStatusLocked ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "var(--text-main)",
                        minWidth: "150px",
                      }}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {!isStatusLocked && pendingStatus && pendingStatus !== consultTask.status && (
                      <button
                        type="button"
                        onClick={() => {
                          if (pendingStatus === "A_CORRIGER") {
                            // Cas spécial : feedback manager requis
                            setShowManagerFeedbackModal(true);
                            return;
                          }
                          if (pendingStatus === "ANNULEE" && mode === "MISSION") {
                            // Cas spécial : annulation en cascade → popup d'avertissement
                            setConfirmingStatus(pendingStatus);
                            return;
                          }
                          // Cas ordinaire : appel direct sans intermédiaire
                          handleWorkflowAction(consultTask.id, pendingStatus);
                        }}
                        className="flex items-center text-white cursor-pointer font-semibold" style={{padding:"0.45rem 0.85rem",fontSize:"0.8rem",gap:"0.35rem",background:"#1E3A8A",borderRadius:"6px",border:"none"}}
                      >
                        <CheckSquare size={14} /> Enregistrer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner conforming to Screenshots 2 & 3 */}
            {consultTask.status === "EN_ATTENTE" ? (
              <div
                style={{
                  background: "#FEF9C3",
                  border: "1px solid #FEF08A",
                  borderRadius: "8px",
                  padding: "1.1rem 1.25rem",
                  color: "#854D0E",
                }}
              >
                <div className="font-bold flex items-center gap-2" style={{fontSize:"0.9rem",marginBottom:"0.25rem"}}>
                  <span>⏸️</span> {mode === "MISSION" ? "Mission en attente" : "Tâche en attente"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#A16207" }}>
                  {(isSuperAdmin || isResp || (mode === "TACHE" && consultTask.mission?.assignedToId === currentUser?.id) || (mode === "MISSION" && consultTask.dossier?.traitantId === currentUser?.id))
                    ? `Cette ${mode === "MISSION" ? "mission" : "tâche"} est actuellement en attente. Statut avant suspension : "${consultTask.previousStatus || "Nouveau"}". Vous êtes autorisé à reprendre l'activité en rétablissant ce statut.`
                    : `Cette ${mode === "MISSION" ? "mission" : "tâche"} est en attente. Seul le Super-administrateur ou le responsable opérationnel peut lever l'attente.`}
                </div>
              </div>
            ) : mode === "TACHE" &&
            (consultTask.status === "EN_APPROBATION" ||
              consultTask.status === "EN_RELECTURE") ? (
              <div
                style={{
                  background: "#FAF5FF",
                  border: "1px solid #E9D5FF",
                  borderRadius: "8px",
                  padding: "1.1rem 1.25rem",
                  color: "#6B21A8",
                }}
              >
                <div className="font-bold" style={{fontSize:"0.9rem",marginBottom:"0.25rem"}}>
                  Statut : En attente d'approbation par le Relecteur
                </div>
                <div style={{ fontSize: "0.8rem", color: "#7E22CE" }}>
                  Le livrable a été transmis pour relecture par {assignedToName}.
                </div>
              </div>
            ) : !consultTask.relecteurId ? (
              <div
                style={{
                  background: "#FEF9C3",
                  border: "1px solid #FEF08A",
                  borderRadius: "8px",
                  padding: "1.1rem 1.25rem",
                  color: "#854D0E",
                }}
              >
                <div className="font-bold" style={{fontSize:"0.9rem",marginBottom:"0.25rem"}}>
                  Attention : Relecteur qualité non assigné (-)
                </div>
                <div style={{ fontSize: "0.8rem", color: "#A16207" }}>
                  Une relecture est nécessaire avant le passage en clôture.
                </div>
              </div>
            ) : null}

            {/* Attached documents if any */}
            {consultTask.documents && consultTask.documents.length > 0 && (
              <div
                style={{
                  background: "#FFF",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  className="font-bold text-[var(--text-main)] flex items-center gap-2" style={{fontSize:"0.85rem",marginBottom:"0.75rem"}}
                >
                  <Paperclip size={15} /> Documents attachés ({consultTask.documents.length})
                </div>
                <div className="flex flex-col gap-2">
                  {consultTask.documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setPreviewFile(doc.url)}
                      className="cursor-pointer flex items-center gap-2" style={{padding:"0.6rem 0.85rem",background:"#F8FAFC",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"0.85rem",color:"var(--primary)"}}
                    >
                      <FileText size={16} />
                      <span className="font-medium" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fil de corrections — visible selon le rôle et le statut */}
        <div className="mt-6">
          <FeedbackThread
            adminFeedback={consultTask.adminFeedback}
            managerFeedback={consultTask.managerFeedback}
            currentStatus={consultTask.status}
          />
        </div>

        <SmsModal
          isOpen={showSmsModal}
          onClose={() => setShowSmsModal(false)}
          contextData={{
            missionId:
              mode === "MISSION" ? consultTask.id : consultTask.missionId,
            dossierId:
              mode === "MISSION"
                ? consultTask.dossierId
                : consultTask.dossierTacheId || null,
            tacheId: mode === "TACHE" ? consultTask.id : null,
            createdById: consultTask.createdById,
            assignedToId: consultTask.assignedToId,
            reference: consultTask.reference,
          }}
        />

        <TaskConsultModal
          task={localConsultSubTask}
          onClose={() => setLocalConsultSubTask(null)}
        />
        <FilePreviewModal
          previewFile={previewFile}
          onClose={() => setPreviewFile(null)}
        />

        {/* Admin Feedback Modal — Super Admin → À améliorer */}
        <FeedbackModal
          isOpen={showAdminFeedbackModal}
          mode="admin"
          onClose={() => setShowAdminFeedbackModal(false)}
          onSubmit={(text) => handleFeedbackSubmit(text, "admin")}
          isSubmitting={isFeedbackSubmitting}
        />

        {/* Manager Feedback Modal — Contrôleur → En révision */}
        <FeedbackModal
          isOpen={showManagerFeedbackModal}
          mode="manager"
          referenceFeedback={consultTask.adminFeedback || null}
          onClose={() => setShowManagerFeedbackModal(false)}
          onSubmit={(text) => handleFeedbackSubmit(text, "manager")}
          isSubmitting={isFeedbackSubmitting}
        />

      </div>
    );
};

export default ConsultTaskView;
