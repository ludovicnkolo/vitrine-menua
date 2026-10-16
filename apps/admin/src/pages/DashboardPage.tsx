import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getSafeApiUrl } from "../utils/helpers";
import { socket } from "../utils/socket";
import KPICards from "../components/dashboard/KPICards";
import CollaboratorWeather, { CollaboratorData } from "../components/dashboard/CollaboratorWeather";
import FunnelCard, { FunnelItem } from "../components/dashboard/FunnelCard";

const SAMPLE_COLLABORATEURS: CollaboratorData[] = [
  {
    name: "Responsable opérationnel 1",
    role: "Responsable",
    roleCategory: "Responsable",
    tachesEnCours: 0,
  },
  {
    name: "Responsable opérationnel 2",
    role: "Responsable",
    roleCategory: "Responsable",
    tachesEnCours: 1,
  },
  {
    name: "Relecteur 1",
    role: "Contrôle Qualité",
    roleCategory: "Relecteur",
    tachesEnCours: 0,
  },
  {
    name: "Relecteur 2",
    role: "Contrôle Qualité",
    roleCategory: "Relecteur",
    tachesEnCours: 0,
  },
  {
    name: "Collaborateur 1",
    role: "Production",
    roleCategory: "Collaborateur",
    tachesEnCours: 1,
  },
  {
    name: "Collaborateur 2",
    role: "Production",
    roleCategory: "Collaborateur",
    tachesEnCours: 0,
  },
];

interface DashboardStats {
  alertesPrioritaires?: number;
  delaisCritiques?: number;
  operationsBloquees?: number;
  totalDossiers?: number;
  totalMissions?: number;
  totalTaches?: number;
  volumeTotal?: number;
  nouveauxDepots?: number;
  meteoCharge?: CollaboratorData[];
  entonnoirPeriode?: FunnelItem[];
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Default dates matching screenshot: Du 01/10/2026 au 31/10/2026
  const [startDate, setStartDate] = useState<string>("2026-10-01");
  const [endDate, setEndDate] = useState<string>("2026-10-31");

  // Filters for the two big cards
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [funnelView, setFunnelView] = useState<string>("cumulee");

