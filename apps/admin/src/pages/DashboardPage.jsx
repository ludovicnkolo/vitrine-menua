import React, { useState, useEffect } from 'react';
import { getSafeApiUrl } from '../utils/helpers';
import { AlertTriangle, Clock, Flame, ShieldAlert, CheckCircle, FileText, Activity, Inbox, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Cell } from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Les dates confirmées (ne changent que quand on clique "Appliquer")
  const [appliedDates, setAppliedDates] = useState({ start: '', end: '' });

  const fetchStats = async (start, end) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);
      
      const res = await fetch(getSafeApiUrl(`/api/crm/dashboard-stats?${params.toString()}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      if (window.customAlert) window.customAlert("Veuillez sélectionner une date de début et une date de fin.");
      else alert("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      if (window.customAlert) window.customAlert("La date de fin doit être strictement supérieure à la date de début.");
      else alert("La date de fin doit être strictement supérieure à la date de début.");
      return;
    }
    setAppliedDates({ start: startDate, end: endDate });
    fetchStats(startDate, endDate);
  };


  // Chargement initial uniquement (sans les dates)
  useEffect(() => {
    fetchStats('', '');
  }, []);

  const renderKPI = (title, value, subtitle, icon, colorHex) => (
    <div className="card" style={{ padding: '1rem', borderTop: `4px solid ${colorHex}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value || 0}</span>
        </div>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>
      <div style={{ padding: '0.6rem', background: `${colorHex}15`, borderRadius: '8px', color: colorHex }}>
        {icon}
      </div>
    </div>
  );

  const getMinEndDate = () => {
    if (!startDate) return undefined;
    const date = new Date(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tour de Contrôle</h1>
          <p style={{color: 'var(--text-muted)'}}>Vue d'ensemble stratégique et opérationnelle</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FFF', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Du</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => {
                setStartDate(e.target.value);
                if (endDate && new Date(endDate) <= new Date(e.target.value)) {
                  setEndDate('');
                }
              }}
              style={{ border: '1px solid var(--border)', background: '#F8FAFC', borderRadius: '6px', padding: '0.35rem 0.5rem', outline: 'none', fontSize: '0.875rem', color: 'var(--text-main)' }}
            />
          </div>
          <span style={{ color: 'var(--border)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Au</span>
            <input 
              type="date" 
              value={endDate} 
              min={getMinEndDate()}
              onChange={e => setEndDate(e.target.value)}
              style={{ border: '1px solid var(--border)', background: '#F8FAFC', borderRadius: '6px', padding: '0.35rem 0.5rem', outline: 'none', fontSize: '0.875rem', color: 'var(--text-main)' }}
            />
          </div>
          <button
            onClick={handleApplyFilter}
            disabled={loading}
            style={{
              padding: '0.35rem 1rem',
              background: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? '⏳' : '🔍'} Appliquer
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>Chargement des indicateurs...</div>
      ) : stats ? (
        <>
          {/* LIGNE 1 : KPIs STRATEGIQUES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {renderKPI(
              "Alertes Prioritaires", 
              stats.alertesPrioritaires, 
              "Messages clients urgents", 
              <AlertTriangle size={20} />, 
              "#EF4444" // Red
            )}
            {renderKPI(
              "Délais Critiques", 
              stats.delaisCritiques, 
              "Échéances à - de 24h", 
              <Flame size={20} />, 
              "#F97316" // Orange
            )}
            {renderKPI(
              "Opérations Bloquées", 
              stats.operationsBloquees, 
              "Attente retour client", 
              <ShieldAlert size={20} />, 
              "#8B5CF6" // Purple
            )}
            <div className="card" style={{ padding: '1rem', borderTop: `4px solid #3B82F6`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Volume Total
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  <div>Dossiers : <span style={{fontWeight: 700}}>{stats.totalDossiers || 0}</span></div>
                  <div>Missions : <span style={{fontWeight: 700}}>{stats.totalMissions || 0}</span></div>
                  <div>Tâches : <span style={{fontWeight: 700}}>{stats.totalTaches || 0}</span></div>
                </div>
              </div>
              <div style={{ padding: '0.6rem', background: `#3B82F615`, borderRadius: '8px', color: '#3B82F6' }}>
                <CheckCircle size={20} />
              </div>
            </div>
            {renderKPI(
              "Nouveaux Dépôts", 
              stats.nouveauxDepots, 
              "Documents sur les 24h", 
              <Inbox size={20} />, 
              "#10B981" // Green
            )}
          </div>

          {/* LIGNE 2 : GRAPHIQUES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            
            {/* METEO DE CHARGE */}
            <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #6366F1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Activity color="#6366F1" size={24} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Météo de Charge (En cours)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.meteoCharge && stats.meteoCharge.length > 0 ? stats.meteoCharge.map((user, idx) => {
                  let color = '#10B981'; // VERT
                  if (user.etat === 'ROUGE') color = '#EF4444';
                  if (user.etat === 'ORANGE') color = '#F59E0B';
                  
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${color}` }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{user.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: color }}>{user.tachesEnCours}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>tâche(s)</span>
                      </div>
                    </div>
                  );
                }) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Aucun collaborateur actif trouvé.</p>
                )}
              </div>
            </div>

            {/* ENTONNOIR DE PRODUCTION */}
            <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #EC4899' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <TrendingUp color="#EC4899" size={24} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Entonnoir de Production (Période)</h3>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <ComposedChart layout="vertical" data={stats.entonnoirPeriode} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={140} fontWeight={500} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" name="Volume" barSize={40} radius={[0, 4, 4, 0]}>
                      {stats.entonnoirPeriode && stats.entonnoirPeriode.map((entry, index) => {
                        const colors = ['#93C5FD', '#60A5FA', '#3B82F6', '#1D4ED8']; // Gradient effect for funnel
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div style={{padding: '2rem', textAlign: 'center', color: 'var(--danger)'}}>Erreur de chargement.</div>
      )}
    </div>
  );
};

export default DashboardPage;