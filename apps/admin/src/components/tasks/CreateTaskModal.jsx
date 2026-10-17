import React from "react";
import { X } from "lucide-react";

const CreateTaskModal = ({
  createTaskModal,
  setCreateTaskModal,
  mode,
  newTaskSubject,
  setNewTaskSubject,
  newTaskMessage,
  setNewTaskMessage,
  newTaskAssignedTo,
  setNewTaskAssignedTo,
  newTaskRelecteur,
  setNewTaskRelecteur,
  newTaskEcheance,
  setNewTaskEcheance,
  selectedDossierTacheId,
  setSelectedDossierTacheId,
  selectedAuthorizedTacheIds,
  setSelectedAuthorizedTacheIds,
  missionTargetDossierId,
  setMissionTargetDossierId,
  taskFile,
  setTaskFile,
  isSubmitting,
  handleCreateTaskSubmit,
  users = [],
  missions = [],
  dossiers = [],
  t,
}) => {
  if (!createTaskModal) return null;

    if (!createTaskModal) return null;
    return (
      <div
        className="fade-in fixed inset-0 flex items-center justify-center p-4" style={{backgroundColor:"rgba(15, 23, 42, 0.6)",backdropFilter:"blur(4px)",zIndex:9999}}
      >
        <div
          className="p-8 w-full" style={{background:"#FFF",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",maxWidth:"750px",maxHeight:"90vh",overflowY:"auto"}}
        >
          <div
            className="flex justify-between items-center mb-6"
          >
            <h3 className="font-semibold" style={{fontSize:"1.25rem"}}>
              Créer une tâche
            </h3>
            <button
              type="button"
              onClick={() => {
                setCreateTaskModal(false);
                setNewTaskFile(null);
                setSelectedParentDocs([]);
                setSelectedMissionDocs([]);
              }}
              className="cursor-pointer flex flex-col items-center" style={{background:"none",border:"none",color:"var(--text-muted)",fontSize:"0.75rem",gap:"2px"}}
            >
              <X size={20} />
              <span>Fermer</span>
            </button>
          </div>

          <div
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="new-task-subject"
                className="block mb-2 font-medium"
              >
                Objet de la tâche *
              </label>
              <input
                id="new-task-subject"
                type="text"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="Sujet de la tâche..."
                className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
              />
            </div>

            <div
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <div>
                <label
                  htmlFor="new-task-assigned-to"
                  className="block mb-2 font-medium"
                >
                  Assigné à *
                </label>
                <select
                  id="new-task-assigned-to"
                  className="input-field w-full"
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                >
                  <option value="">-- Sélectionner un membre --</option>
                  {users
                    .filter(
                      (u) =>
                        u.role?.name === "Collaborateur" ||
                        u.role?.name === "Responsable opérationnel" ||
                        u.role?.name === "Super-administrateur" ||
                        u.role?.name === "Administrateur",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role?.name || "Sans rôle"})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-task-relecteur"
                  className="block mb-2 font-medium"
                >
                  Relecteur (Contrôleur)
                </label>
                <select
                  id="new-task-relecteur"
                  className="input-field w-full"
                  value={newTaskRelecteur}
                  onChange={(e) => setNewTaskRelecteur(e.target.value)}
                  style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                >
                  <option value="">-- Aucun relecteur --</option>
                  {users
                    .filter(
                      (u) =>
                        u.role?.name === "Relecteur" ||
                        u.role?.name === "Responsable opérationnel",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role?.name || "Sans rôle"})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div
              className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
            >
              <div>
                <label
                  htmlFor="new-task-echeance"
                  className="block mb-2 font-medium"
                >
                  Échéance *
                </label>
                <input
                  id="new-task-echeance"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  max={
                    consultTask?.echeance
                      ? new Date(consultTask.echeance)
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                  value={newTaskEcheance}
                  onChange={(e) => setNewTaskEcheance(e.target.value)}
                  className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                />
              </div>

              <div>
                <label
                  htmlFor="new-task-mission-associee"
                  className="block mb-2 font-medium"
                >
                  Mission associée
                </label>
                <input
                  id="new-task-mission-associee"
                  type="text"
                  value={
                    consultTask?.reference
                      ? `🔒 ${consultTask.reference}`
                      : consultTask?.id
                        ? `🔒 ${consultTask.id}`
                        : ""
                  }
                  readOnly
                  className="input-field w-full font-semibold" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC",color:"var(--text-muted)"}}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-task-message"
                className="block mb-2 font-medium"
              >
                Message / Consignes *
              </label>
              <textarea
                id="new-task-message"
                value={newTaskMessage}
                onChange={(e) => setNewTaskMessage(e.target.value)}
                placeholder="Détails de la tâche à effectuer..."
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"120px",resize:"vertical",fontFamily:"inherit"}}
              ></textarea>
            </div>
          </div>

          <div
            className="flex justify-end gap-4 mt-8"
          >
            <button
              type="button"
              onClick={() => {
                setCreateTaskModal(false);
                setNewTaskFile(null);
                setSelectedParentDocs([]);
                setSelectedMissionDocs([]);
              }}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleCreateSubTask}
              disabled={
                isSubmitting ||
                !newTaskSubject.trim() ||
                !newTaskAssignedTo ||
                !newTaskEcheance ||
                !newTaskMessage.trim()
              }
              className="btn btn-primary"
            >
              {isSubmitting ? "Création..." : "Créer la tâche"}
            </button>
          </div>
        </div>
      </div>
    );
};

export default CreateTaskModal;
