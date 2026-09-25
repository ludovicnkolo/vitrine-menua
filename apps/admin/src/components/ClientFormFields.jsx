import React from "react";
import FormField from "./FormField";

const ClientFormFields = ({
  client,
  setClient,
  type = "Particulier",
  isEdit = false,
}) => {
  const isParticulier = type === "Particulier" || type === "PARTICULIER";
  const set = (key) => (e) => setClient({ ...client, [key]: e.target.value });

  return (
    <>
      {isParticulier ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Nom complet"
              type="text"
              value={client.name}
              onChange={set("name")}
              required
            />
            <FormField
              label="Email"
              type="email"
              value={client.email}
              onChange={set("email")}
              required
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Téléphone"
              type="tel"
              value={client.telephone}
              onChange={set("telephone")}
            />
            <FormField
              label="Seconde personne à contacter"
              value={client.contactSecondaire}
              onChange={set("contactSecondaire")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Secteur d'activité"
              value={client.secteurActivite}
              onChange={set("secteurActivite")}
            />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Nom de la société / Raison Sociale"
              type="text"
              value={client.raisonSociale}
              onChange={set("raisonSociale")}
              required
            />
            <FormField
              label="SIRET"
              value={client.siret}
              onChange={set("siret")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Email de l'entreprise"
              type="email"
              value={client.emailEntreprise}
              onChange={set("emailEntreprise")}
            />
            <FormField
              label="Téléphone de l'entreprise"
              type="tel"
              value={client.telephoneEntreprise}
              onChange={set("telephoneEntreprise")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Nom du contact"
              type="text"
              value={client.name}
              onChange={set("name")}
              required
            />
            <FormField
              label="Email du contact"
              type="email"
              value={client.email}
              onChange={set("email")}
              required
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Téléphone du contact"
              type="tel"
              value={client.telephone}
              onChange={set("telephone")}
            />
            <FormField
              label="Seconde personne à contacter"
              value={client.contactSecondaire}
              onChange={set("contactSecondaire")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormField
              label="Secteur d'activité"
              value={client.secteurActivite}
              onChange={set("secteurActivite")}
            />
          </div>
        </>
      )}

      {isEdit && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Type de client
            </label>
            <select
              value={client.type || "Particulier"}
              onChange={set("type")}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "white",
              }}
            >
              <option value="Particulier">Particulier</option>
              <option value="Société">Société</option>
            </select>
          </div>
        </div>
      )}

      <FormField
        label="Description client"
        type="textarea"
        value={client.description}
        onChange={set("description")}
      />
    </>
  );
};

export default ClientFormFields;
