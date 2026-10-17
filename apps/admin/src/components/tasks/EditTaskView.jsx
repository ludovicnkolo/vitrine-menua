import React from "react";
import { Trash } from "lucide-react";
import TaskField from "./TaskField";

const EditTaskView = ({
  editTask,
  setEditTask,
  mode,
  editFormData,
  setEditFormData,
  taskFile,
  setTaskFile,
  isSubmitting,
  handleEditSubmit,
  handleRemoveAttachment,
  handleDeleteExistingDoc,
  users = [],
}) => {
  if (!editTask) return null;

  return (
      <div className="fade-in w-full" style={{padding:"0"}}>
        <div
          className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
        >
          <button
            type="button"
            onClick={() => {
              setEditTask(null);
              setTaskFile(null);
            }}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem" }}
          >
            ← Retour
          </button>
          <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
            {mode === "MISSION" ? "Modifier mission :" : "Modifier tâche :"}{" "}
            {editTask.reference || editTask.id}
          </h2>
        </div>

        <div
          className="flex flex-col gap-4 mb-6"
        >
          <div
            className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
          >
            <TaskField
              label={"Créé par"}
              value={editTask.createdBy?.name || "Système"}
            />
            <div>
              <label
                htmlFor="edit-task-assigned-to"
                className="block mb-2 font-medium"
              >
                Assigné à
              </label>
              <select
                id="edit-task-assigned-to"
                className="input-field w-full"
                value={editFormData.assignedToId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    assignedToId: e.target.value,
                  })
                }
                style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)",background:"#FFF"}}
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
          </div>

          <div
            className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}
          >
            <div>
              <label
                htmlFor="edit-task-relecteur"
                className="block mb-2 font-medium"
              >
                Relecteur
              </label>
              <select
                id="edit-task-relecteur"
                className="input-field w-full"
                value={editFormData.relecteurId || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    relecteurId: e.target.value,
                  })
                }
                style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)",background:"#FFF"}}
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
            <TaskField
              label="Objet"
              value={editFormData.subject}
              readOnly={false}
              onChange={(e) =>
                setEditFormData({ ...editFormData, subject: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="edit-task-echeance"
              className="block mb-2 font-medium"
            >
              Échéance
            </label>
            <input
              id="edit-task-echeance"
              type="date"
              max={mode === "TACHE" && editTask?.mission?.echeance ? new Date(editTask.mission.echeance).toISOString().split("T")[0] : undefined}
              value={editFormData.echeance}
              onChange={(e) =>
                setEditFormData({ ...editFormData, echeance: e.target.value })
              }
              className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--primary)"}}
            />
          </div>

          <TaskField
            label={mode === "MISSION" ? "Dossier associé" : "Mission Liée"}
            value={
              mode === "MISSION"
                ? editTask.dossier?.reference ||
                  editTask.dossier?.name ||
                  editTask.dossierId
                : editTask.mission?.reference || editTask.missionId
            }
          />

          <TaskField
            label="Message / Consignes"
            value={editFormData.message}
            readOnly={false}
            onChange={(e) =>
              setEditFormData({ ...editFormData, message: e.target.value })
            }
            isTextarea={true}
          />

          <div
            className="flex items-center w-fit" style={{gap:"2rem",padding:"0.75rem 1rem",background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
          >
            <div className="flex items-center gap-4">
              <span
                className="font-medium text-[var(--text-main)]"
              >
                {mode === "MISSION"
                  ? "Statut de la mission :"
                  : "Statut de la tâche :"}
              </span>
              {getStatusBadge(editTask.status)}
            </div>
            {/* Le statut est désormais géré via les boutons d'action du workflow */}
          </div>

          <div
            className="mt-4" style={{borderTop:"1px solid var(--border)",paddingTop:"1.5rem"}}
          >
            {mode === "MISSION" && (
              <h4
                className="font-semibold" style={{margin:"0 0 1rem 0",fontSize:"1rem"}}
              >
                Gérer les tâches liées
              </h4>
            )}
            {mode === "MISSION" &&
            editTask.taches &&
            editTask.taches.length > 0 ? (
              <div
                className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))"}}
              >
                {editTask.taches.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => setLocalConsultSubTask(sub)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                    className="flex justify-between items-center p-4 cursor-pointer w-full text-left" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)",transition:"border-color 0.2s",fontFamily:"inherit",fontSize:"inherit"}}
                  >
                    <div
                      className="flex flex-col" style={{gap:"0.25rem"}}
                    >
                      <strong
                        className="truncate-text"
                        style={{  }}
                      >
                        {sub.reference || "Sans réf"}
                      </strong>
                      <span className="flex items-center">
                        {getStatusBadge(sub.status)}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setErrorMsg(
                            `Tâche ${sub.id} supprimée avec succès !`,
                          );
                        }}
                        className="cursor-pointer" style={{background:"none",border:"none",color:"var(--danger)"}}
                        title="Supprimer la tâche liée"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="p-4 text-center" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px dashed var(--border)",color:"var(--text-muted)"}}
              >
                Aucune tâche liée pour le moment.
              </div>
            )}
          </div>
        </div>

        <div
          className="flex justify-end gap-4"
        >
          <button
            type="button"
            onClick={() => {
              setEditTask(null);
              setTaskFile(null);
            }}
            className="btn btn-outline"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleUpdateMission}
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </div>
        <TaskConsultModal
          task={localConsultSubTask}
          onClose={() => setLocalConsultSubTask(null)}
        />
      </div>
  );
};

export default EditTaskView;
