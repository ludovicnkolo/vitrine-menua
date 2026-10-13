import {
  getSafeApiUrl,
  apiFetch,
  uploadFile,
  formatDate,
  extractFieldFromHtml,
  extractBlockFromHtml,
} from "../utils/helpers";
import { redirectToLogin } from "../services/api";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import InboxRappelModal from "../components/InboxRappelModal";
import {
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Mail,
  Pencil,
  Eye,
  Trash,
  Files,
  Paperclip,
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import TabsNavigation from "../components/TabsNavigation";
import ActionDropdown from "../components/ActionDropdown";
import PaginationControls from "../components/PaginationControls";
import FilePreviewModal from "../components/FilePreviewModal";
import AttachmentSelect from "../components/AttachmentSelect";

import InternalChatTab from "../components/InternalChatTab";

// --- Utilitaires de normalisation RBAC ---
const normalizeRole = (r) => {
  const str = typeof r === "string" ? r : r?.name || "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .trim();
};
const isSuperAdmin = (r) => normalizeRole(r).includes("super admin");
const isOperationalManager = (r) => {
  const norm = normalizeRole(r);
  return norm.includes("responsable operationnel") || norm.includes("operationnel");
};
const isAdminOrSuperAdmin = (r) => {
  const norm = normalizeRole(r);
  return norm.includes("admin");
};

const MessageDetailCard = ({ label, value, children, sublabel, inline }) => (
  <div
    style={{
      background: "#F8FAFC",
      borderRadius: "6px",
      padding: "0.55rem 0.85rem",
      border: "1px solid #F1F5F9",
      display: "flex",
      flexDirection: inline ? "row" : "column",
      alignItems: inline ? "center" : "stretch",
      justifyContent: inline ? "space-between" : "flex-start",
      gap: inline ? "1rem" : "0.2rem",
    }}
  >
    <div
      className="font-medium flex items-center justify-between" style={{fontSize:"0.75rem",color:"#64748B"}}
    >
      <span>{label} :</span>
      {sublabel && (
        <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{sublabel}</span>
      )}
    </div>
    <div
      className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.88rem",wordBreak:"break-word"}}
    >
      {children || value}
    </div>
  </div>
);

const DetailField = ({ label, value, children }) => (
  <div>
    <span
      className="block font-medium" style={{marginBottom:"0.25rem",color:"var(--text-muted)"}}
    >
      {label}
    </span>
    <div
      className="w-full p-2" style={{background:"#F8FAFC",borderRadius:"4px",border:"1px solid var(--border)",minHeight:"38px",whiteSpace:"normal",overflowWrap:"break-word",wordBreak:"break-word"}}
    >
      {children || value}
    </div>
  </div>
);

const InlineDetailField = ({ label, value, children }) => (
  <div
    className="flex items-start gap-2"
  >
    <span
      className="font-medium" style={{color:"var(--text-muted)"}}
    >
      {label} :
    </span>
    <div
      className="text-[var(--text-main)]" style={{flex:1,wordBreak:"break-word"}}
    >
      {children || value}
    </div>
  </div>
);

const getDisplayStatus = (status, t) => {
  if (!status) return t ? t("status.NOUVEAU", "Nouveau") : "Nouveau";
  const s = String(status).toUpperCase();
  if (s === "CLASSE" || s === "CLASSÉ") return t ? t("status.CLASSE", "Classé") : "Classé";
  if (s === "TRAITE" || s === "TRAITÉ") return t ? t("status.TRAITE", "Traité") : "Traité";
  if (s === "NOUVEAU") return t ? t("status.NOUVEAU", "Nouveau") : "Nouveau";
  if (s === "A_RAPPELER") return t ? t("status.A_RAPPELER", "À rappeler") : "À rappeler";
  if (s === "DISCUSSION") return t ? t("status.DISCUSSION", "Discussion") : "Discussion";
  if (s === "SANS_SUITE") return t ? t("status.SANS_SUITE", "Sans suite") : "Sans suite";
  if (s === "GAGNE") return t ? t("status.GAGNE", "Gagné") : "Gagné";
  if (s === "ENTRETIEN") return t ? t("status.ENTRETIEN", "Entretien") : "Entretien";
  if (s === "RETENU") return t ? t("status.RETENU", "Retenu") : "Retenu";
  if (s === "REFUSE") return t ? t("status.REFUSE", "Refusé") : "Refusé";
  if (s === "EN_ATTENTE") return t ? t("status.EN_ATTENTE", "En attente") : "En attente";
  return t ? t(`status.${s}`, s) : s;
};

const getStatusBadge = (status) => {
  const displayStatus = getDisplayStatus(status);
  if (displayStatus === "En attente" || displayStatus === "Nouveau")
    return { bg: "#DBEAFE", color: "#1E3A8A" }; // Blue
  if (displayStatus === "À rappeler")
    return { bg: "#FEF3C7", color: "#D97706" }; // Orange
  if (displayStatus === "Discussion" || displayStatus === "Entretien")
    return { bg: "#E0E7FF", color: "#4F46E5" }; // Indigo
  if (displayStatus === "Sans suite" || displayStatus === "Refusé")
    return { bg: "#FEE2E2", color: "#DC2626" }; // Red
  if (
    displayStatus === "Gagné" ||
    displayStatus === "Retenu" ||
    displayStatus === "Traité"
  )
    return { bg: "#DCFCE7", color: "#166534" }; // Green
  if (displayStatus === "Classé") return { bg: "#F1F5F9", color: "#475569" }; // Gray
  return { bg: "#F1F5F9", color: "#475569" };
};

const getVerifaliaBadge = (vStatus) => {
  if (!vStatus) return { text: "Non vérifié", bg: "#F1F5F9", color: "#64748B" };
  const s = String(vStatus).toUpperCase();
  if (s.includes("VALID") || s === "DELIVERABLE" || s === "COMPLETED_VALID") {
    return { text: "Valide", bg: "#DCFCE7", color: "#166534" };
  }
  if (s.includes("INVALID") || s === "UNDELIVERABLE") {
    return { text: "Invalide", bg: "#FEE2E2", color: "#991B1B" };
  }
  return { text: "À vérifier", bg: "#FEF3C7", color: "#92400E" };
};

const formatPriority = (p, t) => {
  if (!p) return t ? t("priority.NORMAL", "Normal") : "Normal";
  const s = String(p).trim().toUpperCase();
  if (s === "URGENT" || s === "URGENTE") return t ? t("priority.URGENT", "Urgent") : "Urgent";
  if (s === "PRIORITAIRE" || s === "HAUTE" || s === "ELEVE" || s === "ELEVEE") return t ? t("priority.PRIORITAIRE", "Prioritaire") : "Prioritaire";
  if (s === "FAIBLE" || s === "BASSE") return t ? t("priority.FAIBLE", "Faible") : "Faible";
  if (s === "NORMAL" || s === "NORMALE") return t ? t("priority.NORMAL", "Normal") : "Normal";
  const title = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  return t ? t(`priority.${s}`, title) : title;
};

const getPriorityBadge = (p) => {
  const norm = formatPriority(p);
  if (norm === "Urgent")
    return { bg: "#FEE2E2", color: "#DC2626" }; // Red
  if (norm === "Prioritaire")
    return { bg: "#FEF3C7", color: "#D97706" }; // Orange
  return { bg: "#DCFCE7", color: "#166534" }; // Green for Normal
};

const InboxPage = ({ userRole }) => {
  const { t } = useTranslation();
  const storageKey = `active_tab_${window.location.pathname}`;
  const [tab, setTab] = useState(() => {
    const norm = normalizeRole(userRole);
    const defaultTab =
      norm.includes("collaborateur") || norm.includes("relecteur")
        ? "interne"
        : "contact";
    const saved = sessionStorage.getItem(storageKey);
    return saved || defaultTab;
  });

  const handleTabChange = (newTab) => {
    setTab(newTab);
    sessionStorage.setItem(storageKey, newTab);
    setProcessMsg(null);
    setPendingChanges({});
    setShowSaveConfirm(false);
  };
  const [filterTraite, setFilterTraite] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskModal, setCreateTaskModal] = useState(false);

  const [newTaskFile, setNewTaskFile] = useState(null);
  const [isNewDossier, setIsNewDossier] = useState(true);
  const [dossierFile, setDossierFile] = useState(null);
  const [selectedMsgDocs, setSelectedMsgDocs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [assignMsg, setAssignMsg] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [showActionChoiceModal, setShowActionChoiceModal] = useState(false);

  // Form states
  const [taskSubject, setTaskSubject] = useState("");
  const [taskAssignedToId, setTaskAssignedToId] = useState("");
  const [taskNewDossierName, setTaskNewDossierName] = useState("");
  const [taskDossierSection, setTaskDossierSection] = useState("");
  const [taskDossierCible, setTaskDossierCible] = useState("");
  const [taskDossierId, setTaskDossierId] = useState("");

  const [showTraitePopup, setShowTraitePopup] = useState(false);
  const [lieuTraitement, setLieuTraitement] = useState("");
  const [numeroReference, setNumeroReference] = useState("");
  const [showConfirmClasse, setShowConfirmClasse] = useState(false);

  // Modale "À rappeler" / "Entretien" — saisie date + note
  const [rappelModal, setRappelModal] = useState(null);
  // Bannière d'info (lecture) pour messages déjà en rappel/entretien
  const [showRappelBanner, setShowRappelBanner] = useState(false);

  // Système de brouillon local — les modifications ne sont envoyées qu'à l'appui sur "Enregistrer"
  const [pendingChanges, setPendingChanges] = useState({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const [taskDescription, setTaskDescription] = useState("");
  const [taskEcheance, setTaskEcheance] = useState("");
  const menuRef = useRef(null);
  const isAnyModalOpen =
    processMsg || createTaskModal || showActionChoiceModal || showTraitePopup;

  const toastTimeoutRef = useRef(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // 1. Chargement ciblé des messages et utilisateurs de base
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      const headers = {};
      if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const urlMessages = new URL(getSafeApiUrl(`/api/crm/messages`));
      urlMessages.searchParams.append("type", tab);
      urlMessages.searchParams.append("page", page.toString());
      urlMessages.searchParams.append("limit", limit.toString());
      urlMessages.searchParams.append("status", filterTraite);
      urlMessages.searchParams.append("search", searchQuery);
      if (filterDate) {
        urlMessages.searchParams.append("date", filterDate);
      }

      const [resMsgs, resUsers] = await Promise.all([
        fetch(urlMessages.toString(), {
          headers,
          credentials: "include",
        }),
        users.length === 0
          ? fetch(new URL(getSafeApiUrl(`/api/crm/users`)).toString(), {
              headers,
              credentials: "include",
            })
          : Promise.resolve(null),
      ]);

      if (resMsgs.ok) {
        const result = await resMsgs.json();
        const rawMsgs = result.data || (Array.isArray(result) ? result : []);
        const sortedMsgs = [...rawMsgs].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        if (result.data) {
          setMessages(sortedMsgs);
          setTotalPages(result.totalPages || 1);
        } else {
          setMessages(sortedMsgs);
          setTotalPages(1);
        }
      } else if (resMsgs.status === 401) {
        redirectToLogin("expired");
        return;
      }

      if (resUsers && resUsers.ok) {
        const rawUsers = await resUsers.json();
        setUsers(Array.isArray(rawUsers) ? rawUsers : (rawUsers.data || rawUsers.users || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab, page, limit, filterTraite, searchQuery, filterDate, users.length]);

  // 2. Chargement différé (Lazy) des dossiers/clients uniquement à l'ouverture du modal
  const loadDossiersAndClients = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = token && token !== "null" && token !== "undefined"
        ? { Authorization: `Bearer ${token}` }
        : {};
      const [resDoss, resClients] = await Promise.all([
        fetch(getSafeApiUrl(`/api/crm/dossiers?limit=500`), { headers, credentials: "include" }),
        fetch(getSafeApiUrl(`/api/crm/clients?limit=500`), { headers, credentials: "include" }),
      ]);
      if (resDoss.ok) {
        const d = await resDoss.json();
        setDossiers(d.data || d);
      }
      if (resClients.ok) {
        const cl = await resClients.json();
        setClients(cl.data || cl);
      }
    } catch (err) {
      console.error("Erreur lazy-loading dossiers/clients :", err);
    }
  }, []);

  useEffect(() => {
    if (createTaskModal && tab !== "interne" && (dossiers.length === 0 || clients.length === 0)) {
      loadDossiersAndClients();
    }
  }, [createTaskModal, tab, dossiers.length, clients.length, loadDossiersAndClients]);

  useEffect(() => {
    setPage(1);
  }, [tab, filterTraite, filterDate, searchQuery, limit]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Chargement garanti des utilisateurs lors de la consultation d'un message
  useEffect(() => {
    if (processMsg && users.length === 0) {
      const loadUsers = async () => {
        try {
          const token = sessionStorage.getItem("adminToken");
          const headers = token && token !== "null" && token !== "undefined"
            ? { Authorization: `Bearer ${token}` }
            : {};
          const res = await fetch(getSafeApiUrl("/api/crm/users"), {
            headers,
            credentials: "include",
          });
          if (res.ok) {
            const rawUsers = await res.json();
            setUsers(Array.isArray(rawUsers) ? rawUsers : (rawUsers.data || rawUsers.users || []));
          }
        } catch (err) {
          console.error("Erreur chargement utilisateurs pour copie :", err);
        }
      };
      loadUsers();
    }
  }, [processMsg, users.length]);

  // 3. Socket isolé sans dépendance cyclique
  const fetchMessagesRef = useRef(fetchMessages);
  fetchMessagesRef.current = fetchMessages;

  useEffect(() => {
    let activeSocket = null;
    const handleUpdate = () => {
      fetchMessagesRef.current();
    };
    import("../utils/socket").then(({ socket }) => {
      activeSocket = socket;
      activeSocket.on("entity_updated_global", handleUpdate);
    });
    return () => {
      if (activeSocket) {
        activeSocket.off("entity_updated_global", handleUpdate);
      }
    };
  }, []);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("adminUser");
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch (e) {}
  }, []);

  // 4. Synchronisation de processMsg sans comparaison JSON lourde
  useEffect(() => {
    if (processMsg && messages.length > 0) {
      const updated = messages.find((m) => m.id === processMsg.id);
      if (
        updated &&
        (updated.status !== processMsg.status ||
          updated.updatedAt !== processMsg.updatedAt ||
          updated.priorite !== processMsg.priorite ||
          updated.etiquette !== processMsg.etiquette ||
          updated.assignedToId !== processMsg.assignedToId)
      ) {
        setProcessMsg((prev) => ({ ...prev, ...updated }));
      }
    }
  }, [messages, processMsg?.id, processMsg?.status, processMsg?.updatedAt, processMsg?.priorite, processMsg?.etiquette, processMsg?.assignedToId]);

  // Auto-afficher la bannière de rappel/entretien à l'ouverture d'un message
  useEffect(() => {
    if (
      processMsg &&
      (processMsg.status === "A_RAPPELER" || processMsg.status === "ENTRETIEN")
    ) {
      setShowRappelBanner(true);
    } else {
      setShowRappelBanner(false);
    }
  }, [processMsg?.id, processMsg?.status]);
  // Réinitialiser le brouillon à chaque ouverture de message
  useEffect(() => {
    setPendingChanges({});
  }, [processMsg?.id]);

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

  const handleCreateTask = async () => {
    try {
      setIsSubmitting(true);
      const token = sessionStorage.getItem("adminToken");

      let finalDossierId = null;
      if (tab !== "interne") {
        if (isNewDossier) {
          if (!taskNewDossierName.trim()) {
            showToast("Veuillez saisir le nom du nouveau dossier.", "error");
            setIsSubmitting(false);
            return;
          }
          if (!taskDossierSection || !taskDossierCible) {
            showToast(
              "Veuillez sélectionner la section et la cible pour le nouveau dossier.",
              "error",
            );
            setIsSubmitting(false);
            return;
          }

          const newDossierPayload = {
            name: taskNewDossierName,
            description: `Créé depuis la messagerie : ${processMsg.nomPrenom || "Contact"}`,
            origin: tab.toUpperCase(),
          };
          if (taskDossierSection === "client") {
            newDossierPayload.clientId = taskDossierCible || null;
          } else if (taskDossierSection === "equipe") {
            newDossierPayload.targetUserId = taskDossierCible || null;
          }

          // Upload dossier file if any
          let dossierFilename = null;
          if (dossierFile) {
            dossierFilename = await uploadFile(dossierFile, "dossiers");
          }

          const dossRes = await apiFetch(
            `/api/crm/dossiers`,
            "POST",
            newDossierPayload,
          );
          if (!dossRes.ok) {
            const errData = await dossRes.json().catch(() => ({}));
            showToast(
              `Erreur lors de la création du dossier: ${errData.error || ""}`,
              "error",
            );
            setIsSubmitting(false);
            return;
          }
          const dossData = await dossRes.json();
          finalDossierId = dossData.id;

          // Register uploaded file as Document linked to the dossier
          if (dossierFilename) {
            await apiFetch("/api/crm/documents", "POST", {
              name: dossierFile.name,
              filename: dossierFilename,
              bucket: "dossiers",
              dossierId: finalDossierId,
            });
          }

          // Link message attachment if requested
          if (selectedMsgDocs.length > 0 && processMsg?.attachment) {
            for (const att of selectedMsgDocs) {
              const parts = att.split("/");
              if (parts.length >= 2) {
                const b = parts.shift();
                const fn = parts.join("/");
                await apiFetch("/api/crm/documents", "POST", {
                  name: fn.split("/").pop() || fn,
                  filename: fn,
                  bucket: b,
                  dossierId: finalDossierId,
                });
              }
            }
          }
        } else {
          if (!taskDossierId) {
            showToast("Veuillez sélectionner un dossier existant.", "error");
            setIsSubmitting(false);
            return;
          }
          finalDossierId = taskDossierId;
        }

        // Lier le message au dossier et marquer comme traité
        const statusRes = await apiFetch(
          `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
          "PATCH",
          { dossierId: finalDossierId, status: "TRAITE" },
        );
        if (!statusRes.ok) {
          showToast(
            "Erreur lors de la mise à jour du statut du message.",
            "error",
          );
          setIsSubmitting(false);
          return;
        }
      } else {
        // Interne reply
        let attachmentsArray = [];
        if (newTaskFile) {
          const uploadedName = await uploadFile(newTaskFile);
          if (uploadedName) attachmentsArray.push(uploadedName);
        }
        const finalAttachment =
          attachmentsArray.filter(Boolean).join(",") || null;

        let replyAssignedToId = processMsg.assignedToId || null;
        if (
          currentUser &&
          processMsg.email &&
          processMsg.email !== currentUser.email
        ) {
          const senderUser = users.find((u) => u.email === processMsg.email);
          if (senderUser) {
            replyAssignedToId = senderUser.id;
          }
        }

        const replyRes = await apiFetch(`/api/crm/messages/interne`, "POST", {
          subType: `Réponse à ${processMsg.nomPrenom}`,
          objet: processMsg.sourceRef
            ? `Message concernant ${processMsg.sourceRef}`
            : processMsg.objet || "Réponse",
          bodyText: taskDescription,
          attachment: finalAttachment,
          dossierId: processMsg.dossierId || null,
          missionId: processMsg.missionId || null,
          tacheId: processMsg.tacheId || null,
          assignedToId: replyAssignedToId,
        });

        if (!replyRes.ok) {
          const errData = await replyRes.json().catch(() => null);
          showToast(
            `Erreur lors de l'envoi de la réponse: ${errData?.error || "Erreur serveur"}`,
            "error",
          );
          setIsSubmitting(false);
          return;
        }

        // Mark the original message as TRAITE
        const statusRes = await apiFetch(
          `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
          "PATCH",
          { status: "TRAITE" },
        );
        if (!statusRes.ok) {
          showToast(
            "Erreur lors de la mise à jour du statut du message.",
            "error",
          );
          setIsSubmitting(false);
          return;
        }
      }

      fetchMessages();
      showToast(
        tab === "interne"
          ? "Réponse envoyée avec succès !"
          : "Dossier créé et message traité avec succès !",
        "success",
      );

      if (tab !== "interne") {
        setCreateTaskModal(false);
        setProcessMsg(null);
      }

      setTaskNewDossierName("");
      setTaskDossierSection("");
      setTaskDossierCible("");
      setNewTaskFile(null);
      setDossierFile(null);
      setSelectedMsgDocs([]);
      setTaskSubject("");
      setTaskDescription("");
      setTaskEcheance("");
    } catch (error) {
      console.error(error);
      showToast(
        `Erreur inattendue: ${error.message || "Une erreur est survenue."}`,
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedAssignee) {
      window.customAlert("Veuillez sélectionner un collaborateur.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(
        getSafeApiUrl(`/api/crm/messages/${assignMsg.id}/assign`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ assignedToId: selectedAssignee }),
        },
      );
      if (res.ok) {
        showToast("Message assigné avec succès");
        setAssignMsg(null);
        setSelectedAssignee("");
        fetchMessages();
      } else {
        window.customAlert("Erreur lors de l'assignation");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsProcessed = async () => {
    if (!processMsg) return;
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        { status: "TRAITE" },
      );
      if (res.ok) {
        showToast("Message marqué comme traité !", "success");
        setProcessMsg(null);
        fetchMessages();
      } else {
        showToast("Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    }
  };

  const handleUpdateStatus = async (statusToSet) => {
    if (!processMsg) return;
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        { status: statusToSet },
      );
      if (res.ok) {
        showToast(`Message marqué comme ${statusToSet} !`, "success");
        setProcessMsg(null);
        setShowActionChoiceModal(false);
        fetchMessages();
      } else {
        showToast("Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    }
  };

  const handleTraiteSubmit = async () => {
    if (!lieuTraitement || !numeroReference.trim()) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        {
          status: "TRAITE",
          lieuTraitement,
          numeroReference: numeroReference.trim(),
        },
      );
      if (res.ok) {
        showToast(
          "Message marqué comme TRAITÉ et lié avec succès !",
          "success",
        );
        setProcessMsg(null);
        setShowTraitePopup(false);
        setLieuTraitement("");
        setNumeroReference("");
        fetchMessages();
      } else {
        const errorData = await res.json().catch(() => null);
        showToast(
          errorData?.error || "Erreur lors de la mise à jour.",
          "error",
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncEmails = async () => {
    try {
      setIsSyncing(true);
      const res = await apiFetch(`/api/crm/messages/sync-imap`, "POST");

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      if (data.success) {
        showToast(
          data.addedCount > 0
            ? `${data.addedCount} nouveaux emails récupérés !`
            : "Aucun nouvel email à récupérer.",
          "success",
        );
        fetchMessages();
      } else {
        throw new Error(data.error || "Erreur de synchronisation");
      }
    } catch (err) {
      console.error(err);
      showToast("Impossible de synchroniser avec le serveur IMAP.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Buffere une modification sans l'envoyer au serveur
  const setPendingChange = (field, value) => {
    setPendingChanges((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "etiquette") {
        // Lorsqu'on change d'étiquette, on change de pipeline (catégorie)
        // Les statuts d'un pipeline ne sont pas forcément compatibles avec l'autre.
        // On réinitialise à NOUVEAU pour forcer un statut valide.
        next.status = "NOUVEAU";
      }
      return next;
    });
  };

  // Envoie toutes les modifications en attente directement
  const handleSaveAll = async () => {
    if (!processMsg) return;
    if (!hasPendingChanges) {
      showToast("Aucune modification à enregistrer.", "info");
      return;
    }
    setIsSaving(true);
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        pendingChanges,
      );
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("[handleSaveAll] Erreur serveur:", res.status, errBody);
        throw new Error(errBody.error || "Erreur de mise à jour");
      }
      showToast("Modifications enregistrées avec succès.", "success");
      const updated = { ...processMsg, ...pendingChanges };
      setProcessMsg(updated);
      setMessages((prev) => prev.map((m) => (m.id === processMsg.id ? updated : m)));
      setPendingChanges({});
      setShowSaveConfirm(false);
      fetchMessages();
    } catch (err) {
      console.error("[handleSaveAll] Exception:", err);
      showToast(err.message || "Impossible de sauvegarder les modifications.", "error");
    } finally {
      setIsSaving(false);
      setShowSaveConfirm(false);
    }
  };

  const handleUpdateProperty = async (property, value) => {
    // Conservé pour la compatibilité interne (actions directes hors formulaire)
    if (!processMsg) return;
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        { [property]: value },
      );
      if (!res.ok) throw new Error("Erreur de mise à jour");
      showToast(`Mis à jour.`, "success");
      setProcessMsg({ ...processMsg, [property]: value });
      setMessages(
        messages.map((m) =>
          m.id === processMsg.id ? { ...m, [property]: value } : m,
        ),
      );
    } catch (err) {
      console.error(err);
      showToast("Impossible de mettre à jour le message.", "error");
    }
  };

  const handleUpdateMultiple = async (fields) => {
    // Sécurité supplémentaire : vérifier qu'aucune date passée n'est ajoutée
    if (fields.dateRappel && new Date(fields.dateRappel).getTime() < Date.now() - 60000) {
      showToast("La date de rappel ne peut pas être antérieure à aujourd'hui.", "error");
      return;
    }
    if (fields.dateEntretien && new Date(fields.dateEntretien).getTime() < Date.now() - 60000) {
      showToast("La date de l'entretien ne peut pas être antérieure à aujourd'hui.", "error");
      return;
    }
    // Pour la modale de rappel : buffer les champs, ne pas envoyer immédiatement
    setPendingChanges((prev) => ({ ...prev, ...fields }));
    const isEntretien = fields.dateEntretien || fields.status === "ENTRETIEN";
    showToast(
      isEntretien
        ? "Entretien planifié — cliquez sur « Enregistrer » pour confirmer."
        : "Rappel planifié — cliquez sur « Enregistrer » pour confirmer.",
      "success",
    );
  };

  const handleStatusWithModal = (newStatus) => {
    if (newStatus === "A_RAPPELER") {
      setRappelModal({ type: "RAPPEL", status: newStatus });
    } else if (newStatus === "ENTRETIEN") {
      setRappelModal({ type: "ENTRETIEN", status: newStatus });
    } else {
      setPendingChange("status", newStatus);
    }
  };

  const handleDeleteMessage = async (msgToDelete) => {
    if (
      await window.customConfirm(
        `Êtes-vous sûr de vouloir supprimer le message de ${msgToDelete.nomPrenom} ?\n\nCette action est irréversible.`,
        "Confirmer la suppression"
      )
    ) {
      try {
        const res = await apiFetch(
          `/api/crm/messages/${encodeURIComponent(msgToDelete.id)}`,
          "DELETE",
        );
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        showToast("Message supprimé avec succès.", "success");
        fetchMessages();
      } catch (err) {
        console.error(err);
        showToast("Impossible de supprimer le message.", "error");
      }
    }
  };

  const renderDropdown = (m) => {
    return (
      <ActionDropdown
        isOpen={openMenuId === m.id}
        menuRef={menuRef}
        width="150px"
      >
        {isAdminOrSuperAdmin(userRole) && (
          <button
            type="button"
            className="dropdown-item"
            onClick={() => {
              setOpenMenuId(null);
              setAssignMsg(m);
            }}
          >
            <Files size={14} /> Mettre en copie...
          </button>
        )}
        <button
          type="button"
          className="dropdown-item danger"
          onClick={() => {
            setOpenMenuId(null);
            handleDeleteMessage(m);
          }}
        >
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  };

  const conversationMessages =
    tab === "interne" &&
    (processMsg?.tacheId || processMsg?.missionId || processMsg?.dossierId)
      ? messages
          .filter(
            (m) =>
              (m.tacheId &&
                processMsg.tacheId &&
                m.tacheId === processMsg.tacheId) ||
              (!m.tacheId &&
                !processMsg.tacheId &&
                m.missionId &&
                processMsg.missionId &&
                m.missionId === processMsg.missionId) ||
              (!m.tacheId &&
                !processMsg.tacheId &&
                !m.missionId &&
                !processMsg.missionId &&
                m.dossierId &&
                processMsg.dossierId &&
                m.dossierId === processMsg.dossierId),
          )
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      : processMsg
        ? [processMsg]
        : [];

  const getAllowedMessageStatuses = (currentStatus, category, role) => {
    const isSA = isSuperAdmin(role);
    const isRO = isOperationalManager(role);
    
    const ALL_LABELS = {
      NOUVEAU: "Nouveau",
      A_RAPPELER: "À rappeler",
      DISCUSSION: "Discussion",
      ENTRETIEN: "Entretien",
      SANS_SUITE: "Sans suite",
      GAGNE: "Gagné",
      RETENU: "Retenu",
      REFUSE: "Refusé",
      TRAITE: "Traité",
    };
    
    const make = (vals) => vals.map(v => ({ value: v, label: ALL_LABELS[v] || v }));
    
    // Rôle non autorisé pour Contact/Recrutement
    // La règle métier dit "Super-administrateur et Responsable opérationnel uniquement"
    if (!isSA && !isRO) {
      return make([currentStatus]);
    }

    const withCurrent = (vals) => {
      const targets = vals.filter(v => v !== currentStatus);
      return make([currentStatus, ...targets]);
    };

    if (category === "contact") {
      switch(currentStatus) {
        case "NOUVEAU": return withCurrent(["A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"]);
        case "A_RAPPELER": return withCurrent(["DISCUSSION", "SANS_SUITE", "GAGNE"]);
        case "DISCUSSION": return withCurrent(["A_RAPPELER", "SANS_SUITE", "GAGNE"]);
        case "SANS_SUITE": return withCurrent(["DISCUSSION"]);
        case "GAGNE": return withCurrent([]);
        // Statut hors pipeline (ex: EN_ATTENTE) : on propose les statuts de départ du pipeline
        default: return make([currentStatus, "NOUVEAU", "A_RAPPELER", "DISCUSSION", "SANS_SUITE"]);
      }
    } else if (category === "recrutement") {
      switch(currentStatus) {
        case "NOUVEAU": return withCurrent(["A_RAPPELER", "ENTRETIEN", "REFUSE"]);
        case "A_RAPPELER": return withCurrent(["ENTRETIEN", "REFUSE"]);
        case "ENTRETIEN": return withCurrent(["A_RAPPELER", "RETENU", "REFUSE"]);
        case "RETENU": return withCurrent([]);
        case "REFUSE": return withCurrent([]);
        // Statut hors pipeline (ex: EN_ATTENTE) : on propose les statuts de départ du pipeline
        default: return make([currentStatus, "NOUVEAU", "A_RAPPELER", "ENTRETIEN"]);
      }
    } else { 
      // Aucun pipeline défini pour "Général" ou "Interne"
      return [];
    }
  };

  const renderStatusDropdown = (msg, currentTab, isInline = false) => {
    const currentStatus = pendingChanges.status !== undefined ? pendingChanges.status : msg.status || "NOUVEAU";
    const currentEtiquette = pendingChanges.etiquette !== undefined ? pendingChanges.etiquette : msg.etiquette || "";
    const role = currentUser?.role?.name || currentUser?.role || "";

    let category = "none";
    if (currentTab === "contact" || currentEtiquette === "Contact") category = "contact";
    else if (currentTab === "recrutement" || currentEtiquette === "Recrutement") category = "recrutement";

    const options = getAllowedMessageStatuses(currentStatus, category, role);
    const isDisabled = options.length <= 1;

    const getStatusColor = (st) => {
      const s = (st || "").toUpperCase();
      if (s === "GAGNE" || s === "GAGNÉ" || s === "TRAITE" || s === "TRAITÉ" || s === "RETENU") return "#10B981";
      if (s === "NOUVEAU") return "#2563EB";
      if (s === "REFUSE" || s === "REFUSÉ" || s === "SANS_SUITE") return "#EF4444";
      if (s === "A_RAPPELER" || s === "DISCUSSION" || s === "ENTRETIEN" || s === "EN_ATTENTE") return "#F59E0B";
      return "#CBD5E1";
    };

    const statusColor = options.length === 0 ? "#F59E0B" : getStatusColor(currentStatus);

    const selectElement = (
      <select
        value={options.length === 0 ? "" : currentStatus}
        onChange={(e) => handleStatusWithModal(e.target.value, currentTab)}
        disabled={isDisabled}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          borderRadius: "6px",
          border: `1px solid ${pendingChanges.status !== undefined ? "#D97706" : statusColor}`,
          outline: "none",
          background: isDisabled ? "#F3F4F6" : "#FFF",
          fontWeight: 700,
          fontSize: "0.85rem",
          color: statusColor !== "#CBD5E1" ? statusColor : "var(--text-main)",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        {options.length === 0 ? (
          <option value="" disabled style={{ color: "#F59E0B" }}>● Sélectionnez une étiquette...</option>
        ) : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[var(--text-main)]">
              ● {opt.label}
            </option>
          ))
        )}
      </select>
    );

    if (isInline) return selectElement;

    return (
      <div>
        <span
          className="block mb-4 font-medium" style={{color:"var(--text-muted)"}}
        >
          Statut
        </span>
        {selectElement}
      </div>
    );
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      {!isAnyModalOpen && (
        <>
          <div
            className="flex flex-col gap-4 mb-6"
          >
            <TabsNavigation
              tabs={
                normalizeRole(userRole).includes("collaborateur") || normalizeRole(userRole).includes("relecteur")
                  ? [{ id: "interne", label: "Interne" }]
                  : [
                      { id: "contact", label: "Contact" },
                      { id: "recrutement", label: "Recrutement" },
                      { id: "interne", label: "Interne" },
                      { id: "personnel", label: "Boîte e-mail" },
                    ]
              }
              activeTab={tab}
              onTabChange={handleTabChange}
            />
            {tab !== "interne" && (
              <div
                className="flex gap-4 w-full items-center"
              >
                <div className="relative" style={{flex:1}}>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",outline:"none",background:"#F8FAFC"}}
                  />
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",outline:"none"}}
                />
                <select
                  value={filterTraite}
                  onChange={(e) => setFilterTraite(e.target.value)}
                  className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",outline:"none",minWidth:"150px"}}
                >
                  <option value="all">{t("common.allStatuses", "Tous les statuts")}</option>
                  {tab === "contact" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="DISCUSSION">{t("status.DISCUSSION", "Discussion")}</option>
                      <option value="SANS_SUITE">{t("status.SANS_SUITE", "Sans suite")}</option>
                      <option value="GAGNE">{t("status.GAGNE", "Gagné")}</option>
                    </>
                  )}
                  {tab === "recrutement" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="ENTRETIEN">{t("status.ENTRETIEN", "Entretien")}</option>
                      <option value="RETENU">{t("status.RETENU", "Retenu")}</option>
                      <option value="REFUSE">{t("status.REFUSE", "Refusé")}</option>
                    </>
                  )}
                  {tab === "personnel" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="ENTRETIEN">{t("status.ENTRETIEN", "Entretien")}</option>
                      <option value="DISCUSSION">{t("status.DISCUSSION", "Discussion")}</option>
                      <option value="GAGNE">{t("status.GAGNE", "Gagné")}</option>
                      <option value="RETENU">{t("status.RETENU", "Retenu")}</option>
                      <option value="REFUSE">{t("status.REFUSE", "Refusé")}</option>
                      <option value="SANS_SUITE">{t("status.SANS_SUITE", "Sans suite")}</option>
                    </>
                  )}
                  {tab === "interne" && (
                    <>
                      <option value="NOUVEAU">{t("status.NOUVEAU", "Nouveau")}</option>
                      <option value="A_RAPPELER">{t("status.A_RAPPELER", "À rappeler")}</option>
                      <option value="TRAITE">{t("status.TRAITE", "Traité")}</option>
                      <option value="CLASSE">{t("status.CLASSE", "Classé sans suite")}</option>
                    </>
                  )}
                </select>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="p-2 cursor-pointer" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",outline:"none"}}
                >
                  <option value={12}>{t("common.perPage", { count: 12, defaultValue: "12 par page" })}</option>
                  <option value={25}>{t("common.perPage", { count: 25, defaultValue: "25 par page" })}</option>
                  <option value={50}>{t("common.perPage", { count: 50, defaultValue: "50 par page" })}</option>
                </select>

                {tab === "personnel" && isSuperAdmin(currentUser?.role?.name || currentUser?.role || userRole) && (
                  <button
                    type="button"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                    className="btn btn-primary flex gap-2 items-center" style={{padding:"0.5rem 1rem"}}
                  >
                    <Mail size={16} />
                    {isSyncing ? "Synchronisation..." : "Synchroniser Emails"}
                  </button>
                )}
              </div>
            )}
          </div>
          {tab === "interne" ? (
            <InternalChatTab
              currentUser={currentUser}
              users={users}
              showToast={showToast}
            />
          ) : (
            <>
              <div className="table-wrapper">
                <table className="w-full" style={{tableLayout:"fixed"}}>
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>{t("inbox.columns.no")}</th>
                      {(tab === "personnel" ||
                        tab === "contact" ||
                        tab === "recrutement") && (
                        <th style={{ width: "110px", whiteSpace: "nowrap" }}>
                          {t("inbox.columns.priority")}
                        </th>
                      )}
                      <th style={{ width: (tab === "personnel" || tab === "contact" || tab === "recrutement") ? "120px" : "130px", whiteSpace: "nowrap" }}>
                        {t("inbox.columns.status")}
                      </th>
                      <th style={{ width: tab === "personnel" ? "28%" : "22%" }}>
                        {t("inbox.columns.name")}
                      </th>
                      <th style={{ width: tab === "personnel" ? "30%" : "24%" }}>
                        {t("inbox.columns.email")}
                      </th>
                      {(tab !== "personnel") && (
                        <th style={{ width: "120px", whiteSpace: "nowrap" }}>
                          {t("inbox.columns.type")}
                        </th>
                      )}
                      <th className="table-date-cell" style={{ width: "165px" }}>{t("inbox.columns.date")}</th>
                      <th className="text-center" style={{width:"95px",whiteSpace:"nowrap"}}>
                        {t("inbox.columns.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      if (loading) {
                        return (
                          <tr>
                            <td
                              colSpan="10"
                              className="text-center p-8"
                            >
                              {t("common.loading", "Chargement des messages...")}
                            </td>
                          </tr>
                        );
                      }

                      const renderMessageRow = (
                        m,
                        index,
                        col2,
                        col3,
                        typeBadgeText,
                        typeBadgeBg,
                        typeBadgeColor,
                      ) => {
                        const isExpired = (msg) => {
                          const d = msg.dateRappel || msg.dateEntretien;
                          if (!d) return false;
                          if (
                            [
                              "TERMINE",
                              "ARCHIVE",
                              "CLASSE",
                              "GAGNE",
                              "RETENU",
                              "REFUSE",
                              "SANS_SUITE",
                            ].includes(msg.status)
                          )
                            return false;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const date = new Date(d);
                          date.setHours(0, 0, 0, 0);
                          return date <= today;
                        };
                        return (
                          <tr
                            key={m.id}
                            className={isExpired(m) ? "row-expired" : ""}
                          >
                            <td
                              className="font-medium" style={{color:"var(--text-muted)"}}
                            >
                              {index + 1}
                            </td>
                            {(tab === "personnel" ||
                              tab === "contact" ||
                              tab === "recrutement") && (
                              <td style={{ whiteSpace: "nowrap" }}>
                                <span
                                  style={
                                    tab === "message"
                                      ? {
                                          padding: "0.25rem 0.5rem",
                                          borderRadius: "4px",
                                          fontSize: "0.72rem",
                                          fontWeight: 400,
                                          background: getPriorityBadge(
                                            m.priorite
                                          ).bg,
                                          color: getPriorityBadge(
                                            m.priorite
                                          ).color,
                                        }
                                      : {
                                          color: getPriorityBadge(
                                            m.priorite
                                          ).color,
                                          fontWeight: 500,
                                        }
                                  }
                                >
                                  {formatPriority(m.priorite, t)}
                                </span>
                              </td>
                            )}
                            <td>
                              <span
                                style={
                                  tab === "message"
                                    ? {
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "4px",
                                        fontSize: "0.72rem",
                                        fontWeight: 400,
                                        background: getStatusBadge(m.status).bg,
                                        color: getStatusBadge(m.status).color,
                                        whiteSpace: "nowrap",
                                      }
                                    : {
                                        
                                        color: getStatusBadge(m.status).color,
                                      }
                                }
                              >
                                {getDisplayStatus(m.status, t)}
                              </span>
                            </td>
                            <td>
                              <div
                                className="truncate-name"
                                style={{ maxWidth: "100%" }}
                                title={col2}
                              >
                                {col2}
                              </div>
                            </td>
                            <td>
                              <div
                                className="truncate-name"
                                style={{
                                  color: "var(--text-muted)",
                                  maxWidth: "100%",
                                }}
                                title={col3}
                              >
                                {col3}
                              </div>
                            </td>
                            {(tab !== "personnel") && (
                              <td>
                                <span
                                  style={
                                    tab === "message"
                                      ? {
                                          padding: "0.25rem 0.5rem",
                                          borderRadius: "4px",
                                          fontSize: "0.72rem",
                                          fontWeight: 400,
                                          background: typeBadgeBg,
                                          color: typeBadgeColor,
                                        }
                                      : {
                                          
                                          color: typeBadgeColor,
                                        }
                                  }
                                >
                                  {typeBadgeText}
                                </span>
                              </td>
                            )}
                            <td
                              className="table-date-cell"
                              style={{
                                color: "var(--text-muted)",
                                width: "160px",
                              }}
                            >
                              {formatDate(m.createdAt)}
                            </td>
                            <td>
                              <div
                                className="flex flex-col items-center" style={{gap:"0.25rem"}}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProcessMsg(m);
                                    setPendingChanges({});
                                    setShowSaveConfirm(false);
                                  }}
                                  className="cursor-pointer" style={{background:"none",border:"none",color:"var(--primary)",padding:"4px"}}
                                  title="Consulter le message"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(m)}
                                  className="cursor-pointer" style={{background:"none",border:"none",color:"#EF4444",padding:"4px"}}
                                  title="Supprimer le message"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      };

                      const sortedMessages = messages;

                      if (tab === "contact") {
                        return sortedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            m.statusSubmitter === "SOCIETE"
                              ? t("inbox.type.company", "Entreprise")
                              : t("inbox.type.individual", "Particulier"),
                            "#E0E7FF",
                            "#4F46E5",
                          ),
                        );
                      }

                      if (tab === "recrutement") {
                        return sortedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            m.statusSubmitter === "SOCIETE"
                              ? t("inbox.type.company", "Entreprise")
                              : t("inbox.type.individual", "Particulier"),
                            "#FEF3C7",
                            "#D97706",
                          ),
                        );
                      }

                      if (tab === "interne") {
                        const groupedMessages = [];
                        const seenGroups = new Set();

                        sortedMessages.forEach((m) => {
                          const groupId =
                            m.tacheId || m.missionId || m.dossierId || m.id;
                          if (!seenGroups.has(groupId)) {
                            seenGroups.add(groupId);

                            // Find all messages in this group
                            const groupMsgs = sortedMessages.filter(
                              (x) =>
                                (x.tacheId && x.tacheId === groupId) ||
                                (x.missionId && x.missionId === groupId) ||
                                (x.dossierId && x.dossierId === groupId) ||
                                x.id === groupId,
                            );

                            // The overall status is defined by the latest message in the thread
                            const latestMsg = groupMsgs.reduce(
                              (prev, current) =>
                                new Date(prev.createdAt) >
                                new Date(current.createdAt)
                                  ? prev
                                  : current,
                            );

                            // Replace the status with the latest message's status
                            groupedMessages.push({
                              ...latestMsg,
                              originalMessage: m,
                            });
                          }
                        });

                        groupedMessages.sort(
                          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                        );

                        return groupedMessages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom || "Système",
                            m.email || "-",
                            m.sourceType || m.subType || "Interne",
                            "#F1F5F9",
                            "#64748B",
                            <span title={m.sourceRef || m.formulaireId || m.id}>
                              {m.sourceRef ||
                                (m.formulaireId
                                  ? m.formulaireId.split("-")[0]
                                  : m.id)}
                            </span>,
                            {
                              color: "var(--text-muted)",
                              fontSize: "0.75rem",
                              fontFamily: "monospace",
                            },
                          ),
                        );
                      }

                      // Fallback (tab === "personnel" / Boîte e-mail)
                      return sortedMessages.map((m, i) =>
                        renderMessageRow(
                          m,
                          i,
                          m.nomPrenom,
                          m.email,
                          m.sourceType || m.subType || "Indéfini",
                          "#F1F5F9",
                          "#64748B",
                          m.objet,
                          {
                            fontWeight: m.status === "NOUVEAU" ? 600 : 400,
                          },
                        ),
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </>
          )}
        </>
      )}

      {/* Modal Traiter Demande */}
      {processMsg &&
        !createTaskModal &&
        !showActionChoiceModal &&
        !showTraitePopup && (
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
                    className="text-white font-semibold cursor-pointer whitespace-nowrap inline-flex items-center justify-center shrink-0"
                    style={{
                      padding: "0.55rem 1.4rem",
                      borderRadius: "6px",
                      background: "var(--text-main)",
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
                        <MessageDetailCard
                          label="Type de contact"
                          value={(
                            extractFieldFromHtml(
                              processMsg.bodyHtml,
                              "Type de client",
                            ) ||
                            (processMsg.statusSubmitter === "SOCIETE"
                              ? "Entreprise"
                              : "Particulier")
                          )
                            .replace(" / Organisation", "")
                            .replace(" (B2B)", "")}
                        />
                        {processMsg.statusSubmitter === "SOCIETE" && (
                          <MessageDetailCard
                            label="Société"
                            value={
                              processMsg.raisonSocial ||
                              extractFieldFromHtml(
                                processMsg.bodyHtml,
                                "Société",
                              ) ||
                              "Non renseigné"
                            }
                          />
                        )}
                        <MessageDetailCard
                          label={
                            processMsg.statusSubmitter === "SOCIETE"
                              ? "Nom du contact"
                              : "Nom complet"
                          }
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
                            <option value="Urgent">● Urgent</option>
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
              )}

              {/* Vue Recrutement (Image 3) */}
              {tab === "recrutement" && (
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
                        <MessageDetailCard
                          label="Type de contact"
                          value={
                            extractFieldFromHtml(
                              processMsg.bodyHtml,
                              "Type de profil",
                            ) ||
                            (processMsg.statusSubmitter === "SOCIETE"
                              ? "Entreprise (B2B)"
                              : "Particulier")
                          }
                        />
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
                            <option value="Urgent">● Urgent</option>
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
              )}

              {/* Vue Personnel (Image 4) & Interne */}
              {(tab === "personnel" || tab === "interne") && (
                <div
                  className="grid gap-6 mb-6" style={{gridTemplateColumns:"1fr 1fr"}}
                >
                  {/* Colonne gauche : Métadonnées & Sélecteurs du Message */}
                  <div className="flex flex-col gap-6">
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
                        Métadonnées & Sélecteurs du Message
                      </div>
                      <div className="flex flex-col" style={{gap:"0.6rem"}}>
                        <MessageDetailCard
                          label="Nom"
                          value={processMsg.nomPrenom || "Non renseigné"}
                        />
                        <MessageDetailCard
                          label="Email"
                          value={processMsg.email || "Non renseigné"}
                        />
                        <MessageDetailCard
                          label="Fichiers joints"
                          sublabel="SELECT"
                        >
                          <AttachmentSelect
                            files={[
                              processMsg.cv,
                              processMsg.attachment,
                              processMsg.contact?.pieceJointe,
                            ]}
                            onPreview={setPreviewFile}
                          />
                        </MessageDetailCard>
                        {tab === "personnel" && (
                          <>
                            <MessageDetailCard
                              label="Étiquette"
                              sublabel="SELECT"
                            >
                              <select
                                value={
                                  pendingChanges.etiquette !== undefined
                                    ? pendingChanges.etiquette
                                    : processMsg.etiquette || ""
                                }
                                onChange={(e) =>
                                  setPendingChange("etiquette", e.target.value)
                                }
                                className="w-full font-bold cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #2563EB",outline:"none",background:"#FFF",fontSize:"0.85rem",color:"#2563EB"}}
                              >
                                <option value="">● Général</option>
                                <option value="Contact">● Contact</option>
                                <option value="Recrutement">● Recrutement</option>
                              </select>
                            </MessageDetailCard>
                            <MessageDetailCard
                              label="Statut"
                              sublabel="SELECT"
                            >
                              {renderStatusDropdown(processMsg, tab, true)}
                            </MessageDetailCard>
                            <MessageDetailCard
                              label="Priorité"
                              sublabel="SELECT"
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
                                <option value="Urgent">● Urgent</option>
                              </select>
                            </MessageDetailCard>
                            {isSuperAdmin(currentUser?.role?.name || currentUser?.role || userRole) && (
                              <MessageDetailCard
                                label="Mettre en copie"
                                sublabel="SELECT"
                              >
                                <select
                                  value={
                                    pendingChanges.assignedToId !== undefined
                                      ? pendingChanges.assignedToId
                                      : processMsg.assignedToId || ""
                                  }
                                  onChange={(e) =>
                                    setPendingChange("assignedToId", e.target.value)
                                  }
                                  className="w-full font-medium cursor-pointer" style={{padding:"0.5rem 0.75rem",borderRadius:"6px",border:"1px solid #CBD5E1",outline:"none",background:"#FFF",fontSize:"0.85rem"}}
                                >
                                  <option value="">Aucun</option>
                                  {users
                                    .filter(u => isOperationalManager(u.role?.name || u.role))
                                    .map((u) => (
                                      <option key={u.id} value={u.id}>
                                        {u.name} (Responsable)
                                      </option>
                                  ))}
                                </select>
                              </MessageDetailCard>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite : Fil de conversation */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="flex flex-col gap-4 h-full" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"10px",padding:"1.25rem"}}
                    >
                      <div
                        className="text-[var(--text-main)]" style={{fontWeight:800,fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.05em"}}
                      >
                        Fil de conversation
                      </div>

                      <div
                        className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid #F1F5F9"}}
                      >
                        <div className="font-bold" style={{fontSize:"0.95rem",color:"#2563EB",marginBottom:"0.25rem"}}>
                          Objet : {processMsg.objet || "Fil de conversation"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Fil officiel de correspondance lié à ce contact
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
                          overflowY: "auto",
                        }}
                      >
                        {tab === "interne" ? (
                          <div className="flex flex-col gap-4">
                            {conversationMessages.map((m) => {
                              const isMe = m.email === currentUser?.email || m.nomPrenom === currentUser?.name;
                              return (
                                <div
                                  key={m.id}
                                  style={{
                                    alignSelf: isMe ? "flex-end" : "flex-start",
                                    background: isMe ? "#1E3A8A" : "#F1F5F9",
                                    color: isMe ? "#FFF" : "var(--text-main)",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    border: isMe ? "none" : "1px solid var(--border)",
                                    maxWidth: "80%",
                                  }}
                                >
                                  <div className="flex justify-between gap-4" style={{marginBottom:"0.25rem",fontSize:"0.75rem",opacity:0.8}}>
                                    <strong>{m.nomPrenom}</strong>
                                    <span>{formatDate(m.createdAt)}</span>
                                  </div>
                                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.9rem" }}>
                                    {m.bodyText || m.bodyHtml || "Aucun contenu."}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-[var(--text-main)]" style={{fontSize:"0.95rem",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>
                            {processMsg.description || processMsg.bodyText || (processMsg.bodyHtml && !processMsg.bodyHtml.includes("<") ? processMsg.bodyHtml : null) || "Bonjour,\n\nMessage lié à ce fil."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


      {/* Create Task Modal */}
      {createTaskModal && (
        <div className="fade-in w-full" style={{padding:"0"}}>
          <div className="w-full" style={{padding:"0"}}>
            <div
              className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
            >
              <button
                type="button"
                onClick={() => {
                  setCreateTaskModal(false);
                  setNewTaskFile(null);
                }}
                className="btn btn-outline text-[var(--text-main)]" style={{padding:"0.5rem 1rem"}}
              >
                ← Retour
              </button>
              <h3 className="font-semibold" style={{fontSize:"1.5rem"}}>
                {tab === "interne" ? "Répondre au message" : "Nouveau Dossier"}
              </h3>
            </div>

            <div
              className="flex flex-col gap-4"
            >
              {tab === "interne" && (
                <>
                  <div>
                    <label
                      htmlFor="task-subject"
                      className="block mb-2 font-medium"
                    >
                      Objet de la réponse
                    </label>
                    <input
                      id="task-subject"
                      type="text"
                      value={taskSubject}
                      onChange={(e) => setTaskSubject(e.target.value)}
                      placeholder="Sujet..."
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="task-message"
                      className="block mb-2 font-medium"
                    >
                      Message
                    </label>
                    <textarea
                      id="task-message"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Votre réponse..."
                      className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"120px",resize:"vertical",fontFamily:"inherit"}}
                    ></textarea>
                  </div>
                </>
              )}

              {tab !== "interne" && (
                <div>
                  <label
                    htmlFor="task-dossier"
                    className="block mb-2 font-medium"
                  >
                    Dossier associé
                  </label>
                  <div
                    className="grid gap-4" style={{gridTemplateColumns:"1fr 1.5fr 2fr",alignItems:"start"}}
                  >
                    <select
                      value={taskDossierSection}
                      onChange={(e) => {
                        setTaskDossierSection(e.target.value);
                        setTaskDossierCible("");
                      }}
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                    >
                      <option value="">-- Section --</option>
                      <option value="equipe">Équipe</option>
                      <option value="client">Client</option>
                    </select>

                    <select
                      value={taskDossierCible}
                      onChange={(e) => setTaskDossierCible(e.target.value)}
                      disabled={!taskDossierSection}
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "#FFF",
                        opacity: !taskDossierSection ? 0.5 : 1,
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {taskDossierSection === "equipe" &&
                        users.map((u) => (
                          <option
                            key={u.id}
                            value={u.id}
                          >{`${u.name} (${u.role?.name || "Sans rôle"})`}</option>
                        ))}
                      {taskDossierSection === "client" &&
                        clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name ||
                              `${c.firstName} ${c.lastName}` ||
                              c.email}
                          </option>
                        ))}
                    </select>

                    <input
                      type="text"
                      value={taskNewDossierName}
                      onChange={(e) => setTaskNewDossierName(e.target.value)}
                      placeholder="Nom du nouveau dossier..."
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                    />
                  </div>

                  {/* File upload for dossier */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <label
                      className="block font-medium" style={{marginBottom:"0.35rem"}}
                    >
                      <Paperclip
                        size={13}
                        style={{ marginRight: "4px", verticalAlign: "middle" }}
                      />
                      Pièce jointe (optionnel)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={(e) =>
                        setDossierFile(e.target.files?.[0] || null)
                      }
                      className="w-full p-2" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC"}}
                    />
                    {dossierFile && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          marginTop: "0.25rem",
                          margin: "0.25rem 0 0",
                        }}
                      >
                        &#10004; {dossierFile.name}
                      </p>
                    )}
                  </div>

                  {processMsg?.attachment && (
                    <div
                      className="mt-4" style={{padding:"0.75rem",background:"#F0F9FF",borderRadius:"8px",border:"1px solid #BAE6FD"}}
                    >
                      <label
                        className="block mb-2 font-medium" style={{color:"var(--primary-dark)"}}
                      >
                        Inclure les pièces jointes du message :
                      </label>
                      <div
                        className="flex flex-col gap-2"
                      >
                        {processMsg.attachment.split(",").map((att) => {
                          const fileName = att.split("/").pop();
                          return (
                            <div
                              key={att}
                              className="flex items-center gap-4"
                            >
                              <label
                                className="flex items-center gap-2 cursor-pointer font-medium text-[var(--text-main)]"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedMsgDocs.includes(att)}
                                  onChange={(e) => {
                                    if (e.target.checked)
                                      setSelectedMsgDocs([
                                        ...selectedMsgDocs,
                                        att,
                                      ]);
                                    else
                                      setSelectedMsgDocs(
                                        selectedMsgDocs.filter(
                                          (a) => a !== att,
                                        ),
                                      );
                                  }}
                                  className="cursor-pointer"
                                />
                                <Paperclip
                                  size={14}
                                  style={{ color: "var(--primary)" }}
                                />{" "}
                                {fileName}
                              </label>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPreviewFile(att);
                                }}
                                className="cursor-pointer flex items-center" style={{background:"none",border:"none",color:"var(--primary)"}}
                                title="Prévisualiser"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "interne" && (
                <div>
                  <span
                    className="block mb-2 font-medium"
                  >
                    Pièces jointes
                  </span>
                  <div
                    className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                  >
                    <label
                      className="flex items-center gap-2 cursor-pointer" style={{color:"var(--primary)"}}
                    >
                      <Files size={16} />
                      <span className="font-medium">
                        {newTaskFile
                          ? newTaskFile.name
                          : "Joindre un fichier..."}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setNewTaskFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex justify-end gap-4 mt-6"
            >
              <button
                type="button"
                onClick={() => {
                  setCreateTaskModal(false);
                  setNewTaskFile(null);
                  setDossierFile(null);
                  setSelectedMsgDocs([]);
                }}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {(() => {
                  if (isSubmitting) return "Traitement...";
                  if (tab === "interne") return "Envoyer";
                  return "Créer le Dossier";
                })()}
              </button>
            </div>
          </div>
        </div>
      )}

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />



      {/* Assign Confirmation Modal */}
      {assignMsg && (
        <div
          className="fixed inset-0 flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)",zIndex:1000}}
        >
          <div
            className="p-8" style={{background:"#FFF",borderRadius:"8px",width:"90%",maxWidth:"400px",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
          >
            <h3
              className="mb-4 text-[var(--text-main)]" style={{fontSize:"1.25rem"}}
            >
              Mettre en copie le message
            </h3>
            <div className="mb-6">
              <label
                className="block mb-2 font-medium"
              >
                Sélectionner le destinataire :
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
              >
                <option value="">-- Choisir un utilisateur --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role?.name || "Sans rôle"})
                  </option>
                ))}
              </select>
            </div>
            <div
              className="flex gap-4 justify-end"
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setAssignMsg(null);
                  setSelectedAssignee("");
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={handleAssignSubmit}
              >
                {isSubmitting ? "En cours..." : "Mettre en copie"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: toast.type === "error" ? "#FEE2E2" : "#DCFCE7",
            color: toast.type === "error" ? "#991B1B" : "#166534",
            border:
              toast.type === "error"
                ? "1px solid #F87171"
                : "1px solid #86EFAC",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: 500,
            animation: "slideIn 0.3s ease-out",
            maxWidth: "420px",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span style={{ flex: 1, fontSize: "0.9rem" }}>{toast.message}</span>
          <button
            type="button"
            onClick={() =>
              setToast({ show: false, message: "", type: "success" })
            }
            className="cursor-pointer font-bold flex items-center justify-center" style={{background:"transparent",border:"none",color:"inherit",fontSize:"1.1rem",padding:"0 4px"}}
            title="Fermer"
          >
            ✕
          </button>
        </div>
      )}
      {/* ─── Modale saisie "À rappeler" / "Entretien" ─── */}
      <InboxRappelModal
        rappelModal={rappelModal}
        setRappelModal={setRappelModal}
        handleUpdateMultiple={handleUpdateMultiple}
      />
    </div>
  );
};

export default InboxPage;
