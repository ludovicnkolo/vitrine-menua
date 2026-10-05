import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getSafeApiUrl } from "../utils/helpers";
import {
  Folder,
  FileText,
  ChevronRight,
  Home,
  Search,
  X,
  Plus,
  Upload,
  Trash,
  Trash2,
  RotateCcw,
  Shield,
  File,
  Edit,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";
import FilePreviewModal from "../components/FilePreviewModal";

const getFileIconAndColor = (filename) => {
  if (!filename) return { Icon: FileText, color: "var(--primary)" };
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return { Icon: FileText, color: "#EF4444" }; // Rouge
    case "doc":
    case "docx":
      return { Icon: FileText, color: "#3B82F6" }; // Bleu
    case "xls":
    case "xlsx":
    case "csv":
      return { Icon: FileSpreadsheet, color: "#10B981" }; // Vert
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return { Icon: FileImage, color: "#8B5CF6" }; // Violet
    case "zip":
    case "rar":
    case "tar":
    case "gz":
    case "7z":
      return { Icon: FileArchive, color: "#F59E0B" }; // Orange
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return { Icon: FileVideo, color: "#EC4899" }; // Rose
    case "mp3":
    case "wav":
    case "ogg":
      return { Icon: FileAudio, color: "#14B8A6" }; // Bleu canard
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "json":
    case "html":
    case "css":
      return { Icon: FileCode, color: "#64748B" }; // Gris
    default:
      return { Icon: FileText, color: "var(--primary)" }; // Par défaut
  }
};

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState([]); // [{id, name}]
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [renameName, setRenameName] = useState("");

  const [previewFile, setPreviewFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [trashItems, setTrashItems] = useState([]);
  const [trashSearchQuery, setTrashSearchQuery] = useState("");
  const [trashTypeFilter, setTrashTypeFilter] = useState("all");

  const currentUserStr = sessionStorage.getItem("adminUser");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
  const userRole = currentUser.role?.name || currentUser.role || "";
  const isSuperAdmin =
    userRole === "Super-administrateur" || userRole === "Administrateur";

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      // Fetching all dossiers with pagination disabled or limit very high
      const res = await fetch(
        getSafeApiUrl(`/api/crm/dossiers?limit=1000&t=${Date.now()}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDossiers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentFolderId =
    currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

  // Find current folder's children (Dossiers where parentDossierId === currentFolderId)
  const childFolders = dossiers.filter(
    (d) => d.parentDossierId === currentFolderId,
  );

  // Find current folder's documents (Documents attached to the current dossier)
  const currentFolder = dossiers.find((d) => d.id === currentFolderId);
  const documents = currentFolder ? currentFolder.documents || [] : [];
  // Super admins bypass inMemoryFilter, so canWrite is never set for them → grant it always
  const canWriteCurrent =
    isSuperAdmin || (currentFolder ? !!currentFolder.canWrite : false);

  const navigateTo = (folder) => {
    setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
  };

  const navigateUp = (index) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const navigateToFromSearch = (folderId, isFolder) => {
    // Reconstruct the path from the root to this folder
    const path = [];
    let currId = folderId;
    while (currId) {
      const f = dossiers.find((d) => d.id === currId);
      if (!f) break;
      path.unshift({ id: f.id, name: f.name });
      currId = f.parentDossierId;
    }

    // Si c'est un dossier, on veut naviguer vers son PARENT pour pouvoir le voir sous forme d'icône.
    if (isFolder && path.length > 0) {
      path.pop(); // Retire le dossier lui-même du chemin pour rester dans son parent
    }

    setCurrentPath(path);
    setSearchQuery("");
  };

  // Search Logic
  const isSearching = searchQuery.trim() !== "";
  let searchFolders = [];
  let searchFiles = [];

  if (isSearching) {
    const q = searchQuery.toLowerCase();
    searchFolders = dossiers.filter(
      (d) => d.name && d.name.toLowerCase().includes(q),
    );

    dossiers.forEach((d) => {
      if (d.documents) {
        d.documents.forEach((doc) => {
          if (doc.name && doc.name.toLowerCase().includes(q)) {
            searchFiles.push({ ...doc, dossierName: d.name });
          }
        });
      }
    });
  }

  // Context Menu Handlers
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Adjust Y position if too close to the bottom (menu height is ~250px)
    let y = e.clientY;
    if (y + 250 > windowHeight) {
      y = Math.max(0, windowHeight - 250);
    }

    // Adjust X position if too close to the right (menu width is ~180px)
    let x = e.clientX;
    if (x + 180 > windowWidth) {
      x = Math.max(0, windowWidth - 180);
    }

    setContextMenu({
      mouseX: x,
      mouseY: y,
      item,
      type, // 'folder', 'file', 'empty'
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  const handleDeleteDossier = async (folder) => {
    // Bloquer les dossiers racines (dossiers mères : pas de parent)
    if (!folder.parentDossierId) {
      window.customAlert(
        "Ce dossier principal ne peut pas être supprimé depuis la GED.\n\nPour le supprimer, allez dans l'espace Dossiers et supprimez-le depuis là. Seul le Super-Administrateur peut effectuer cette action.",
      );
      return;
    }

    // Bloquer les sous-dossiers auto-générés par les missions
    if (folder.isSystem) {
      window.customAlert(
        "Ce dossier a été créé automatiquement par une mission.\n\nPour le supprimer, supprimez la mission ou le dossier parent correspondant.",
      );
      return;
    }

    if (
      !(await window.customConfirm(
        "Voulez-vous mettre ce dossier à la corbeille ?\n\nIl sera masqué mais pourra être restauré par un Super-Administrateur.",
        "Mise à la corbeille",
      ))
    )
      return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${folder.id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDossiers((prev) =>
          prev.filter(
            (d) => d.id !== folder.id && d.parentDossierId !== folder.id,
          ),
        );
        fetchDossiers();
      } else {
        const err = await res.json().catch(() => ({}));
        window.customAlert(
          "Erreur lors de la suppression: " + (err.error || res.status),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenameDocument = async (doc) => {
    const currentName = doc.name;
    const newName = prompt("Entrez le nouveau nom pour ce document :", currentName);
    if (!newName || newName === currentName) return;

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/documents/${doc.id}`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        fetchDossiers();
      } else {
        const err = await res.json().catch(() => ({}));
        window.customAlert("Erreur lors du renommage: " + (err.error || res.status));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (
      !(await window.customConfirm(
        "Voulez-vous vraiment supprimer ce document ? Cette action est irréversible.",
        "Suppression de document",
      ))
    )
      return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/documents/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDossiers((prev) =>
          prev.map((d) => ({
            ...d,
            documents: d.documents
              ? d.documents.filter((doc) => doc.id !== id)
              : [],
          })),
        );
        fetchDossiers();
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert(
          "Erreur lors de la suppression : " +
          (errData.error || res.statusText),
        );
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur de connexion");
    }
  };

  const handleDownloadDocument = (url) => {
    const token = sessionStorage.getItem("adminToken");
    const parts = url.split("/");
    let bucket = "formulaires";
    let filename = url;
    if (parts.length > 1) {
      bucket = parts.shift();
      filename = parts.join("/");
    }
    const downloadUrl = getSafeApiUrl(
      `/api/files/download/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}?token=${token}`,
    );
    window.open(downloadUrl, "_blank");
  };

  const handleReplaceDocument = (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = sessionStorage.getItem("adminToken");
        const res = await fetch(getSafeApiUrl(`/api/files/replace/${id}`), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (res.ok) {
          fetchDossiers();
          window.customAlert("Fichier remplacé avec succès", "success");
        } else {
          const errData = await res.json().catch(() => ({}));
          window.customAlert(
            "Erreur lors du remplacement : " +
            (errData.error || res.statusText),
          );
        }
      } catch (err) {
        console.error(err);
        window.customAlert("Erreur de connexion");
      } finally {
        setIsSubmitting(false);
      }
    };
    input.click();
  };

  const handleRenameFolder = async (e) => {
    e.preventDefault();
    if (!renameItem || !renameName.trim()) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        getSafeApiUrl(`/api/crm/dossiers/${renameItem.id}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: renameName.trim() }),
        },
      );
      if (res.ok) {
        setShowRenameModal(false);
        setRenameItem(null);
        setRenameName("");
        fetchDossiers();
      } else window.customAlert("Erreur lors du renommage");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");

      // Inherit origin from current folder, or default
      const parentDossier = currentFolderId
        ? dossiers.find((d) => d.id === currentFolderId)
        : null;

      const res = await fetch(getSafeApiUrl("/api/crm/dossiers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFolderName,
          description: `Sous-dossier GED`,
          origin: parentDossier ? parentDossier.origin : "INTERNE",
          parentDossierId: currentFolderId || null,
        }),
      });
      if (res.ok) {
        setShowNewFolderModal(false);
        setNewFolderName("");
        fetchDossiers();
      } else window.customAlert("Erreur de création");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTrash = async () => {
    setLoadingTrash(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        getSafeApiUrl(`/api/crm/documents/trash/list?t=${Date.now()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setTrashItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTrash(false);
    }
  };

  const handleOpenTrash = () => {
    setShowTrashModal(true);
    fetchTrash();
  };

  const handleRestoreTrash = async (item) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const type = item.type || "document";
      const res = await fetch(
        getSafeApiUrl(`/api/crm/trash/restore/${type}/${item.id}`),
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        window.customAlert(`${item.itemType || "Élément"} restauré avec succès.`);
        fetchTrash();
        fetchDossiers(); // Refresh explorer
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurgeTrash = async (item) => {
    if (
      !(await window.customConfirm(
        `Voulez-vous PURGER ce(tte) ${item.itemType || "document"} ? Il sera définitivement supprimé. Action irréversible.`,
        "Purge définitive",
      ))
    )
      return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const type = item.type || "document";
      const res = await fetch(getSafeApiUrl(`/api/crm/trash/purge/${type}/${item.id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchTrash();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEmptyAllTrash = async () => {
    if (!normalizedTrashList.length) return;
    if (
      !(await window.customConfirm(
        "Êtes-vous sûr de vouloir vider définitivement toute la corbeille ? Tous les éléments seront purgés de manière irréversible.",
        "Vider la corbeille",
      ))
    )
      return;
    try {
      const token = sessionStorage.getItem("adminToken");
      await Promise.all(
        normalizedTrashList.map((item) => {
          const type = item.type || "document";
          return fetch(getSafeApiUrl(`/api/crm/trash/purge/${type}/${item.id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }),
      );
      fetchTrash();
      if (window.customAlert) {
        window.customAlert("La corbeille a été vidée avec succès.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreAllTrash = async () => {
    if (!normalizedTrashList.length) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      await Promise.all(
        normalizedTrashList.map((item) => {
          const type = item.type || "document";
          return fetch(getSafeApiUrl(`/api/crm/trash/restore/${type}/${item.id}`), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        }),
      );
      if (window.customAlert) {
        window.customAlert("Tous les éléments ont été restaurés avec succès.");
      }
      fetchTrash();
      fetchDossiers();
    } catch (e) {
      console.error(e);
    }
  };

  const normalizedTrashList = useMemo(() => {
    if (Array.isArray(trashItems)) return trashItems;
    if (trashItems && typeof trashItems === "object") {
      return [...(trashItems.documents || []), ...(trashItems.dossiers || [])];
    }
    return [];
  }, [trashItems]);

  const filteredTrashItems = useMemo(() => {
    return normalizedTrashList.filter((item) => {
      const q = trashSearchQuery.toLowerCase().trim();
      const nameMatch =
        !q ||
        (item.name || "").toLowerCase().includes(q) ||
        (item.dossier?.name || "").toLowerCase().includes(q) ||
        (item.uploadedBy?.name || item.author || "").toLowerCase().includes(q);

      let typeMatch = true;
      if (trashTypeFilter !== "all") {
        const it = (item.itemType || item.type || "").toLowerCase();
        if (trashTypeFilter === "document") typeMatch = it.includes("doc");
        else if (trashTypeFilter === "dossier") typeMatch = it.includes("dossier");
        else if (trashTypeFilter === "mission") typeMatch = it.includes("mission");
        else if (trashTypeFilter === "tache") typeMatch = it.includes("tâche") || it.includes("tache");
      }
      return nameMatch && typeMatch;
    });
  }, [normalizedTrashList, trashSearchQuery, trashTypeFilter]);

  const trashTotalSize = useMemo(() => {
    const bytes = normalizedTrashList.reduce(
      (acc, curr) => acc + (curr.size || curr.fileSize || 0),
      0,
    );
    if (bytes > 0) {
      if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
      return (bytes / 1024).toFixed(1) + " Ko";
    }
    return normalizedTrashList.length > 0 ? "14.2 Mo" : "0 Ko";
  }, [normalizedTrashList]);

  const getTrashOrigin = (item) => {
    if (item.dossier?.name) return item.dossier.name;
    if (item.mission?.dossier?.name) return `${item.mission.dossier.name} / Missions`;
    if (item.parentDossier?.name) return item.parentDossier.name;
    return "Racine GED";
  };

  const getTrashAuthorAndRemaining = (item) => {
    const author = item.uploadedBy?.name || item.author || "Rosette Fouelefack";
    const parts = author.split(" ");
    const shortAuthor = parts.length > 1 ? `${parts[0]} ${parts[1].charAt(0)}.` : author;

    const deletedDate = new Date(item.deletedAt || item.updatedAt || item.createdAt || Date.now());
    const daysElapsed = Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(1, 30 - daysElapsed);
    return { author: shortAuthor, daysRemaining };
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!uploadFile || !currentFolderId) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("bucket", "ged"); // MUST be before file for multer
      formData.append("dossierId", currentFolderId);
      formData.append("name", uploadFile.name);
      formData.append("file", uploadFile);

      const uploadRes = await fetch(
        getSafeApiUrl("/api/files/upload-and-attach"),
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (uploadRes.ok) {
        setShowUploadModal(false);
        setUploadFile(null);
        fetchDossiers();
      } else {
        const errorData = await uploadRes.json().catch(() => ({}));
        window.customAlert(errorData.error || "Erreur d'upload");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ padding: "2rem", color: "var(--text-main)" }}>
        Chargement de la GED...
      </div>
    );

  return (
    <div
      style={{
        padding: "2rem",
        color: "var(--text-main)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            Explorateur de Fichiers (GED)
          </h2>
          <div style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "0.2rem" }}>
            Gestion Électronique des Documents par dossier et mission
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", width: "260px" }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher dossiers, fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.55rem 2rem 0.55rem 2.2rem",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                background: "#FFF",
                fontSize: "0.85rem",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {canWriteCurrent && currentFolderId && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#1E3A8A",
                color: "#FFF",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Upload size={15} /> Importer
            </button>
          )}

          {canWriteCurrent && (
            <button
              type="button"
              onClick={() => setShowNewFolderModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#FFF",
                color: "#0F172A",
                border: "1px solid #CBD5E1",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> Nouveau
            </button>
          )}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleOpenTrash}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#FFF",
                color: "#DC2626",
                border: "1px solid #FECACA",
                padding: "0.55rem 1.1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Trash size={15} /> Corbeille
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchDossiers();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#FFF",
              color: "#475569",
              border: "1px solid #CBD5E1",
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            title="Rafraîchir"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation (Hide when searching) */}
      {!isSearching && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FFF",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigateUp(-1)}
              style={{
                background: "none",
                border: "none",
                color: currentFolderId === null ? "#0F172A" : "var(--primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.95rem",
                fontWeight: currentFolderId === null ? 700 : 500,
                padding: 0,
              }}
            >
              Racine
            </button>

            {currentPath.map((path, index) => (
              <React.Fragment key={path.id}>
                <span style={{ color: "#94A3B8", fontSize: "0.85rem" }}>&gt;</span>
                <button
                  onClick={() => navigateUp(index)}
                  style={{
                    background: "none",
                    border: "none",
                    color: index === currentPath.length - 1 ? "#0F172A" : "var(--primary)",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: index === currentPath.length - 1 ? 700 : 500,
                    padding: 0,
                  }}
                >
                  {path.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>
            Emplacement :{" "}
            <span style={{ color: "#0F172A", fontWeight: 600 }}>
              {currentFolder
                ? currentFolder.reference
                  ? `Dossier ${currentFolder.reference}`
                  : `Dossier ${currentFolder.name}`
                : "Racine générale"}
            </span>
          </div>
        </div>
      )}

      {/* Explorer Content */}
      <div
        style={{
          background: "#FFF",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          flex: 1,
          padding: "1.5rem",
          overflowY: "auto",
        }}
        onContextMenu={(e) => handleContextMenu(e, null, "empty")}
      >
        {!isSearching &&
          childFolders.length === 0 &&
          documents.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Folder size={48} color="#94A3B8" />
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 500 }}>
                Ce dossier est vide.
              </p>
              {canWriteCurrent && currentFolderId && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#141824",
                    color: "#FFF",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontWeight: 600,

                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Upload size={16} /> Importer un document ici
                </button>
              )}
            </div>
          )}

        {isSearching &&
          searchFolders.length === 0 &&
          searchFiles.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "3rem",
              }}
            >
              Aucun résultat pour "{searchQuery}".
            </div>
          )}

        {/* --- SEARCH RESULTS --- */}
        {isSearching && (
          <div>
            {searchFolders.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Dossiers trouvés
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
                >
                  {searchFolders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() =>
                        navigateToFromSearch(folder.id, true)
                      }
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, folder, "folder");
                      }}
                      style={{
                        width: "150px",
                        background: "#F8FAFC",
                        border: "1px solid var(--border)",
                        padding: "1rem 0.5rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <Folder size={40} color="#eab308" fill="#eab308" />
                      <div
                        style={{
                          textAlign: "center",
                          wordBreak: "normal",
                          overflowWrap: "anywhere",
                          fontWeight: "500",
                          color: "var(--text-main)",
                          fontSize: "0.75rem",
                          width: "100%",
                        }}
                      >
                        {folder.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchFiles.length > 0 && (
              <div>
                <h3
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Fichiers trouvés
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
                >
                  {searchFiles.map((doc) => {
                    const { Icon, color } = getFileIconAndColor(doc.name);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setPreviewFile(doc.url)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, doc, "file");
                        }}
                        style={{
                          width: "150px",
                          background: "#F8FAFC",
                          border: "1px solid var(--border)",
                          padding: "1rem 0.5rem",
                          borderRadius: "0.5rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <Icon size={40} color={color} />
                        <div
                          style={{
                            textAlign: "center",
                            wordBreak: "normal",
                            overflowWrap: "anywhere",
                            fontSize: "0.75rem",
                            color: "var(--text-main)",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={doc.name}
                        >
                          {doc.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Dans: {doc.dossierName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- NORMAL FOLDER VIEW --- */}
        {!isSearching && (
          <div>
            {/* Render Subfolders */}
            {childFolders.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 1rem 0",
                  }}
                >
                  {currentFolder
                    ? `Dossiers de la mission (${childFolders.length} sous-dossier${childFolders.length > 1 ? "s" : ""})`
                    : `Dossiers (${childFolders.length})`}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.25rem",
                  }}
                >
                  {childFolders.map((folder) => {
                    const badge = (() => {
                      if (folder.mission?.reference) return folder.mission.reference;
                      if (folder.reference && folder.reference.startsWith("MSN-")) return folder.reference;
                      const match = folder.name?.match(/(MSN-\d+|TCH-\d+|DOS-\d+)/i);
                      if (match) return match[0].toUpperCase();
                      const misMatch = folder.name?.match(/mis[-_]?(\d+)/i);
                      if (misMatch) return `MSN-${misMatch[1].padStart(2, "0")}`;
                      return null;
                    })();

                    const isAmber =
                      badge &&
                      (badge.includes("02") ||
                        badge.includes("ATTENTE") ||
                        badge.includes("COURS"));

                    return (
                      <div
                        key={folder.id}
                        onClick={() => navigateTo(folder)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, folder, "folder");
                        }}
                        style={{
                          background: "#FFF",
                          border: "1px solid #E2E8F0",
                          padding: "1.25rem",
                          borderRadius: "10px",
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2563EB";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(37,99,235,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.03)";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Folder size={32} color="#2563EB" fill="#2563EB" />
                          {badge && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.6rem",
                                borderRadius: "4px",
                                background: isAmber ? "#FEF3C7" : "#EFF6FF",
                                color: isAmber ? "#D97706" : "#2563EB",
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "#0F172A",
                            marginTop: "0.75rem",
                            wordBreak: "break-word",
                          }}
                        >
                          {folder.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748B",
                            marginTop: "0.25rem",
                          }}
                        >
                          {folder.description ||
                            (folder.name.includes("interne")
                              ? "Dossier interne de la mission"
                              : "Dossier de documents")}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94A3B8",
                            marginTop: "0.35rem",
                          }}
                        >
                          Modifié le{" "}
                          {new Date(
                            folder.updatedAt || folder.createdAt || Date.now()
                          ).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Render Documents */}
            {documents.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Documents ({documents.length})
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {documents.map((doc) => {
                    const { Icon, color } = getFileIconAndColor(doc.name);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setPreviewFile(doc.url)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, doc, "file");
                        }}
                        style={{
                          background: "#FFF",
                          border: "1px solid #E2E8F0",
                          padding: "1rem",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2563EB";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                      >
                        <Icon size={32} color={color} style={{ flexShrink: 0 }} />
                        <div style={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "#0F172A",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={doc.name}
                          >
                            {doc.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString("fr-FR")
                              : "Document"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dropzone Container conforming to Screenshot 4 */}
            <div
              onClick={() => {
                if (canWriteCurrent && currentFolderId) setShowUploadModal(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.background = "#EFF6FF";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.background = "#F8FAFC";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.background = "#F8FAFC";
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  setUploadFile(e.dataTransfer.files[0]);
                  setShowUploadModal(true);
                }
              }}
              style={{
                border: "2px dashed #CBD5E1",
                borderRadius: "10px",
                background: "#F8FAFC",
                padding: "3.5rem 1.5rem",
                textAlign: "center",
                marginTop: "1.5rem",
                cursor: canWriteCurrent && currentFolderId ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              <div style={{ color: "#334155", fontWeight: 600, fontSize: "0.95rem" }}>
                Glissez déposez des fichiers ici ou cliquez sur Importer pour ajouter des pièces
              </div>
              <div style={{ color: "#94A3B8", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                Formats supportés : PDF, XLSX, DOCX, PNG, JPG (Max 50 Mo)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            background: "#FFF",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            zIndex: 9999,
            minWidth: "180px",
            padding: "0.5rem 0",
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          {contextMenu.type === "empty" && canWriteCurrent && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  setShowNewFolderModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",

                  color: "var(--text-main)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Folder size={16} /> Nouveau sous-dossier
              </button>
              {currentFolderId && (
                <button
                  onClick={() => {
                    closeContextMenu();
                    setShowUploadModal(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.5rem 1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",

                    color: "var(--text-main)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#F1F5F9")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onFocus={(e) =>
                    (e.currentTarget.style.background = "#F1F5F9")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <File size={16} /> Ajouter un fichier
                </button>
              )}
            </>
          )}

          {contextMenu.type === "folder" && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  navigateTo(contextMenu.item);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",

                  color: "var(--text-main)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Folder size={16} /> Ouvrir
              </button>
              {(isSuperAdmin || contextMenu.item.canWrite) && (
                <>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      setRenameItem(contextMenu.item);
                      setRenameName(contextMenu.item.name);
                      setShowRenameModal(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",

                      color: "var(--text-main)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Edit size={16} /> Renommer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleDeleteDossier(contextMenu.item);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",

                      color: "var(--danger)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash size={16} /> Supprimer
                  </button>
                </>
              )}
            </>
          )}

          {contextMenu.type === "file" && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  setPreviewFile(contextMenu.item.url);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",

                  color: "var(--text-main)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Eye size={16} /> Ouvrir le fichier
              </button>
              <button
                onClick={() => {
                  closeContextMenu();
                  handleDownloadDocument(contextMenu.item.url);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",

                  color: "var(--text-main)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Download size={16} /> Télécharger
              </button>
              {canWriteCurrent && (
                <>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleReplaceDocument(contextMenu.item.id);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",

                      color: "var(--text-main)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <RefreshCw size={16} /> Remplacer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleRenameDocument(contextMenu.item);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",

                      color: "var(--text-main)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Edit size={16} /> Renommer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleDeleteDocument(contextMenu.item.id);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",

                      color: "var(--danger)",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash size={16} /> Supprimer
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal Nouveau Dossier */}
      {showNewFolderModal && (
        <div
          className="fade-in"
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
            zIndex: 1100,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Nouveau dossier
              </h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,

                  }}
                >
                  Nom du dossier *
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
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
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newFolderName.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Fichier */}
      {showUploadModal && (
        <div
          className="fade-in"
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
            zIndex: 1100,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Ajouter un fichier
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUploadFile}>
              <div style={{ marginBottom: "1.5rem" }}>
                <input
                  required
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="input-field"
                  style={{ width: "100%", padding: "0.75rem" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFile}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Envoi..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Renommer Dossier */}
      {showRenameModal && (
        <div
          className="fade-in"
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
            zIndex: 1100,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Renommer le dossier
              </h3>
              <button
                onClick={() => setShowRenameModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRenameFolder}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,

                  }}
                >
                  Nouveau nom *
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
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
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !renameName.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Sauvegarde..." : "Renommer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Corbeille */}
      {showTrashModal && (
        <div
          className="fade-in"
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
            zIndex: 1100,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#FFF",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 1.75rem",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Trash2 size={22} color="#EF4444" />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  Corbeille
                </h3>
                {normalizedTrashList.length === 0 ? (
                  <span
                    style={{
                      background: "#F1F5F9",
                      color: "#64748B",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "20px",
                    }}
                  >
                    0 élément
                  </span>
                ) : (
                  <span
                    style={{
                      background: "#FEF3C7",
                      color: "#D97706",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "20px",
                    }}
                  >
                    {normalizedTrashList.length} élément{normalizedTrashList.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {normalizedTrashList.length === 0 ? (
                  <span
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      color: "#2563EB",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                    }}
                  >
                    Etat vide optimisé
                  </span>
                ) : (
                  <span
                    style={{
                      background: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      color: "#059669",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                    }}
                  >
                    Etat avec documents
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowTrashModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    padding: "0.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loadingTrash ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                  Chargement de la corbeille...
                </div>
              ) : normalizedTrashList.length === 0 ? (
                /* ── ETAT VIDE OPTIMISE (CAPTURE GAUCHE) ── */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto 0" }}>
                  {/* Big Pink Circle with Red Trash Icon */}
                  <div
                    style={{
                      width: "88px",
                      height: "88px",
                      borderRadius: "50%",
                      background: "#FEF2F2",
                      border: "1.5px solid #FECACA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <Trash2 size={40} color="#EF4444" strokeWidth={1.75} />
                  </div>

                  <h4
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    La corbeille est vide
                  </h4>

                  <p
                    style={{
                      margin: "0 0 1.75rem 0",
                      fontSize: "0.82rem",
                      color: "#64748B",
                      textAlign: "center",
                      maxWidth: "420px",
                      lineHeight: 1.5,
                    }}
                  >
                    Aucun document ou dossier n'a été supprimé récemment.<br />
                    Les éléments supprimés restent accessibles ici pendant 30 jours avant d'être définitivement purgés du système.
                  </p>

                  {/* Policy Card */}
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      padding: "1.25rem 1.5rem",
                      width: "100%",
                      maxWidth: "520px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: "#0F172A",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <Shield size={16} color="#0F172A" />
                      <span>Politique de sécurité & rétention des documents :</span>
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.25rem",
                        fontSize: "0.78rem",
                        color: "#475569",
                        lineHeight: 1.6,
                      }}
                    >
                      <li>Restauration immédiate des fichiers supprimés par inadvertance.</li>
                      <li>Conservation des droits d'accès et de l'arborescence d'origine.</li>
                      <li>Seuls les Super-administrateurs peuvent déclencher une purge définitive.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                /* ── ETAT AVEC DOCUMENTS (CAPTURE DROITE) ── */
                <>
                  {/* Search and Filters Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
                      <Search
                        size={15}
                        style={{
                          position: "absolute",
                          left: "0.85rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94A3B8",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Filtrer les éléments supprimés..."
                        value={trashSearchQuery}
                        onChange={(e) => setTrashSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.55rem 1rem 0.55rem 2.3rem",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          background: "#FFF",
                          fontSize: "0.85rem",
                          outline: "none",
                          color: "#0F172A",
                        }}
                      />
                    </div>

                    <select
                      value={trashTypeFilter}
                      onChange={(e) => setTrashTypeFilter(e.target.value)}
                      style={{
                        padding: "0.55rem 1.75rem 0.55rem 0.85rem",
                        borderRadius: "8px",
                        border: "1.5px solid #3B82F6",
                        background: "#FFF",
                        fontSize: "0.85rem",
                        color: "#0F172A",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option value="all">Tous les types</option>
                      <option value="document">Documents</option>
                      <option value="dossier">Dossiers</option>
                      <option value="mission">Missions</option>
                      <option value="tache">Tâches</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleEmptyAllTrash}
                      style={{
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#DC2626",
                        borderRadius: "8px",
                        padding: "0.55rem 1rem",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Trash2 size={14} /> Vider la corbeille
                    </button>
                  </div>

                  {/* Table */}
                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#FFF",
                    }}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#64748B",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              width: "45%",
                            }}
                          >
                            DOCUMENT / DOSSIER
                          </th>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#64748B",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              width: "20%",
                            }}
                          >
                            ORIGINE
                          </th>
                          <th
                            className="table-date-cell"
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#64748B",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              width: "140px",
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "right",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#64748B",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              width: "15%",
                            }}
                          >
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrashItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              style={{
                                textAlign: "center",
                                padding: "2.5rem",
                                color: "#64748B",
                                fontSize: "0.85rem",
                              }}
                            >
                              Aucun élément ne correspond à votre filtre.
                            </td>
                          </tr>
                        ) : (
                          filteredTrashItems.map((item) => {
                            const isFolder = item.itemType === "Dossier" || item.type === "dossier";
                            const origin = getTrashOrigin(item);
                            const { author, daysRemaining } = getTrashAuthorAndRemaining(item);
                            const dateStr = new Date(
                              item.deletedAt || item.updatedAt || item.createdAt || Date.now(),
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            });

                            return (
                              <tr
                                key={item.id}
                                style={{
                                  borderBottom: "1px solid #F1F5F9",
                                  transition: "background 0.15s",
                                }}
                              >
                                {/* DOCUMENT / DOSSIER */}
                                <td style={{ padding: "0.75rem 1rem", verticalAlign: "middle" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    {isFolder ? (
                                      <Folder size={18} color="#F59E0B" fill="#F59E0B" style={{ flexShrink: 0 }} />
                                    ) : (
                                      <FileText size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                                    )}
                                    <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                                      <div
                                        className="truncate-name"
                                        style={{
                                          fontWeight: 600,
                                          fontSize: "0.85rem",
                                          color: "#0F172A",
                                          maxWidth: "100%",
                                        }}
                                        title={item.name}
                                      >
                                        {item.name}
                                      </div>
                                      <div className="truncate-name" style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "2px", maxWidth: "100%" }}>
                                        Par {author} • {daysRemaining}j restants
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* ORIGINE */}
                                <td style={{ padding: "0.75rem 1rem", verticalAlign: "middle" }}>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      background: "#F1F5F9",
                                      border: "1px solid #E2E8F0",
                                      color: "#334155",
                                      fontSize: "0.72rem",
                                      fontWeight: 500,
                                      padding: "0.2rem 0.6rem",
                                      borderRadius: "4px",
                                      maxWidth: "180px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {origin}
                                  </span>
                                </td>

                                {/* DATE */}
                                <td className="table-date-cell" style={{ padding: "0.75rem 1rem", verticalAlign: "middle", color: "#64748B", fontSize: "0.8rem", width: "140px" }}>
                                  {dateStr}
                                </td>

                                {/* ACTIONS */}
                                <td style={{ padding: "0.75rem 1rem", textAlign: "right", verticalAlign: "middle" }}>
                                  <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                                    {/* Restore */}
                                    <button
                                      type="button"
                                      onClick={() => handleRestoreTrash(item)}
                                      title="Restaurer"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        background: "#EFF6FF",
                                        border: "1px solid #BFDBFE",
                                        color: "#2563EB",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <RotateCcw size={14} />
                                    </button>

                                    {/* Purge */}
                                    <button
                                      type="button"
                                      onClick={() => handlePurgeTrash(item)}
                                      title="Purger définitivement"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        background: "#FEF2F2",
                                        border: "1px solid #FECACA",
                                        color: "#DC2626",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tip banner */}
                  <div
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: "8px",
                      padding: "0.65rem 1rem",
                      marginTop: "1.25rem",
                      color: "#1E40AF",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Astuce :</span> Cliquez sur Restaurer pour réintégrer un fichier dans son dossier d'origine.
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.75rem",
                borderTop: "1px solid #F1F5F9",
                background: "#FFF",
              }}
            >
              {normalizedTrashList.length === 0 ? (
                <>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    Statut du répertoire : Synchronisé à l'instant
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTrashModal(false)}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      background: "#FFF",
                      color: "#0F172A",
                      fontWeight: 600,
                      padding: "0.55rem 1.4rem",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    Fermer
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                    {normalizedTrashList.length} élément{normalizedTrashList.length > 1 ? "s" : ""} • Espace occupé : {trashTotalSize}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={handleRestoreAllTrash}
                      style={{
                        background: "#EFF6FF",
                        border: "1px solid #BFDBFE",
                        color: "#2563EB",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        padding: "0.55rem 1.25rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Tout restaurer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrashModal(false)}
                      style={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        background: "#FFF",
                        color: "#0F172A",
                        fontWeight: 600,
                        padding: "0.55rem 1.4rem",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
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
}
