import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  MoreVertical,
  Pencil,
  Eye,
  Trash,
  MessageSquare,
  Paperclip,
  FileText,
  Download,
  Plus,
  X,
  Folder,
  ChevronRight,
  ChevronDown,
  CheckSquare,
  Square,
  Link as LinkIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getSafeApiUrl, uploadFile, formatDate, getDeadlineEvaluation } from "../utils/helpers";
import ConfirmModal from "../components/ConfirmModal";
import ActionDropdown from "../components/ActionDropdown";
import { getStatusBadge } from "../utils/helpers";
import PaginationControls from "../components/PaginationControls";
import ReadOnlyField from "../components/ReadOnlyField";
import TaskConsultModal from "../components/TaskConsultModal";
import FilePreviewModal from "../components/FilePreviewModal";
import GedExplorer, { flattenFolderIds } from "../components/GedExplorer";

const DOSSIER_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente",
  TERMINE: "Terminé",
  CLOTURE: "Clôturé",
  ARCHIVE: "Archivé",
  BLOQUE: "Bloqué"
};
const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const selectedOption = options.find((opt) => opt.value === value);
        if (selectedOption) setSearchTerm(selectedOption.label);
        else setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm(""); // clear to show all options on focus
        }}
        className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
      />
      {isOpen && (
        <div
          className="absolute" style={{top:"100%",zIndex:1000,background:"#FFF",border:"1px solid var(--border)",borderRadius:"8px",marginTop:"0.25rem",maxHeight:"200px",overflowY:"auto",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className="cursor-pointer" style={{padding:"0.75rem",borderBottom:"1px solid #f1f5f9"}}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setSearchTerm(opt.label);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FFF")
                }
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div style={{ padding: "0.75rem", color: "var(--text-muted)" }}>
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DossiersPage = () => {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultDossier, setConsultDossier] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });
  const [editDossier, setEditDossier] = useState(null);
  const [localConsultTask, setLocalConsultTask] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOrigine, setFilterOrigine] = useState("all");
  const [pendingStatus, setPendingStatus] = useState("");
  const [confirmingStatus, setConfirmingStatus] = useState(null);
  const [confirmingDossierId, setConfirmingDossierId] = useState(null);

  // Mission Creation State
  const [createMissionModal, setCreateMissionModal] = useState(false);
  const [missionSubject, setMissionSubject] = useState("");
  const [missionAssignedTo, setMissionAssignedTo] = useState("");
  const [missionEcheance, setMissionEcheance] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionFile, setMissionFile] = useState(null);
  const [selectedDossierDocs, setSelectedDossierDocs] = useState([]);
  const [missionDossierId, setMissionDossierId] = useState("");
  const [authorizedDossierIds, setAuthorizedDossierIds] = useState([]);
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);
  const [operationalTree, setOperationalTree] = useState(null);

  // Magic Link State
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [magicType, setMagicType] = useState("ACQUISITION");
  const [magicExpires, setMagicExpires] = useState("7");
  const [magicNote, setMagicNote] = useState("");
  const [generatedMagicUrl, setGeneratedMagicUrl] = useState("");
  const [generatedMagicLinkId, setGeneratedMagicLinkId] = useState(null);
  const magicFileInputRef = useRef(null);
  const [isGeneratingMagic, setIsGeneratingMagic] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [magicFiles, setMagicFiles] = useState([]); // fichiers à joindre pour LIVRAISON
  const [magicEmailRecipient, setMagicEmailRecipient] = useState("");
  const [magicEmailSending, setMagicEmailSending] = useState(false);
  const [magicEmailSent, setMagicEmailSent] = useState(false);
  const [magicLinkCopied, setMagicLinkCopied] = useState(false);

  useEffect(() => {
    if (createMissionModal && consultDossier) {
      const fetchTree = async () => {
        try {
          const token = sessionStorage.getItem("adminToken");
          const operationalDossier = consultDossier.subDossiers?.find(
            (d) => d.name === "OPÉRATIONS & RÉALISATIONS",
          );
          if (operationalDossier) {
            const res = await fetch(
              getSafeApiUrl(`/api/crm/dossiers/${operationalDossier.id}/tree`),
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (res.ok) {
              const data = await res.json();
              setOperationalTree(data);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchTree();
    } else {
      setOperationalTree(null);
    }
  }, [createMissionModal, consultDossier]);

  // Dossier Creation State
  const [showCreateDossierModal, setShowCreateDossierModal] = useState(false);
  const [newDossierData, setNewDossierData] = useState({
    name: "",
    description: "",
    priority: "NORMAL",
    origin: "",
    parentDossierId: "",
    targetId: "",
    generalName: "",
    traitantId: "",
  });
  const [isSubmittingDossier, setIsSubmittingDossier] = useState(false);

  const menuRef = useRef(null);

  // States for real API data
  const [dbDossiers, setDbDossiers] = useState([]);
  const [dbTasks, setDbTasks] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [dbClients, setDbClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const currentUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");

  const fetchDossiers = useCallback(async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("adminToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const urlDossiers = new URL(getSafeApiUrl("/api/crm/dossiers"));
    urlDossiers.searchParams.set("page", page.toString());
    urlDossiers.searchParams.set("limit", "15");
    urlDossiers.searchParams.set("rootOnly", "true");
    if (searchQuery.trim()) urlDossiers.searchParams.set("search", searchQuery.trim());
    if (filterStatus && filterStatus !== "all") urlDossiers.searchParams.set("status", filterStatus);
    if (filterOrigine && filterOrigine !== "all") urlDossiers.searchParams.set("origin", filterOrigine);

    const urlTasks = new URL(getSafeApiUrl("/api/crm/tasks"));
    urlTasks.searchParams.set("page", "1");
    urlTasks.searchParams.set("limit", "1000");

    try {
      const [dossiersRes, tasksRes, usersRes, clientsRes] = await Promise.all([
        fetch(urlDossiers.toString(), { headers })
          .then((res) => res.json())
          .catch(() => ({ data: [], totalPages: 1 })),
        fetch(urlTasks.toString(), { headers })
          .then((res) => res.json())
          .catch(() => ({ data: [] })),
        dbUsers.length === 0
          ? fetch(getSafeApiUrl("/api/crm/users"), { headers })
              .then((res) => res.json())
              .catch(() => [])
          : Promise.resolve(dbUsers),
        dbClients.length === 0
          ? fetch(getSafeApiUrl("/api/crm/clients"), { headers })
              .then((res) => res.json())
              .catch(() => [])
          : Promise.resolve(dbClients),
      ]);

      setDbDossiers(
        dossiersRes?.data || (Array.isArray(dossiersRes) ? dossiersRes : [])
      );
      setTotalPages(dossiersRes?.totalPages || 1);
      setDbTasks(tasksRes?.data || (Array.isArray(tasksRes) ? tasksRes : []));
      if (dbUsers.length === 0) setDbUsers(Array.isArray(usersRes) ? usersRes : []);
      if (dbClients.length === 0) setDbClients(Array.isArray(clientsRes) ? clientsRes : []);
    } catch (err) {
      console.error("Erreur de récupération des dossiers :", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, filterStatus, filterOrigine, dbUsers.length, dbClients.length]);

  useEffect(() => {
    if (consultDossier && dbDossiers.length > 0) {
      const updated = dbDossiers.find((d) => d.id === consultDossier.id);
      if (
        updated &&
        (updated.status !== consultDossier.status ||
          updated.updatedAt !== consultDossier.updatedAt ||
          updated.name !== consultDossier.name)
      ) {
        setConsultDossier((prev) => ({
          ...prev,
          ...updated,
          _editing: prev?._editing,
        }));
      }
    }
  }, [dbDossiers, consultDossier?.id, consultDossier?.status, consultDossier?.updatedAt, consultDossier?.name]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus, filterOrigine]);

  useEffect(() => {
    fetchDossiers();
  }, [fetchDossiers]);

  const fetchDossiersRef = useRef(fetchDossiers);
  fetchDossiersRef.current = fetchDossiers;

  useEffect(() => {
    let activeSocket = null;
    const handleUpdate = () => {
      fetchDossiersRef.current();
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

  const handleCreateMission = async () => {
    if (!missionSubject) {
      window.customAlert("L'objet de la mission est requis.");
      return;
    }
    const targetMissionDossierId = missionDossierId || consultDossier?.id;
    if (!targetMissionDossierId) {
      window.customAlert("Veuillez sélectionner un dossier mission.");
      return;
    }
    if (!missionAssignedTo) {
      window.customAlert("Veuillez sélectionner un responsable à assigner.");
      return;
    }
    if (!missionEcheance) {
      window.customAlert("L'échéance est requise.");
      return;
    }
    if (!missionDescription || !missionDescription.trim()) {
      window.customAlert("Le message / consignes est requis.");
      return;
    }

    setIsSubmittingMission(true);
    const token = sessionStorage.getItem("adminToken");

    try {
      // 1. Upload file if any
      let attachmentFilename = null;
      if (missionFile) {
        attachmentFilename = await uploadFile(missionFile, "missions");
      }

      const res = await fetch(getSafeApiUrl("/api/crm/tasks"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: `${missionSubject}\n\n${missionDescription}`,
          assignedToId: missionAssignedTo,
          dossierId: consultDossier.id,
          echeance: missionEcheance,
          attachment: attachmentFilename,
          dossierMissionId: targetMissionDossierId || null,
          authorizedDossierIds: authorizedDossierIds,
        }),
      });

      if (res.ok) {
        const missionData = await res.json();
        // 2. If file was uploaded, register it as a Document linked to this mission
        if (attachmentFilename) {
          await fetch(getSafeApiUrl("/api/crm/documents"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: missionFile.name,
              filename: attachmentFilename,
              bucket: "missions",
              missionId: missionData.id,
            }),
          });
        }

        // 3. Link selected dossier documents
        if (selectedDossierDocs.length > 0 && consultDossier.documents) {
          for (const docId of selectedDossierDocs) {
            const d = consultDossier.documents.find((x) => x.id === docId);
            if (d && d.url) {
              const parts = d.url.split("/");
              if (parts.length >= 2) {
                const b = parts.shift();
                const fn = parts.join("/");
                await fetch(getSafeApiUrl("/api/crm/documents"), {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: d.name,
                    filename: fn,
                    bucket: b,
                    missionId: missionData.id,
                  }),
                });
              }
            }
          }
        }

        window.customAlert("Mission créée avec succès !");
        setCreateMissionModal(false);
        setMissionSubject("");
        setMissionDescription("");
        setMissionAssignedTo("");
        setMissionEcheance("");
        setMissionFile(null);
        setSelectedDossierDocs([]);
        setMissionDossierId("");
        setAuthorizedDossierIds([]);
        fetchDossiers();
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert(
          "Erreur lors de la création de la mission : " +
            (errData.error || res.status),
        );
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmittingMission(false);
    }
  };

  const handleGenerateMagicLink = async () => {
    setIsGeneratingMagic(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";

      // 1. Si LIVRAISON : uploader les fichiers dans la GED du dossier principal via S3
      const attachedDocumentIds = [];
      if (magicType === "LIVRAISON" && magicFiles.length > 0) {
        for (const file of magicFiles) {
          const formData = new FormData();
          formData.append("bucket", "ged");
          formData.append("dossierId", consultDossier.id);
          formData.append("name", file.name);
          formData.append("file", file);
          const uploadRes = await fetch(
            getSafeApiUrl("/api/files/upload-and-attach"),
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            },
          );
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.document?.id) {
              attachedDocumentIds.push(uploadData.document.id);
            }
          } else {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.error || `Erreur d'upload pour le fichier ${file.name}`);
          }
        }
      }

      // 2. Générer le lien magique
      const res = await fetch(getSafeApiUrl("/api/magic/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dossierId: consultDossier.id,
          type: magicType,
          expiresInDays: parseInt(magicExpires, 10),
          note: magicNote.trim() || null,
          attachedDocumentIds:
            magicType === "LIVRAISON" && attachedDocumentIds.length > 0
              ? attachedDocumentIds
              : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const magicUrl = `${window.location.origin}/magic-drop/${data.data.token}`;
        setGeneratedMagicUrl(magicUrl);
        setGeneratedMagicLinkId(data.data.id);
        const defaultEmail =
          consultDossier?.client?.email ||
          dbClients.find((c) => c.id === consultDossier?.clientId)?.email ||
          consultDossier?.targetUser?.email ||
          dbUsers.find((u) => u.id === consultDossier?.targetUserId)?.email ||
          "";
        setMagicEmailRecipient(defaultEmail);
        setMagicEmailSent(false);
        setMagicLinkCopied(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert(errData.error || "Erreur lors de la génération du lien.");
      }
    } catch (err) {
      console.error("Erreur génération lien magique:", err);
      window.customAlert(err.message || "Erreur réseau");
    } finally {
      setIsGeneratingMagic(false);
    }
  };

  const handleSendMagicEmail = async () => {
    if (!magicEmailRecipient.trim() || !generatedMagicLinkId) {
      window.customAlert("Veuillez renseigner une adresse email valide.");
      return;
    }
    setMagicEmailSending(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";
      const res = await fetch(
        getSafeApiUrl(`/api/magic/send-email/${generatedMagicLinkId}`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipientEmail: magicEmailRecipient.trim(),
            magicUrl: generatedMagicUrl,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMagicEmailSent(true);
      } else {
        window.customAlert(
          data.error || "Une erreur est survenue lors de l'envoi de l'email.",
        );
      }
    } catch (err) {
      console.error("Erreur envoi email:", err);
      window.customAlert(
        err.message || "Erreur réseau lors de l'envoi de l'email.",
      );
    } finally {
      setMagicEmailSending(false);
    }
  };

  const handleCreateDossier = async (e) => {
    e.preventDefault();
    if (!newDossierData.origin) {
      window.customAlert(
        "Veuillez sélectionner une Origine (Client ou Collaborateur).",
      );
      return;
    }
    if (
      !newDossierData.targetId &&
      (newDossierData.origin === "CLIENT" ||
        newDossierData.origin === "COLLABORATEUR")
    ) {
      window.customAlert(
        `Veuillez sélectionner la Cible (${newDossierData.origin === "CLIENT" ? "Client" : "Collaborateur"}).`,
      );
      return;
    }
    if (
      newDossierData.origin === "GENERAL" &&
      !newDossierData.generalName?.trim()
    ) {
      window.customAlert("Veuillez saisir un nom pour ce dossier.");
      return;
    }

    let targetName = "";
    if (newDossierData.origin === "CLIENT") {
      const client = dbClients.find((c) => c.id === newDossierData.targetId);
      targetName = client ? client.name.replace(/\s+/g, "_") : "INCONNU";
    } else if (newDossierData.origin === "COLLABORATEUR") {
      const user = dbUsers.find((u) => u.id === newDossierData.targetId);
      targetName = user ? user.name.replace(/\s+/g, "_") : "INCONNU";
    } else if (newDossierData.origin === "GENERAL") {
      targetName = newDossierData.generalName.replace(/\s+/g, "_");
    }

    const generatedName = targetName.toLowerCase();

    setIsSubmittingDossier(true);
    const token = sessionStorage.getItem("adminToken");

    try {
      const payload = {
        name: generatedName,
        description: newDossierData.description,
        priority: newDossierData.priority,
        origin: newDossierData.origin,
        parentDossierId: newDossierData.parentDossierId || null,
        traitantId: newDossierData.traitantId || null,
      };

      if (newDossierData.origin === "CLIENT" && newDossierData.targetId) {
        payload.clientId = newDossierData.targetId;
      } else if (
        newDossierData.origin === "COLLABORATEUR" &&
        newDossierData.targetId
      ) {
        payload.targetUserId = newDossierData.targetId;
      }
      // GENERAL origin: no clientId or targetUserId needed

      const res = await fetch(getSafeApiUrl("/api/crm/dossiers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.customAlert("Dossier créé avec succès !");
        setShowCreateDossierModal(false);
        setNewDossierData({
          name: "",
          description: "",
          priority: "NORMAL",
          origin: "",
          parentDossierId: "",
          targetId: "",
          generalName: "",
          traitantId: "",
        });
        fetchDossiers();
      } else {
        const errData = await res.json();
        window.customAlert(
          "Erreur: " + (errData.error || "Création impossible"),
        );
      }
    } catch (err) {
      console.error(err);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmittingDossier(false);
    }
  };

  const handleStatusAction = async (dossierId, newStatus) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${dossierId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        if (consultDossier && consultDossier.id === dossierId) {
          setConsultDossier({ ...consultDossier, status: newStatus });
          setPendingStatus("");
        }
        if (editDossier && editDossier.id === dossierId) {
          setEditDossier({ ...editDossier, status: newStatus });
        }
        fetchDossiers();
      } else {
        const errData = await res.json();
        window.customAlert(
          "Erreur : " + (errData.error || "Action impossible"),
        );
      }
    } catch (err) {
      console.error(err);
      window.customAlert("Erreur réseau lors de la modification du statut.");
    }
  };

  const handleUpdateDossier = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const payload = {
        name: editDossier.name,
        description: editDossier.description,
        status: editDossier.status,
        traitantId: editDossier.traitantId,
      };
      const res = await fetch(
        getSafeApiUrl(`/api/crm/dossiers/${editDossier.id}`),
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
        window.customAlert("Dossier modifié avec succès !");
        setEditDossier(null);
        fetchDossiers();
      } else {
        const errData = await res.json();
        window.customAlert(
          "Erreur lors de la modification: " +
            (errData.error || "Impossible de sauvegarder"),
        );
      }
    } catch (err) {
      console.error(err);
      window.customAlert("Erreur réseau lors de la modification.");
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
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteDossier = async (dossier) => {
    if (isDeleting) return;
    const message = `Êtes-vous sûr de vouloir supprimer le dossier "${dossier.name}" ?\n\nATTENTION : Cette action supprimera également, de façon hiérarchique, toutes les missions, les tâches et l'arborescence GED (fichiers) associées à ce dossier vers la corbeille.`;
    if (!(await window.customConfirm(message, "Avertissement de suppression en cascade"))) {
      return;
    }
    setIsDeleting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        getSafeApiUrl(`/api/crm/dossiers/${dossier.id}`),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        fetchDossiers();
        if (consultDossier?.id === dossier.id) setConsultDossier(null);
      } else {
        const err = await res.json();
        window.customAlert(
          "Erreur : " + (err.error || "Suppression impossible"),
        );
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau.");
    } finally {
      setIsDeleting(false);
    }
  };
  /**
   * getAllowedDossierStatuses — Matrice de transition dossier par rôle
   */
  const getAllowedDossierStatuses = (dossier, currentUser) => {
    const currentStatus = dossier?.status || "NOUVEAU";
    const role = currentUser?.role?.name || currentUser?.role || "";
    const isSuperAdmin =
      role === "Super-administrateur" || role === "Administrateur" || currentUser?.id === "MASTER-ADMIN";
    const isResp = role === "Responsable opérationnel" || isSuperAdmin;
    const isAssigned =
      dossier?.traitantId === currentUser?.id ||
      dossier?.traitant?.id === currentUser?.id ||
      dossier?.createdById === currentUser?.id;
    const canManageDossier = isSuperAdmin || isResp || isAssigned;

    const ALL_LABELS = {
      NOUVEAU: "Nouveau",
      EN_COURS: "En cours",
      EN_ATTENTE: "En attente",
      TERMINE: "Terminé",
      CLOTURE: "Clôturé",
      ARCHIVE: "Archivé",
      BLOQUE: "Bloqué",
    };
    const make = (vals) =>
      vals.map((v) => ({ value: v, label: ALL_LABELS[v] || v }));
    const withCurrent = (vals) => {
      const targets = vals.filter((v) => v !== currentStatus);
      return make([currentStatus, ...targets]);
    };
    const lockedOnCurrent = () => make([currentStatus]);

    if (currentStatus === "ARCHIVE") {
      return lockedOnCurrent();
    }

    if (currentStatus === "BLOQUE") {
      if (isSuperAdmin) {
        return withCurrent([dossier?.previousStatus || "EN_COURS"]);
      }
      return lockedOnCurrent();
    }

    if (currentStatus === "CLOTURE") {
      const allowed = [];
      if (canManageDossier) {
        if (dossier?.previousStatus) allowed.push(dossier.previousStatus);
        else allowed.push("EN_COURS");
        allowed.push("EN_ATTENTE");
      }
      if (isSuperAdmin) allowed.push("BLOQUE");
      if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
      return lockedOnCurrent();
    }

    if (currentStatus === "EN_ATTENTE") {
      const allowed = [];
      if (canManageDossier) {
        if (dossier?.previousStatus) allowed.push(dossier.previousStatus);
        else allowed.push("EN_COURS");
        allowed.push("CLOTURE");
      }
      if (isSuperAdmin) allowed.push("BLOQUE");
      if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
      return lockedOnCurrent();
    }

    const allowed = [];
    if (isSuperAdmin) allowed.push("BLOQUE");

    if (canManageDossier) {
      allowed.push("EN_ATTENTE", "CLOTURE");
      if (currentStatus === "NOUVEAU") {
        allowed.push("EN_COURS");
      } else if (currentStatus === "EN_COURS") {
        allowed.push("TERMINE");
      } else if (currentStatus === "TERMINE") {
        allowed.push("EN_COURS");
      }
    }

    if (currentStatus === "TERMINE") {
      if (isSuperAdmin) allowed.push("ARCHIVE");
    }

    if (allowed.length > 0) return withCurrent([...new Set(allowed)]);
    return lockedOnCurrent();
  };

  const renderWorkflowButtons = (dossier) => {
    if (!dossier) return null;
    const role = currentUser?.role?.name || currentUser?.role || "";
    const isSuperAdmin =
      role === "Super-administrateur" || role === "Administrateur" || currentUser?.id === "MASTER-ADMIN";
    const isResp = role === "Responsable opérationnel" || isSuperAdmin;
    const isAssigned =
      dossier.traitantId === currentUser?.id ||
      dossier.traitant?.id === currentUser?.id ||
      dossier.createdById === currentUser?.id;

    // Super-admin, Responsable Opérationnel et Traitant assigné peuvent agir
    if (!isSuperAdmin && !isResp && !isAssigned)
      return null;

    const options = getAllowedDossierStatuses(dossier, currentUser);
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
          title={
            isLocked
              ? dossier.status === "ARCHIVE"
                ? "Dossier archivé — état terminal"
                : "Aucune transition disponible pour votre rôle"
              : ""
          }
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
              if (await window.customConfirm(`Vous allez enregistrer 1 modification(s) sur ce dossier.\n\nStatut : ${DOSSIER_STATUS_LABELS[pendingStatus] || pendingStatus}`, "Confirmer l'enregistrement")) {
                handleStatusAction(dossier.id, pendingStatus);
              }
            }}
            className="btn btn-primary flex items-center" style={{padding:"0.4rem 0.75rem",fontSize:"0.75rem",gap:"0.25rem"}}
          >
            <CheckSquare size={14} /> Enregistrer
          </button>
        )}
      </div>
    );
  };

  const renderDossierFields = (dossier, isEdit) => (
    <>
      <div
        className="grid gap-4 mb-6" style={{gridTemplateColumns:"1fr 1fr",background:"#F8FAFC",padding:"1.25rem 1.5rem",borderRadius:"8px",border:"1px solid var(--border)"}}
      >
        {/* Colonne 1 — Identification du dossier */}
        <div
          className="flex flex-col" style={{gap:"0.85rem",borderRight:"1px solid var(--border)",paddingRight:"1rem"}}
        >
          <div
            className="font-bold" style={{fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--primary)",marginBottom:"0.25rem"}}
          >
            Identification du dossier
          </div>

          <div
            className="flex items-start gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
              Nom du dossier :
            </strong>
            {isEdit ? (
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
            ) : (
              <span
                className="font-medium text-[var(--text-main)]" style={{wordBreak:"break-word"}}
              >
                {dossier.name || "-"}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
              Origine :
            </strong>
            <span className="font-medium text-[var(--text-main)]">
              {dossier.origin || "INTERNE"}
            </span>
          </div>

          <div
            className="flex items-start gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
              Propriétaire :
            </strong>
            <span className="font-medium text-[var(--text-main)]">
              {dossier.origin === "CLIENT"
                ? dossier.client?.name ||
                  dossier.client?.companyName ||
                  dbClients.find((c) => c.id === dossier.clientId)?.name ||
                  dbClients.find((c) => c.id === dossier.clientId)
                    ?.companyName ||
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
        <div
          className="flex flex-col" style={{gap:"0.85rem",paddingLeft:"0.5rem"}}
        >
          <div
            className="font-bold" style={{fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--secondary-dark)",marginBottom:"0.25rem"}}
          >
            Gestion du dossier
          </div>

          <div
            className="flex items-center gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
              Traitant :
            </strong>
            {isEdit &&
            (currentUser?.role?.name === "Super-administrateur" ||
              currentUser?.role === "Super-administrateur" ||
              currentUser?.role?.name === "Responsable opérationnel" ||
              currentUser?.role === "Responsable opérationnel" ||
              currentUser?.id === "MASTER-ADMIN") ? (
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
                      u.role?.name === "Super-administrateur",
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

          <div
            className="flex items-center gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
              Créé par :
            </strong>
            <span className="font-medium text-[var(--text-main)]">
              {dossier.createdBy?.name || "Inconnu"}
              {dossier.createdBy?.role?.name ? (
                <span
                  style={{
                    color: "var(--text-muted)",
                    marginLeft: "0.4rem",
                    fontSize: "0.8rem",
                  }}
                >
                  ({dossier.createdBy.role.name})
                </span>
              ) : (
                ""
              )}
            </span>
          </div>

          <div
            className="flex items-center gap-2"
          >
            <strong
              className="font-semibold" style={{color:"var(--text-muted)"}}
            >
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

          {renderWorkflowButtons(isEdit ? editDossier : dossier) || (
            <div
              className="flex items-center gap-2"
            >
              <strong
                className="font-semibold" style={{color:"var(--text-muted)"}}
              >
                Statut :
              </strong>
              {isEdit ? (
                <span>
                  {getStatusBadge(editDossier?.status || dossier.status)}
                </span>
              ) : (
                <span>{getStatusBadge(dossier.status)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderAssociatedTasks = (tasks, isEdit) => (
    <div className="h-full flex flex-col">
      <h4 className="font-semibold" style={{margin:"0 0 1rem 0",fontSize:"1rem"}}>
        {isEdit
          ? "Gérer les missions associées"
          : "Vues des missions associées"}
      </h4>
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <button
              type="button"
              key={task.id}
              onClick={() => setLocalConsultTask(task)}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderColor = "var(--primary)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--primary)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
              className="flex justify-between items-center p-4 cursor-pointer w-full text-left" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)",transition:"border-color 0.2s",fontFamily:"inherit"}}
            >
              <div
                className="flex flex-col" style={{gap:"0.25rem"}}
              >
                <strong
                  className="truncate-text"
                  style={{  }}
                >
                  {task.subject || `Mission ${task.reference || task.id}`}
                </strong>
                <span className="flex items-center">
                  {getStatusBadge(task.status)}
                </span>
              </div>
              {isEdit && (
                <div
                  className="flex items-center gap-4"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.customAlert(
                        `Mission ${task.id} supprimée avec succès !`,
                      );
                    }}
                    className="cursor-pointer" style={{background:"none",border:"none",color:"var(--danger)"}}
                    title="Supprimer la mission"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="p-4 text-center" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px dashed var(--border)",color:"var(--text-muted)"}}
        >
          Aucune mission associée pour le moment.
        </div>
      )}
    </div>
  );

  const renderDocuments = (documents, label = "Documents attachés") => (
    <div
      className="mt-4" style={{borderTop:"1px solid var(--border)",paddingTop:"1.5rem"}}
    >
      <h4
        className="font-semibold flex items-center gap-2" style={{margin:"0 0 1rem 0",fontSize:"1rem"}}
      >
        <Paperclip size={16} /> {label}
      </h4>
      {documents && documents.length > 0 ? (
        <select
          onChange={(e) => {
            if (e.target.value) {
              setPreviewFile(e.target.value);
              e.target.selectedIndex = 0;
            }
          }}
          className="input-field w-full cursor-pointer" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",fontFamily:"inherit"}}
        >
          <option value="">
            -- Sélectionner un document pour le consulter --
          </option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.url}>
              {doc.name}
            </option>
          ))}
        </select>
      ) : (
        <div
          className="p-4 text-center" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px dashed var(--border)",color:"var(--text-muted)"}}
        >
          Aucun document attaché.
        </div>
      )}
    </div>
  );

  if (consultDossier) {
    const associatedTasks = dbTasks.filter(
      (t) => t.dossierId === consultDossier.id,
    );
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
    const canEdit =
      (isSuperAdmin || isResp || isAssigned) && !isLocked;

    // isEditingConsult est géré via un objet temporaire dans consultDossier._editing
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
        const res = await fetch(
          getSafeApiUrl(`/api/crm/dossiers/${consultDossier.id}`),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              description: consultDossier.description,
              traitantId: consultDossier.traitantId || null,
            }),
          },
        );
        if (res.ok) {
          setConsultDossier({ ...consultDossier, _editing: false });
          fetchDossiers();
          window.customAlert("Dossier mis à jour !");
        } else {
          const err = await res.json().catch(() => ({}));
          window.customAlert(
            "Erreur : " + (err.error || "Impossible de sauvegarder"),
          );
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

    const creatorName =
      consultDossier.createdBy?.name
        ? `${consultDossier.createdBy.name}${consultDossier.createdBy.role?.name ? ` (${consultDossier.createdBy.role.name})` : ""}`
        : "Inconnu";

    const traitantName =
      consultDossier.traitant?.name ||
      dbUsers.find((u) => u.id === consultDossier.traitantId)?.name ||
      "Aucun";

    const createdAtFormatted = new Date(consultDossier.createdAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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
      ([st, cnt]) => `${cnt} mission${cnt > 1 ? "s" : ""} en statut ${statusNameMap[st] || st}`
    );
    const breakdownString =
      breakdownList.length > 0
        ? breakdownList.join(", ") + "."
        : "Aucune mission active.";

    const roleName = currentUser?.role?.name || currentUser?.role || "";
    const canChangeStatus = isSuperAdmin || isResp || isAssigned;
    const statusOptions = getAllowedDossierStatuses(consultDossier, currentUser);
    const isStatusLocked = !canChangeStatus || statusOptions.length === 1;

    const renderDossierPillBadge = (status) => {
      const s = String(status || "NOUVEAU").toUpperCase();
      const map = {
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

    const getTaskSubject = (desc) => {
      if (!desc) return "";
      const match = desc.match(/\[OBJET\]:\s*(.*?)(?=\n\[|$)/);
      return match ? match[1].trim() : desc.split("\n")[0];
    };

    return (
      <div className="fade-in w-full" style={{padding:"0"}}>
        {/* Header Card conforming to Screenshot 1 */}
        <div
          className="flex justify-between items-center mb-6 flex-wrap gap-4" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
        >
          {/* Left info with folder icon */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center" style={{width:"48px",height:"48px",borderRadius:"10px",background:"#EFF6FF",border:"1px solid #DBEAFE"}}
            >
              <Folder size={24} color="#2563EB" fill="#2563EB" />
            </div>
            <div>
              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                <h2
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}
                >
                  Consultation du dossier : {consultDossier.reference || consultDossier.id}
                </h2>
                {renderDossierPillBadge(consultDossier.status)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#64748B",
                  marginTop: "0.25rem",
                }}
              >
                Nom : {consultDossier.name || "-"} • Origine : {consultDossier.origin || "GÉNÉRAL"} • Créé le {createdAtFormatted} par {creatorName}
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
            {!["TERMINE", "ARCHIVE", "BLOQUE", "EN_ATTENTE"].includes(consultDossier.status) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowMagicModal(true);
                    setGeneratedMagicUrl("");
                    setGeneratedMagicLinkId(null);
                    setMagicFiles([]);
                    setMagicEmailSent(false);
                    setMagicLinkCopied(false);
                    const defaultEmail =
                      consultDossier?.client?.email ||
                      dbClients.find((c) => c.id === consultDossier?.clientId)?.email ||
                      consultDossier?.targetUser?.email ||
                      dbUsers.find((u) => u.id === consultDossier?.targetUserId)?.email ||
                      "";
                    setMagicEmailRecipient(defaultEmail);
                  }}
                  className="font-medium cursor-pointer flex items-center" style={{background:"#FFF",border:"1px solid #CBD5E1",color:"#334155",padding:"0.55rem 1rem",borderRadius:"8px",fontSize:"0.85rem",gap:"0.4rem"}}
                >
                  Générer Lien Magique
                </button>

                {(isSuperAdmin || isResp || isAssigned) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCreateMissionModal(true);
                      setMissionDossierId(consultDossier.id);
                    }}
                    className="text-white font-semibold cursor-pointer flex items-center" style={{background:"#1E3A8A",border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem",gap:"0.4rem"}}
                  >
                    + Créer une mission
                  </button>
                )}
              </>
            )}


            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="font-semibold cursor-pointer" style={{background:"#FFF",border:"1px solid #CBD5E1",color:"#475569",padding:"0.55rem 1rem",borderRadius:"8px",fontSize:"0.85rem"}}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="text-white font-semibold cursor-pointer" style={{background:"#1E3A8A",border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem"}}
                >
                  Enregistrer
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setConsultDossier(null);
                setPendingStatus("");
              }}
              className="text-white font-semibold cursor-pointer" style={{background:"var(--text-main)",border:"none",padding:"0.55rem 1.1rem",borderRadius:"8px",fontSize:"0.85rem"}}
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Two-Column Grid Conforming to Screenshot 1 */}
        <div
          className="grid gap-6" style={{gridTemplateColumns:"1fr 1.1fr",alignItems:"start"}}
        >
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Card 1: IDENTIFICATION DU DOSSIER */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"1.25rem"}}
              >
                Identification du dossier
              </div>

              <div className="flex flex-col" style={{gap:"0.85rem"}}>
                {/* Nom du dossier */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Nom du dossier :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",wordBreak:"break-word"}}>
                    {consultDossier.name || "-"}
                  </div>
                </div>

                {/* Origine */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Origine :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {consultDossier.origin || "GENERAL"}
                  </div>
                </div>

                {/* Propriétaire */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
                    Propriétaire :
                  </div>
                  <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {ownerName}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: GESTION DU DOSSIER */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"1.25rem"}}
              >
                Gestion du dossier
              </div>

              <div className="flex flex-col" style={{gap:"0.85rem"}}>
                {/* Traitant */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div className="font-medium" style={{fontSize:"0.75rem",color:"#64748B",marginBottom:"0.25rem"}}>
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
                      className="w-full font-medium text-[var(--text-main)]" style={{padding:"0.45rem 0.6rem",borderRadius:"6px",border:"1px solid var(--border)",background:"#FFF",fontSize:"0.9rem",marginTop:"0.25rem"}}
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
                    <div className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {traitantName}
                    </div>
                  )}
                </div>

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
                    {creatorName}
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

                    {pendingStatus && pendingStatus !== (consultDossier.status || "NOUVEAU") && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            await window.customConfirm(
                              `Vous allez enregistrer 1 modification(s) sur ce dossier.\n\nStatut : ${pendingStatus}`,
                              "Confirmer l'enregistrement"
                            )
                          ) {
                            handleStatusAction(consultDossier.id, pendingStatus);
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
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Card 3: Description du dossier */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",marginBottom:"0.75rem"}}
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
                  className="w-full p-4 text-[var(--text-main)]" style={{background:"#FFF",borderRadius:"8px",border:"1px solid var(--primary)",minHeight:"100px",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}
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
                    className="text-[var(--text-main)] font-medium" style={{whiteSpace:"pre-wrap",fontSize:"0.9rem"}}
                  >
                    {consultDossier.description || "Aucune description enregistrée pour ce dossier."}
                  </div>
                  <div
                    className="mt-2" style={{fontSize:"0.75rem",color:"#94A3B8"}}
                  >
                    Notes et directives générales enregistrées pour ce dossier opérationnel.
                  </div>
                </div>
              )}
            </div>

            {/* Card 4: Vues des missions associées */}
            <div
              className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
            >
              <div
                className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",marginBottom:"0.2rem"}}
              >
                Vues des missions associées
              </div>
              <div
                className="mb-4" style={{fontSize:"0.75rem",color:"#94A3B8"}}
              >
                Suivi direct des missions rattachées à ce dossier
              </div>

              {associatedTasks.length > 0 ? (
                <div className="flex flex-col" style={{gap:"0.75rem"}}>
                  {associatedTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setLocalConsultTask(task)}
                      className="cursor-pointer" style={{background:"#FFF",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"0.85rem 1.1rem",transition:"all 0.2s"}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2563EB";
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(37,99,235,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="flex justify-between items-center" style={{marginBottom:"0.35rem"}}
                      >
                        <span className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                          Mission {task.reference || task.id}
                        </span>
                        {renderDossierPillBadge(task.status)}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: "0.8rem", color: "#64748B" }}>
                        <span>Objet : {getTaskSubject(task.description) || task.subject || "-"}</span>
                        <span>•</span>
                        {(() => {
                          const dl = getDeadlineEvaluation(task);
                          if (dl.status === "NONE") {
                            return <span>Créé le {new Date(task.createdAt).toLocaleDateString("fr-FR")}</span>;
                          }
                          if (dl.isCritical) {
                            return (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-red-700 bg-red-100"
                                title={dl.isOverdue ? "Échéance dépassée (en retard)" : "Échéance critique (< 24h)"}
                              >
                                <AlertTriangle size={12} style={{ color: "#DC2626" }} />
                                Échéance : {dl.label}
                              </span>
                            );
                          }
                          return (
                            <span className="font-semibold text-green-700">
                              Échéance : {dl.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="p-6 text-center" style={{background:"#F8FAFC",border:"1px dashed var(--border)",borderRadius:"8px",color:"var(--text-muted)",fontSize:"0.85rem"}}
                >
                  Aucune mission associée pour le moment.
                </div>
              )}

              {/* État d'avancement global Banner */}
              {associatedTasks.length > 0 && (
                <div
                  style={{
                    marginTop: "1.25rem",
                    background: "#F0FDF4",
                    border: "1px solid #DCFCE7",
                    borderRadius: "8px",
                    padding: "0.85rem 1.1rem",
                    color: "#166534",
                  }}
                >
                  <div
                    className="font-bold flex items-center" style={{fontSize:"0.875rem",gap:"0.4rem"}}
                  >
                    ✓ État d'avancement global : {activeTasks.length} mission{activeTasks.length > 1 ? "s" : ""} active{activeTasks.length > 1 ? "s" : ""}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#15803D", marginTop: "0.25rem" }}>
                    {breakdownString}
                  </div>
                </div>
              )}
            </div>

            {/* Attached documents if any */}
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
                  className="font-bold text-[var(--text-main)] flex items-center gap-2" style={{fontSize:"0.85rem",marginBottom:"0.75rem"}}
                >
                  <Paperclip size={15} /> Documents attachés ({consultDossier.documents.length})
                </div>
                <div className="flex flex-col gap-2">
                  {consultDossier.documents.map((doc) => (
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

        {/* Modal Magic Link */}
        {showMagicModal && (
          <div
            className="fade-in fixed inset-0 flex items-center justify-center p-4"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-h-[90vh] overflow-y-auto"
              style={{ maxWidth: generatedMagicUrl ? "500px" : "520px" }}
            >
              {!generatedMagicUrl ? (
                /* ── Image 3: Generator Modal ── */
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 m-0">
                        Générer un lien de partage client
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 mb-0">
                        Dossier rattaché : {consultDossier.reference || consultDossier.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMagicModal(false)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
                      title="Fermer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tabs: Demander des fichiers / Envoyer des fichiers */}
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
                    <button
                      type="button"
                      onClick={() => setMagicType("ACQUISITION")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        magicType === "ACQUISITION"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Demander des fichiers
                    </button>
                    <button
                      type="button"
                      onClick={() => setMagicType("LIVRAISON")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        magicType === "LIVRAISON"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Envoyer des fichiers
                    </button>
                  </div>

                  {/* Durée de validité */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                      DURÉE DE VALIDITÉ
                    </label>
                    <div className="relative">
                      <select
                        value={magicExpires}
                        onChange={(e) => setMagicExpires(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        <option value="7">7 jours (Recommandé)</option>
                        <option value="1">24 heures</option>
                        <option value="2">48 heures</option>
                        <option value="14">14 jours</option>
                        <option value="30">30 jours</option>
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Message pour le client */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                      MESSAGE POUR LE CLIENT (OPTIONNEL)
                    </label>
                    <textarea
                      value={magicNote}
                      onChange={(e) => setMagicNote(e.target.value)}
                      placeholder={
                        magicType === "ACQUISITION"
                          ? "Ex: Merci de nous transmettre vos pièces justificatives..."
                          : "Ex: Veuillez trouver ci-joint les documents préparés..."
                      }
                      rows={3}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Documents à joindre (si LIVRAISON) */}
                  {magicType === "LIVRAISON" && (
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                        DOCUMENTS À JOINDRE
                      </label>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dropped = Array.from(e.dataTransfer.files);
                          setMagicFiles((prev) => [...prev, ...dropped]);
                        }}
                        onClick={() => magicFileInputRef.current?.click()}
                        className="border-2 border-dashed border-blue-200 bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-5 text-center cursor-pointer transition-all"
                      >
                        <input
                          ref={magicFileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files);
                            setMagicFiles((prev) => [...prev, ...selected]);
                            e.target.value = "";
                          }}
                        />
                        <div className="flex justify-center mb-1 text-blue-600">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 m-0">
                          Glissez vos fichiers ici <span className="text-blue-600 hover:underline">parcourir</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1 mb-0">
                          PDF, PNG, DOCX jusqu'à 25 Mo
                        </p>
                      </div>

                      {magicFiles.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                          {magicFiles.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText size={16} className="text-slate-400 shrink-0" />
                                <span className="truncate font-medium">{f.name}</span>
                                <span className="text-slate-400 shrink-0">
                                  ({(f.size / 1024 / 1024).toFixed(1)} Mo)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMagicFiles((prev) => prev.filter((_, idx) => idx !== i));
                                }}
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                                title="Supprimer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="flex justify-end items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowMagicModal(false)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingMagic || (magicType === "LIVRAISON" && magicFiles.length === 0)}
                      onClick={handleGenerateMagicLink}
                      className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      {isGeneratingMagic && <Loader2 size={16} className="animate-spin" />}
                      {isGeneratingMagic ? "Génération..." : "Générer le lien"}
                    </button>
                  </div>
                </>
              ) : (
                /* ── Image 2: Success Modal ("Lien de partage prêt") ── */
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 m-0">
                        Lien de partage prêt
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 mb-0">
                        Actif pendant {magicExpires} jours •{" "}
                        {magicType === "LIVRAISON"
                          ? `${magicFiles.length || 1} document${(magicFiles.length || 1) > 1 ? "s" : ""} attaché${(magicFiles.length || 1) > 1 ? "s" : ""}`
                          : "Demande de fichiers client"}
                      </p>
                    </div>
                  </div>

                  {/* LIEN SÉCURISÉ GÉNÉRÉ */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                      LIEN SÉCURISÉ GÉNÉRÉ
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedMagicUrl}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 truncate font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedMagicUrl);
                          setMagicLinkCopied(true);
                          setTimeout(() => setMagicLinkCopied(false), 2000);
                        }}
                        className="px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl shrink-0 transition cursor-pointer"
                      >
                        {magicLinkCopied ? "Copié !" : "Copier"}
                      </button>
                    </div>
                  </div>

                  {/* Divider OU */}
                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                      OU
                    </span>
                  </div>

                  {/* TRANSMETTRE DIRECTEMENT PAR EMAIL */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                      TRANSMETTRE DIRECTEMENT PAR EMAIL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={magicEmailRecipient}
                        onChange={(e) => setMagicEmailRecipient(e.target.value)}
                        placeholder="client@entreprise.com"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        disabled={magicEmailSending || !magicEmailRecipient.trim()}
                        onClick={handleSendMagicEmail}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shrink-0 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {magicEmailSending && <Loader2 size={14} className="animate-spin" />}
                        {magicEmailSending ? "Envoi..." : "Envoyer"}
                      </button>
                    </div>
                    {magicEmailSent && (
                      <p className="text-xs text-emerald-600 font-medium mt-1.5 mb-0">
                        ✅ Email transmis avec succès à {magicEmailRecipient} !
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowMagicModal(false)}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {createMissionModal &&
          (() => {
            const operationalDossier = consultDossier?.subDossiers?.find(
              (d) => d.name === "OPÉRATIONS & RÉALISATIONS",
            );
            const operationalSubFolders = operationalDossier
              ? [operationalDossier, ...(operationalDossier.subDossiers || [])]
              : [];
            return (
              <div
                className="fade-in fixed inset-0 flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)",zIndex:1000}}
              >
                <div
                  className="p-8" style={{background:"#FFF",borderRadius:"8px",width:"90%",maxWidth:"800px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
                >
                  <div
                    className="flex justify-between items-center mb-6"
                  >
                    <h3
                      className="font-semibold" style={{fontSize:"1.25rem"}}
                    >
                      Nouvelle Mission
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateMissionModal(false);
                        setSelectedDossierDocs([]);
                        setMissionDossierId("");
                        setAuthorizedDossierIds([]);
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
                        className="block mb-2 font-medium"
                      >
                        Objet de la mission *
                      </label>
                      <input
                        type="text"
                        value={missionSubject}
                        onChange={(e) => setMissionSubject(e.target.value)}
                        placeholder="Sujet de la mission..."
                        className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                      />
                    </div>

                    {operationalTree && (
                      <div
                        className="flex flex-col gap-4 p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                      >
                        <div
                          className="flex flex-col" style={{gap:"2rem"}}
                        >
                          <div>
                            <label
                              className="block mb-2 font-semibold" style={{color:"var(--primary-dark)"}}
                            >
                              Dossier mission (Sélection unique) *
                            </label>
                            <div
                              style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                              <GedExplorer
                                tree={operationalTree}
                                multiSelect={false}
                                selectedId={missionDossierId}
                                onSelectId={setMissionDossierId}
                              />
                            </div>
                          </div>
                          {/* Authorized dossiers: exclude the selected mission dossier (auto-included) */}
                          {(() => {
                            const filteredTree = {
                              ...operationalTree,
                              subDossiers: (
                                operationalTree.subDossiers || []
                              ).filter((d) => d.id !== missionDossierId),
                            };
                            if (filteredTree.subDossiers.length === 0)
                              return null;
                            return (
                              <div>
                                <label
                                  className="block mb-2 font-semibold" style={{color:"var(--primary-dark)"}}
                                >
                                  Dossiers autorisés{" "}
                                  <span
                                    className="font-normal" style={{color:"var(--text-muted)",fontSize:"0.8rem"}}
                                  >
                                    (lecture seule)
                                  </span>
                                </label>
                                <div
                                  style={{
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                  }}
                                >
                                  <GedExplorer
                                    tree={filteredTree}
                                    multiSelect={true}
                                    selectedIds={authorizedDossierIds}
                                    disabledIds={
                                      missionDossierId ? [missionDossierId] : []
                                    }
                                    onToggleChildren={(child) => {
                                      const ids = flattenFolderIds(child);
                                      if (
                                        authorizedDossierIds.includes(child.id)
                                      ) {
                                        setAuthorizedDossierIds((prev) =>
                                          prev.filter(
                                            (id) => !ids.includes(id),
                                          ),
                                        );
                                      } else {
                                        setAuthorizedDossierIds((prev) =>
                                          Array.from(
                                            new Set([...prev, ...ids]),
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                {authorizedDossierIds.length > 0 &&
                                  (() => {
                                    const getNames = (folder, ids) => {
                                      let names = [];
                                      if (ids.includes(folder.id))
                                        names.push(folder.name);
                                      if (folder.subDossiers) {
                                        folder.subDossiers.forEach(
                                          (sub) =>
                                            (names = [
                                              ...names,
                                              ...getNames(sub, ids),
                                            ]),
                                        );
                                      }
                                      return names;
                                    };
                                    const selectedNames = getNames(
                                      filteredTree,
                                      authorizedDossierIds,
                                    );
                                    if (selectedNames.length === 0) return null;
                                    return (
                                      <div
                                        className="mt-2" style={{padding:"0.75rem",background:"#e0f2fe",borderRadius:"8px",border:"1px solid #bae6fd"}}
                                      >
                                        <strong
                                          className="block" style={{marginBottom:"0.25rem",color:"#0369a1"}}
                                        >
                                          Panier des dossiers autorisés :
                                        </strong>
                                        <div
                                          className="flex flex-wrap gap-2"
                                        >
                                          {selectedNames.map((name, i) => (
                                            <span
                                              key={i}
                                              className="font-medium" style={{background:"#FFF",color:"#0369a1",padding:"0.25rem 0.5rem",borderRadius:"4px",fontSize:"0.75rem",border:"1px solid #7dd3fc"}}
                                            >
                                              {name}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })()}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <div
                      className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
                    >
                      <div>
                        <label
                          className="block mb-2 font-medium"
                        >
                          Assigné à *
                        </label>
                        <select
                          value={missionAssignedTo}
                          onChange={(e) => setMissionAssignedTo(e.target.value)}
                          className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                        >
                          <option value="">Sélectionner un membre...</option>
                          {dbUsers
                            .filter(
                              (u) =>
                                u.role?.name === "Responsable opérationnel" ||
                                u.role?.name === "Super-administrateur",
                            )
                            .map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.role?.name})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className="block mb-2 font-medium"
                        >
                          Échéance *
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={missionEcheance}
                          onChange={(e) => setMissionEcheance(e.target.value)}
                          className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block mb-2 font-medium"
                      >
                        Message / Consignes *
                      </label>
                      <textarea
                        value={missionDescription}
                        onChange={(e) => setMissionDescription(e.target.value)}
                        placeholder="Détails de la mission..."
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
                        setCreateMissionModal(false);
                        setSelectedDossierDocs([]);
                        setMissionDossierId("");
                        setAuthorizedDossierIds([]);
                      }}
                      className="btn btn-outline"
                      disabled={isSubmittingMission}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateMission}
                      disabled={isSubmittingMission}
                      className="btn btn-primary"
                    >
                      {isSubmittingMission ? "Création..." : "Créer la mission"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

        <TaskConsultModal
          task={localConsultTask}
          onClose={() => setLocalConsultTask(null)}
          titlePrefix="Consulter la Mission:"
        />
      </div>
    );
  }

  if (editDossier) {
    const associatedTasks = dbTasks.filter(
      (t) => t.dossierId === editDossier.id,
    );
    return (
      <div className="fade-in w-full" style={{padding:"0"}}>
        <div
          className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
        >
          <button
            type="button"
            onClick={() => setEditDossier(null)}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
            Modifier le Dossier: {editDossier.reference || editDossier.id}
          </h2>
        </div>

        {renderDossierFields(editDossier, true)}
        <div
          className="flex mt-4 items-start" style={{gap:"2rem",borderTop:"1px solid var(--border)",paddingTop:"1.5rem"}}
        >
          <div style={{ flex: "0 0 70%" }}>
            <h4
              className="font-semibold" style={{margin:"0 0 1rem 0",fontSize:"1rem"}}
            >
              Description du dossier
            </h4>
            <textarea
              value={editDossier.description || ""}
              onChange={(e) =>
                setEditDossier({ ...editDossier, description: e.target.value })
              }
              className="input-field w-full p-6 text-[var(--text-main)]" style={{background:"#FFF",borderRadius:"8px",border:"1px solid var(--primary)",minHeight:"120px",resize:"vertical",fontFamily:"inherit"}}
              placeholder="Description du dossier..."
            />
          </div>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {renderAssociatedTasks(associatedTasks, true)}
          </div>
        </div>

        <div
          className="mt-8 flex justify-between items-center flex-wrap gap-4" style={{borderTop:"1px solid var(--border)",paddingTop:"1.5rem"}}
        >
          <div className="flex gap-4 flex-wrap">
            {renderWorkflowButtons(editDossier)}
          </div>
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setEditDossier(null)}
              className="btn btn-outline"
            >
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
  }

  return (
    <div>
      <div
        className="flex justify-between items-center mb-6 flex justify-between mb-6 items-center"
      >
        <div>
          <h1
            className="font-semibold text-[var(--text-main)]" style={{fontSize:"1.5rem"}}
          >
            Tous les Dossiers
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {t("dossier.subtitle", "Gestion complète et cycle de vie")}
          </p>
        </div>
        {(currentUser?.role === "Super-administrateur" ||
          currentUser?.role?.name === "Super-administrateur" ||
          currentUser?.role === "Responsable opérationnel" ||
          currentUser?.role?.name === "Responsable opérationnel" ||
          currentUser?.id === "MASTER-ADMIN") && (
          <button
            onClick={() => {
              setNewDossierData({
                name: "",
                description: "",
                priority: "NORMAL",
                origin: "",
                parentDossierId: "",
                targetId: "",
                generalName: "",
                traitantId: currentUser.id,
              });
              setShowCreateDossierModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> {t("dossier.new", "Nouveau Dossier")}
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-4 mb-6 p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
      >
        <div className="relative" style={{flex:"1 1 250px"}}>
          <Search
            size={18}
            className="absolute" style={{left:"1rem",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}}
          />
          <input
            type="text"
            placeholder="Rechercher par ID, Nom ou Créateur..."
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
            minWidth: "150px",
          }}
        >
          <option value="all">{t("common.status", "Statut")}: {t("common.all", "Tous")}</option>
          <option value="NOUVEAU">Nouveau</option>
          
          <option value="EN_COURS">En cours</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="TERMINE">Terminé</option>
          <option value="CLOTURE">Clôturé</option>
          <option value="ARCHIVE">Archivé</option>
          <option value="BLOQUE">Bloqué</option>

        </select>
        <select
          className="input-field"
          value={filterOrigine}
          onChange={(e) => setFilterOrigine(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "#FFF",
            minWidth: "150px",
          }}
        >
          <option value="all">{t("dossier.origin", "Origine")}: {t("common.all", "Tous")}</option>
          <option value="CLIENT">Client</option>
          <option value="COLLABORATEUR">Collaborateur (Équipe)</option>
          <option value="GENERAL">Général</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table className="w-full" style={{tableLayout:"fixed"}}>
          <thead>
            <tr>
              <th className="text-center" style={{width:"50px"}}>N°</th>
              <th className="text-left" style={{width:"28%",paddingLeft:"1.25rem"}}>{t("dossier.folderName", "Nom du dossier")}</th>
              <th className="text-center" style={{width:"120px"}}>{t("dossier.origin", "Origine")}</th>
              <th className="text-center" style={{width:"24%"}}>{t("dossier.owner", "Propriétaire")}</th>
              <th className="text-center" style={{width:"120px"}}>{t("common.status", "Statut")}</th>
              <th className="table-date-cell text-center" style={{width:"165px"}}>{t("common.createdAt", "Date de création")}</th>
              <th className="text-center" style={{width:"80px"}}>{t("common.actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-8"
                >
                  Chargement des dossiers...
                </td>
              </tr>
            ) : dbDossiers.filter((d) => !d.parentDossierId).length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-8"
                >
                  Aucun dossier principal trouvé.
                </td>
              </tr>
            ) : (
              dbDossiers
                .filter((d) => !d.parentDossierId)
                .map((d, index) => {
                  const dOrigin = d.origin || "INTERNE";
                  const dOwner =
                    d.origin === "CLIENT"
                      ? d.client?.name ||
                        d.client?.companyName ||
                        dbClients.find((c) => c.id === d.clientId)?.name ||
                        dbClients.find((c) => c.id === d.clientId)
                          ?.companyName ||
                        "Client inconnu"
                      : d.origin === "COLLABORATEUR"
                        ? d.targetUser?.name ||
                          dbUsers.find((u) => u.id === d.targetUserId)?.name ||
                          "Collaborateur inconnu"
                        : "MENUA CONSULTING (Interne)";
                  const dCreatorRole = d.createdBy?.role?.name || "-";
                  const isExpired = (dossier) => {
                    return getDeadlineEvaluation(dossier).isCritical;
                  };
                  return (
                    <tr
                      key={d.id}
                    >
                      <td className="text-center">
                        <div
                          className="truncate-name font-normal text-center" style={{maxWidth:"100%"}}
                          title={String(index + 1).padStart(2, "0")}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </td>
                      <td className="text-left" style={{paddingLeft:"1.25rem"}}>
                        <span
                          className="truncate-name text-[var(--text-main)] block" style={{maxWidth:"100%"}}
                          title={d.name}
                        >
                          {d.name}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className="truncate-name text-center" style={{color:"var(--text-muted)",textTransform:"uppercase",maxWidth:"100%",fontSize:"0.85rem"}}
                          title={dOrigin}
                        >
                          {dOrigin}
                        </div>
                      </td>
                      <td className="text-center">
                        <div
                          className="truncate-name text-center" style={{maxWidth:"100%",fontSize:"0.85rem"}}
                          title={dOwner}
                        >
                          {dOwner}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="inline-flex justify-center">
                          {getStatusBadge(d.status)}
                        </div>
                      </td>

                      <td
                        className="table-date-cell text-center" style={{color:"var(--text-muted)",fontSize:"0.85rem",width:"165px"}}
                      >
                        {new Date(d.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                        <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                          {/* Sommet de la pyramide : Modifier (même règle que l'ancien bouton « Modifier ») */}
                          {(currentUser?.role === "Super-administrateur" ||
                            currentUser?.role?.name === "Super-administrateur" ||
                            currentUser?.role === "Responsable opérationnel" ||
                            currentUser?.role?.name === "Responsable opérationnel" ||
                            currentUser?.id === "MASTER-ADMIN" ||
                            currentUser?.id === d.traitantId ||
                            currentUser?.id === d.createdById) &&
                            !["BLOQUE", "EN_ATTENTE"].includes(d.status) && (
                          <button
                            type="button"
                            onClick={() => {
                              setConsultDossier(null);
                              setEditDossier(d);
                            }}
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                            title="Modifier le dossier"
                          >
                            <Pencil size={14} />
                          </button>
                          )}
                          {/* Base de la pyramide : Consulter + Supprimer */}
                          <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setConsultDossier(d);
                              setShowMagicModal(false);
                            }}
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                            title="Consulter le dossier"
                          >
                            <Eye size={14} />
                          </button>
                          {(currentUser?.role === "Super-administrateur" ||
                            currentUser?.role?.name === "Super-administrateur" ||
                            currentUser?.id === "MASTER-ADMIN") && (
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeleteDossier(d)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", opacity: isDeleting ? 0.5 : 1 }}
                              title="Supprimer le dossier"
                            >
                              <Trash size={14} />
                            </button>
                          )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* Modal Création Dossier */}
      {showCreateDossierModal && (
        <div
          className="fade-in fixed inset-0 flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)",zIndex:1000}}
        >
          <div
            className="p-8" style={{background:"#FFF",borderRadius:"8px",width:"90%",maxWidth:"500px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
          >
            <div
              className="flex justify-between items-center mb-6"
            >
              <h3 className="font-semibold" style={{fontSize:"1.25rem"}}>
                Nouveau Dossier
              </h3>
              <button
                onClick={() => setShowCreateDossierModal(false)}
                className="cursor-pointer" style={{background:"none",border:"none",color:"var(--text-muted)"}}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDossier}>
              <div
                className="flex flex-col gap-6"
              >
                {/* BLOC 1: ORIGINE ET CIBLE */}
                <div
                  className="p-6" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                >
                  <label
                    className="block mb-4 font-semibold" style={{fontSize:"0.95rem",color:"var(--primary-dark)"}}
                  >
                    1. Type de dossier (Origine) *
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      marginBottom: newDossierData.origin ? "1.5rem" : "0",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setNewDossierData({
                          ...newDossierData,
                          origin: "CLIENT",
                          targetId: "",
                        })
                      }
                      style={{
                        padding: "1rem 0.5rem",
                        borderRadius: "8px",
                        position: "relative",
                        border:
                          newDossierData.origin === "CLIENT"
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        background:
                          newDossierData.origin === "CLIENT"
                            ? "#e0f2fe"
                            : "#FFF",
                        color:
                          newDossierData.origin === "CLIENT"
                            ? "var(--primary-dark)"
                            : "var(--text-main)",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        fontSize: "0.85rem",
                        textAlign: "center",
                      }}
                    >
                      {newDossierData.origin === "CLIENT" && (
                        <div
                          className="absolute text-white flex items-center justify-center font-bold" style={{top:"8px",right:"8px",background:"#1e3a8a",borderRadius:"50%",width:"18px",height:"18px",fontSize:"11px"}}
                        >
                          ✓
                        </div>
                      )}
                      <span style={{ fontSize: "1.5rem" }}>🏢</span>
                      Dossier Client
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewDossierData({
                          ...newDossierData,
                          origin: "COLLABORATEUR",
                          targetId: "",
                        })
                      }
                      style={{
                        padding: "1rem 0.5rem",
                        borderRadius: "8px",
                        position: "relative",
                        border:
                          newDossierData.origin === "COLLABORATEUR"
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        background:
                          newDossierData.origin === "COLLABORATEUR"
                            ? "#e0f2fe"
                            : "#FFF",
                        color:
                          newDossierData.origin === "COLLABORATEUR"
                            ? "var(--primary-dark)"
                            : "var(--text-main)",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        fontSize: "0.85rem",
                        textAlign: "center",
                      }}
                    >
                      {newDossierData.origin === "COLLABORATEUR" && (
                        <div
                          className="absolute text-white flex items-center justify-center font-bold" style={{top:"8px",right:"8px",background:"#1e3a8a",borderRadius:"50%",width:"18px",height:"18px",fontSize:"11px"}}
                        >
                          ✓
                        </div>
                      )}
                      <span style={{ fontSize: "1.5rem" }}>👥</span>
                      Dossier Interne (Collab.)
                    </button>
                  </div>

                  {(newDossierData.origin === "CLIENT" ||
                    newDossierData.origin === "COLLABORATEUR") && (
                    <div
                      className="fade-in"
                      style={{
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <label
                        className="block mb-2 font-semibold" style={{fontSize:"0.95rem",color:"var(--primary-dark)"}}
                      >
                        {newDossierData.origin === "CLIENT"
                          ? "2. Rechercher le Client cible *"
                          : "2. Sélectionner le Collaborateur *"}
                      </label>
                      {newDossierData.origin === "CLIENT" ? (
                        <SearchableDropdown
                          options={dbClients.map((c) => ({
                            value: c.id,
                            label: c.name || "Client Inconnu",
                          }))}
                          value={newDossierData.targetId}
                          onChange={(val) =>
                            setNewDossierData({
                              ...newDossierData,
                              targetId: val,
                            })
                          }
                          placeholder="-- Rechercher un client --"
                        />
                      ) : (
                        <SearchableDropdown
                          options={dbUsers.map((u) => ({
                            value: u.id,
                            label: u.name,
                          }))}
                          value={newDossierData.targetId}
                          onChange={(val) =>
                            setNewDossierData({
                              ...newDossierData,
                              targetId: val,
                            })
                          }
                          placeholder="-- Rechercher un collaborateur --"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* BLOC 2: INFOS GENERALES */}
                <div
                  className="p-6" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                >
                  <label
                    className="block mb-4 font-semibold" style={{fontSize:"0.95rem",color:"var(--primary-dark)"}}
                  >
                    2. Informations générales
                  </label>
                  <div>
                    <label
                      className="block mb-2 font-medium"
                    >
                      Description *
                    </label>
                    <textarea
                      required
                      value={newDossierData.description}
                      onChange={(e) =>
                        setNewDossierData({
                          ...newDossierData,
                          description: e.target.value,
                        })
                      }
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"80px",resize:"vertical",fontFamily:"inherit"}}
                    ></textarea>
                  </div>
                </div>

                <div
                  className="p-6" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                >
                  <label
                    className="block mb-4 font-semibold" style={{fontSize:"0.95rem",color:"var(--primary-dark)"}}
                  >
                    3. Attribution
                  </label>
                  <div>
                    <label
                      className="block mb-2 font-medium"
                    >
                      Responsable du dossier (Traitant) *
                    </label>
                    <select
                      required
                      value={newDossierData.traitantId}
                      onChange={(e) =>
                        setNewDossierData({
                          ...newDossierData,
                          traitantId: e.target.value,
                        })
                      }
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                    >
                      <option value="" disabled>
                        -- Sélectionner un traitant --
                      </option>
                      {dbUsers
                        .filter(
                          (u) =>
                            u.role?.name === "Responsable opérationnel" ||
                            u.role?.name === "Super-administrateur",
                        )
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.role?.name})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end gap-4 mt-8"
              >
                <button
                  type="button"
                  onClick={() => setShowCreateDossierModal(false)}
                  className="btn btn-outline"
                  disabled={isSubmittingDossier}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmittingDossier ||
                    !newDossierData.description.trim() ||
                    !newDossierData.origin ||
                    ((newDossierData.origin === "CLIENT" ||
                      newDossierData.origin === "COLLABORATEUR") &&
                      !newDossierData.targetId) ||
                    (newDossierData.origin === "GENERAL" &&
                      !newDossierData.generalName?.trim()) ||
                    !newDossierData.traitantId
                  }
                  className="btn btn-primary"
                  style={{
                    opacity:
                      !newDossierData.description.trim() ||
                      !newDossierData.origin ||
                      ((newDossierData.origin === "CLIENT" ||
                        newDossierData.origin === "COLLABORATEUR") &&
                        !newDossierData.targetId) ||
                      (newDossierData.origin === "GENERAL" &&
                        !newDossierData.generalName?.trim()) ||
                      !newDossierData.traitantId
                        ? 0.5
                        : 1,
                  }}
                >
                  {isSubmittingDossier ? "Création..." : "Créer le dossier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type || "warning"}
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {confirmingStatus && confirmingDossierId && (
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
              Vous allez enregistrer <strong>1 modification(s)</strong> sur ce dossier.
            </p>
            <div
              className="mb-6 text-[var(--text-main)] flex justify-between items-center" style={{background:"#F8FAFC",borderRadius:"8px",padding:"0.75rem 1rem",fontSize:"0.9rem"}}
            >
              <span className="font-medium" style={{color:"var(--text-muted)"}}>Statut</span>
              <span className="font-semibold">{DOSSIER_STATUS_LABELS[confirmingStatus] || confirmingStatus}</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setConfirmingStatus(null);
                  setConfirmingDossierId(null);
                }}
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleStatusAction(confirmingDossierId, confirmingStatus);
                  setConfirmingStatus(null);
                  setConfirmingDossierId(null);
                }}
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DossiersPage;
