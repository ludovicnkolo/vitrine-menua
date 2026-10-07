import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getSafeApiUrl } from "../utils/helpers";
import { Calendar, ChevronDown } from "lucide-react";

const SAMPLE_COLLABORATEURS = [
  {
    name: "Responsable opérationnel 1",
    role: "Responsable",
    roleCategory: "Responsable",
    tachesEnCours: 0,
    etat: "VERT",
  },
  {
    name: "Responsable opérationnel 2",
    role: "Responsable",
    roleCategory: "Responsable",
    tachesEnCours: 1,
    etat: "BLEU",
  },
  {
    name: "Relecteur 1",
    role: "Contrôle Qualité",
    roleCategory: "Relecteur",
    tachesEnCours: 0,
    etat: "VERT",
  },
  {
    name: "Relecteur 2",
    role: "Contrôle Qualité",
    roleCategory: "Relecteur",
    tachesEnCours: 0,
    etat: "VERT",
  },
  {
    name: "Collaborateur 1",
    role: "Production",
    roleCategory: "Collaborateur",
    tachesEnCours: 1,
    etat: "BLEU",
  },
  {
    name: "Collaborateur 2",
    role: "Production",
    roleCategory: "Collaborateur",
    tachesEnCours: 0,
    etat: "VERT",
  },
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default dates matching screenshot: Du 01/10/2026 au 31/10/2026
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");

  // Filters for the two big cards
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [funnelView, setFunnelView] = useState("cumulee");

  const fetchStats = async (start, end) => {
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
        },
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
  };

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, []);

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      if (window.customAlert)
        window.customAlert("Veuillez sélectionner une date de début et une date de fin.");
      else alert("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      if (window.customAlert)
        window.customAlert("La date de fin doit être strictement supérieure à la date de début.");
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
        (c.roleCategory || "").toLowerCase().includes(selectedRoleFilter.toLowerCase()),
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
      4,
    );
    return maxVal;
  }, [entonnoirData]);

  const getInitials = (collab) => {
    const r = (collab.role || collab.roleCategory || "").toLowerCase();
    if (r.includes("responsable") || r.includes("relecteur")) return "RE";
    if (r.includes("collab") || r.includes("production")) return "CO";
    return collab.name.substring(0, 2).toUpperCase();
  };

  const dossiersCloturesVal =
    entonnoirData.find((d) => d.name.includes("Dossier"))?.value ?? 1;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 0.5rem" }}>
      {/* ── HEADER : TITRE + SÉLECTEUR DE PÉRIODE ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-main)",
              margin: "0 0 0.25rem 0",
            }}
          >
            {t("dashboard.title", "Tour de Contrôle")}
          </h1>
          <p style={{ color: "#64748B", margin: 0, fontSize: "0.85rem" }}>
            {t("dashboard.subtitle", "Vue d'ensemble stratégique et opérationnelle en temps réel")}
          </p>
        </div>

        {/* Date Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#FFF",
            padding: "0.35rem 0.6rem",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 500 }}>
            {t("dashboard.period", "Période :")}
          </span>

          {/* Date start */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              border: "1.5px solid #3B82F6",
              borderRadius: "8px",
              padding: "0.3rem 0.6rem",
              background: "#FFF",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>{t("dashboard.from", "Du")}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "0.82rem",
                color: "var(--text-main)",
                fontWeight: 600,
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>

          <span style={{ color: "#94A3B8", fontSize: "0.9rem" }}>→</span>

          {/* Date end */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              border: "1.5px solid #3B82F6",
              borderRadius: "8px",
              padding: "0.3rem 0.6rem",
              background: "#FFF",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>{t("dashboard.to", "Au")}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "0.82rem",
                color: "var(--text-main)",
                fontWeight: 600,
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={loading}
            style={{
              padding: "0.45rem 1.25rem",
              background: "var(--text-main)",
              color: "#FFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginLeft: "0.25rem",
            }}
          >
            {t("dashboard.apply", "Appliquer")}
          </button>
        </div>
      </div>

      {/* ── LIGNE 1 : 5 CARTES KPI ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* KPI 1 : ALERTES PRIORITAIRES */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "3.5px solid #EF4444",
            borderRadius: "10px",
            padding: "0.9rem 1.1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#EF4444",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {t("dashboard.priorityAlerts", "Alertes prioritaires")}
            </span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              !
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", margin: "0.3rem 0 0.15rem 0" }}>
            {alertesCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
            {t("dashboard.urgentMessages", "Messages clients urgents")}
          </div>
        </div>

        {/* KPI 2 : DÉLAIS CRITIQUES */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "3.5px solid #F59E0B",
            borderRadius: "10px",
            padding: "0.9rem 1.1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#F59E0B",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {t("dashboard.criticalDeadlines", "Délais critiques")}
            </span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                color: "#D97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              &gt;
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", margin: "0.3rem 0 0.15rem 0" }}>
            {delaisCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
            {t("dashboard.deadlines24h", "Échéances à - de 24h")}
          </div>
        </div>

        {/* KPI 3 : OPÉRATIONS BLOQUÉES */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "3.5px solid #9333EA",
            borderRadius: "10px",
            padding: "0.9rem 1.1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#9333EA",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {t("dashboard.blockedOps", "Opérations bloquées")}
            </span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#FAF5FF",
                border: "1px solid #E9D5FF",
                color: "#9333EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "10px",
              }}
            >
              ||
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", margin: "0.3rem 0 0.15rem 0" }}>
            {bloqueesCount}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
            {t("dashboard.waitingClient", "Attente retour client")}
          </div>
        </div>

        {/* KPI 4 : VOLUME TOTAL */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "3.5px solid #2563EB",
            borderRadius: "10px",
            padding: "0.9rem 1.1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#2563EB",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {t("dashboard.totalVolume", "Volume total")}
            </span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              ✓
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", margin: "0.3rem 0 0.15rem 0" }}>
            {volumeTotal}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t("dashboard.volumeSub", "Dossiers: {{d}} • Missions: {{m}} • Tâches: {{t}}", {
              d: totalDossiers,
              m: totalMissions,
              t: totalTaches,
            })}
          </div>
        </div>

        {/* KPI 5 : NOUVEAUX DÉPÔTS */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "3.5px solid #10B981",
            borderRadius: "10px",
            padding: "0.9rem 1.1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#10B981",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {t("dashboard.newDeposits", "Nouveaux dépôts")}
            </span>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "11px",
              }}
            >
              @
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--text-main)", margin: "0.3rem 0 0.15rem 0" }}>
            {nouveauxDepots}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
            {t("dashboard.docsLast24h", "Documents sur les 24h")}
          </div>
        </div>
      </div>

      {/* ── LIGNE 2 : LES DEUX GRANDS BLOCS CÔTE À CÔTE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        {/* BLOC GAUCHE : MÉTÉO DE CHARGE */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "4px solid #2563EB",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                {t("dashboard.workloadWeather", "Météo de Charge (En cours)")}
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>
                {t("dashboard.workloadSub", "Répartition de la charge opérationnelle par collaborateur et rôle")}
              </p>
            </div>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              style={{
                padding: "0.35rem 1.6rem 0.35rem 0.75rem",
                borderRadius: "8px",
                border: "1.5px solid #3B82F6",
                background: "#FFF",
                fontSize: "0.8rem",
                color: "var(--text-main)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">{t("common.allRoles", "Tous les rôles")}</option>
              <option value="responsable">{t("role.Responsable opérationnel", "Responsable")}</option>
              <option value="relecteur">{t("role.Relecteur", "Relecteur")}</option>
              <option value="collaborateur">{t("role.Collaborateur", "Collaborateur")}</option>
            </select>
          </div>

          {/* List of collaborators */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
            {filteredCollabs.map((collab, idx) => {
              const count = collab.tachesEnCours || 0;
              const hasTasks = count > 0;
              const stripeColor = hasTasks ? "#2563EB" : "#10B981";
              const initials = getInitials(collab);

              return (
                <div
                  key={idx}
                  style={{
                    background: "#FFF",
                    border: "1px solid #F1F5F9",
                    borderLeft: `4px solid ${stripeColor}`,
                    borderRadius: "8px",
                    padding: "0.65rem 0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* Left: Avatar + Details */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#F1F5F9",
                        color: "#334155",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                        {collab.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "1px" }}>
                        {t("common.role", "Rôle")} : {t(`role.${collab.role || collab.roleCategory}`, collab.role || collab.roleCategory || "Production")}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {hasTasks ? (
                      <span
                        style={{
                          background: "#EFF6FF",
                          color: "#2563EB",
                          borderRadius: "20px",
                          padding: "0.2rem 0.65rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span style={{ fontSize: "0.65rem" }}>●</span> {t("dashboard.inActivity", "En activité")}
                      </span>
                    ) : (
                      <span
                        style={{
                          background: "#ECFDF5",
                          color: "#059669",
                          borderRadius: "20px",
                          padding: "0.2rem 0.65rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span style={{ fontSize: "0.65rem" }}>●</span> {t("dashboard.available", "Disponible")}
                      </span>
                    )}

                    <span
                      style={{
                        background: hasTasks ? "#EFF6FF" : "#F0FDF4",
                        border: hasTasks ? "1px solid #BFDBFE" : "1px solid #A7F3D0",
                        color: hasTasks ? "#2563EB" : "#059669",
                        borderRadius: "6px",
                        padding: "0.2rem 0.55rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {count} {t("dashboard.tasks", "tâche(s)")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOC DROIT : ENTONNOIR DE PRODUCTION */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E2E8F0",
            borderTop: "4px solid #EC4899",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                {t("dashboard.productionFunnel", "Entonnoir de Production (Période)")}
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>
                {t("dashboard.funnelSub", "Flux d'avancement des volumes du traitement client à la clôture")}
              </p>
            </div>
            <select
              value={funnelView}
              onChange={(e) => setFunnelView(e.target.value)}
              style={{
                padding: "0.35rem 1.6rem 0.35rem 0.75rem",
                borderRadius: "8px",
                border: "1.5px solid #3B82F6",
                background: "#FFF",
                fontSize: "0.8rem",
                color: "var(--text-main)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="cumulee">{t("dashboard.cumulativeView", "Vue cumulée")}</option>
              <option value="mensuelle">{t("dashboard.detailedView", "Vue détaillée")}</option>
            </select>
          </div>

          {/* 4 Funnel Bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
            {/* 1. Messages Traités */}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                {t("dashboard.processedMessages", "Messages Traités")}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem" }}>
                {t("dashboard.processedMessagesSub", "Demandes & formulaires qualifiés")}
              </div>
              <div
                style={{
                  background: "#F1F5F9",
                  height: "28px",
                  borderRadius: "6px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#2563EB",
                    width: `${(entonnoirData[0]?.value || 0) > 0 ? Math.max(12, ((entonnoirData[0]?.value || 0) / maxFunnelVolume) * 100) : 0}%`,
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: (entonnoirData[0]?.value || 0) > 0 ? "10px" : 0,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    transition: "width 0.3s ease",
                  }}
                >
                  {(entonnoirData[0]?.value || 0) > 0 && entonnoirData[0].value}
                </div>
                {(entonnoirData[0]?.value || 0) === 0 && (
                  <span style={{ position: "absolute", left: "12px", color: "#94A3B8", fontWeight: 700, fontSize: "0.82rem" }}>
                    0
                  </span>
                )}
              </div>
            </div>

            {/* 2. Missions Démarrées */}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                {t("dashboard.startedMissions", "Missions Démarrées")}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem" }}>
                {t("dashboard.startedMissionsSub", "Missions opérationnelles en cours")}
              </div>
              <div
                style={{
                  background: "#F1F5F9",
                  height: "28px",
                  borderRadius: "6px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#8B5CF6",
                    width: `${(entonnoirData[1]?.value || 0) > 0 ? Math.max(12, ((entonnoirData[1]?.value || 0) / maxFunnelVolume) * 100) : 0}%`,
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: (entonnoirData[1]?.value || 0) > 0 ? "10px" : 0,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    transition: "width 0.3s ease",
                  }}
                >
                  {(entonnoirData[1]?.value || 0) > 0 && entonnoirData[1].value}
                </div>
                {(entonnoirData[1]?.value || 0) === 0 && (
                  <span style={{ position: "absolute", left: "12px", color: "#94A3B8", fontWeight: 700, fontSize: "0.82rem" }}>
                    0
                  </span>
                )}
              </div>
            </div>

            {/* 3. Tâches Terminées */}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                {t("dashboard.completedTasks", "Tâches Terminées")}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem" }}>
                {t("dashboard.completedTasksSub", "Livrables validés et contrôlés")}
              </div>
              <div
                style={{
                  background: "#F1F5F9",
                  height: "28px",
                  borderRadius: "6px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#10B981",
                    width: `${(entonnoirData[2]?.value || 0) > 0 ? Math.max(12, ((entonnoirData[2]?.value || 0) / maxFunnelVolume) * 100) : 0}%`,
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: (entonnoirData[2]?.value || 0) > 0 ? "10px" : 0,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    transition: "width 0.3s ease",
                  }}
                >
                  {(entonnoirData[2]?.value || 0) > 0 && entonnoirData[2].value}
                </div>
                {(entonnoirData[2]?.value || 0) === 0 && (
                  <span style={{ position: "absolute", left: "12px", color: "#94A3B8", fontWeight: 700, fontSize: "0.82rem" }}>
                    0
                  </span>
                )}
              </div>
            </div>

            {/* 4. Dossiers Clôturés */}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                {t("dashboard.closedDossiers", "Dossiers Clôturés")}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem" }}>
                {t("dashboard.closedDossiersSub", "Prestations finalisées et archivées")}
              </div>
              <div
                style={{
                  background: "#F1F5F9",
                  height: "28px",
                  borderRadius: "6px",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#F59E0B",
                    width: `${(entonnoirData[3]?.value || 0) > 0 ? Math.max(12, ((entonnoirData[3]?.value || 0) / maxFunnelVolume) * 100) : 0}%`,
                    height: "100%",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: (entonnoirData[3]?.value || 0) > 0 ? "10px" : 0,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    transition: "width 0.3s ease",
                  }}
                >
                  {(entonnoirData[3]?.value || 0) > 0 && entonnoirData[3].value}
                </div>
                {(entonnoirData[3]?.value || 0) === 0 && (
                  <span style={{ position: "absolute", left: "12px", color: "#94A3B8", fontWeight: 700, fontSize: "0.82rem" }}>
                    0
                  </span>
                )}
              </div>
            </div>

            {/* Axis scale */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 4px",
                fontSize: "0.72rem",
                color: "#94A3B8",
                marginTop: "0.15rem",
              }}
            >
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4 (Volume)</span>
            </div>
          </div>

          {/* Note de pilotage */}
          <div
            style={{
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              marginTop: "1.25rem",
              color: "#2563EB",
              fontSize: "0.78rem",
            }}
          >
            <span style={{ fontWeight: 700 }}>Note de pilotage :</span> Ratio de clôture équilibré •{" "}
            {dossiersCloturesVal} dossier{dossiersCloturesVal > 1 ? "s" : ""} finalisé{dossiersCloturesVal > 1 ? "s" : ""} sur la période sélectionnée.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
