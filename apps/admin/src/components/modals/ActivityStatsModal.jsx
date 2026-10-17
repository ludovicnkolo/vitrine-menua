import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Activity,
  Calendar,
  Filter,
  RotateCcw,
  Loader,
  Folder,
  CheckSquare,
  ListTodo,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Modal from "../ui/Modal";
import { getSafeApiUrl } from "../../utils/helpers";

/**
 * Modale de Bilan d'activité (Interne / Collaborateur) et de Suivi d'activité (Client).
 * Entièrement autonome avec filtres de date, requêtes API et KPIs graphiques.
 */
export default function ActivityStatsModal({ isOpen, onClose, type, target }) {
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [statsPreset, setStatsPreset] = useState("all");
  const [statsStartDate, setStatsStartDate] = useState("");
  const [statsEndDate, setStatsEndDate] = useState("");

  const fetchStats = async (start = "", end = "") => {
    if (!target?.id) return;
    setStatsLoading(true);
    setStatsError(null);
    try {
      const token = sessionStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);

      const endpoint =
        type === "user"
          ? `/api/crm/users/${target.id}/activity-stats`
          : `/api/crm/clients/${target.id}/activity-stats`;

      const res = await fetch(getSafeApiUrl(`${endpoint}?${params.toString()}`), {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Erreur lors de la récupération des données");
      }
      const data = await res.json();
      setStatsData(data);
    } catch (err) {
      console.error("Erreur stats:", err);
      setStatsError(err.message || "Erreur de chargement");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && target?.id) {
      setStatsPreset("all");
      setStatsStartDate("");
      setStatsEndDate("");
      setStatsError(null);
      fetchStats("", "");
    }
  }, [isOpen, target?.id, type]);

  const handleApplyFilter = () => {
    if (statsStartDate && statsEndDate && new Date(statsStartDate) > new Date(statsEndDate)) {
      setStatsError("La date de début doit être antérieure ou égale à la date de fin.");
      return;
    }
    setStatsPreset("custom");
    setStatsError(null);
    fetchStats(statsStartDate, statsEndDate);
  };

  const handlePresetPeriod = (preset) => {
    setStatsPreset(preset);
    setStatsError(null);
    const now = new Date();
    let start = "";
    let end = "";
    const pad = (n) => String(n).padStart(2, "0");

    if (preset === "month") {
      const year = now.getFullYear();
      const month = now.getMonth();
      start = `${year}-${pad(month + 1)}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      end = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
    } else if (preset === "year") {
      const year = now.getFullYear();
      start = `${year}-01-01`;
      end = `${year}-12-31`;
    }

    setStatsStartDate(start);
    setStatsEndDate(end);
    fetchStats(start, end);
  };

  if (!isOpen || !target) return null;

  const title =
    type === "user"
      ? `Bilan d'activité : ${target.name}`
      : `Suivi d'activité : ${target.entreprise?.raisonSociale || target.name}`;

  const subtitle =
    type === "user"
      ? "Missions, dossiers et tâches assignés et terminés pour ce collaborateur"
      : "Dossiers, missions et tâches créés pour ce client";

  const modalIcon = type === "user" ? <BarChart3 size={24} /> : <Activity size={24} />;

  const footer = (
    <button
      type="button"
      onClick={onClose}
      className="btn btn-outline"
      style={{ padding: "0.5rem 1.25rem" }}
    >
      Fermer
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={modalIcon}
      footer={footer}
      maxWidth="800px"
    >
      {/* Barre de filtrage par date */}
      <div
        className="flex flex-col"
        style={{
          backgroundColor: "#F8FAFC",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "0.85rem 1rem",
          gap: "0.6rem",
        }}
      >
        <div className="flex items-center justify-between flex-wrap" style={{ gap: "0.75rem" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-[var(--text-main)] flex items-center"
              style={{ fontSize: "0.85rem", gap: "0.35rem" }}
            >
              <Calendar size={15} /> Période :
            </span>
            <div className="flex items-center" style={{ gap: "0.35rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Du</span>
              <input
                type="date"
                value={statsStartDate}
                onChange={(e) => {
                  setStatsStartDate(e.target.value);
                  setStatsPreset("custom");
                }}
                style={{
                  padding: "0.3rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  fontSize: "0.85rem",
                  background: "#FFFFFF",
                }}
              />
            </div>
            <div className="flex items-center" style={{ gap: "0.35rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Au</span>
              <input
                type="date"
                value={statsEndDate}
                onChange={(e) => {
                  setStatsEndDate(e.target.value);
                  setStatsPreset("custom");
                }}
                style={{
                  padding: "0.3rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  fontSize: "0.85rem",
                  background: "#FFFFFF",
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleApplyFilter}
              disabled={statsLoading}
              className="btn btn-primary inline-flex items-center"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", gap: "0.35rem" }}
            >
              <Filter size={14} /> Filtrer
            </button>
            <button
              type="button"
              onClick={() => handlePresetPeriod("all")}
              disabled={statsLoading}
              className="btn btn-outline inline-flex items-center"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", gap: "0.35rem" }}
            >
              <RotateCcw size={14} /> Réinitialiser
            </button>
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center" style={{ gap: "0.4rem" }}>
            {["all", "month", "year"].map((p) => {
              const labels = { all: "Tout", month: "Ce mois", year: "Cette année" };
              const isSelected = statsPreset === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetPeriod(p)}
                  style={{
                    border: isSelected
                      ? "1px solid var(--primary, #c99c5c)"
                      : "1px solid var(--border)",
                    background: isSelected ? "rgba(201, 156, 92, 0.15)" : "#FFFFFF",
                    color: isSelected ? "var(--primary, #c99c5c)" : "var(--text-muted)",
                    borderRadius: "14px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontWeight: isSelected ? 700 : 500,
                    transition: "all 0.15s ease",
                  }}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
        </div>

        {statsError && (
          <div style={{ fontSize: "0.8rem", color: "#EF4444", marginTop: "0.25rem" }}>
            {statsError}
          </div>
        )}
      </div>

      {/* Contenu des statistiques */}
      {statsLoading ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ padding: "3rem 1rem", gap: "0.75rem", color: "var(--text-muted)" }}
        >
          <Loader size={30} className="spin" />
          <span>Chargement des statistiques...</span>
        </div>
      ) : type === "user" ? (
        /* Vue INTERNE : Dossiers, Missions, Tâches (Assigné / Terminé) */
        <div className="flex flex-col gap-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {/* Carte Dossiers Interne */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #2563EB",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]" style={{ fontSize: "1rem" }}>
                  Dossiers
                </span>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#FEF3C7",
                    color: "#D97706",
                  }}
                >
                  <Folder size={18} color="#D97706" fill="#FBBF24" />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}
                  >
                    Assignés
                  </span>
                  <span className="text-[var(--text-main)]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                    {statsData?.dossiers?.assignes ?? statsData?.dossiers?.assignees ?? 0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminés
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.dossiers?.termines ?? statsData?.dossiers?.terminees ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Missions Interne */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #0D9488",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]" style={{ fontSize: "1rem" }}>
                  Missions
                </span>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#F0FDFA",
                    color: "#0D9488",
                  }}
                >
                  <CheckSquare size={18} />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}
                  >
                    Assignées
                  </span>
                  <span className="text-[var(--text-main)]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                    {statsData?.missions?.assignees ??
                      statsData?.missions?.assignes ??
                      statsData?.missions?.total ??
                      0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminées
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.missions?.terminees ?? statsData?.missions?.termines ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Tâches Interne */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #7C3AED",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]" style={{ fontSize: "1rem" }}>
                  Tâches
                </span>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#F5F3FF",
                    color: "#7C3AED",
                  }}
                >
                  <ListTodo size={18} />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}
                  >
                    Assignées
                  </span>
                  <span className="text-[var(--text-main)]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                    {statsData?.taches?.assignees ?? statsData?.taches?.assignes ?? 0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminées
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.taches?.terminees ?? statsData?.taches?.termines ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2"
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.6rem 0.85rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <CheckCircle2 size={16} color="#059669" />
            <span>Nombre d'éléments directement assignés et finalisés pour cet utilisateur interne.</span>
          </div>
        </div>
      ) : (
        /* Vue CLIENT : Dossiers, Missions, Tâches créés (En cours / Terminé) */
        <div className="flex flex-col gap-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {/* Carte Dossiers Client */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #2563EB",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-main)] block" style={{ fontSize: "1rem" }}>
                    Dossiers
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Total créés : <strong>{statsData?.dossiers?.total ?? 0}</strong>
                  </span>
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#FEF3C7",
                    color: "#D97706",
                  }}
                >
                  <Folder size={18} color="#D97706" fill="#FBBF24" />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#92400E", textTransform: "uppercase" }}
                  >
                    En cours
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                    {statsData?.dossiers?.enCours ?? 0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminés
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.dossiers?.termines ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Missions Client */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #0D9488",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-main)] block" style={{ fontSize: "1rem" }}>
                    Missions
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Total créées : <strong>{statsData?.missions?.total ?? 0}</strong>
                  </span>
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#F0FDFA",
                    color: "#0D9488",
                  }}
                >
                  <CheckSquare size={18} />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#92400E", textTransform: "uppercase" }}
                  >
                    En cours
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                    {statsData?.missions?.enCours ?? 0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminées
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.missions?.termines ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Tâches Client */}
            <div
              className="flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderTop: "4px solid #7C3AED",
                borderRadius: "10px",
                padding: "1.2rem",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-main)] block" style={{ fontSize: "1rem" }}>
                    Tâches
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Total créées : <strong>{statsData?.taches?.total ?? 0}</strong>
                  </span>
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#F5F3FF",
                    color: "#7C3AED",
                  }}
                >
                  <ListTodo size={18} />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div
                  className="text-center"
                  style={{
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#92400E", textTransform: "uppercase" }}
                  >
                    En cours
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706" }}>
                    {statsData?.taches?.enCours ?? 0}
                  </span>
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "0.65rem",
                  }}
                >
                  <span
                    className="block font-semibold"
                    style={{ fontSize: "0.72rem", color: "#065F46", textTransform: "uppercase" }}
                  >
                    Terminées
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>
                    {statsData?.taches?.termines ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-2"
            style={{
              backgroundColor: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "8px",
              padding: "0.65rem 0.85rem",
              fontSize: "0.8rem",
              color: "#1E40AF",
            }}
          >
            <Clock size={16} />
            <span>
              <strong>« En cours »</strong> regroupe tous les éléments créés pour ce client qui ne sont pas encore terminés (tous statuts actifs confondus).
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
