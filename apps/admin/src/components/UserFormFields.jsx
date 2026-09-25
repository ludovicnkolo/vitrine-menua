import React from "react";
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
  isEdit,
  setSelectedFile,
}) => {
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "isBlocked") value = value === "Inactif";
    setUser({ ...user, [field]: value });
  };

  return (
    <>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <FormField
          label="Nom complet"
          value={user.name}
          onChange={handleChange("name")}
          required={isEdit}
        />
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Email {isEdit ? "" : <span style={{ color: "red" }}>*</span>}
          </label>
          <input
            type="email"
            value={user.email || ""}
            onChange={handleChange("email")}
            required={isEdit}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid var(--border)",
            }}
          />
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <FormField
          label="Numéro de téléphone"
          type="tel"
          value={user.telephone}
          onChange={handleChange("telephone")}
        />
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Rôle
          </label>
          <select
            value={user.roleId || ""}
            onChange={handleChange("roleId")}
            style={selectStyle}
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <FormField
          label="Lieu de résidence"
          value={user.lieuResidence}
          onChange={handleChange("lieuResidence")}
        />
        <FormField
          label="Expérience clé"
          value={user.experienceCle}
          onChange={handleChange("experienceCle")}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <FormField
          label="Langues"
          value={user.langues}
          onChange={handleChange("langues")}
          inputProps={{ placeholder: "Ex: Français, Anglais" }}
        />
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Statut
            {!isEdit && (
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  marginLeft: "0.5rem",
                }}
              >
                (Inactif par défaut)
              </span>
            )}
          </label>
          <select
            value={
              user.isBlocked
                ? "Inactif"
                : user.status || (isEdit ? "Actif" : "Inactif")
            }
            onChange={handleChange(isEdit ? "isBlocked" : "status")}
            style={selectStyle}
          >
            {!isEdit && <option value="Inactif">Inactif</option>}
            <option value="Actif">Actif</option>
            {isEdit && <option value="Inactif">Inactif</option>}
          </select>
        </div>
      </div>

      <FormField
        label="Description profil"
        type="textarea"
        value={user.profile}
        onChange={handleChange("profile")}
      />
    </>
  );
};

export default UserFormFields;
