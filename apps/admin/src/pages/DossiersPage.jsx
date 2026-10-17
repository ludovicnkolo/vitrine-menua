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
  Share2,
  UserCheck,
  CheckCircle2,
  ArrowUp,
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
import SearchableDropdown from "../components/ui/SearchableDropdown";
import DossierDetailView from "../components/dossiers/DossierDetailView";
import EditDossierView from "../components/dossiers/EditDossierView";
import CreateDossierModal from "../components/modals/CreateDossierModal";

const DOSSIER_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente",
  TERMINE: "Terminé",
  CLOTURE: "Clôturé",
  ARCHIVE: "Archivé",
  BLOQUE: "Bloqué"
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

  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateDossierModal, setShowCreateDossierModal] = useState(false);

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
      const orig = editDossier._original || {};
      const payload = {};

      if (editDossier.name !== undefined && editDossier.name !== orig.name) {
        payload.name = editDossier.name;
      }
      if (
        editDossier.description !== undefined &&
        (editDossier.description || "") !== (orig.description || "")
      ) {
        payload.description = editDossier.description;
      }
      if (
        editDossier.traitantId !== undefined &&
        (editDossier.traitantId || "") !== (orig.traitantId || "")
      ) {
        payload.traitantId = editDossier.traitantId || null;
      }
      if (
        editDossier.status !== undefined &&
        editDossier.status !== orig.status
      ) {
        payload.status = editDossier.status;
      }

      if (Object.keys(payload).length === 0) {
        window.customAlert("Aucune modification détectée.");
        setEditDossier(null);
        return;
      }

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

  if (consultDossier) {
    return (
      <DossierDetailView
        consultDossier={consultDossier}
        setConsultDossier={setConsultDossier}
        dbTasks={dbTasks}
        dbClients={dbClients}
        dbUsers={dbUsers}
        currentUser={currentUser}
        fetchDossiers={fetchDossiers}
        handleStatusAction={handleStatusAction}
        getAllowedDossierStatuses={getAllowedDossierStatuses}
        onBack={() => {
          setConsultDossier(null);
          setPendingStatus("");
        }}
      />
    );
  }

  if (editDossier) {
    return (
      <EditDossierView
        editDossier={editDossier}
        setEditDossier={setEditDossier}
        dbTasks={dbTasks}
        dbClients={dbClients}
        dbUsers={dbUsers}
        currentUser={currentUser}
        handleUpdateDossier={handleUpdateDossier}
        handleStatusAction={handleStatusAction}
        getAllowedDossierStatuses={getAllowedDossierStatuses}
        setPreviewFile={setPreviewFile}
        onCancel={() => setEditDossier(null)}
      />
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
        className="flex flex-wrap gap-4 mb-6 p-4" style={{background:"var(--surface)",borderRadius:"8px",border:"1px solid var(--border)"}}
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
            className="input-field w-full text-[var(--text-main)]" style={{padding:"0.75rem 1rem 0.75rem 2.5rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--bg-main)"}}
          />
        </div>
        <select
          className="input-field text-[var(--text-main)] cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-main)",
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
          className="input-field text-[var(--text-main)] cursor-pointer"
          value={filterOrigine}
          onChange={(e) => setFilterOrigine(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-main)",
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
              <th className="text-left" style={{width:"28%",paddingLeft:"1.25rem"}}>Dossier</th>
              <th className="text-center" style={{width:"18%"}}>Cible</th>
              <th className="text-center" style={{width:"18%"}}>Assigné à</th>
              <th className="text-center" style={{width:"120px"}}>Statut</th>
              <th className="table-date-cell text-center" style={{width:"165px"}}>Créé le</th>
              <th className="text-center" style={{width:"80px"}}>Actions</th>
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
                  const dCible =
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
                        : "Interne / Général";
                  const dAssigneA =
                    d.traitant?.name ||
                    dbUsers.find((u) => u.id === d.traitantId)?.name ||
                    "Non assigné";
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
                          className="truncate-name text-[var(--text-main)] block font-medium" style={{maxWidth:"100%"}}
                          title={d.name}
                        >
                          {d.name}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className="truncate-name text-center" style={{color:"var(--text-main)",maxWidth:"100%",fontSize:"0.85rem"}}
                          title={dCible}
                        >
                          {dCible}
                        </div>
                      </td>
                      <td className="text-center">
                        <div
                          className="truncate-name text-center" style={{maxWidth:"100%",fontSize:"0.85rem"}}
                          title={dAssigneA}
                        >
                          {dAssigneA}
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
                              setEditDossier({
                                ...d,
                                _original: {
                                  name: d.name || "",
                                  description: d.description || "",
                                  status: d.status || "",
                                  traitantId: d.traitantId || "",
                                },
                              });
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

      <CreateDossierModal
        isOpen={showCreateDossierModal}
        onClose={() => setShowCreateDossierModal(false)}
        onSuccess={fetchDossiers}
        dbClients={dbClients}
        dbUsers={dbUsers}
      />
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

