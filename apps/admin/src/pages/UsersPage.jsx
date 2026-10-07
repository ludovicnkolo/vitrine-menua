import { getSafeApiUrl, uploadFile, formatDate } from "../utils/helpers";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MoreVertical,
  Search,
  Mail,
  MessageSquare,
  Pencil,
  Eye,
  Trash,
  Shield,
  Download,
  File,
  Loader,
  X,
  BarChart3,
  Activity,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Clock,
  Folder,
  CheckSquare,
  ListTodo,
  Filter,
  Lock,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react";
import ActionDropdown from "../components/ActionDropdown";
import UserFormFields from "../components/UserFormFields";
import ClientFormFields from "../components/ClientFormFields";
import { getStatusBadge, getRoleBadge } from "../utils/helpers";

const AVAILABLE_PERMISSIONS = {
  MESSAGES_VIEW: "Consulter les messages",
  MESSAGES_PROCESS: "Traiter les messages",
  DOSSIERS_MANAGE: "Gérer les dossiers",
  TACHES_MANAGE: "Créer et gérer les tâches",
  TACHES_VIEW_ALL: "Consulter toutes les tâches",
  TACHES_VALIDATE: "Valider les tâches",
  TACHES_VIEW_ASSIGNED: "Voir ses tâches assignées",
  TACHES_EDIT_ASSIGNED: "Modifier ses tâches assignées",
  CLIENTS_MANAGE: "Gérer les clients",
  USERS_MANAGE: "Gérer les utilisateurs",
  ROLES_MANAGE: "Gérer les rôles",
};

const formatPermissions = (perms) => {
  if (!perms) return "Aucune permission";
  try {
    let parsed = typeof perms === "string" ? JSON.parse(perms) : perms;
    if (!Array.isArray(parsed)) return "Aucune permission";
    if (parsed.length === 0) return "Aucune permission";
    return parsed.map((p) => AVAILABLE_PERMISSIONS[p] || p).join(", ");
  } catch (e) {
    return perms;
  }
};

const getParsedPermissionsList = (perms) => {
  if (!perms) return [];
  try {
    let parsed = typeof perms === "string" ? JSON.parse(perms) : perms;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => AVAILABLE_PERMISSIONS[p] || p);
  } catch (e) {
    return typeof perms === "string" ? perms.split(",").map((s) => s.trim()) : [];
  }
};

const getUserInitials = (name) => {
  if (!name) return "U";
  const cleanedParts = name.trim().split(/\s+/).filter((p) => p !== "-" && p !== "–" && p !== "—" && p !== ".");
  if (cleanedParts.length === 0) return "U";
  if (cleanedParts.length === 1) return cleanedParts[0].substring(0, 2).toUpperCase();
  const first = cleanedParts[0][0];
  const second = cleanedParts[1] ? cleanedParts[1][0] : cleanedParts[cleanedParts.length - 1][0];
  return (first + second).toUpperCase();
};

