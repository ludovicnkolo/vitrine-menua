import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Eye, Trash, Check, AlertTriangle } from "lucide-react";
import ActionDropdown from "../components/ActionDropdown";
import { getStatusBadge } from "../utils/helpers";

const getRoleInitials = (name) => {
  if (!name) return "RO";
  const cleaned = name.replace(/[-_]/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const RolesPage = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [consultRole, setConsultRole] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    status: "Actif",
  });
  const [deleteRole, setDeleteRole] = useState(null);
  const isTableViewHidden = showRoleModal || editRole || consultRole;

  const availablePermissions = [
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

  const getPermLabel = (val) =>
    availablePermissions.find((p) => p.value === val)?.label || val;

  const togglePerm = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken") || "";

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
      } else if (resRoles && !resRoles.ok) {
        const errData = await resRoles.json().catch(() => ({}));
        console.error("Error fetching roles:", errData);
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
    }
  };

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPermissionsOpen(false);
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

  const handleDeleteRole = async () => {
    if (!deleteRole) return;
    try {
      await fetch(
        getSafeApiUrl(`/api/crm/roles/${encodeURIComponent(deleteRole.id)}`),
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("adminToken"),
          },
        },
      );
      fetchData();
      if (editRole && editRole.id === deleteRole.id) setEditRole(null);
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
    }
    setDeleteRole(null);
  };

  const renderDropdown = (role) => {
    return (
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
            setEditRole({ ...role });
            try {
              setSelectedPermissions(JSON.parse(role.permissions || "[]"));
            } catch (e) {
              setSelectedPermissions([]);
            }
            setOpenMenuId(null);
          }}
        >
          <Pencil size={14} /> {t("common.edit", "Modifier")}
        </button>
        <button
          type="button"
          className="dropdown-item danger"
          onClick={() => {
            setDeleteRole(role);
            setOpenMenuId(null);
          }}
        >
          <Trash size={14} /> {t("common.delete", "Supprimer")}
        </button>
      </ActionDropdown>
    );
  };

  const renderRoleForm = (title, roleData, setRoleData, onSubmit, onCancel) => (
    <div className="fade-in p-4">
      <div className="w-full relative">
        <div
          className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
        >
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline text-[var(--text-main)]" style={{padding:"0.5rem 1rem"}}
          >
            {t("common.back", "← Retour")}
          </button>
          <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
            {title}
          </h2>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label
              className="block font-medium" style={{marginBottom:"0.25rem"}}
            >
              Intitulé du rôle
            </label>
            <input
              type="text"
              value={roleData.name || ""}
              onChange={(e) =>
                setRoleData({ ...roleData, name: e.target.value })
              }
              placeholder="Ex: GESTIONNAIRE"
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)"}}
            />
          </div>
          <div>
            <label
              className="block font-medium" style={{marginBottom:"0.25rem"}}
            >
              Permissions
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setPermissionsOpen(!permissionsOpen)}
                className="w-full p-2 cursor-pointer flex justify-between items-center" style={{minHeight:"38px",borderRadius:"4px",border:"1px solid var(--border)",background:"white",fontFamily:"inherit",fontSize:"inherit"}}
              >
                <span
                  style={{
                    color:
                      selectedPermissions.length > 0
                        ? "var(--text-main)"
                        : "var(--text-muted)",
                  }}
                >
                  {selectedPermissions.length > 0
                    ? selectedPermissions.map(getPermLabel).join(", ")
                    : "Sélectionner des permissions..."}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    flexShrink: 0,
                    marginLeft: "0.5rem",
                  }}
                >
                  ▼
                </span>
              </button>
              {permissionsOpen && (
                <div
                  className="absolute p-2 flex flex-col gap-2" style={{top:"100%",marginTop:"4px",background:"white",border:"1px solid var(--border)",borderRadius:"4px",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",zIndex:10,maxHeight:"200px",overflowY:"auto"}}
                >
                  {availablePermissions.map((p) => (
                    <label
                      key={p.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(p.value)}
                        onChange={() => togglePerm(p.value)}
                      />{" "}
                      {p.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              className="block font-medium" style={{marginBottom:"0.25rem"}}
            >
              Description du rôle
            </label>
            <textarea
              rows="3"
              value={roleData.description || ""}
              onChange={(e) =>
                setRoleData({ ...roleData, description: e.target.value })
              }
              placeholder="Description des responsabilités..."
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)",resize:"vertical",fontFamily:"inherit"}}
            ></textarea>
          </div>
          <div>
            <label
              className="block font-medium" style={{marginBottom:"0.25rem"}}
            >
              Statut
            </label>
            <select
              value={roleData.status || "Actif"}
              onChange={(e) =>
                setRoleData({ ...roleData, status: e.target.value })
              }
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)",background:"white"}}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div
            className="flex justify-end gap-2 mt-4"
          >
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              {title.includes("Créer") ? "Créer le rôle" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 1rem" }}>
      {!isTableViewHidden && (
        <>
          <div
            className="flex justify-between items-center mb-6"
          >
            <h1
              className="font-semibold text-[var(--text-main)]" style={{fontSize:"1.5rem"}}
            >
              {t("roles.title", "Rôles")}
            </h1>
            <button
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="btn btn-primary flex gap-2 items-center" style={{height:"28px",padding:"0 0.75rem"}}
            >
              {t("roles.createRole", "Créer un rôle")}
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: "visible" }}>
            <div className="table-wrapper">
              <table className="w-full" style={{tableLayout:"fixed"}}>
                <thead>
                  <tr>
                    <th className="text-left" style={{width:"5%",paddingLeft:"1.25rem"}}>N°</th>
                    <th style={{ width: "25%" }}>Intitulé</th>
                    <th style={{ width: "25%" }}>Date de création</th>
                    <th style={{ width: "30%" }}>Statut</th>
                    <th style={{ width: "15%" }}>{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r, index) => (
                    <tr key={r.id}>
                      <td className="text-left" style={{paddingLeft:"1.25rem",color:"var(--text-muted)",fontSize:"0.85rem"}}>
                        <div className="truncate-name" style={{ maxWidth: "100%" }}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </td>
                      <td>
                        <div className="truncate-name font-medium" style={{maxWidth:"100%"}} title={r.name}>
                          {r.name}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-muted)" }}>
                          {new Date(r.createdAt || Date.now()).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: r.status === "Inactif" ? "var(--danger)" : "var(--success)",
                          }}
                        >
                          {r.status === "Inactif" ? t("common.inactive", "Inactif") : t("common.active", "Actif")}
                        </span>
                      </td>
                      <td style={{ overflow: "visible", position: "relative", zIndex: openMenuId === r.id ? 1000 : 1 }}>
                        <div
                          className="flex gap-2 justify-center"
                        >
                          <div className="relative">
                            <button
                              type="button"
                              className="action-menu-trigger"
                              onClick={(e) => toggleMenu(e, r.id)}
                              style={{
                                background: openMenuId === r.id ? "#E2E8F0" : "transparent",
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
                            {renderDropdown(r)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Créer un Rôle */}
      {showRoleModal &&
        renderRoleForm(
          "Créer un Rôle",
          newRole,
          setNewRole,
          async (e) => {
            e.preventDefault();
            try {
              const res = await fetch(getSafeApiUrl("/api/crm/roles"), {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer " + sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                  name: newRole.name,
                  description: newRole.description,
                  status: newRole.status,
                  permissions: JSON.stringify(selectedPermissions),
                }),
              });
              const data = await res.json();
              if (!res.ok) {
                window.customAlert("Erreur: " + (data.error || "Impossible de créer le rôle"), "Erreur", "error");
                return;
              }
              setNewRole({ name: "", description: "", status: "Actif" });
              setSelectedPermissions([]);
              setShowRoleModal(false);
              window.customAlert("Le rôle a été enregistré avec succès.", "Succès", "info");
              fetchData();
            } catch (err) {
              console.error("Erreur lors de la création:", err);
              window.customAlert("Erreur réseau lors de la création du rôle.", "Erreur", "error");
            }
          },
          () => setShowRoleModal(false),
        )}

      {/* Modal Modifier un Rôle */}
      {editRole && (() => {
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

        const domainGroups = [
          {
            title: "MESSAGES & COMMUNICATION",
            permValues: ["MESSAGES_VIEW", "MESSAGES_PROCESS"],
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
          },
          {
            title: "ADMINISTRATION & SÉCURITÉ SYSTÈME",
            permValues: ["CLIENTS_MANAGE", "USERS_MANAGE", "ROLES_MANAGE"],
          },
        ];

        const isCriticalRole =
          editRole.name?.toLowerCase().includes("super") ||
          editRole.name?.toLowerCase().includes("admin") ||
          selectedPermissions.length >= 8 ||
          selectedPermissions.includes("USERS_MANAGE") ||
          selectedPermissions.includes("ROLES_MANAGE");

        const toggleGroup = (groupValues) => {
          const allSelected = groupValues.every((val) => selectedPermissions.includes(val));
          if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((val) => !groupValues.includes(val)));
          } else {
            setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupValues])));
          }
        };

        const handleSaveRole = async (e) => {
          e.preventDefault();
          try {
            const res = await fetch(
              getSafeApiUrl(`/api/crm/roles/${encodeURIComponent(editRole.id)}`),
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                  name: editRole.name,
                  description: editRole.description,
                  status: editRole.status,
                  permissions: JSON.stringify(selectedPermissions),
                }),
              },
            );
            const data = await res.json();
            if (!res.ok) {
              window.customAlert("Erreur: " + (data.error || "Impossible de modifier le rôle"), "Erreur", "error");
              return;
            }
            setEditRole(null);
            window.customAlert("Le rôle a été modifié avec succès.", "Succès", "info");
            fetchData();
          } catch (err) {
            console.error("Erreur lors de la mise à jour:", err);
            window.customAlert("Erreur réseau lors de la modification du rôle.", "Erreur", "error");
          }
        };

        return (
          <form
            onSubmit={handleSaveRole}
            className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}
          >
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              <div>
                <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                  Modifier le Rôle : {editRole.name || "Rôle"}
                </h1>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Définissez l'intitulé, le statut et activez les permissions accordées par domaine d'activité
                </p>
              </div>

              <div className="flex items-center flex-wrap" style={{gap:"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => setEditRole(null)}
                  className="btn btn-outline font-medium text-[var(--text-main)]" style={{padding:"0.5rem 1.25rem",borderRadius:"8px",backgroundColor:"#FFFFFF",fontSize:"0.85rem"}}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.45rem",padding:"0.5rem 1.25rem",backgroundColor:"#1E3A8A",color:"#FFFFFF",border:"none",borderRadius:"8px",fontSize:"0.85rem"}}
                >
                  <Check size={16} strokeWidth={2.5} />
                  Enregistrer les modifications
                </button>
              </div>
            </div>

            {/* Body: Two columns layout */}
            <div
              className="grid gap-6" style={{gridTemplateColumns:"1fr 1.6fr",alignItems:"start"}}
            >
              {/* Left Column: Propriétés Générales + Alerte */}
              <div className="flex flex-col gap-6">
                {/* Card 1: Propriétés Générales du Rôle */}
                <div
                  className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
                >
                  <div>
                    <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                      1. Propriétés Générales du Rôle
                    </h2>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Intitulé, statut et description de la fonction
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
                        value={editRole.name || ""}
                        onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Statut du rôle <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <select
                        value={editRole.status || "Actif"}
                        onChange={(e) => setEditRole({ ...editRole, status: e.target.value })}
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
                        placeholder="Description des responsabilités et accès..."
                        value={editRole.description || ""}
                        onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Alert Box for Critical Role */}
                {isCriticalRole && (
                  <div
                    className="p-4 flex items-start" style={{backgroundColor:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",gap:"0.75rem"}}
                  >
                    <AlertTriangle size={18} style={{ color: "#DC2626", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <div className="font-bold" style={{fontSize:"0.85rem",color:"#991B1B",marginBottom:"0.25rem"}}>
                        Rôle Système Critique
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#B91C1C", lineHeight: 1.45 }}>
                        Ce rôle possède des privilèges élevés sur l'ensemble des données et des utilisateurs de la plateforme. Toute modification de permission s'appliquera immédiatement à tous les utilisateurs rattachés.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Matrice des Permissions Système */}
              <div
                className="p-6 flex flex-col gap-6" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                    2. Matrice des Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Cochez les droits d'accès autorisés pour ce rôle ({selectedPermissions.length} sélectionnée{selectedPermissions.length > 1 ? "s" : ""})
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {domainGroups.map((group) => {
                    const groupSelectedCount = group.permValues.filter((pv) =>
                      selectedPermissions.includes(pv),
                    ).length;
                    const allInGroupSelected =
                      group.permValues.length > 0 &&
                      groupSelectedCount === group.permValues.length;

                    return (
                      <div key={group.title} className="flex flex-col" style={{gap:"0.75rem"}}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold" style={{fontSize:"0.75rem",color:"#1E3A8A",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                            {group.title} ({groupSelectedCount})
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.permValues)}
                            className="font-semibold cursor-pointer" style={{background:"none",border:"none",color:"#0284C7",fontSize:"0.78rem",padding:"0.15rem 0.35rem"}}
                          >
                            {allInGroupSelected ? "Tout décocher" : "Tout cocher"}
                          </button>
                        </div>

                        <div
                          className="grid" style={{gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}
                        >
                          {group.permValues.map((val) => {
                            const isSelected = selectedPermissions.includes(val);

                            return (
                              <div
                                key={val}
                                onClick={() => togglePerm(val)}
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

      {/* Modal Consulter un Rôle */}
      {consultRole && (() => {
        const parsedPermissions = (() => {
          try {
            if (Array.isArray(consultRole.permissions)) return consultRole.permissions;
            if (typeof consultRole.permissions === "string") return JSON.parse(consultRole.permissions);
            return [];
          } catch {
            return [];
          }
        })();

        const totalActivePerms = parsedPermissions.length;
        const roleName = consultRole.name || "Rôle";
        const roleStatus = consultRole.status || "Actif";

        // Security level & applicable scope logic
        const lowerName = roleName.toLowerCase();
        let accessLevel = "Contrôle Total";
        let securityLevel = "Privilèges maximum (Root)";
        let applicableTo = "Applicable aux administrateurs système";

        if (lowerName.includes("super") || totalActivePerms >= 10) {
          accessLevel = "Contrôle Total";
          securityLevel = "Privilèges maximum (Root)";
          applicableTo = "Applicable aux administrateurs système";
        } else if (lowerName.includes("admin") || parsedPermissions.includes("USERS_MANAGE") || parsedPermissions.includes("ROLES_MANAGE")) {
          accessLevel = "Administration Avancée";
          securityLevel = "Privilèges élevés (Admin)";
          applicableTo = "Applicable aux administrateurs";
        } else if (parsedPermissions.includes("DOSSIERS_MANAGE") || parsedPermissions.includes("TACHES_MANAGE")) {
          accessLevel = "Gestion Opérationnelle";
          securityLevel = "Privilèges de coordination (Manager)";
          applicableTo = "Applicable aux coordinateurs et chefs de projet";
        } else {
          accessLevel = "Accès Opérationnel";
          securityLevel = "Privilèges standard (Opérationnel)";
          applicableTo = "Applicable aux collaborateurs internes";
        }

        // Domain definitions matching screenshot
        const domainGroups = [
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

        return (
          <div className="fade-in flex flex-col gap-6" style={{padding:"0.5rem 0"}}>
            {/* Header Card */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",padding:"1.25rem 1.5rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
            >
              {/* Left: Avatar + Title + Subtitle */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center font-bold" style={{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"#FEE2E2",border:"2px solid #FECACA",color:"#DC2626",fontSize:"1.25rem",letterSpacing:"0.02em"}}
                >
                  {getRoleInitials(roleName)}
                </div>
                <div className="flex flex-col" style={{gap:"0.2rem"}}>
                  <div className="flex items-center flex-wrap" style={{gap:"0.65rem"}}>
                    <h1 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.35rem"}}>
                      {roleName}
                    </h1>
                    <span
                      className="inline-flex items-center font-semibold" style={{gap:"0.35rem",backgroundColor:"#ECFDF5",border:"1px solid #A7F3D0",color:"#059669",padding:"0.15rem 0.65rem",borderRadius:"16px",fontSize:"0.75rem"}}
                    >
                      <span style={{ fontSize: "0.65rem" }}>●</span>
                      {roleStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap" style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>
                    <span>Niveau d'accès : {accessLevel}</span>
                    <span>•</span>
                    <span>{totalActivePerms} permission{totalActivePerms > 1 ? "s" : ""} active{totalActivePerms > 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span>{applicableTo}</span>
                  </div>
                </div>
              </div>

              {/* Right: Return Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setConsultRole(null)}
                  className="inline-flex items-center font-semibold cursor-pointer" style={{gap:"0.35rem",fontSize:"0.85rem",padding:"0.5rem 1.25rem",backgroundColor:"var(--text-main)",color:"#FFFFFF",border:"none",borderRadius:"8px"}}
                >
                  ← Retour
                </button>
              </div>
            </div>

            {/* Body: Two columns layout */}
            <div
              className="grid gap-6" style={{gridTemplateColumns:"1fr 1.4fr",alignItems:"start"}}
            >
              {/* Left Column: Définition & Périmètre du Rôle */}
              <div
                className="p-6 flex flex-col" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",gap:"1.25rem"}}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                    Définition & Périmètre du Rôle
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Propriétés générales de l'habilitation
                  </p>
                </div>

                <div className="flex flex-col" style={{gap:"0.85rem"}}>
                  {/* INTITULÉ DU RÔLE */}
                  <div
                    className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                  >
                    <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      Intitulé du rôle
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {roleName}
                    </span>
                  </div>

                  {/* STATUT DU RÔLE */}
                  <div
                    className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                  >
                    <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      Statut du rôle
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {roleStatus}
                    </span>
                  </div>

                  {/* NIVEAU DE SÉCURITÉ */}
                  <div
                    className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.75rem 1rem",gap:"0.25rem"}}
                  >
                    <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      Niveau de sécurité
                    </span>
                    <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                      {securityLevel}
                    </span>
                  </div>

                  {/* DESCRIPTION DU RÔLE */}
                  <div
                    className="flex flex-col" style={{backgroundColor:"#F8FAFC",border:"1px solid #F1F5F9",borderRadius:"8px",padding:"0.85rem 1rem",gap:"0.35rem"}}
                  >
                    <span className="font-bold" style={{fontSize:"0.7rem",color:"#64748B",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      Description du rôle
                    </span>
                    <span style={{ fontSize: "0.9rem", color: consultRole.description ? "var(--text-main)" : "#94A3B8", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {consultRole.description || "Contrôle total du système. Gère les collaborateurs, les rôles, les dossiers et les paramètres globaux sans restriction."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Matrice des Permissions Système */}
              <div
                className="p-6 flex flex-col gap-6" style={{backgroundColor:"#FFFFFF",borderRadius:"12px",border:"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}
              >
                <div>
                  <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.05rem"}}>
                    Matrice des Permissions Système
                  </h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {totalActivePerms} permission{totalActivePerms > 1 ? "s" : ""} accordée{totalActivePerms > 1 ? "s" : ""} réparties par domaine fonctionnel
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {domainGroups.map((group) => {
                    const activeInGroup = group.permValues.filter((pv) =>
                      parsedPermissions.includes(pv),
                    );

                    return (
                      <div key={group.title} className="flex flex-col" style={{gap:"0.6rem"}}>
                        <span className="font-bold" style={{fontSize:"0.72rem",color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em"}}>
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
          className="modal-backdrop fixed flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.5)",zIndex:1000}}
        >
          <div
            className="card fade-in w-full p-6" style={{maxWidth:"400px"}}
          >
            <div
              className="flex flex-col items-center text-center gap-4"
            >
              <div
                className="flex items-center justify-center" style={{width:"48px",height:"48px",borderRadius:"50%",backgroundColor:"#FEE2E2",color:"#DC2626"}}
              >
                <Trash size={24} />
              </div>
              <h2 className="font-semibold" style={{fontSize:"1.25rem"}}>
                Supprimer le rôle
              </h2>
              <p style={{ color: "var(--text-muted)" }}>
                Êtes-vous sûr de vouloir supprimer le rôle{" "}
                <strong>{deleteRole.name}</strong> ? Cette action est
                irréversible et pourrait affecter les utilisateurs associés.
              </p>
              <div
                className="flex gap-4 w-full mt-4"
              >
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
