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
      className="mt-6 flex flex-col" style={{borderTop:"2px dashed var(--border)",paddingTop:"1.5rem",gap:"0.75rem"}}
    >
      <h4
        className="font-bold" style={{margin:"0 0 0.25rem 0",fontSize:"0.9rem",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em"}}
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
            className="w-full flex items-center justify-between cursor-pointer text-left" style={{padding:"0.75rem 1rem",background:"#FEF2F2",border:"none"}}
          >
            <span
              className="flex items-center gap-2 font-semibold" style={{color:"#B91C1C"}}
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
              className="p-4" style={{color:"#1F2937",whiteSpace:"pre-wrap",lineHeight:1.7,borderTop:"1px solid #FCA5A5"}}
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
            className="w-full flex items-center justify-between cursor-pointer text-left" style={{padding:"0.75rem 1rem",background:"#F5F3FF",border:"none"}}
          >
            <span
              className="flex items-center gap-2 font-semibold" style={{color:"#6D28D9"}}
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
              className="p-4" style={{color:"#1F2937",whiteSpace:"pre-wrap",lineHeight:1.7,borderTop:"1px solid #C4B5FD"}}
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
