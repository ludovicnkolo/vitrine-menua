import React from 'react';
import { getStatusBadge, getPriorityBadge } from '../utils/helpers';

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tableau de bord</h1>
          <p style={{color: 'var(--text-muted)'}}>Vue d'ensemble de vos dossiers et tâches</p>
        </div>
        <button type="button" className="btn btn-primary">Nouveau Dossier</button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Dossiers à qualifier</h3>
          <p style={{fontSize: '2rem', fontWeight: 700}}>12</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Dossiers en cours</h3>
          <p style={{fontSize: '2rem', fontWeight: 700}}>34</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Urgences (Retards potentiels)</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--danger)'}}>5</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Validés cette semaine</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--success)'}}>18</p>
        </div>
      </div>

      <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>Dossiers Récents</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Type de besoin</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[].slice(0, 4).map(d => (
              <tr key={d.id}>
                <td><div className="truncate-text" style={{fontWeight: 500}}>{d.id}</div></td>
                <td><div className="truncate-text">{d.client}</div></td>
                <td><div className="truncate-text">{d.type}</div></td>
                <td><div className="truncate-text">{getStatusBadge(d.status)}</div></td>
                <td><div className="truncate-text">{getPriorityBadge(d.priority)}</div></td>
                <td><div className="truncate-text" style={{color: 'var(--text-muted)'}}>{d.date}</div></td>
                <td>
                  <button type="button" className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Consulter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage;