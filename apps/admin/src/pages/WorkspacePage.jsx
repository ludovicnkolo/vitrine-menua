import React from 'react';
import DossiersPage from './DossiersPage';
import TasksPage from './TasksPage';
import TachesPage from './TachesPage';
import SpacePageLayout from '../components/SpacePageLayout';

const WorkspacePage = () => (
    <SpacePageLayout
      initialTab="dossiers"
      tabs={[
        { id: 'dossiers', label: 'Dossiers' },
        { id: 'missions', label: 'Missions' },
        { id: 'taches', label: 'Tâches' }
      ]}
    >
      {(tab) => (
        <>
          {tab === 'dossiers' && <DossiersPage />}
          {tab === 'missions' && <TasksPage />}
          {tab === 'taches' && <TachesPage />}
        </>
      )}
    </SpacePageLayout>
);

export default WorkspacePage;
