import React from "react";
import { useTranslation } from "react-i18next";

const PaginationControls = ({ page, totalPages, setPage }) => {
  const { t } = useTranslation();
  if (totalPages < 1) return null;

  return (
    <div
      className="flex justify-center mt-6 gap-4 items-center"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="font-medium transition-colors"
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: page === 1 ? "var(--text-muted)" : "var(--text-main)",
          opacity: page === 1 ? 0.45 : 1,
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        {t("common.prev", "Précédent")}
      </button>
      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 500 }}>
        {t("common.pageOf", { current: page, total: totalPages, defaultValue: `Page ${page} sur ${totalPages}` })}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="font-medium transition-colors"
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: page >= totalPages ? "var(--text-muted)" : "var(--text-main)",
          opacity: page >= totalPages ? 0.45 : 1,
          cursor: page >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        {t("common.next", "Suivant")}
      </button>
    </div>
  );
};

export default PaginationControls;
