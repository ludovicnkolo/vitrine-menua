import React from "react";
import { Check, X, FileText, Globe } from "lucide-react";

const SaveOptionsModal = ({
  saveOptionsModal,
  setSaveOptionsModal,
  handleSaveAction,
}) => {
  if (!saveOptionsModal?.isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 10000,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        className="w-full"
        style={{
          background: "#FFF",
          borderRadius: "16px",
          maxWidth: "400px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid #F1F5F9" }}
        >
          <h3
            className="font-semibold flex items-center gap-2"
            style={{ fontSize: "1.1rem", color: "#1E293B" }}
          >
            <Check size={20} color="#10B981" />
            Options d'enregistrement
          </h3>
          <button
            type="button"
            onClick={() => setSaveOptionsModal({ isOpen: false, isPreview: false })}
            className="cursor-pointer"
            style={{ background: "none", border: "none", color: "#94A3B8", padding: "0.25rem" }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p
            style={{
              margin: "0 0 1.5rem",
              color: "#475569",
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            Souhaitez-vous enregistrer cet article en tant que brouillon pour y revenir plus tard, ou le publier immédiatement sur le site public ?
          </p>
          <div className="flex flex-col" style={{ gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => {
                setSaveOptionsModal({ isOpen: false, isPreview: false });
                handleSaveAction("BROUILLON", saveOptionsModal.isPreview);
              }}
              className="font-semibold cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "#F8FAFC",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                padding: "0.85rem",
                fontSize: "0.95rem",
                color: "#334155",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#F1F5F9";
                e.currentTarget.style.borderColor = "#94A3B8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
            >
              <FileText size={18} />
              Enregistrer en brouillon
            </button>
            <button
              type="button"
              onClick={() => {
                setSaveOptionsModal({ isOpen: false, isPreview: false });
                handleSaveAction("PUBLIE", saveOptionsModal.isPreview);
              }}
              className="font-semibold text-white cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "#10B981",
                border: "none",
                borderRadius: "8px",
                padding: "0.85rem",
                fontSize: "0.95rem",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#059669";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#10B981";
              }}
            >
              <Globe size={18} />
              Publier sur le site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveOptionsModal;
