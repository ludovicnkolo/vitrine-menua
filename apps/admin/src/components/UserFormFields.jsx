import React, { useState, useRef, useEffect } from "react";
import FormField from "./FormField";

const selectStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid var(--border)",
  background: "white",
};

const UserFormFields = ({
  user,
  setUser,
  rolesList,
  polesList = [],
  isEdit,
  setSelectedFile,
}) => {
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "isBlocked") value = value === "Inactif";
    setUser({ ...user, [field]: value });
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LANGUAGES = [
    "Allemand", "Anglais", "Arabe", "Coréen", "Espagnol", "Français", 
    "Italien", "Japonais", "Mandarin", "Néerlandais", "Polonais", "Portugais"
  ];

  const selectedLanguages = user.langues ? user.langues.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setUser({ ...user, langues: selectedLanguages.filter(l => l !== lang).join(', ') });
    } else {
      setUser({ ...user, langues: [...selectedLanguages, lang].join(', ') });
    }
  };

  return (
    <>
      <div
        className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
      >
        <FormField
          label="Nom complet"
          value={user.name}
          onChange={handleChange("name")}
          required={true}
        />
        <div>
          <label
            className="block font-medium" style={{marginBottom:"0.25rem"}}
          >
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            value={user.email || ""}
            onChange={handleChange("email")}
            required={true}
            className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)"}}
          />
        </div>
      </div>

      <div
        className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
      >
        <FormField
          label="Numéro de téléphone"
          type="tel"
          value={user.telephone}
          onChange={handleChange("telephone")}
          required={true}
        />
        <div>
          <label
            className="block font-medium" style={{marginBottom:"0.25rem"}}
          >
            Rôle <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={user.roleId || ""}
            onChange={handleChange("roleId")}
            style={selectStyle}
            required={true}
          >
            <option value="">Sélectionner un rôle...</option>
            {rolesList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
      >
        <FormField
          label="Lieu de résidence"
          value={user.lieuResidence}
          onChange={handleChange("lieuResidence")}
          required={true}
        />
        <FormField
          label="Expérience clé"
          value={user.experienceCle}
          onChange={handleChange("experienceCle")}
          required={true}
        />
      </div>

      <div
        className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
      >
        <div ref={langDropdownRef} className="relative">
          <label
            className="block font-medium" style={{marginBottom:"0.25rem"}}
          >
            Langues <span style={{ color: "red" }}>*</span>
          </label>
          <div
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="w-full p-2 cursor-pointer flex justify-between items-center" style={{borderRadius:"4px",border:"1px solid var(--border)",background:"white"}}
          >
            <span style={{ 
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              color: selectedLanguages.length ? "inherit" : "var(--text-muted)" 
            }}>
              {selectedLanguages.length > 0 ? selectedLanguages.join(', ') : "Sélectionner des langues..."}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>▼</span>
          </div>
          
          {langDropdownOpen && (
            <div className="absolute" style={{top:"100%",background:"white",border:"1px solid var(--border)",borderRadius:"4px",marginTop:"4px",maxHeight:"200px",overflowY:"auto",zIndex:50,boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}>
              {LANGUAGES.map(lang => (
                <label 
                  key={lang} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    cursor: "pointer",
                    background: selectedLanguages.includes(lang) ? "#f1f5f9" : "transparent"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {lang}
                </label>
              ))}
            </div>
          )}
        </div>
        <FormField
          label="Formations / Diplômes"
          value={user.formations}
          onChange={handleChange("formations")}
          inputProps={{ placeholder: "Ex: Master Finance" }}
        />
      </div>

      <div className="grid gap-4 mt-4" style={{gridTemplateColumns:"1fr 1fr"}}>
        <FormField
          label="Description profil"
          type="textarea"
          value={user.profile}
          onChange={handleChange("profile")}
        />
        <div>
          <label className="block font-medium" style={{marginBottom:"0.25rem"}}>
            Statut <span style={{ color: "red" }}>*</span>
            {!isEdit && (
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                (Invitation envoyée par défaut)
              </span>
            )}
          </label>
          <select
            value={user.status || "Invitation envoyée"}
            onChange={handleChange("status")}
            style={selectStyle}
          >
            <option value="Invitation envoyée">Invitation envoyée</option>
            <option value="Activation en attente">Activation en attente</option>
            <option value="Actif">Actif</option>
            <option value="Suspendu / Inactif">Suspendu / Inactif</option>
          </select>
        </div>
      </div>

      {/* ── Section V3 : Organisation & Fiche interne ─────────────────────────── */}
      <div style={{
        marginTop: "1.25rem",
        paddingTop: "1rem",
        borderTop: "1px solid var(--border)",
      }}>
        <p className="font-semibold" style={{fontSize:"0.78rem",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem"}}>
          Organisation &amp; Fiche interne
        </p>
        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
          {/* Pôle d'activité */}
          <div>
            <label className="block font-medium" style={{marginBottom:"0.25rem"}}>
              Pôle d'activité
            </label>
            <select
              value={user.poleActivite || ""}
              onChange={handleChange("poleActivite")}
              style={selectStyle}
            >
              <option value="">— Aucun pôle —</option>
              {polesList.length > 0
                ? polesList.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))
                : [
                    "Assurance",
                    "CGP / Patrimoine",
                    "Comptabilité / Gestion",
                    "Finance / Reporting",
                    "Risques / Conformité",
                    "Data / IT",
                    "Transversal",
                  ].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
            </select>
          </div>
          {/* Matricule interne */}
          <div>
            <label className="block font-medium" style={{marginBottom:"0.25rem"}}>
              Matricule interne
            </label>
            <input
              type="text"
              value={user.matricule || ""}
              onChange={handleChange("matricule")}
              placeholder="Ex: MC-2024-001"
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)"}}
            />
          </div>
        </div>

        <div className="grid gap-4 mt-4" style={{gridTemplateColumns:"1fr 1fr"}}>
          {/* E-mail professionnel */}
          <div>
            <label className="block font-medium" style={{marginBottom:"0.25rem"}}>
              E-mail professionnel (identifiant CRM)
            </label>
            <input
              type="email"
              value={user.emailPro || ""}
              onChange={handleChange("emailPro")}
              placeholder="prenom.nom@menuaconsulting.com"
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)"}}
            />
          </div>
          {/* Fonction */}
          <div>
            <label className="block font-medium" style={{marginBottom:"0.25rem"}}>
              Fonction / Intitulé de poste
            </label>
            <input
              type="text"
              value={user.fonction || ""}
              onChange={handleChange("fonction")}
              placeholder="Ex: Chargé(e) de back-office"
              className="w-full p-2" style={{borderRadius:"4px",border:"1px solid var(--border)"}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormFields;
