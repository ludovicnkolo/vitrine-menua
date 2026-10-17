import React from "react";
import { Check } from "lucide-react";

const EditClientView = ({
  editExternal,
  setEditExternal,
  handleUpdateClient,
  loading,
}) => {
  if (!editExternal) return null;

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

                        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
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
                              title="Détermine si le client peut avoir des dossiers, missions ou tâches créés"
                            >
                              <option value="ACTIF">Actif (Dossiers/Missions/Tâches autorisés)</option>
                              <option value="INACTIF">Inactif (Création bloquée)</option>
                            </select>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "0.25rem" }}>
                              Autorise la création de dossiers, missions et tâches
                            </span>
                          </div>
                          <div>
                            <label style={labelStyle}>Statut du compte portail</label>
                            {editExternal.user ? (
                              <>
                                <select
                                  value={editExternal.accountStatus || (editExternal.user?.isBlocked ? "SUSPENDU" : "ACTIF")}
                                  onChange={(e) => setEditExternal({ ...editExternal, accountStatus: e.target.value })}
                                  style={inputStyle}
                                  title="Si suspendu, la connexion au portail client sera impossible"
                                >
                                  <option value="ACTIF">Actif (Connexion autorisée)</option>
                                  <option value="SUSPENDU">Désactivé / Suspendu (Connexion impossible)</option>
                                </select>
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "0.25rem" }}>
                                  Compte portail : {editExternal.user.email}
                                </span>
                              </>
                            ) : (
                              <div
                                style={{
                                  ...inputStyle,
                                  backgroundColor: "var(--border)",
                                  color: "var(--text-muted)",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Aucun compte portail créé
                              </div>
                            )}
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

                        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
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
                              title="Détermine si le client peut avoir des dossiers, missions ou tâches créés"
                            >
                              <option value="ACTIF">Actif (Dossiers/Missions/Tâches autorisés)</option>
                              <option value="INACTIF">Inactif (Création bloquée)</option>
                            </select>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "0.25rem" }}>
                              Autorise la création de dossiers, missions et tâches
                            </span>
                          </div>
                          <div>
                            <label style={labelStyle}>Statut du compte portail</label>
                            {editExternal.user ? (
                              <>
                                <select
                                  value={editExternal.accountStatus || (editExternal.user?.isBlocked ? "SUSPENDU" : "ACTIF")}
                                  onChange={(e) => setEditExternal({ ...editExternal, accountStatus: e.target.value })}
                                  style={inputStyle}
                                  title="Si suspendu, la connexion au portail client sera impossible"
                                >
                                  <option value="ACTIF">Actif (Connexion autorisée)</option>
                                  <option value="SUSPENDU">Désactivé / Suspendu (Connexion impossible)</option>
                                </select>
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "0.25rem" }}>
                                  Compte portail : {editExternal.user.email}
                                </span>
                              </>
                            ) : (
                              <div
                                style={{
                                  ...inputStyle,
                                  backgroundColor: "var(--border)",
                                  color: "var(--text-muted)",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Aucun compte portail créé
                              </div>
                            )}
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
};

export default EditClientView;
