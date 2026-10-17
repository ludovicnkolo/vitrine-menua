import React from "react";
import UserFormFields from "../UserFormFields";

const CreateUserModal = ({
  showModal,
  setShowModal,
  newUser,
  setNewUser,
  handleCreateUser,
  rolesList,
  polesList,
  errorMsg,
  loading,
}) => {
  if (!showModal) return null;

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
            onClick={() => setShowModal(false)}
            className="btn btn-outline text-[var(--text-main)]"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2 className="font-semibold" style={{ fontSize: "1.5rem" }}>
            Ajouter un Membre Interne
          </h2>
        </div>
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
          <UserFormFields
            user={newUser}
            setUser={setNewUser}
            rolesList={rolesList}
            polesList={polesList}
            isEdit={false}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Création..." : "Créer le membre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
