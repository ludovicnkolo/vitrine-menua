import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import GedExplorer, { flattenFolderIds } from "../GedExplorer";
import { getSafeApiUrl, uploadFile } from "../../utils/helpers";

const CreateMissionModal = ({
  isOpen,
  onClose,
  consultDossier,
  dbUsers = [],
  onSuccess,
}) => {
  const [missionSubject, setMissionSubject] = useState("");
  const [missionAssignedTo, setMissionAssignedTo] = useState("");
  const [missionEcheance, setMissionEcheance] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionFile, setMissionFile] = useState(null);
  const [selectedDossierDocs, setSelectedDossierDocs] = useState([]);
  const [missionDossierId, setMissionDossierId] = useState("");
  const [authorizedDossierIds, setAuthorizedDossierIds] = useState([]);
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);
  const [operationalTree, setOperationalTree] = useState(null);

  useEffect(() => {
    if (isOpen && consultDossier) {
      const fetchTree = async () => {
        try {
          const token = sessionStorage.getItem("adminToken");
          const operationalDossier = consultDossier.subDossiers?.find(
            (d) => d.name === "OPÉRATIONS & RÉALISATIONS"
          );
          if (operationalDossier) {
            const res = await fetch(
              getSafeApiUrl(`/api/crm/dossiers/${operationalDossier.id}/tree`),
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (res.ok) {
              const data = await res.json();
              setOperationalTree(data);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchTree();
    } else {
      setOperationalTree(null);
    }
  }, [isOpen, consultDossier]);

  if (!isOpen || !consultDossier) return null;

  const handleClose = () => {
    setSelectedDossierDocs([]);
    setMissionDossierId("");
    setAuthorizedDossierIds([]);
    setMissionSubject("");
    setMissionDescription("");
    setMissionAssignedTo("");
    setMissionEcheance("");
    setMissionFile(null);
    onClose();
  };

  const handleCreateMission = async () => {
    if (!missionSubject) {
      window.customAlert("L'objet de la mission est requis.");
      return;
    }
    const targetMissionDossierId = missionDossierId || consultDossier?.id;
    if (!targetMissionDossierId) {
      window.customAlert("Veuillez sélectionner un dossier mission.");
      return;
    }
    if (!missionAssignedTo) {
      window.customAlert("Veuillez sélectionner un responsable à assigner.");
      return;
    }
    if (!missionEcheance) {
      window.customAlert("L'échéance est requise.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(missionEcheance);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      window.customAlert(
        "La date d'échéance d'une mission ne peut pas être antérieure à aujourd'hui."
      );
      return;
    }
    if (!missionDescription || !missionDescription.trim()) {
      window.customAlert("Le message / consignes est requis.");
      return;
    }

    setIsSubmittingMission(true);
    const token = sessionStorage.getItem("adminToken");

    try {
      let attachmentFilename = null;
      if (missionFile) {
        attachmentFilename = await uploadFile(missionFile, "missions");
      }

      const res = await fetch(getSafeApiUrl("/api/crm/tasks"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: `${missionSubject}\n\n${missionDescription}`,
          assignedToId: missionAssignedTo,
          dossierId: consultDossier.id,
          echeance: missionEcheance,
          attachment: attachmentFilename,
          dossierMissionId: targetMissionDossierId || null,
          authorizedDossierIds: authorizedDossierIds,
        }),
      });

      if (res.ok) {
        const missionData = await res.json();
        if (attachmentFilename) {
          await fetch(getSafeApiUrl("/api/crm/documents"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: missionFile.name,
              filename: attachmentFilename,
              bucket: "missions",
              missionId: missionData.id,
            }),
          });
        }

        if (selectedDossierDocs.length > 0 && consultDossier.documents) {
          for (const docId of selectedDossierDocs) {
            const d = consultDossier.documents.find((x) => x.id === docId);
            if (d && d.url) {
              const parts = d.url.split("/");
              if (parts.length >= 2) {
                const b = parts.shift();
                const fn = parts.join("/");
                await fetch(getSafeApiUrl("/api/crm/documents"), {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: d.name,
                    filename: fn,
                    bucket: b,
                    missionId: missionData.id,
                  }),
                });
              }
            }
          }
        }

        window.customAlert("Mission créée avec succès !");
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        const err = await res.json().catch(() => ({}));
        window.customAlert(
          "Erreur lors de la création : " + (err.error || res.statusText)
        );
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmittingMission(false);
    }
  };

  const filteredTree = operationalTree
    ? {
        ...operationalTree,
        subDossiers: (operationalTree.subDossiers || []).filter(
          (d) => d.id !== missionDossierId
        ),
      }
    : null;

  const getFolderNames = (folder, ids) => {
    let names = [];
    if (ids.includes(folder.id)) names.push(folder.name);
    if (folder.subDossiers) {
      folder.subDossiers.forEach((sub) => {
        names = [...names, ...getFolderNames(sub, ids)];
      });
    }
    return names;
  };

  const selectedNames =
    filteredTree && authorizedDossierIds.length > 0
      ? getFolderNames(filteredTree, authorizedDossierIds)
      : [];

  return (
    <div
      className="fade-in fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1000 }}
    >
      <div
        className="p-8"
        style={{
          background: "#FFF",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
            Nouvelle Mission
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer flex flex-col items-center"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              gap: "2px",
            }}
          >
            <X size={20} />
            <span>Fermer</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Objet de la mission *
            </label>
            <input
              type="text"
              value={missionSubject}
              onChange={(e) => setMissionSubject(e.target.value)}
              placeholder="Sujet de la mission..."
              className="input-field w-full"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          {operationalTree && (
            <div
              className="flex flex-col gap-4 p-4"
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex flex-col" style={{ gap: "2rem" }}>
                <div>
                  <label
                    className="block mb-2 font-semibold"
                    style={{ color: "var(--primary-dark)" }}
                  >
                    Dossier mission (Sélection unique) *
                  </label>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <GedExplorer
                      tree={operationalTree}
                      multiSelect={false}
                      selectedId={missionDossierId}
                      onSelectId={setMissionDossierId}
                    />
                  </div>
                </div>

                {filteredTree && filteredTree.subDossiers?.length > 0 && (
                  <div>
                    <label
                      className="block mb-2 font-semibold"
                      style={{ color: "var(--primary-dark)" }}
                    >
                      Dossiers autorisés{" "}
                      <span
                        className="font-normal"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}
                      >
                        (lecture seule)
                      </span>
                    </label>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <GedExplorer
                        tree={filteredTree}
                        multiSelect={true}
                        selectedIds={authorizedDossierIds}
                        disabledIds={
                          missionDossierId ? [missionDossierId] : []
                        }
                        onToggleChildren={(child) => {
                          const ids = flattenFolderIds(child);
                          if (authorizedDossierIds.includes(child.id)) {
                            setAuthorizedDossierIds((prev) =>
                              prev.filter((id) => !ids.includes(id))
                            );
                          } else {
                            setAuthorizedDossierIds((prev) =>
                              Array.from(new Set([...prev, ...ids]))
                            );
                          }
                        }}
                      />
                    </div>
                    {selectedNames.length > 0 && (
                      <div
                        className="mt-2"
                        style={{
                          padding: "0.75rem",
                          background: "#e0f2fe",
                          borderRadius: "8px",
                          border: "1px solid #bae6fd",
                        }}
                      >
                        <strong
                          className="block"
                          style={{ marginBottom: "0.25rem", color: "#0369a1" }}
                        >
                          Panier des dossiers autorisés :
                        </strong>
                        <div className="flex flex-wrap gap-2">
                          {selectedNames.map((name, i) => (
                            <span
                              key={i}
                              className="font-medium"
                              style={{
                                background: "#FFF",
                                color: "#0369a1",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                border: "1px solid #7dd3fc",
                              }}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <div>
              <label className="block mb-2 font-medium">Assigné à *</label>
              <select
                value={missionAssignedTo}
                onChange={(e) => setMissionAssignedTo(e.target.value)}
                className="input-field w-full"
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "#FFF",
                }}
              >
                <option value="">Sélectionner un membre...</option>
                {dbUsers
                  .filter(
                    (u) =>
                      u.role?.name === "Responsable opérationnel" ||
                      u.role?.name === "Super-administrateur"
                  )
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role?.name})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Échéance *</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={missionEcheance}
                onChange={(e) => setMissionEcheance(e.target.value)}
                className="input-field w-full"
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "#FFF",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Message / Consignes *
            </label>
            <textarea
              value={missionDescription}
              onChange={(e) => setMissionDescription(e.target.value)}
              placeholder="Détails de la mission..."
              className="w-full"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                minHeight: "120px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline"
            disabled={isSubmittingMission}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleCreateMission}
            disabled={
              isSubmittingMission ||
              !missionSubject.trim() ||
              !(missionDossierId || consultDossier?.id) ||
              !missionAssignedTo ||
              !missionEcheance ||
              !missionDescription.trim()
            }
            className="btn btn-primary"
          >
            {isSubmittingMission ? "Création..." : "Créer la mission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMissionModal;
