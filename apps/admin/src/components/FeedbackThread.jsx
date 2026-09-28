import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, Wrench } from "lucide-react";

/**
 * FeedbackThread — Affiche les blocs de corrections sous la consultation d'une tâche
 *
 * Props:
 *  - adminFeedback: string|null  — Instructions de l'Admin (A_CORRIGER)
 *  - managerFeedback: string|null — Corrections du Contrôleur (A_CORRIGER)
 *  - currentStatus: string
 */
const FeedbackThread = ({ adminFeedback, managerFeedback, currentStatus }) => {
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openManager, setOpenManager] = useState(false);

  const hasAdmin = Boolean(adminFeedback);
  const hasManager = Boolean(managerFeedback);

  if (!hasAdmin && !hasManager) return null;

  return (
    <div
      style={{
        marginTop: "1.5rem",
        borderTop: "2px dashed var(--border)",
        paddingTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <h4
        style={{
          margin: "0 0 0.25rem 0",
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Fil de corrections
      </h4>

      {/* Admin feedback block */}
      {hasAdmin && (
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid #FCA5A5",
            overflow: "hidden",
            background: "#FFF",
          }}
        >
          <button
            type="button"
            onClick={() => setOpenAdmin((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              background: "#FEF2F2",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                
                color: "#B91C1C",
              }}
            >
              <AlertTriangle size={15} color="#B91C1C" />
              Instructions de l'Administrateur
            </span>
            {openAdmin ? (
              <ChevronUp size={16} color="#B91C1C" />
            ) : (
              <ChevronDown size={16} color="#B91C1C" />
            )}
          </button>
          {openAdmin && (
            <div
              style={{
                padding: "1rem",
                
                color: "#1F2937",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                borderTop: "1px solid #FCA5A5",
              }}
            >
              {adminFeedback}
            </div>
          )}
        </div>
      )}

      {/* Manager feedback block */}
      {hasManager && (
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid #C4B5FD",
            overflow: "hidden",
            background: "#FFF",
          }}
        >
          <button
            type="button"
            onClick={() => setOpenManager((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              background: "#F5F3FF",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
                
                color: "#6D28D9",
              }}
            >
              <Wrench size={15} color="#6D28D9" />
              Corrections du Contrôleur
            </span>
            {openManager ? (
              <ChevronUp size={16} color="#6D28D9" />
            ) : (
              <ChevronDown size={16} color="#6D28D9" />
            )}
          </button>
          {openManager && (
            <div
              style={{
                padding: "1rem",
                
                color: "#1F2937",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                borderTop: "1px solid #C4B5FD",
              }}
            >
              {managerFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackThread;
