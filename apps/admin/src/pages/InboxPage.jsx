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
import {
  MESSAGE_STATUS_CONFIG,
  MESSAGE_TRANSITIONS_FRONTEND,
  DEFINITIVE_MESSAGE_STATUSES,
  getMessageStatusLabel,
} from "../utils/constants";
import { normalizeRole } from "../components/inbox/inboxHelpers";
import InboxMessageTable from "../components/inbox/InboxMessageTable";
import MessageDetailView from "../components/inbox/MessageDetailView";
import MessageCreateTaskModal from "../components/inbox/MessageCreateTaskModal";
import AssignMessageModal from "../components/inbox/AssignMessageModal";

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
        const filteredMsgs = rawMsgs.filter((m) => {
          const nom = (m.nomPrenom || m.nom || "").trim().toUpperCase();
          return !nom.includes("MENUA CONSULTING");
        });
        const sortedMsgs = [...filteredMsgs].sort(
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
      if (field === "status" && DEFINITIVE_MESSAGE_STATUSES.includes(value)) {
        // Un statut définitif interdit la priorité Urgente
        const curPrio = (next.priorite !== undefined ? next.priorite : processMsg?.priorite || "").trim().toUpperCase();
        if (curPrio === "URGENT" || curPrio === "URGENTE") {
          next.priorite = "Normal";
        }
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

  const renderStatusDropdown = (msg, currentTab, isInline = false) => (
    <MessageStatusDropdown
      msg={msg}
      currentTab={currentTab}
      isInline={isInline}
      pendingChanges={pendingChanges}
      currentUser={currentUser}
      userRole={userRole}
      handleStatusWithModal={handleStatusWithModal}
    />
  );

  return (
    <div style={{ padding: "0 1rem" }}>
      {!isAnyModalOpen && (
        <InboxMessageTable
          tab={tab}
          handleTabChange={handleTabChange}
          userRole={userRole}
          normalizeRole={normalizeRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterTraite={filterTraite}
          setFilterTraite={setFilterTraite}
          limit={limit}
          setLimit={setLimit}
          isSyncing={isSyncing}
          handleSyncEmails={handleSyncEmails}
          showToast={showToast}
          setPendingChanges={setPendingChanges}
          setShowSaveConfirm={setShowSaveConfirm}
          messages={messages}
          loading={loading}
          t={t}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          users={users}
          currentUser={currentUser}
          setProcessMsg={setProcessMsg}
          handleDeleteMessage={handleDeleteMessage}
          fetchMessages={fetchMessages}
        />
      )}

      {/* Message Detail View */}
      {processMsg &&
        !createTaskModal &&
        !showActionChoiceModal &&
        !showTraitePopup && (
          <MessageDetailView
            processMsg={processMsg}
            setProcessMsg={setProcessMsg}
            tab={tab}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            hasPendingChanges={hasPendingChanges}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            setPendingChange={setPendingChange}
            setShowSaveConfirm={setShowSaveConfirm}
            showRappelBanner={showRappelBanner}
            setShowRappelBanner={setShowRappelBanner}
            getVerifaliaBadge={getVerifaliaBadge}
            renderStatusDropdown={renderStatusDropdown}
            currentUser={currentUser}
            userRole={userRole}
            users={users}
            conversationMessages={conversationMessages}
            setPreviewFile={setPreviewFile}
          />
        )}

      {/* Create Task Modal */}
      <MessageCreateTaskModal
        createTaskModal={createTaskModal}
        setCreateTaskModal={setCreateTaskModal}
        tab={tab}
        taskSubject={taskSubject}
        setTaskSubject={setTaskSubject}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskDossierSection={taskDossierSection}
        setTaskDossierSection={setTaskDossierSection}
        taskDossierCible={taskDossierCible}
        setTaskDossierCible={setTaskDossierCible}
        taskNewDossierName={taskNewDossierName}
        setTaskNewDossierName={setTaskNewDossierName}
        newTaskFile={newTaskFile}
        setNewTaskFile={setNewTaskFile}
        dossierFile={dossierFile}
        setDossierFile={setDossierFile}
        selectedMsgDocs={selectedMsgDocs}
        setSelectedMsgDocs={setSelectedMsgDocs}
        isSubmitting={isSubmitting}
        handleCreateTask={handleCreateTask}
        processMsg={processMsg}
        users={users}
        clients={clients}
        setPreviewFile={setPreviewFile}
      />

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />



      {/* Assign Confirmation Modal */}
      <AssignMessageModal
        assignMsg={assignMsg}
        setAssignMsg={setAssignMsg}
        selectedAssignee={selectedAssignee}
        setSelectedAssignee={setSelectedAssignee}
        users={users}
        isSubmitting={isSubmitting}
        handleAssignSubmit={handleAssignSubmit}
      />

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
