import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TabsNavigation from "./TabsNavigation";

const SpacePageLayout = ({ initialTab, tabs, children }) => {
  const location = useLocation();
  const storageKey = `active_tab_${location.pathname}`;

  const [tab, setTab] = useState(() => {
    if (location.state && location.state.tab) return location.state.tab;
    const saved = sessionStorage.getItem(storageKey);
    if (saved && tabs.some((t) => t.id === saved)) return saved;
    return initialTab;
  });

  useEffect(() => {
    if (location.state && location.state.tab) {
      setTab(location.state.tab);
      sessionStorage.setItem(storageKey, location.state.tab);
    }
  }, [location, storageKey]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    sessionStorage.setItem(storageKey, newTab);
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      <TabsNavigation tabs={tabs} activeTab={tab} onTabChange={handleTabChange} />
      <div>{children(tab)}</div>
    </div>
  );
};

export default SpacePageLayout;
