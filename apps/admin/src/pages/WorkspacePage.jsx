import React from "react";
import DossiersPage from "./DossiersPage";
import TasksPage from "./TasksPage";
import TachesPage from "./TachesPage";
import DocumentsPage from "./DocumentsPage";
import SpacePageLayout from "../components/SpacePageLayout";

const WorkspacePage = ({ userRole }) => {
  const isCollaborateur = userRole === "Collaborateur";

  const tabs = [];
  if (!isCollaborateur) {
    tabs.push({ id: "dossiers", label: "Dossiers" });
    tabs.push({ id: "missions", label: "Missions" });
  }
  tabs.push({ id: "taches", label: "Tâches" });
  tabs.push({ id: "documents", label: "Documents (GED)" });

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
