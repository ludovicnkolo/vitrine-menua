import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface FunnelItem {
  name: string;
  value: number;
}

export interface FunnelCardProps {
  entonnoirData: FunnelItem[];
  funnelView: string;
  onFunnelViewChange: (view: string) => void;
  maxFunnelVolume: number;
}

const FunnelCard: React.FC<FunnelCardProps> = ({
  entonnoirData,
  funnelView,
  onFunnelViewChange,
  maxFunnelVolume,
}) => {
  const { t } = useTranslation();

  const dossiersCloturesVal = useMemo(() => {
    return entonnoirData.find((d) => d.name.includes("Dossier"))?.value ?? 1;
  }, [entonnoirData]);

  const stages = [
    {
      title: t("dashboard.processedMessages", "Messages Traités"),
      subtitle: t("dashboard.processedMessagesSub", "Demandes & formulaires qualifiés"),
      colorClass: "bg-blue-600",
      value: entonnoirData[0]?.value || 0,
    },
    {
      title: t("dashboard.startedMissions", "Missions Démarrées"),
      subtitle: t("dashboard.startedMissionsSub", "Missions opérationnelles en cours"),
      colorClass: "bg-purple-500",
      value: entonnoirData[1]?.value || 0,
    },
    {
      title: t("dashboard.completedTasks", "Tâches Terminées"),
      subtitle: t("dashboard.completedTasksSub", "Livrables validés et contrôlés"),
      colorClass: "bg-emerald-500",
      value: entonnoirData[2]?.value || 0,
    },
    {
      title: t("dashboard.closedDossiers", "Dossiers Clôturés"),
      subtitle: t("dashboard.closedDossiersSub", "Prestations finalisées et archivées"),
      colorClass: "bg-amber-500",
      value: entonnoirData[3]?.value || 0,
    },
  ];

  return (
    <div className="flex flex-col bg-white border border-[#E2E8F0] border-t-4 border-t-pink-500 rounded-xl py-5 px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-[var(--text-main)] m-0 mb-1 text-[1rem]">
            {t("dashboard.productionFunnel", "Entonnoir de Production (Période)")}
          </h3>
          <p className="m-0 text-[0.78rem] text-slate-500">
            {t(
              "dashboard.funnelSub",
              "Flux d'avancement des volumes du traitement client à la clôture"
            )}
          </p>
        </div>
        <select
          value={funnelView}
          onChange={(e) => onFunnelViewChange(e.target.value)}
          className="text-[var(--text-main)] cursor-pointer py-1.5 pl-3 pr-6 rounded-lg border-[1.5px] border-blue-500 bg-white text-[0.8rem] outline-none"
        >
          <option value="cumulee">{t("dashboard.cumulativeView", "Vue cumulée")}</option>
          <option value="mensuelle">{t("dashboard.detailedView", "Vue détaillée")}</option>
        </select>
      </div>

      {/* 4 Funnel Bars */}
      <div className="flex flex-col gap-4 flex-1">
        {stages.map((stage, i) => {
          const widthPct = stage.value > 0 ? Math.max(12, (stage.value / maxFunnelVolume) * 100) : 0;
          return (
            <div key={i}>
              <div className="font-bold text-[var(--text-main)] text-[0.85rem]">
                {stage.title}
              </div>
              <div className="text-[0.72rem] text-slate-500 mb-1.5">
                {stage.subtitle}
              </div>
              <div className="w-full relative flex items-center bg-slate-100 h-7 rounded-md overflow-hidden">
                <div
                  className={`${stage.colorClass} flex items-center justify-end text-white font-bold text-[0.82rem] h-full rounded-md transition-all duration-300 ease-in-out`}
                  style={{
                    width: `${widthPct}%`,
                    paddingRight: stage.value > 0 ? "10px" : "0px",
                  }}
                >
                  {stage.value > 0 && stage.value}
                </div>
                {stage.value === 0 && (
                  <span className="absolute font-bold left-3 text-slate-400 text-[0.82rem]">
                    0
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Axis scale */}
        <div className="flex justify-between px-1 text-[0.72rem] text-slate-400 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4 (Volume)</span>
        </div>
      </div>

      {/* Note de pilotage */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg py-2.5 px-4 mt-5 text-blue-600 text-[0.78rem]">
        <span className="font-bold">Note de pilotage :</span> Ratio de clôture équilibré •{" "}
        {dossiersCloturesVal} dossier{dossiersCloturesVal > 1 ? "s" : ""} finalisé{dossiersCloturesVal > 1 ? "s" : ""} sur la période sélectionnée.
      </div>
    </div>
  );
};

export default FunnelCard;
