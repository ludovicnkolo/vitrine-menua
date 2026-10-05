import {
  getSafeApiUrl,
  uploadFile,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
} from "../utils/helpers";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MoreVertical,
  Pencil,
  Eye,
  Trash,
  Mail,
  MessageSquare,
  Search,
  Files,
  FileText,
  Check,
  CheckSquare,
  Target,
  Paperclip,
} from "lucide-react";
import ActionDropdown from "../components/ActionDropdown";
import FilePreviewModal from "../components/FilePreviewModal";
import SmsModal from "../components/SmsModal";
import TaskConsultModal from "../components/TaskConsultModal";
import AttachmentChips from "../components/AttachmentChips";
import AttachmentSelect from "../components/AttachmentSelect";
import FeedbackThread from "../components/FeedbackThread";
import FeedbackModal from "../components/FeedbackModal";
import GedExplorer from "../components/GedExplorer";

const TACHE_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_RELECTURE: "En relecture",
  EN_APPROBATION: "En approbation",
  APPROUVEE: "Approuvée",
  A_CORRIGER: "À corriger",
  BLOQUE: "Bloqué",
  EN_ATTENTE: "En attente",
  TERMINE: "Terminé"
};

const getSubjectFromTask = (desc) => {
  if (!desc) return "Sans objet";
  const match = desc.match(/Objet: (.*)/);
  return match ? match[1] : desc.split("\n")[0];
};

const getMessageFromTask = (desc) => {
  if (!desc) return "Aucun message";
  const match = desc.match(/Consignes:\s*([\s\S]*)/);
  if (match) return match[1];
  const lines = desc.split("\n");
  return lines.length > 1 ? lines.slice(1).join("\n").trim() : desc;
};

