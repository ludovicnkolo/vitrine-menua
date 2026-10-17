import React from "react";
import ClientFormFields from "../ClientFormFields";

const CreateClientModal = ({
  showExternalModal,
  setShowExternalModal,
  externalType,
  setExternalType,
  newClient,
  setNewClient,
  handleCreateClient,
  errorMsg,
  loading,
}) => {
  if (!showExternalModal) return null;

  return (
    <div className="fade-in p-4">
      <div className="w-full" style={{ padding: "0" }}>
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setShowExternalModal(false)}
            className="btn btn-outline text-[var(--text-main)]"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2 className="font-semibold" style={{ fontSize: "1.5rem" }}>
            Ajouter un Client
          </h2>
        </div>

        <div
          className="flex gap-6 mb-6 p-2 w-fit"
          style={{ background: "#F8FAFC", borderRadius: "8px" }}
        >
          <label
            htmlFor="ext-type-particulier"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              id="ext-type-particulier"
              type="radio"
              name="ext_type"
              checked={externalType === "Particulier"}
              onChange={() => setExternalType("Particulier")}
            />
            <span className="font-medium">Particulier</span>
          </label>
          <label
            htmlFor="ext-type-societe"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              id="ext-type-societe"
              type="radio"
              name="ext_type"
              checked={externalType === "Société"}
              onChange={() => setExternalType("Société")}
            />
            <span className="font-medium">Société</span>
          </label>
        </div>

        <form onSubmit={handleCreateClient} className="flex flex-col gap-4">
          {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
          <ClientFormFields
            client={newClient}
            setClient={setNewClient}
            type={externalType}
            isEdit={false}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowExternalModal(false)}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Création..." : "Créer le client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClientModal;
