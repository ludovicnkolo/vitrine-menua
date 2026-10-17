import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Eye, Trash, Check, AlertTriangle, Loader2 } from "lucide-react";
import ActionDropdown from "../components/ActionDropdown";
import PaginationControls from "../components/PaginationControls";
import { alertService } from "../utils/AlertService";

// --- Constantes Système déclarées hors composant pour éviter les réallocations mémoire ---
import {
  AVAILABLE_PERMISSIONS,
  DOMAIN_GROUPS,
  getRoleInitials,
  getPermLabel,
  parseRolePermissions,
} from "../components/roles/rolesConstants";
import RoleEditForm from "../components/roles/RoleEditForm";
import RoleConsultView from "../components/roles/RoleConsultView";

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

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const totalPages = Math.max(1, Math.ceil(roles.length / PAGE_SIZE));
  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return roles.slice(start, start + PAGE_SIZE);
  }, [roles, page]);

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
                  {paginatedRoles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                        {loading ? "Chargement des rôles..." : "Aucun rôle configuré."}
                      </td>
                    </tr>
                  ) : (
                    paginatedRoles.map((r, index) => (
                      <tr key={r.id}>
                        <td
                          className="text-left font-mono"
                          style={{ paddingLeft: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}
                        >
                          <div className="truncate-name" style={{ maxWidth: "100%" }}>
                            {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
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

          <PaginationControls
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      {/* Formulaire UNIFIÉ */}
      <RoleEditForm
        roleForm={roleForm}
        setRoleForm={setRoleForm}
        handleSaveRole={handleSaveRole}
        handleTogglePerm={handleTogglePerm}
        handleToggleGroup={handleToggleGroup}
        isCriticalRole={isCriticalRole}
        submitting={submitting}
      />

      {/* Consultation Complète d'un Rôle (Inchangée et Préservée) */}
      <RoleConsultView
        consultRole={consultRole}
        setConsultRole={setConsultRole}
        setRoleForm={setRoleForm}
      />

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
