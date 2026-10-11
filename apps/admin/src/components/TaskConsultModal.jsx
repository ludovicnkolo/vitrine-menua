import React, { useState } from "react";
import ReadOnlyField from "./ReadOnlyField";
import { getStatusBadge, getSafeApiUrl } from "../utils/helpers";
import { Paperclip, FileText, Eye, Download } from "lucide-react";
import FilePreviewModal from "./FilePreviewModal";
import FeedbackThread from "./FeedbackThread";

const TaskConsultModal = ({
  task,
  onClose,
  titlePrefix = "Consulter la Tâche:",
}) => {
  const [previewFile, setPreviewFile] = useState(null);

  if (!task) return null;

  const documents = task.documents || [];

  const renderDocuments = () => {
    if (documents.length === 0) {
      return (
        <div
          className="text-center" style={{padding:"0.75rem 1rem",background:"#F8FAFC",borderRadius:"8px",border:"1px dashed var(--border)",color:"var(--text-muted)"}}
        >
          Aucun document attaché.
        </div>
      );
    }
    return (
      <select
        onChange={(e) => {
          if (e.target.value) {
            setPreviewFile(e.target.value);
            e.target.selectedIndex = 0;
          }
        }}
        className="input-field w-full cursor-pointer" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",fontFamily:"inherit"}}
      >
        <option value="">
          -- Sélectionner un document pour le consulter --
        </option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.url}>
            {doc.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <>
      <div
        className="fixed flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)",zIndex:1000}}
      >
        <div
          className="fade-in p-8" style={{background:"#FFF",borderRadius:"12px",width:"90%",maxWidth:"800px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 10px 25px rgba(0,0,0,0.1)"}}
        >
          <div
            className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: "0.5rem 1rem" }}
            >
              ← Retour
            </button>
            <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
              {titlePrefix} {task.reference || task.id}
            </h2>
          </div>
          <div
            className="flex flex-col gap-4 mb-6"
          >
            <ReadOnlyField
              label="Objet"
              value={(() => {
                if (!task.description) return "Sans objet";
                const match = task.description.match(/Objet: (.*)/);
                return match
                  ? match[1]
                  : task.description.split("\n")[0] || "Sans objet";
              })()}
            />
            <div
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <ReadOnlyField
                label="Créé par"
                value={task.createdBy?.name || "Inconnu"}
              />
              <ReadOnlyField
                label="Assigné à"
                value={task.assignedTo?.name || "Non assigné"}
              />
            </div>
            <div
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <ReadOnlyField
                label="Date de création"
                value={new Date(task.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <ReadOnlyField
                label="Échéance"
                value={
                  task.echeance
                    ? new Date(task.echeance).toLocaleDateString("fr-FR")
                    : "Non définie"
                }
              />
            </div>
            <div>
              <span
                className="block mb-2 font-medium"
              >
                Statut
              </span>
              <div
                className="p-2 flex items-center" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC",height:"44px"}}
              >
                {getStatusBadge(task.status)}
              </div>
            </div>

            {/* Documents section */}
            <div
              className="mt-2" style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem"}}
            >
              <h4
                className="font-semibold flex items-center gap-2" style={{margin:"0 0 0.75rem 0",fontSize:"0.95rem"}}
              >
                <Paperclip size={15} /> Documents attachés
              </h4>
              {renderDocuments()}
            </div>

            {/* Fil de corrections — visible si des feedbacks existent */}
            <FeedbackThread
              adminFeedback={task.adminFeedback || null}
              managerFeedback={task.managerFeedback || null}
              currentStatus={task.status}
            />
          </div>
        </div>
      </div>
      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
};

export default TaskConsultModal;