const TaskField = ({
  label,
  value,
  readOnly = true,
  onChange = null,
  isTextarea = false,
}) => {
  const id = `field-${label.replace(/\s+/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontWeight: 500,
          
        }}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: readOnly
              ? "1px solid var(--border)"
              : "1px solid var(--primary)",
            minHeight: "120px",
            resize: readOnly ? "none" : "vertical",
            fontFamily: "inherit",
            background: readOnly ? "#F8FAFC" : "#FFF",
            color: "var(--text-main)",
          }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          className="input-field"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: readOnly
              ? "1px solid var(--border)"
              : "1px solid var(--primary)",
            background: readOnly ? "#F8FAFC" : "#FFF",
            color: "var(--text-main)",
          }}
        />
      )}
    </div>
  );
};

const TaskDropdown = ({
  taskId,
  openMenuId,
  setOpenMenuId,
  menuRef,
  tasks,
  setConsultTask,
  setEditTask,
  setEditFormData,
  fetchData,
  currentUser,
}) => {
  const task = tasks.find((t) => t.id === taskId);
  const role = currentUser?.role?.name || currentUser?.role || "";
  const isSuperAdmin =
    role === "Super-administrateur" || role === "Administrateur";
  const isResp = role === "Responsable opérationnel" || isSuperAdmin;
  const isController = role === "Relecteur" || isResp;

  const isLockedForCollab =
    (task?.status === "EN_FINALISATION" ||
      task?.status === "EN_CONTROLE" ||
      task?.status === "TERMINE") &&
    !isController;

  return (
    <ActionDropdown
      isOpen={openMenuId === taskId}
      menuRef={menuRef}
      width="130px"
    >
      <button
        type="button"
        className="dropdown-item"
        onClick={() => {
          setOpenMenuId(null);
          setConsultTask(task);
        }}
      >
        <Eye size={14} /> Consulter
      </button>
      {!isLockedForCollab && (
        <button
          type="button"
          className="dropdown-item"
          onClick={() => {
            setOpenMenuId(null);
            setEditTask(task);
            const subj = getSubjectFromTask(task.description);
            const msg = getMessageFromTask(task.description);
            setEditFormData({
              subject: subj,
              message: msg,
              status: task.status,
              attachment: task.attachment || "",
              assignedToId: task.assignedToId || "",
              relecteurId: task.relecteurId || "",
              echeance: task.echeance ? task.echeance.substring(0, 10) : "",
            });
          }}
        >
          <Pencil size={14} color="#D97706" /> Modifier
        </button>
      )}
      <button
        type="button"
        className="dropdown-item"
        onClick={async () => {
          setOpenMenuId(null);
          if (
            await window.customConfirm(
              mode === "MISSION" 
                ? "Êtes-vous sûr de vouloir supprimer cette mission ?\n\nATTENTION : Cette action supprimera également, de façon hiérarchique, toutes les tâches associées vers la corbeille."
                : "Êtes-vous sûr de vouloir supprimer cette tâche ?\n\nElle sera déplacée vers la corbeille.",
              mode === "MISSION" ? "Avertissement de suppression de la mission" : "Supprimer la tâche"
            )
          ) {
            try {
              const token = sessionStorage.getItem("adminToken");
              const res = await fetch(
                new URL(
                  getSafeApiUrl(`/api/crm/tasks/${encodeURIComponent(taskId)}`),
                ).toString(),
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              if (res.ok) fetchData();
            } catch (e) {
              console.error("Erreur suppr mission:", e);
            }
          }
        }}
        style={{ color: "var(--danger)" }}
      >
        <Trash size={14} /> Supprimer
      </button>
    </ActionDropdown>
  );
};
const GenericTaskPage = ({ mode = "MISSION" }) => {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultTask, setConsultTask] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [confirmingStatus, setConfirmingStatus] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [localConsultSubTask, setLocalConsultSubTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: "",
    message: "",
    status: "",
    attachment: "",
    assignedToId: "",
    relecteurId: "",
    echeance: "",
  });
  const [taskFile, setTaskFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [selectedParentDocs, setSelectedParentDocs] = useState([]);
  const [selectedMissionDocs, setSelectedMissionDocs] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const menuRef = useRef(null);

  const role = currentUser?.role?.name || currentUser?.role || "";
  const isSuperAdmin =
    role === "Super-administrateur" || role === "Administrateur";
  const isResp = role === "Responsable opérationnel" || isSuperAdmin;
  const isController = role === "Relecteur" || isResp;

  // Feedback workflow modals
  const [showAdminFeedbackModal, setShowAdminFeedbackModal] = useState(false);
  const [showManagerFeedbackModal, setShowManagerFeedbackModal] =
    useState(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("adminUser");
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Real API  states
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setRawErrorMsg] = useState(null);
  const setErrorMsg = (msg) => {
    if (msg) window.customAlert(msg);
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form states for creating a task
  const [newTaskSubject, setNewTaskSubject] = useState("");
  const [newTaskMessage, setNewTaskMessage] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [newTaskRelecteur, setNewTaskRelecteur] = useState("");
  const [newTaskEcheance, setNewTaskEcheance] = useState("");
  const [selectedDossierTacheId, setSelectedDossierTacheId] = useState("");
  const [selectedAuthorizedTacheIds, setSelectedAuthorizedTacheIds] = useState(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: "Bearer " + token };

      const urlTasks = new URL(
        getSafeApiUrl(
          mode === "MISSION" ? `/api/crm/tasks` : `/api/crm/taches`,
        ),
      );
      urlTasks.searchParams.append("page", page);
      urlTasks.searchParams.append("limit", "15");
      urlTasks.searchParams.append("status", filterStatus);
      urlTasks.searchParams.append("search", searchQuery);

      const [resTasks, resUsers] = await Promise.all([
        fetch(urlTasks.toString(), { headers }),
        fetch(new URL(getSafeApiUrl(`/api/crm/users`)).toString(), { headers }),
      ]);

      const dataTasks = await resTasks.json();
      const dataUsers = await resUsers.json();

      if (dataTasks && dataTasks.data) {
        setTasks(dataTasks.data);
        setTotalPages(dataTasks.totalPages || 1);
      } else {
        setTasks(Array.isArray(dataTasks) ? dataTasks : []);
        setTotalPages(1);
      }

      setUsers(Array.isArray(dataUsers) ? dataUsers : []);
    } catch (e) {
      console.error("Erreur de chargement:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, filterStatus]);

  const handleUpdateMission = async () => {
    if (!editTask) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const description = `Objet: ${editFormData.subject}\nConsignes: ${editFormData.message}`;
      const res = await fetch(
        new URL(
          getSafeApiUrl(
            mode === "MISSION"
              ? `/api/crm/tasks/${encodeURIComponent(editTask.id)}`
              : `/api/crm/taches/${encodeURIComponent(editTask.id)}`,
          ),
        ).toString(),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description,
            assignedToId: editFormData.assignedToId || null,
            relecteurId: editFormData.relecteurId || null,
            echeance: editFormData.echeance || null,
          }),
        },
      );
      if (res.ok) {
        setEditTask(null);
        fetchData();
        setErrorMsg(`${mode === "MISSION" ? "Mission" : "Tâche"} mise à jour avec succès !`);
      } else {
        let errMsg = "Erreur lors de la mise à jour.";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        setErrorMsg(errMsg);
      }
    } catch (err) {
      console.error("Erreur mise à jour mission:", err);
      setErrorMsg("Erreur de connexion.");
    }
  };

  const handleWorkflowAction = async (taskId, newStatus) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const url = new URL(
        getSafeApiUrl(
          mode === "MISSION"
            ? `/api/crm/tasks/${encodeURIComponent(taskId)}`
            : `/api/crm/taches/${encodeURIComponent(taskId)}`,
        ),
      ).toString();
      
      const res = await fetch(url,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        fetchData();
        if (consultTask && consultTask.id === taskId) {
          setConsultTask({ ...consultTask, status: newStatus });
        }
        if (editTask && editTask.id === taskId) {
          setEditTask({ ...editTask, status: newStatus });
        }
        setPendingStatus("");
        
        // Show success popup with same styling as errors
        // setErrorMsg(`Statut mis à jour : ${newStatus}`);
      } else {
        let errMsg = "Erreur lors de la mise à jour du statut.";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        setErrorMsg(errMsg);
      }
    } catch (err) {
      console.error("Erreur action workflow:", err);
      setErrorMsg("Erreur de connexion.");
    }
  };

  /**
   * getAllowedStatuses — Matrice de transition par rôle
   * Retourne uniquement les transitions autorisées pour le rôle et le statut courant.
   * Inclut toujours le statut courant en premier (pour que le select ne soit jamais vide).
   */
  const getAllowedStatuses = (currentStatus, userRole, entityMode, taskObj) => {
    const role =
      typeof userRole === "object" ? userRole?.name || "" : userRole || "";
    const isSuperAdmin = role === "Super-administrateur";
    const isResp = role === "Responsable opérationnel";
    const isRelecteur = role === "Relecteur";
    const isCollab = role === "Collaborateur";
    const isRespOrAdmin = isResp || isSuperAdmin;

    const ALL_LABELS = {
      NOUVEAU: "Nouveau",
      EN_COURS: "En cours",
      EN_RELECTURE: "En relecture",
      EN_APPROBATION: "En approbation",
      APPROUVEE: "Approuvée",
      A_CORRIGER: "À corriger",
      BLOQUE: "Bloqué",
      EN_ATTENTE: "En attente",
      
      TERMINE: "Terminé",
    };
    const make = (vals) =>
      vals.map((v) => ({ value: v, label: ALL_LABELS[v] || v }));
    const withCurrent = (vals) => {
      const targets = vals.filter((v) => v !== currentStatus);
      return make([currentStatus, ...targets]);
    };
    const lockedOnCurrent = () => make([currentStatus]);

    if (entityMode === "TACHE") {
      const isAssigned = taskObj && taskObj.assignedToId === currentUser?.id;
      const isRelecteurAssigned = taskObj && taskObj.relecteurId === currentUser?.id;
      const isMissionResp = taskObj && taskObj.mission?.assignedToId === currentUser?.id;

      const isParentLocked = 
        taskObj && (
          ["BLOQUE", "EN_ATTENTE"].includes(taskObj.mission?.status) || 
          ["BLOQUE", "EN_ATTENTE"].includes(taskObj.mission?.dossier?.status)
        );

      const isDossierResp = taskObj && (taskObj.mission?.dossier?.traitantId === currentUser?.id || taskObj.dossierTache?.traitantId === currentUser?.id);
      const canManageTaskAdmin = isSuperAdmin || isRelecteurAssigned || isMissionResp || isDossierResp;

      if (isParentLocked) return lockedOnCurrent();

      if (currentStatus === "BLOQUE") {
        if (isSuperAdmin && taskObj) {
          return withCurrent([taskObj.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "EN_ATTENTE") {
        if (canManageTaskAdmin || isAssigned) {
          return withCurrent([taskObj?.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");

      if (canManageTaskAdmin) {
        allowed.push("EN_ATTENTE");
      }

      switch (currentStatus) {
        case "NOUVEAU":
        case "A_CORRIGER":
          if (isSuperAdmin || isAssigned) allowed.push("EN_COURS");
          break;
        case "EN_COURS":
          if (isSuperAdmin || isAssigned) allowed.push("EN_RELECTURE");
          break;
        case "EN_RELECTURE":
          if (isSuperAdmin || isRelecteurAssigned) allowed.push("EN_APPROBATION", "A_CORRIGER");
          break;
        case "EN_APPROBATION":
          if (isSuperAdmin) allowed.push("APPROUVEE");
          if (isSuperAdmin || isRelecteurAssigned) allowed.push("A_CORRIGER");
          break;
        case "APPROUVEE":
          if (isSuperAdmin) allowed.push("TERMINE");
          break;
        case "TERMINE":
          // Remove EN_ATTENTE and BLOQUE if already TERMINE (usually terminal)
          return lockedOnCurrent();
      }

      if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
      return lockedOnCurrent();
    } else {
      // MISSION
      const isMissionAssigned = taskObj && taskObj.assignedToId === currentUser?.id;
      const isDossierResp = taskObj && taskObj.dossier?.traitantId === currentUser?.id;
      const canManageMission = isSuperAdmin || isMissionAssigned || isDossierResp;

      const isParentLocked = taskObj && ["BLOQUE", "EN_ATTENTE"].includes(taskObj.dossier?.status);

      if (isParentLocked) return lockedOnCurrent();

      if (currentStatus === "BLOQUE") {
        if (isSuperAdmin && taskObj) {
          return withCurrent([taskObj.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "EN_ATTENTE") {
        if (canManageMission) {
          return withCurrent([taskObj?.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");

      if (canManageMission) {
        allowed.push("EN_ATTENTE", "ANNULEE");
      }

      switch (currentStatus) {
        case "NOUVEAU":
        case "EN_COURS":
          break;
        case "TERMINE":
        case "ANNULEE":
          break;
        default:
          break;
      }

      if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
      return lockedOnCurrent();
    }
  };

  /**
   * handleFeedbackSubmit
   * mode: 'admin' → status = A_AMELIORER, sends adminFeedback
   * mode: 'manager' → status = EN_REVISION, sends managerFeedback
   */
  const handleFeedbackSubmit = async (feedbackText, feedbackMode) => {
    if (!consultTask) return;
    setIsFeedbackSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const url =
        mode === "MISSION"
          ? getSafeApiUrl(
              `/api/crm/tasks/${encodeURIComponent(consultTask.id)}`,
            )
          : getSafeApiUrl(
              `/api/crm/taches/${encodeURIComponent(consultTask.id)}`,
            );

      const newStatus = "A_CORRIGER";
      const body =
        feedbackMode === "admin"
          ? { status: newStatus, adminFeedback: feedbackText }
          : { status: newStatus, managerFeedback: feedbackText };

      const res = await fetch(new URL(url).toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated = await res.json();
        setConsultTask((prev) => ({ ...prev, ...updated }));
        fetchData();
        setErrorMsg(
          feedbackMode === "admin"
            ? 'Instructions envoyées. Tâche marquée "À améliorer".'
            : "Corrections soumises. Tâche passée en révision.",
        );
        if (feedbackMode === "admin") setShowAdminFeedbackModal(false);
        else setShowManagerFeedbackModal(false);
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.error || "Erreur lors de la soumission.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur de connexion.");
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  const handleCreateSubTask = async () => {
    if (!newTaskMessage || !newTaskAssignedTo || !newTaskEcheance) {
      setErrorMsg(
        "Veuillez remplir le message, le destinataire et l'échéance.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");

      let attachmentName = null;
      if (selectedMissionDocs.length > 0 && consultTask.documents) {
        attachmentName = consultTask.documents
          .filter((d) => selectedMissionDocs.includes(d.id))
          .map((d) => d.url)
          .join(",");
      }
      if (selectedParentDocs.length > 0) {
        attachmentName = attachmentName
          ? `${attachmentName},${selectedParentDocs.join(",")}`
          : selectedParentDocs.join(",");
      }
      if (newTaskFile) {
        const uploadedName = await uploadFile(newTaskFile);
        if (uploadedName) {
          attachmentName = attachmentName
            ? `${attachmentName},${uploadedName}`
            : uploadedName;
        }
      }

      const res = await fetch(
        new URL(getSafeApiUrl(`/api/crm/taches`)).toString(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            missionId: consultTask.id,
            description: `Objet: ${newTaskSubject}\n\nConsignes: ${newTaskMessage}`,
            assignedToId: newTaskAssignedTo,
            relecteurId: newTaskRelecteur || null,
            echeance: newTaskEcheance,
            attachment: attachmentName,
            dossierTacheId: selectedDossierTacheId,
            authorizedDossierIds: selectedAuthorizedTacheIds,
          }),
        },
      );

      if (res.ok) {
        setErrorMsg("Tâche créée avec succès !");
        setCreateTaskModal(false);
        setNewTaskFile(null);
        setSelectedMissionDocs([]);
        setConsultTask(null);
        setNewTaskSubject("");
        setNewTaskMessage("");
        setNewTaskAssignedTo("");
        setNewTaskRelecteur("");
        setNewTaskEcheance("");
        setSelectedDossierTacheId("");
        setSelectedAuthorizedTacheIds([]);
        fetchData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.error || "Erreur lors de la création de la tâche.");
      }
    } catch (e) {
      console.error("Erreur de connexion:", e);
      setErrorMsg("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  if (createTaskModal) {
    return (
      <div className="fade-in" style={{ width: "100%", padding: "0" }}>
        <div className="" style={{ width: "100%", padding: "0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCreateTaskModal(false);
                setNewTaskFile(null);
                setSelectedParentDocs([]);
                setSelectedMissionDocs([]);
              }}
              className="btn btn-outline"
              style={{ padding: "0.5rem 1rem", color: "var(--text-main)" }}
            >
              ← Retour
            </button>
            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
              Nouvelle Tâche
            </h3>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="new-task-subject"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  
                }}
              >
                Objet de la tâche
              </label>
              <input
                id="new-task-subject"
                type="text"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="Sujet de la tâche..."
                className="input-field"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  htmlFor="new-task-assigned-to"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    
                  }}
                >
                  Assigné à
                </label>
                <select
                  id="new-task-assigned-to"
                  className="input-field"
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                  }}
                >
                  <option value="">-- Sélectionner un membre --</option>
                  {users
                    .filter(
                      (u) =>
                        u.role?.name === "Collaborateur" ||
                        u.role?.name === "Responsable opérationnel" ||
                        u.role?.name === "Super-administrateur" ||
                        u.role?.name === "Administrateur",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role?.name || "Sans rôle"})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-task-relecteur"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    
                  }}
                >
                  Relecteur (Contrôleur)
                </label>
                <select
                  id="new-task-relecteur"
                  className="input-field"
                  value={newTaskRelecteur}
                  onChange={(e) => setNewTaskRelecteur(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                  }}
                >
                  <option value="">-- Aucun relecteur --</option>
                  {users
                    .filter(
                      (u) =>
                        u.role?.name === "Relecteur" ||
                        u.role?.name === "Responsable opérationnel",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role?.name || "Sans rôle"})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  htmlFor="new-task-echeance"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    
                  }}
                >
                  Échéance
                </label>
                <input
                  id="new-task-echeance"
                  type="date"
                  max={consultTask?.echeance ? new Date(consultTask.echeance).toISOString().split("T")[0] : undefined}
                  value={newTaskEcheance}
                  onChange={(e) => setNewTaskEcheance(e.target.value)}
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="new-task-mission-associee"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    
                  }}
                >
                  Mission associée
                </label>
                <input
                  id="new-task-mission-associee"
                  type="text"
                  value={consultTask?.reference || consultTask?.id || ""}
                  readOnly
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#F8FAFC",
                    color: "var(--text-muted)",
                  }}
                />
              </div>
            </div>

            {/* Dossiers liés à la tâche (GED) */}
            {consultTask &&
              (consultTask.dossierMission || consultTask.dossier) && (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                        
                        color: "var(--primary-dark)",
                      }}
                    >
                      Dossier tâche (Opérationnel) *
                    </label>
                    <GedExplorer
                      tree={{
                        name: "Dossier de la mission",
                        id: "root",
                        subDossiers: [
                          consultTask.dossierMission || consultTask.dossier,
                        ].filter(Boolean),
                      }}
                      hideBreadcrumb={false}
                      multiSelect={false}
                      selectedId={selectedDossierTacheId}
                      onSelectId={(id) => setSelectedDossierTacheId(id)}
                    />
                  </div>

                  {/* Dossiers autorisés: exclude the mission dossier (already auto-included) */}
                  {(() => {
                    const missionDossId = (
                      consultTask.dossierMission || consultTask.dossier
                    )?.id;
                    const otherAuthorized = (
                      consultTask.authorizedDossiers || []
                    ).filter((d) => d.id !== missionDossId);
                    if (otherAuthorized.length === 0) return null;
                    return (
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: 600,
                            
                            color: "var(--primary-dark)",
                          }}
                        >
                          Dossiers autorisés{" "}
                          <span
                            style={{
                              fontWeight: 400,
                              color: "var(--text-muted)",
                              fontSize: "0.8rem",
                            }}
                          >
                            (lecture seule)
                          </span>
                        </label>
                        <GedExplorer
                          tree={{
                            name: "Dossiers autorisés de la mission",
                            id: "root",
                            subDossiers: otherAuthorized,
                          }}
                          hideBreadcrumb={false}
                          multiSelect={true}
                          selectedIds={selectedAuthorizedTacheIds}
                          disabledIds={
                            selectedDossierTacheId
                              ? [selectedDossierTacheId]
                              : []
                          }
                          onSelectId={(id) => {
                            if (selectedAuthorizedTacheIds.includes(id)) {
                              setSelectedAuthorizedTacheIds(
                                selectedAuthorizedTacheIds.filter(
                                  (x) => x !== id,
                                ),
                              );
                            } else {
                              setSelectedAuthorizedTacheIds([
                                ...selectedAuthorizedTacheIds,
                                id,
                              ]);
                            }
                          }}
                          onToggleChildren={(child) => {
                            if (selectedAuthorizedTacheIds.includes(child.id)) {
                              setSelectedAuthorizedTacheIds(
                                selectedAuthorizedTacheIds.filter(
                                  (x) => x !== child.id,
                                ),
                              );
                            } else {
                              setSelectedAuthorizedTacheIds([
                                ...selectedAuthorizedTacheIds,
                                child.id,
                              ]);
                            }
                          }}
                        />
                        {selectedAuthorizedTacheIds.length > 0 && (
                          <div
                            style={{
                              marginTop: "1rem",
                              padding: "1rem",
                              background: "#e0f2fe",
                              borderRadius: "8px",
                              border: "1px solid #bae6fd",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 0.5rem 0",
                                
                                color: "#0369a1",
                              }}
                            >
                              Panier des dossiers autorisés (
                              {selectedAuthorizedTacheIds.length})
                            </h4>
                            <ul
                              style={{
                                margin: 0,
                                paddingLeft: "1.5rem",
                                
                                color: "#0c4a6e",
                              }}
                            >
                              {selectedAuthorizedTacheIds.map((id) => {
                                const flatAuthorized = otherAuthorized.flatMap(
                                  (d) => [d, ...(d.subDossiers || [])],
                                );
                                const d = flatAuthorized.find(
                                  (x) => x.id === id,
                                );
                                return <li key={id}>{d ? d.name : id}</li>;
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            <div>
              <label
                htmlFor="new-task-message"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  
                }}
              >
                Message / Consignes
              </label>
              <textarea
                id="new-task-message"
                value={newTaskMessage}
                onChange={(e) => setNewTaskMessage(e.target.value)}
                placeholder="Détails de la tâche à effectuer..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  minHeight: "120px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              ></textarea>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCreateTaskModal(false);
                setNewTaskFile(null);
                setSelectedParentDocs([]);
                setSelectedMissionDocs([]);
              }}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleCreateSubTask}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Création..." : "Créer la tâche"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editTask) {
    return (
      <div className="fade-in" style={{ width: "100%", padding: "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setEditTask(null);
              setTaskFile(null);
            }}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
            {mode === "MISSION" ? "Modifier mission :" : "Modifier tâche :"}{" "}
            {editTask.reference || editTask.id}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <TaskField
              label={"Créé par"}
              value={editTask.createdBy?.name || "Système"}
            />
            <div>
              <label
                htmlFor="edit-task-assigned-to"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  
                }}
              >
                Assigné à
              </label>
              <select
                id="edit-task-assigned-to"
                className="input-field"
                value={editFormData.assignedToId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    assignedToId: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--primary)",
                  background: "#FFF",
                }}
              >
                <option value="">-- Sélectionner un membre --</option>
                {users
                  .filter(
                    (u) =>
                      u.role?.name === "Collaborateur" ||
                      u.role?.name === "Responsable opérationnel" ||
                      u.role?.name === "Super-administrateur" ||
                      u.role?.name === "Administrateur",
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role?.name || "Sans rôle"})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                htmlFor="edit-task-relecteur"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  
                }}
              >
                Relecteur
              </label>
              <select
                id="edit-task-relecteur"
                className="input-field"
                value={editFormData.relecteurId || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    relecteurId: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--primary)",
                  background: "#FFF",
                }}
              >
                <option value="">-- Aucun relecteur --</option>
                {users
                  .filter(
                    (u) =>
                      u.role?.name === "Relecteur" ||
                      u.role?.name === "Responsable opérationnel",
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role?.name || "Sans rôle"})
                    </option>
                  ))}
              </select>
            </div>
            <TaskField
              label="Objet"
              value={editFormData.subject}
              readOnly={false}
              onChange={(e) =>
                setEditFormData({ ...editFormData, subject: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="edit-task-echeance"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
                
              }}
            >
              Échéance
            </label>
            <input
              id="edit-task-echeance"
              type="date"
              max={mode === "TACHE" && editTask?.mission?.echeance ? new Date(editTask.mission.echeance).toISOString().split("T")[0] : undefined}
              value={editFormData.echeance}
              onChange={(e) =>
                setEditFormData({ ...editFormData, echeance: e.target.value })
              }
              className="input-field"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--primary)",
              }}
            />
          </div>

          <TaskField
            label={mode === "MISSION" ? "Dossier associé" : "Mission Liée"}
            value={
              mode === "MISSION"
                ? editTask.dossier?.reference ||
                  editTask.dossier?.name ||
                  editTask.dossierId
                : editTask.mission?.reference || editTask.missionId
            }
          />

          <TaskField
            label="Message / Consignes"
            value={editFormData.message}
            readOnly={false}
            onChange={(e) =>
              setEditFormData({ ...editFormData, message: e.target.value })
            }
            isTextarea={true}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              padding: "0.75rem 1rem",
              background: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              width: "fit-content",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  fontWeight: 500,
                  
                  color: "var(--text-main)",
                }}
              >
                {mode === "MISSION"
                  ? "Statut de la mission :"
                  : "Statut de la tâche :"}
              </span>
              {getStatusBadge(editTask.status)}
            </div>
            {/* Le statut est désormais géré via les boutons d'action du workflow */}
          </div>

          <div
            style={{
              marginTop: "1rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
            }}
          >
            {mode === "MISSION" && (
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Gérer les tâches liées
              </h4>
            )}
            {mode === "MISSION" &&
            editTask.taches &&
            editTask.taches.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {editTask.taches.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => setLocalConsultSubTask(sub)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                      width: "100%",
                      textAlign: "left",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <strong
                        className="truncate-text"
                        style={{  }}
                      >
                        {sub.reference || "Sans réf"}
                      </strong>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {getStatusBadge(sub.status)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setErrorMsg(
                            `Tâche ${sub.id} supprimée avec succès !`,
                          );
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--danger)",
                        }}
                        title="Supprimer la tâche liée"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "1rem",
                  background: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px dashed var(--border)",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  
                }}
              >
                Aucune tâche liée pour le moment.
              </div>
            )}
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <button
            type="button"
            onClick={() => {
              setEditTask(null);
              setTaskFile(null);
            }}
            className="btn btn-outline"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleUpdateMission}
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </div>
        <TaskConsultModal
          task={localConsultSubTask}
          onClose={() => setLocalConsultSubTask(null)}
        />
      </div>
    );
  }

  if (consultTask) {
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

    const canEditTask =
      (currentUser?.role === "Super-administrateur" ||
        currentUser?.role?.name === "Super-administrateur" ||
        currentUser?.role === "Responsable opérationnel" ||
        currentUser?.role?.name === "Responsable opérationnel") &&
      !(
        (consultTask?.status === "EN_FINALISATION" ||
          consultTask?.status === "EN_CONTROLE" ||
          consultTask?.status === "TERMINE") &&
        !(
          currentUser?.role === "Relecteur" ||
          currentUser?.role?.name === "Relecteur" ||
          currentUser?.role === "Responsable opérationnel" ||
          currentUser?.role?.name === "Responsable opérationnel" ||
          currentUser?.role === "Super-administrateur" ||
          currentUser?.role?.name === "Super-administrateur"
        )
      ) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.dossier?.status) &&
      !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.dossier?.status);

    const role = currentUser?.role?.name || currentUser?.role || "";
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
      <div className="fade-in" style={{ width: "100%", padding: "0" }}>
        {/* Header Card conforming to Screenshots 2 & 3 */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Left info with colored icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {mode === "MISSION" &&
              !["TERMINE", "ARCHIVE", "BLOQUE", "EN_ATTENTE"].includes(consultTask.status) &&
              !["BLOQUE", "EN_ATTENTE"].includes(consultTask.dossier?.status) &&
              (isSuperAdmin || consultTask.assignedToId === currentUser?.id) && (
                <button
                  type="button"
                  onClick={() => setCreateTaskModal(true)}
                  style={{
                    background: "#1E3A8A",
                    border: "none",
                    color: "#FFF",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  + Créer une tâche
                </button>
              )}

            {canEditTask && (
              <button
                type="button"
                onClick={() => {
                  setEditTask(consultTask);
                  setEditFormData({
                    subject: subj,
                    message: msg,
                    status: consultTask.status,
                    attachment: consultTask.attachment || "",
                    assignedToId: consultTask.assignedToId || "",
                    relecteurId: consultTask.relecteurId || "",
                    echeance: consultTask.echeance
                      ? consultTask.echeance.substring(0, 10)
                      : "",
                  });
                  setConsultTask(null);
                }}
                style={{
                  background: "#FFF",
                  border: "1px solid #F59E0B",
                  color: "#D97706",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Pencil size={15} /> Modifier
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setConsultTask(null);
                setTaskFile(null);
              }}
              style={{
                background: "#0F172A",
                border: "none",
                color: "#FFF",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Two-Column Grid Conforming to Screenshots 2 & 3 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Card 1: IDENTIFICATION */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#0F172A",
                  marginBottom: "1.25rem",
                }}
              >
                {mode === "MISSION"
                  ? "Identification de la mission"
                  : "Identification de la tâche"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* Nom */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Nom :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
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
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Objet :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", wordBreak: "break-word" }}>
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
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    {mode === "MISSION" ? "Dossier associé :" : "Mission Liée :"}
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {dossierAssociated}
                  </div>
                </div>

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
                    <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                      Dossier tâche :
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
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
                      <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                        Dossiers autorisés :
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                        {consultTask.authorizedDossiers.map((d) => d.name).join(", ")}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Card 2: Consignes / Description */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  marginBottom: "0.75rem",
                }}
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
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#0F172A",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {msg || (mode === "MISSION" ? "Aucune consigne fournie pour cette mission." : "Aucune consigne fournie pour cette tâche.")}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "0.5rem",
                  }}
                >
                  {mode === "MISSION"
                    ? "Consignes opérationnelles enregistrées pour la réalisation de cette mission."
                    : "Directives précises pour l'exécution et la clôture de cette tâche."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Card 3: GESTION */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#0F172A",
                  marginBottom: "1.25rem",
                }}
              >
                {mode === "MISSION"
                  ? "Gestion de la mission"
                  : "Gestion de la tâche"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* Créé par */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Créé par :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {createdByName}{" "}
                    <span style={{ color: "#64748B", fontWeight: 500, fontSize: "0.85rem" }}>
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
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Assigné à :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {assignedToName}{" "}
                    <span style={{ color: "#64748B", fontWeight: 500, fontSize: "0.85rem" }}>
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
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Relecteur :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
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
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Date de création :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {createdAtFormatted}
                  </div>
                </div>

                {/* Échéance */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.25rem" }}>
                    Échéance :
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
                    {echeanceFormatted}
                  </div>
                </div>

                {/* Statut avec select et bouton Enregistrer conditionnel */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500, marginBottom: "0.35rem" }}>
                    Statut :
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
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
                        color: "#0F172A",
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
                        onClick={async () => {
                          if (
                            await window.customConfirm(
                              `Vous allez enregistrer 1 modification(s) sur cette ${mode === "MISSION" ? "mission" : "tâche"}.\n\nStatut : ${pendingStatus}`,
                              "Confirmer l'enregistrement"
                            )
                          ) {
                            handleWorkflowAction(consultTask.id, pendingStatus);
                          }
                        }}
                        style={{
                          padding: "0.45rem 0.85rem",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          background: "#1E3A8A",
                          color: "#FFF",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        <CheckSquare size={14} /> Enregistrer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner conforming to Screenshots 2 & 3 */}
            {mode === "TACHE" &&
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
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
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
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
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
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#0F172A",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Paperclip size={15} /> Documents attachés ({consultTask.documents.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {consultTask.documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setPreviewFile(doc.url)}
                      style={{
                        padding: "0.6rem 0.85rem",
                        background: "#F8FAFC",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        fontSize: "0.85rem",
                        color: "var(--primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FileText size={16} />
                      <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
        <div style={{ marginTop: "1.5rem" }}>
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
  }

  return (
    <div>
      <div
        className="flex justify-between items-center mb-6"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--text-main)",
            }}
          >
            {mode === "MISSION" ? t("workspace.tabs.missions") : t("workspace.tabs.taches")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {t("task.subtitle")}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          background: "#F8FAFC",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder={t("task.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          />
        </div>
        <select
          className="input-field"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "#FFF",
            minWidth: "200px",
          }}
        >
          <option value="all">{t("task.allStatuses")}</option>
          {mode === "TACHE" ? (
            <>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="EN_RELECTURE">En relecture</option>
              <option value="EN_APPROBATION">En approbation</option>
              <option value="APPROUVEE">Approuvée</option>
              <option value="A_CORRIGER">À corriger</option>
              <option value="BLOQUE">Bloqué</option>
              <option value="EN_ATTENTE">En attente</option>
            </>
          ) : (
            <>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              
              <option value="TERMINE">Terminé</option>
              <option value="BLOQUE">Bloqué</option>
              <option value="EN_ATTENTE">En attente</option>
            </>
          )}
        </select>
      </div>
      <div className="table-wrapper">
        <table style={{ tableLayout: "fixed", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "85px", textAlign: "left" }}>{t("task.columns.id")}</th>
              <th style={{ textAlign: "left" }}>
                {mode === "MISSION" ? t("task.columns.missionFolder") : t("task.columns.missionId")}
              </th>
              <th style={{ width: "170px", textAlign: "left" }}>{t("task.columns.assignedTo")}</th>
              <th
                className="table-date-cell"
                style={{
                  width: "125px",
                  textAlign: "right",
                  paddingRight: "0.5rem",
                }}
              >
                {t("task.columns.dueDate")}
              </th>
              <th style={{ width: "115px", textAlign: "center" }}>{t("task.columns.status")}</th>
              <th className="table-date-cell" style={{ width: "155px", textAlign: "left" }}>{t("task.columns.date")}</th>
              <th style={{ width: "70px", textAlign: "center" }}>{t("task.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const isExpired = (task) => {
                const d = task.echeance;
                if (!d) return false;
                if (
                  ["TERMINE", "TERMINE", "ARCHIVE", "ANNULEE"].includes(
                    task.status,
                  )
                )
                  return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const date = new Date(d);
                date.setHours(0, 0, 0, 0);
                return date <= today;
              };
              return (
                <tr key={t.id} className={isExpired(t) ? "row-expired" : ""}>
                  <td style={{ textAlign: "left" }}>
                    <div
                      className="truncate-name"
                      style={{
                        color: "var(--text-main)",
                        margin: 0,
                        fontWeight: 400,
                        maxWidth: "100%",
                      }}
                      title={t.reference || t.id}
                    >
                      {t.reference || t.id.slice(0, 8)}
                    </div>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <div
                      className="truncate-name"
                      style={{
                        color: "var(--primary)",
                        fontWeight: 400,
                        margin: 0,
                        maxWidth: "100%",
                      }}
                      title={
                        mode === "MISSION"
                          ? t.dossier?.name || t.dossierId
                          : t.mission?.reference || t.missionId
                      }
                    >
                      {mode === "MISSION"
                        ? t.dossier?.name || t.dossierId
                        : t.mission?.reference || t.missionId}
                    </div>
                  </td>

                  <td style={{ textAlign: "left" }}>
                    <div
                      className="truncate-name"
                      style={{ margin: 0, maxWidth: "100%" }}
                      title={t.assignedTo?.name || "Non assigné"}
                    >
                      {t.assignedTo?.name || "Non assigné"}
                    </div>
                  </td>
                  <td className="table-date-cell" style={{ textAlign: "right", paddingRight: "0.5rem", width: "125px" }}>
                    <span
                      style={{
                        color: t.echeance
                          ? "var(--text-main)"
                          : "var(--danger)",
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      {t.echeance
                        ? new Date(t.echeance).toLocaleDateString()
                        : "Aucune"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "1rem" }}>
                    {getStatusBadge(t.status)}
                  </td>
                  <td
                    className="table-date-cell"
                    style={{
                      textAlign: "left",
                      color: "var(--text-muted)",
                      width: "155px",
                    }}
                  >
                    {formatDate(t.createdAt)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setConsultTask(t)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--primary)",
                          padding: "4px",
                        }}
                        title="Consulter la mission"
                      >
                        <Eye size={18} />
                      </button>
                      {(currentUser?.role === "Super-administrateur" ||
                        currentUser?.role?.name === "Super-administrateur" ||
                        currentUser?.role === "Responsable opérationnel" ||
                        currentUser?.role?.name ===
                          "Responsable opérationnel") && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              await window.customConfirm(
                                mode === "MISSION" 
                                  ? "Êtes-vous sûr de vouloir supprimer cette mission ?\n\nATTENTION : Cette action supprimera également, de façon hiérarchique, toutes les tâches associées vers la corbeille."
                                  : "Êtes-vous sûr de vouloir supprimer cette tâche ?\n\nElle sera déplacée vers la corbeille.",
                                mode === "MISSION" ? "Avertissement de suppression de la mission" : "Supprimer la tâche"
                              )
                            ) {
                              try {
                                const token =
                                  sessionStorage.getItem("adminToken");
                                const res = await fetch(
                                  new URL(
                                    getSafeApiUrl(
                                      `/api/crm/${mode === "MISSION" ? "tasks" : "taches"}/${encodeURIComponent(t.id)}`,
                                    ),
                                  ).toString(),
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                if (res.ok) fetchData();
                              } catch (e) {
                                console.error("Erreur suppr mission:", e);
                              }
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#EF4444",
                            padding: "4px",
                          }}
                          title="Supprimer la mission"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages >= 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "#FFF",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Précédent
          </button>
          <span style={{  color: "var(--text-muted)" }}>
            Page {page} sur {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "#FFF",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Suivant
          </button>
        </div>
      )}

      {confirmingStatus && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--primary-dark)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Confirmer l'enregistrement
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Vous allez enregistrer <strong>1 modification(s)</strong> sur ce(tte) {mode === "MISSION" ? "mission" : "tâche"}.
            </p>
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
                color: "var(--text-main)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Statut</span>
              <span style={{ fontWeight: 600 }}>{TACHE_STATUS_LABELS[confirmingStatus] || confirmingStatus}</span>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConfirmingStatus("")}
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleWorkflowAction(consultTask.id, confirmingStatus);
                  setConfirmingStatus("");
                }}
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default GenericTaskPage;
