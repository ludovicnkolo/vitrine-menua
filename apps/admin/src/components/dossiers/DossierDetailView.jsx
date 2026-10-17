import React, { useState } from "react";
import {
  Folder,
  Share2,
  AlertTriangle,
  CheckSquare,
  Paperclip,
  FileText,
} from "lucide-react";
import TaskConsultModal from "../TaskConsultModal";
import FilePreviewModal from "../FilePreviewModal";
import ClientSharingModal from "../modals/ClientSharingModal";
import CreateMissionModal from "../modals/CreateMissionModal";
import { getSafeApiUrl, getDeadlineEvaluation } from "../../utils/helpers";

const DOSSIER_PILL_MAP = {
  NOUVEAU: { text: "Nouveau", bg: "#EFF6FF", color: "#2563EB", dot: "#2563EB" },
  EN_COURS: { text: "En cours", bg: "#FEF3C7", color: "#B45309", dot: "#D97706" },
  EN_APPROBATION: { text: "En approbation", bg: "#FAF5FF", color: "#7E22CE", dot: "#9333EA" },
  VERIFIER: { text: "À vérifier", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
  A_CORRIGER: { text: "À corriger", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
  TERMINE: { text: "Terminé", bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  ARCHIVE: { text: "Archivé", bg: "#F1F5F9", color: "#475569", dot: "#64748B" },
  BLOQUE: { text: "Bloqué", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
  EN_ATTENTE: { text: "En attente", bg: "#FEF9C3", color: "#854D0E", dot: "#CA8A04" },
  ANNULEE: { text: "Annulé", bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
};

const renderPillBadge = (status) => {
  const s = String(status || "NOUVEAU").toUpperCase();
  const c = DOSSIER_PILL_MAP[s] || { text: s, bg: "#F1F5F9", color: "#475569", dot: "#64748B" };
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

const getTaskSubject = (desc) => {
  if (!desc) return "";
  const match = desc.match(/\[OBJET\]:\s*(.*?)(?=\n\[|$)/);
  return match ? match[1].trim() : desc.split("\n")[0];
};

const DossierDetailView = ({
  consultDossier,
  setConsultDossier,
  dbTasks = [],
  dbClients = [],
  dbUsers = [],
  currentUser,
  fetchDossiers,
  handleStatusAction,
  getAllowedDossierStatuses,
  onBack,
}) => {
  const [localConsultTask, setLocalConsultTask] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [createMissionModal, setCreateMissionModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  if (!consultDossier) return null;

  const associatedTasks = dbTasks.filter((t) => t.dossierId === consultDossier.id);
  const isSuperAdmin =
    currentUser?.role?.name === "Super-administrateur" ||
    currentUser?.role === "Super-administrateur" ||
    currentUser?.role?.name === "Administrateur" ||
    currentUser?.role === "Administrateur" ||
    currentUser?.id === "MASTER-ADMIN";
  const isResp =
    currentUser?.role?.name === "Responsable opérationnel" ||
    currentUser?.role === "Responsable opérationnel" ||
    isSuperAdmin;
  const isAssigned =
    consultDossier?.traitantId === currentUser?.id ||
    consultDossier?.traitant?.id === currentUser?.id ||
    consultDossier?.createdById === currentUser?.id;
  const isLocked = ["BLOQUE", "EN_ATTENTE"].includes(consultDossier.status);
  const canEdit = (isSuperAdmin || isResp || isAssigned) && !isLocked;
  const isEditMode = consultDossier._editing === true;

  const startEdit = () =>
    setConsultDossier({
      ...consultDossier,
      _editing: true,
      _draft: {
        description: consultDossier.description || "",
        traitantId: consultDossier.traitantId || "",
      },
    });

  const cancelEdit = () =>
    setConsultDossier({
      ...consultDossier,
      _editing: false,
      description: consultDossier._origDesc ?? consultDossier.description,
      traitantId: consultDossier._origTraitant ?? consultDossier.traitantId,
    });

  const saveEdit = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${consultDossier.id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: consultDossier.description,
          traitantId: consultDossier.traitantId || null,
        }),
      });
      if (res.ok) {
        setConsultDossier({ ...consultDossier, _editing: false });
        if (fetchDossiers) fetchDossiers();
        window.customAlert("Dossier mis à jour !");
      } else {
        const err = await res.json().catch(() => ({}));
        window.customAlert("Erreur : " + (err.error || "Impossible de sauvegarder"));
      }
    } catch (e) {
      window.customAlert("Erreur réseau");
    }
  };

  const ownerName =
    consultDossier.origin === "CLIENT"
      ? consultDossier.client?.name ||
        consultDossier.client?.companyName ||
        dbClients.find((c) => c.id === consultDossier.clientId)?.name ||
        dbClients.find((c) => c.id === consultDossier.clientId)?.companyName ||
        "Client inconnu"
      : consultDossier.origin === "COLLABORATEUR"
      ? consultDossier.targetUser?.name ||
        dbUsers.find((u) => u.id === consultDossier.targetUserId)?.name ||
        "Collaborateur inconnu"
      : "MENUA CONSULTING (Interne)";

  const creatorName = consultDossier.createdBy?.name
    ? `${consultDossier.createdBy.name}${
        consultDossier.createdBy.role?.name
          ? ` (${consultDossier.createdBy.role.name})`
          : ""
      }`
    : "Inconnu";

  const traitantName =
    consultDossier.traitant?.name ||
    dbUsers.find((u) => u.id === consultDossier.traitantId)?.name ||
    "Aucun";

  const createdAtFormatted = new Date(consultDossier.createdAt).toLocaleString(
    "fr-FR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const activeTasks = associatedTasks.filter(
    (t) => !["TERMINE", "ARCHIVE", "ANNULEE"].includes(t.status)
  );
  const tasksByStatus = associatedTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const statusNameMap = {
    NOUVEAU: "Nouveau",
    EN_COURS: "En cours",
    EN_APPROBATION: "En approbation",
    VERIFIER: "À vérifier",
    A_CORRIGER: "À corriger",
    TERMINE: "Terminé",
    ARCHIVE: "Archivé",
    BLOQUE: "Bloqué",
    EN_ATTENTE: "En attente",
  };
  const breakdownList = Object.entries(tasksByStatus).map(
    ([st, cnt]) =>
      `${cnt} mission${cnt > 1 ? "s" : ""} en statut ${statusNameMap[st] || st}`
  );
  const breakdownString =
    breakdownList.length > 0
      ? breakdownList.join(", ") + "."
      : "Aucune mission active.";

  const canChangeStatus = isSuperAdmin || isResp || isAssigned;
  const statusOptions = getAllowedDossierStatuses
    ? getAllowedDossierStatuses(consultDossier, currentUser)
    : [];
  const isStatusLocked = !canChangeStatus || statusOptions.length === 1;

  return (
    <div className="fade-in w-full" style={{ padding: "0" }}>
      {/* Header Card */}
      <div
        className="flex justify-between items-center mb-6 flex-wrap gap-4"
        style={{
          background: "#FFF",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
            }}
          >
            <Folder size={24} color="#D97706" fill="#FBBF24" />
          </div>
          <div>
            <div className="flex items-center flex-wrap" style={{ gap: "0.75rem" }}>
              <h2
                className="font-bold text-[var(--text-main)]"
                style={{ fontSize: "1.35rem" }}
              >
                Consultation du dossier : {consultDossier.reference || consultDossier.id}
              </h2>
              {renderPillBadge(consultDossier.status)}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#64748B",
                marginTop: "0.25rem",
              }}
            >
              Nom : {consultDossier.name || "-"} • Origine :{" "}
              {consultDossier.origin || "GÉNÉRAL"} • Créé le {createdAtFormatted} par{" "}
              {creatorName}
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center flex-wrap" style={{ gap: "0.75rem" }}>
          {!["TERMINE", "ARCHIVE", "BLOQUE", "EN_ATTENTE"].includes(
            consultDossier.status
          ) && (
            <>
              <button
                type="button"
                onClick={() => setShowMagicModal(true)}
                className="font-medium cursor-pointer flex items-center gap-1.5"
                style={{
                  background: "#FFF",
                  border: "1px solid #CBD5E1",
                  color: "#334155",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                <Share2 size={15} />
                Partage de document
              </button>

              {(isSuperAdmin || isResp || isAssigned) && (
                <button
                  type="button"
                  onClick={() => setCreateMissionModal(true)}
                  className="text-white font-semibold cursor-pointer flex items-center"
                  style={{
                    background: "#1E3A8A",
                    border: "none",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    gap: "0.4rem",
                  }}
                >
                  + Créer une mission
                </button>
              )}
            </>
          )}

          {canEdit && !isEditMode && (
            <button
              type="button"
              onClick={startEdit}
              className="font-semibold cursor-pointer"
              style={{
                background: "#FFF",
                border: "1px solid #CBD5E1",
                color: "#475569",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            >
              Modifier
            </button>
          )}

          {isEditMode && (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                className="font-semibold cursor-pointer"
                style={{
                  background: "#FFF",
                  border: "1px solid #CBD5E1",
                  color: "#475569",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="text-white font-semibold cursor-pointer"
                style={{
                  background: "#1E3A8A",
                  border: "none",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Enregistrer
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center font-semibold cursor-pointer bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:opacity-90 transition-opacity"
            style={{
              border: "none",
              padding: "0.55rem 1.1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
            }}
          >
            ← Retour
          </button>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "1fr 1.1fr", alignItems: "start" }}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Card 1: IDENTIFICATION DU DOSSIER */}
          <div
            className="p-6"
            style={{
              background: "#FFF",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              className="font-bold text-[var(--text-main)]"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              Identification du dossier
            </div>

            <div className="flex flex-col" style={{ gap: "0.85rem" }}>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Nom du dossier :
                </div>
                <div
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem", wordBreak: "break-word" }}
                >
                  {consultDossier.name || "-"}
                </div>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Origine :
                </div>
                <div
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  {consultDossier.origin || "GENERAL"}
                </div>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Propriétaire :
                </div>
                <div
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  {ownerName}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: GESTION DU DOSSIER */}
          <div
            className="p-6"
            style={{
              background: "#FFF",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              className="font-bold text-[var(--text-main)]"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              Gestion du dossier
            </div>

            <div className="flex flex-col" style={{ gap: "0.85rem" }}>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Traitant :
                </div>
                {isEditMode && (isSuperAdmin || isResp) ? (
                  <select
                    value={consultDossier.traitantId || ""}
                    onChange={(e) =>
                      setConsultDossier({
                        ...consultDossier,
                        traitantId: e.target.value,
                      })
                    }
                    className="w-full font-medium text-[var(--text-main)]"
                    style={{
                      padding: "0.45rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "#FFF",
                      fontSize: "0.9rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    <option value="">-- Aucun traitant --</option>
                    {dbUsers
                      .filter(
                        (u) =>
                          u.role?.name === "Responsable opérationnel" ||
                          u.role?.name === "Super-administrateur"
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role?.name})
                        </option>
                      ))}
                  </select>
                ) : (
                  <div
                    className="font-bold text-[var(--text-main)]"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {traitantName}
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Créé par :
                </div>
                <div
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  {creatorName}
                </div>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.25rem",
                  }}
                >
                  Date de création :
                </div>
                <div
                  className="font-bold text-[var(--text-main)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  {createdAtFormatted}
                </div>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "0.35rem",
                  }}
                >
                  Statut :
                </div>
                <div
                  className="flex items-center flex-wrap"
                  style={{ gap: "0.6rem" }}
                >
                  <select
                    value={pendingStatus || consultDossier.status || "NOUVEAU"}
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

                  {pendingStatus &&
                    pendingStatus !== (consultDossier.status || "NOUVEAU") && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            await window.customConfirm(
                              `Vous allez enregistrer 1 modification(s) sur ce dossier.\n\nStatut : ${pendingStatus}`,
                              "Confirmer l'enregistrement"
                            )
                          ) {
                            if (handleStatusAction) {
                              handleStatusAction(consultDossier.id, pendingStatus);
                            }
                          }
                        }}
                        className="flex items-center text-white cursor-pointer font-semibold"
                        style={{
                          padding: "0.45rem 0.85rem",
                          fontSize: "0.8rem",
                          gap: "0.35rem",
                          background: "#1E3A8A",
                          borderRadius: "6px",
                          border: "none",
                        }}
                      >
                        <CheckSquare size={14} /> Enregistrer
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Card 3: Description du dossier */}
          <div
            className="p-6"
            style={{
              background: "#FFF",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              className="font-bold text-[var(--text-main)]"
              style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}
            >
              Description du dossier
            </div>

            {isEditMode ? (
              <textarea
                value={consultDossier.description || ""}
                onChange={(e) =>
                  setConsultDossier({
                    ...consultDossier,
                    description: e.target.value,
                  })
                }
                className="w-full p-4 text-[var(--text-main)]"
                style={{
                  background: "#FFF",
                  borderRadius: "8px",
                  border: "1px solid var(--primary)",
                  minHeight: "100px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                placeholder="Description du dossier..."
              />
            ) : (
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "1rem 1.25rem",
                }}
              >
                <div
                  className="text-[var(--text-main)] font-medium"
                  style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}
                >
                  {consultDossier.description ||
                    "Aucune description enregistrée pour ce dossier."}
                </div>
                <div
                  className="mt-2"
                  style={{ fontSize: "0.75rem", color: "#94A3B8" }}
                >
                  Notes et directives générales enregistrées pour ce dossier opérationnel.
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Vues des missions associées */}
          <DossierTasksCard
            associatedTasks={associatedTasks}
            onSelectTask={setLocalConsultTask}
          />

          {/* Attached documents */}
          {consultDossier.documents && consultDossier.documents.length > 0 && (
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
                className="font-bold text-[var(--text-main)] flex items-center gap-2"
                style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}
              >
                <Paperclip size={15} /> Documents attachés (
                {consultDossier.documents.length})
              </div>
              <div className="flex flex-col gap-2">
                {consultDossier.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewFile(doc.url)}
                    className="cursor-pointer flex items-center gap-2"
                    style={{
                      padding: "0.6rem 0.85rem",
                      background: "#F8FAFC",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      fontSize: "0.85rem",
                      color: "var(--primary)",
                    }}
                  >
                    <FileText size={16} />
                    <span
                      className="font-medium"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ClientSharingModal
        isOpen={showMagicModal}
        onClose={() => setShowMagicModal(false)}
        consultDossier={consultDossier}
        dbClients={dbClients}
        dbUsers={dbUsers}
        onRefresh={fetchDossiers}
      />

      <CreateMissionModal
        isOpen={createMissionModal}
        onClose={() => setCreateMissionModal(false)}
        consultDossier={consultDossier}
        dbUsers={dbUsers}
        onSuccess={() => {
          if (fetchDossiers) fetchDossiers();
          onBack();
        }}
      />

      <TaskConsultModal
        task={localConsultTask}
        onClose={() => setLocalConsultTask(null)}
        titlePrefix="Consulter la Mission:"
      />

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default DossierDetailView;
