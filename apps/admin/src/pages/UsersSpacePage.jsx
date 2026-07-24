import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';

const UsersSpacePage = () => {
  const [tab, setTab] = useState('equipe');
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
          { id: 'equipe', label: 'Équipe' },
          { id: 'client', label: 'Client' },
          { id: 'role', label: 'Rôle' }
        ].map(t => (
          <button 
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
        {tab === 'equipe' && <UsersPage forceTab="interne" />}
        {tab === 'role' && <RolesPage />}
        {tab === 'client' && <UsersPage forceTab="externe" />}
      </div>
    </div>
  );
};

export default UsersSpacePage;
