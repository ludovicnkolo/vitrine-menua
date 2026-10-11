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
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>Pôles d'activité</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex gap-2">
          <Plus size={16} /> Nouveau pôle
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))"}}>
          {poles.map((pole) => (
            <div key={pole.id} className="bg-[var(--surface)] p-6" style={{border:"1px solid var(--border)",borderRadius:"8px"}}>
              <div className="flex justify-between items-start mb-4">
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--primary)" }}>{pole.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(pole)} className="cursor-pointer" style={{background:"none",border:"none",color:"var(--text-muted)"}}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(pole.id)} className="cursor-pointer" style={{background:"none",border:"none",color:"#EF4444"}}>
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
              <div className="mb-4">
                <label className="block mb-2 font-medium">Nom du pôle *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                  placeholder="Ex: Finance, IT, Compliance..."
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",minHeight:"100px"}}
                  placeholder="Description facultative..."
                />
              </div>
              <div className="modal-footer flex gap-4 justify-end">
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
