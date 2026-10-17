import React from "react";
import { X } from "lucide-react";

const FilePreviewModal = ({ fileUrl, onClose }) => {
  if (!fileUrl) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1100 }}
    >
      <div
        className="relative flex justify-center items-center"
        style={{ width: "90vw", height: "90vh" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute text-white cursor-pointer"
          style={{ top: "-40px", right: "0", background: "none", border: "none" }}
        >
          <X size={24} />
        </button>
        {fileUrl.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/) ? (
          <img
            src={fileUrl}
            alt="Document"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          />
        ) : (
          <object
            data={fileUrl}
            type="application/pdf"
            className="w-full h-full"
            style={{
              border: "none",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <p>
              Impossible d'afficher ce fichier directement.{" "}
              <a href={fileUrl} target="_blank" rel="noreferrer">
                Télécharger le fichier
              </a>
            </p>
          </object>
        )}
      </div>
    </div>
  );
};

export default FilePreviewModal;
