import React, { ChangeEvent } from "react";
import FormField from "./FormField";

export interface ClientData {
  type?: string;
  name?: string;
  email?: string;
  telephone?: string;
  contactSecondaire?: string;
  secteurActivite?: string;
  raisonSociale?: string;
  siret?: string;
  emailEntreprise?: string;
  telephoneEntreprise?: string;
  description?: string;
  [key: string]: any;
}

export interface ClientFormFieldsProps {
  client: ClientData;
  setClient: (client: ClientData) => void;
  type?: string;
  isEdit?: boolean;
}

const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  client,
  setClient,
  type = "Particulier",
  isEdit = false,
}) => {
  const isParticulier = type === "Particulier" || type === "PARTICULIER";
  const set = (key: keyof ClientData) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setClient({ ...client, [key]: e.target.value });

  return (
    <>
      {isParticulier ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nom complet"
              type="text"
              value={client.name || ""}
              onChange={set("name")}
              required
            />
            <FormField
              label="Email"
              type="email"
              value={client.email || ""}
              onChange={set("email")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Téléphone"
              type="tel"
              value={client.telephone || ""}
              onChange={set("telephone")}
            />
            <FormField
              label="Seconde personne à contacter"
              value={client.contactSecondaire || ""}
              onChange={set("contactSecondaire")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Secteur d'activité"
              value={client.secteurActivite || ""}
              onChange={set("secteurActivite")}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nom de la société / Raison Sociale"
              type="text"
              value={client.raisonSociale || ""}
              onChange={set("raisonSociale")}
              required
            />
            <FormField
              label="SIRET"
              value={client.siret || ""}
              onChange={set("siret")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Email de l'entreprise"
              type="email"
              value={client.emailEntreprise || ""}
              onChange={set("emailEntreprise")}
            />
            <FormField
              label="Téléphone de l'entreprise"
              type="tel"
              value={client.telephoneEntreprise || ""}
              onChange={set("telephoneEntreprise")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nom du contact"
              type="text"
              value={client.name || ""}
              onChange={set("name")}
              required
            />
            <FormField
              label="Email du contact"
              type="email"
              value={client.email || ""}
              onChange={set("email")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Téléphone du contact"
              type="tel"
              value={client.telephone || ""}
              onChange={set("telephone")}
            />
            <FormField
              label="Seconde personne à contacter"
              value={client.contactSecondaire || ""}
              onChange={set("contactSecondaire")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Secteur d'activité"
              value={client.secteurActivite || ""}
              onChange={set("secteurActivite")}
            />
          </div>
        </>
      )}

      {isEdit && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1 text-sm text-[var(--text-main)]">
              Type de client
            </label>
            <select
              value={client.type || "Particulier"}
              onChange={set("type")}
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--primary)] transition-colors"
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
        value={client.description || ""}
        onChange={set("description")}
      />
    </>
  );
};

export default ClientFormFields;
