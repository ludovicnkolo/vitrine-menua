import React from "react";
import { Check, Info } from "lucide-react";

const EditCollaboratorView = ({
  editUser,
  setEditUser,
  handleUpdateUser,
  loading,
  rolesList,
  polesList,
  errorMsg,
}) => {
  if (!editUser) return null;

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
};

export default EditCollaboratorView;
