import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import TabsNavigation from '../components/TabsNavigation';

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
      <TabsNavigation 
        tabs={[
          { id: 'equipe', label: 'Équipe' },
          { id: 'client', label: 'Client' },
          { id: 'role', label: 'Rôle' }
        ]} 
        activeTab={tab} 
        onTabChange={setTab} 
      />

      <div>
        {tab === 'equipe' && <UsersPage forceTab="interne" />}
        {tab === 'role' && <RolesPage />}
        {tab === 'client' && <UsersPage forceTab="externe" />}
      </div>
    </div>
  );
};

export default UsersSpacePage;
