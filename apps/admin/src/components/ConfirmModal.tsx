import React from "react";
import { AlertTriangle, Info } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
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
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/70 z-[99999] backdrop-blur-sm">
      <div className="w-full max-w-[450px] bg-white rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden animate-fadeInUp">
        <div
          className={`flex items-center gap-4 p-6 border-b border-[var(--border)] ${
            type === "danger"
              ? "bg-red-50"
              : type === "warning"
                ? "bg-amber-50"
                : "bg-slate-50"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === "danger"
                ? "bg-red-100 text-red-600"
                : type === "warning"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-slate-200 text-slate-600"
            }`}
          >
            {type === "danger" || type === "warning" ? (
              <AlertTriangle size={24} />
            ) : (
              <Info size={24} />
            )}
          </div>
          <div>
            <h3 className="m-0 font-semibold text-[var(--text-main)] text-[1.1rem]">
              {title}
            </h3>
          </div>
        </div>

        <div className="p-6 text-[var(--text-main)] text-[0.95rem] leading-relaxed">
          {message}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-[var(--border)]">
          <button
            onClick={onCancel}
            className="btn btn-outline bg-white px-5 py-2.5 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn px-5 py-2.5 font-medium text-white border-none ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : type === "warning"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-[var(--primary)] hover:opacity-90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
