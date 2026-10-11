import React from "react";
import { useTranslation } from "react-i18next";

export interface TabItem {
  id: string;
  label: string;
  labelKey?: string;
}

export interface TabsNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="inline-flex gap-2 mb-6">
      {tabs.map((tabItem) => {
        const translatedLabel = t(
          tabItem.labelKey || `tabs.${tabItem.id}`,
          { defaultValue: tabItem.label }
        );

        const isActive = activeTab === tabItem.id;

        return (
          <button
            type="button"
            key={tabItem.id}
            onClick={() => onTabChange(tabItem.id)}
            className={`
              inline-flex items-center justify-center h-[42px] px-6 py-2 
              rounded-lg text-[0.95rem] font-semibold cursor-pointer 
              transition-all duration-200
              ${isActive 
                ? "bg-[var(--primary)] text-white border border-[var(--primary)] shadow-[0_2px_4px_rgba(15,23,42,0.15)]" 
                : "bg-[var(--surface)] text-[var(--text-main)] border border-[var(--border)] shadow-none"
              }
            `}
          >
            {translatedLabel}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
