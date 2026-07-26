import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DossiersPage from './DossiersPage';
import TasksPage from './TasksPage';
import TachesPage from './TachesPage';
import SpacePageLayout from '../components/SpacePageLayout';

const WorkspacePage = () => {
  return (
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
};

export default WorkspacePage;
