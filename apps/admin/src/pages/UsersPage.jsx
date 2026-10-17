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
import PaginationControls from "../components/PaginationControls";
import { getStatusBadge, getRoleBadge } from "../utils/helpers";
import Modal from "../components/ui/Modal";
import ActivityStatsModal from "../components/modals/ActivityStatsModal";
import EditClientView from "../components/users/EditClientView";
import ClientDetailView from "../components/users/ClientDetailView";
import EditCollaboratorView from "../components/users/EditCollaboratorView";
import CollaboratorDetailView from "../components/users/CollaboratorDetailView";
import CreateClientModal from "../components/users/CreateClientModal";
import CreateUserModal from "../components/users/CreateUserModal";
import CollaboratorTableView from "../components/users/CollaboratorTableView";
import ClientTableView from "../components/users/ClientTableView";
import ConvertClientAccountModal from "../components/modals/ConvertClientAccountModal";
import FilePreviewModal from "../components/FilePreviewModal";
import UsersToolbar from "../components/users/UsersToolbar";

const UsersPage = ({ forceTab }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(forceTab || "interne");
  const [openMenuId, setOpenMenuId] = useState(null);

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
  const [showModal, setShowModal] = useState(false);
  const [consultUser, setConsultUser] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalType, setExternalType] = useState("Particulier");
  const [consultExternal, setConsultExternal] = useState(null);
  const [editExternal, setEditExternal] = useState(null);
  const [editUserLangOpen, setEditUserLangOpen] = useState(false);

  // Activity Stats Modal state (délégué au composant autonome ActivityStatsModal)
  const [activityStatsModal, setActivityStatsModal] = useState({
    open: false,
    type: "user", // "user" or "client"
    target: null,
  });

  const handleOpenActivityStats = (type, target) => {
    setActivityStatsModal({ open: true, type, target });
  };

  // Real API states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUserStatus, setFilterUserStatus] = useState("all");
  const [filterUserRole, setFilterUserRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Pagination states (Équipe & Client)
  const [pageUsers, setPageUsers] = useState(1);
  const [pageClients, setPageClients] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    setPageUsers(1);
  }, [searchTerm, filterUserStatus, filterUserRole]);

  useEffect(() => {
    setPageClients(1);
  }, [searchTerm, filterUserStatus]);

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = !term ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);
      const matchStatus = filterUserStatus === "all" ||
        (filterUserStatus === "actif" && !u.isBlocked) ||
        (filterUserStatus === "inactif" && u.isBlocked);
      const matchRole = filterUserRole === "all" ||
        u.role?.name === filterUserRole ||
        u.roleId === filterUserRole;
      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, filterUserStatus, filterUserRole]);

  const totalPagesUsers = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = React.useMemo(() => {
    const start = (pageUsers - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, pageUsers]);

  const filteredClients = React.useMemo(() => {
    return clients.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = !term ||
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.entreprise?.raisonSociale?.toLowerCase().includes(term);
      const isClientActive = String(c.status || "ACTIF").toUpperCase() === "ACTIF";
      const matchStatus = filterUserStatus === "all" ||
        (filterUserStatus === "actif" && isClientActive) ||
        (filterUserStatus === "inactif" && !isClientActive);
      return matchSearch && matchStatus;
    });
  }, [clients, searchTerm, filterUserStatus]);

  const totalPagesClients = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const paginatedClients = React.useMemo(() => {
    const start = (pageClients - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, pageClients]);

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
        accountStatus: editExternal.accountStatus,
        isAccountBlocked: editExternal.accountStatus === "SUSPENDU",
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

  return (
    <div>
      {/* Modal Ajouter Externe */}
      <CreateClientModal
        showExternalModal={showExternalModal && tab === "externe"}
        setShowExternalModal={setShowExternalModal}
        externalType={externalType}
        setExternalType={setExternalType}
        newClient={newClient}
        setNewClient={setNewClient}
        handleCreateClient={handleCreateClient}
        errorMsg={errorMsg}
        loading={loading}
      />

      {/* Modal Modifier Externe */}
      {editExternal && (
        <EditClientView
          editExternal={editExternal}
          setEditExternal={setEditExternal}
          handleUpdateClient={handleUpdateClient}
          loading={loading}
        />
      )}

      {/* Modal Consulter Externe */}
      {consultExternal && (
        <ClientDetailView
          consultExternal={consultExternal}
          setConsultExternal={setConsultExternal}
          handleOpenActivityStats={handleOpenActivityStats}
          openConvertModal={openConvertModal}
          handleResendInvitation={handleResendInvitation}
          handleResetAccountPassword={handleResetAccountPassword}
          handleToggleAccountStatus={handleToggleAccountStatus}
        />
      )}

      {/* Modal Ajouter Interne */}
      <CreateUserModal
        showModal={showModal && tab === "interne"}
        setShowModal={setShowModal}
        newUser={newUser}
        setNewUser={setNewUser}
        handleCreateUser={handleCreateUser}
        rolesList={rolesList}
        polesList={polesList}
        errorMsg={errorMsg}
        loading={loading}
      />

      {/* Modal Modifier Interne */}
      {editUser && (
        <EditCollaboratorView
          editUser={editUser}
          setEditUser={setEditUser}
          handleUpdateUser={handleUpdateUser}
          loading={loading}
          rolesList={rolesList}
          polesList={polesList}
          errorMsg={errorMsg}
        />
      )}

      {/* Consultation d'un Collaborateur Interne */}
      {consultUser && (
        <CollaboratorDetailView
          consultUser={consultUser}
          setConsultUser={setConsultUser}
          handleTriggerPasswordReset={handleTriggerPasswordReset}
          handleOpenActivityStats={handleOpenActivityStats}
        />
      )}

      {!isAnyModalOpen && (
        <>
<UsersToolbar
            forceTab={forceTab}
            tab={tab}
            setTab={setTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterUserStatus={filterUserStatus}
            setFilterUserStatus={setFilterUserStatus}
            filterUserRole={filterUserRole}
            setFilterUserRole={setFilterUserRole}
            rolesList={rolesList}
            setShowModal={setShowModal}
            setShowExternalModal={setShowExternalModal}
            t={t}
          />

                    <div className="table-wrapper">
            {tab === "interne" ? (
              <CollaboratorTableView
                paginatedUsers={paginatedUsers}
                loading={loading}
                t={t}
                pageUsers={pageUsers}
                PAGE_SIZE={PAGE_SIZE}
                setConsultUser={setConsultUser}
                setEditUser={setEditUser}
                handleDeleteUser={handleDeleteUser}
              />
            ) : (
              <ClientTableView
                paginatedClients={paginatedClients}
                loading={loading}
                t={t}
                pageClients={pageClients}
                PAGE_SIZE={PAGE_SIZE}
                setConsultExternal={setConsultExternal}
                setEditExternal={setEditExternal}
                handleDeleteClient={handleDeleteClient}
              />
            )}
          </div>

          <PaginationControls
            page={tab === "interne" ? pageUsers : pageClients}
            totalPages={tab === "interne" ? totalPagesUsers : totalPagesClients}
            setPage={tab === "interne" ? setPageUsers : setPageClients}
          />
        </>
      )}

{/* Image/PDF Viewer Modal */}
      <FilePreviewModal
        fileUrl={viewImage}
        onClose={() => setViewImage(null)}
      />

            {/* Modal Bilan d'activité (Interne) / Suivi d'activité (Client) factorisé */}
      <ActivityStatsModal
        isOpen={activityStatsModal.open}
        onClose={() => setActivityStatsModal({ open: false, type: "user", target: null })}
        type={activityStatsModal.type}
        target={activityStatsModal.target}
      />

{/* Modal Convertir en Compte Client */}
      <ConvertClientAccountModal
        convertModalClient={convertModalClient}
        onClose={() => setConvertModalClient(null)}
        convertName={convertName}
        setConvertName={setConvertName}
        convertEmail={convertEmail}
        setConvertEmail={setConvertEmail}
        accountActionLoading={accountActionLoading}
        onConfirm={handleConfirmConvertToAccount}
      />
    </div>
  );
};

export default UsersPage;
