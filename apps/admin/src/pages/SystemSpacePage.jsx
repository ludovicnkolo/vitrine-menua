import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuditPage from './AuditPage';

const SystemSpacePage = () => {
  const [tab, setTab] = useState('audit');
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'light');
  const [lang, setLang] = useState(localStorage.getItem('adminLang') || 'fr');

  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab);
    }
  }, [location]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('adminLang', newLang);
    // Reload to apply
    window.location.reload();
  };

  return (
    <div style={{padding: '0 1rem'}}>
      <div style={{display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '1.5rem'}}>
        {[
          { id: 'audit', label: 'Audit' },
          { id: 'configuration', label: 'Configuration' }
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
        {tab === 'audit' && <AuditPage />}
        {tab === 'configuration' && (
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem'}}>Configuration</h1>
            
            <div className="card" style={{maxWidth: '600px', marginBottom: '2rem'}}>
              <h3 style={{marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)'}}>Apparence</h3>
              <div style={{display: 'flex', gap: '1rem'}}>
                <button type="button"
                  onClick={() => handleThemeChange('light')}
                  style={{flex: 1, padding: '1rem', border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'center'}}
                >
                  <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>☀️</div>
                  Mode Clair
                </button>
                <button type="button"
                  onClick={() => handleThemeChange('dark')}
                  style={{flex: 1, padding: '1rem', border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'center'}}
                >
                  <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>🌙</div>
                  Mode Sombre
                </button>
              </div>
            </div>

            <div className="card" style={{maxWidth: '600px'}}>
              <h3 style={{marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)'}}>Langue / Language</h3>
              <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>Sélectionnez la langue de l'interface d'administration. (La traduction intégrale est en cours d'intégration)</p>
              <select 
                value={lang} 
                onChange={(e) => handleLangChange(e.target.value)}
                style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem'}}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSpacePage;
