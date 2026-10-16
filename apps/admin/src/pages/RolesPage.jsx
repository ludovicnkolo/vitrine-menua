import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Eye, Trash, Check, AlertTriangle, Loader2 } from "lucide-react";
import ActionDropdown from "../components/ActionDropdown";
import { alertService } from "../utils/AlertService";

// --- Constantes Système déclarées hors composant pour éviter les réallocations mémoire ---
const AVAILABLE_PERMISSIONS = [
  { value: "MESSAGES_VIEW", label: "Consulter les messages" },
  { value: "MESSAGES_PROCESS", label: "Traiter les messages" },
  { value: "DOSSIERS_MANAGE", label: "Gérer les dossiers" },
  { value: "TACHES_MANAGE", label: "Créer et gérer les tâches" },
  { value: "TACHES_VIEW_ALL", label: "Consulter toutes les tâches" },
  { value: "TACHES_VALIDATE", label: "Valider les tâches" },
  { value: "TACHES_VIEW_ASSIGNED", label: "Voir ses tâches assignées" },
  { value: "TACHES_EDIT_ASSIGNED", label: "Modifier ses tâches assignées" },
  { value: "CLIENTS_MANAGE", label: "Gérer les clients" },
  { value: "USERS_MANAGE", label: "Gérer les utilisateurs" },
  { value: "ROLES_MANAGE", label: "Gérer les rôles" },
];

const DOMAIN_GROUPS = [
  {
    title: "MESSAGES & COMMUNICATION",
    permValues: ["MESSAGES_VIEW", "MESSAGES_PROCESS"],
    pillStyle: {
      backgroundColor: "#EFF6FF",
      border: "1px solid #BFDBFE",
      color: "#1D4ED8",
    },
  },
  {
    title: "DOSSIERS & GESTION DES TÂCHES",
    permValues: [
      "DOSSIERS_MANAGE",
      "TACHES_MANAGE",
      "TACHES_VIEW_ALL",
      "TACHES_VALIDATE",
      "TACHES_VIEW_ASSIGNED",
      "TACHES_EDIT_ASSIGNED",
    ],
    pillStyle: {
      backgroundColor: "#ECFDF5",
      border: "1px solid #A7F3D0",
      color: "#059669",
    },
  },
  {
    title: "ADMINISTRATION & SÉCURITÉ SYSTÈME",
    permValues: ["CLIENTS_MANAGE", "USERS_MANAGE", "ROLES_MANAGE"],
    pillStyle: {
      backgroundColor: "#FAF5FF",
      border: "1px solid #E9D5FF",
      color: "#7E22CE",
    },
  },
];

