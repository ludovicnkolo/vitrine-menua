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
      <div className="bg-white border border-[#E2E8F0] border-t-[3.5px] border-t-red-500 rounded-lg py-3 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[0.72rem] text-red-500 tracking-wider uppercase">
            {t("dashboard.priorityAlerts", "Alertes prioritaires")}
          </span>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 border border-red-200 text-red-500 font-extrabold text-[11px]">
            !
          </div>
        </div>
        <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
          {alertesCount}
        </div>
        <div className="text-[0.74rem] text-slate-500">
          {t("dashboard.urgentMessages", "Messages clients urgents")}
        </div>
      </div>

      {/* KPI 2 : DÉLAIS CRITIQUES */}
      <div className="bg-white border border-[#E2E8F0] border-t-[3.5px] border-t-amber-500 rounded-lg py-3 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[0.72rem] text-amber-500 tracking-wider uppercase">
            {t("dashboard.criticalDeadlines", "Délais critiques")}
          </span>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-extrabold text-[11px]">
            &gt;
          </div>
        </div>
        <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
          {delaisCount}
        </div>
        <div className="text-[0.74rem] text-slate-500">
          {t("dashboard.deadlines24h", "Échéances à - de 24h")}
        </div>
      </div>

      {/* KPI 3 : OPÉRATIONS BLOQUÉES */}
      <div className="bg-white border border-[#E2E8F0] border-t-[3.5px] border-t-purple-600 rounded-lg py-3 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[0.72rem] text-purple-600 tracking-wider uppercase">
            {t("dashboard.blockedOps", "Opérations bloquées")}
          </span>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-extrabold text-[10px]">
            ||
          </div>
        </div>
        <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
          {bloqueesCount}
        </div>
        <div className="text-[0.74rem] text-slate-500">
          {t("dashboard.waitingClient", "Attente retour client")}
        </div>
      </div>

      {/* KPI 4 : VOLUME TOTAL */}
      <div className="bg-white border border-[#E2E8F0] border-t-[3.5px] border-t-blue-600 rounded-lg py-3 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[0.72rem] text-blue-600 tracking-wider uppercase">
            {t("dashboard.totalVolume", "Volume total")}
          </span>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-[11px]">
            ✓
          </div>
        </div>
        <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
          {volumeTotal}
        </div>
        <div className="text-[0.74rem] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {t("dashboard.volumeSub", "Dossiers: {{d}} • Missions: {{m}} • Tâches: {{t}}", {
            d: totalDossiers,
            m: totalMissions,
            t: totalTaches,
          })}
        </div>
      </div>

      {/* KPI 5 : NOUVEAUX DÉPÔTS */}
      <div className="bg-white border border-[#E2E8F0] border-t-[3.5px] border-t-emerald-500 rounded-lg py-3 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[0.72rem] text-emerald-500 tracking-wider uppercase">
            {t("dashboard.newDeposits", "Nouveaux dépôts")}
          </span>
          <div className="flex items-center justify-center font-bold w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px]">
            @
          </div>
        </div>
        <div className="font-bold text-[var(--text-main)] text-[1.85rem] mt-1 mb-0.5">
          {nouveauxDepots}
        </div>
        <div className="text-[0.74rem] text-slate-500">
          {t("dashboard.docsLast24h", "Documents sur les 24h")}
        </div>
      </div>
    </div>
  );
};

export default KPICards;
