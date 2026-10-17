import React, { useState } from "react";
import { CheckSquare, Trash, Paperclip } from "lucide-react";
import TaskConsultModal from "../TaskConsultModal";
import { getStatusBadge } from "../../utils/helpers";

const DOSSIER_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente",
  TERMINE: "Terminé",
  CLOTURE: "Clôturé",
  ARCHIVE: "Archivé",
  BLOQUE: "Bloqué",
};

const EditDossierView = ({
  editDossier,
  setEditDossier,
  dbTasks = [],
  dbClients = [],
  dbUsers = [],
  currentUser,
  handleUpdateDossier,
  handleStatusAction,
  getAllowedDossierStatuses,
  setPreviewFile,
  onCancel,
}) => {
  const [pendingStatus, setPendingStatus] = useState("");
  const [localConsultTask, setLocalConsultTask] = useState(null);

  if (!editDossier) return null;

  const associatedTasks = dbTasks.filter((t) => t.dossierId === editDossier.id);

  const renderWorkflowButtons = (dossier) => {
    if (!dossier) return null;
    const role = currentUser?.role?.name || currentUser?.role || "";
    const isSuperAdmin =
      role === "Super-administrateur" ||
      role === "Administrateur" ||
      currentUser?.id === "MASTER-ADMIN";
    const isResp = role === "Responsable opérationnel" || isSuperAdmin;
    const isAssigned =
      dossier.traitantId === currentUser?.id ||
      dossier.traitant?.id === currentUser?.id ||
      dossier.createdById === currentUser?.id;

    if (!isSuperAdmin && !isResp && !isAssigned) return null;

    const options = getAllowedDossierStatuses
      ? getAllowedDossierStatuses(dossier, currentUser)
      : [];
    const isLocked = options.length === 1;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: isLocked ? "#F3F4F6" : "#F8FAFC",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: `1px solid ${isLocked ? "#E5E7EB" : "var(--border)"}`,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: isLocked ? "#9CA3AF" : "var(--text-main)",
          }}
        >
          Statut :
        </span>
        <select
          value={pendingStatus || dossier.status || "NOUVEAU"}
          onChange={(e) => setPendingStatus(e.target.value)}
          disabled={isLocked}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid var(--border)",
            background: isLocked ? "#F3F4F6" : "#FFF",
            outline: "none",
            cursor: isLocked ? "not-allowed" : "pointer",
            minWidth: "150px",
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {pendingStatus && pendingStatus !== (dossier.status || "NOUVEAU") && (
          <button
            type="button"
            onClick={async () => {
              if (
                await window.customConfirm(
                  `Vous allez enregistrer 1 modification(s) sur ce dossier.\n\nStatut : ${
                    DOSSIER_STATUS_LABELS[pendingStatus] || pendingStatus
                  }`,
                  "Confirmer l'enregistrement"
                )
              ) {
                if (handleStatusAction) {
                  handleStatusAction(dossier.id, pendingStatus);
                }
              }
            }}
            className="btn btn-primary flex items-center"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem", gap: "0.25rem" }}
          >
            <CheckSquare size={14} /> Enregistrer
          </button>
        )}
      </div>
    );
  };

  const renderDossierFields = (dossier) => (
    <div
      className="grid gap-4 mb-6"
      style={{
        gridTemplateColumns: "1fr 1fr",
        background: "#F8FAFC",
        padding: "1.25rem 1.5rem",
        borderRadius: "8px",
        border: "1px solid var(--border)",
      }}
    >
      {/* Colonne 1 — Identification du dossier */}
      <div
        className="flex flex-col"
        style={{
          gap: "0.85rem",
          borderRight: "1px solid var(--border)",
          paddingRight: "1rem",
        }}
      >
        <div
          className="font-bold"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--primary)",
            marginBottom: "0.25rem",
          }}
        >
          Identification du dossier
        </div>

        <div className="flex items-start gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Nom du dossier :
          </strong>
          <input
            type="text"
            value={dossier.name || ""}
            onChange={(e) =>
              setEditDossier({ ...editDossier, name: e.target.value })
            }
            className="input-field"
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              border: "1px solid var(--primary)",
              background: "#FFF",
              flex: 1,
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Origine :
          </strong>
          <span className="font-medium text-[var(--text-main)]">
            {dossier.origin || "INTERNE"}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Propriétaire :
          </strong>
          <span className="font-medium text-[var(--text-main)]">
            {dossier.origin === "CLIENT"
              ? dossier.client?.name ||
                dossier.client?.companyName ||
                dbClients.find((c) => c.id === dossier.clientId)?.name ||
                dbClients.find((c) => c.id === dossier.clientId)?.companyName ||
                "Client inconnu"
              : dossier.origin === "COLLABORATEUR"
              ? dossier.targetUser?.name ||
                dbUsers.find((u) => u.id === dossier.targetUserId)?.name ||
                "Collaborateur inconnu"
              : "MENUA CONSULTING (Interne)"}
          </span>
        </div>
      </div>

      {/* Colonne 2 — Gestion du dossier */}
      <div className="flex flex-col" style={{ gap: "0.85rem", paddingLeft: "0.5rem" }}>
        <div
          className="font-bold"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--secondary-dark)",
            marginBottom: "0.25rem",
          }}
        >
          Gestion du dossier
        </div>

        <div className="flex items-center gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Traitant :
          </strong>
          {currentUser?.role?.name === "Super-administrateur" ||
          currentUser?.role === "Super-administrateur" ||
          currentUser?.role?.name === "Responsable opérationnel" ||
          currentUser?.role === "Responsable opérationnel" ||
          currentUser?.id === "MASTER-ADMIN" ? (
            <select
              value={editDossier?.traitantId || dossier.traitantId || ""}
              onChange={(e) =>
                setEditDossier({ ...editDossier, traitantId: e.target.value })
              }
              className="input-field"
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                border: "1px solid var(--primary)",
                background: "#FFF",
                flex: 1,
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
            <span className="font-medium text-[var(--text-main)]">
              {dossier.traitant?.name || "Aucun"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Créé par :
          </strong>
          <span className="font-medium text-[var(--text-main)]">
            {dossier.createdBy?.name || "Inconnu"}
            {dossier.createdBy?.role?.name && (
              <span
                style={{
                  color: "var(--text-muted)",
                  marginLeft: "0.4rem",
                  fontSize: "0.8rem",
                }}
              >
                ({dossier.createdBy.role.name})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
            Date de création :
          </strong>
          <span className="font-medium text-[var(--text-main)]">
            {new Date(dossier.createdAt).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {renderWorkflowButtons(editDossier) || (
          <div className="flex items-center gap-2">
            <strong className="font-semibold" style={{ color: "var(--text-muted)" }}>
              Statut :
            </strong>
            <span>{getStatusBadge(editDossier?.status || dossier.status)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fade-in w-full" style={{ padding: "0" }}>
      <div
        className="flex items-center gap-4 mb-8"
        style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          style={{ padding: "0.5rem 1rem" }}
        >
          ← Retour
        </button>
        <h2 className="font-semibold" style={{ fontSize: "1.5rem" }}>
          Modifier le Dossier: {editDossier.reference || editDossier.id}
        </h2>
      </div>

      {renderDossierFields(editDossier)}

      <div
        className="flex mt-4 items-start"
        style={{
          gap: "2rem",
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
        }}
      >
        <div style={{ flex: "0 0 70%" }}>
          <h4
            className="font-semibold"
            style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}
          >
            Description du dossier
          </h4>
          <textarea
            value={editDossier.description || ""}
            onChange={(e) =>
              setEditDossier({ ...editDossier, description: e.target.value })
            }
            className="input-field w-full p-6 text-[var(--text-main)]"
            style={{
              background: "#FFF",
              borderRadius: "8px",
              border: "1px solid var(--primary)",
              minHeight: "120px",
              resize: "vertical",
              fontFamily: "inherit",
            }}
            placeholder="Description du dossier..."
          />
        </div>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div className="h-full flex flex-col">
            <h4
              className="font-semibold"
              style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}
            >
              Gérer les missions associées
            </h4>
            {associatedTasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {associatedTasks.map((task) => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() => setLocalConsultTask(task)}
                    className="flex justify-between items-center p-4 cursor-pointer w-full text-left"
                    style={{
                      background: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      transition: "border-color 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    <div className="flex flex-col" style={{ gap: "0.25rem" }}>
                      <strong className="truncate-text">
                        {task.subject || `Mission ${task.reference || task.id}`}
                      </strong>
                      <span className="flex items-center">
                        {getStatusBadge(task.status)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="p-4 text-center"
                style={{
                  background: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px dashed var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                Aucune mission associée pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="mt-8 flex justify-between items-center flex-wrap gap-4"
        style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}
      >
        <div className="flex gap-4 flex-wrap">
          {renderWorkflowButtons(editDossier)}
        </div>
        <div className="flex gap-4 flex-wrap">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Annuler
          </button>
          <button
            type="button"
            onClick={handleUpdateDossier}
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <TaskConsultModal
        task={localConsultTask}
        onClose={() => setLocalConsultTask(null)}
        titlePrefix="Consulter la Mission:"
      />
    </div>
  );
};

export default EditDossierView;
