import React, { useState, useEffect } from 'react';
import { getSafeApiUrl } from '../utils/helpers';
import { Briefcase, FileText, CheckSquare, Users, MessageSquare } from 'lucide-react';

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
    </div>
  );
};

export default DashboardPage;