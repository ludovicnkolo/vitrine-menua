import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Composant Modal universel, accessible et réutilisable.
 * 
 * @param {boolean} isOpen - Indique si la modale est affichée
 * @param {function} onClose - Callback de fermeture (croix, overlay, Echap)
 * @param {string|React.ReactNode} title - Titre de la modale
 * @param {string|React.ReactNode} [subtitle] - Sous-titre ou description
 * @param {React.ReactNode} [icon] - Icône affichée dans l'en-tête
 * @param {React.ReactNode} children - Contenu du corps de la modale
 * @param {React.ReactNode} [footer] - Pied de page contenant les boutons d'action
 * @param {string} [maxWidth="560px"] - Largeur maximale (ex: "520px", "800px", "90vw")
 * @param {string} [maxHeight="90vh"] - Hauteur maximale avec défilement interne
 * @param {boolean} [closeOnEsc=true] - Fermeture lors de la frappe sur Echap
 * @param {boolean} [closeOnOverlay=true] - Fermeture lors d'un clic sur l'arrière-plan
 * @param {number} [zIndex=1100] - z-index de superposition
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "560px",
  maxHeight = "90vh",
  closeOnEsc = true,
  closeOnOverlay = true,
  zIndex = 1100,
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex,
      }}
      onClick={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="fade-in w-full flex flex-col"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          maxWidth,
          maxHeight,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          padding: "1.75rem",
          gap: "1.25rem",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || icon) && (
          <div
            className="flex items-start justify-between"
            style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}
          >
            <div className="flex items-center" style={{ gap: "0.75rem" }}>
              {icon && (
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(201, 156, 92, 0.12)",
                    color: "var(--primary, #c99c5c)",
                  }}
                >
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h2
                    className="font-bold text-[var(--text-main)]"
                    style={{ fontSize: "1.15rem", margin: 0 }}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p
                    style={{
                      margin: "0.2rem 0 0 0",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                padding: "0.25rem",
              }}
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end gap-3 pt-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
