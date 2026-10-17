import React from "react";
import { Check, Key, BarChart3 } from "lucide-react";
import { getUserInitials } from "../../utils/helpers";

export const AVAILABLE_PERMISSIONS = {
  view_all: "Voir tout",
  edit_all: "Modifier tout",
  delete_all: "Supprimer tout",
  manage_users: "Gérer les utilisateurs",
  manage_roles: "Gérer les rôles",
  view_finances: "Voir les finances",
  manage_finances: "Gérer les finances",
  view_ged: "Accès GED",
  upload_ged: "Ajout GED",
  delete_ged: "Suppression GED",
  view_audit: "Voir les logs d\x27audit",
};

export const getParsedPermissionsList = (perms) => {
  if (!perms) return [];
  try {
    let parsed = typeof perms === "string" ? JSON.parse(perms) : perms;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => AVAILABLE_PERMISSIONS[p] || p);
  } catch (e) {
    return typeof perms === "string" ? perms.split(",").map((s) => s.trim()) : [];
  }
};

const CollaboratorDetailView = ({
  consultUser,
  setConsultUser,
  handleTriggerPasswordReset,
  handleOpenActivityStats,
}) => {
  if (!consultUser) return null;

  return (
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
                className="inline-flex items-center gap-1.5 font-semibold cursor-pointer hover:bg-amber-50 transition-colors"
                style={{
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #FCD34D",
                  backgroundColor: "#FFFBEB",
                  color: "#B45309",
                }}
                title="Envoyer un lien de réinitialisation sécurisé sans connaître le mot de passe"
              >
                <Key size={14} />
                Réinitialiser le mot de passe
              </button>
              <button
                type="button"
                onClick={() => handleOpenActivityStats("user", consultUser)}
                className="btn btn-outline inline-flex items-center font-semibold" style={{gap:"0.45rem",fontSize:"0.85rem",padding:"0.5rem 1rem",borderColor:"#0284C7",color:"#0284C7",backgroundColor:"var(--surface)"}}
              >
                <BarChart3 size={15} />
                Bilan d'activité
              </button>
              <button
                type="button"
                onClick={() => setConsultUser(null)}
                className="inline-flex items-center font-semibold cursor-pointer bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:opacity-90 transition-opacity" style={{gap:"0.35rem",fontSize:"0.85rem",padding:"0.5rem 1.25rem",border:"none",borderRadius:"8px"}}
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
  );
};

export default CollaboratorDetailView;
