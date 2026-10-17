import React from "react";
import { Check } from "lucide-react";
import {
  DOMAIN_GROUPS,
  getRoleInitials,
  getPermLabel,
  parseRolePermissions,
} from "./rolesConstants";

const RoleConsultView = ({
  consultRole,
  setConsultRole,
  setRoleForm,
}) => {
  if (!consultRole) return null;

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
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#1E3A8A",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "0.05em",
            }}
          >
            {getRoleInitials(roleName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.35rem" }}>
                {roleName}
              </h1>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "20px",
                  fontWeight: 600,
                  backgroundColor: roleStatus === "Actif" ? "#DCFCE7" : "#F1F5F9",
                  color: roleStatus === "Actif" ? "#166534" : "#475569",
                  border: `1px solid ${roleStatus === "Actif" ? "#BBF7D0" : "#E2E8F0"}`,
                }}
              >
                {roleStatus}
              </span>
            </div>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {accessLevel} • {applicableTo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setRoleForm({
                id: consultRole.id,
                name: consultRole.name || "",
                description: consultRole.description || "",
                status: consultRole.status || "Actif",
                permissions: parsedPermissions,
                mode: "edit",
              });
              setConsultRole(null);
            }}
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Modifier ce rôle
          </button>
          <button
            type="button"
            onClick={() => setConsultRole(null)}
            className="btn btn-outline"
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
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
};

export default RoleConsultView;
