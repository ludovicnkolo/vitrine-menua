import {
  getSafeApiUrl,
  apiFetch,
  uploadFile,
  formatDate,
  extractFieldFromHtml,
  extractBlockFromHtml,
} from "../utils/helpers";
import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import TabsNavigation from "../components/TabsNavigation";
import ActionDropdown from "../components/ActionDropdown";
import PaginationControls from "../components/PaginationControls";
import FilePreviewModal from "../components/FilePreviewModal";
import AttachmentSelect from "../components/AttachmentSelect";

import InternalChatTab from "../components/InternalChatTab";

const DetailField = ({ label, value, children }) => (
  <div>
    <span
      style={{
        display: "block",
        marginBottom: "0.25rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "var(--text-muted)",
      }}
    >
      {label}
    </span>
    <div
      style={{
        width: "100%",
        padding: "0.5rem",
        background: "#F8FAFC",
        borderRadius: "4px",
        border: "1px solid var(--border)",
        minHeight: "38px",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      {children || value}
    </div>
  </div>
);

const InlineDetailField = ({ label, value, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "0.5rem",
      fontSize: "0.875rem",
    }}
  >
    <span
      style={{ fontWeight: 500, color: "var(--text-muted)", flexShrink: 0 }}
    >
      {label} :
    </span>
    <div
      style={{ color: "var(--text-main)", flex: 1, wordBreak: "break-word" }}
    >
      {children || value}
    </div>
  </div>
);

const getDisplayStatus = (status) => {
  if (!status) return "Nouveau";
  const s = status.toUpperCase();
  if (s === "CLASSE" || s === "CLASSÉ") return "Classé";
  if (s === "TRAITE" || s === "TRAITÉ") return "Traité";
  if (s === "NOUVEAU") return "Nouveau";
  if (s === "A_RAPPELER") return "À rappeler";
  if (s === "DISCUSSION") return "Discussion";
  if (s === "SANS_SUITE") return "Sans suite";
  if (s === "GAGNE") return "Gagné";
  if (s === "ENTRETIEN") return "Entretien";
  if (s === "RETENU") return "Retenu";
  if (s === "REFUSE") return "Refusé";
  if (s === "EN_ATTENTE") return "En attente";
  return s;
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

const InboxPage = ({ userRole }) => {
  const [tab, setTab] = useState(
    userRole === "Collaborateur" || userRole === "Relecteur"
      ? "interne"
      : "contact",
  );
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
  const [deleteMsg, setDeleteMsg] = useState(null);
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
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const [taskDescription, setTaskDescription] = useState("");
  const [taskEcheance, setTaskEcheance] = useState("");
  const menuRef = useRef(null);
  const isAnyModalOpen =
    processMsg || createTaskModal || showActionChoiceModal || showTraitePopup;

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    if (type === "success") {
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        18000,
      );
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      if (!token) return;

      const urlMessages = new URL(getSafeApiUrl(`/api/crm/messages`));
      urlMessages.searchParams.append("type", tab);
      urlMessages.searchParams.append("page", page);
      urlMessages.searchParams.append("limit", limit.toString());
      urlMessages.searchParams.append("status", filterTraite);
      urlMessages.searchParams.append("search", searchQuery);
      if (filterDate) {
        urlMessages.searchParams.append("date", filterDate);
      }

      const [resMsgs, resUsers, resDossiers, resClients] = await Promise.all([
        fetch(urlMessages.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(new URL(getSafeApiUrl(`/api/crm/users`)).toString(), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          new URL(getSafeApiUrl(`/api/crm/dossiers?limit=1000`)).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          new URL(getSafeApiUrl(`/api/crm/clients?limit=1000`)).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ]);

      if (resMsgs.ok) {
        const result = await resMsgs.json();
        if (result.data) {
          setMessages(result.data);
          setTotalPages(result.totalPages || 1);
        } else {
          setMessages(result);
          setTotalPages(1);
        }
      } else if (resMsgs.status === 401) {
        showToast(
          "Votre session a expiré. Veuillez vous reconnecter.",
          "error",
        );
        sessionStorage.removeItem("adminToken");
        window.location.href = "/login";
      }

      if (resUsers.ok) setUsers(await resUsers.json());
      if (resDossiers.ok) {
        const doss = await resDossiers.json();
        setDossiers(doss.data || doss);
      }
      if (resClients.ok) {
        const cl = await resClients.json();
        setClients(cl.data || cl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [tab, filterTraite, filterDate, searchQuery, limit]);

  useEffect(() => {
    fetchMessages();
  }, [tab, filterTraite, filterDate, page, searchQuery, limit]);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("adminUser");
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch (e) {}
  }, []);

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

  // Envoie toutes les modifications en attente
  const handleSaveAll = async () => {
    if (!processMsg || !hasPendingChanges) return;
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`,
        "PATCH",
        pendingChanges,
      );
      if (!res.ok) throw new Error("Erreur de mise à jour");
      showToast("Modifications enregistrées avec succès.", "success");
      const updated = { ...processMsg, ...pendingChanges };
      setProcessMsg(updated);
      setMessages(messages.map((m) => (m.id === processMsg.id ? updated : m)));
      setPendingChanges({});
      setShowSaveConfirm(false);
    } catch (err) {
      console.error(err);
      showToast("Impossible de sauvegarder les modifications.", "error");
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
    // Pour la modale de rappel : buffer les champs, ne pas envoyer immédiatement
    setPendingChanges((prev) => ({ ...prev, ...fields }));
    showToast(
      "Rappel planifié — cliquez sur « Enregistrer » pour confirmer.",
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

  const confirmDelete = async () => {
    if (!deleteMsg) return;
    try {
      const res = await apiFetch(
        `/api/crm/messages/${encodeURIComponent(deleteMsg.id)}`,
        "DELETE",
      );

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      showToast("Message supprimé avec succès.", "success");
      setDeleteMsg(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
      showToast("Impossible de supprimer le message.", "error");
    }
  };

  const renderDropdown = (m) => {
    return (
      <ActionDropdown
        isOpen={openMenuId === m.id}
        menuRef={menuRef}
        width="150px"
      >
        {(userRole === "Administrateur" ||
          userRole === "Super-administrateur" || 
          userRole === "Super administrateur") && (
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
            setDeleteMsg(m);
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
    const isSA = role === "Super-administrateur";
    const isRO = role === "Responsable opérationnel";
    
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
        default: return make(["NOUVEAU", "A_RAPPELER", "DISCUSSION", "SANS_SUITE"]);
      }
    } else if (category === "recrutement") {
      switch(currentStatus) {
        case "NOUVEAU": return withCurrent(["A_RAPPELER", "ENTRETIEN", "REFUSE"]);
        case "A_RAPPELER": return withCurrent(["ENTRETIEN", "REFUSE"]);
        case "ENTRETIEN": return withCurrent(["A_RAPPELER", "RETENU", "REFUSE"]);
        case "RETENU": return withCurrent([]);
        case "REFUSE": return withCurrent([]);
        default: return make(["NOUVEAU", "A_RAPPELER", "ENTRETIEN"]);
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

    const selectElement = (
      <select
        value={options.length === 0 ? "" : currentStatus}
        onChange={(e) => handleStatusWithModal(e.target.value, currentTab)}
        disabled={isDisabled}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          border: `1px solid ${pendingChanges.status !== undefined ? "#D97706" : "var(--border)"}`,
          outline: "none",
          background: isDisabled ? "#F3F4F6" : "#FFF",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        {options.length === 0 ? (
          <option value="" disabled>Sélectionnez une étiquette...</option>
        ) : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        )}
      </select>
    );

    if (isInline) return selectElement;

    return (
      <div>
        <span
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <TabsNavigation
              tabs={
                userRole === "Collaborateur" || userRole === "Relecteur"
                  ? [{ id: "interne", label: "Interne" }]
                  : [
                      { id: "contact", label: "Contact" },
                      { id: "recrutement", label: "Recrutement" },
                      { id: "interne", label: "Interne" },
                      { id: "personnel", label: "Boîte e-mail" },
                    ]
              }
              activeTab={tab}
              onTabChange={setTab}
            />
            {tab !== "interne" && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "0.875rem",
                      outline: "none",
                      background: "#F8FAFC",
                    }}
                  />
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                    fontSize: "0.875rem",
                    color: "var(--text-main)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                <select
                  value={filterTraite}
                  onChange={(e) => setFilterTraite(e.target.value)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                    fontSize: "0.875rem",
                    color: "var(--text-main)",
                    outline: "none",
                    cursor: "pointer",
                    minWidth: "150px",
                  }}
                >
                  <option value="all">Tous les statuts</option>
                  {tab === "contact" && (
                    <>
                      <option value="NOUVEAU">Nouveau</option>
                      <option value="A_RAPPELER">&Agrave; rappeler</option>
                      <option value="DISCUSSION">Discussion</option>
                      <option value="SANS_SUITE">Sans suite</option>
                      <option value="GAGNE">Gagn&eacute;</option>
                    </>
                  )}
                  {tab === "recrutement" && (
                    <>
                      <option value="NOUVEAU">Nouveau</option>
                      <option value="A_RAPPELER">&Agrave; rappeler</option>
                      <option value="ENTRETIEN">Entretien</option>
                      <option value="RETENU">Retenu</option>
                      <option value="REFUSE">Refus&eacute;</option>
                    </>
                  )}
                  {tab === "personnel" && (
                    <>
                      <option value="NOUVEAU">Nouveau</option>
                      <option value="A_RAPPELER">&Agrave; rappeler</option>
                      <option value="ENTRETIEN">Entretien</option>
                      <option value="DISCUSSION">Discussion</option>
                      <option value="GAGNE">Gagn&eacute;</option>
                      <option value="RETENU">Retenu</option>
                      <option value="REFUSE">Refus&eacute;</option>
                      <option value="SANS_SUITE">Sans suite</option>
                    </>
                  )}
                  {tab === "interne" && (
                    <>
                      <option value="NOUVEAU">Nouveau</option>
                      <option value="A_RAPPELER">&Agrave; rappeler</option>
                      <option value="TRAITE">Trait&eacute;</option>
                      <option value="CLASSE">Class&eacute; sans suite</option>
                    </>
                  )}
                </select>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                    fontSize: "0.875rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value={12}>12 par page</option>
                  <option value={25}>25 par page</option>
                  <option value={50}>50 par page</option>
                </select>

                {tab === "personnel" && (currentUser?.role?.name === "Super-administrateur" || currentUser?.role === "Super-administrateur") && (
                  <button
                    type="button"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                    className="btn btn-primary"
                    style={{
                      padding: "0.5rem 1rem",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
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
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "4%" }}>№</th>
                      {(tab === "personnel" ||
                        tab === "contact" ||
                        tab === "recrutement") && (
                        <th style={{ width: "9%", whiteSpace: "nowrap" }}>
                          Priorité
                        </th>
                      )}
                      <th style={{ width: "10%", whiteSpace: "nowrap" }}>
                        Statut
                      </th>
                      <th style={{ width: tab === "interne" ? "22%" : "18%" }}>
                        {tab === "interne" ? "Emetteur" : "Nom"}
                      </th>
                      <th style={{ width: tab === "interne" ? "28%" : "20%" }}>
                        {tab === "recrutement" ? "E-mail" : "Email"}
                      </th>
                      {(tab === "contact" || tab === "recrutement") && (
                        <th style={{ width: "10%", whiteSpace: "nowrap" }}>
                          Vérification
                        </th>
                      )}
                      <th style={{ width: "10%" }}>
                        {tab === "interne"
                          ? "Source"
                          : tab === "personnel"
                            ? "Étiquette"
                            : "Type"}
                      </th>
                      <th style={{ width: "11%" }}>Date</th>
                      <th style={{ width: "8%", textAlign: "center" }}>
                        Actions
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
                              style={{ textAlign: "center", padding: "2rem" }}
                            >
                              Chargement des messages...
                            </td>
                          </tr>
                        );
                      }

                      const getPriorityBadge = (p) => {
                        if (p === "Urgent")
                          return { bg: "#FEE2E2", color: "#DC2626" }; // Red
                        if (p === "Prioritaire")
                          return { bg: "#FEF3C7", color: "#D97706" }; // Orange
                        return { bg: "#DCFCE7", color: "#166534" }; // Green for Normal
                      };

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
                              style={{
                                fontWeight: 500,
                                color: "var(--text-muted)",
                              }}
                            >
                              {index + 1}
                            </td>
                            {(tab === "personnel" ||
                              tab === "contact" ||
                              tab === "recrutement") && (
                              <td>
                                <span
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "0.72rem",
                                    fontWeight: 600,
                                    background: getPriorityBadge(
                                      m.priorite || "Normal",
                                    ).bg,
                                    color: getPriorityBadge(
                                      m.priorite || "Normal",
                                    ).color,
                                  }}
                                >
                                  {m.priorite || "Normal"}
                                </span>
                              </td>
                            )}
                            <td>
                              <span
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  background: getStatusBadge(m.status).bg,
                                  color: getStatusBadge(m.status).color,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {getDisplayStatus(m.status)}
                              </span>
                            </td>
                            <td>
                              <strong
                                className="truncate-name"
                                style={{ fontSize: "0.875rem" }}
                              >
                                {col2}
                              </strong>
                            </td>
                            <td>
                              <span
                                className="truncate-text"
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {col3}
                              </span>
                            </td>
                            {(tab === "contact" || tab === "recrutement") && (
                              <td>
                                {(() => {
                                  const vb = getVerifaliaBadge(
                                    m.verifaliaStatus,
                                  );
                                  return (
                                    <span
                                      style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "4px",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        background: vb.bg,
                                        color: vb.color,
                                        whiteSpace: "nowrap",
                                        display: "inline-block",
                                      }}
                                    >
                                      {vb.text}
                                    </span>
                                  );
                                })()}
                              </td>
                            )}
                            <td>
                              <span
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  background: typeBadgeBg,
                                  color: typeBadgeColor,
                                }}
                              >
                                {tab === "personnel"
                                  ? m.etiquette || "Général"
                                  : typeBadgeText}
                              </span>
                            </td>
                            <td
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatDate(m.createdAt)}
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
                                  onClick={() => setProcessMsg(m)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--primary)",
                                    padding: "4px",
                                  }}
                                  title="Consulter le message"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteMsg(m)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#EF4444",
                                    padding: "4px",
                                  }}
                                  title="Supprimer le message"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      };

                      if (tab === "contact") {
                        return messages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            m.statusSubmitter === "SOCIETE"
                              ? "Entreprise"
                              : "Particulier",
                            "#E0E7FF",
                            "#4F46E5",
                          ),
                        );
                      }

                      if (tab === "recrutement") {
                        return messages.map((m, i) =>
                          renderMessageRow(
                            m,
                            i,
                            m.nomPrenom,
                            m.email,
                            m.statusSubmitter === "SOCIETE"
                              ? "Entreprise"
                              : "Particulier",
                            "#FEF3C7",
                            "#D97706",
                          ),
                        );
                      }

                      if (tab === "interne") {
                        const groupedMessages = [];
                        const seenGroups = new Set();

                        messages.forEach((m) => {
                          const groupId =
                            m.tacheId || m.missionId || m.dossierId || m.id;
                          if (!seenGroups.has(groupId)) {
                            seenGroups.add(groupId);

                            // Find all messages in this group
                            const groupMsgs = messages.filter(
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

                      // Fallback
                      return messages.map((m, i) =>
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
                            fontSize: "0.875rem",
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
          <div className="fade-in" style={{ padding: "1rem" }}>
            <div className="" style={{ width: "100%", padding: "0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "2rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "1.5rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() => setProcessMsg(null)}
                  className="btn btn-outline-primary"
                  style={{
                    padding: "0.5rem 1rem",
                    position: "absolute",
                    left: 0,
                  }}
                >
                  RETOUR
                </button>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    width: "100%",
                    textAlign: "center",
                  }}
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
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-main)",
                            marginBottom: "0.25rem",
                          }}
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
                            fontSize: "0.875rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          <strong>Note :</strong> {processMsg.noteRappel}
                        </div>
                      )}
                      {processMsg.lienVisio && (
                        <div style={{ fontSize: "0.875rem" }}>
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
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        fontSize: "1.1rem",
                        padding: "0",
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                      title="Fermer"
                    >
                      &#x2715;
                    </button>
                  </div>
                )}
              {(processMsg.status === "A_RAPPELER" ||
                processMsg.status === "ENTRETIEN") &&
                !showRappelBanner && (
                  <div style={{ textAlign: "right", marginBottom: "0.5rem" }}>
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

              {/* Fields for Contact */}
              {tab === "contact" && (
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
                  {/* Colonne 1 — Informations du contact */}
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
                      Informations du contact
                    </div>
                    <InlineDetailField
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
                      <InlineDetailField
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
                    <InlineDetailField
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
                    <InlineDetailField
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
                    <InlineDetailField
                      label="Email"
                      value={
                        processMsg.email ||
                        extractFieldFromHtml(processMsg.bodyHtml, "Email") ||
                        "Non renseigné"
                      }
                    />
                  </div>

                  {/* Colonne 2 — Qualification de la demande */}
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
                        color: "var(--primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Qualification de la demande
                    </div>
                    <InlineDetailField
                      label="Statut vérification email"
                      value={
                        processMsg.verifaliaStatus
                          ? `${getVerifaliaBadge(processMsg.verifaliaStatus).text} (${processMsg.verifaliaStatus})`
                          : "Non vérifié"
                      }
                    />
                    <InlineDetailField
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
                  </div>
                </div>
              )}

              {/* Fields for Recrutement */}
              {tab === "recrutement" && (
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
                  {/* Colonne 1 — Informations du contact */}
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
                      Informations du contact
                    </div>
                    <InlineDetailField
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
                    <InlineDetailField
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
                    <InlineDetailField
                      label="Email"
                      value={
                        processMsg.email ||
                        extractFieldFromHtml(processMsg.bodyHtml, "Email") ||
                        "Non renseigné"
                      }
                    />
                    <InlineDetailField
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
                    <InlineDetailField
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
                    <InlineDetailField label="Profil LinkedIn">
                      {processMsg.recrutement?.lienLinkedin ? (
                        <a
                          href={processMsg.recrutement.lienLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--primary)",
                            textDecoration: "underline",
                          }}
                        >
                          {processMsg.recrutement.lienLinkedin}
                        </a>
                      ) : extractFieldFromHtml(
                          processMsg.bodyHtml,
                          "LinkedIn / Portfolio",
                        ) ? (
                        <a
                          href={extractFieldFromHtml(
                            processMsg.bodyHtml,
                            "LinkedIn / Portfolio",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--primary)",
                            textDecoration: "underline",
                          }}
                        >
                          {extractFieldFromHtml(
                            processMsg.bodyHtml,
                            "LinkedIn / Portfolio",
                          )}
                        </a>
                      ) : (
                        "Non renseigné"
                      )}
                    </InlineDetailField>
                  </div>

                  {/* Colonne 2 — Profil professionnel */}
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
                        color: "var(--primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Profil professionnel
                    </div>
                    <InlineDetailField
                      label="Statut vérification email"
                      value={
                        processMsg.verifaliaStatus
                          ? `${getVerifaliaBadge(processMsg.verifaliaStatus).text} (${processMsg.verifaliaStatus})`
                          : "Non vérifié"
                      }
                    />
                    <InlineDetailField
                      label="Années d'expérience"
                      value={
                        processMsg.recrutement?.anneeExperience ||
                        "Non renseigné"
                      }
                    />
                    <InlineDetailField
                      label="Langues"
                      value={
                        processMsg.recrutement?.langue ||
                        extractFieldFromHtml(processMsg.bodyHtml, "Langues") ||
                        "Non renseigné"
                      }
                    />
                    <InlineDetailField
                      label="Disponibilité"
                      value={
                        extractFieldFromHtml(
                          processMsg.bodyHtml,
                          "Disponibilité",
                        ) || "Non renseigné"
                      }
                    />
                    <InlineDetailField
                      label="Compétences clés"
                      value={
                        processMsg.recrutement?.competenceCle ||
                        extractFieldFromHtml(
                          processMsg.bodyHtml,
                          "Compétences",
                        ) ||
                        extractFieldFromHtml(
                          processMsg.bodyHtml,
                          "Compétences clés",
                        ) ||
                        "Non renseigné"
                      }
                    />
                  </div>
                </div>
              )}

              {/* Fields for Personnel and Interne */}
              {(tab === "personnel" || tab === "interne") && (
                <div
                  style={{
                    background: "#F8FAFC",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <InlineDetailField
                    label="Nom"
                    value={processMsg.nomPrenom || "Non renseigné"}
                  />
                  <InlineDetailField
                    label="Email"
                    value={processMsg.email || "Non renseigné"}
                  />
                  <InlineDetailField
                    label="Objet"
                    value={processMsg.objet || "Aucun objet"}
                  />
                  {tab === "personnel" && (
                    <>
                      <InlineDetailField label="Priorité">
                        <select
                          value={
                            pendingChanges.priorite !== undefined
                              ? pendingChanges.priorite
                              : processMsg.priorite || "Normal"
                          }
                          onChange={(e) =>
                            setPendingChange("priorite", e.target.value)
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            border: `1px solid ${pendingChanges.priorite !== undefined ? "#D97706" : "var(--border)"}`,
                            outline: "none",
                            background: "#FFF",
                            width: "100%",
                          }}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Prioritaire">Prioritaire</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </InlineDetailField>
                      <InlineDetailField label="Étiquette">
                        <select
                          value={
                            pendingChanges.etiquette !== undefined
                              ? pendingChanges.etiquette
                              : processMsg.etiquette || ""
                          }
                          onChange={(e) =>
                            setPendingChange("etiquette", e.target.value)
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            border: `1px solid ${pendingChanges.etiquette !== undefined ? "#D97706" : "var(--border)"}`,
                            outline: "none",
                            background: "#FFF",
                            width: "100%",
                          }}
                        >
                          <option value="">Général</option>
                          <option value="Contact">Contact</option>
                          <option value="Recrutement">Recrutement</option>
                        </select>
                      </InlineDetailField>
                      <InlineDetailField label="Statut">
                        {renderStatusDropdown(processMsg, tab, true)}
                      </InlineDetailField>
                      {(currentUser?.role?.name === "Super-administrateur" || currentUser?.role === "Super-administrateur") && (
                        <InlineDetailField label="Mettre en copie">
                          <select
                            value={
                              pendingChanges.assignedToId !== undefined
                                ? pendingChanges.assignedToId
                                : processMsg.assignedToId || ""
                            }
                            onChange={(e) =>
                              setPendingChange("assignedToId", e.target.value)
                            }
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                              border: `1px solid ${pendingChanges.assignedToId !== undefined ? "#D97706" : "var(--border)"}`,
                              outline: "none",
                              background: "#FFF",
                              width: "100%",
                            }}
                          >
                            <option value="">Aucun</option>
                            {users
                              .filter(u => u.role?.name === "Responsable opérationnel" || u.role === "Responsable opérationnel")
                              .map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name} (Responsable)
                                </option>
                            ))}
                          </select>
                        </InlineDetailField>
                      )}
                    </>
                  )}
                  <InlineDetailField label="Fichiers joints">
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <AttachmentSelect
                        files={[
                          processMsg.cv,
                          processMsg.attachment,
                          processMsg.contact?.pieceJointe,
                        ]}
                        onPreview={setPreviewFile}
                      />
                    </div>
                  </InlineDetailField>
                </div>
              )}

              {/* Pièces jointes & Contenu */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    tab === "contact" || tab === "recrutement"
                      ? "1fr 4fr"
                      : "1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                  minHeight: "300px",
                }}
              >
                {/* Left column: Actions / Pièces jointes */}
                {(tab === "contact" || tab === "recrutement") && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      className="card"
                      style={{
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "block",
                            marginBottom: "1rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "var(--text-muted)",
                          }}
                        >
                          Priorité
                        </span>
                        <select
                          value={
                            pendingChanges.priorite !== undefined
                              ? pendingChanges.priorite
                              : processMsg.priorite || "Normal"
                          }
                          onChange={(e) =>
                            setPendingChange("priorite", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: `1px solid ${pendingChanges.priorite !== undefined ? "#D97706" : "var(--border)"}`,
                            outline: "none",
                            background: "#FFF",
                          }}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Prioritaire">Prioritaire</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      <div>{renderStatusDropdown(processMsg, tab)}</div>
                    </div>
                  </div>
                )}

                <div
                  className="card"
                  style={{
                    padding: "1.25rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      marginBottom: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--text-muted)",
                    }}
                  >
                    {(() => {
                      if (tab === "contact" || tab === "recrutement")
                        return "Description / Contenu";
                      if (tab === "personnel" || tab === "interne")
                        return "Fil de conversation";
                      return "Message / Lettre de motivation";
                    })()}
                  </span>
                  <div
                    style={{
                      background: "var(--bg-light)",
                      padding: "1rem",
                      borderRadius: "8px",
                      flex: 1,
                      minHeight: "120px",
                      maxHeight: "500px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {tab === "interne" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            flex: 1,
                            paddingRight: "0.5rem",
                          }}
                        >
                          {conversationMessages.map((m) => {
                            const isMe =
                              m.email === currentUser?.email ||
                              m.nomPrenom === currentUser?.name;
                            return (
                              <div
                                key={m.id}
                                style={{
                                  alignSelf: isMe ? "flex-end" : "flex-start",
                                  background: isMe ? "var(--primary)" : "#FFF",
                                  color: isMe ? "#FFF" : "var(--text-main)",
                                  padding: "1rem",
                                  borderRadius: "12px",
                                  border: isMe
                                    ? "none"
                                    : "1px solid var(--border)",
                                  maxWidth: "80%",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "0.5rem",
                                    fontSize: "0.75rem",
                                    color: isMe
                                      ? "rgba(255,255,255,0.8)"
                                      : "var(--text-muted)",
                                    gap: "1rem",
                                  }}
                                >
                                  <strong>{m.nomPrenom}</strong>
                                  <span>{formatDate(m.createdAt)}</span>
                                </div>
                                <div
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: "0.9rem",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  {m.bodyText ||
                                    (m.bodyHtml ? (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: m.bodyHtml,
                                        }}
                                      />
                                    ) : (
                                      "Aucun contenu."
                                    ))}
                                </div>
                                {m.attachment && (
                                  <div style={{ marginTop: "0.5rem" }}>
                                    <AttachmentSelect
                                      files={[m.attachment]}
                                      onPreview={setPreviewFile}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {getDisplayStatus(processMsg.status) !== "Traité" && (
                          <div
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              marginTop: "1.5rem",
                              borderTop: "1px solid var(--border)",
                              paddingTop: "1.5rem",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Écrivez votre message..."
                              value={taskDescription}
                              onChange={(e) =>
                                setTaskDescription(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  taskDescription.trim() &&
                                  !isSubmitting
                                )
                                  handleCreateTask();
                              }}
                              style={{
                                flex: 1,
                                padding: "0.75rem 1.25rem",
                                borderRadius: "24px",
                                border: "1px solid var(--border)",
                                outline: "none",
                                background: "#FFF",
                                fontSize: "0.95rem",
                              }}
                              disabled={isSubmitting}
                            />
                            <button
                              type="button"
                              onClick={handleCreateTask}
                              disabled={isSubmitting || !taskDescription.trim()}
                              style={{
                                background: "var(--primary)",
                                color: "#FFF",
                                border: "none",
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                opacity:
                                  isSubmitting || !taskDescription.trim()
                                    ? 0.5
                                    : 1,
                              }}
                              title="Envoyer"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          color: "var(--text-main)",
                          fontSize: "0.9rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {processMsg.description ||
                          processMsg.bodyText ||
                          (() => {
                            if (tab === "recrutement")
                              return extractBlockFromHtml(
                                processMsg.bodyHtml,
                                "Message / Motivations",
                              );
                            if (tab === "contact")
                              return extractBlockFromHtml(
                                processMsg.bodyHtml,
                                "Description du besoin",
                              );
                            return null;
                          })()}

                        {!processMsg.description &&
                          !processMsg.bodyText &&
                          tab !== "recrutement" &&
                          tab !== "contact" &&
                          processMsg.bodyHtml && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: processMsg.bodyHtml,
                              }}
                            />
                          )}
                        {!processMsg.description &&
                          !processMsg.bodyText &&
                          !extractBlockFromHtml(
                            processMsg.bodyHtml,
                            "Message / Motivations",
                          ) &&
                          !extractBlockFromHtml(
                            processMsg.bodyHtml,
                            "Description du besoin",
                          ) &&
                          (!processMsg.bodyHtml ||
                            tab === "contact" ||
                            tab === "recrutement") &&
                          "Aucun contenu."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {tab !== "interne" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 4fr",
                    gap: "1.5rem",
                    marginTop: "2rem",
                  }}
                >
                  <div></div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {processMsg.dossierId && (
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = `/dossiers?open=${processMsg.dossierId}`)
                        }
                        className="btn btn-outline-success"
                        style={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Files size={16} /> Ouvrir le Dossier Lié
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowSaveConfirm(true)}
                      disabled={!hasPendingChanges}
                      style={{
                        padding: "0.7rem 2.5rem",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        background: hasPendingChanges
                          ? "var(--primary)"
                          : "#E5E7EB",
                        color: hasPendingChanges ? "#FFF" : "#9CA3AF",
                        border: "none",
                        cursor: hasPendingChanges ? "pointer" : "not-allowed",
                        transition: "all 0.2s",
                      }}
                      title={
                        hasPendingChanges
                          ? "Enregistrer les modifications"
                          : "Aucune modification en attente"
                      }
                    >
                      Enregistrer
                      {hasPendingChanges && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            background: "#FFF3",
                            borderRadius: "12px",
                            padding: "0 0.5rem",
                            fontSize: "0.75rem",
                          }}
                        >
                          {Object.keys(pendingChanges).length} modif.
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Modale de confirmation d'enregistrement */}
      {showSaveConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2100,
          }}
        >
          <div
            style={{
              background: "#FFF",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                Confirmer l'enregistrement
              </h3>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Vous allez enregistrer{" "}
                <strong>
                  {Object.keys(pendingChanges).length} modification(s)
                </strong>{" "}
                sur ce message.
              </p>
            </div>
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "var(--text-main)",
              }}
            >
              {Object.entries(pendingChanges).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.25rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                    {k === "status"
                      ? "Statut"
                      : k === "priorite"
                        ? "Priorité"
                        : k === "etiquette"
                          ? "Étiquette"
                          : k === "dateRappel"
                            ? "Date rappel"
                            : k === "noteRappel"
                              ? "Note rappel"
                              : k === "dateEntretien"
                                ? "Date entretien"
                                : k === "lienVisio"
                                  ? "Lien visio"
                                  : k}
                  </span>
                  <span style={{ fontWeight: 600 }}>{String(v)}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createTaskModal && (
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
                }}
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", color: "var(--text-main)" }}
              >
                ← Retour
              </button>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
                {tab === "interne" ? "Répondre au message" : "Nouveau Dossier"}
              </h3>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {tab === "interne" && (
                <>
                  <div>
                    <label
                      htmlFor="task-subject"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Objet de la réponse
                    </label>
                    <input
                      id="task-subject"
                      type="text"
                      value={taskSubject}
                      onChange={(e) => setTaskSubject(e.target.value)}
                      placeholder="Sujet..."
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
                      htmlFor="task-message"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="task-message"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Votre réponse..."
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
                </>
              )}

              {tab !== "interne" && (
                <div>
                  <label
                    htmlFor="task-dossier"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Dossier associé
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.5fr 2fr",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    <select
                      value={taskDossierSection}
                      onChange={(e) => {
                        setTaskDossierSection(e.target.value);
                        setTaskDossierCible("");
                      }}
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "#FFF",
                      }}
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
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>

                  {/* File upload for dossier */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.35rem",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
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
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "#F8FAFC",
                        fontSize: "0.875rem",
                      }}
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
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "#F0F9FF",
                        borderRadius: "8px",
                        border: "1px solid #BAE6FD",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "var(--primary-dark)",
                        }}
                      >
                        Inclure les pièces jointes du message :
                      </label>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {processMsg.attachment.split(",").map((att) => {
                          const fileName = att.split("/").pop();
                          return (
                            <div
                              key={att}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                  margin: 0,
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                  color: "var(--text-main)",
                                }}
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
                                  style={{ cursor: "pointer" }}
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
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "var(--primary)",
                                  display: "flex",
                                  alignItems: "center",
                                }}
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
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Pièces jointes
                  </span>
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "var(--primary)",
                        marginBottom: 0,
                      }}
                    >
                      <Files size={16} />
                      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                        {newTaskFile
                          ? newTaskFile.name
                          : "Joindre un fichier..."}
                      </span>
                      <input
                        type="file"
                        style={{ display: "none" }}
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
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
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

      {/* Delete Confirmation Modal */}
      {deleteMsg && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "1rem",
                color: "var(--text-main)",
                fontSize: "1.25rem",
              }}
            >
              Confirmer la suppression
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Êtes-vous sûr de vouloir supprimer le message de{" "}
              <strong>{deleteMsg.nomPrenom}</strong> ?<br />
              <br />
              Cette action est irréversible.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteMsg(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: "#DC2626", borderColor: "#DC2626" }}
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Confirmation Modal */}
      {assignMsg && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "1rem",
                color: "var(--text-main)",
                fontSize: "1.25rem",
              }}
            >
              Mettre en copie le message
            </h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Sélectionner le destinataire :
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "#FFF",
                }}
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
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
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
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              fontWeight: "bold",
              fontSize: "1.1rem",
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
