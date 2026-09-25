import React from "react";

const PaginationControls = ({ page, totalPages, setPage }) => {
  if (totalPages < 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1.5rem",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid var(--border)",
          background: "#FFF",
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        Précédent
      </button>
      <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Page {page} sur {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid var(--border)",
          background: "#FFF",
          cursor: page >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        Suivant
      </button>
    </div>
  );
};

export default PaginationControls;
