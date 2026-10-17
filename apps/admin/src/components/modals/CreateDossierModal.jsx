import React, { useState } from "react";
import { X } from "lucide-react";
import SearchableDropdown from "../ui/SearchableDropdown";
import { getSafeApiUrl } from "../../utils/helpers";

const CreateDossierModal = ({
  isOpen,
  onClose,
  onSuccess,
  dbClients = [],
  dbUsers = [],
}) => {
  const [newDossierData, setNewDossierData] = useState({
    name: "",
    description: "",
    priority: "NORMAL",
    origin: "",
    parentDossierId: "",
    targetId: "",
    generalName: "",
    traitantId: "",
  });
  const [isSubmittingDossier, setIsSubmittingDossier] = useState(false);

  if (!isOpen) return null;

  const handleCreateDossier = async (e) => {
    e.preventDefault();
    if (!newDossierData.origin) {
      window.customAlert(
        "Veuillez sélectionner une Origine (Client ou Collaborateur)."
      );
      return;
    }
    if (
      !newDossierData.targetId &&
      (newDossierData.origin === "CLIENT" ||
        newDossierData.origin === "COLLABORATEUR")
    ) {
      window.customAlert(
        `Veuillez sélectionner la Cible (${
          newDossierData.origin === "CLIENT" ? "Client" : "Collaborateur"
        }).`
      );
      return;
    }
    if (
      newDossierData.origin === "GENERAL" &&
      !newDossierData.generalName?.trim()
    ) {
      window.customAlert("Veuillez saisir un nom pour ce dossier.");
      return;
    }
    if (!newDossierData.description || !newDossierData.description.trim()) {
      window.customAlert("La description du dossier est obligatoire.");
      return;
    }
    if (!newDossierData.traitantId) {
      window.customAlert(
        "Veuillez sélectionner un responsable (traitant) pour ce dossier."
      );
      return;
    }

    let targetName = "";
    if (newDossierData.origin === "CLIENT") {
      const client = dbClients.find((c) => c.id === newDossierData.targetId);
      targetName = client ? client.name.replace(/\s+/g, "_") : "INCONNU";
    } else if (newDossierData.origin === "COLLABORATEUR") {
      const user = dbUsers.find((u) => u.id === newDossierData.targetId);
      targetName = user ? user.name.replace(/\s+/g, "_") : "INCONNU";
    } else if (newDossierData.origin === "GENERAL") {
      targetName = newDossierData.generalName.replace(/\s+/g, "_");
    }

    const generatedName = targetName.toLowerCase();
    setIsSubmittingDossier(true);
    const token = sessionStorage.getItem("adminToken");

    try {
      const payload = {
        name: generatedName,
        description: newDossierData.description,
        priority: newDossierData.priority,
        origin: newDossierData.origin,
        parentDossierId: newDossierData.parentDossierId || null,
        traitantId: newDossierData.traitantId || null,
      };

      if (newDossierData.origin === "CLIENT" && newDossierData.targetId) {
        payload.clientId = newDossierData.targetId;
      } else if (
        newDossierData.origin === "COLLABORATEUR" &&
        newDossierData.targetId
      ) {
        payload.targetUserId = newDossierData.targetId;
      }

      const res = await fetch(getSafeApiUrl("/api/crm/dossiers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.customAlert("Dossier créé avec succès !");
        setNewDossierData({
          name: "",
          description: "",
          priority: "NORMAL",
          origin: "",
          parentDossierId: "",
          targetId: "",
          generalName: "",
          traitantId: "",
        });
        if (onSuccess) onSuccess();
        onClose();
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
      setIsSubmittingDossier(false);
    }
  };

  const isFormValid =
    !isSubmittingDossier &&
    newDossierData.description.trim() &&
    newDossierData.origin &&
    ((newDossierData.origin === "CLIENT" ||
      newDossierData.origin === "COLLABORATEUR")
      ? newDossierData.targetId
      : true) &&
    (newDossierData.origin === "GENERAL"
      ? newDossierData.generalName?.trim()
      : true) &&
    newDossierData.traitantId;

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
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
            Nouveau Dossier
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateDossier}>
          <div className="flex flex-col gap-6">
            {/* BLOC 1: ORIGINE ET CIBLE */}
            <div
              className="p-6"
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <label
                className="block mb-4 font-semibold"
                style={{ fontSize: "0.95rem", color: "var(--primary-dark)" }}
              >
                1. Type de dossier (Origine) *
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: newDossierData.origin ? "1.5rem" : "0",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setNewDossierData({
                      ...newDossierData,
                      origin: "CLIENT",
                      targetId: "",
                    })
                  }
                  style={{
                    padding: "1rem 0.5rem",
                    borderRadius: "8px",
                    position: "relative",
                    border:
                      newDossierData.origin === "CLIENT"
                        ? "2px solid var(--primary)"
                        : "1px solid var(--border)",
                    background:
                      newDossierData.origin === "CLIENT" ? "#e0f2fe" : "#FFF",
                    color:
                      newDossierData.origin === "CLIENT"
                        ? "var(--primary-dark)"
                        : "var(--text-main)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  {newDossierData.origin === "CLIENT" && (
                    <div
                      className="absolute text-white flex items-center justify-center font-bold"
                      style={{
                        top: "8px",
                        right: "8px",
                        background: "#1e3a8a",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "11px",
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <span style={{ fontSize: "1.5rem" }}>🏢</span>
                  Dossier Client
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewDossierData({
                      ...newDossierData,
                      origin: "COLLABORATEUR",
                      targetId: "",
                    })
                  }
                  style={{
                    padding: "1rem 0.5rem",
                    borderRadius: "8px",
                    position: "relative",
                    border:
                      newDossierData.origin === "COLLABORATEUR"
                        ? "2px solid var(--primary)"
                        : "1px solid var(--border)",
                    background:
                      newDossierData.origin === "COLLABORATEUR"
                        ? "#e0f2fe"
                        : "#FFF",
                    color:
                      newDossierData.origin === "COLLABORATEUR"
                        ? "var(--primary-dark)"
                        : "var(--text-main)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  {newDossierData.origin === "COLLABORATEUR" && (
                    <div
                      className="absolute text-white flex items-center justify-center font-bold"
                      style={{
                        top: "8px",
                        right: "8px",
                        background: "#1e3a8a",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "11px",
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <span style={{ fontSize: "1.5rem" }}>👥</span>
                  Dossier Interne (Collab.)
                </button>
              </div>

              {(newDossierData.origin === "CLIENT" ||
                newDossierData.origin === "COLLABORATEUR") && (
                <div
                  className="fade-in"
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <label
                    className="block mb-2 font-semibold"
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-dark)",
                    }}
                  >
                    {newDossierData.origin === "CLIENT"
                      ? "2. Rechercher le Client cible *"
                      : "2. Sélectionner le Collaborateur *"}
                  </label>
                  {newDossierData.origin === "CLIENT" ? (
                    <SearchableDropdown
                      options={dbClients
                        .filter(
                          (c) =>
                            String(c.status || "ACTIF").toUpperCase() === "ACTIF"
                        )
                        .map((c) => ({
                          value: c.id,
                          label: c.name || "Client Inconnu",
                        }))}
                      value={newDossierData.targetId}
                      onChange={(val) =>
                        setNewDossierData({
                          ...newDossierData,
                          targetId: val,
                        })
                      }
                      placeholder="-- Rechercher un client --"
                    />
                  ) : (
                    <SearchableDropdown
                      options={dbUsers.map((u) => ({
                        value: u.id,
                        label: u.name,
                      }))}
                      value={newDossierData.targetId}
                      onChange={(val) =>
                        setNewDossierData({
                          ...newDossierData,
                          targetId: val,
                        })
                      }
                      placeholder="-- Rechercher un collaborateur --"
                    />
                  )}
                </div>
              )}
            </div>

            {/* BLOC 2: INFOS GENERALES */}
            <div
              className="p-6"
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <label
                className="block mb-4 font-semibold"
                style={{ fontSize: "0.95rem", color: "var(--primary-dark)" }}
              >
                2. Informations générales
              </label>
              <div>
                <label className="block mb-2 font-medium">Description *</label>
                <textarea
                  required
                  value={newDossierData.description}
                  onChange={(e) =>
                    setNewDossierData({
                      ...newDossierData,
                      description: e.target.value,
                    })
                  }
                  className="input-field w-full"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    minHeight: "80px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                ></textarea>
              </div>
            </div>

            {/* BLOC 3: ATTRIBUTION */}
            <div
              className="p-6"
              style={{
                background: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <label
                className="block mb-4 font-semibold"
                style={{ fontSize: "0.95rem", color: "var(--primary-dark)" }}
              >
                3. Attribution
              </label>
              <div>
                <label className="block mb-2 font-medium">
                  Responsable du dossier (Traitant) *
                </label>
                <select
                  required
                  value={newDossierData.traitantId}
                  onChange={(e) =>
                    setNewDossierData({
                      ...newDossierData,
                      traitantId: e.target.value,
                    })
                  }
                  className="input-field w-full"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#FFF",
                  }}
                >
                  <option value="" disabled>
                    -- Sélectionner un traitant --
                  </option>
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
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmittingDossier}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="btn btn-primary"
              style={{ opacity: isFormValid ? 1 : 0.5 }}
            >
              {isSubmittingDossier ? "Création..." : "Créer le dossier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDossierModal;
