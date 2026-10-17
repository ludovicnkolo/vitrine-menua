import React from "react";

const AssignMessageModal = ({
  assignMsg,
  setAssignMsg,
  selectedAssignee,
  setSelectedAssignee,
  users = [],
  isSubmitting,
  handleAssignSubmit,
}) => {
  if (!assignMsg) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1000 }}
    >
      <div
        className="p-8"
        style={{
          background: "#FFF",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          className="mb-4 text-[var(--text-main)]"
          style={{ fontSize: "1.25rem" }}
        >
          Mettre en copie le message
        </h3>
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Sélectionner le destinataire :
          </label>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="w-full"
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "#FFF",
            }}
          >
            <option value="">-- Choisir un utilisateur --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role?.name || "Sans rôle"})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setAssignMsg(null);
              setSelectedAssignee("");
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={handleAssignSubmit}
          >
            {isSubmitting ? "En cours..." : "Mettre en copie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMessageModal;
