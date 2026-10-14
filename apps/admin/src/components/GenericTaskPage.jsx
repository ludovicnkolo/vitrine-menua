import {
  getSafeApiUrl,
  uploadFile,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  getDeadlineEvaluation,
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
  X,
  AlertTriangle,
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
        className="block mb-2 font-medium"
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
    role === "Super-administrateur" || role === "Administrateur" || currentUser?.id === "MASTER-ADMIN";
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("adminUser") || localStorage.getItem("adminUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const menuRef = useRef(null);

  const role = currentUser?.role?.name || currentUser?.role || "";
  const isSuperAdmin =
    role === "Super-administrateur" || role === "Administrateur" || currentUser?.id === "MASTER-ADMIN";
  const isResp = role === "Responsable opérationnel" || isSuperAdmin;
  const isController = role === "Relecteur" || isResp;

  // Règle d'édition :
  // Super-admin / Responsable opérationnel / Assigné / Responsable parent, et aucun élément parent bloqué ou en attente.
  const canEditTaskRow = (task) => {
    if (!task) return false;
    if (role === "Administrateur technique") return false;
    const isAssigned =
      task.assignedToId === currentUser?.id ||
      task.assignedTo?.id === currentUser?.id;
    const isParentOwner =
      task.mission?.assignedToId === currentUser?.id ||
      task.dossier?.traitantId === currentUser?.id ||
      task.mission?.dossier?.traitantId === currentUser?.id;
    const canEdit = isSuperAdmin || isResp || isAssigned || isParentOwner;
    const locked = ["BLOQUE", "EN_ATTENTE"];
    return (
      canEdit &&
      !locked.includes(task.status) &&
      !locked.includes(task.mission?.status) &&
      !locked.includes(task.dossier?.status) &&
      !locked.includes(task.mission?.dossier?.status)
    );
  };

  const openEditTask = (task) => {
    setEditTask(task);
    setEditFormData({
      subject: getSubjectFromTask(task.description),
      message: getMessageFromTask(task.description),
      status: task.status,
      attachment: task.attachment || "",
      assignedToId: task.assignedToId || "",
      relecteurId: task.relecteurId || "",
      echeance: task.echeance ? task.echeance.substring(0, 10) : "",
    });
    setConsultTask(null);
  };

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
    if (consultTask && tasks.length > 0) {
      const updated = tasks.find(i => i.id === consultTask.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(consultTask)) {
        setConsultTask({ ...updated, _editing: consultTask._editing });
      }
    }
  }, [tasks]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, filterStatus]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchData();
    };
    import("../utils/socket").then(({ socket }) => {
      socket.on("entity_updated_global", handleUpdate);
    });
    return () => {
      import("../utils/socket").then(({ socket }) => {
        socket.off("entity_updated_global", handleUpdate);
      });
    };
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
    const isSuperAdmin =
      role === "Super-administrateur" || role === "Administrateur" || currentUser?.id === "MASTER-ADMIN";
    const isResp = role === "Responsable opérationnel" || isSuperAdmin;
    const isRelecteur = role === "Relecteur";
    const isCollab = role === "Collaborateur";
    const isRespOrAdmin = isResp || isSuperAdmin;

    const ALL_LABELS_TACHE = {
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
    const ALL_LABELS_MISSION = {
      NOUVEAU: "Nouveau",
      EN_COURS: "En cours",
      EN_ATTENTE: "En attente",
      BLOQUE: "Bloqué",
      TERMINE: "Terminé",
      ANNULEE: "Annulée",
    };
    const ALL_LABELS = entityMode === "TACHE" ? ALL_LABELS_TACHE : ALL_LABELS_MISSION;
    const make = (vals) =>
      vals.map((v) => ({ value: v, label: ALL_LABELS[v] || v }));
    const withCurrent = (vals) => {
      const targets = vals.filter((v) => v !== currentStatus);
      return make([currentStatus, ...targets]);
    };
    const lockedOnCurrent = () => make([currentStatus]);

    if (role === "Administrateur technique") {
      return lockedOnCurrent();
    }

    if (entityMode === "TACHE") {
      const isAssigned = taskObj && (
        taskObj.assignedToId === currentUser?.id ||
        taskObj.assignedTo?.id === currentUser?.id
      );
      const isRelecteurAssigned = taskObj && (
        taskObj.relecteurId === currentUser?.id ||
        taskObj.relecteur?.id === currentUser?.id
      );
      const isMissionResp = taskObj && (
        taskObj.mission?.assignedToId === currentUser?.id ||
        taskObj.mission?.assignedTo?.id === currentUser?.id ||
        taskObj.dossierTache?.traitantId === currentUser?.id ||
        taskObj.dossierTache?.traitant?.id === currentUser?.id ||
        taskObj.mission?.dossier?.traitantId === currentUser?.id ||
        taskObj.mission?.dossier?.traitant?.id === currentUser?.id
      );
      const isMissionManager = isSuperAdmin || isResp || isMissionResp;

      // Miroir exact de TACHE_TRANSITIONS.EN_ATTENTE.RESUME / BLOQUE.RESUME
      const canPutOrResumeAttente = isSuperAdmin || isMissionManager;

      const isParentLocked = 
        taskObj && (
          ["BLOQUE", "EN_ATTENTE"].includes(taskObj.mission?.status) || 
          ["BLOQUE", "EN_ATTENTE"].includes(taskObj.mission?.dossier?.status) ||
          ["BLOQUE", "EN_ATTENTE"].includes(taskObj.dossierTache?.status)
        );

      if (isParentLocked) return lockedOnCurrent();

      if (currentStatus === "BLOQUE") {
        if (isSuperAdmin && taskObj) {
          return withCurrent([taskObj.previousStatus || "NOUVEAU"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "EN_ATTENTE") {
        if (canPutOrResumeAttente) {
          const targets = [];
          if (isSuperAdmin) targets.push("BLOQUE");
          targets.push(taskObj?.previousStatus || "NOUVEAU");
          return withCurrent(targets);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "TERMINE") {
        if (isSuperAdmin) {
          return withCurrent(["EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");
      if (canPutOrResumeAttente) allowed.push("EN_ATTENTE");

      // Miroir exact de TACHE_TRANSITIONS (statusRules.js)
      switch (currentStatus) {
        case "NOUVEAU":
        case "A_CORRIGER":
          // Seul l'assigné à la tâche et le Super-administrateur
          if (isSuperAdmin || isAssigned) allowed.push("EN_COURS");
          break;
        case "EN_COURS":
          // Seul l'assigné à la tâche et le Super-administrateur
          if (isSuperAdmin || isAssigned) allowed.push("EN_RELECTURE");
          break;
        case "EN_RELECTURE":
          // Seul le relecteur de la tâche et le Super-administrateur
          if (isSuperAdmin || isRelecteurAssigned) allowed.push("EN_APPROBATION", "A_CORRIGER");
          break;
        case "EN_APPROBATION":
          // Validation finale par Super-administrateur ou Mission Manager
          if (isSuperAdmin || isMissionManager) allowed.push("APPROUVEE");
          // Rattrapage d'erreur avant validation : Seul le relecteur et le Super-administrateur
          if (isSuperAdmin || isRelecteurAssigned) allowed.push("A_CORRIGER");
          break;
        case "APPROUVEE":
          if (isSuperAdmin || isMissionManager) allowed.push("TERMINE");
          break;
      }

      if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
      return lockedOnCurrent();
    } else {
      // MISSION
      const isMissionAssigned = taskObj && (
        taskObj.assignedToId === currentUser?.id ||
        taskObj.assignedTo?.id === currentUser?.id
      );
      const isDossierResp = taskObj && (
        taskObj.dossier?.traitantId === currentUser?.id ||
        taskObj.dossier?.traitant?.id === currentUser?.id
      );
      const canManageMission = isSuperAdmin || isResp || isMissionAssigned || isDossierResp;

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
          const targets = [taskObj?.previousStatus || "EN_COURS", "ANNULEE"];
          if (isSuperAdmin) targets.push("BLOQUE");
          return withCurrent(targets);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "TERMINE") {
        if (isSuperAdmin) {
          return withCurrent(["EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "ANNULEE") {
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");

      if (canManageMission) {
        allowed.push("EN_ATTENTE", "ANNULEE");
      }

      switch (currentStatus) {
        case "NOUVEAU":
          if (canManageMission) allowed.push("EN_COURS");
          break;
        case "EN_COURS":
          if (canManageMission) allowed.push("TERMINE");
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
            dossierTacheId:
              selectedDossierTacheId ||
              (consultTask?.dossierMission || consultTask?.dossier)?.id ||
              consultTask?.dossierId ||
              null,
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

  const renderCreateTaskModal = () => {
    if (!createTaskModal) return null;
    return (
      <div
        className="fade-in fixed inset-0 flex items-center justify-center p-4" style={{backgroundColor:"rgba(15, 23, 42, 0.6)",backdropFilter:"blur(4px)",zIndex:9999}}
      >
        <div
          className="p-8 w-full" style={{background:"#FFF",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",maxWidth:"750px",maxHeight:"90vh",overflowY:"auto"}}
        >
          <div
            className="flex justify-between items-center mb-6"
          >
            <h3 className="font-semibold" style={{fontSize:"1.25rem"}}>
              Créer une tâche
            </h3>
            <button
              type="button"
              onClick={() => {
                setCreateTaskModal(false);
                setNewTaskFile(null);
                setSelectedParentDocs([]);
                setSelectedMissionDocs([]);
              }}
              className="cursor-pointer flex flex-col items-center" style={{background:"none",border:"none",color:"var(--text-muted)",fontSize:"0.75rem",gap:"2px"}}
            >
              <X size={20} />
              <span>Fermer</span>
            </button>
          </div>

          <div
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="new-task-subject"
                className="block mb-2 font-medium"
              >
                Objet de la tâche *
              </label>
              <input
                id="new-task-subject"
                type="text"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="Sujet de la tâche..."
                className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
              />
            </div>

            <div
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <div>
                <label
                  htmlFor="new-task-assigned-to"
                  className="block mb-2 font-medium"
                >
                  Assigné à *
                </label>
                <select
                  id="new-task-assigned-to"
                  className="input-field w-full"
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
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
                  className="block mb-2 font-medium"
                >
                  Relecteur (Contrôleur)
                </label>
                <select
                  id="new-task-relecteur"
                  className="input-field w-full"
                  value={newTaskRelecteur}
                  onChange={(e) => setNewTaskRelecteur(e.target.value)}
                  style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
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
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <div>
                <label
                  htmlFor="new-task-echeance"
                  className="block mb-2 font-medium"
                >
                  Échéance *
                </label>
                <input
                  id="new-task-echeance"
                  type="date"
                  max={
                    consultTask?.echeance
                      ? new Date(consultTask.echeance)
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                  value={newTaskEcheance}
                  onChange={(e) => setNewTaskEcheance(e.target.value)}
                  className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                />
              </div>

              <div>
                <label
                  htmlFor="new-task-mission-associee"
                  className="block mb-2 font-medium"
                >
                  Mission associée
                </label>
                <input
                  id="new-task-mission-associee"
                  type="text"
                  value={
                    consultTask?.reference
                      ? `🔒 ${consultTask.reference}`
                      : consultTask?.id
                        ? `🔒 ${consultTask.id}`
                        : ""
                  }
                  readOnly
                  className="input-field w-full font-semibold" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC",color:"var(--text-muted)"}}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-task-message"
                className="block mb-2 font-medium"
              >
                Message / Consignes *
              </label>
              <textarea
                id="new-task-message"
                value={newTaskMessage}
                onChange={(e) => setNewTaskMessage(e.target.value)}
                placeholder="Détails de la tâche à effectuer..."
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"120px",resize:"vertical",fontFamily:"inherit"}}
              ></textarea>
            </div>
          </div>

          <div
            className="flex justify-end gap-4 mt-8"
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
              disabled={isSubmitting}
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
  };

  if (editTask) {
    return (
      <div className="fade-in w-full" style={{padding:"0"}}>
        <div
          className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
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
          <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
            {mode === "MISSION" ? "Modifier mission :" : "Modifier tâche :"}{" "}
            {editTask.reference || editTask.id}
          </h2>
        </div>

        <div
          className="flex flex-col gap-4 mb-6"
        >
          <div
            className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
          >
            <TaskField
              label={"Créé par"}
              value={editTask.createdBy?.name || "Système"}
            />
            <div>
              <label
                htmlFor="edit-task-assigned-to"
                className="block mb-2 font-medium"
              >
                Assigné à
              </label>
              <select
                id="edit-task-assigned-to"
                className="input-field w-full"
                value={editFormData.assignedToId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    assignedToId: e.target.value,
                  })
                }
                style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)",background:"#FFF"}}
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
            className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
          >
            <div>
              <label
                htmlFor="edit-task-relecteur"
                className="block mb-2 font-medium"
              >
                Relecteur
              </label>
              <select
                id="edit-task-relecteur"
                className="input-field w-full"
                value={editFormData.relecteurId || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    relecteurId: e.target.value,
                  })
                }
                style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)",background:"#FFF"}}
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
              className="block mb-2 font-medium"
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
              className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)"}}
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
            className="flex items-center w-fit" style={{gap:"2rem",padding:"0.75rem 1rem",background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
          >
            <div className="flex items-center gap-4">
              <span
                className="font-medium text-[var(--text-main)]"
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
            className="mt-4" style={{borderTop:"1px solid var(--border)",paddingTop:"1.5rem"}}
          >
            {mode === "MISSION" && (
              <h4
                className="font-semibold" style={{margin:"0 0 1rem 0",fontSize:"1rem"}}
              >
                Gérer les tâches liées
              </h4>
            )}
            {mode === "MISSION" &&
            editTask.taches &&
            editTask.taches.length > 0 ? (
              <div
                className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))"}}
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
                    className="flex justify-between items-center p-4 cursor-pointer w-full text-left" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)",transition:"border-color 0.2s",fontFamily:"inherit",fontSize:"inherit"}}
                  >
                    <div
                      className="flex flex-col" style={{gap:"0.25rem"}}
                    >
                      <strong
                        className="truncate-text"
                        style={{  }}
                      >
                        {sub.reference || "Sans réf"}
                      </strong>
                      <span className="flex items-center">
                        {getStatusBadge(sub.status)}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setErrorMsg(
                            `Tâche ${sub.id} supprimée avec succès !`,
                          );
                        }}
                        className="cursor-pointer" style={{background:"none",border:"none",color:"var(--danger)"}}
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
                className="p-4 text-center" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px dashed var(--border)",color:"var(--text-muted)"}}
              >
                Aucune tâche liée pour le moment.
              </div>
            )}
          </div>
        </div>

        <div
          className="flex justify-end gap-4"
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

            {canEditTask && (
              <button
                type="button"
                onClick={() => openEditTask(consultTask)}
                className="text-white font-semibold cursor-pointer flex items-center"
                style={{
                  background: "#2563EB",
                  border: "none",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  gap: "0.4rem",
                }}
                title={mode === "MISSION" ? "Modifier la mission" : "Modifier la tâche"}
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
              className="text-white font-semibold cursor-pointer" style={{background:"var(--text-main)",border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem"}}
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
                        onClick={async () => {
                          if (pendingStatus === "A_CORRIGER") {
                            setShowManagerFeedbackModal(true);
                            return;
                          }
                          if (
                            await window.customConfirm(
                              `Vous allez enregistrer 1 modification(s) sur cette ${mode === "MISSION" ? "mission" : "tâche"}.\n\nStatut : ${TACHE_STATUS_LABELS[pendingStatus] || pendingStatus}`,
                              "Confirmer l'enregistrement"
                            )
                          ) {
                            handleWorkflowAction(consultTask.id, pendingStatus);
                          }
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

        {renderCreateTaskModal()}
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex justify-between items-center mb-6 flex justify-between mb-6"
      >
        <div>
          <h1
            className="font-semibold text-[var(--text-main)]" style={{fontSize:"1.5rem"}}
          >
            {mode === "MISSION" ? t("workspace.tabs.missions", "Missions") : t("workspace.tabs.taches", "Tâches")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {t("task.subtitle", "Suivi opérationnel et gestion des tâches")}
          </p>
        </div>
      </div>

      <div
        className="flex gap-4 mb-6 p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
      >
        <div className="relative" style={{flex:1}}>
          <Search
            size={18}
            className="absolute" style={{left:"1rem",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}}
          />
          <input
            type="text"
            placeholder={t("task.searchPlaceholder", "Rechercher par référence, responsable...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full" style={{padding:"0.75rem 1rem 0.75rem 2.5rem",borderRadius:"8px",border:"1px solid var(--border)"}}
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
          <option value="all">{t("task.allStatuses", "Tous les statuts")}</option>
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
        <table className="w-full" style={{tableLayout:"fixed"}}>
          <thead>
            <tr>
              <th className="text-left" style={{width:"110px",paddingLeft:"1.25rem"}}>{t("task.columns.id", "ID")}</th>
              <th className="text-left" style={{width:"26%"}}>
                {mode === "MISSION" ? t("task.columns.missionFolder", "Dossier / Mission") : t("task.columns.missionId", "Mission")}
              </th>
              <th className="text-left" style={{width:"22%"}}>{t("task.columns.assignedTo", "Assigné à")}</th>
              <th
                className="table-date-cell text-center" style={{width:"135px"}}
              >
                {t("task.columns.dueDate", "Échéance")}
              </th>
              <th className="text-center" style={{width:"120px"}}>{t("task.columns.status", "Statut")}</th>
              <th className="table-date-cell text-center" style={{width:"165px"}}>{t("task.columns.date", "Date de création")}</th>
              <th className="text-center" style={{width:"80px"}}>{t("task.columns.actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const deadline = getDeadlineEvaluation(t);
              const isLocked =
                ["BLOQUE", "EN_ATTENTE"].includes(t.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.mission?.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.mission?.dossier?.status) ||
                ["BLOQUE", "EN_ATTENTE"].includes(t.dossier?.status);
              return (
                <tr
                  key={t.id}
                  style={
                    t.status === "EN_ATTENTE"
                      ? { backgroundColor: "#FFFDF0", opacity: 0.88 }
                      : isLocked
                      ? { backgroundColor: "#F8FAFC", opacity: 0.75 }
                      : {}
                  }
                >
                  <td className="text-left" style={{paddingLeft:"1.25rem"}}>
                    <div
                      className="truncate-name text-[var(--text-main)] font-normal" style={{maxWidth:"100%"}}
                      title={t.reference || t.id}
                    >
                      {t.reference || t.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="text-left">
                    <div
                      className="truncate-name font-normal" style={{color:"var(--primary)",maxWidth:"100%"}}
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

                  <td className="text-left">
                    <div
                      className="truncate-name"
                      style={{ margin: 0, maxWidth: "100%" }}
                      title={t.assignedTo?.name || "Non assigné"}
                    >
                      {t.assignedTo?.name || "Non assigné"}
                    </div>
                  </td>
                  <td className="table-date-cell text-center">
                    {(() => {
                      if (deadline.status === "NONE") {
                        return (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                            Aucune
                          </span>
                        );
                      }
                      if (deadline.status === "DONE") {
                        return (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            {deadline.label}
                          </span>
                        );
                      }
                      if (deadline.isCritical) {
                        return (
                          <span
                            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded"
                            style={{
                              backgroundColor: "#FEE2E2",
                              border: "1px solid #FECACA",
                              color: "#991B1B",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              lineHeight: 1.2,
                            }}
                            title={
                              deadline.isOverdue
                                ? "Échéance dépassée (en retard)"
                                : "Échéance critique : arrive à terme sous 24h ou moins"
                            }
                          >
                            <AlertTriangle
                              size={13}
                              style={{ color: "#DC2626", strokeWidth: 2.5, flexShrink: 0 }}
                              aria-hidden="true"
                            />
                            <span>{deadline.label}</span>
                          </span>
                        );
                      }
                      return (
                        <span
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded"
                          style={{
                            backgroundColor: "#F0FDF4",
                            border: "1px solid #DCFCE7",
                            color: "#166534",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            lineHeight: 1.2,
                          }}
                          title="Échéance dans les délais (> 24h)"
                        >
                          <span>{deadline.label}</span>
                        </span>
                      );
                    })()}
                  </td>
                  <td className="text-center">
                    {getStatusBadge(t.status)}
                  </td>
                  <td
                    className="table-date-cell text-center" style={{color:"var(--text-muted)"}}
                  >
                    {formatDate(t.createdAt)}
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                    <div className="flex flex-col items-center" style={{ gap: "3px" }}>
                      {/* Sommet de la pyramide : Modifier */}
                      {canEditTaskRow(t) && (
                        <button
                          type="button"
                          onClick={() => openEditTask(t)}
                          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                          title={mode === "MISSION" ? "Modifier la mission" : "Modifier la tâche"}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {/* Base de la pyramide : Consulter + Supprimer */}
                      <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => setConsultTask(t)}
                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                        title={mode === "MISSION" ? "Consulter la mission" : "Consulter la tâche"}
                      >
                        <Eye size={14} />
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
                          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                          title={mode === "MISSION" ? "Supprimer la mission" : "Supprimer la tâche"}
                        >
                          <Trash size={14} />
                        </button>
                      )}
                      </div>
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
          className="flex justify-center mt-6 gap-4 items-center"
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
          className="fixed inset-0 w-full h-full flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.5)",zIndex:9999}}
        >
          <div
            className="p-8 w-full text-center" style={{background:"#FFF",borderRadius:"12px",boxShadow:"0 10px 25px rgba(0,0,0,0.2)",maxWidth:"400px"}}
          >
            <h3 className="mb-2" style={{color:"var(--primary-dark)",fontSize:"1.2rem"}}>
              Confirmer l'enregistrement
            </h3>
            <p className="mb-6" style={{color:"var(--text-muted)",fontSize:"0.9rem"}}>
              Vous allez enregistrer <strong>1 modification(s)</strong> sur ce(tte) {mode === "MISSION" ? "mission" : "tâche"}.
            </p>
            <div
              className="mb-6 text-[var(--text-main)] flex justify-between items-center" style={{background:"#F8FAFC",borderRadius:"8px",padding:"0.75rem 1rem",fontSize:"0.9rem"}}
            >
              <span className="font-medium" style={{color:"var(--text-muted)"}}>Statut</span>
              <span className="font-semibold">{TACHE_STATUS_LABELS[confirmingStatus] || confirmingStatus}</span>
            </div>
            <div className="flex gap-4 justify-center">
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

      {renderCreateTaskModal()}

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default GenericTaskPage;
