import React from 'react';

const TabsNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '1.5rem'}}>
      {tabs.map(t => (
        <button 
          type="button" 
          key={t.id}
          onClick={() => onTabChange(t.id)} 
          style={{
            flex: 1,
            background: activeTab === t.id ? 'var(--primary)' : 'transparent', 
            color: activeTab === t.id ? '#FFF' : 'var(--text-muted)', 
            border: activeTab === t.id ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
            padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontSize: '1.05rem',
            textTransform: 'capitalize'
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
