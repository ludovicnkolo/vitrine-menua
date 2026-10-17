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
import FilePreviewModal from "../components/FilePreviewModal";
import SmsModal from "../components/SmsModal";
import FeedbackModal from "../components/FeedbackModal";
import GedExplorer from "../components/GedExplorer";
import CreateTaskModal from "./tasks/CreateTaskModal";
import EditTaskView from "./tasks/EditTaskView";
import ConsultTaskView from "./tasks/ConsultTaskView";
import TaskTableView from "./tasks/TaskTableView";
import TaskHeaderToolbar from "./tasks/TaskHeaderToolbar";
import CancelMissionConfirmModal from "./tasks/CancelMissionConfirmModal";


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
      const payload = {};

      const origSubject = getSubjectFromTask(editTask.description);
      const origMessage = getMessageFromTask(editTask.description);
      if (
        (editFormData.subject || "").trim() !== (origSubject || "").trim() ||
        (editFormData.message || "").trim() !== (origMessage || "").trim()
      ) {
        payload.description = description;
      }

      if ((editFormData.assignedToId || null) !== (editTask.assignedToId || null)) {
        payload.assignedToId = editFormData.assignedToId || null;
      }

      if ((editFormData.relecteurId || null) !== (editTask.relecteurId || null)) {
        payload.relecteurId = editFormData.relecteurId || null;
      }

      const origEcheance = editTask.echeance ? editTask.echeance.substring(0, 10) : "";
      const newEcheance = editFormData.echeance ? editFormData.echeance.substring(0, 10) : "";
      if (newEcheance !== origEcheance) {
        payload.echeance = editFormData.echeance || null;
      }

      if (Object.keys(payload).length === 0) {
        setEditTask(null);
        setErrorMsg("Aucune modification détectée.");
        return;
      }

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
          body: JSON.stringify(payload),
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
          setConsultTask((prev) => prev ? { ...prev, status: newStatus } : prev);
        }
        if (editTask && editTask.id === taskId) {
          setEditTask((prev) => prev ? { ...prev, status: newStatus } : prev);
        }
        setPendingStatus("");
        // Toast de succès
        const labelMap = {
          NOUVEAU: "Nouveau", EN_COURS: "En cours", EN_RELECTURE: "En relecture",
          EN_APPROBATION: "En approbation", APPROUVEE: "Approuvée", A_CORRIGER: "À corriger",
          TERMINE: "Terminé", ARCHIVE: "Archivé", BLOQUE: "Bloqué", EN_ATTENTE: "En attente",
          ANNULEE: "Annulée", EN_FINALISATION: "En finalisation", EN_CONTROLE: "En contrôle",
        };
        window.customAlert(
          `Statut mis à jour : ${labelMap[newStatus] || newStatus}`,
          "Succès",
          "success"
        );
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
    if (!newTaskSubject || !newTaskSubject.trim()) {
      setErrorMsg("L'objet de la tâche est requis.");
      return;
    }
    if (!newTaskAssignedTo) {
      setErrorMsg("Veuillez sélectionner un responsable assigné à la tâche.");
      return;
    }
    if (!newTaskEcheance) {
      setErrorMsg("La date d'échéance de la tâche est requise.");
      return;
    }
    if (!newTaskMessage || !newTaskMessage.trim()) {
      setErrorMsg("Le message / consignes est requis.");
      return;
    }
    // Vérification date non antérieure à aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newTaskEcheance);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorMsg("La date d'échéance ne peut pas être antérieure à aujourd'hui.");
      return;
    }
    // Vérification : l'échéance de la tâche ne doit pas dépasser celle de la mission associée
    if (consultTask?.echeance) {
      const parentDate = new Date(consultTask.echeance);
      parentDate.setHours(0, 0, 0, 0);
      if (selectedDate > parentDate) {
        setErrorMsg("L'échéance de la tâche ne peut pas dépasser l'échéance de la mission parente.");
        return;
      }
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


  return (
    <div>
      {editTask ? (
        <EditTaskView
          editTask={editTask}
          setEditTask={setEditTask}
          mode={mode}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          taskFile={taskFile}
          setTaskFile={setTaskFile}
          isSubmitting={isSubmitting}
          handleEditSubmit={handleUpdateMission}
          users={users}
          setErrorMsg={setErrorMsg}
        />
      ) : consultTask ? (
        <ConsultTaskView
          consultTask={consultTask}
          setConsultTask={setConsultTask}
          mode={mode}
          currentUser={currentUser}
          isSuperAdmin={isSuperAdmin}
          isResp={isResp}
          isController={isController}
          pendingStatus={pendingStatus}
          setPendingStatus={setPendingStatus}
          handleWorkflowAction={handleWorkflowAction}
          setConfirmingStatus={setConfirmingStatus}
          setEditTask={setEditTask}
          setTaskFile={setTaskFile}
          setCreateTaskModal={setCreateTaskModal}
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
          showSmsModal={showSmsModal}
          setShowSmsModal={setShowSmsModal}
          showAdminFeedbackModal={showAdminFeedbackModal}
          setShowAdminFeedbackModal={setShowAdminFeedbackModal}
          showManagerFeedbackModal={showManagerFeedbackModal}
          setShowManagerFeedbackModal={setShowManagerFeedbackModal}
          handleFeedbackSubmit={handleFeedbackSubmit}
          isFeedbackSubmitting={isFeedbackSubmitting}
          getAllowedStatuses={getAllowedStatuses}
        />
      ) : (
        <>
          <TaskHeaderToolbar
            mode={mode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <TaskTableView
            tasks={tasks}
            mode={mode}
            getDeadlineEvaluation={getDeadlineEvaluation}
            canEditTaskRow={canEditTaskRow}
            openEditTask={openEditTask}
            setConsultTask={setConsultTask}
            currentUser={currentUser}
            fetchData={fetchData}
          />

          {totalPages >= 1 && (
            <div
              className="flex justify-center mt-6 gap-4 items-center"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="font-medium transition-colors"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: page === 1 ? "var(--text-muted)" : "var(--text-main)",
                  opacity: page === 1 ? 0.45 : 1,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                Précédent
              </button>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500 }}>
                Page {page} sur {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="font-medium transition-colors"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: page >= totalPages ? "var(--text-muted)" : "var(--text-main)",
                  opacity: page >= totalPages ? 0.45 : 1,
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}

      <CancelMissionConfirmModal
        show={confirmingStatus === "ANNULEE" && mode === "MISSION"}
        onClose={() => setConfirmingStatus("")}
        onConfirm={() => {
          if (consultTask) {
            handleWorkflowAction(consultTask.id, confirmingStatus);
          }
          setConfirmingStatus("");
        }}
      />

      <CreateTaskModal
        createTaskModal={createTaskModal}
        setCreateTaskModal={setCreateTaskModal}
        mode={mode}
        newTaskSubject={newTaskSubject}
        setNewTaskSubject={setNewTaskSubject}
        newTaskMessage={newTaskMessage}
        setNewTaskMessage={setNewTaskMessage}
        newTaskAssignedTo={newTaskAssignedTo}
        setNewTaskAssignedTo={setNewTaskAssignedTo}
        newTaskRelecteur={newTaskRelecteur}
        setNewTaskRelecteur={setNewTaskRelecteur}
        newTaskEcheance={newTaskEcheance}
        setNewTaskEcheance={setNewTaskEcheance}
        consultTask={consultTask}
        setNewTaskFile={setNewTaskFile}
        setSelectedParentDocs={setSelectedParentDocs}
        setSelectedMissionDocs={setSelectedMissionDocs}
        handleCreateSubTask={handleCreateSubTask}
        isSubmitting={isSubmitting}
        users={users}
        t={t}
      />

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default GenericTaskPage;
