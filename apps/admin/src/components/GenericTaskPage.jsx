import {
  getSafeApiUrl,
  uploadFile,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
} from "../utils/helpers";
import React, { useState, useEffect, useRef } from "react";
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
          fontSize: "0.875rem",
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
              "Voulez-vous vraiment supprimer cette mission ?",
              "Supprimer la mission",
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

      if (isParentLocked) return lockedOnCurrent();

      if (currentStatus === "BLOQUE") {
        if (isSuperAdmin && taskObj) {
          return withCurrent([taskObj.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "EN_ATTENTE") {
        if (isSuperAdmin || isRelecteurAssigned || isMissionResp || isAssigned) {
          return withCurrent([taskObj?.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");

      if (isSuperAdmin || isRelecteurAssigned || isMissionResp) {
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

      const isParentLocked = taskObj && ["BLOQUE", "EN_ATTENTE"].includes(taskObj.dossier?.status);

      if (isParentLocked) return lockedOnCurrent();

      if (currentStatus === "BLOQUE") {
        if (isSuperAdmin && taskObj) {
          return withCurrent([taskObj.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      if (currentStatus === "EN_ATTENTE") {
        if (isSuperAdmin || isMissionAssigned) {
          return withCurrent([taskObj?.previousStatus || "EN_COURS"]);
        }
        return lockedOnCurrent();
      }

      const allowed = [];
      if (isSuperAdmin) allowed.push("BLOQUE");

      if (isSuperAdmin || isMissionAssigned) {
        allowed.push("EN_ATTENTE", "ANNULEE");
      }

      switch (currentStatus) {
        case "NOUVEAU":
        case "OUVERT":
        case "EN_COURS":
        case "EN_REVUE":
        case "A_CORRIGER":
        case "TERMINE":
        case "TERMINE":
        case "ANNULEE":
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
        setErrorMsg("Erreur lors de la création de la tâche.");
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
                  fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
                  }}
                >
                  Échéance
                </label>
                <input
                  id="new-task-echeance"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
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
                    fontSize: "0.875rem",
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
                        fontSize: "0.875rem",
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
                            fontSize: "0.875rem",
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
                                fontSize: "0.875rem",
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
                                fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                fontSize: "0.875rem",
              }}
            >
              Échéance
            </label>
            <input
              id="edit-task-echeance"
              type="date"
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
                  fontSize: "0.875rem",
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
                        style={{ fontSize: "0.875rem" }}
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
                  fontSize: "0.875rem",
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
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setConsultTask(null);
              setTaskFile(null);
            }}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2
            style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, flex: 1 }}
          >
            {mode === "MISSION"
              ? "Consultation mission :"
              : "Consultation tâche :"}{" "}
            {consultTask.reference || consultTask.id}
          </h2>



          {(currentUser?.role === "Super-administrateur" ||
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
            ) && !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.status) && !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.status) && !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.dossier?.status) && !["BLOQUE", "EN_ATTENTE"].includes(consultTask?.mission?.dossier?.status) && (
              <button
                type="button"
                onClick={() => {
                  setEditTask(consultTask);
                  const subj = getSubjectFromTask(consultTask.description);
                  const msg = getMessageFromTask(consultTask.description);
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
                className="btn btn-outline"
                style={{
                  padding: "0.5rem 1rem",
                  borderColor: "#D97706",
                  color: "#D97706",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Pencil size={16} /> Modifier
              </button>
            )}
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
              marginBottom: "1.5rem",
              background: "#F8FAFC",
              padding: "1.25rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          >
            {/* Colonne 1 — Identification */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                borderRight: "1px solid var(--border)",
                paddingRight: "1rem",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--primary)",
                  marginBottom: "0.25rem",
                }}
              >
                Identification{" "}
                {mode === "MISSION" ? "de la mission" : "de la tâche"}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Nom :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {consultTask.reference || consultTask.id}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Objet :
                </strong>
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--text-main)",
                    flex: 1,
                  }}
                >
                  {getSubjectFromTask(consultTask.description)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  {mode === "MISSION" ? "Dossier associé :" : "Mission Liée :"}
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {mode === "MISSION"
                    ? consultTask.dossier?.name
                      ? `${consultTask.dossier.name} (${consultTask.dossier.reference || "DOS-" + consultTask.dossier.id})`
                      : consultTask.dossierId
                    : consultTask.mission?.reference || consultTask.missionId}
                </span>
              </div>
              {mode !== "MISSION" && consultTask.dossierTache && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      minWidth: "130px",
                    }}
                  >
                    Dossier tâche :
                  </strong>
                  <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                    {consultTask.dossierTache.name}
                  </span>
                </div>
              )}
              {mode !== "MISSION" &&
                consultTask.authorizedDossiers &&
                consultTask.authorizedDossiers.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        minWidth: "130px",
                      }}
                    >
                      Dossiers autorisés :
                    </strong>
                    <span
                      style={{ fontWeight: 500, color: "var(--text-main)" }}
                    >
                      {consultTask.authorizedDossiers
                        .map((d) => d.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
            </div>

            {/* Colonne 2 — Gestion */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                paddingLeft: "0.5rem",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--secondary-dark)",
                  marginBottom: "0.25rem",
                }}
              >
                Gestion {mode === "MISSION" ? "de la mission" : "de la tâche"}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Créé par :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {consultTask.createdBy?.name || "Système"}{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    ({consultTask.createdBy?.role?.name || "-"})
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Assigné à :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {consultTask.assignedTo?.name || "Non assigné"}{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    ({consultTask.assignedTo?.role?.name || "-"})
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Relecteur :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {consultTask.relecteur?.name || "Non assigné"}{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    ({consultTask.relecteur?.role?.name || "-"})
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Date de création :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {new Date(consultTask.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    minWidth: "130px",
                  }}
                >
                  Échéance :
                </strong>
                <span style={{ fontWeight: 500, color: "var(--text-main)" }}>
                  {consultTask.echeance
                    ? new Date(consultTask.echeance).toLocaleDateString("fr-FR")
                    : "Non définie"}
                </span>
              </div>
              {(() => {
                const role = currentUser?.role?.name || currentUser?.role || "";
                const options = getAllowedStatuses(
                  consultTask.status || "NOUVEAU",
                  role,
                  mode,
                  consultTask
                );
                const isLocked = options.length === 1;
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        minWidth: "130px",
                      }}
                    >
                      Statut :
                    </strong>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <select
                        value={pendingStatus || consultTask.status || "NOUVEAU"}
                        onChange={(e) => setPendingStatus(e.target.value)}
                        disabled={isLocked}
                        title={
                          isLocked
                            ? "Aucune transition disponible pour votre rôle"
                            : "Changer le statut"
                        }
                        style={{
                          padding: "0.4rem 0.6rem",
                          borderRadius: "4px",
                          border: "1px solid var(--border)",
                          background: isLocked ? "#F3F4F6" : "#FFF",
                          fontSize: "0.875rem",
                          outline: "none",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          minWidth: "140px",
                        }}
                      >
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      {!isLocked && pendingStatus && pendingStatus !== consultTask.status && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (await window.customConfirm(`Êtes-vous sûr de vouloir passer au statut : ${pendingStatus} ?`, "Confirmer le statut")) {
                              handleWorkflowAction(consultTask.id, pendingStatus);
                            }
                          }}
                          className="btn btn-primary"
                          style={{
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            backgroundColor: "#1D4ED8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <Check size={14} color="white" /> Enregistrer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Consignes / Description
            </h4>
            <div
              style={{
                padding: "1.5rem",
                background: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                whiteSpace: "pre-wrap",
                fontSize: "0.875rem",
                color: "var(--text-main)",
                minHeight: "120px",
              }}
            >
              {getMessageFromTask(consultTask.description) || (
                <span style={{ color: "var(--text-muted)" }}>
                  Aucune consigne fournie.
                </span>
              )}
            </div>
          </div>

          {/* Fil de corrections — visible selon le rôle et le statut */}
          <FeedbackThread
            adminFeedback={consultTask.adminFeedback}
            managerFeedback={consultTask.managerFeedback}
            currentStatus={consultTask.status}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setConsultTask(null);
                setTaskFile(null);
              }}
              className="btn btn-outline"
            >
              Retour
            </button>

            {mode === "MISSION" &&
              !["TERMINE", "ARCHIVE", "BLOQUE", "EN_ATTENTE"].includes(consultTask.status) &&
              !["BLOQUE", "EN_ATTENTE"].includes(consultTask.dossier?.status) &&
              (isSuperAdmin ||
                consultTask.assignedToId === currentUser?.id) && (
                <button
                  type="button"
                  onClick={() => setCreateTaskModal(true)}
                  className="btn btn-outline"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  Créer une tâche
                </button>
              )}
          </div>
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
            {mode === "MISSION" ? "Missions" : "Tâches"}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Attributions internes et ordres de mission
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
            placeholder="Rechercher par dossier, émetteur ou responsable..."
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
          <option value="all">Tous les statuts</option>
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
        <table>
          <thead>
            <tr>
              <th style={{ width: "10%", textAlign: "left" }}>ID</th>
              <th style={{ width: "20%", textAlign: "left" }}>
                {mode === "MISSION" ? "Nom dossier" : "ID Mission"}
              </th>
              <th style={{ width: "20%", textAlign: "left" }}>Affecté à</th>
              <th
                style={{
                  width: "10%",
                  textAlign: "right",
                  paddingRight: "0.5rem",
                }}
              >
                Échéance
              </th>
              <th style={{ width: "15%", textAlign: "center" }}>Statut</th>
              <th style={{ width: "15%", textAlign: "left" }}>Date</th>
              <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
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
                    <strong
                      className="truncate-text"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-main)",
                        margin: 0,
                      }}
                    >
                      {t.reference || t.id.slice(0, 8)}
                    </strong>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <div
                      style={{
                        color: "var(--primary)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "170px",
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
                    <span
                      className="truncate-name"
                      style={{ fontSize: "0.875rem", margin: 0 }}
                    >
                      {t.assignedTo?.name || "Non assigné"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "0.5rem" }}>
                    <span
                      style={{
                        color: t.echeance
                          ? "var(--text-main)"
                          : "var(--danger)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
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
                    style={{
                      textAlign: "left",
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                      whiteSpace: "nowrap",
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
                                "Voulez-vous vraiment supprimer cette mission ?",
                                "Supprimer la mission",
                              )
                            ) {
                              try {
                                const token =
                                  sessionStorage.getItem("adminToken");
                                const res = await fetch(
                                  new URL(
                                    getSafeApiUrl(
                                      `/api/crm/tasks/${encodeURIComponent(t.id)}`,
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
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
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
              <span style={{ fontWeight: 600 }}>{ALL_LABELS[confirmingStatus] || confirmingStatus}</span>
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
