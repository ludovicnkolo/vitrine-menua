import React from 'react';
import DossiersPage from './DossiersPage';
import TasksPage from './TasksPage';
import TachesPage from './TachesPage';
import SpacePageLayout from '../components/SpacePageLayout';

const WorkspacePage = ({ userRole }) => {
  const isCollaborateur = userRole === 'Collaborateur';
  
  const tabs = [];
  if (!isCollaborateur) {
    tabs.push({ id: 'dossiers', label: 'Dossiers' });
    tabs.push({ id: 'missions', label: 'Missions' });
  }
  tabs.push({ id: 'taches', label: 'Tâches' });

  return (
    <SpacePageLayout
      initialTab={isCollaborateur ? 'taches' : 'dossiers'}
      tabs={tabs}
    >
      {(tab) => (
        <>
          {tab === 'dossiers' && !isCollaborateur && <DossiersPage />}
          {tab === 'missions' && !isCollaborateur && <TasksPage />}
          {tab === 'taches' && <TachesPage />}
        </>
      )}
    </SpacePageLayout>
  );
};

export default WorkspacePage;