const getRoleInitials = (name) => {
  if (!name) return "RO";
  const cleaned = name.replace(/[-_]/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getPermLabel = (val) =>
  AVAILABLE_PERMISSIONS.find((p) => p.value === val)?.label || val;

const parseRolePermissions = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const RolesPage = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Formulaire unifié (mode: 'create' | 'edit' | null)
  const [roleForm, setRoleForm] = useState(null);
  const [consultRole, setConsultRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);

  const menuRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const [resUsers, resRoles] = await Promise.all([
        fetch(getSafeApiUrl("/api/crm/users"), { headers }).catch(() => null),
        fetch(getSafeApiUrl("/api/crm/roles"), { headers }).catch(() => null),
      ]);

      let rUsers = [];
      let rRoles = [];

      if (resUsers && resUsers.ok) {
        rUsers = await resUsers.json().catch(() => []);
      }

      if (resRoles && resRoles.ok) {
        rRoles = await resRoles.json().catch(() => []);
      }

      const validRoles = Array.isArray(rRoles) ? rRoles : [];
      const validUsers = Array.isArray(rUsers) ? rUsers : [];

      const roleCounts = validUsers.reduce((acc, user) => {
        if (user.roleId) acc[user.roleId] = (acc[user.roleId] || 0) + 1;
        return acc;
      }, {});

      setRoles(
        validRoles.map((r) => ({
          ...r,
          users: roleCounts[r.id] || 0,
        })),
      );
    } catch (error) {
      console.error("Erreur fetchData roles:", error);
      alertService.alert("Erreur de chargement des rôles.", "Erreur", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

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
  }, [fetchData]);

  const toggleMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Gestion des permissions dans le formulaire unifié
  const handleTogglePerm = (perm) => {
    if (!roleForm) return;
    setRoleForm((prev) => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: perms };
    });
  };

  const handleToggleGroup = (groupValues) => {
    if (!roleForm) return;
    const allSelected = groupValues.every((val) => roleForm.permissions.includes(val));
    setRoleForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((val) => !groupValues.includes(val))
        : Array.from(new Set([...prev.permissions, ...groupValues])),
    }));
  };

  // Soumission unifiée (Création ou Mise à jour)
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm) return;

    const trimmedName = roleForm.name.trim();
    if (!trimmedName) {
      alertService.alert("L'intitulé du rôle est obligatoire.", "Erreur", "error");
      return;
    }

    setSubmitting(true);
    const isEdit = roleForm.mode === "edit";
    const url = isEdit
      ? getSafeApiUrl(`/api/crm/roles/${encodeURIComponent(roleForm.id)}`)
      : getSafeApiUrl("/api/crm/roles");
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: trimmedName,
          description: roleForm.description.trim(),
          status: roleForm.status || "Actif",
          permissions: JSON.stringify(roleForm.permissions),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alertService.alert(data.error || "Impossible d'enregistrer le rôle.", "Erreur", "error");
        return;
      }

      alertService.alert(
        isEdit ? "Le rôle a été modifié avec succès." : "Le rôle a été créé avec succès.",
        "Succès",
        "success"
      );
      setRoleForm(null);
      fetchData();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du rôle:", err);
      alertService.alert("Erreur réseau lors de la communication avec le serveur.", "Erreur", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteRole) return;
    try {
      const res = await fetch(
        getSafeApiUrl(`/api/crm/roles/${encodeURIComponent(deleteRole.id)}`),
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (res.ok) {
        alertService.alert("Rôle supprimé avec succès.", "Succès", "success");
        fetchData();
        if (roleForm && roleForm.id === deleteRole.id) setRoleForm(null);
      } else {
        const data = await res.json().catch(() => ({}));
        alertService.alert(data.error || "Erreur lors de la suppression.", "Erreur", "error");
      }
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
      alertService.alert("Erreur réseau lors de la suppression.", "Erreur", "error");
    }
    setDeleteRole(null);
  };

  const isCriticalRole = useMemo(() => {
    if (!roleForm) return false;
    const lower = (roleForm.name || "").toLowerCase();
    return (
      lower.includes("super") ||
      lower.includes("admin") ||
      roleForm.permissions.length >= 8 ||
      roleForm.permissions.includes("USERS_MANAGE") ||
      roleForm.permissions.includes("ROLES_MANAGE")
    );
  }, [roleForm]);

  const renderDropdown = (role) => (
    <ActionDropdown
      isOpen={openMenuId === role.id}
      menuRef={menuRef}
      width="150px"
    >
      <button
        type="button"
        className="dropdown-item"
        onClick={() => {
          setConsultRole(role);
          setOpenMenuId(null);
        }}
      >
        <Eye size={14} /> {t("common.view", "Consulter")}
      </button>
      <button
        type="button"
        className="dropdown-item"
        onClick={() => {
          setRoleForm({
            mode: "edit",
            id: role.id,
            name: role.name || "",
            description: role.description || "",
            status: role.status || "Actif",
            permissions: parseRolePermissions(role.permissions),
          });
          setOpenMenuId(null);
        }}
      >
        <Pencil size={14} /> {t("common.edit", "Modifier")}
      </button>
      <button
        type="button"
        className="dropdown-item danger text-red-600"
        onClick={() => {
          setDeleteRole(role);
          setOpenMenuId(null);
        }}
      >
        <Trash size={14} /> {t("common.delete", "Supprimer")}
      </button>
    </ActionDropdown>
  );

  const isTableViewHidden = roleForm !== null || consultRole !== null;

  return (
    <div style={{ padding: "0 1rem" }}>
      {/* Vue Tableau Principal */}
      {!isTableViewHidden && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-semibold text-[var(--text-main)]" style={{ fontSize: "1.5rem" }}>
                {t("roles.title", "Rôles")}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                Définition des habilitations, matrices de permissions et profils d'accès
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setRoleForm({
                  mode: "create",
                  name: "",
                  description: "",
                  status: "Actif",
                  permissions: [],
                })
              }
              className="btn btn-primary flex gap-2 items-center"
              style={{ height: "34px", padding: "0 0.95rem" }}
            >
              {t("roles.createRole", "Créer un rôle")}
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: "visible" }}>
            <div className="table-wrapper">
              <table className="w-full" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th className="text-left" style={{ width: "6%", paddingLeft: "1.25rem" }}>
                      N°
                    </th>
                    <th style={{ width: "28%" }}>Intitulé</th>
                    <th style={{ width: "26%" }}>Statut</th>
                    <th style={{ width: "24%" }}>Créé le</th>
                    <th style={{ width: "16%" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                        {loading ? "Chargement des rôles..." : "Aucun rôle configuré."}
                      </td>
                    </tr>
                  ) : (
                    roles.map((r, index) => (
                      <tr key={r.id}>
                        <td
                          className="text-left font-mono"
                          style={{ paddingLeft: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}
                        >
                          <div className="truncate-name" style={{ maxWidth: "100%" }}>
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </td>
                        <td>
                          <div className="truncate-name font-medium" style={{ maxWidth: "100%" }} title={r.name}>
                            {r.name}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              color: r.status === "Inactif" ? "var(--danger)" : "var(--success)",
                              fontWeight: 600,
                            }}
                          >
                            {r.status === "Inactif" ? t("common.inactive", "Inactif") : t("common.active", "Actif")}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "var(--text-muted)" }}>
                            {new Date(r.createdAt || Date.now()).toLocaleDateString("fr-FR")}
                          </span>
                        </td>
                        <td className="text-center" style={{ padding: "0.5rem", verticalAlign: "middle" }}>
                          <div className="inline-flex flex-col items-center" style={{ gap: "3px" }}>
                            {/* Sommet de la pyramide : Modifier */}
                            <button
                              type="button"
                              onClick={() => {
                                setRoleForm({
                                  mode: "edit",
                                  id: r.id,
                                  name: r.name || "",
                                  description: r.description || "",
                                  status: r.status || "Actif",
                                  permissions: parseRolePermissions(r.permissions),
                                });
                              }}
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
                                onClick={() => setConsultRole(r)}
                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                                title={t("common.view", "Consulter")}
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteRole(r)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Formulaire UNIFIÉ (Création ET Modification) avec Matrice Complète à 2 Colonnes */}
      {roleForm && (() => {
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

        const isEdit = roleForm.mode === "edit";

        return (
          <form
            onSubmit={handleSaveRole}
            className="fade-in flex flex-col gap-6"
            style={{ padding: "0.5rem 0" }}
          >
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <h1 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.35rem" }}>
                  {isEdit ? `Modifier le Rôle : ${roleForm.name || "Rôle"}` : "Créer un Nouveau Rôle"}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Définissez l'intitulé, le statut et configurez la matrice complète des permissions par domaine
                </p>
              </div>

              <div className="flex items-center flex-wrap" style={{ gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setRoleForm(null)}
                  disabled={submitting}
                  className="btn btn-outline font-medium text-[var(--text-main)]"
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center font-semibold cursor-pointer"
                  style={{
                    gap: "0.45rem",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "#1E3A8A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} strokeWidth={2.5} />
                  )}
                  {isEdit ? "Enregistrer les modifications" : "Créer le rôle"}
                </button>
              </div>
            </div>

            {/* Corps du formulaire : 2 colonnes */}
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "1fr 1.6fr", alignItems: "start" }}
            >
              {/* Colonne Gauche : Propriétés Générales */}
              <div className="flex flex-col gap-6">
                <div
                  className="p-6 flex flex-col"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    gap: "1.25rem",
                  }}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem" }}>
                      1. Propriétés Générales du Rôle
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Intitulé, statut d'activation et description fonctionnelle
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label style={labelStyle}>
                        Intitulé du rôle <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={roleForm.name}
                        onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                        placeholder="Ex : Gestionnaire Back-Office, Manager..."
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Statut du rôle <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <select
                        value={roleForm.status}
                        onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Description du rôle</label>
                      <textarea
                        rows={4}
                        placeholder="Précisez les responsabilités associées à ce rôle..."
                        value={roleForm.description}
                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Boîte d'alerte Rôle Critique */}
                {isCriticalRole && (
                  <div
                    className="p-4 flex items-start"
                    style={{
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      gap: "0.75rem",
                    }}
                  >
                    <AlertTriangle size={18} style={{ color: "#DC2626", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <div className="font-bold" style={{ fontSize: "0.85rem", color: "#991B1B", marginBottom: "0.25rem" }}>
                        Rôle Système Critique
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#B91C1C", lineHeight: 1.45 }}>
                        Ce rôle confère des privilèges étendus sur la plateforme. Toute modification de ses permissions s'appliquera immédiatement aux utilisateurs concernés.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Colonne Droite : Matrice des Permissions Système */}
              <div
                className="p-6 flex flex-col gap-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem" }}>
                    2. Matrice des Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Cochez les droits d'accès autorisés pour ce rôle ({roleForm.permissions.length} sélectionnée
                    {roleForm.permissions.length > 1 ? "s" : ""})
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {DOMAIN_GROUPS.map((group) => {
                    const groupSelectedCount = group.permValues.filter((pv) =>
                      roleForm.permissions.includes(pv),
                    ).length;
                    const allInGroupSelected =
                      group.permValues.length > 0 &&
                      groupSelectedCount === group.permValues.length;

                    return (
                      <div key={group.title} className="flex flex-col" style={{ gap: "0.75rem" }}>
                        <div className="flex justify-between items-center">
                          <span
                            className="font-bold"
                            style={{
                              fontSize: "0.75rem",
                              color: "#1E3A8A",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {group.title} ({groupSelectedCount})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleGroup(group.permValues)}
                            className="font-semibold cursor-pointer"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#0284C7",
                              fontSize: "0.78rem",
                              padding: "0.15rem 0.35rem",
                            }}
                          >
                            {allInGroupSelected ? "Tout décocher" : "Tout cocher"}
                          </button>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                          {group.permValues.map((val) => {
                            const isSelected = roleForm.permissions.includes(val);

                            return (
                              <div
                                key={val}
                                onClick={() => handleTogglePerm(val)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.6rem",
                                  padding: "0.65rem 0.85rem",
                                  borderRadius: "8px",
                                  border: isSelected ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                                  backgroundColor: isSelected ? "#F0F9FF" : "#FFFFFF",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <div
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "4px",
                                    backgroundColor: isSelected ? "#0284C7" : "#FFFFFF",
                                    border: isSelected ? "1px solid #0284C7" : "1.5px solid #CBD5E1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#FFFFFF",
                                    flexShrink: 0,
                                  }}
                                >
                                  {isSelected && <Check size={13} strokeWidth={3} />}
                                </div>
                                <span
                                  style={{
                                    fontSize: "0.85rem",
                                    fontWeight: isSelected ? 600 : 500,
                                    color: isSelected ? "var(--text-main)" : "#475569",
                                  }}
                                >
                                  {getPermLabel(val)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        );
      })()}

      {/* Consultation Complète d'un Rôle (Inchangée et Préservée) */}
      {consultRole && (() => {
        const parsedPermissions = parseRolePermissions(consultRole.permissions);
        const totalActivePerms = parsedPermissions.length;
        const roleName = consultRole.name || "Rôle";
        const roleStatus = consultRole.status || "Actif";

        const lowerName = roleName.toLowerCase();
        let accessLevel = "Contrôle Total";
        let securityLevel = "Privilèges maximum (Root)";
        let applicableTo = "Applicable aux administrateurs système";

        if (lowerName.includes("super") || totalActivePerms >= 10) {
          accessLevel = "Contrôle Total";
          securityLevel = "Privilèges maximum (Root)";
          applicableTo = "Applicable aux administrateurs système";
        } else if (
          lowerName.includes("admin") ||
          parsedPermissions.includes("USERS_MANAGE") ||
          parsedPermissions.includes("ROLES_MANAGE")
        ) {
          accessLevel = "Administration Avancée";
          securityLevel = "Privilèges élevés (Admin)";
          applicableTo = "Applicable aux administrateurs";
        } else if (
          parsedPermissions.includes("DOSSIERS_MANAGE") ||
          parsedPermissions.includes("TACHES_MANAGE")
        ) {
          accessLevel = "Gestion Opérationnelle";
          securityLevel = "Privilèges de coordination (Manager)";
          applicableTo = "Applicable aux coordinateurs et chefs de projet";
        } else {
          accessLevel = "Accès Opérationnel";
          securityLevel = "Privilèges standard (Opérationnel)";
          applicableTo = "Applicable aux collaborateurs internes";
        }

        return (
          <div className="fade-in flex flex-col gap-6" style={{ padding: "0.5rem 0" }}>
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  translate="no"
                  className="notranslate flex items-center justify-center font-bold shrink-0 overflow-hidden select-none"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "#FEE2E2",
                    border: "2px solid #FECACA",
                    color: "#DC2626",
                    fontSize: "1.25rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span translate="no" className="notranslate">{getRoleInitials(roleName)}</span>
                </div>
                <div className="flex flex-col" style={{ gap: "0.2rem" }}>
                  <div className="flex items-center flex-wrap" style={{ gap: "0.65rem" }}>
                    <h1 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.35rem" }}>
                      {roleName}
                    </h1>
                    <span
                      className="inline-flex items-center font-semibold"
                      style={{
                        gap: "0.35rem",
                        backgroundColor: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        color: "#059669",
                        padding: "0.15rem 0.65rem",
                        borderRadius: "16px",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span style={{ fontSize: "0.65rem" }}>●</span>
                      {roleStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <span>Niveau d'accès : {accessLevel}</span>
                    <span>•</span>
                    <span>
                      {totalActivePerms} permission{totalActivePerms > 1 ? "s" : ""} active{totalActivePerms > 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>{applicableTo}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setConsultRole(null)}
                  className="inline-flex items-center font-semibold cursor-pointer"
                  style={{
                    gap: "0.35rem",
                    fontSize: "0.85rem",
                    padding: "0.5rem 1.25rem",
                    backgroundColor: "var(--text-main)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  ← Retour
                </button>
              </div>
            </div>

            {/* Corps de consultation */}
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "1fr 1.4fr", alignItems: "start" }}
            >
              {/* Colonne Gauche */}
              <div
                className="p-6 flex flex-col"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem" }}>
                    Définition & Périmètre du Rôle
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Propriétés générales de l'habilitation
                  </p>
                </div>

                <div className="flex flex-col" style={{ gap: "0.85rem" }}>
                  <div
                    className="flex flex-col"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      gap: "0.25rem",
                    }}
                  >
                    <span className="font-bold" style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Intitulé du rôle
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{ fontSize: "0.95rem" }}>
                      {roleName}
                    </span>
                  </div>

                  <div
                    className="flex flex-col"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      gap: "0.25rem",
                    }}
                  >
                    <span className="font-bold" style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Statut du rôle
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{ fontSize: "0.95rem" }}>
                      {roleStatus}
                    </span>
                  </div>

                  <div
                    className="flex flex-col"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      gap: "0.25rem",
                    }}
                  >
                    <span className="font-bold" style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Niveau de sécurité
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{ fontSize: "0.95rem" }}>
                      {securityLevel}
                    </span>
                  </div>

                  <div
                    className="flex flex-col"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "8px",
                      padding: "0.85rem 1rem",
                      gap: "0.35rem",
                    }}
                  >
                    <span className="font-bold" style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Description du rôle
                    </span>
                    <span style={{ fontSize: "0.9rem", color: consultRole.description ? "var(--text-main)" : "#94A3B8", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {consultRole.description || "Contrôle total du système. Gère les collaborateurs, les rôles, les dossiers et les paramètres globaux sans restriction."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Matrice de consultation */}
              <div
                className="p-6 flex flex-col gap-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem" }}>
                    Matrice des Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {totalActivePerms} permission{totalActivePerms > 1 ? "s" : ""} accordée{totalActivePerms > 1 ? "s" : ""} réparties par domaine fonctionnel
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {DOMAIN_GROUPS.map((group) => {
                    const activeInGroup = group.permValues.filter((pv) =>
                      parsedPermissions.includes(pv),
                    );

                    return (
                      <div key={group.title} className="flex flex-col" style={{ gap: "0.6rem" }}>
                        <span className="font-bold" style={{ fontSize: "0.72rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {group.title}
                        </span>
                        {activeInGroup.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {activeInGroup.map((pv) => (
                              <span
                                key={pv}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  padding: "0.35rem 0.85rem",
                                  borderRadius: "20px",
                                  fontSize: "0.8rem",
                                  fontWeight: 500,
                                  ...group.pillStyle,
                                }}
                              >
                                <Check size={13} strokeWidth={2.5} />
                                {getPermLabel(pv)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontStyle: "italic" }}>
                            Aucune permission accordée dans ce domaine
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Supprimer un Rôle */}
      {deleteRole && (
        <div
          className="modal-backdrop fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
        >
          <div className="card fade-in w-full p-6" style={{ maxWidth: "400px" }}>
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                }}
              >
                <Trash size={24} />
              </div>
              <h2 className="font-semibold" style={{ fontSize: "1.25rem" }}>
                Supprimer le rôle
              </h2>
              <p style={{ color: "var(--text-muted)" }}>
                Êtes-vous sûr de vouloir supprimer le rôle <strong>{deleteRole.name}</strong> ? Cette
                action est irréversible et pourrait affecter les utilisateurs associés.
              </p>
              <div className="flex gap-4 w-full mt-4">
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setDeleteRole(null)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    backgroundColor: "#DC2626",
                    borderColor: "#DC2626",
                  }}
                  onClick={handleDeleteRole}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
