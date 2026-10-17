import React from "react";
import { Search, X, Upload, Plus, Trash, RefreshCw } from "lucide-react";

const GedToolbar = ({
  searchQuery,
  setSearchQuery,
  canWriteCurrent,
  currentFolderId,
  setShowUploadModal,
  setShowNewFolderModal,
  isSuperAdmin,
  handleOpenTrash,
  setLoading,
  fetchDossiers,
}) => {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h2
          className="font-bold text-[var(--text-main)]"
          style={{ fontSize: "1.4rem" }}
        >
          Explorateur de Fichiers (GED)
        </h2>
        <div
          style={{
            fontSize: "0.85rem",
            color: "#64748B",
            marginTop: "0.2rem",
          }}
        >
          Gestion Électronique des Documents par dossier et mission
        </div>
      </div>

      <div className="flex items-center flex-wrap" style={{ gap: "0.75rem" }}>
        <div className="relative" style={{ width: "260px" }}>
          <Search
            size={16}
            color="var(--text-muted)"
            className="absolute"
            style={{
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Rechercher dossiers, fichiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[var(--text-main)]"
            style={{
              padding: "0.55rem 2rem 0.55rem 2.2rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: "0.85rem",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute cursor-pointer"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {canWriteCurrent && currentFolderId && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center text-white font-semibold cursor-pointer btn-primary"
            style={{
              gap: "0.4rem",
              background: "var(--primary)",
              padding: "0.55rem 1.1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              border: "none",
            }}
          >
            <Upload size={15} /> Importer
          </button>
        )}

        {canWriteCurrent && (
          <button
            type="button"
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center text-[var(--text-main)] font-semibold cursor-pointer"
            style={{
              gap: "0.4rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              padding: "0.55rem 1.1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
            }}
          >
            <Plus size={15} /> Nouveau
          </button>
        )}

        {isSuperAdmin && (
          <button
            type="button"
            onClick={handleOpenTrash}
            className="flex items-center font-semibold cursor-pointer"
            style={{
              gap: "0.4rem",
              background: "var(--btn-action-delete-bg)",
              color: "var(--btn-action-delete-color)",
              border: "1px solid var(--btn-action-delete-border)",
              padding: "0.55rem 1.1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
            }}
          >
            <Trash size={15} /> Corbeille
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            fetchDossiers();
          }}
          className="flex items-center cursor-pointer"
          style={{
            gap: "0.4rem",
            background: "var(--surface)",
            color: "var(--text-main)",
            border: "1px solid var(--border)",
            padding: "0.55rem 0.75rem",
            borderRadius: "8px",
          }}
          title="Rafraîchir"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  );
};

export default GedToolbar;
