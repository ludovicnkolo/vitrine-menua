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

  const isDetailed = funnelView === "mensuelle";

  const valDemandes = entonnoirData[0]?.value || 0;
  const valMissions = entonnoirData[1]?.value || 0;
  const valTaches = entonnoirData[2]?.value || 0;
  const valDossiers = entonnoirData[3]?.value || 0;

  const baseVolume = useMemo(() => {
    return valDemandes > 0 ? valDemandes : Math.max(valMissions, 1);
  }, [valDemandes, valMissions]);

  const globalConversionRate = useMemo(() => {
    if (baseVolume <= 0) return 0;
    return Math.round((valDossiers / baseVolume) * 100);
  }, [valDossiers, baseVolume]);

  const stages = useMemo(() => {
    const rateDemandes = valDemandes > 0 ? 100 : 0;
    const rateMissions = baseVolume > 0 ? Math.round((valMissions / baseVolume) * 100) : 0;
    const rateTaches = baseVolume > 0 ? Math.round((valTaches / baseVolume) * 100) : 0;
    const rateDossiers = baseVolume > 0 ? Math.round((valDossiers / baseVolume) * 100) : 0;

    return [
      {
        title: t("dashboard.processedMessages", "Messages Traités"),
        subtitle: isDetailed
          ? `Flux entrant qualifié (100% de la base d'entrée)`
          : t("dashboard.processedMessagesSub", "Demandes & formulaires qualifiés"),
        colorClass: "bg-blue-600",
        value: valDemandes,
        rate: rateDemandes,
      },
      {
        title: t("dashboard.startedMissions", "Missions Démarrées"),
        subtitle: isDetailed
          ? `${rateMissions}% de conversion des demandes en missions`
          : t("dashboard.startedMissionsSub", "Missions opérationnelles en cours"),
        colorClass: "bg-purple-500",
        value: valMissions,
        rate: rateMissions,
      },
      {
        title: t("dashboard.completedTasks", "Tâches Terminées"),
        subtitle: isDetailed
          ? `${rateTaches}% d'exécution par rapport au flux initial`
          : t("dashboard.completedTasksSub", "Livrables validés et contrôlés"),
        colorClass: "bg-emerald-500",
        value: valTaches,
        rate: rateTaches,
      },
      {
        title: t("dashboard.closedDossiers", "Dossiers Clôturés"),
        subtitle: isDetailed
          ? `${rateDossiers}% de concrétisation finale archivée`
          : t("dashboard.closedDossiersSub", "Prestations finalisées et archivées"),
        colorClass: "bg-amber-500",
        value: valDossiers,
        rate: rateDossiers,
      },
    ];
  }, [t, isDetailed, valDemandes, valMissions, valTaches, valDossiers, baseVolume]);

  // Dynamic axis ticks for cumulative volume view
  const volumeTicks = useMemo(() => {
    const max = Math.max(maxFunnelVolume, 4);
    return [
      0,
      Math.max(1, Math.round(max * 0.25)),
      Math.max(2, Math.round(max * 0.5)),
      Math.max(3, Math.round(max * 0.75)),
      `${max} (Volume)`,
    ];
  }, [maxFunnelVolume]);

  return (
    <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] border-t-4 border-t-pink-500 rounded-xl py-5 px-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 gap-3">
        <div>
          <h3 className="font-bold text-[var(--text-main)] m-0 mb-1 text-[1rem]">
            {t("dashboard.productionFunnel", "Entonnoir de Production (Période)")}
          </h3>
          <p className="m-0 text-[0.78rem] text-[var(--text-muted)]">
            {isDetailed
              ? "Taux de transformation et ratios d'avancement opérationnels"
              : t(
                  "dashboard.funnelSub",
                  "Flux d'avancement des volumes du traitement client à la clôture"
                )}
          </p>
        </div>
        <select
          value={funnelView}
          onChange={(e) => onFunnelViewChange(e.target.value)}
          className="text-[var(--text-main)] font-semibold cursor-pointer py-1.5 pl-3 pr-6 rounded-lg border-[1.5px] border-blue-500 bg-[var(--bg-main)] text-[0.8rem] outline-none shadow-sm hover:border-blue-600 transition-colors"
        >
          <option value="cumulee">
            {t("dashboard.cumulativeView", "Vue cumulée (Volumes)")}
          </option>
          <option value="mensuelle">
            {t("dashboard.detailedView", "Vue détaillée (Taux & Ratios)")}
          </option>
        </select>
      </div>

      {/* 4 Funnel Bars */}
      <div className="flex flex-col gap-4 flex-1">
        {stages.map((stage, i) => {
          const widthPct = isDetailed
            ? stage.value > 0 || stage.rate > 0
              ? Math.max(14, Math.min(100, stage.rate))
              : 0
            : stage.value > 0
            ? Math.max(12, (stage.value / maxFunnelVolume) * 100)
            : 0;

          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-[var(--text-main)] text-[0.85rem]">
                  {stage.title}
                </span>
                {isDetailed && (
                  <span className="text-[0.75rem] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    {stage.rate}% transf.
                  </span>
                )}
              </div>
              <div className="text-[0.72rem] text-[var(--text-muted)] mb-1.5">
                {stage.subtitle}
              </div>
              <div className="w-full relative flex items-center bg-slate-100 dark:bg-slate-800/80 h-7 rounded-md overflow-hidden">
                <div
                  className={`${stage.colorClass} flex items-center justify-end text-white font-bold text-[0.82rem] h-full rounded-md transition-all duration-300 ease-in-out`}
                  style={{
                    width: `${widthPct}%`,
                    paddingRight: (isDetailed ? stage.rate > 0 : stage.value > 0) ? "10px" : "0px",
                  }}
                >
                  {isDetailed
                    ? stage.value > 0
                      ? `${stage.value} (${stage.rate}%)`
                      : ""
                    : stage.value > 0
                    ? stage.value
                    : ""}
                </div>
                {((isDetailed && stage.rate === 0) || (!isDetailed && stage.value === 0)) && (
                  <span className="absolute font-bold left-3 text-slate-400 dark:text-slate-500 text-[0.82rem]">
                    {isDetailed ? "0% (0)" : "0"}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Axis scale */}
        <div className="flex justify-between px-1 text-[0.72rem] text-[var(--text-muted)] mt-1 font-medium">
          {isDetailed ? (
            <>
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100% (Taux de conversion)</span>
            </>
          ) : (
            volumeTicks.map((tick, idx) => <span key={idx}>{tick}</span>)
          )}
        </div>
      </div>

      {/* Efficacité de conversion (mode détaillé uniquement) */}
      {isDetailed && (
        <div
          className="border rounded-lg py-2.5 px-4 mt-5 text-[0.78rem] transition-colors bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
        >
          <div>
            <span className="font-bold">Efficacité de conversion : </span>
            {globalConversionRate}% de concrétisation globale de bout en bout (demande client →
            dossier clôturé).
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelCard;
