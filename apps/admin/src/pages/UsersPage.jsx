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
  UserPlus,
  ShieldCheck,
  Key,
  Send,
  Ban,
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

  // Quand le parent change d'onglet (Équipe ↔ Client), réinitialiser tous les formulaires et filtres
  useEffect(() => {
    if (forceTab) {
      setTab(forceTab);
      setSearchTerm("");
      setFilterUserStatus("all");
      setOpenMenuId(null);
      setShowModal(false);
      setShowExternalModal(false);
      setConsultUser(null);
      setConsultExternal(null);
      setEditUser(null);
      setEditExternal(null);
      setErrorMsg(null);
    }
  }, [forceTab]);
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
        className="block font-medium" style={{marginBottom:"0.25rem",color:"var(--text-muted)"}}
      >
        {label}
      </label>
      <div
        className="w-full p-2" style={{background:"#F8FAFC",borderRadius:"4px",border:"1px solid var(--border)",minHeight:"38px"}}
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
  const [errorMsg, setErrorMsg] = useState(null);

  // Client Account (Portail) states
  const [accountActionLoading, setAccountActionLoading] = useState(false);
  const [convertModalClient, setConvertModalClient] = useState(null);
  const [convertEmail, setConvertEmail] = useState("");
  const [convertName, setConvertName] = useState("");

  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 3500);
    return () => clearTimeout(timer);
  }, [errorMsg]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    telephone: "",
    roleId: "",
    lieuResidence: "",
    experienceCle: "",
    status: "Invitation envoyée",
    langues: "Français",
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

  const [polesList, setPolesList] = useState([]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: "Bearer " + token };
      const [rUsers, rClients, rRoles, rPoles] = await Promise.all([
        fetch(getSafeApiUrl("/api/crm/users"), { headers })
          .then((r) => r.json())
          .catch(() => []),
        fetch(getSafeApiUrl("/api/crm/clients"), { headers })
          .then((r) => r.json())
          .catch(() => []),
        fetch(getSafeApiUrl("/api/crm/roles"), { headers })
          .then((r) => r.json())
          .catch(() => []),
        fetch(getSafeApiUrl("/api/poles"), { headers })
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
      setPolesList(Array.isArray(rPoles) ? rPoles : []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, [forceTab, tab]);
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
        const resData = await res.json().catch(() => null);
        onSuccess(resData);
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
    const finalLangues = (newUser.langues || "").trim() || "Français";

    const missing = [];
    if (!newUser.name?.trim()) missing.push("Nom complet");
    if (!newUser.email?.trim()) missing.push("Email");
    if (!newUser.telephone?.trim()) missing.push("Numéro de téléphone");
    if (!newUser.roleId) missing.push("Rôle");
    if (!newUser.lieuResidence?.trim()) missing.push("Lieu de résidence");
    if (!newUser.experienceCle?.trim()) missing.push("Expérience clé");
    if (!newUser.poleActivite?.trim()) missing.push("Pôle d'activité");

    if (missing.length > 0) {
      const msg = `Veuillez renseigner les champs obligatoires suivants : ${missing.join(", ")}.`;
      setErrorMsg(msg);
      if (window.customAlert) {
        window.customAlert(msg, "Champs obligatoires manquants");
      }
      return;
    }

    const emailTrimmed = newUser.email.trim().toLowerCase();
    const existing = users.find(
      (u) => u.email && u.email.trim().toLowerCase() === emailTrimmed,
    );
    if (existing) {
      const msg = `Impossible d'inscrire ce membre : l'adresse email "${newUser.email.trim()}" est déjà attribuée à ${existing.name}.`;
      setErrorMsg(msg);
      if (window.customAlert) {
        window.customAlert(msg, "Email déjà existant");
      }
      return;
    }

    await submitApiRequest(
      "/api/crm/users",
      "POST",
      { ...newUser, langues: finalLangues, email: emailTrimmed, lastLogin: "Jamais connecté" },
      (resData) => {
        setShowModal(false);
        setNewUser({
          name: "",
          email: "",
          telephone: "",
          roleId: "",
          lieuResidence: "",
          experienceCle: "",
          status: "Invitation envoyée",
          langues: "Français",
          profile: "",
          poleActivite: "",
          matricule: "",
          emailPro: "",
          fonction: "",
        });
        if (resData?.emailWarning) {
          if (window.customAlert) {
            window.customAlert(
              `Membre interne ajouté avec succès.\n\n⚠️ ${resData.emailWarning}`,
              "Membre créé (Alerte e-mail)"
            );
          }
        } else if (window.customAlert) {
          window.customAlert("Membre interne ajouté avec succès ! Un e-mail d'activation a été envoyé.", "Succès");
        }
      },
      "Erreur lors de la création du membre",
    );
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.name?.trim() || !newClient.email?.trim()) {
      const msg = "Veuillez renseigner au minimum le nom et l'email du client.";
      setErrorMsg(msg);
      if (window.customAlert) {
        window.customAlert(msg, "Champs obligatoires manquants");
      }
      return;
    }

    // — Vérification doublon email côté frontend (avant appel API) —
    const emailTrimmed = newClient.email.trim().toLowerCase();
    const existingClient = clients.find(
      (c) => c.email && c.email.trim().toLowerCase() === emailTrimmed,
    );
    if (existingClient) {
      const msg = `⚠️ L'adresse email « ${newClient.email.trim()} » est déjà utilisée par le client « ${existingClient.name} ». Veuillez utiliser une adresse email différente.`;
      setErrorMsg(msg);
      if (window.customAlert) {
        window.customAlert(msg, "Email déjà existant");
      }
      return;
    }
    const existingUserWithEmail = users.find(
      (u) => u.email && u.email.trim().toLowerCase() === emailTrimmed,
    );
    if (existingUserWithEmail) {
      const msg = `⚠️ L'adresse email « ${newClient.email.trim()} » appartient déjà à un membre interne de l'équipe (${existingUserWithEmail.name}). Impossible de l'utiliser pour un client.`;
      setErrorMsg(msg);
      if (window.customAlert) {
        window.customAlert(msg, "Email déjà existant");
      }
      return;
    }

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
        if (window.customAlert) {
          window.customAlert("Client ajouté avec succès !", "Succès");
        }
      },
      "Erreur lors de la création du client",
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
    if (!editUser.poleActivite) {
      const msg = "Le pôle d'activité est obligatoire pour un membre interne.";
      setErrorMsg(msg);
      window.customAlert(msg, "Champ obligatoire");
      return;
    }
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
        "Voulez-vous vraiment réinitialiser le mot de passe de ce membre ?\n\nCette action va immédiatement déconnecter l'utilisateur, supprimer son mot de passe en base de données pour empêcher toute reconnexion et lui envoyer un e-mail avec un lien sécurisé pour définir son nouveau mot de passe.",
        "Réinitialisation de mot de passe",
      ))
    )
      return;
    await submitApiRequest(
      `/api/crm/users/${encodeURIComponent(userId)}/trigger-password-reset`,
      "POST",
      {},
      (resData) => {
        window.customAlert(
          resData?.message || "L'utilisateur a été déconnecté, son mot de passe actuel a été supprimé et un lien sécurisé lui a été envoyé par email.",
          "Succès"
        );
        setConsultUser(null);
      },
      "Erreur lors du déclenchement de la réinitialisation",
    );
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    const isSociete = editExternal.type === "Société" || editExternal.type === "SOCIETE";
    await submitApiRequest(
      `/api/crm/clients/${encodeURIComponent(editExternal.id)}`,
      "PATCH",
      {
        name: editExternal.name?.trim(),
        email: editExternal.email?.trim(),
        telephone: editExternal.telephone?.trim() || null,
        contactSecondaire: editExternal.contactSecondaire?.trim() || null,
        secteurActivite: editExternal.secteurActivite?.trim() || null,
        description: editExternal.description?.trim() || null,
        type: isSociete ? "SOCIETE" : "PARTICULIER",
        siret: isSociete ? (editExternal.siret?.trim() || null) : null,
        raisonSociale: isSociete ? (editExternal.raisonSociale?.trim() || null) : null,
        emailEntreprise: isSociete ? (editExternal.emailEntreprise?.trim() || null) : null,
        telephoneEntreprise: isSociete ? (editExternal.telephoneEntreprise?.trim() || null) : null,
        status: editExternal.status,
      },
      () => setEditExternal(null),
      "Erreur lors de la modification",
    );
  };

  const openConvertModal = (client) => {
    const isSociete = client.type === "Société" || client.type === "SOCIETE";
    const defaultEmail = isSociete
      ? (client.entreprise?.emailEntreprise || client.email || "")
      : (client.email || "");
    const defaultName = isSociete
      ? (client.entreprise?.raisonSociale || client.name || "")
      : (client.name || "");

    setConvertEmail(defaultEmail);
    setConvertName(defaultName);
    setConvertModalClient(client);
  };

  const handleConfirmConvertToAccount = async () => {
    if (!convertModalClient) return;
    if (!convertEmail || !convertEmail.trim()) {
      if (window.customAlert) {
        window.customAlert("Veuillez saisir une adresse email valide.", "Email requis", "error");
      }
      return;
    }

    setAccountActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${convertModalClient.id}/convert-to-account`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: convertEmail.trim(),
          name: convertName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (window.customAlert) {
          window.customAlert(data.error || "Impossible de créer le compte client.", "Erreur", "error");
        }
      } else {
        if (window.customAlert) {
          if (data.emailSent === false) {
            window.customAlert(
              `⚠️ Compte portail créé, mais l'email d'invitation n'a pas pu être envoyé à ${data.emailDestination || convertEmail}.\n\n${data.emailError || ""}\n\nUtilisez "Renvoyer l'invitation" depuis la fiche client pour réessayer.`,
              "Email non envoyé",
              "warning"
            );
          } else {
            window.customAlert(
              `✅ Compte portail créé ! L'invitation a été envoyée à : ${data.emailDestination || convertEmail}`,
              "Compte Client Activé",
              "success"
            );
          }
        }
        if (consultExternal && consultExternal.id === convertModalClient.id) {
          setConsultExternal((prev) => ({
            ...prev,
            user: data.user,
          }));
        }
        setConvertModalClient(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
      if (window.customAlert) {
        window.customAlert("Erreur réseau lors de la création du compte.", "Erreur", "error");
      }
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleResendInvitation = async (client) => {
    const targetEmail = client.user?.email || client.email;
    if (
      !(await window.customConfirm(
        `Voulez-vous renvoyer un nouvel e-mail d'activation à ${targetEmail} ? L'ancien lien sera invalidé et remplacé par un nouveau lien valable 48h.`,
        "Renvoyer l'invitation"
      ))
    )
      return;

    setAccountActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${client.id}/resend-invitation`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (window.customAlert) {
          window.customAlert(data.error || "Erreur lors du renvoi de l'invitation.", "Erreur", "error");
        }
      } else {
        if (window.customAlert) {
          if (data.emailSent === false) {
            window.customAlert(
              `⚠️ Lien régénéré mais l'email n'a pas pu être envoyé à ${data.emailDestination || targetEmail}.\n\n${data.emailError || ""}\n\nVérifiez la configuration SMTP ou l'adresse email du client.`,
              "Email non envoyé",
              "warning"
            );
          } else {
            window.customAlert(
              `✅ Nouvelle invitation envoyée à : ${data.emailDestination || targetEmail}`,
              "Invitation envoyée",
              "success"
            );
          }
        }
        if (consultExternal && consultExternal.id === client.id) {
          setConsultExternal((prev) => ({
            ...prev,
            user: data.user,
          }));
        }
        fetchData();
      }
    } catch (e) {
      console.error(e);
      if (window.customAlert) {
        window.customAlert("Erreur réseau.", "Erreur", "error");
      }
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleResetAccountPassword = async (client) => {
    const targetEmail = client.user?.email || client.email;
    if (
      !(await window.customConfirm(
        `Voulez-vous vraiment réinitialiser le mot de passe du client ${targetEmail} ?\n\nCette action va immédiatement déconnecter le client de son portail, supprimer son mot de passe en base de données et lui envoyer un e-mail avec un lien sécurisé pour définir son nouveau mot de passe.`,
        "Réinitialisation administrative"
      ))
    )
      return;

    setAccountActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${client.id}/reset-account-password`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (window.customAlert) {
          window.customAlert(data.error || "Erreur lors de la réinitialisation.", "Erreur", "error");
        }
      } else {
        if (window.customAlert) {
          window.customAlert(data.message || `Le client a été déconnecté, son mot de passe a été supprimé et l'e-mail sécurisé a été transmis à ${targetEmail}.`, "Succès", "success");
        }
      }
    } catch (e) {
      console.error(e);
      if (window.customAlert) {
        window.customAlert("Erreur réseau.", "Erreur", "error");
      }
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleToggleAccountStatus = async (client) => {
    const isCurrentlyBlocked = client.user?.isBlocked;
    const actionLabel = isCurrentlyBlocked ? "réactiver" : "désactiver (suspendre)";
    if (
      !(await window.customConfirm(
        `Voulez-vous vraiment ${actionLabel} l'accès portail de ce client (${client.user?.email}) ?`,
        isCurrentlyBlocked ? "Réactivation du compte" : "Suspension du compte"
      ))
    )
      return;

    setAccountActionLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${client.id}/toggle-account-status`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (window.customAlert) {
          window.customAlert(data.error || "Erreur lors de l'opération.", "Erreur", "error");
        }
      } else {
        if (window.customAlert) {
          window.customAlert(data.message, "Statut mis à jour", "success");
        }
        if (consultExternal && consultExternal.id === client.id) {
          setConsultExternal((prev) => ({
            ...prev,
            status: isCurrentlyBlocked ? "ACTIF" : "INACTIF",
            user: data.user,
          }));
        }
        fetchData();
      }
    } catch (e) {
      console.error(e);
      if (window.customAlert) {
        window.customAlert("Erreur réseau.", "Erreur", "error");
      }
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleToggleClientStatus = async (client) => {
    const isCurrentlyActive = String(client.status || "ACTIF").toUpperCase() === "ACTIF";
    const confirmMsg = isCurrentlyActive
      ? `Voulez-vous vraiment passer le client « ${client.name} » au statut INACTIF ?\n\n⚠️ Conséquences immédiates :\n• Le client ne pourra plus se connecter au portail.\n• Aucun nouveau dossier ne pourra être créé pour lui.\n• Tous ses dossiers en cours passeront au statut BLOQUÉ en cascade avec leurs missions et tâches.`
      : `Voulez-vous réactiver le client « ${client.name} » ?\n\nSes dossiers précédemment bloqués seront restaurés et ses accès rétablis.`;

    if (!(await window.customConfirm(confirmMsg, isCurrentlyActive ? "Désactivation client & blocage" : "Réactivation client"))) {
      return;
    }

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${client.id}/toggle-status`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (window.customAlert) window.customAlert(data.error || "Erreur lors de l'opération.", "Erreur", "error");
      } else {
        if (window.customAlert) window.customAlert(data.message, "Statut client mis à jour", "success");
        if (consultExternal && consultExternal.id === client.id) {
          setConsultExternal((prev) => ({
            ...prev,
            status: data.client?.status || (isCurrentlyActive ? "INACTIF" : "ACTIF"),
          }));
        }
        fetchData();
      }
    } catch (e) {
      console.error(e);
      if (window.customAlert) window.customAlert("Erreur réseau.", "Erreur", "error");
    }
  };

  const isAnyModalOpen =
    showModal ||
    showExternalModal ||
    editUser ||
    editExternal ||
    consultUser ||
    consultExternal ||
    convertModalClient;

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
                const isPart = userObj.type === "Particulier" || userObj.type === "PARTICULIER";
                setEditExternal({
                  ...userObj,
                  raisonSociale: userObj.entreprise?.raisonSociale || userObj.raisonSociale || (!isPart ? userObj.name : "") || "",
                  siret: userObj.entreprise?.siret || userObj.siret || "",
                  emailEntreprise: userObj.entreprise?.emailEntreprise || userObj.emailEntreprise || "",
                  telephoneEntreprise: userObj.entreprise?.telephoneEntreprise || userObj.telephoneEntreprise || "",
                  type: isPart ? "Particulier" : "Société",
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
        <div className="fade-in p-4">
          <div className="w-full" style={{padding:"0"}}>
            <div
              className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
            >
              <button
                type="button"
                onClick={() => setShowExternalModal(false)}
                className="btn btn-outline text-[var(--text-main)]" style={{padding:"0.5rem 1rem"}}
              >
                ← Retour
              </button>
              <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
                Ajouter un Client
              </h2>
            </div>

            <div
              className="flex gap-6 mb-6 p-2 w-fit" style={{background:"#F8FAFC",borderRadius:"8px"}}
            >
              <label
                htmlFor="ext-type-particulier"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="ext-type-particulier"
                  type="radio"
                  name="ext_type"
                  checked={externalType === "Particulier"}
                  onChange={() => setExternalType("Particulier")}
                />
                <span className="font-medium">Particulier</span>
              </label>
              <label
                htmlFor="ext-type-societe"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="ext-type-societe"
                  type="radio"
                  name="ext_type"
                  checked={externalType === "Société"}
                  onChange={() => setExternalType("Société")}
                />
                <span className="font-medium">Société</span>
              </label>
            </div>

            <form
              onSubmit={handleCreateClient}
              className="flex flex-col gap-4"
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
                className="flex justify-end gap-2 mt-4"
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
        const isSociete = editExternal.type === "Société" || editExternal.type === "SOCIETE";
        const clientTitle = isSociete
          ? (editExternal.raisonSociale || editExternal.entreprise?.raisonSociale || editExternal.name || "Client")
          : (editExternal.name || "Client Particulier");

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
            className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}
          >
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              <div>
                <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                  Modifier le Client : {clientTitle}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {isSociete
                    ? "Édition des coordonnées de l'entreprise, des interlocuteurs et du compte client"
                    : "Édition des informations personnelles et coordonnées du client particulier"}
                </p>
              </div>

              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => setEditExternal(null)}
                  className="btn btn-outline font-medium text-[var(--text-main)]" style={{padding:"0.5rem 1.25rem",borderRadius:"8px",backgroundColor:"#FFFFFF",fontSize:"0.85rem"}}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.45rem",padding:"0.5rem 1.25rem",backgroundColor:"#1E3A8A",color:"#FFFFFF",border:"none",borderRadius:"8px",fontSize:"0.85rem"}}
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
              className="grid gap-6" style={{gridTemplateColumns:"1fr 1fr",alignItems:"start"}}
            >
              {isSociete ? (
                <>
                  {/* Left Column: Entreprise + Notes */}
                  <div className="flex flex-col gap-6">
                    {/* Card 1: Informations de l'Entreprise (Structure) */}
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          1. Informations de l'Entreprise (Structure)
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Raison sociale, identifiants légaux et typologie
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
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

                        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
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
                            <label style={labelStyle}>Statut du client</label>
                            <select
                              value={String(editExternal.status || "ACTIF").toUpperCase()}
                              onChange={(e) => setEditExternal({ ...editExternal, status: e.target.value })}
                              style={inputStyle}
                            >
                              <option value="ACTIF">Actif</option>
                              <option value="INACTIF">Inactif (bloque les dossiers)</option>
                            </select>
                          </div>
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

                        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
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
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          3. Notes & Description Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Accords-cadres et spécificités de la relation commerciale
                        </p>
                      </div>

                      <div>
                        <label style={labelStyle}>Description client</label>
                        <textarea
                          rows={4}
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
                    className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                  >
                    <div>
                      <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                        2. Contacts & Interlocuteurs Référents
                      </h2>
                      <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Personnes à contacter pour les opérations et le suivi
                      </p>
                    </div>

                    {/* Subcard 1: Contact Principal */}
                    <div
                      className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"1.25rem",gap:"0.85rem"}}
                    >
                      <span className="font-bold" style={{fontSize:"0.75rem",color:"#1E3A8A",textTransform:"uppercase",letterSpacing:"0.05em"}}>
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
                          placeholder="Ex : +33 6 12 34 56 78"
                          value={editExternal.telephone || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, telephone: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Subcard 2: Contact Secondaire */}
                    <div
                      className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"1.25rem",gap:"0.85rem"}}
                    >
                      <span className="font-bold" style={{fontSize:"0.75rem",color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                        CONTACT SECONDAIRE / SUPPLÉANT
                      </span>

                      <div>
                        <label style={labelStyle}>Seconde personne à contacter</label>
                        <input
                          type="text"
                          placeholder="Ex : Jean Dupont (Coordonnées ou fonction)"
                          value={editExternal.contactSecondaire || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, contactSecondaire: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column: Identité du Particulier */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          1. Identité & Typologie Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Informations d'identification du client particulier
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label style={labelStyle}>
                            Nom complet <span style={{ color: "#EF4444" }}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Prénom et Nom"
                            value={editExternal.name || ""}
                            onChange={(e) => setEditExternal({ ...editExternal, name: e.target.value })}
                            style={inputStyle}
                          />
                        </div>

                        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
                          <div>
                            <label style={labelStyle}>Type de client</label>
                            <select
                              value={editExternal.type || "Particulier"}
                              onChange={(e) => setEditExternal({ ...editExternal, type: e.target.value })}
                              style={inputStyle}
                            >
                              <option value="Particulier">Particulier</option>
                              <option value="Société">Société</option>
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Statut du client</label>
                            <select
                              value={String(editExternal.status || "ACTIF").toUpperCase()}
                              onChange={(e) => setEditExternal({ ...editExternal, status: e.target.value })}
                              style={inputStyle}
                            >
                              <option value="ACTIF">Actif</option>
                              <option value="INACTIF">Inactif (bloque les dossiers)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Secteur d'activité</label>
                          <input
                            type="text"
                            placeholder="Ex : Professions libérales, Particulier..."
                            value={editExternal.secteurActivite || ""}
                            onChange={(e) => setEditExternal({ ...editExternal, secteurActivite: e.target.value })}
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Seconde personne à contacter</label>
                          <input
                            type="text"
                            placeholder="Ex : Conjoint(e), Mandataire..."
                            value={editExternal.contactSecondaire || ""}
                            onChange={(e) => setEditExternal({ ...editExternal, contactSecondaire: e.target.value })}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Notes Client */}
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          3. Notes & Contexte Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Précisions sur les besoins et conditions particulières
                        </p>
                      </div>

                      <div>
                        <label style={labelStyle}>Description client</label>
                        <textarea
                          rows={4}
                          placeholder="Saisissez les besoins, conditions particulières ou contexte..."
                          value={editExternal.description || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, description: e.target.value })}
                          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Coordonnées de Contact */}
                  <div
                    className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                  >
                    <div>
                      <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                        2. Coordonnées de Contact
                      </h2>
                      <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Canaux directs d'échange avec le client
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label style={labelStyle}>
                          Email du client <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="adresse@email.com"
                          value={editExternal.email || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, email: e.target.value })}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Téléphone du client</label>
                        <input
                          type="tel"
                          placeholder="Ex : +33 6 12 34 56 78"
                          value={editExternal.telephone || ""}
                          onChange={(e) => setEditExternal({ ...editExternal, telephone: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
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
          <div className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}>
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              {/* Left: Avatar + Title + Subtitle */}
              <div className="flex items-center gap-4">
                <div
                  translate="no"
                  className="notranslate flex items-center justify-center font-bold shrink-0 overflow-hidden select-none"
                  style={{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"#EFF6FF",border:"2px solid #DBEAFE",color:"#1D4ED8",fontSize:"1.25rem",letterSpacing:"0.02em"}}
                >
                  <span translate="no" className="notranslate">{getUserInitials(clientDisplayName)}</span>
                </div>
                <div className="flex flex-col" style={{gap:"0.2rem"}}>
                  <div className="flex items-center flex-wrap" style={{gap:"0.65rem"}}>
                    <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                      {clientDisplayName}
                    </h1>
                    <span
                      className="inline-flex items-center font-semibold" style={{gap:"0.35rem",backgroundColor:"#EFF6FF",border:"1px solid #DBEAFE",color:"#2563EB",padding:"0.15rem 0.65rem",borderRadius:"16px",fontSize:"0.75rem"}}
                    >
                      {isSociete ? "Compte Client (Société)" : "Compte Client (Particulier)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap" style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>
                    <span>{clientEmail}</span>
                    <span>•</span>
                    <span>Téléphone : {clientPhone || "Non renseigné"}</span>
                    {isSociete && clientSiret && (
                      <>
                        <span>•</span>
                        <span>SIRET : {clientSiret}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                {!consultExternal.user && (
                  <button
                    type="button"
                    onClick={() => openConvertModal(consultExternal)}
                    className="inline-flex items-center font-bold cursor-pointer transition-transform active:scale-95"
                    style={{
                      gap: "0.45rem",
                      fontSize: "0.85rem",
                      padding: "0.5rem 1.15rem",
                      backgroundColor: "var(--primary, #c99c5c)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(201, 156, 92, 0.25)",
                    }}
                  >
                    <UserPlus size={16} />
                    Convertir en compte client
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConsultExternal(null)}
                  className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.35rem",fontSize:"0.85rem",padding:"0.5rem 1.25rem",backgroundColor:"var(--text-main)",color:"#FFFFFF",border:"none",borderRadius:"8px"}}
                >
                  ← Retour
                </button>
              </div>
            </div>

            {/* Carte Accès & Compte Espace Client Sécurisé */}
            {!consultExternal.user ? (
              <div
                className="p-5 flex items-center justify-between flex-wrap gap-4"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1.5px dashed #CBD5E1",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                      border: "1px solid #DBEAFE",
                    }}
                  >
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem", margin: 0 }}>
                        Espace Client Sécurisé (Portail GED)
                      </h3>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.15rem 0.55rem",
                          borderRadius: "12px",
                          backgroundColor: "#E2E8F0",
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      >
                        Compte non créé
                      </span>
                    </div>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "600px", lineHeight: 1.4 }}>
                      Ce client ne dispose pas encore d'un compte d'accès au portail.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openConvertModal(consultExternal)}
                  className="inline-flex items-center gap-2 font-bold cursor-pointer transition-transform active:scale-95"
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.6rem 1.25rem",
                    backgroundColor: "var(--primary, #c99c5c)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(201, 156, 92, 0.25)",
                  }}
                >
                  <UserPlus size={16} />
                  Convertir en compte client
                </button>
              </div>
            ) : (
              <div
                className="p-5 flex flex-col gap-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Entête de la carte compte */}
                <div className="flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "0.75rem" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: consultExternal.user.isBlocked ? "#FEF2F2" : "#ECFDF5",
                        color: consultExternal.user.isBlocked ? "#DC2626" : "#059669",
                        border: `1px solid ${consultExternal.user.isBlocked ? "#FECACA" : "#A7F3D0"}`,
                      }}
                    >
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem", margin: 0 }}>
                        Compte Portail Client Sécurisé
                      </h3>
                      <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Accès documentaire cloisonné et autonome du client
                      </p>
                    </div>
                  </div>

                  {/* Badge Statut */}
                  <div>
                    {consultExternal.user.isBlocked ? (
                      <span
                        className="inline-flex items-center gap-1.5 font-bold"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "16px",
                          backgroundColor: "#FEF2F2",
                          color: "#DC2626",
                          border: "1px solid #FECACA",
                        }}
                      >
                        <Ban size={13} /> Compte Désactivé / Suspendu
                      </span>
                    ) : consultExternal.user.status === "Actif" ? (
                      <span
                        className="inline-flex items-center gap-1.5 font-bold"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "16px",
                          backgroundColor: "#ECFDF5",
                          color: "#059669",
                          border: "1px solid #A7F3D0",
                        }}
                      >
                        <CheckCircle2 size={13} /> Compte Actif
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 font-bold"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "16px",
                          backgroundColor: "#FFFBEB",
                          color: "#D97706",
                          border: "1px solid #FDE68A",
                        }}
                      >
                        <Clock size={13} /> Invitation envoyée (En attente d'activation)
                      </span>
                    )}
                  </div>
                </div>

                {/* Détails du compte en grille */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Email de connexion
                    </span>
                    <div className="font-semibold text-[var(--text-main)] truncate mt-1" style={{ fontSize: "0.9rem" }} title={consultExternal.user.email}>
                      {consultExternal.user.email}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Date de création
                    </span>
                    <div className="font-semibold text-[var(--text-main)] mt-1" style={{ fontSize: "0.9rem" }}>
                      {formatDate(consultExternal.user.createdAt)}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Dernière connexion
                    </span>
                    <div className="font-semibold text-[var(--text-main)] mt-1" style={{ fontSize: "0.9rem" }}>
                      {consultExternal.user.lastLogin ? formatDate(consultExternal.user.lastLogin) : "Jamais connecté"}
                    </div>
                  </div>
                </div>

                {/* Barre d'actions administratives conformes au cadrage Mme Fouelefack */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Gestion des accès client :
                  </span>

                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={accountActionLoading}
                      onClick={() => handleResendInvitation(consultExternal)}
                      className="inline-flex items-center gap-1.5 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.45rem 0.85rem",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        backgroundColor: "#FFFFFF",
                        color: "#334155",
                      }}
                      title="Renvoyer un nouveau lien d'activation valable 48h"
                    >
                      <Send size={14} /> Renvoyer l'invitation
                    </button>

                    <button
                      type="button"
                      disabled={accountActionLoading}
                      onClick={() => handleResetAccountPassword(consultExternal)}
                      className="inline-flex items-center gap-1.5 font-semibold cursor-pointer hover:bg-amber-50 transition-colors"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.45rem 0.85rem",
                        borderRadius: "6px",
                        border: "1px solid #FCD34D",
                        backgroundColor: "#FFFBEB",
                        color: "#B45309",
                      }}
                      title="Envoyer un lien de réinitialisation sécurisé sans connaître le mot de passe"
                    >
                      <Key size={14} /> Réinitialiser le mot de passe
                    </button>

                    <button
                      type="button"
                      disabled={accountActionLoading}
                      onClick={() => handleToggleAccountStatus(consultExternal)}
                      className="inline-flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.45rem 0.85rem",
                        borderRadius: "6px",
                        border: consultExternal.user.isBlocked ? "1px solid #A7F3D0" : "1px solid #FECACA",
                        backgroundColor: consultExternal.user.isBlocked ? "#ECFDF5" : "#FEF2F2",
                        color: consultExternal.user.isBlocked ? "#059669" : "#DC2626",
                      }}
                    >
                      {consultExternal.user.isBlocked ? (
                        <>
                          <CheckCircle2 size={14} /> Réactiver le compte
                        </>
                      ) : (
                        <>
                          <Ban size={14} /> Désactiver le compte
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Body: Two columns layout */}
            <div
              className="grid gap-6" style={{gridTemplateColumns:"1fr 1fr",alignItems:"start"}}
            >
              {isSociete ? (
                <>
                  {/* Left Column: Informations Entreprise */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Informations Administratives & Légales
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Données d'enregistrement et identité de l'entreprise
                        </p>
                      </div>

                      <div className="flex flex-col" style={{gap:"0.85rem"}}>
                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Nom de la société
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.entreprise?.raisonSociale || consultExternal.name}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Numéro SIRET
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: clientSiret ? 600 : 400, color: clientSiret ? "var(--text-main)" : "#94A3B8" }}>
                            {clientSiret || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Secteur d'activité
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.secteurActivite ? 600 : 400, color: consultExternal.secteurActivite ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.secteurActivite || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Email de l'entreprise
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.entreprise?.emailEntreprise || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Téléphone de l'entreprise
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.entreprise?.telephoneEntreprise ? 600 : 400, color: consultExternal.entreprise?.telephoneEntreprise ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.entreprise?.telephoneEntreprise || "- Non renseigné"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Description */}
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Présentation & Notes Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Contexte commercial et historique
                        </p>
                      </div>

                      <div
                        className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.85rem 1rem",gap:"0.4rem",minHeight:"80px"}}
                      >
                        <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                          Description de l'entreprise
                        </span>
                        {consultExternal.description ? (
                          <span className="text-[var(--text-main)]" style={{fontSize:"0.95rem",whiteSpace:"pre-wrap",lineHeight:1.5}}>
                            {consultExternal.description}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                            Aucune description renseignée.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interlocuteur Référent & Contact Secondaire */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Contact Principal (Référent)
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Personne physique en charge des échanges opérationnels
                        </p>
                      </div>

                      <div className="flex flex-col" style={{gap:"0.85rem"}}>
                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#1E3A8A",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Nom du contact
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.name || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#1E3A8A",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Email direct du contact
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.email || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#1E3A8A",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Téléphone direct du contact
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.telephone ? 600 : 400, color: consultExternal.telephone ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.telephone || "- Non renseigné"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Contact Secondaire / Suppléant
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Interlocuteur alternatif en cas d'absence
                        </p>
                      </div>

                      <div
                        className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                      >
                        <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                          Seconde personne à contacter
                        </span>
                        <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.contactSecondaire ? 600 : 400, color: consultExternal.contactSecondaire ? "var(--text-main)" : "#94A3B8" }}>
                          {consultExternal.contactSecondaire || "- Non renseigné"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Column: Identité du Particulier */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Identité du Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Informations personnelles et professionnelles
                        </p>
                      </div>

                      <div className="flex flex-col" style={{gap:"0.85rem"}}>
                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Nom complet
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.name || "Client"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Secteur d'activité
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.secteurActivite ? 600 : 400, color: consultExternal.secteurActivite ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.secteurActivite || "- Non renseigné"}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Contact secondaire
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.contactSecondaire ? 600 : 400, color: consultExternal.contactSecondaire ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.contactSecondaire || "- Non renseigné"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Notes & Contexte Client
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Détails des échanges et conditions de gestion
                        </p>
                      </div>

                      <div
                        className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.85rem 1rem",gap:"0.4rem",minHeight:"80px"}}
                      >
                        <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                          Description client
                        </span>
                        {consultExternal.description ? (
                          <span className="text-[var(--text-main)]" style={{fontSize:"0.95rem",whiteSpace:"pre-wrap",lineHeight:1.5}}>
                            {consultExternal.description}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                            Aucune description renseignée.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Coordonnées de Contact Particulier */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                    >
                      <div>
                        <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                          Coordonnées de Contact
                        </h2>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Canaux d'échange directs avec le client
                        </p>
                      </div>

                      <div className="flex flex-col" style={{gap:"0.85rem"}}>
                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Email
                          </span>
                          <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                            {consultExternal.email}
                          </span>
                        </div>

                        <div
                          className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                        >
                          <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Téléphone
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: consultExternal.telephone ? 600 : 400, color: consultExternal.telephone ? "var(--text-main)" : "#94A3B8" }}>
                            {consultExternal.telephone || "- Non renseigné"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Action: Activity Stats */}
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => handleOpenActivityStats("client", consultExternal)}
                className="inline-flex items-center gap-2 font-semibold cursor-pointer" style={{fontSize:"0.9rem",padding:"0.75rem 1.5rem",backgroundColor:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE",borderRadius:"8px",boxShadow:"0 1px 2px rgba(0,0,0,0.05)",transition:"all 0.2s"}}
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
        );
      })()}

      {/* Modal Ajouter Interne */}
      {showModal && tab === "interne" && (
        <div className="fade-in p-4">
          <div className="w-full" style={{padding:"0"}}>
            <div
              className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline text-[var(--text-main)]" style={{padding:"0.5rem 1rem"}}
              >
                ← Retour
              </button>
              <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
                Ajouter un Membre Interne
              </h2>
            </div>
            <form
              onSubmit={handleCreateUser}
              className="flex flex-col gap-4"
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
                polesList={polesList}
                isEdit={false}
              />

              <div
                className="flex justify-end gap-2 mt-4"
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
            className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}
          >
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              <div>
                <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                  Modifier le Collaborateur : {editUser.name || "Collaborateur"}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Mettez à jour les informations du profil, le rôle attribué et les coordonnées professionnelles
                </p>
              </div>

              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => {
                    setEditUser(null);
                    setEditUserLangOpen(false);
                  }}
                  className="btn btn-outline font-medium text-[var(--text-main)]" style={{padding:"0.5rem 1.25rem",borderRadius:"8px",backgroundColor:"#FFFFFF",fontSize:"0.85rem"}}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.45rem",padding:"0.5rem 1.25rem",backgroundColor:"#1E3A8A",color:"#FFFFFF",border:"none",borderRadius:"8px",fontSize:"0.85rem"}}
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
              className="grid gap-6" style={{gridTemplateColumns:"1fr 1fr",alignItems:"start"}}
            >
              {/* Left Column: Coordonnées & Statut d'Accès */}
              <div className="flex flex-col gap-6">
                {/* Card 1: Coordonnées & Données Personnelles */}
                <div
                  className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                      1. Coordonnées & Données Personnelles
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Informations d'identification et de contact
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
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
                    <div className="relative">
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
                          className="absolute" style={{top:"100%",background:"#FFFFFF",border:"1px solid #CBD5E1",borderRadius:"8px",marginTop:"4px",maxHeight:"190px",overflowY:"auto",zIndex:50,boxShadow:"0 10px 15px -3px rgba(0, 0, 0, 0.1)",padding:"0.25rem"}}
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
                  className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                      2. Compte & Statut d'Accès
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Affectation du rôle système et état d'activation
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
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
              <div className="flex flex-col gap-6">
                {/* Card 3: Parcours Professionnel & Description */}
                <div
                  className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                      3. Parcours Professionnel & Description
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Qualifications, historique et présentation du profil
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
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

                {/* Card 4: Organisation & Fiche Interne (V3) */}
                <div
                  className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                      4. Organisation & Fiche Interne
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Pôle d'affectation, matricule et données administratives internes
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Pôle d'activité */}
                    <div>
                      <label style={labelStyle}>Pôle d'activité <span style={{ color: "red" }}>*</span></label>
                      <select
                        value={editUser.poleActivite || ""}
                        onChange={(e) => setEditUser({ ...editUser, poleActivite: e.target.value || null })}
                        style={inputStyle}
                        required
                      >
                        <option value="" disabled>Sélectionner un pôle...</option>
                        {polesList.length > 0
                          ? polesList.map((p) => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))
                          : ["Assurance", "CGP / Patrimoine", "Comptabilité / Gestion", "Finance / Reporting", "Risques / Conformité", "Data / IT", "Transversal"].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                      </select>
                    </div>

                    {/* Matricule & Fonction */}
                    <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
                      <div>
                        <label style={labelStyle}>Matricule interne</label>
                        <input
                          type="text"
                          placeholder="Ex: MC-2024-001"
                          value={editUser.matricule || ""}
                          onChange={(e) => setEditUser({ ...editUser, matricule: e.target.value || null })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Fonction / Intitulé de poste</label>
                        <input
                          type="text"
                          placeholder="Ex: Chargé(e) de back-office"
                          value={editUser.fonction || ""}
                          onChange={(e) => setEditUser({ ...editUser, fonction: e.target.value || null })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Email Pro */}
                    <div>
                      <label style={labelStyle}>E-mail professionnel (identifiant CRM)</label>
                      <input
                        type="email"
                        placeholder="prenom.nom@menuaconsulting.com"
                        value={editUser.emailPro || ""}
                        onChange={(e) => setEditUser({ ...editUser, emailPro: e.target.value || null })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

                {/* Info Callout */}
                <div
                  className="p-4 flex items-start" style={{backgroundColor:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:"8px",gap:"0.75rem"}}
                >
                  <Info size={18} style={{ color: "#2563EB", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div className="font-semibold" style={{fontSize:"0.85rem",color:"#1E40AF",marginBottom:"0.25rem"}}>
                      Information sur les champs obligatoires
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#2563EB", lineHeight: 1.45 }}>
                      Les champs marqués d'un astérisque rouge (*) sont obligatoires pour valider l'enregistrement et l'envoi des accès au collaborateur.
                    </div>
                  </div>
                </div>
          </form>
        );
      })()}

      {/* Consultation d'un Collaborateur Interne */}
      {consultUser && (
        <div className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}>
          {/* Header Card */}
          <div
            className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
          >
            {/* Left: Avatar + Name + Subtitle */}
            <div className="flex items-center gap-4">
              <div
                translate="no"
                className="notranslate flex items-center justify-center font-bold shrink-0 overflow-hidden select-none"
                style={{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"#EFF6FF",border:"2px solid #DBEAFE",color:"#1D4ED8",fontSize:"1.25rem",letterSpacing:"0.02em"}}
              >
                <span translate="no" className="notranslate">{getUserInitials(consultUser.name)}</span>
              </div>
              <div className="flex flex-col" style={{gap:"0.2rem"}}>
                <div className="flex items-center flex-wrap" style={{gap:"0.65rem"}}>
                  <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                    {consultUser.name}
                  </h1>
                  <span
                    className="inline-flex items-center font-semibold" style={{gap:"0.35rem",backgroundColor:"#ECFDF5",border:"1px solid #A7F3D0",color:"#059669",padding:"0.15rem 0.65rem",borderRadius:"16px",fontSize:"0.75rem"}}
                  >
                    <span style={{ fontSize: "0.65rem" }}>●</span>
                    {consultUser.status || "Actif"}
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>
                  <span>{consultUser.email}</span>
                  <span>•</span>
                  <span>Rôle : <strong>{consultUser.role?.name || consultUser.role || "Non renseigné"}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
              <button
                type="button"
                onClick={() => handleTriggerPasswordReset(consultUser.id)}
                className="btn btn-outline inline-flex items-center font-medium" style={{gap:"0.45rem",fontSize:"0.85rem",padding:"0.5rem 1rem",color:"#334155",borderColor:"#CBD5E1",backgroundColor:"#FFFFFF"}}
              >
                <Lock size={14} />
                Réinitialiser mot de passe
              </button>
              <button
                type="button"
                onClick={() => handleOpenActivityStats("user", consultUser)}
                className="btn btn-outline inline-flex items-center font-semibold" style={{gap:"0.45rem",fontSize:"0.85rem",padding:"0.5rem 1rem",borderColor:"#0284C7",color:"#0284C7",backgroundColor:"#FFFFFF"}}
              >
                <BarChart3 size={15} />
                Bilan d'activité
              </button>
              <button
                type="button"
                onClick={() => setConsultUser(null)}
                className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.35rem",fontSize:"0.85rem",padding:"0.5rem 1.25rem",backgroundColor:"var(--text-main)",color:"#FFFFFF",border:"none",borderRadius:"8px"}}
              >
                ← Retour
              </button>
            </div>
          </div>

          {/* Body: Two columns layout */}
          <div
            className="grid gap-6" style={{gridTemplateColumns:"1fr 1.3fr",alignItems:"start"}}
          >
            {/* Left Card: Coordonnées & Informations Personnelles */}
            <div
              className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
            >
              <div>
                <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                  Coordonnées & Informations Personnelles
                </h2>
                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Données de contact et profil collaborateur
                </p>
              </div>

              <div className="flex flex-col" style={{gap:"0.85rem"}}>
                {/* NOM COMPLET */}
                <div
                  className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                >
                  <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    Nom complet
                  </span>
                  <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {consultUser.name}
                  </span>
                </div>

                {/* EMAIL PROFESSIONNEL */}
                <div
                  className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                >
                  <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    Email professionnel
                  </span>
                  <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {consultUser.email}
                  </span>
                </div>

                {/* NUMÉRO DE TÉLÉPHONE */}
                <div
                  className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                >
                  <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    Numéro de téléphone
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.telephone ? 600 : 400, color: consultUser.telephone ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.telephone ? consultUser.telephone : "- Non renseigné"}
                  </span>
                </div>

                {/* LIEU DE RÉSIDENCE */}
                <div
                  className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                >
                  <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    Lieu de résidence
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.lieuResidence ? 600 : 400, color: consultUser.lieuResidence ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.lieuResidence ? consultUser.lieuResidence : "- Non renseigné"}
                  </span>
                </div>

                {/* LANGUES PARLÉES */}
                <div
                  className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                >
                  <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                    Langues parlées
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: consultUser.langues ? 600 : 400, color: consultUser.langues ? "var(--text-main)" : "#94A3B8" }}>
                    {consultUser.langues ? consultUser.langues : "- Non renseigné"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Two stacked cards */}
            <div className="flex flex-col gap-6">
              {/* Card 2A: Rôle & Permissions Système */}
              <div
                className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                    Rôle & Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Droits d'accès et habilitations hérités du rôle
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>
                      Rôle attribué
                    </span>
                    <div
                      className="font-bold text-[var(--text-main)] inline-block" style={{backgroundColor:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"0.45rem 1rem",fontSize:"0.9rem"}}
                    >
                      {consultUser.role?.name || consultUser.role || "Non renseigné"}
                    </div>
                  </div>

                  <div>
                    {(() => {
                      const perms = getParsedPermissionsList(consultUser.role?.permissions);
                      return (
                        <>
                          <span className="font-bold block mb-2" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            Permissions accordées ({perms.length})
                          </span>
                          {perms.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {perms.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="font-semibold inline-flex items-center" style={{backgroundColor:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1D4ED8",borderRadius:"20px",padding:"0.3rem 0.85rem",fontSize:"0.78rem",gap:"0.35rem"}}
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
                className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                    Parcours & Description du Collaborateur
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Historique et notes biographiques
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>
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
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>
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

          {/* Card V3: Organisation & Fiche Interne — displayed if any field has data */}
          {(consultUser.poleActivite || consultUser.matricule || consultUser.emailPro || consultUser.fonction || consultUser.manager) && (
            <div
              className="p-6" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              <div className="mb-4">
                <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                  Organisation & Fiche Interne
                </h2>
                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Rattachement organisationnel et données administratives internes
                </p>
              </div>
              <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))"}}>
                {consultUser.poleActivite && (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>Pôle d'activité</span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.92rem"}}>{consultUser.poleActivite}</span>
                  </div>
                )}
                {consultUser.fonction && (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>Fonction</span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.92rem"}}>{consultUser.fonction}</span>
                  </div>
                )}
                {consultUser.matricule && (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>Matricule</span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.92rem",fontFamily:"monospace"}}>{consultUser.matricule}</span>
                  </div>
                )}
                {consultUser.emailPro && (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>Email Pro (CRM)</span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.92rem"}}>{consultUser.emailPro}</span>
                  </div>
                )}
                {consultUser.manager && (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                    <span className="font-bold block" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.3rem"}}>Manager direct</span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.92rem"}}>{consultUser.manager.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!isAnyModalOpen && (
        <>
          {!forceTab && (
            <div className="mb-6">
              <h1
                className="font-semibold text-[var(--text-main)]" style={{fontSize:"1.5rem"}}
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
              className="flex justify-between items-center mb-6"
            >
              <div className="flex gap-2">
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
                className="btn btn-primary w-fit"
                onClick={() => {
                  if (tab === "interne") setShowModal(true);
                  else setShowExternalModal(true);
                }}
                style={{whiteSpace:"nowrap",padding:"0 0.75rem",height:"28px",lineHeight:1}}
              >
                {tab === "interne"
                  ? "Ajouter en Interne"
                  : "Ajouter en Externe"}
              </button>
            </div>
          )}

          {forceTab && (
            <div
              className="flex justify-end mb-6"
            >
              <button
                type="button"
                className="btn btn-primary w-fit"
                onClick={() => {
                  if (tab === "interne") setShowModal(true);
                  else setShowExternalModal(true);
                }}
                style={{whiteSpace:"nowrap",padding:"0 0.75rem",height:"28px",lineHeight:1}}
              >
                {tab === "interne" ? t("users.addMember", "Ajouter un Membre") : t("users.addClient", "Ajouter un Client")}
              </button>
            </div>
          )}

          {/* Search + filter bar */}
          <div
            className="flex mb-4 flex-wrap items-center" style={{gap:"0.75rem"}}
          >
            <div className="relative" style={{flex:1,minWidth:"200px"}}>
              <Search
                size={15}
                className="absolute" style={{left:"0.75rem",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}}
              />
              <input
                type="text"
                placeholder={tab === "interne" ? t("users.searchPlaceholder", "Rechercher par nom, email ou rôle...") : t("users.searchClientPlaceholder", "Rechercher par nom, email ou secteur...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full" style={{padding:"0.55rem 1rem 0.55rem 2.25rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",fontSize:"0.875rem",outline:"none"}}
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
              <table className="w-full" style={{tableLayout:"fixed"}}>
                <thead>
                  <tr>
                    <th className="text-left" style={{paddingLeft:"1.25rem",width:"24%"}}>{t("users.columns.name", "Nom")}</th>
                    <th style={{ width: "26%" }}>{t("users.columns.email", "Email")}</th>
                    <th style={{ width: "20%" }}>{t("users.columns.role", "Rôle")}</th>
                    <th className="text-center" style={{width:"110px"}}>{t("users.columns.status", "Statut")}</th>
                    <th className="table-date-cell text-center" style={{width:"165px"}}>{t("users.columns.lastLogin", "Dernière Connexion")}</th>
                    <th className="text-center" style={{width:"90px"}}>{t("common.actions", "Actions")}</th>
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
                      <td className="text-left" style={{paddingLeft:"1.25rem"}}>
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
                      <td className="text-center">
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
                        className="table-date-cell text-center" style={{color:"var(--text-muted)",width:"165px"}}
                      >
                        {u.lastLogin
                          ? formatDate(u.lastLogin)
                          : t("users.neverConnected", "Jamais connecté")}
                      </td>
                      <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                        <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                          {/* Sommet de la pyramide : Modifier */}
                          <button
                            type="button"
                            onClick={() => setEditUser(u)}
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                            title={t("common.edit", "Modifier")}
                          >
                            <Pencil size={14} />
                          </button>
                          {/* Base de la pyramide : Consulter + Supprimer */}
                          <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => setConsultUser(u)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                              title={t("common.view", "Consulter")}
                            >
                              <Eye size={14} />
                            </button>
                            {u.role?.name !== "Super-administrateur" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                                title={t("common.delete", "Supprimer")}
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full" style={{tableLayout:"fixed"}}>
                <thead>
                  <tr>
                    <th className="text-left" style={{paddingLeft:"1.25rem",width:"20%"}}>{t("users.columns.name", "Société / Nom")}</th>
                    <th style={{ width: "22%" }}>{t("users.columns.email", "Email")}</th>
                    <th className="text-center" style={{width:"100px"}}>{t("users.columns.type", "Type")}</th>
                    <th className="text-center" style={{width:"90px"}}>{t("users.columns.status", "État")}</th>
                    <th className="text-center" style={{width:"140px"}}>Accès Portail</th>
                    <th style={{ width: "16%" }}>{t("users.columns.activity", "Activité")}</th>
                    <th className="table-date-cell text-center" style={{width:"150px"}}>{t("users.columns.createdAt", "Date de création")}</th>
                    <th className="text-center" style={{width:"95px"}}>{t("common.actions", "Actions")}</th>
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
                      const isClientActive = String(c.status || "ACTIF").toUpperCase() === "ACTIF";
                      const matchStatus = filterUserStatus === "all" ||
                        (filterUserStatus === "actif" && isClientActive) ||
                        (filterUserStatus === "inactif" && !isClientActive);
                      return matchSearch && matchStatus;
                    })
                    .map((c) => {
                      const isClientActive = String(c.status || "ACTIF").toUpperCase() === "ACTIF";
                      return (
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
                      <td className="text-center">
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
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleClientStatus(c)}
                          className="cursor-pointer hover:opacity-80 transition inline-flex items-center gap-1 font-semibold"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.55rem",
                            borderRadius: "12px",
                            backgroundColor: isClientActive ? "#ECFDF5" : "#FEF2F2",
                            color: isClientActive ? "#059669" : "#DC2626",
                            border: `1px solid ${isClientActive ? "#A7F3D0" : "#FECACA"}`,
                          }}
                          title={`Statut : ${isClientActive ? "Actif" : "Inactif"}. Cliquer pour ${isClientActive ? "désactiver (bloquer les dossiers)" : "réactiver"}.`}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isClientActive ? "#059669" : "#DC2626" }}></span>
                          {isClientActive ? t("common.active", "Actif") : t("common.inactive", "Inactif")}
                        </button>
                      </td>
                      <td className="text-center">
                        {c.user?.status === "Actif" ? (
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "12px",
                              backgroundColor: "#ECFDF5",
                              color: "#059669",
                              border: "1px solid #A7F3D0",
                            }}
                            title="Mot de passe configuré — Accès portail actif"
                          >
                            <CheckCircle2 size={11} /> Actif
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "12px",
                              backgroundColor: "#FFFBEB",
                              color: "#D97706",
                              border: "1px solid #FDE68A",
                            }}
                            title="Invitation envoyée — En attente de configuration du mot de passe"
                          >
                            <Clock size={11} /> Invitation
                          </span>
                        )}
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
                      <td className="table-date-cell text-center" style={{width:"150px"}}>
                        <span style={{ color: "var(--text-muted)" }}>
                          {c.createdAt ? formatDate(c.createdAt) : "N/A"}
                        </span>
                      </td>
                      <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                        <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                          {/* Sommet : Modifier + Convertir si pas encore de compte */}
                          <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => {
                                const isPart = c.type === "Particulier" || c.type === "PARTICULIER";
                                setEditExternal({
                                  ...c,
                                  status: c.status || "ACTIF",
                                  raisonSociale: c.entreprise?.raisonSociale || c.raisonSociale || (!isPart ? c.name : "") || "",
                                  siret: c.entreprise?.siret || c.siret || "",
                                  emailEntreprise: c.entreprise?.emailEntreprise || c.emailEntreprise || "",
                                  telephoneEntreprise: c.entreprise?.telephoneEntreprise || c.telephoneEntreprise || "",
                                  type: isPart ? "Particulier" : "Société",
                                  contactSecondaire: c.contactSecondaire || "",
                                });
                              }}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                              title={t("common.edit", "Modifier")}
                            >
                              <Pencil size={14} />
                            </button>
                            {!c.user && (
                              <button
                                type="button"
                                onClick={() => openConvertModal(c)}
                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(201, 156, 92, 0.15)", border: "1px solid rgba(201, 156, 92, 0.4)", color: "var(--primary, #c99c5c)" }}
                                title="Convertir en compte client (Créer accès portail)"
                              >
                                <UserPlus size={14} />
                              </button>
                            )}
                          </div>
                          {/* Base : Consulter + Supprimer */}
                          <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => setConsultExternal(c)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                              title={t("common.view", "Consulter")}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(c.id)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                              title={t("common.delete", "Supprimer")}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Image/PDF Viewer Modal using <object> for better PDF support */}
      {viewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.8)",zIndex:1100}}
        >
          <div
            className="relative flex justify-center items-center" style={{width:"90vw",height:"90vh"}}
          >
            <button
              type="button"
              onClick={() => setViewImage(null)}
              className="absolute text-white cursor-pointer" style={{top:"-40px",right:"0",background:"none",border:"none"}}
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
                className="w-full h-full" style={{border:"none",backgroundColor:"white",borderRadius:"8px"}}
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
          className="fixed inset-0 flex items-center justify-center p-4" style={{backgroundColor:"rgba(15, 23, 42, 0.65)",backdropFilter:"blur(4px)",zIndex:1100}}
        >
          <div
            className="fade-in w-full flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",maxWidth:"800px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",padding:"1.75rem",gap:"1.25rem"}}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1rem"}}
            >
              <div className="flex items-center" style={{gap:"0.75rem"}}>
                <div
                  className="flex items-center justify-center" style={{width:"44px",height:"44px",borderRadius:"10px",backgroundColor:"rgba(201, 156, 92, 0.12)",color:"var(--primary, #c99c5c)"}}
                >
                  {activityStatsModal.type === "user" ? (
                    <BarChart3 size={24} />
                  ) : (
                    <Activity size={24} />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.25rem"}}>
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
                className="cursor-pointer flex items-center justify-center" style={{background:"transparent",border:"none",color:"var(--text-muted)",padding:"0.25rem",borderRadius:"6px"}}
              >
                <X size={20} />
              </button>
            </div>

            {/* Barre de filtrage par date */}
            <div
              className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.85rem 1rem",gap:"0.6rem"}}
            >
              <div
                className="flex items-center justify-between flex-wrap" style={{gap:"0.75rem"}}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[var(--text-main)] flex items-center" style={{fontSize:"0.85rem",gap:"0.35rem"}}>
                    <Calendar size={15} /> Période :
                  </span>
                  <div className="flex items-center" style={{gap:"0.35rem"}}>
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
                  <div className="flex items-center" style={{gap:"0.35rem"}}>
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
                    className="btn btn-primary inline-flex items-center" style={{padding:"0.35rem 0.85rem",fontSize:"0.85rem",gap:"0.35rem"}}
                  >
                    <Filter size={14} /> Filtrer
                  </button>
                  <button
                    type="button"
                    onClick={handleResetStatsFilter}
                    disabled={statsLoading}
                    className="btn btn-outline inline-flex items-center" style={{padding:"0.35rem 0.85rem",fontSize:"0.85rem",gap:"0.35rem"}}
                  >
                    <RotateCcw size={14} /> Réinitialiser
                  </button>
                </div>

                {/* Filtres rapides */}
                <div className="flex items-center" style={{gap:"0.4rem"}}>
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
                className="flex flex-col items-center justify-center" style={{padding:"3rem 1rem",gap:"0.75rem",color:"var(--text-muted)"}}
              >
                <Loader size={30} className="spin" />
                <span>Chargement des statistiques...</span>
              </div>
            ) : activityStatsModal.type === "user" ? (
              /* Vue INTERNE : Dossiers, Missions, Tâches (Assigné / Terminé) */
              <div className="flex flex-col gap-4">
                <div
                  className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"}}
                >
                  {/* Carte Dossiers Interne */}
                  <div
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #2563EB",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-main)]" style={{fontSize:"1rem"}}>
                        Dossiers
                      </span>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#FEF3C7",color:"#D97706"}}
                      >
                        <Folder size={18} color="#D97706" fill="#FBBF24" />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#F8FAFC",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"var(--text-muted)",textTransform:"uppercase"}}>
                          Assignés
                        </span>
                        <span className="text-[var(--text-main)]" style={{fontSize:"1.5rem",fontWeight:800}}>
                          {statsData?.dossiers?.assignes ?? statsData?.dossiers?.assignees ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
                          Terminés
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.dossiers?.termines ?? statsData?.dossiers?.terminees ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carte Missions Interne */}
                  <div
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #0D9488",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-main)]" style={{fontSize:"1rem"}}>
                        Missions
                      </span>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#F0FDFA",color:"#0D9488"}}
                      >
                        <CheckSquare size={18} />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#F8FAFC",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"var(--text-muted)",textTransform:"uppercase"}}>
                          Assignées
                        </span>
                        <span className="text-[var(--text-main)]" style={{fontSize:"1.5rem",fontWeight:800}}>
                          {statsData?.missions?.assignees ?? statsData?.missions?.assignes ?? statsData?.missions?.total ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
                          Terminées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.missions?.terminees ?? statsData?.missions?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carte Tâches Interne */}
                  <div
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #7C3AED",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-main)]" style={{fontSize:"1rem"}}>
                        Tâches
                      </span>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#F5F3FF",color:"#7C3AED"}}
                      >
                        <ListTodo size={18} />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#F8FAFC",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"var(--text-muted)",textTransform:"uppercase"}}>
                          Assignées
                        </span>
                        <span className="text-[var(--text-main)]" style={{fontSize:"1.5rem",fontWeight:800}}>
                          {statsData?.taches?.assignees ?? statsData?.taches?.assignes ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
                          Terminées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.taches?.terminees ?? statsData?.taches?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2" style={{backgroundColor:"#F8FAFC",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.6rem 0.85rem",fontSize:"0.8rem",color:"var(--text-muted)"}}
                >
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Nombre d'éléments directement assignés et finalisés pour cet utilisateur interne.</span>
                </div>
              </div>
            ) : (
              /* Vue CLIENT : Dossiers, Missions, Tâches créés (En cours / Terminé) */
              <div className="flex flex-col gap-4">
                <div
                  className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"}}
                >
                  {/* Carte Dossiers Client */}
                  <div
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #2563EB",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-main)] block" style={{fontSize:"1rem"}}>
                          Dossiers
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créés : <strong>{statsData?.dossiers?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#FEF3C7",color:"#D97706"}}
                      >
                        <Folder size={18} color="#D97706" fill="#FBBF24" />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#92400E",textTransform:"uppercase"}}>
                          En cours
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                          {statsData?.dossiers?.enCours ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
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
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #0D9488",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-main)] block" style={{fontSize:"1rem"}}>
                          Missions
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créées : <strong>{statsData?.missions?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#F0FDFA",color:"#0D9488"}}
                      >
                        <CheckSquare size={18} />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#92400E",textTransform:"uppercase"}}>
                          En cours
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                          {statsData?.missions?.enCours ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
                          Terminées
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                          {statsData?.missions?.termines ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carte Tâches Client */}
                  <div
                    className="flex flex-col" style={{background:"#FFFFFF",border:"1px solid var(--border)",borderTop:"4px solid #7C3AED",borderRadius:"10px",padding:"1.2rem",gap:"0.85rem",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-main)] block" style={{fontSize:"1rem"}}>
                          Tâches
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Total créées : <strong>{statsData?.taches?.total ?? 0}</strong>
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-center" style={{width:"32px",height:"32px",borderRadius:"8px",background:"#F5F3FF",color:"#7C3AED"}}
                      >
                        <ListTodo size={18} />
                      </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                      <div
                        className="text-center" style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#92400E",textTransform:"uppercase"}}>
                          En cours
                        </span>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                          {statsData?.taches?.enCours ?? 0}
                        </span>
                      </div>
                      <div
                        className="text-center" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:"8px",padding:"0.65rem"}}
                      >
                        <span className="block font-semibold" style={{fontSize:"0.72rem",color:"#065F46",textTransform:"uppercase"}}>
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
                  className="flex items-center gap-2" style={{backgroundColor:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:"8px",padding:"0.65rem 0.85rem",fontSize:"0.8rem",color:"#1E40AF"}}
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
              className="flex justify-end" style={{borderTop:"1px solid var(--border)",paddingTop:"1rem"}}
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

      {/* Modal Convertir en Compte Client (Portail GED) */}
      {convertModalClient && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1200,
          }}
        >
          <div
            className="fade-in w-full flex flex-col"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              maxWidth: "520px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: "1.75rem",
              gap: "1.25rem",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              <div className="flex items-center" style={{ gap: "0.75rem" }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(201, 156, 92, 0.12)",
                    color: "var(--primary, #c99c5c)",
                  }}
                >
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.15rem", margin: 0 }}>
                    Convertir en Compte Client
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Initialisation des accès au portail sécurisé GED
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConvertModalClient(null)}
                className="cursor-pointer flex items-center justify-center"
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "0.25rem" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Note explicative cadrage Mme Fouelefack */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                borderLeft: "4px solid var(--primary, #c99c5c)",
                padding: "0.75rem 1rem",
                borderRadius: "0 6px 6px 0",
                fontSize: "0.85rem",
                color: "#334155",
                lineHeight: 1.5,
              }}
            >
              Un compte nominatif va être créé pour ce client. Une invitation officielle contenant un lien sécurisé d'activation lui sera transmise par e-mail afin qu'il définisse son mot de passe de manière autonome.
            </div>

            {/* Formulaire */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1" style={{ fontSize: "0.8rem" }}>
                  Nom / Raison Sociale affiché(e)
                </label>
                <input
                  type="text"
                  value={convertName}
                  onChange={(e) => setConvertName(e.target.value)}
                  className="w-full"
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-main)] mb-1" style={{ fontSize: "0.8rem" }}>
                  Adresse email du compte (pour réception de l'invitation) <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="email"
                  value={convertEmail}
                  onChange={(e) => setConvertEmail(e.target.value)}
                  required
                  className="w-full"
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                type="button"
                onClick={() => setConvertModalClient(null)}
                className="cursor-pointer font-semibold"
                style={{
                  padding: "0.55rem 1.15rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={accountActionLoading || !convertEmail.trim()}
                onClick={handleConfirmConvertToAccount}
                className="cursor-pointer font-bold inline-flex items-center gap-2"
                style={{
                  padding: "0.55rem 1.25rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--primary, #c99c5c)",
                  color: "#FFFFFF",
                  fontSize: "0.85rem",
                  opacity: accountActionLoading || !convertEmail.trim() ? 0.6 : 1,
                }}
              >
                {accountActionLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Créer le compte & Inviter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
