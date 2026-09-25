import React from "react";
import { AlertTriangle, Info } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning",
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "450px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          animation: "fadeInUp 0.3s ease-out",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            backgroundColor:
              type === "danger"
                ? "#FEF2F2"
                : type === "warning"
                  ? "#FFFBEB"
                  : "#F8FAFC",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                type === "danger"
                  ? "#FEE2E2"
                  : type === "warning"
                    ? "#FEF3C7"
                    : "#E2E8F0",
              color:
                type === "danger"
                  ? "#DC2626"
                  : type === "warning"
                    ? "#D97706"
                    : "#475569",
            }}
          >
            {type === "danger" || type === "warning" ? (
              <AlertTriangle size={24} />
            ) : (
              <Info size={24} />
            )}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            fontSize: "0.95rem",
            color: "var(--text-main)",
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onCancel}
            className="btn btn-outline"
            style={{
              fontWeight: 500,
              backgroundColor: "white",
              padding: "0.6rem 1.2rem",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              fontWeight: 500,
              padding: "0.6rem 1.2rem",
              backgroundColor:
                type === "danger"
                  ? "#DC2626"
                  : type === "warning"
                    ? "#D97706"
                    : "var(--primary)",
              color: "white",
              border: "none",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
