import React from "react";

export interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: React.ReactNode;
  onClose: () => void;
  buttonText?: string;
  type?: "info" | "error" | "success" | "warning";
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title = "Information",
  message,
  onClose,
  buttonText = "OK",
  type = "info",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[99999]">
      <div className="p-8 bg-white rounded-lg w-[400px] max-w-[90%]">
        <h3
          className={`m-0 mb-4 text-xl font-bold ${
            type === "error" ? "text-red-500" : "text-[var(--text-main)]"
          }`}
        >
          {title}
        </h3>
        <p className="m-0 mb-6 text-[var(--text-muted)] text-base">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary px-6 py-2"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
