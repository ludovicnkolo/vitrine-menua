import React from "react";
import { AlertTriangle, Loader2, Check } from "lucide-react";
import { DOMAIN_GROUPS, getPermLabel } from "./rolesConstants";

const RoleEditForm = ({
  roleForm,
  setRoleForm,
  handleSaveRole,
  handleTogglePerm,
  handleToggleGroup,
  isCriticalRole,
  submitting,
}) => {
  if (!roleForm) return null;
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

};

export default RoleEditForm;
