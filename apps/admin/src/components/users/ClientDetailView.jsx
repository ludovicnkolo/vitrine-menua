import React from "react";
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  Send,
  Ban,
  Key,
  Mail,
} from "lucide-react";
import { getUserInitials } from "../../utils/helpers";

const ClientDetailView = ({
  consultExternal,
  setConsultExternal,
  handleOpenActivityStats,
  openConvertModal,
  handleResendInvitation,
  handleResetAccountPassword,
  handleToggleAccountStatus,
}) => {
  if (!consultExternal) return null;

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
                <button
                  type="button"
                  onClick={() => handleOpenActivityStats("client", consultExternal)}
                  className="inline-flex items-center font-semibold cursor-pointer transition-colors"
                  style={{
                    gap: "0.45rem",
                    fontSize: "0.85rem",
                    padding: "0.5rem 1.15rem",
                    backgroundColor: "var(--btn-action-edit-bg, #EFF6FF)",
                    color: "var(--btn-action-edit-color, #2563EB)",
                    border: "1px solid var(--btn-action-edit-border, #BFDBFE)",
                    borderRadius: "8px",
                  }}
                  title="Consulter les statistiques d'activité du client"
                >
                  <Activity size={16} />
                  Consulter les statistiques d'activité
                </button>
                <button
                  type="button"
                  onClick={() => setConsultExternal(null)}
                  className="inline-flex items-center font-semibold cursor-pointer bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:opacity-90 transition-opacity" style={{gap:"0.35rem",fontSize:"0.85rem",padding:"0.5rem 1.25rem",border:"none",borderRadius:"8px"}}
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
                  backgroundColor: "var(--surface, #FFFFFF)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Entête de la carte compte avec Email et Statut sur la même horizontale */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: "1px solid var(--border, #F1F5F9)" }}>
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

                  {/* Email & Badge Statut sur la même horizontale */}
                  <div className="flex items-center flex-wrap gap-2.5">
                    {consultExternal.user?.email && (
                      <span
                        className="inline-flex items-center gap-1.5 font-medium"
                        style={{
                          fontSize: "0.82rem",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "16px",
                          backgroundColor: "var(--bg-main, #F1F5F9)",
                          border: "1px solid var(--border, #E2E8F0)",
                          color: "var(--text-main, #334155)",
                        }}
                        title={`Email de connexion : ${consultExternal.user.email}`}
                      >
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="font-semibold">{consultExternal.user.email}</span>
                      </span>
                    )}

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

                {/* Barre d'actions administratives conformes au cadrage Mme Fouelefack */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-0">
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


          </div>
        );
};

export default ClientDetailView;
