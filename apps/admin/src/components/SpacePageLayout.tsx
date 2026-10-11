import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TabsNavigation, { TabItem } from "./TabsNavigation";

export interface SpacePageLayoutProps {
  initialTab: string;
  tabs: TabItem[];
  children: (activeTab: string) => React.ReactNode;
}

const SpacePageLayout: React.FC<SpacePageLayoutProps> = ({ initialTab, tabs, children }) => {
  const location = useLocation();
  const storageKey = `active_tab_${location.pathname}`;

  const [tab, setTab] = useState<string>(() => {
    const state = location.state as { tab?: string } | null;
    if (state && state.tab) return state.tab;
    const saved = sessionStorage.getItem(storageKey);
    if (saved && tabs.some((t) => t.id === saved)) return saved;
    return initialTab;
  });

  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state && state.tab) {
      setTab(state.tab);
      sessionStorage.setItem(storageKey, state.tab);
    }
  }, [location, storageKey]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    sessionStorage.setItem(storageKey, newTab);
  };

  return (
    <div className="px-4">
      <TabsNavigation tabs={tabs} activeTab={tab} onTabChange={handleTabChange} />
      <div>{children(tab)}</div>
    </div>
  );
};

export default SpacePageLayout;
