import GedToolbar from "../components/documents/GedToolbar";
import React, { useState, useEffect, useMemo, useRef } from "react";
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

import { getFileIconAndColor } from "../components/documents/gedHelpers";
import GedTrashModal from "../components/documents/GedTrashModal";
import GedContextMenu from "../components/documents/GedContextMenu";
import GedFolderModals from "../components/documents/GedFolderModals";
import GedBrowserView from "../components/documents/GedBrowserView";

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState([]); // [{id, name}]
  const [searchQuery, setSearchQuery] = useState("");
  const replaceFileInputRef = useRef(null);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

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

  // Find current folder's children (Dossiers where parentDossierId === currentFolderId, or top accessible folders if currentFolderId === null)
  const childFolders = dossiers.filter((d) => {
    if (currentFolderId === null) {
      return !d.parentDossierId || !dossiers.some((p) => p.id === d.parentDossierId);
    }
    return d.parentDossierId === currentFolderId;
  });

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

  // Search Logic (Memoized)
  const isSearching = searchQuery.trim() !== "";
  const { searchFolders, searchFiles } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { searchFolders: [], searchFiles: [] };

    const fldrs = dossiers.filter(
      (d) => d.name && d.name.toLowerCase().includes(q),
    );
    const fls = [];
    dossiers.forEach((d) => {
      if (d.documents) {
        d.documents.forEach((doc) => {
          if (doc.name && doc.name.toLowerCase().includes(q)) {
            fls.push({ ...doc, dossierName: d.name });
          }
        });
      }
    });
    return { searchFolders: fldrs, searchFiles: fls };
  }, [searchQuery, dossiers]);

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
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

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

  const openRenameModal = (item, type = "folder") => {
    setRenameItem({ ...item, type });
    setRenameName(item.name);
    setShowRenameModal(true);
  };

  const handleRenameDocument = (doc) => openRenameModal(doc, "file");
  const handleRenameFolder = (folder) => openRenameModal(folder, "folder");

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

  const handleDownloadDocument = async (url, filename) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const parts = url.split("/");
      let bucket = "formulaires";
      let fileKey = url;
      if (parts.length > 1) {
        bucket = parts.shift();
        fileKey = parts.join("/");
      }

      const downloadUrl = getSafeApiUrl(
        `/api/files/download/${encodeURIComponent(bucket)}/${encodeURIComponent(fileKey)}`
      );

      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Échec du téléchargement");

      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename || fileKey.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      window.customAlert("Impossible de télécharger le fichier.");
    }
  };

  const handleReplaceDocument = (id) => {
    setReplaceTargetId(id);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = "";
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/files/replace/${replaceTargetId}`), {
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
      setReplaceTargetId(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = "";
      }
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameItem || !renameName.trim()) return;
    setIsSubmitting(true);

    const isDoc = renameItem.type === "file" || !!renameItem.dossierId;
    const endpoint = isDoc
      ? `/api/crm/documents/${renameItem.id}`
      : `/api/crm/dossiers/${renameItem.id}`;

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(endpoint), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: renameName.trim() }),
      });

      if (res.ok) {
        setShowRenameModal(false);
        setRenameItem(null);
        setRenameName("");
        fetchDossiers();
      } else {
        const err = await res.json().catch(() => ({}));
        window.customAlert(err.error || "Erreur lors du renommage");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur de communication.");
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
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl("/api/crm/trash/empty-all"), {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        fetchTrash();
        window.customAlert("La corbeille a été vidée avec succès.");
      } else {
        // Fallback séquentiel par petits lots
        for (let i = 0; i < normalizedTrashList.length; i += 5) {
          const chunk = normalizedTrashList.slice(i, i + 5);
          await Promise.all(
            chunk.map((item) => {
              const type = item.type || "document";
              return fetch(getSafeApiUrl(`/api/crm/trash/purge/${type}/${item.id}`), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            })
          );
        }
        fetchTrash();
        window.customAlert("La corbeille a été vidée avec succès.");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestoreAllTrash = async () => {
    if (!normalizedTrashList.length) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl("/api/crm/trash/restore-all"), {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        window.customAlert("Tous les éléments ont été restaurés avec succès.");
        fetchTrash();
        fetchDossiers();
      } else {
        // Fallback séquentiel par petits lots
        for (let i = 0; i < normalizedTrashList.length; i += 5) {
          const chunk = normalizedTrashList.slice(i, i + 5);
          await Promise.all(
            chunk.map((item) => {
              const type = item.type || "document";
              return fetch(getSafeApiUrl(`/api/crm/trash/restore/${type}/${item.id}`), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });
            })
          );
        }
        window.customAlert("Tous les éléments ont été restaurés avec succès.");
        fetchTrash();
        fetchDossiers();
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau.");
    } finally {
      setIsSubmitting(false);
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
    return normalizedTrashList.length > 0 ? "—" : "0 Ko";
  }, [normalizedTrashList]);

  const getTrashOrigin = (item) => {
    if (item.dossier?.name) return item.dossier.name;
    if (item.mission?.dossier?.name) return `${item.mission.dossier.name} / Missions`;
    if (item.parentDossier?.name) return item.parentDossier.name;
    return "Racine GED";
  };

  const getTrashAuthorAndRemaining = (item) => {
    const author = item.uploadedBy?.name || item.author || "Système";
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
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";

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
        await fetchDossiers();
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
      <div className="p-8 text-[var(--text-main)]">
        Chargement de la GED...
      </div>
    );

  return (
    <div
      className="p-8 text-[var(--text-main)] flex flex-col h-full"
    >
      <GedToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canWriteCurrent={canWriteCurrent}
        currentFolderId={currentFolderId}
        setShowUploadModal={setShowUploadModal}
        setShowNewFolderModal={setShowNewFolderModal}
        isSuperAdmin={isSuperAdmin}
        handleOpenTrash={handleOpenTrash}
        setLoading={setLoading}
        fetchDossiers={fetchDossiers}
      />

      {/* Breadcrumb Navigation (Hide when searching) */}
      {!isSearching && (
        <div
          className="flex justify-between items-center mb-6 flex-wrap gap-2" style={{background:"var(--surface)",padding:"0.75rem 1.25rem",borderRadius:"8px",border:"1px solid var(--border)"}}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigateUp(-1)}
              style={{
                background: "none",
                border: "none",
                color: currentFolderId === null ? "var(--text-main)" : "var(--primary)",
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
                    color: index === currentPath.length - 1 ? "var(--text-main)" : "var(--primary)",
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

          <div className="font-medium" style={{fontSize:"0.85rem",color:"#64748B"}}>
            Emplacement :{" "}
            <span className="text-[var(--text-main)] font-semibold">
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
        className="p-6" style={{background:"#FFF",border:"1px solid var(--border)",borderRadius:"0.5rem",flex:1,overflowY:"auto"}}
        onContextMenu={(e) => handleContextMenu(e, null, "empty")}
      >
        {!isSearching &&
          childFolders.length === 0 &&
          documents.length === 0 && (
            <div
              className="text-center flex flex-col items-center gap-4" style={{color:"var(--text-muted)",padding:"3rem"}}
            >
              <Folder size={48} color="#94A3B8" />
              <p className="font-medium" style={{fontSize:"1rem"}}>
                Ce dossier est vide.
              </p>
              {canWriteCurrent && currentFolderId && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary inline-flex items-center gap-2 text-white font-semibold cursor-pointer" style={{background:"#141824",padding:"0.6rem 1.25rem",borderRadius:"0.5rem",border:"none"}}
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
              className="text-center" style={{color:"var(--text-muted)",padding:"3rem"}}
            >
              Aucun résultat pour "{searchQuery}".
            </div>
          )}

        <GedBrowserView
          isSearching={isSearching}
          searchFolders={searchFolders}
          searchFiles={searchFiles}
          childFolders={childFolders}
          documents={documents}
          currentPath={currentPath}
          currentFolder={currentFolder}
          currentFolderId={currentFolderId}
          canWriteCurrent={canWriteCurrent}
          navigateTo={navigateTo}
          navigateToFromSearch={navigateToFromSearch}
          handleContextMenu={handleContextMenu}
          setPreviewFile={setPreviewFile}
          setUploadFile={setUploadFile}
          setShowUploadModal={setShowUploadModal}
        />
      </div>

      {/* Context Menu */}
      <GedContextMenu
        contextMenu={contextMenu}
        closeContextMenu={closeContextMenu}
        canWriteCurrent={canWriteCurrent}
        currentFolderId={currentFolderId}
        setShowNewFolderModal={setShowNewFolderModal}
        setShowUploadModal={setShowUploadModal}
        navigateTo={navigateTo}
        handleRenameFolder={handleRenameFolder}
        handleDeleteDossier={handleDeleteDossier}
        setPreviewFile={setPreviewFile}
        handleDownloadDocument={handleDownloadDocument}
        handleReplaceDocument={handleReplaceDocument}
        handleRenameDocument={handleRenameDocument}
        handleDeleteDocument={handleDeleteDocument}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Modals: New Folder, Upload, Rename */}
      <GedFolderModals
        showNewFolderModal={showNewFolderModal}
        setShowNewFolderModal={setShowNewFolderModal}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleCreateFolder={handleCreateFolder}
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        uploadFile={uploadFile}
        setUploadFile={setUploadFile}
        handleUploadFile={handleUploadFile}
        showRenameModal={showRenameModal}
        setShowRenameModal={setShowRenameModal}
        renameItem={renameItem}
        renameName={renameName}
        setRenameName={setRenameName}
        handleRenameSubmit={handleRenameSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Modal Corbeille */}
      <GedTrashModal
        showTrashModal={showTrashModal}
        setShowTrashModal={setShowTrashModal}
        loadingTrash={loadingTrash}
        normalizedTrashList={normalizedTrashList}
        trashSearchQuery={trashSearchQuery}
        setTrashSearchQuery={setTrashSearchQuery}
        trashTypeFilter={trashTypeFilter}
        setTrashTypeFilter={setTrashTypeFilter}
        filteredTrashItems={filteredTrashItems}
        trashTotalSize={trashTotalSize}
        isSuperAdmin={isSuperAdmin}
        handleRestoreTrash={handleRestoreTrash}
        handlePurgeTrash={handlePurgeTrash}
        handleEmptyAllTrash={handleEmptyAllTrash}
        handleRestoreAllTrash={handleRestoreAllTrash}
        getTrashOrigin={getTrashOrigin}
        getTrashAuthorAndRemaining={getTrashAuthorAndRemaining}
      />

            <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* Hidden input for replacing documents safely without orphan DOM nodes */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceFileChange}
        className="hidden"
        style={{ display: "none" }}
      />
    </div>
  );
}
