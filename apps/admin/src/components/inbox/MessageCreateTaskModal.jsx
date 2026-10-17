import React from "react";
import { Files, Paperclip, Eye } from "lucide-react";

const MessageCreateTaskModal = ({
  createTaskModal,
  setCreateTaskModal,
  tab,
  taskSubject,
  setTaskSubject,
  taskDescription,
  setTaskDescription,
  taskDossierSection,
  setTaskDossierSection,
  taskDossierCible,
  setTaskDossierCible,
  taskNewDossierName,
  setTaskNewDossierName,
  newTaskFile,
  setNewTaskFile,
  dossierFile,
  setDossierFile,
  selectedMsgDocs,
  setSelectedMsgDocs,
  isSubmitting,
  handleCreateTask,
  processMsg,
  users = [],
  clients = [],
  setPreviewFile,
}) => {
  if (!createTaskModal) return null;

  return (
        <div className="fade-in w-full" style={{padding:"0"}}>
          <div className="w-full" style={{padding:"0"}}>
            <div
              className="flex items-center gap-4 mb-8" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1.5rem"}}
            >
              <button
                type="button"
                onClick={() => {
                  setCreateTaskModal(false);
                  setNewTaskFile(null);
                }}
                className="btn btn-outline text-[var(--text-main)]" style={{padding:"0.5rem 1rem"}}
              >
                ← Retour
              </button>
              <h3 className="font-semibold" style={{fontSize:"1.5rem"}}>
                {tab === "interne" ? "Répondre au message" : "Nouveau Dossier"}
              </h3>
            </div>

            <div
              className="flex flex-col gap-4"
            >
              {tab === "interne" && (
                <>
                  <div>
                    <label
                      htmlFor="task-subject"
                      className="block mb-2 font-medium"
                    >
                      Objet de la réponse
                    </label>
                    <input
                      id="task-subject"
                      type="text"
                      value={taskSubject}
                      onChange={(e) => setTaskSubject(e.target.value)}
                      placeholder="Sujet..."
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="task-message"
                      className="block mb-2 font-medium"
                    >
                      Message
                    </label>
                    <textarea
                      id="task-message"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Votre réponse..."
                      className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"120px",resize:"vertical",fontFamily:"inherit"}}
                    ></textarea>
                  </div>
                </>
              )}

              {tab !== "interne" && (
                <div>
                  <label
                    htmlFor="task-dossier"
                    className="block mb-2 font-medium"
                  >
                    Dossier associé
                  </label>
                  <div
                    className="grid gap-4" style={{gridTemplateColumns:"1fr 1.5fr 2fr",alignItems:"start"}}
                  >
                    <select
                      value={taskDossierSection}
                      onChange={(e) => {
                        setTaskDossierSection(e.target.value);
                        setTaskDossierCible("");
                      }}
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
                    >
                      <option value="">-- Section --</option>
                      <option value="equipe">Équipe</option>
                      <option value="client">Client</option>
                    </select>

                    <select
                      value={taskDossierCible}
                      onChange={(e) => setTaskDossierCible(e.target.value)}
                      disabled={!taskDossierSection}
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "#FFF",
                        opacity: !taskDossierSection ? 0.5 : 1,
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {taskDossierSection === "equipe" &&
                        users.map((u) => (
                          <option
                            key={u.id}
                            value={u.id}
                          >{`${u.name} (${u.role?.name || "Sans rôle"})`}</option>
                        ))}
                      {taskDossierSection === "client" &&
                        clients
                          .filter((c) => String(c.status || "ACTIF").toUpperCase() === "ACTIF")
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name ||
                                `${c.firstName} ${c.lastName}` ||
                                c.email}
                            </option>
                          ))}
                    </select>

                    <input
                      type="text"
                      value={taskNewDossierName}
                      onChange={(e) => setTaskNewDossierName(e.target.value)}
                      placeholder="Nom du nouveau dossier..."
                      className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                    />
                  </div>

                  {/* File upload for dossier */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <label
                      className="block font-medium" style={{marginBottom:"0.35rem"}}
                    >
                      <Paperclip
                        size={13}
                        style={{ marginRight: "4px", verticalAlign: "middle" }}
                      />
                      Pièce jointe (optionnel)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={(e) =>
                        setDossierFile(e.target.files?.[0] || null)
                      }
                      className="w-full p-2" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC"}}
                    />
                    {dossierFile && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          marginTop: "0.25rem",
                          margin: "0.25rem 0 0",
                        }}
                      >
                        &#10004; {dossierFile.name}
                      </p>
                    )}
                  </div>

                  {processMsg?.attachment && (
                    <div
                      className="mt-4" style={{padding:"0.75rem",background:"#F0F9FF",borderRadius:"8px",border:"1px solid #BAE6FD"}}
                    >
                      <label
                        className="block mb-2 font-medium" style={{color:"var(--primary-dark)"}}
                      >
                        Inclure les pièces jointes du message :
                      </label>
                      <div
                        className="flex flex-col gap-2"
                      >
                        {processMsg.attachment.split(",").map((att) => {
                          const fileName = att.split("/").pop();
                          return (
                            <div
                              key={att}
                              className="flex items-center gap-4"
                            >
                              <label
                                className="flex items-center gap-2 cursor-pointer font-medium text-[var(--text-main)]"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedMsgDocs.includes(att)}
                                  onChange={(e) => {
                                    if (e.target.checked)
                                      setSelectedMsgDocs([
                                        ...selectedMsgDocs,
                                        att,
                                      ]);
                                    else
                                      setSelectedMsgDocs(
                                        selectedMsgDocs.filter(
                                          (a) => a !== att,
                                        ),
                                      );
                                  }}
                                  className="cursor-pointer"
                                />
                                <Paperclip
                                  size={14}
                                  style={{ color: "var(--primary)" }}
                                />{" "}
                                {fileName}
                              </label>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPreviewFile(att);
                                }}
                                className="cursor-pointer flex items-center" style={{background:"none",border:"none",color:"var(--primary)"}}
                                title="Prévisualiser"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "interne" && (
                <div>
                  <span
                    className="block mb-2 font-medium"
                  >
                    Pièces jointes
                  </span>
                  <div
                    className="p-4" style={{background:"#F8FAFC",borderRadius:"8px",border:"1px solid var(--border)"}}
                  >
                    <label
                      className="flex items-center gap-2 cursor-pointer" style={{color:"var(--primary)"}}
                    >
                      <Files size={16} />
                      <span className="font-medium">
                        {newTaskFile
                          ? newTaskFile.name
                          : "Joindre un fichier..."}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setNewTaskFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex justify-end gap-4 mt-6"
            >
              <button
                type="button"
                onClick={() => {
                  setCreateTaskModal(false);
                  setNewTaskFile(null);
                  setDossierFile(null);
                  setSelectedMsgDocs([]);
                }}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {(() => {
                  if (isSubmitting) return "Traitement...";
                  if (tab === "interne") return "Envoyer";
                  return "Créer le Dossier";
                })()}
              </button>
            </div>
          </div>
        </div>
  );
};

export default MessageCreateTaskModal;
