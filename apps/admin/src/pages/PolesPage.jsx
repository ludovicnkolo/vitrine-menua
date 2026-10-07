import React, { useState, useEffect } from "react";
import { getSafeApiUrl } from "../utils/helpers";
import { Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { alertService } from "../utils/AlertService";

const PolesPage = () => {
  const [poles, setPoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPole, setEditPole] = useState(null);
  const confirm = (msg, title, callback) => {
    alertService.confirm(msg, title).then((res) => { if (res && callback) callback(); });
  };
  const showSuccess = (msg) => alertService.alert(msg, "Succès", "success");
  const showError = (msg) => alertService.alert(msg, "Erreur", "error");
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchPoles = async () => {
    try {
      const res = await fetch(getSafeApiUrl("/api/poles"), { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPoles(data);
      }
    } catch (error) {
      showError("Erreur de chargement des pôles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoles();
  }, []);

  const handleOpenModal = (pole = null) => {
    if (pole) {
      setEditPole(pole);
      setFormData({ name: pole.name, description: pole.description || "" });
    } else {
      setEditPole(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditPole(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editPole ? `/api/poles/${editPole.id}` : "/api/poles";
      const method = editPole ? "PUT" : "POST";
      const res = await fetch(getSafeApiUrl(url), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        showSuccess(editPole ? "Pôle modifié" : "Pôle créé");
        fetchPoles();
        handleCloseModal();
      } else {
        const err = await res.json();
        showError(err.error || "Erreur serveur");
      }
    } catch (error) {
      showError("Erreur réseau");
    }
  };

  const handleDelete = (id) => {
    confirm("Supprimer ce pôle ?", "Cette action est irréversible.", async () => {
      try {
        const res = await fetch(getSafeApiUrl(`/api/poles/${id}`), {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          showSuccess("Pôle supprimé");
          fetchPoles();
        } else {
          showError("Erreur lors de la suppression");
        }
      } catch (error) {
        showError("Erreur réseau");
      }
    });
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Pôles d'activité</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: "flex", gap: "0.5rem" }}>
          <Plus size={16} /> Nouveau pôle
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {poles.map((pole) => (
            <div key={pole.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--primary)" }}>{pole.name}</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleOpenModal(pole)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(pole.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                {pole.description || "Aucune description"}
              </p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>{editPole ? "Modifier le pôle" : "Nouveau pôle"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Nom du pôle *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                  placeholder="Ex: Finance, IT, Compliance..."
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", minHeight: "100px" }}
                  placeholder="Description facultative..."
                />
              </div>
              <div className="modal-footer" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={handleCloseModal} className="btn">Annuler</button>
                <button type="submit" className="btn btn-primary">{editPole ? "Mettre à jour" : "Créer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolesPage;
