import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DossiersPage from './DossiersPage';
import TasksPage from './TasksPage';
import TachesPage from './TachesPage';
import TabsNavigation from '../components/TabsNavigation';

const WorkspacePage = () => {
  const [tab, setTab] = useState('dossiers');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tab) {
      setTab(location.state.tab);
    }
  }, [location]);

  return (
    <div style={{padding: '0 1rem'}}>
      <TabsNavigation 
        tabs={[
          { id: 'dossiers', label: 'Dossiers' },
          { id: 'missions', label: 'Missions' },
          { id: 'taches', label: 'Tâches' }
        ]} 
        activeTab={tab} 
        onTabChange={setTab} 
      />

      <div>
        {tab === 'dossiers' && <DossiersPage />}
        {tab === 'missions' && <TasksPage />}
        {tab === 'taches' && <TachesPage />}
      </div>
    </div>
  );
};

export default WorkspacePage;
