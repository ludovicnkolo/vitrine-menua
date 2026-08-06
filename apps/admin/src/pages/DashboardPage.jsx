import React, { useState, useEffect } from 'react';
import { getSafeApiUrl } from '../utils/helpers';
import { Briefcase, FileText, CheckSquare, Users, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area } from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('adminToken');
        const res = await fetch(getSafeApiUrl('/api/crm/dashboard-stats'), {
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
    fetchStats();
  }, []);

  const renderStatGroup = (title, icon, statsMap) => (
    <div className="card" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--primary)'}}>
      <h2 style={{fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', margin: 0, marginBottom: '0.5rem'}}>
        {icon}
        {title}
      </h2>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem'}}>
        {statsMap.map((stat, idx) => (
          <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem'}}>
            <span style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{stat.label}</span>
            <span style={{fontWeight: 700, fontSize: '1.1rem', color: stat.color || 'var(--text-main)'}}>{stat.value || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tableau de bord</h1>
          <p style={{color: 'var(--text-muted)'}}>Vue d'ensemble de vos dossiers et tâches</p>
        </div>
      </div>

      {loading ? (
        <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>Chargement des statistiques...</div>
      ) : stats ? (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '2rem'}}>
          
          {renderStatGroup('Dossiers', <Briefcase size={22} color="var(--primary)" />, [
            { label: 'Total', value: stats.dossier.total },
            { label: 'Ouverts', value: stats.dossier.ouvert, color: 'var(--warning)' },
            { label: 'Fermés', value: stats.dossier.fermer, color: '#64748B' },
            { label: 'Terminés', value: stats.dossier.terminer, color: 'var(--success)' },
            { label: 'Archivés', value: stats.dossier.archiver, color: '#94A3B8' }
          ])}

          {renderStatGroup('Missions', <FileText size={22} color="var(--primary)" />, [
            { label: 'Total', value: stats.mission.total },
            { label: 'Ouvertes', value: stats.mission.ouvert, color: 'var(--warning)' },
            { label: 'Terminées', value: stats.mission.terminer, color: 'var(--success)' },
            { label: 'Fermées', value: stats.mission.fermer, color: '#64748B' },
            { label: 'Réattribuées', value: stats.mission.reatribuer, color: '#8B5CF6' },
            { label: 'Bloquées', value: stats.mission.bloquer, color: 'var(--danger)' }
          ])}

          {renderStatGroup('Tâches', <CheckSquare size={22} color="var(--primary)" />, [
            { label: 'En cours', value: stats.taches.encours, color: 'var(--warning)' },
            { label: 'Terminées', value: stats.taches.terminuer, color: 'var(--success)' },
            { label: 'À contrôler', value: stats.taches.controler, color: '#3B82F6' },
            { label: 'Réattribuées', value: stats.taches.reattribuer, color: '#8B5CF6' },
            { label: 'Bloquées', value: stats.taches.bloquer, color: 'var(--danger)' },
            { label: 'En retard', value: stats.taches.enRetard, color: '#B91C1C' }
          ])}

          {renderStatGroup('Utilisateurs', <Users size={22} color="var(--primary)" />, [
            { label: 'Collaborateurs', value: stats.utilisateur.collaborateurs },
            { label: 'Clients', value: stats.utilisateur.client },
            { label: 'Actifs', value: stats.utilisateur.actifs, color: 'var(--success)' },
            { label: 'Inactifs', value: stats.utilisateur.inactifs, color: '#94A3B8' }
          ])}

          {renderStatGroup('Messages', <MessageSquare size={22} color="var(--primary)" />, [
            { label: 'Contact', value: stats.message.contact },
            { label: 'Recrutement', value: stats.message.recrutemenet },
            { label: 'Interne', value: stats.message.interne },
            { label: 'Personnel', value: stats.message.personnel }
          ])}
          
        </div>
      ) : (
        <div style={{padding: '2rem', textAlign: 'center', color: 'var(--danger)'}}>Erreur de chargement.</div>
      )}

      {/* --- SECTION DES GRAPHIQUES --- */}
      {stats && stats.charts && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', paddingBottom: '2rem'}}>
          
          {/* Ligne 1 : Évolution (Pleine largeur) */}
          <div className="card" style={{padding: '1.5rem', borderTop: '4px solid #3B82F6'}}>
            <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)'}}>
              Évolution de la charge de travail (12 derniers mois)
            </h3>
            <div style={{width: '100%', height: 300}}>
              <ResponsiveContainer>
                <LineChart data={stats.charts.evolution} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                  <Legend />
                  <Line type="monotone" dataKey="crees" name="Créés (Tâches/Missions)" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="termines" name="Terminés" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
            {/* Ligne 2 : Performance par collaborateur (Barres empilées) */}
            <div className="card" style={{padding: '1.5rem', borderTop: '4px solid #8B5CF6'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)'}}>
                Performance et goulots par collaborateur
              </h3>
              <div style={{width: '100%', height: 300}}>
                <ResponsiveContainer>
                  <BarChart data={stats.charts.performance} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                    <Legend />
                    <Bar dataKey="terminees" name="Terminées" stackId="a" fill="#10B981" />
                    <Bar dataKey="encours" name="En cours" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="enretard" name="En retard" stackId="a" fill="#EF4444" />
                    <Bar dataKey="bloquees" name="Bloquées" stackId="a" fill="#1F2937" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ligne 2 : Répartition et Entonnoir (Deux graphiques côte à côte si écran large) */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'}}>
              
              {/* Donut : Répartition Dossiers */}
              <div className="card" style={{padding: '1.5rem', borderTop: '4px solid #F59E0B'}}>
                <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)'}}>
                  Dossiers par catégorie
                </h3>
                <div style={{width: '100%', height: 250, display: 'flex', justifyContent: 'center'}}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={stats.charts.repartition}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {stats.charts.repartition.map((entry, index) => {
                          const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6'];
                          return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                        })}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Funnel simulé (ComposedChart / BarChart) pour les Messages */}
              <div className="card" style={{padding: '1.5rem', borderTop: '4px solid #EC4899'}}>
                <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)'}}>
                  Entonnoir de messages
                </h3>
                <div style={{width: '100%', height: 250}}>
                  <ResponsiveContainer>
                    <ComposedChart layout="vertical" data={stats.charts.funnel} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} hide />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={90} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="value" name="Nombre" fill="#EC4899" barSize={30} radius={[0, 4, 4, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;