import React from "react";
import { X } from "lucide-react";

export const GedFolderModals = ({
  showNewFolderModal,
  setShowNewFolderModal,
  newFolderName,
  setNewFolderName,
  handleCreateFolder,
  showUploadModal,
  setShowUploadModal,
  uploadFile,
  setUploadFile,
  handleUploadFile,
  showRenameModal,
  setShowRenameModal,
  renameItem,
  renameName,
  setRenameName,
  handleRenameSubmit,
  isSubmitting,
}) => {
  return (
    <>
      {/* Modal Nouveau Dossier */}
      {showNewFolderModal && (
        <div
          className="fade-in fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1100 }}
        >
          <div
            className="p-8"
            style={{
              background: "#FFF",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
                Nouveau dossier
              </h3>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  Nom du dossier *
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="input-field w-full"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newFolderName.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Fichier */}
      {showUploadModal && (
        <div
          className="fade-in fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1100 }}
        >
          <div
            className="p-8"
            style={{
              background: "#FFF",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
                Ajouter un fichier
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUploadFile}>
              <div className="mb-6">
                <input
                  required
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="input-field w-full"
                  style={{ padding: "0.75rem" }}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFile}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Envoi..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Renommer Dossier */}
      {showRenameModal && (
        <div
          className="fade-in fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1100 }}
        >
          <div
            className="p-8"
            style={{
              background: "#FFF",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
                {renameItem?.type === "file" || renameItem?.dossierId
                  ? "Renommer le document"
                  : "Renommer le dossier"}
              </h3>
              <button
                type="button"
                onClick={() => setShowRenameModal(false)}
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  {renameItem?.type === "file" || renameItem?.dossierId
                    ? "Nouveau nom du document *"
                    : "Nouveau nom du dossier *"}
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  className="input-field w-full"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !renameName.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Sauvegarde..." : "Renommer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GedFolderModals;
