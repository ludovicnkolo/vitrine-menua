import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    'NOUVEAU': { text: 'Nouveau', class: 'badge-new' },
    'TO_ASSIGN': { text: 'À attribuer', class: 'badge-warning' },
    'IN_PROGRESS': { text: 'En cours', class: 'badge-progress' },
    'WAITING_DOCS': { text: 'Attente Docs', class: 'badge-warning' },
    'IN_REVIEW': { text: 'En contrôle', class: 'badge-new' },
    'VALIDATED': { text: 'Validé', class: 'badge-success' },
    'OUVERT': { text: 'Ouvert', class: 'badge-progress' },
    'FERME': { text: 'Fermé', class: 'badge-success' },
    'ARCHIVE': { text: 'Archivé', class: 'badge-warning' }
  }
  const s = map[status] || { text: status, class: 'badge-new' }
  return <span className={`badge ${s.class}`}>{s.text}</span>
}

function getPriorityBadge(priority) {
  const map = {
    'URGENT': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', fontWeight: 600}}><AlertCircle size={14} /> Urgent</span>,
    'NORMAL': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 600}}><CheckCircle size={14} /> Normal</span>,
    'LOW': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: 600}}><Clock size={14} /> Faible</span>
  }
  return map[priority] || priority
}

function getRoleBadge(role) {
  const map = {
    'ADMIN': { text: 'Administrateur', bg: '#4C1D95', color: '#FFF' },
    'ASSOCIÉ': { text: 'Associé (Équipe)', bg: '#319795', color: '#FFF' }
  }
  const s = map[role] || { text: role, bg: '#718096', color: '#FFF' }
  return <span className="badge" style={{backgroundColor: s.bg, color: s.color}}>{s.text}</span>
}

function getMessageStatusBadge(status) {
  const map = {
    'NOUVEAU': { text: 'Nouveau', bg: '#E53E3E', color: '#FFF' },
    'ATTRIBUE': { text: 'Attribué', bg: '#DD6B20', color: '#FFF' },
    'INITIE': { text: 'Initié', bg: '#3182CE', color: '#FFF' },
    'CONTROLE': { text: 'Contrôlé', bg: '#805AD5', color: '#FFF' },
    'A_CORRIGER': { text: 'À corriger', bg: '#E53E3E', color: '#FFF' },
    'REATTRIBUE': { text: 'Réattribué', bg: '#DD6B20', color: '#FFF' },
    'TERMINE': { text: 'Terminé', bg: '#38A169', color: '#FFF' },
    'ARCHIVE': { text: 'Archivé', bg: '#718096', color: '#FFF' }
  }
  const s = map[status] || { text: status, bg: '#718096', color: '#FFF' }
  return <span className="badge" style={{backgroundColor: s.bg, color: s.color}}>{s.text}</span>
}

export { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge };