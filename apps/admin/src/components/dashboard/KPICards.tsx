import React from "react";
import { useTranslation } from "react-i18next";

export interface KPICardsProps {
  alertesCount: number;
  delaisCount: number;
  bloqueesCount: number;
  volumeTotal: number;
  nouveauxDepots: number;
  totalDossiers: number;
  totalMissions: number;
  totalTaches: number;
}

const KPICards: React.FC<KPICardsProps> = ({
  alertesCount,
  delaisCount,
  bloqueesCount,
  volumeTotal,
  nouveauxDepots,
  totalDossiers,
  totalMissions,
  totalTaches,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {/* KPI 1 : ALERTES PRIORITAIRES */}
      <div className="flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] border-t-[3.5px] border-t-red-500 rounded-lg py-3 px-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[0.72rem] text-red-500 tracking-wider uppercase">
              {t("dashboard.priorityAlerts", "Alertes prioritaires")}
            </span>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 font-extrabold text-[11px]">
              !
            </div>
          </div>
          <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
            {alertesCount}
          </div>
        </div>
        <div className="text-[0.74rem] text-[var(--text-muted)]">
          {t("dashboard.urgentMessages", "Messages clients urgents")}
        </div>
      </div>

      {/* KPI 2 : DÉLAIS CRITIQUES */}
      <div className="flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] border-t-[3.5px] border-t-amber-500 rounded-lg py-3 px-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[0.72rem] text-amber-500 tracking-wider uppercase">
              {t("dashboard.criticalDeadlines", "Délais critiques")}
            </span>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-extrabold text-[11px]">
              &gt;
            </div>
          </div>
          <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
            {delaisCount}
          </div>
        </div>
        <div className="text-[0.74rem] text-[var(--text-muted)]">
          {t("dashboard.deadlines24h", "Échéances à - de 24h")}
        </div>
      </div>

      {/* KPI 3 : OPÉRATIONS BLOQUÉES */}
      <div className="flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] border-t-[3.5px] border-t-purple-600 rounded-lg py-3 px-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[0.72rem] text-purple-600 tracking-wider uppercase">
              {t("dashboard.blockedOps", "Opérations bloquées")}
            </span>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-extrabold text-[10px]">
              ||
            </div>
          </div>
          <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
            {bloqueesCount}
          </div>
        </div>
        <div className="text-[0.74rem] text-[var(--text-muted)]">
          {t("dashboard.waitingClient", "Attente retour client")}
        </div>
      </div>

      {/* KPI 4 : VOLUME TOTAL */}
      <div className="flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] border-t-[3.5px] border-t-blue-600 rounded-lg py-3 px-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[0.72rem] text-blue-600 tracking-wider uppercase">
              {t("dashboard.totalVolume", "Volume total")}
            </span>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-extrabold text-[11px]">
              ✓
            </div>
          </div>
          <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
            {volumeTotal}
          </div>
        </div>
        <div className="text-[0.72rem] text-[var(--text-muted)] leading-tight">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="whitespace-nowrap">
              Dossiers : <strong className="font-semibold text-[var(--text-main)]">{totalDossiers}</strong>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="whitespace-nowrap">
              Missions : <strong className="font-semibold text-[var(--text-main)]">{totalMissions}</strong>
            </span>
          </div>
          <div className="mt-0.5 text-[var(--text-muted)] font-medium whitespace-nowrap">
            Tâches : <strong className="font-semibold text-[var(--text-main)]">{totalTaches}</strong>
          </div>
        </div>
      </div>

      {/* KPI 5 : NOUVEAUX DÉPÔTS */}
      <div className="flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] border-t-[3.5px] border-t-emerald-500 rounded-lg py-3 px-4 shadow-sm">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[0.72rem] text-emerald-500 tracking-wider uppercase">
              {t("dashboard.newDeposits", "Nouveaux dépôts")}
            </span>
            <div className="flex items-center justify-center font-bold w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px]">
              @
            </div>
          </div>
          <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
            {nouveauxDepots}
          </div>
        </div>
        <div className="text-[0.74rem] text-[var(--text-muted)]">
          {t("dashboard.docsLast24h", "Documents sur les 24h")}
        </div>
      </div>
    </div>
  );
};

export default KPICards;