  const fetchStats = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);

      const res = await fetch(
        getSafeApiUrl(`/api/crm/dashboard-stats?${params.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, [fetchStats, startDate, endDate]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchStats(startDate, endDate);
    };
    socket.on("entity_updated_global", handleUpdate);
    return () => {
      socket.off("entity_updated_global", handleUpdate);
    };
  }, [fetchStats, startDate, endDate]);

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      if ((window as any).customAlert)
        (window as any).customAlert("Veuillez sélectionner une date de début et une date de fin.");
      else alert("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      if ((window as any).customAlert)
        (window as any).customAlert("La date de fin doit être strictement supérieure à la date de début.");
      else alert("La date de fin doit être strictement supérieure à la date de début.");
      return;
    }
    fetchStats(startDate, endDate);
  };

  // KPI Data
  const alertesCount = stats?.alertesPrioritaires ?? 0;
  const delaisCount = stats?.delaisCritiques ?? 0;
  const bloqueesCount = stats?.operationsBloquees ?? 0;
  const totalDossiers = stats?.totalDossiers ?? 0;
  const totalMissions = stats?.totalMissions ?? 0;
  const totalTaches = stats?.totalTaches ?? 0;
  const volumeTotal =
    stats?.volumeTotal ?? (totalDossiers + totalMissions + totalTaches);
  const nouveauxDepots = stats?.nouveauxDepots ?? 0;

  // Collaborateurs data
  const rawCollabs =
    stats?.meteoCharge && stats.meteoCharge.length > 0
      ? stats.meteoCharge
      : SAMPLE_COLLABORATEURS;

  const filteredCollabs = useMemo(() => {
    if (selectedRoleFilter === "all") return rawCollabs;
    return rawCollabs.filter(
      (c) =>
        (c.role || "").toLowerCase().includes(selectedRoleFilter.toLowerCase()) ||
        (c.roleCategory || "").toLowerCase().includes(selectedRoleFilter.toLowerCase())
    );
  }, [rawCollabs, selectedRoleFilter]);

  // Funnel items
  const entonnoirData = useMemo(() => {
    if (stats?.entonnoirPeriode && stats.entonnoirPeriode.length > 0) {
      return stats.entonnoirPeriode;
    }
    return [
      { name: "Messages Traités", value: 0 },
      { name: "Missions Démarrées", value: 0 },
      { name: "Tâches Terminées", value: 0 },
      { name: "Dossiers Clôturés", value: 0 },
    ];
  }, [stats]);

  const maxFunnelVolume = useMemo(() => {
    const maxVal = Math.max(
      ...entonnoirData.map((d) => d.value || 0),
      4
    );
    return maxVal;
  }, [entonnoirData]);

  return (
    <div className="max-w-[1280px] mx-auto px-2 pb-8">
      {/* ── HEADER : TITRE + SÉLECTEUR DE PÉRIODE ── */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-bold text-[var(--text-main)] text-[1.6rem] m-0 mb-1">
            {t("dashboard.title", "Tour de Contrôle")}
          </h1>
          <p className="text-[var(--text-muted)] m-0 text-[0.85rem]">
            {t("dashboard.subtitle", "Vue d'ensemble stratégique et opérationnelle en temps réel")}
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap bg-[var(--surface)] px-2.5 py-1.5 rounded-xl border border-[var(--border)] shadow-sm">
          <span className="font-medium text-[0.82rem] text-[var(--text-muted)]">
            {t("dashboard.period", "Période :")}
          </span>

          {/* Date start */}
          <div className="flex items-center gap-1.5 border-[1.5px] border-blue-500 rounded-lg px-2.5 py-1 bg-[var(--bg-main)]">
            <span className="text-[0.78rem] text-[var(--text-muted)]">{t("dashboard.from", "Du")}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-[var(--text-main)] font-semibold cursor-pointer border-none outline-none text-[0.82rem] bg-transparent"
            />
          </div>

          <span className="text-[var(--text-muted)] text-[0.9rem]">→</span>

          {/* Date end */}
          <div className="flex items-center gap-1.5 border-[1.5px] border-blue-500 rounded-lg px-2.5 py-1 bg-[var(--bg-main)]">
            <span className="text-[0.78rem] text-[var(--text-muted)]">{t("dashboard.to", "Au")}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-[var(--text-main)] font-semibold cursor-pointer border-none outline-none text-[0.82rem] bg-transparent"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={loading}
            className={`px-5 py-2 bg-[var(--primary)] text-white border-none rounded-lg font-semibold text-[0.82rem] ml-1 transition-opacity ${
              loading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-90"
            }`}
          >
            {t("dashboard.apply", "Appliquer")}
          </button>
        </div>
      </div>

      {/* ── LIGNE 1 : 5 CARTES KPI ── */}
      <KPICards
        alertesCount={alertesCount}
        delaisCount={delaisCount}
        bloqueesCount={bloqueesCount}
        volumeTotal={volumeTotal}
        nouveauxDepots={nouveauxDepots}
        totalDossiers={totalDossiers}
        totalMissions={totalMissions}
        totalTaches={totalTaches}
      />

      {/* ── LIGNE 2 : LES DEUX GRANDS BLOCS CÔTE À CÔTE ── */}
      <div className="grid grid-cols-2 gap-6 items-stretch">
        <CollaboratorWeather
          collabs={filteredCollabs}
          selectedRoleFilter={selectedRoleFilter}
          onRoleFilterChange={setSelectedRoleFilter}
        />
        <FunnelCard
          entonnoirData={entonnoirData}
          funnelView={funnelView}
          onFunnelViewChange={setFunnelView}
          maxFunnelVolume={maxFunnelVolume}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
