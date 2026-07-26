import React, { useState, useEffect } from 'react';
import { Shield, Clock, Search, AlertCircle, FileText, User } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setRawError] = useState(null);
  const setError = (msg) => {
    setRawError(msg);
    if (msg) setTimeout(() => setRawError(null), 3000);
  };
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(getSafeApiUrl(`/api/crm/audit`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur de récupération de l'audit");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('ajout')) return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
    if (act.includes('update') || act.includes('modif')) return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
    if (act.includes('delete') || act.includes('suppr')) return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
    if (act.includes('login') || act.includes('connexion')) return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
    return { bg: 'var(--bg-card)', color: 'var(--text-main)' };
  };

  const filteredLogs = logs.filter(log => 
    (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.details || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.5rem 0'}}>Journal d'Audit</h1>
          <p style={{color: 'var(--text-muted)', margin: 0}}>Traçabilité de toutes les actions effectuées sur la plateforme.</p>
        </div>
        <div style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.75rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500}}>
          <Shield size={20} />
          Système Sécurisé
        </div>
      </div>

      <div className="card" style={{padding: '1.5rem', marginBottom: '2rem'}}>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div style={{position: 'relative', flex: 1}}>
            <Search size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}} />
            <input 
              type="text" 
              placeholder="Rechercher une action, un utilisateur, un détail..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC'}}
            />
          </div>
          <button type="button" onClick={fetchLogs} className="btn btn-primary" style={{padding: '0.75rem 1.5rem'}}>
            Rafraîchir
          </button>
        </div>
      </div>

      {error && (
        <div style={{padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>Chargement du journal d'audit...</div>
      ) : (
        <div className="card" style={{overflow: 'hidden', padding: 0}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: 'var(--bg-card)', borderBottom: '1px solid var(--border)'}}>
                  <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Horodatage</th>
                  <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Utilisateur</th>
                  <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Action</th>
                  <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Cible / Détails</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>Aucun enregistrement trouvé.</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => {
                    const colors = getActionColor(log.action);
                    return (
                      <tr key={log.id} style={{borderBottom: '1px solid var(--border)', transition: 'background 0.2s'}}>
                        <td style={{padding: '1rem 1.5rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                            <Clock size={14} />
                            {new Date(log.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                          </div>
                        </td>
                        <td style={{padding: '1rem 1.5rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                            <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}>
                              <User size={14} />
                            </div>
                            <div>
                              <div style={{fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem'}}>{log.user?.name || 'Système'}</div>
                              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{log.user?.role?.name || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding: '1rem 1.5rem'}}>
                          <span style={{
                            background: colors.bg,
                            color: colors.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{padding: '1rem 1.5rem'}}>
                          {log.targetType && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                              <FileText size={14} color="var(--text-muted)" />
                              <span style={{fontSize: '0.875rem', fontWeight: 500}}>{log.targetType} {log.targetId ? `(#${log.targetId.split('-')[0].toUpperCase()})` : ''}</span>
                            </div>
                          )}
                          <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                            {log.details || '-'}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
