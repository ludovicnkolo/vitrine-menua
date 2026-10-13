import React, { useState, useEffect, useCallback } from "react";
import { getSafeApiUrl } from "../utils/helpers";
import { Plus, Edit2, Eye, Trash2, Loader2, X } from "lucide-react";
import { alertService } from "../utils/AlertService";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const PolesPage = () => {
  const [poles, setPoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPole, setEditPole] = useState(null);
  const [consultPole, setConsultPole] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchPoles = useCallback(async () => {
    try {
      const res = await fetch(getSafeApiUrl("/api/poles"), {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPoles(Array.isArray(data) ? data : []);
      } else {
        alertService.alert("Erreur lors de la récupération des pôles.", "Erreur", "error");
      }
    } catch {
      alertService.alert("Erreur de connexion au serveur pour charger les pôles.", "Erreur", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoles();
  }, [fetchPoles]);

  // Fermeture accessible avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen && !submitting) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, submitting]);

  const handleOpenModal = (pole = null) => {
    if (pole) {
      setEditPole(pole);
      setFormData({ name: pole.name || "", description: pole.description || "" });
    } else {
      setEditPole(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditPole(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    if (!cleanName) {
      alertService.alert("Le nom du pôle est requis.", "Erreur", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = editPole ? `/api/poles/${encodeURIComponent(editPole.id)}` : "/api/poles";
      const method = editPole ? "PUT" : "POST";

      const res = await fetch(getSafeApiUrl(url), {
        method,
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          name: cleanName,
          description: formData.description.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alertService.alert(
          editPole ? "Pôle modifié avec succès." : "Pôle créé avec succès.",
          "Succès",
          "success"
        );
        handleCloseModal();
        fetchPoles();
      } else {
        alertService.alert(
          data.error || "Une erreur est survenue lors de l'enregistrement.",
          "Erreur",
          "error"
        );
      }
    } catch {
      alertService.alert("Erreur réseau lors de la communication avec le serveur.", "Erreur", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    alertService.confirm("Supprimer ce pôle ?", "Cette action est irréversible.").then(async (confirmed) => {
      if (!confirmed) return;
      try {
        const res = await fetch(getSafeApiUrl(`/api/poles/${encodeURIComponent(id)}`), {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });

        if (res.ok) {
          alertService.alert("Pôle supprimé avec succès.", "Succès", "success");
          fetchPoles();
        } else {
          const data = await res.json().catch(() => ({}));
          alertService.alert(data.error || "Erreur lors de la suppression du pôle.", "Erreur", "error");
        }
      } catch {
        alertService.alert("Erreur réseau lors de la suppression.", "Erreur", "error");
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pôles d'activité</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organisation des départements métiers et rattachement des collaborateurs
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau pôle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          <span className="text-sm">Chargement des pôles...</span>
        </div>
      ) : poles.length === 0 ? (
        <div className="card text-center p-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
          Aucun pôle d'activité configuré pour le moment.
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {poles.map((pole) => (
            <div
              key={pole.id}
              className="bg-[var(--surface)] p-6 flex flex-col justify-between"
              style={{ border: "1px solid var(--border)", borderRadius: "10px", boxShadow: "var(--shadow-sm)" }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h2
                    className="font-bold break-words pr-2"
                    style={{ margin: 0, fontSize: "1.1rem", color: "var(--primary)" }}
                  >
                    {pole.name}
                  </h2>
                  <div className="inline-flex flex-col items-center shrink-0" style={{ gap: "3px" }}>
                    {/* Sommet de la pyramide : Modifier */}
                    <button
                      type="button"
                      onClick={() => handleOpenModal(pole)}
                      className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
                      title="Modifier le pôle"
                    >
                      <Edit2 size={14} />
                    </button>
                    {/* Base de la pyramide : Consulter + Supprimer */}
                    <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => setConsultPole(pole)}
                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
                        title="Consulter le pôle"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pole.id)}
                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                        title="Supprimer le pôle"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
                  {pole.description || "Aucune description renseignée."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'ajout / modification de pôle avec backdrop cliquable */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editPole ? "Modifier le pôle" : "Nouveau pôle"}
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom du pôle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="Ex: Finance, IT, Compliance..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  disabled={submitting}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
                  placeholder="Description facultative du périmètre..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="btn btn-outline text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-sm flex items-center gap-2"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  {editPole ? "Mettre à jour" : "Créer le pôle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de consultation de pôle */}
      {consultPole && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setConsultPole(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Consultation du pôle : {consultPole.name}
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                onClick={() => setConsultPole(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Nom du pôle
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800">
                  {consultPole.name}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Description
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap min-h-[80px]">
                  {consultPole.description || "Aucune description renseignée."}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setConsultPole(null)}
                  className="btn btn-outline text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolesPage;

