import React, { useMemo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import SpacePageLayout from "../components/SpacePageLayout";

// Code splitting / Lazy Loading des sous-pages pour alléger le bundle initial
const DossiersPage = lazy(() => import("./DossiersPage"));
const MissionsPage = lazy(() => import("./TasksPage")); // Mode "MISSION"
const TachesPage = lazy(() => import("./TachesPage"));   // Mode "TACHE"
const DocumentsPage = lazy(() => import("./DocumentsPage"));

const TabLoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center text-sm text-slate-500">
    <span className="animate-pulse">Chargement de l'espace...</span>
  </div>
);

const WorkspacePage = ({ userRole }) => {
  const { t } = useTranslation();
  const isCollaborateur = useMemo(
    () => userRole?.trim().toLowerCase() === "collaborateur",
    [userRole],
  );

  const tabs = useMemo(() => {
    const available = [];
    if (!isCollaborateur) {
      available.push(
        {
          id: "dossiers",
          label: t("workspace.tabs.dossiers", "Dossiers"),
          labelKey: "workspace.tabs.dossiers",
        },
        {
          id: "missions",
          label: t("workspace.tabs.missions", "Missions"),
          labelKey: "workspace.tabs.missions",
        },
      );
    }
    available.push(
      {
        id: "taches",
        label: t("workspace.tabs.taches", "Tâches"),
        labelKey: "workspace.tabs.taches",
      },
      {
        id: "documents",
        label: t("workspace.tabs.ged", "Documents (GED)"),
        labelKey: "workspace.tabs.ged",
      },
    );
    return available;
  }, [isCollaborateur, t]);

  const initialTab = isCollaborateur ? "taches" : "dossiers";

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case "dossiers":
        return !isCollaborateur ? <DossiersPage /> : null;
      case "missions":
        return !isCollaborateur ? <MissionsPage /> : null;
      case "taches":
        return <TachesPage />;
      case "documents":
        return <DocumentsPage />;
      default:
        return null;
    }
  };

  return (
    <SpacePageLayout initialTab={initialTab} tabs={tabs}>
      {(activeTabId) => (
        <Suspense fallback={<TabLoadingFallback />}>
          {renderTabContent(activeTabId)}
        </Suspense>
      )}
    </SpacePageLayout>
  );
};

export default WorkspacePage;
