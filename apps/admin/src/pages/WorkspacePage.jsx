import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DossiersPage from './DossiersPage';
import TasksPage from './TasksPage';
import TachesPage from './TachesPage';

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
      <div style={{display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '1.5rem'}}>
        {[
          { id: 'dossiers', label: 'Dossiers' },
          { id: 'missions', label: 'Missions' },
          { id: 'taches', label: 'Tâches' }
        ].map(t => (
          <button type="button" 
            key={t.id}
            onClick={() => setTab(t.id)} 
            style={{
              flex: 1,
              background: tab === t.id ? 'var(--primary)' : 'transparent', 
              color: tab === t.id ? '#FFF' : 'var(--text-muted)', 
              border: tab === t.id ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
              padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontSize: '1.05rem'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'dossiers' && <DossiersPage />}
        {tab === 'missions' && <TasksPage />}
        {tab === 'taches' && <TachesPage />}
      </div>
    </div>
  );
};

export default WorkspacePage;
