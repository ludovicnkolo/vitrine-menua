import React, { useState, useEffect } from "react";
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
  const [trashItems, setTrashItems] = useState({ dossiers: [], documents: [] });

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
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--text-main)",
            margin: 0,
          }}
        >
          Explorateur de Fichiers (GED)
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {canWriteCurrent && currentFolderId && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#141824",
                color: "#FFF",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Upload size={16} /> Importer
            </button>
          )}
          {canWriteCurrent && (
            <button
              type="button"
              onClick={() => setShowNewFolderModal(true)}
              className="btn btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#FFF",
                color: "#141824",
                border: "1px solid var(--border)",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Nouveau
            </button>
          )}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleOpenTrash}
              className="btn btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#FEF2F2",
                color: "var(--danger)",
                border: "1px solid #FECACA",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              <Trash size={16} /> {t("gedPage.title")}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchDossiers();
            }}
            className="btn btn-outline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#FFF",
              color: "#475569",
              border: "1px solid var(--border)",
              padding: "0.6rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
            title="Rafraîchir"
          >
            <RefreshCw size={16} />
          </button>

          <div style={{ position: "relative", width: "280px" }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: "10px",
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
                padding: "0.6rem 2rem 0.6rem 2.2rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "#F8FAFC",
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
        </div>
      </div>

      {/* Breadcrumb Navigation (Hide when searching) */}
      {!isSearching && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#F8FAFC",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => navigateUp(-1)}
            style={{
              background: "none",
              border: "none",
              color:
                currentFolderId === null
                  ? "var(--text-main)"
                  : "var(--primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              fontWeight: currentFolderId === null ? 600 : 400,
            }}
          >
            <Home size={18} /> Racine
          </button>

          {currentPath.map((path, index) => (
            <React.Fragment key={path.id}>
              <ChevronRight size={16} color="var(--text-muted)" />
              <button
                onClick={() => navigateUp(index)}
                style={{
                  background: "none",
                  border: "none",
                  color:
                    index === currentPath.length - 1
                      ? "var(--text-main)"
                      : "var(--primary)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: index === currentPath.length - 1 ? 600 : 400,
                }}
              >
                {path.name}
              </button>
            </React.Fragment>
          ))}
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
                    fontSize: "0.875rem",
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
                      onDoubleClick={() =>
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
                        onDoubleClick={() => setPreviewFile(doc.url)}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {/* Render Subfolders */}
            {childFolders.map((folder) => (
              <div
                key={folder.id}
                onDoubleClick={() => navigateTo(folder)}
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

            {/* Render Documents */}
            {documents.map((doc) => {
              const { Icon, color } = getFileIconAndColor(doc.name);
              return (
                <div
                  key={doc.id}
                  onDoubleClick={() => setPreviewFile(doc.url)}
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
                </div>
              );
            })}
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
                  fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                      fontSize: "0.875rem",
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
                      fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
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
                      fontSize: "0.875rem",
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
                      fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
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
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "1100px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
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
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Trash size={24} color="var(--danger)" /> {t("gedPage.title")}
              </h3>
              <button
                onClick={() => setShowTrashModal(false)}
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

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            >
              {loadingTrash ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  Chargement...
                </div>
              ) : trashItems.length === 0 ? (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  La corbeille est vide.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        background: "#F8FAFC",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "left",
                      }}
                    >
                      <th
                        style={{
                          padding: "1rem",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                        }}
                      >
                        {t("common.name")}
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                        }}
                      >
                        {t("gedPage.columns.target")}
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                        }}
                      >
                        {t("gedPage.columns.deletedAt")}
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textAlign: "right",
                        }}
                      >
                        {t("common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trashItems.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          style={{
                            padding: "1rem",
                            color: "var(--text-main)",
                            fontWeight: 500,
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={item.name}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            color: "var(--text-muted)",
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.itemType === "Document" ? "GED" : item.itemType}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button
                            onClick={() => handleRestoreTrash(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--primary)",
                              cursor: "pointer",
                              marginRight: "1rem",
                              fontWeight: 500,
                            }}
                          >
                            Restaurer
                          </button>
                          <button
                            onClick={() => handlePurgeTrash(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--danger)",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            Purger
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="btn btn-outline"
              >
                Fermer
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
}
