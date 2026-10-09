import React from "react";
import { useTranslation } from "react-i18next";

const TabsNavigation = ({ tabs, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "inline-flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {tabs.map((tabItem) => {
        const translatedLabel = t(
          tabItem.labelKey || `tabs.${tabItem.id}`,
          { defaultValue: tabItem.label }
        );

        return (
          <button
            type="button"
            key={tabItem.id}
            onClick={() => onTabChange(tabItem.id)}
            style={{
              background: activeTab === tabItem.id ? "var(--primary)" : "var(--surface)",
              color: activeTab === tabItem.id ? "#FFF" : "var(--text-main)",
              border: activeTab === tabItem.id ? "1px solid var(--primary)" : "1px solid var(--border)",
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "42px",
              fontSize: "0.95rem",
              boxShadow:
                activeTab === tabItem.id
                  ? "0 2px 4px rgba(15, 23, 42, 0.15)"
                  : "none",
            }}
          >
            {translatedLabel}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
