import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TabsNavigation from './TabsNavigation';

const SpacePageLayout = ({ initialTab, tabs, children }) => {
  const [tab, setTab] = useState(initialTab);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tab) {
      setTab(location.state.tab);
    }
  }, [location]);

  return (
    <div style={{padding: '0 1rem'}}>
      <TabsNavigation 
        tabs={tabs} 
        activeTab={tab} 
        onTabChange={setTab} 
      />
      <div>
        {children(tab)}
      </div>
    </div>
  );
};

export default SpacePageLayout;