const UsersPage = ({ forceTab }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(forceTab || "interne");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [consultUser, setConsultUser] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalType, setExternalType] = useState("Particulier");
  const [consultExternal, setConsultExternal] = useState(null);
  const [editExternal, setEditExternal] = useState(null);
  const [editUserLangOpen, setEditUserLangOpen] = useState(false);
  const menuRef = useRef(null);

  // Activity Stats Modal state
  const [activityStatsModal, setActivityStatsModal] = useState({
    open: false,
    type: "user", // "user" or "client"
    target: null,
  });
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsPreset, setStatsPreset] = useState("all");
  const [statsStartDate, setStatsStartDate] = useState("");
  const [statsEndDate, setStatsEndDate] = useState("");
  const [statsError, setStatsError] = useState(null);

  const fetchActivityStats = async (type, id, start = "", end = "") => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const token = sessionStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);

      const endpoint =
        type === "user"
          ? `/api/crm/users/${id}/activity-stats`
          : `/api/crm/clients/${id}/activity-stats`;

      const res = await fetch(
        getSafeApiUrl(`${endpoint}?${params.toString()}`),
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Erreur lors de la récupération des données");
      }
      const data = await res.json();
      setStatsData(data);
    } catch (err) {
      console.error("Erreur stats:", err);
      setStatsError(err.message || "Erreur de chargement");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleOpenActivityStats = (type, target) => {
    setActivityStatsModal({ open: true, type, target });
    setStatsPreset("all");
    setStatsStartDate("");
    setStatsEndDate("");
    setStatsError(null);
    fetchActivityStats(type, target.id, "", "");
  };

  const handleApplyStatsFilter = () => {
    if (statsStartDate && statsEndDate && new Date(statsStartDate) > new Date(statsEndDate)) {
      setStatsError("La date de début doit être antérieure ou égale à la date de fin.");
      return;
    }
    setStatsPreset("custom");
    setStatsError(null);
    if (activityStatsModal.target) {
      fetchActivityStats(
        activityStatsModal.type,
        activityStatsModal.target.id,
        statsStartDate,
        statsEndDate,
      );
    }
  };

  const handleResetStatsFilter = () => {
    handlePresetStatsPeriod("all");
  };

  const handlePresetStatsPeriod = (preset) => {
    setStatsPreset(preset);
    setStatsError(null);
    const now = new Date();
    let start = "";
    let end = "";

    const pad = (n) => String(n).padStart(2, "0");

    if (preset === "month") {
      const year = now.getFullYear();
      const month = now.getMonth();
      start = `${year}-${pad(month + 1)}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      end = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
    } else if (preset === "year") {
      const year = now.getFullYear();
      start = `${year}-01-01`;
      end = `${year}-12-31`;
    } else {
      start = "";
      end = "";
    }

    setStatsStartDate(start);
    setStatsEndDate(end);

    if (activityStatsModal.target) {
      fetchActivityStats(
        activityStatsModal.type,
        activityStatsModal.target.id,
        start,
        end,
      );
    }
  };

  const handleCloseActivityStats = () => {
    setActivityStatsModal({ open: false, type: "user", target: null });
    setStatsData(null);
    setStatsPreset("all");
    setStatsError(null);
  };

  const renderReadOnlyField = (label, value) => (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "0.25rem",
          
          fontWeight: 500,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </label>
      <div
        style={{
          width: "100%",
          padding: "0.5rem",
          background: "#F8FAFC",
          borderRadius: "4px",
          border: "1px solid var(--border)",
          minHeight: "38px",
        }}
      >
        {value || ""}
      </div>
    </div>
  );

  // Real API states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUserStatus, setFilterUserStatus] = useState("all");
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setRawErrorMsg] = useState(null);
  const setErrorMsg = (msg) => {
    setRawErrorMsg(msg);
    if (msg) setTimeout(() => setRawErrorMsg(null), 3000);
  };
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    telephone: "",
    roleId: "",
    lieuResidence: "",
    experienceCle: "",
    status: "Invitation envoyée",
    langues: "",
    profile: "",
    // Champs V3 — Organisation & Fiche interne
    poleActivite: "",
    matricule: "",
    emailPro: "",
    fonction: "",
  });
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    telephone: "",
    contactSecondaire: "",
    secteurActivite: "",
    description: "",
    siret: "",
    raisonSociale: "",
    emailEntreprise: "",
    telephoneEntreprise: "",
  });

  const [rolesList, setRolesList] = useState([]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: "Bearer " + token };
      const [rUsers, rClients, rRoles] = await Promise.all([
        fetch(getSafeApiUrl("/api/crm/users"), { headers })
          .then((r) => r.json())
          .catch(() => []),
        fetch(getSafeApiUrl("/api/crm/clients"), { headers })
          .then((r) => r.json())
          .catch(() => []),
        fetch(getSafeApiUrl("/api/crm/roles"), { headers })
          .then((r) => r.json())
          .catch(() => []),
      ]);
      setUsers(Array.isArray(rUsers) ? rUsers : []);
      setClients(Array.isArray(rClients) ? rClients : []);
      setRolesList(
        Array.isArray(rRoles)
          ? rRoles.filter((r) => r.name !== "Super-administrateur")
          : [],
      );
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  const submitApiRequest = async (
    url,
    method,
    payload,
    onSuccess,
    errorText,
  ) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(getSafeApiUrl(url), {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("adminToken"),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSuccess();
        fetchData();
      } else {
        // Read the actual API error message
        try {
          const errData = await res.json();
          const message = errData.error || errorText;
          setErrorMsg(message);
          window.customAlert(message, "Erreur");
        } catch (e) {
          setErrorMsg(errorText);
          window.customAlert(errorText, "Erreur");
        }
      }
    } catch (e) {
      setErrorMsg("Erreur réseau");
      window.customAlert("Erreur réseau lors de la communication avec le serveur.", "Erreur");
    }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.telephone || !newUser.roleId || !newUser.lieuResidence || !newUser.experienceCle || !newUser.langues)
      return setErrorMsg("Veuillez remplir tous les champs obligatoires (marqués d'un astérisque rouge).");

    const emailTrimmed = newUser.email.trim().toLowerCase();
    const existing = users.find(
      (u) => u.email && u.email.trim().toLowerCase() === emailTrimmed,
    );
    if (existing) {
      const msg = `Impossible d'inscrire ce membre : l'adresse email "${newUser.email.trim()}" est déjà attribuée à ${existing.name}.`;
      setErrorMsg(msg);
      window.customAlert(msg, "Email déjà existant");
      return;
    }

    await submitApiRequest(
      "/api/crm/users",
      "POST",
      { ...newUser, email: emailTrimmed, lastLogin: "Jamais connecté" },
      () => {
        setShowModal(false);
        setNewUser({
          name: "",
          email: "",
          telephone: "",
          roleId: "",
          lieuResidence: "",
          experienceCle: "",
          status: "Invitation envoyée",
          langues: "",
          profile: "",
          // Champs V3 — Organisation & Fiche interne
          poleActivite: "",
          matricule: "",
          emailPro: "",
          fonction: "",
        });
      },
      "Erreur lors de la création",
    );
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email)
      return setErrorMsg("Veuillez remplir le nom et l'email au minimum.");
    await submitApiRequest(
      "/api/crm/clients",
      "POST",
      { ...newClient, type: externalType, status: newClient.status || "Actif" },
      () => {
        setShowExternalModal(false);
        setNewClient({
          name: "",
          email: "",
          telephone: "",
          contactSecondaire: "",
          secteurActivite: "",
          description: "",
          siret: "",
          raisonSociale: "",
          emailEntreprise: "",
          telephoneEntreprise: "",
        });
      },
      "Erreur lors de la création",
    );
  };

  const handleDeleteUser = async (id) => {
    if (
      !(await window.customConfirm(
        "Voulez-vous vraiment supprimer ce membre interne ?",
        "Suppression",
      ))
    )
      return;
    try {
      const res = await fetch(
        getSafeApiUrl(`/api/crm/users/${encodeURIComponent(id)}`),
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("adminToken"),
          },
        },
      );
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
    setOpenMenuId(null);
  };

  const handleDeleteClient = async (id) => {
    if (
      !(await window.customConfirm(
        "Voulez-vous vraiment supprimer ce client ?",
        "Suppression",
      ))
    )
      return;
    try {
      const res = await fetch(
        getSafeApiUrl(`/api/crm/clients/${encodeURIComponent(id)}`),
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("adminToken"),
          },
        },
      );
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
    setOpenMenuId(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const emailTrimmed = editUser.email?.trim().toLowerCase();
    const existing = users.find(
      (u) =>
        u.id !== editUser.id &&
        u.email &&
        u.email.trim().toLowerCase() === emailTrimmed,
    );
    if (existing) {
      const msg = `Impossible d'enregistrer : l'adresse email "${editUser.email?.trim()}" est déjà attribuée à un autre membre (${existing.name}).`;
      setErrorMsg(msg);
      window.customAlert(msg, "Email déjà existant");
      return;
    }

    await submitApiRequest(
      `/api/crm/users/${encodeURIComponent(editUser.id)}`,
      "PATCH",
      {
        name: editUser.name,
        email: emailTrimmed,
        roleId: editUser.roleId,
        profile: editUser.profile,
        status: editUser.status,
        telephone: editUser.telephone,
        lieuResidence: editUser.lieuResidence,
        experienceCle: editUser.experienceCle,
        langues: editUser.langues,
        formations: editUser.formations,
        // Champs V3 — Organisation & Fiche interne
        poleActivite: editUser.poleActivite || null,
        matricule: editUser.matricule || null,
        emailPro: editUser.emailPro || null,
        fonction: editUser.fonction || null,
      },
      () => setEditUser(null),
      "Erreur lors de la modification",
    );
  };

  const handleTriggerPasswordReset = async (userId) => {
    if (
      !(await window.customConfirm(
        "Voulez-vous vraiment déclencher une réinitialisation de mot de passe pour cet utilisateur ? Un email lui sera envoyé.",
        "Réinitialisation de mot de passe",
      ))
    )
      return;
    await submitApiRequest(
      `/api/crm/users/${encodeURIComponent(userId)}/trigger-password-reset`,
      "POST",
      {},
      () => {
        window.customAlert("Un lien de réinitialisation a été envoyé à l'utilisateur.", "Succès");
        setConsultUser(null);
      },
      "Erreur lors du déclenchement de la réinitialisation",
    );
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    await submitApiRequest(
      `/api/crm/clients/${encodeURIComponent(editExternal.id)}`,
      "PATCH",
      {
        name: editExternal.name,
        email: editExternal.email,
        telephone: editExternal.telephone,
        contactSecondaire: editExternal.contactSecondaire,
        secteurActivite: editExternal.secteurActivite,
        description: editExternal.description,
        type: editExternal.type,
        siret: editExternal.siret,
        raisonSociale: editExternal.raisonSociale,
        emailEntreprise: editExternal.emailEntreprise,
        telephoneEntreprise: editExternal.telephoneEntreprise,
        status: editExternal.status,
      },
      () => setEditExternal(null),
      "Erreur lors de la modification",
    );
  };

  const isAnyModalOpen =
    showModal ||
    showExternalModal ||
    editUser ||
    editExternal ||
    consultUser ||
    consultExternal;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".action-menu-trigger")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const renderDropdown = (id, userObj = null, isExternal = false) => {
    return (
      <ActionDropdown
        isOpen={openMenuId === id}
        menuRef={menuRef}
        width="150px"
      >
        <button
          type="button"
          className="dropdown-item"
          onClick={() => {
            setOpenMenuId(null);
            if (userObj) {
              if (isExternal) setConsultExternal(userObj);
              else setConsultUser(userObj);
            }
          }}
        >
          <Eye size={14} /> {t("common.view", "Consulter")}
        </button>
        <button
          type="button"
          className="dropdown-item"
          onClick={() => {
            setOpenMenuId(null);
            if (userObj) {
              if (isExternal) {
                setEditExternal({
                  ...userObj,
                  raisonSociale: userObj.entreprise?.raisonSociale || userObj.raisonSociale || (userObj.type !== "Particulier" ? userObj.name : "") || "",
                  siret: userObj.entreprise?.siret || userObj.siret || "",
                  emailEntreprise: userObj.entreprise?.emailEntreprise || userObj.emailEntreprise || "",
                  telephoneEntreprise: userObj.entreprise?.telephoneEntreprise || userObj.telephoneEntreprise || "",
                  type: userObj.type || "Société",
                  contactSecondaire: userObj.contactSecondaire || "",
                });
              } else setEditUser(userObj);
            }
          }}
        >
          <Pencil size={14} /> {t("common.edit", "Modifier")}
        </button>
        {userObj?.role?.name !== "Super-administrateur" && (
          <button
            type="button"
            className="dropdown-item danger"
            onClick={() => {
              setOpenMenuId(null);
              if (userObj) {
                if (isExternal) handleDeleteClient(userObj.id);
                else handleDeleteUser(userObj.id);
              }
            }}
          >
            <Trash size={14} /> {t("common.delete", "Supprimer")}
          </button>
        )}
      </ActionDropdown>
    );
  };

  return (
    <div>
      {/* Modal Ajouter Externe */}
      {showExternalModal && tab === "externe" && (
        <div className="fade-in" style={{ padding: "1rem" }}>
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
                onClick={() => setShowExternalModal(false)}
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", color: "var(--text-main)" }}
              >
                ← Retour
              </button>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
                Ajouter un Client
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginBottom: "1.5rem",
                padding: "0.5rem",
                background: "#F8FAFC",
                borderRadius: "8px",
                width: "fit-content",
              }}
            >
              <label
                htmlFor="ext-type-particulier"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  id="ext-type-particulier"
                  type="radio"
                  name="ext_type"
                  checked={externalType === "Particulier"}
                  onChange={() => setExternalType("Particulier")}
                />
                <span style={{ fontWeight: 500 }}>Particulier</span>
              </label>
              <label
                htmlFor="ext-type-societe"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  id="ext-type-societe"
                  type="radio"
                  name="ext_type"
                  checked={externalType === "Société"}
                  onChange={() => setExternalType("Société")}
                />
                <span style={{ fontWeight: 500 }}>Société</span>
              </label>
            </div>

            <form
              onSubmit={handleCreateClient}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {errorMsg && (
                <div style={{ color: "red",  }}>
                  {errorMsg}
                </div>
              )}
              <ClientFormFields
                client={newClient}
                setClient={setNewClient}
                type={externalType}
                isEdit={false}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowExternalModal(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? "Création..." : "Créer le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Externe */}
      {editExternal && (() => {
        const clientTitle = editExternal.entreprise?.raisonSociale || editExternal.raisonSociale || editExternal.name || "Client";

        const inputStyle = {
          width: "100%",
          padding: "0.6rem 0.85rem",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          fontSize: "0.9rem",
          color: "var(--text-main)",
          outline: "none",
          boxSizing: "border-box",
        };

        const labelStyle = {
          display: "block",
          marginBottom: "0.35rem",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#334155",
        };

        return (
          <form
            onSubmit={handleUpdateClient}
            className="fade-in"
            style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Header Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Modifier le Client : {clientTitle}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Édition des coordonnées de l'entreprise, des interlocuteurs et du compte client
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setEditExternal(null)}
                  className="btn btn-outline"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: 500,
                    backgroundColor: "#FFFFFF",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "#1E3A8A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Check size={16} strokeWidth={2.5} />
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Body: Two columns layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* Left Column: Entreprise + Notes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Card 1: Informations de l'Entreprise (Structure) */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      1. Informations de l'Entreprise (Structure)
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Raison sociale, identifiants légaux et typologie
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>
                        Nom de la société / Raison Sociale <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editExternal.raisonSociale || ""}
                        onChange={(e) => setEditExternal({ ...editExternal, raisonSociale: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Numéro SIRET</label>
                      <input
                        type="text"
                        placeholder="Ex : 123 456 789 00012"
                        value={editExternal.siret || ""}
                        onChange={(e) => setEditExternal({ ...editExternal, siret: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Type de client</label>
                      <select
                        value={editExternal.type || "Société"}
                        onChange={(e) => setEditExternal({ ...editExternal, type: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Société">Société</option>
                        <option value="Particulier">Particulier</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Secteur d'activité</label>
                      <input
                        type="text"
                        placeholder="Ex : Conseil en technologies, Restauration..."
                        value={editExternal.secteurActivite || ""}
                        onChange={(e) => setEditExternal({ ...editExternal, secteurActivite: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={labelStyle}>Email entreprise</label>
                        <input
                          type="email"
                          placeholder="contact@alpha-corp.fr"
                          value={editExternal.emailEntreprise || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, emailEntreprise: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Téléphone entreprise</label>
                        <input
                          type="tel"
                          placeholder="Ex : 01 23 45 67 89"
                          value={editExternal.telephoneEntreprise || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, telephoneEntreprise: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Notes & Description Client */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      3. Notes & Description Client
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Accords-cadres et spécificités de la relation commerciale
                    </p>
                  </div>

                  <div>
                    <label style={labelStyle}>Description client</label>
                    <textarea
                      rows={5}
                      placeholder="Saisissez les accords commerciaux, conditions particulières ou contexte client..."
                      value={editExternal.description || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, description: e.target.value })}
                      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Contacts & Interlocuteurs Référents */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                    2. Contacts & Interlocuteurs Référents
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Personnes à contacter pour les opérations et la facturation
                  </p>
                </div>

                {/* Subcard 1: Contact Principal */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1E3A8A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    CONTACT PRINCIPAL (RÉFÉRENT)
                  </span>

                  <div>
                    <label style={labelStyle}>
                      Nom du contact <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editExternal.name || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Email du contact <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={editExternal.email || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Téléphone direct du contact</label>
                    <input
                      type="tel"
                      placeholder="0102030405"
                      value={editExternal.telephone || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, telephone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Subcard 2: Contact Secondaire */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    CONTACT SECONDAIRE / SUPPLÉANT
                  </span>

                  <div>
                    <label style={labelStyle}>Seconde personne à contacter</label>
                    <input
                      type="text"
                      placeholder="Ex : Jean Dupont (Directeur des opérations)"
                      value={editExternal.contactSecondaire || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, contactSecondaire: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Email ou téléphone secondaire</label>
                    <input
                      type="text"
                      placeholder="Ex : j.dupont@alpha-corp.fr"
                      value={editExternal.contactSecondaireDetails || ""}
                      onChange={(e) => setEditExternal({ ...editExternal, contactSecondaireDetails: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        );
      })()}

      {/* Modal Consulter Externe */}
      {consultExternal && (() => {
        const isSociete = consultExternal.type !== "Particulier" && consultExternal.type !== "PARTICULIER";
        const clientDisplayName = isSociete
          ? (consultExternal.entreprise?.raisonSociale || consultExternal.name || "Client")
          : (consultExternal.name || "Client");
        const clientEmail = isSociete
          ? (consultExternal.entreprise?.emailEntreprise || consultExternal.email || "Non renseigné")
          : (consultExternal.email || "Non renseigné");
        const clientPhone = isSociete
          ? (consultExternal.entreprise?.telephoneEntreprise || consultExternal.telephone)
          : consultExternal.telephone;
        const clientSiret = isSociete
          ? consultExternal.entreprise?.siret
          : null;

        return (
          <div className="fade-in" style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Left: Avatar + Title + Subtitle */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    border: "2px solid #DBEAFE",
                    color: "#1D4ED8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                  }}
                >
                  {getUserInitials(clientDisplayName)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                    <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {clientDisplayName}
                    </h1>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        backgroundColor: "#EFF6FF",
                        border: "1px solid #DBEAFE",
                        color: "#2563EB",
                        padding: "0.15rem 0.65rem",
                        borderRadius: "16px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {isSociete ? "Compte Client" : "Compte Client (Particulier)"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span>{clientEmail}</span>
                    <span>•</span>
                    <span>Téléphone : {clientPhone || "Non renseigné"}</span>
                    {isSociete && (
                      <>
                        <span>•</span>
                        <span>SIRET : {clientSiret || "Non renseigné"}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setConsultExternal(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.85rem",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "var(--text-main)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Retour
                </button>
              </div>
            </div>

            {/* Body: Two columns layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* Left Column: Informations Administratives & Légales */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Informations Administratives & Légales
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Données d'enregistrement et identité de l'entreprise
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {/* NOM DE LA SOCIETE / NOM COMPLET */}
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {isSociete ? "Nom de la société" : "Nom complet"}
                    </span>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                      {clientDisplayName}
                    </span>
                  </div>

                  {/* NUMERO SIRET */}
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Numéro SIRET
                    </span>
                    <span style={{ fontSize: "0.95rem", fontWeight: clientSiret ? 600 : 400, color: clientSiret ? "var(--text-main)" : "#94A3B8" }}>
                      {clientSiret || "- Non renseigné"}
                    </span>
                  </div>

                  {/* SECTEUR D'ACTIVITÉ */}
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Secteur d'activité
                    </span>
                    <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.secteurActivite ? 600 : 400, color: consultExternal.secteurActivite ? "var(--text-main)" : "#94A3B8" }}>
                      {consultExternal.secteurActivite || "- Non renseigné"}
                    </span>
                  </div>

                  {/* CONTACT SECONDAIRE */}
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Contact secondaire
                    </span>
                    <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.contactSecondaire ? 600 : 400, color: consultExternal.contactSecondaire ? "var(--text-main)" : "#94A3B8" }}>
                      {consultExternal.contactSecondaire || "- Non renseigné"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Coordonnées de Contact & Présentation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Top Card: Coordonnées de Contact */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      Coordonnées de Contact
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Canaux d'échange avec l'entreprise
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {/* EMAIL */}
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Email de l'entreprise
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                        {clientEmail}
                      </span>
                    </div>

                    {/* TELEPHONE */}
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Téléphone de l'entreprise
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: clientPhone ? 600 : 400, color: clientPhone ? "var(--text-main)" : "#94A3B8" }}>
                        {clientPhone || "- Non renseigné"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card: Présentation & Notes Client */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      Présentation & Notes Client
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Contexte commercial et historique
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.85rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      minHeight: "100px",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Description de l'entreprise
                    </span>
                    {consultExternal.description ? (
                      <span style={{ fontSize: "0.95rem", color: "var(--text-main)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                        {consultExternal.description}
                      </span>
                    ) : (
                      <div style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.55 }}>
                        <p style={{ margin: 0 }}>Aucune description ou note de cadrage n'a été saisie pour ce client.</p>
                        <p style={{ margin: "0.25rem 0 0 0" }}>Les informations relatives aux besoins et aux accords-cadres apparaîtront ici.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action: Activity Stats */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => handleOpenActivityStats("client", consultExternal)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#EFF6FF",
                    color: "#1D4ED8",
                    border: "1px solid #BFDBFE",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#DBEAFE";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#EFF6FF";
                  }}
                >
                  <Activity size={18} />
                  Consulter les statistiques d'activité du client (Dossiers, Missions, Tâches)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Ajouter Interne */}
      {showModal && tab === "interne" && (
        <div className="fade-in" style={{ padding: "1rem" }}>
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
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", color: "var(--text-main)" }}
              >
                ← Retour
              </button>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
                Ajouter un Membre Interne
              </h2>
            </div>
            <form
              onSubmit={handleCreateUser}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {errorMsg && (
                <div style={{ color: "red",  }}>
                  {errorMsg}
                </div>
              )}
              <UserFormFields
                user={newUser}
                setUser={setNewUser}
                rolesList={rolesList}
                isEdit={false}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? "Création..." : "Créer le membre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Interne */}
      {editUser && (() => {
        const AVAILABLE_LANGUAGES = [
          "Allemand", "Anglais", "Arabe", "Coréen", "Espagnol", "Français", 
          "Italien", "Japonais", "Mandarin", "Néerlandais", "Polonais", "Portugais"
        ];

        const selectedLangs = editUser.langues
          ? editUser.langues.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        const toggleEditUserLang = (lang) => {
          const next = selectedLangs.includes(lang)
            ? selectedLangs.filter((l) => l !== lang)
            : [...selectedLangs, lang];
          setEditUser({ ...editUser, langues: next.join(", ") });
        };

        const inputStyle = {
          width: "100%",
          padding: "0.6rem 0.85rem",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          fontSize: "0.9rem",
          color: "var(--text-main)",
          outline: "none",
          boxSizing: "border-box",
        };

        const labelStyle = {
          display: "block",
          marginBottom: "0.35rem",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#334155",
        };

        return (
          <form
            onSubmit={handleUpdateUser}
            className="fade-in"
            style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Header Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Modifier le Collaborateur : {editUser.name || "Collaborateur"}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Mettez à jour les informations du profil, le rôle attribué et les coordonnées professionnelles
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditUser(null);
                    setEditUserLangOpen(false);
                  }}
                  className="btn btn-outline"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: 500,
                    backgroundColor: "#FFFFFF",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "#1E3A8A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Check size={16} strokeWidth={2.5} />
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Body: Two columns layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* Left Column: Coordonnées & Statut d'Accès */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Card 1: Coordonnées & Données Personnelles */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      1. Coordonnées & Données Personnelles
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Informations d'identification et de contact
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>
                        Nom complet <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editUser.name || ""}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Email professionnel <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={editUser.email || ""}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Numéro de téléphone <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex : 06 12 34 56 78"
                        value={editUser.telephone || ""}
                        onChange={(e) => setEditUser({ ...editUser, telephone: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Lieu de résidence <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Paris, France"
                        value={editUser.lieuResidence || ""}
                        onChange={(e) => setEditUser({ ...editUser, lieuResidence: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    {/* Langues parlées */}
                    <div style={{ position: "relative" }}>
                      <label style={labelStyle}>
                        Langues parlées <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <div
                        onClick={() => setEditUserLangOpen(!editUserLangOpen)}
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: selectedLangs.length ? "inherit" : "#94A3B8",
                          }}
                        >
                          {selectedLangs.length > 0
                            ? selectedLangs.join(", ")
                            : "Sélectionner des langues (ex : Français, Anglais...)"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>▼</span>
                      </div>

                      {editUserLangOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "#FFFFFF",
                            border: "1px solid #CBD5E1",
                            borderRadius: "8px",
                            marginTop: "4px",
                            maxHeight: "190px",
                            overflowY: "auto",
                            zIndex: 50,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            padding: "0.25rem",
                          }}
                        >
                          {AVAILABLE_LANGUAGES.map((lang) => (
                            <label
                              key={lang}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.45rem 0.65rem",
                                cursor: "pointer",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                                background: selectedLangs.includes(lang) ? "#EFF6FF" : "transparent",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedLangs.includes(lang)}
                                onChange={() => toggleEditUserLang(lang)}
                              />
                              {lang}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card 2: Compte & Statut d'Accès */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      2. Compte & Statut d'Accès
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Affectation du rôle système et état d'activation
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>
                        Rôle attribué <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <select
                        required
                        value={editUser.roleId || ""}
                        onChange={(e) => setEditUser({ ...editUser, roleId: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Sélectionner un rôle...</option>
                        {rolesList.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Statut du collaborateur <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <select
                        required
                        value={editUser.status || "Invitation envoyée"}
                        onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Invitation envoyée">Invitation envoyée</option>
                        <option value="Activation en attente">Activation en attente</option>
                        <option value="Actif">Actif</option>
                        <option value="Suspendu / Inactif">Suspendu / Inactif</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Parcours Professionnel & Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Card 3: Parcours Professionnel & Description */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      3. Parcours Professionnel & Description
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Qualifications, historique et présentation du profil
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>
                        Expérience clé <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : 5 ans d'expérience en gestion d'opérations"
                        value={editUser.experienceCle || ""}
                        onChange={(e) => setEditUser({ ...editUser, experienceCle: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Formations / Diplômes</label>
                      <input
                        type="text"
                        placeholder="Ex : Master Management & Finance"
                        value={editUser.formations || ""}
                        onChange={(e) => setEditUser({ ...editUser, formations: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Description du profil</label>
                      <textarea
                        rows={7}
                        placeholder="Saisissez une courte biographie ou des notes sur les compétences clés..."
                        value={editUser.profile || ""}
                        onChange={(e) => setEditUser({ ...editUser, profile: e.target.value })}
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Info Callout */}
                <div
                  style={{
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: "8px",
                    padding: "1rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <Info size={18} style={{ color: "#2563EB", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1E40AF", marginBottom: "0.25rem" }}>
                      Information sur les champs obligatoires
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#2563EB", lineHeight: 1.45 }}>
                      Les champs marqués d'un astérisque rouge (*) sont obligatoires pour valider l'enregistrement et l'envoi des accès au collaborateur.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        );
      })()}

      {/* Consultation d'un Collaborateur Interne */}
      {consultUser && (
        <div className="fade-in" style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Left: Avatar + Name + Subtitle */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#EFF6FF",
                  border: "2px solid #DBEAFE",
                  color: "#1D4ED8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                }}
              >
                {getUserInitials(consultUser.name)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                  <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {consultUser.name}
                  </h1>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      backgroundColor: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      color: "#059669",
                      padding: "0.15rem 0.65rem",
                      borderRadius: "16px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ fontSize: "0.65rem" }}>●</span>
                    {consultUser.status || "Actif"}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{consultUser.email}</span>
                  <span>•</span>
                  <span>Rôle : <strong>{consultUser.role?.name || consultUser.role || "Non renseigné"}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleTriggerPasswordReset(consultUser.id)}
                className="btn btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  color: "#334155",
                  borderColor: "#CBD5E1",
                  backgroundColor: "#FFFFFF",
                  fontWeight: 500,
                }}
              >
                <Lock size={14} />
                Réinitialiser mot de passe
              </button>
              <button
                type="button"
                onClick={() => handleOpenActivityStats("user", consultUser)}
                className="btn btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  borderColor: "#0284C7",
                  color: "#0284C7",
                  backgroundColor: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                <BarChart3 size={15} />
                Bilan d'activité
              </button>
              <button
                type="button"
                onClick={() => setConsultUser(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.85rem",
                  padding: "0.5rem 1.25rem",
                  backgroundColor: "var(--text-main)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Retour
              </button>
            </div>
          </div>

          {/* Body: Two columns layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Card: Coordonnées & Informations Personnelles */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Coordonnées & Informations Personnelles
                </h2>
                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Données de contact et profil collaborateur
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* NOM COMPLET */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Nom complet
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                    {consultUser.name}
                  </span>
                </div>

                {/* EMAIL PROFESSIONNEL */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Email professionnel
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                    {consultUser.email}
                  </span>
                </div>

                {/* NUMÉRO DE TÉLÉPHONE */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Numéro de téléphone
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.telephone ? 600 : 400, color: consultUser.telephone ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.telephone ? consultUser.telephone : "- Non renseigné"}
                  </span>
                </div>

                {/* LIEU DE RÉSIDENCE */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Lieu de résidence
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.lieuResidence ? 600 : 400, color: consultUser.lieuResidence ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.lieuResidence ? consultUser.lieuResidence : "- Non renseigné"}
                  </span>
                </div>

                {/* LANGUES PARLÉES */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Langues parlées
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.langues ? 600 : 400, color: consultUser.langues ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.langues ? consultUser.langues : "- Non renseigné"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Two stacked cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Card 2A: Rôle & Permissions Système */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Rôle & Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Droits d'accès et habilitations hérités du rôle
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem" }}>
                      Rôle attribué
                    </span>
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        padding: "0.45rem 1rem",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        display: "inline-block",
                      }}
                    >
                      {consultUser.role?.name || consultUser.role || "Non renseigné"}
                    </div>
                  </div>

                  <div>
                    {(() => {
                      const perms = getParsedPermissionsList(consultUser.role?.permissions);
                      return (
                        <>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                            Permissions accordées ({perms.length})
                          </span>
                          {perms.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                              {perms.map((p, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    backgroundColor: "#EFF6FF",
                                    border: "1px solid #BFDBFE",
                                    color: "#1D4ED8",
                                    borderRadius: "20px",
                                    padding: "0.3rem 0.85rem",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                  }}
                                >
                                  <Check size={12} strokeWidth={3} />
                                  {p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: "#94A3B8", fontSize: "0.85rem", fontStyle: "italic" }}>
                              Aucune permission accordée.
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Card 2B: Parcours & Description du Collaborateur */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Parcours & Description du Collaborateur
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Historique et notes biographiques
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem" }}>
                      Expérience clé
                    </span>
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.85rem 1rem",
                        fontSize: "0.9rem",
                        color: consultUser.experienceCle ? "var(--text-main)" : "#94A3B8",
                        lineHeight: 1.5,
                      }}
                    >
                      {consultUser.experienceCle || "Aucune expérience spécifique renseignée pour ce collaborateur."}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem" }}>
                      Description du profil
                    </span>
                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                        borderRadius: "8px",
                        padding: "0.85rem 1rem",
                        fontSize: "0.9rem",
                        color: consultUser.profile ? "var(--text-main)" : "#94A3B8",
                        lineHeight: 1.5,
                        minHeight: "56px",
                      }}
                    >
                      {consultUser.profile || "Aucune note biographique ou description n'a été ajoutée pour le moment."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen && (
        <>
          {!forceTab && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                Membres
              </h1>
              <p style={{ color: "var(--text-muted)" }}>
                Gestion des équipes internes et des clients
              </p>
            </div>
          )}

          {!forceTab && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => { setTab("interne"); setSearchTerm(""); setFilterUserStatus("all"); }}
                  style={{
                    background:
                      tab === "interne" ? "var(--primary)" : "transparent",
                    color: tab === "interne" ? "#FFF" : "var(--text-muted)",
                    border:
                      tab === "interne"
                        ? "1px solid var(--primary)"
                        : "1px solid #E2E8F0",
                    borderRadius: "6px",
                    padding: "0 0.75rem",
                    height: "28px",
                    lineHeight: 1,
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Interne
                </button>
                <button
                  type="button"
                  onClick={() => { setTab("externe"); setSearchTerm(""); setFilterUserStatus("all"); }}
                  style={{
                    background:
                      tab === "externe" ? "var(--primary)" : "transparent",
                    color: tab === "externe" ? "#FFF" : "var(--text-muted)",
                    border:
                      tab === "externe"
                        ? "1px solid var(--primary)"
                        : "1px solid #E2E8F0",
                    borderRadius: "6px",
                    padding: "0 0.75rem",
                    height: "28px",
                    lineHeight: 1,
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Externe
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (tab === "interne") setShowModal(true);
                  else setShowExternalModal(true);
                }}
                style={{
                  width: "fit-content",
                  whiteSpace: "nowrap",
                  padding: "0 0.75rem",
                  
                  height: "28px",
                  lineHeight: 1,
                }}
              >
                {tab === "interne"
                  ? "Ajouter en Interne"
                  : "Ajouter en Externe"}
              </button>
            </div>
          )}

          {forceTab && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1.5rem",
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (tab === "interne") setShowModal(true);
                  else setShowExternalModal(true);
                }}
                style={{
                  width: "fit-content",
                  whiteSpace: "nowrap",
                  padding: "0 0.75rem",
                  
                  height: "28px",
                  lineHeight: 1,
                }}
              >
                {tab === "interne" ? t("users.addMember", "Ajouter un Membre") : t("users.addClient", "Ajouter un Client")}
              </button>
            </div>
          )}

          {/* Search + filter bar */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, position: "relative", minWidth: "200px" }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder={tab === "interne" ? t("users.searchPlaceholder", "Rechercher par nom, email ou rôle...") : t("users.searchClientPlaceholder", "Rechercher par nom, email ou secteur...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 1rem 0.55rem 2.25rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "#FFF",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>
            <select
              value={filterUserStatus}
              onChange={(e) => setFilterUserStatus(e.target.value)}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "#FFF",
                fontSize: "0.875rem",
                minWidth: "150px",
              }}
            >
              <option value="all">{t("common.allStatuses", "Tous les statuts")}</option>
              <option value="actif">{t("common.active", "Actif")}</option>
              <option value="inactif">{t("common.inactive", "Inactif")}</option>
            </select>
          </div>

          <div className="table-wrapper">
            {tab === "interne" ? (
              <table style={{ tableLayout: "fixed", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "1.25rem", width: "24%" }}>{t("users.columns.name", "Nom")}</th>
                    <th style={{ width: "26%" }}>{t("users.columns.email", "Email")}</th>
                    <th style={{ width: "20%" }}>{t("users.columns.role", "Rôle")}</th>
                    <th style={{ width: "110px", textAlign: "center" }}>{t("users.columns.status", "Statut")}</th>
                    <th className="table-date-cell" style={{ width: "165px", textAlign: "center" }}>{t("users.columns.lastLogin", "Dernière Connexion")}</th>
                    <th style={{ width: "80px", textAlign: "center" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => {
                      const term = searchTerm.toLowerCase();
                      const matchSearch = !term ||
                        u.name?.toLowerCase().includes(term) ||
                        u.email?.toLowerCase().includes(term) ||
                        u.role?.name?.toLowerCase().includes(term);
                      const matchStatus = filterUserStatus === "all" ||
                        (filterUserStatus === "actif" && !u.isBlocked) ||
                        (filterUserStatus === "inactif" && u.isBlocked);
                      return matchSearch && matchStatus;
                    })
                    .map((u) => (
                    <tr key={u.id}>
                      <td style={{ textAlign: "left", paddingLeft: "1.25rem" }}>
                        <div className="truncate-name" style={{ maxWidth: "100%" }} title={u.name}>
                          {u.name}
                        </div>
                      </td>
                      <td>
                        <div
                          className="truncate-name"
                          style={{
                            maxWidth: "100%",
                            color: "var(--text-muted)",
                          }}
                          title={u.email}
                        >
                          {u.email}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {getRoleBadge(u.role?.name || "Non défini")}
                      </td>
                      <td>
                        <span
                          style={{
                            color: !u.isBlocked
                              ? "var(--success)"
                              : "var(--danger)",
                          }}
                        >
                          {!u.isBlocked ? t("common.active", "Actif") : t("common.inactive", "Inactif")}
                        </span>
                      </td>
                      <td
                        className="table-date-cell"
                        style={{
                          color: "var(--text-muted)",
                          width: "165px",
                          textAlign: "center",
                        }}
                      >
                        {u.lastLogin
                          ? formatDate(u.lastLogin)
                          : t("users.neverConnected", "Jamais connecté")}
                      </td>
                      <td style={{ overflow: "visible", position: "relative", zIndex: openMenuId === u.id ? 1000 : 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <button
                              type="button"
                              className="action-menu-trigger"
                              onClick={(e) => toggleMenu(e, u.id)}
                              style={{
                                background: openMenuId === u.id ? "#E2E8F0" : "transparent",
                                border: "1px solid #E2E8F0",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#4A5568",
                              }}
                              title="Options"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {renderDropdown(u.id, u)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table style={{ tableLayout: "fixed", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "1.25rem", width: "22%" }}>{t("users.columns.name", "Société / Nom")}</th>
                    <th style={{ width: "24%" }}>{t("users.columns.email", "Email")}</th>
                    <th style={{ width: "110px", textAlign: "center" }}>{t("users.columns.type", "Type")}</th>
                    <th style={{ width: "100px", textAlign: "center" }}>{t("users.columns.status", "État")}</th>
                    <th style={{ width: "18%" }}>{t("users.columns.activity", "Activité")}</th>
                    <th className="table-date-cell" style={{ width: "165px", textAlign: "center" }}>{t("users.columns.createdAt", "Date de création")}</th>
                    <th style={{ width: "80px", textAlign: "center" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {clients
                    .filter((c) => {
                      const term = searchTerm.toLowerCase();
                      const matchSearch = !term ||
                        c.name?.toLowerCase().includes(term) ||
                        c.email?.toLowerCase().includes(term) ||
                        c.secteurActivite?.toLowerCase().includes(term) ||
                        c.entreprise?.raisonSociale?.toLowerCase().includes(term);
                      const matchStatus = filterUserStatus === "all" ||
                        (filterUserStatus === "actif" && !c.isBlocked) ||
                        (filterUserStatus === "inactif" && c.isBlocked);
                      return matchSearch && matchStatus;
                    })
                    .map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div
                          className="truncate-name"
                          style={{ maxWidth: "100%" }}
                          title={(c.type === "Société" || c.type === "SOCIETE") ? c.entreprise?.raisonSociale || c.name : c.name}
                        >
                          {(c.type === "Société" || c.type === "SOCIETE") ? c.entreprise?.raisonSociale || "N/A" : c.name}
                        </div>
                        {(c.type === "Société" || c.type === "SOCIETE") && (
                          <div
                            className="truncate-name"
                            style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", maxWidth: "100%" }}
                            title={`${t("users.contactPrefix", "Contact :")} ${c.name}`}
                          >
                            {t("users.contactPrefix", "Contact :")} {c.name}
                          </div>
                        )}
                      </td>
                      <td>
                        <div
                          className="truncate-name"
                          style={{
                            maxWidth: "100%",
                            color: "var(--text-muted)",
                          }}
                          title={c.email}
                        >
                          {c.email}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            color:
                              c.type === "Société" || c.type === "SOCIETE"
                                ? "#1D4ED8"
                                : c.type === "Anonyme" || c.type === "ANONYME"
                                  ? "#64748B"
                                  : "#7E22CE",
                          }}
                        >
                          {c.type === "SOCIETE" || c.type === "Société"
                            ? t("users.types.company", "Société")
                            : c.type === "PARTICULIER"
                              ? t("users.types.individual", "Particulier")
                              : c.type === "ANONYME"
                                ? t("users.types.anonymous", "Anonyme")
                                : c.type || t("users.types.individual", "Particulier")}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            color: !c.isBlocked ? "var(--success)" : "var(--danger)",
                          }}
                        >
                          {!c.isBlocked ? t("common.active", "Actif") : t("common.inactive", "Inactif")}
                        </span>
                      </td>
                      <td>
                        <div
                          className="truncate-name"
                          style={{ color: "var(--text-muted)", maxWidth: "100%" }}
                          title={c.secteurActivite || "N/A"}
                        >
                          {c.secteurActivite || "N/A"}
                        </div>
                      </td>
                      <td className="table-date-cell" style={{ textAlign: "center", width: "165px" }}>
                        <span style={{ color: "var(--text-muted)" }}>
                          {c.createdAt ? formatDate(c.createdAt) : "N/A"}
                        </span>
                      </td>
                      <td style={{ overflow: "visible", position: "relative", zIndex: openMenuId === c.id ? 1000 : 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <button
                              type="button"
                              className="action-menu-trigger"
                              onClick={(e) => toggleMenu(e, c.id)}
                              style={{
                                background: openMenuId === c.id ? "#E2E8F0" : "transparent",
                                border: "1px solid #E2E8F0",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#4A5568",
                              }}
                              title="Options"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {renderDropdown(c.id, c, true)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Image/PDF Viewer Modal using <object> for better PDF support */}
      {viewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "90vw",
              height: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setViewImage(null)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            {viewImage
              .toLowerCase()
              .match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/) ? (
              <img
                src={viewImage}
                alt="Document"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <object
                data={viewImage}
                type="application/pdf"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                <p>
                  Impossible d'afficher ce fichier directement.{" "}
                  <a href={viewImage} target="_blank" rel="noreferrer">
                    Télécharger le fichier
                  </a>
                </p>
              </object>
            )}
          </div>
        </div>
      )}

      {/* Modal Bilan d'activité (Interne) / Suivi d'activité (Client) */}
      {activityStatsModal.open && activityStatsModal.target && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(201, 156, 92, 0.12)",
                    color: "var(--primary, #c99c5c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {activityStatsModal.type === "user" ? (
                    <BarChart3 size={24} />
                  ) : (
                    <Activity size={24} />
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {activityStatsModal.type === "user"
                      ? `Bilan d'activité : ${activityStatsModal.target.name}`
                      : `Suivi d'activité : ${activityStatsModal.target.entreprise?.raisonSociale || activityStatsModal.target.name}`}
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {activityStatsModal.type === "user"
                      ? "Missions, dossiers et tâches assignés et terminés pour ce collaborateur"
                      : "Dossiers, missions et tâches créés pour ce client"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseActivityStats}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "0.25rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Barre de filtrage par date */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.85rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Calendar size={15} /> Période :
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Du</span>
                    <input
                      type="date"
                      value={statsStartDate}
                      onChange={(e) => {
                        setStatsStartDate(e.target.value);
                        setStatsPreset("custom");
                      }}
                      style={{
                        padding: "0.3rem 0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        fontSize: "0.85rem",
                        background: "#FFFFFF",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Au</span>
                    <input
                      type="date"
                      value={statsEndDate}
                      onChange={(e) => {
                        setStatsEndDate(e.target.value);
                        setStatsPreset("custom");
                      }}
                      style={{
                        padding: "0.3rem 0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        fontSize: "0.85rem",
                        background: "#FFFFFF",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyStatsFilter}
                    disabled={statsLoading}
                    className="btn btn-primary"
                    style={{
                      padding: "0.35rem 0.85rem",
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Filter size={14} /> Filtrer
                  </button>
                  <button
                    type="button"
                    onClick={handleResetStatsFilter}
                    disabled={statsLoading}
                    className="btn btn-outline"
                    style={{
                      padding: "0.35rem 0.85rem",
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RotateCcw size={14} /> Réinitialiser
                  </button>
                </div>

                {/* Filtres rapides */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <button
                    type="button"
                    onClick={() => handlePresetStatsPeriod("all")}
                    style={{
                      border: statsPreset === "all" ? "1px solid var(--primary, #c99c5c)" : "1px solid var(--border)",
                      background: statsPreset === "all" ? "rgba(201, 156, 92, 0.15)" : "#FFFFFF",
                      color: statsPreset === "all" ? "var(--primary, #c99c5c)" : "var(--text-muted)",
                      borderRadius: "14px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: statsPreset === "all" ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    Tout
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetStatsPeriod("month")}
                    style={{
                      border: statsPreset === "month" ? "1px solid var(--primary, #c99c5c)" : "1px solid var(--border)",
                      background: statsPreset === "month" ? "rgba(201, 156, 92, 0.15)" : "#FFFFFF",
                      color: statsPreset === "month" ? "var(--primary, #c99c5c)" : "var(--text-muted)",
                      borderRadius: "14px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: statsPreset === "month" ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    Ce mois
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetStatsPeriod("year")}
                    style={{
                      border: statsPreset === "year" ? "1px solid var(--primary, #c99c5c)" : "1px solid var(--border)",
                      background: statsPreset === "year" ? "rgba(201, 156, 92, 0.15)" : "#FFFFFF",
                      color: statsPreset === "year" ? "var(--primary, #c99c5c)" : "var(--text-muted)",
                      borderRadius: "14px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: statsPreset === "year" ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    Cette année
                  </button>
                </div>
              </div>

              {statsError && (
                <div style={{ fontSize: "0.8rem", color: "#EF4444", marginTop: "0.25rem" }}>
                  {statsError}
                </div>
              )}
            </div>

            {/* Contenu des statistiques */}
            {statsLoading ? (
              <div
                style={{
                  padding: "3rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <Loader size={30} className="spin" />
                <span>Chargement des statistiques...</span>
              </div>
            ) : activityStatsModal.type === "user" ? (
              /* Vue INTERNE : Dossiers, Missions, Tâches (Assigné / Terminé) */
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Carte Dossiers Interne */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #2563EB",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                        Dossiers
                      </span>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#EFF6FF",
                          color: "#2563EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Folder size={18} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <div
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Assignés
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                          {statsData?.dossiers?.assignes ?? 0}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#065F46", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Terminés
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.dossiers?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carte Missions Interne */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #0D9488",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                        Missions
                      </span>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#F0FDFA",
                          color: "#0D9488",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckSquare size={18} />
                      </div>
                    </div>

                  </div>

                  {/* Carte Tâches Interne */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #7C3AED",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                        Tâches
                      </span>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#F5F3FF",
                          color: "#7C3AED",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ListTodo size={18} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <div
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Assignées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                          {statsData?.taches?.assignees ?? 0}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#065F46", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Terminées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.taches?.terminees ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.85rem",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Nombre d'éléments directement assignés et finalisés pour cet utilisateur interne.</span>
                </div>
              </div>
            ) : (
              /* Vue CLIENT : Dossiers, Missions, Tâches créés (En cours / Terminé) */
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Carte Dossiers Client */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #2563EB",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", display: "block" }}>
                          Dossiers
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créés : <strong>{statsData?.dossiers?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#EFF6FF",
                          color: "#2563EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Folder size={18} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <div
                        style={{
                          background: "#FFFBEB",
                          border: "1px solid #FDE68A",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#92400E", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          En cours
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                          {statsData?.dossiers?.enCours ?? 0}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#065F46", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Terminés
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.dossiers?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carte Missions Client */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #0D9488",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", display: "block" }}>
                          Missions
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créées : <strong>{statsData?.missions?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#F0FDFA",
                          color: "#0D9488",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckSquare size={18} />
                      </div>
                    </div>

                  </div>

                  {/* Carte Tâches Client */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderTop: "4px solid #7C3AED",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", display: "block" }}>
                          Tâches
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créées : <strong>{statsData?.taches?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#F5F3FF",
                          color: "#7C3AED",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ListTodo size={18} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <div
                        style={{
                          background: "#FFFBEB",
                          border: "1px solid #FDE68A",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#92400E", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          En cours
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                          {statsData?.taches?.enCours ?? 0}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "8px",
                          padding: "0.65rem",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", color: "#065F46", display: "block", textTransform: "uppercase", fontWeight: 600 }}>
                          Terminées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.taches?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    fontSize: "0.8rem",
                    color: "#1E40AF",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={16} />
                  <span>
                    <strong>« En cours »</strong> regroupe tous les éléments créés pour ce client qui ne sont pas encore terminés (tous statuts actifs confondus).
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                borderTop: "1px solid var(--border)",
                paddingTop: "1rem",
              }}
            >
              <button
                type="button"
                onClick={handleCloseActivityStats}
                className="btn btn-outline"
                style={{ padding: "0.5rem 1.25rem" }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
