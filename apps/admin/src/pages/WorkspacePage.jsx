import React from "react";
import { useTranslation } from "react-i18next";
import DossiersPage from "./DossiersPage";
import TasksPage from "./TasksPage";
import TachesPage from "./TachesPage";
import DocumentsPage from "./DocumentsPage";
import SpacePageLayout from "../components/SpacePageLayout";

const WorkspacePage = ({ userRole }) => {
  const { t } = useTranslation();
  const isCollaborateur = userRole === "Collaborateur";

  const tabs = [];
  if (!isCollaborateur) {
    tabs.push({ id: "dossiers", label: t("workspace.tabs.dossiers", "Dossiers"), labelKey: "workspace.tabs.dossiers" });
    tabs.push({ id: "missions", label: t("workspace.tabs.missions", "Missions"), labelKey: "workspace.tabs.missions" });
  }
  tabs.push({ id: "taches", label: t("workspace.tabs.taches", "Tâches"), labelKey: "workspace.tabs.taches" });
  tabs.push({ id: "documents", label: t("workspace.tabs.ged", "Documents (GED)"), labelKey: "workspace.tabs.ged" });

  return (
    <SpacePageLayout
      initialTab={isCollaborateur ? "taches" : "dossiers"}
      tabs={tabs}
    >
      {(tab) => (
        <>
          {tab === "dossiers" && !isCollaborateur && <DossiersPage />}
          {tab === "missions" && !isCollaborateur && <TasksPage />}
          {tab === "taches" && <TachesPage />}
          {tab === "documents" && <DocumentsPage />}
        </>
      )}
    </SpacePageLayout>
  );
};

export default WorkspacePage;
