import React from "react";
import { AlertTriangle } from "lucide-react";

const CancelMissionConfirmModal = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 9999 }}
    >
      <div
        className="p-6 sm:p-8 w-full text-center"
        style={{
          background: "#FFF",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          maxWidth: "440px",
        }}
      >
        <div
          className="mx-auto mb-4 flex items-center justify-center"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#FEE2E2",
            color: "#DC2626",
          }}
        >
          <AlertTriangle size={28} strokeWidth={2.2} />
        </div>
        <h3
          className="mb-2 font-bold"
          style={{ color: "#DC2626", fontSize: "1.2rem" }}
        >
          Confirmer l'annulation de la mission
        </h3>
        <div
          className="mb-6 p-4 rounded-lg text-left"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            fontSize: "0.85rem",
            color: "#991B1B",
            lineHeight: 1.5,
          }}
        >
          <p className="font-bold mb-1" style={{ color: "#7F1D1D" }}>
            ⚠️ Attention : action en cascade
          </p>
          L'annulation de cette mission entraînera automatiquement le
          <strong> déplacement de toutes ses tâches associées vers la corbeille</strong>.
        </div>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
          >
            Ne pas annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.85rem",
              background: "#DC2626",
              color: "#FFF",
              borderRadius: "6px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Oui, annuler et supprimer les tâches
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelMissionConfirmModal;
