import React from "react";

const TabsNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {tabs.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => onTabChange(t.id)}
          style={{
            background: activeTab === t.id ? "#0F172A" : "#FFF",
            color: activeTab === t.id ? "#FFF" : "#334155",
            border:
              activeTab === t.id
                ? "1px solid #0F172A"
                : "1px solid #E2E8F0",
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
            boxShadow: activeTab === t.id ? "0 2px 4px rgba(15, 23, 42, 0.15)" : "none",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
