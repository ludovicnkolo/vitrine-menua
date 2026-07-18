import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Files, 
  Users, 
  Settings,
  Bell,
  Search,
  LogOut,
  Briefcase,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare,
  Pencil,
  Eye,
  Trash,
  X,
  Shield
} from 'lucide-react'

// --- MOCK DATA (Données fictives) ---
const MOCK_USER = {
  id: 'U-001',
  name: 'Marie Claire',
  role: 'ADMIN', // ADMIN, SUPERVISOR, COLLABORATOR, PRESTATAIRE, READ_ONLY
  email: 'm.claire@menua.fr'
}

const mockUsers = [
  { id: 'U-001', name: 'Marie Claire', role: 'ADMIN', email: 'm.claire@menua.fr', status: 'Actif', lastLogin: 'Il y a 2 min' },
  { id: 'U-002', name: 'Jean Dupont', role: 'SUPERVISOR', email: 'j.dupont@menua.fr', status: 'Actif', lastLogin: 'Il y a 1 heure' },
  { id: 'U-003', name: 'Alice Martin', role: 'COLLABORATOR', email: 'a.martin@menua.fr', status: 'Actif', lastLogin: 'Il y a 3 heures' },
  { id: 'U-004', name: 'Cabinet Légal Pro', role: 'PRESTATAIRE', email: 'contact@legalpro.fr', status: 'Actif', lastLogin: 'Hier' },
  { id: 'U-005', name: 'Sophie Bernard', role: 'COLLABORATOR', email: 's.bernard@menua.fr', status: 'Inactif', lastLogin: 'Il y a 10 jours' },
]

const mockRoles = [
  { id: 'R-001', name: 'ADMIN', users: 1, permissions: 'Accès total, Configuration', status: 'Actif' },
  { id: 'R-002', name: 'SUPERVISOR', users: 1, permissions: 'Gestion des dossiers, Assignations', status: 'Actif' },
  { id: 'R-003', name: 'COLLABORATOR', users: 2, permissions: 'Traitement des dossiers, Messages', status: 'Actif' },
  { id: 'R-004', name: 'PRESTATAIRE', users: 1, permissions: 'Accès dossiers assignés', status: 'Actif' },
  { id: 'R-005', name: 'READ_ONLY', users: 0, permissions: 'Consultation uniquement', status: 'Inactif' },
]


const mockDossiers = [
  { id: 'DOS-24-001', client: 'Société Générale', contact: 'Marc Tremblay', type: 'Conformité KYC', status: 'NEW', priority: 'URGENT', date: '2026-07-10', documents: 2 },
  { id: 'DOS-24-002', client: 'LVMH Group', contact: 'Sarah Connors', type: 'Audit Financier', status: 'IN_PROGRESS', priority: 'NORMAL', date: '2026-07-09', documents: 5 },
  { id: 'DOS-24-003', client: 'Airbus SE', contact: 'Jean-Luc Picard', type: 'Conseil Stratégique', status: 'WAITING_DOCS', priority: 'LOW', date: '2026-07-08', documents: 1 },
  { id: 'DOS-24-004', client: 'Danone', contact: 'Élodie Roy', type: 'Restructuration', status: 'TO_ASSIGN', priority: 'URGENT', date: '2026-07-07', documents: 8 },
  { id: 'DOS-24-005', client: 'TotalEnergies', contact: 'Paul Dubois', type: 'Analyse des risques', status: 'VALIDATED', priority: 'NORMAL', date: '2026-07-05', documents: 12 },
  { id: 'DOS-24-006', client: 'L\'Oréal', contact: 'Claire Fontaine', type: 'Due Diligence', status: 'IN_REVIEW', priority: 'NORMAL', date: '2026-07-01', documents: 3 },
]

const mockTasks = [
  { id: 'TSK-101', dossierId: 'DOS-24-002', name: 'Analyse des bilans 2025', assignedTo: 'Alice Martin', status: 'IN_PROGRESS', deadline: '2026-07-15', type: 'INTERNAL' },
  { id: 'TSK-102', dossierId: 'DOS-24-004', name: 'Revue contractuelle', assignedTo: 'Cabinet Légal Pro', status: 'TO_ASSIGN', deadline: '2026-07-12', type: 'MISSION' },
  { id: 'TSK-103', dossierId: 'DOS-24-006', name: 'Vérification des bénéficiaires', assignedTo: 'Alice Martin', status: 'IN_REVIEW', deadline: '2026-07-11', type: 'INTERNAL' },
  { id: 'TSK-104', dossierId: 'DOS-24-001', name: 'Urgence KYC Profil A', assignedTo: 'Jean Dupont', status: 'IN_PROGRESS', deadline: '2026-07-10', type: 'INTERNAL' },
]

const mockInbox = [
  { id: 'MSG-001', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Nouveau besoin de conseil', date: 'Aujourd\'hui 10:30', status: 'NOUVEAU', isAnonyme: false, client: 'ACME Corp' },
  { id: 'MSG-002', from: 'unknown@gmail.com', name: 'Paul Inconnu', subject: 'Candidature Spontanée', date: 'Hier 15:45', status: 'ATTRIBUE', isAnonyme: true, assignedTo: 'Alice Martin' },
  { id: 'MSG-003', from: 'rh@totalenergies.fr', name: 'TotalEnergies RH', subject: 'Modification audit', date: 'Hier 09:12', status: 'INITIE', isAnonyme: false, client: 'TotalEnergies', dossierId: 'DOS-24-005' },
  { id: 'MSG-004', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Bilan comptable', date: 'Il y a 2 jours', status: 'CONTROLE', isAnonyme: false, client: 'ACME Corp' },
  { id: 'MSG-005', from: 'legal@acme.com', name: 'ACME Corp', subject: 'Contrat', date: 'Il y a 3 jours', status: 'A_CORRIGER', isAnonyme: false, client: 'ACME Corp' },
]

const mockContactInbox = [
  { id: 'C-001', name: 'ACME Corp', email: 'contact@acme.com', phone: '+33 1 23 45 67 89', type: 'Société', degree: 'Chaud', need: 'Accompagnement fiscal', date: 'Aujourd\'hui 10:30', message: "Bonjour,\n\nNous souhaitons être accompagnés pour notre prochaine déclaration fiscale.\n\nCordialement,\nDirection", attachment: 'bilan_2025.pdf' },
  { id: 'C-002', name: 'Paul Dupont', email: 'paul.d@gmail.com', phone: '+33 6 12 34 56 78', type: 'Particulier', degree: 'Tiède', need: 'Création d\'entreprise', date: 'Hier 15:45', message: "Bonjour,\n\nJe souhaite créer une SASU et j'aimerais connaître vos tarifs et l'accompagnement proposé." }
];

const mockRecrutementInbox = [
  { id: 'R-001', name: 'Sophie Martin', email: 'sophie.m@yahoo.fr', phone: '+33 6 98 76 54 32', type: 'Candidat', skills: 'Expert Comptable', languages: 'Français, Anglais', date: '11:15', message: "Madame, Monsieur,\n\nJe suis très motivée pour rejoindre votre cabinet en tant qu'Expert Comptable.\nVous trouverez mon CV ci-joint.", linkedin: 'linkedin.com/in/sophiemartin' },
  { id: 'R-002', name: 'Marc Leroi', email: 'm.leroi@outlook.com', phone: '+33 6 11 22 33 44', type: 'Indépendant', skills: 'Juriste Fiscal', languages: 'Français', date: 'Il y a 2 jours', message: "Disponible pour des missions ponctuelles en droit fiscal.", cv: 'cv_marc_leroi.pdf', linkedin: '' }
];

const mockClients = [
  { id: 'CLI-001', name: 'ACME Corp', email: 'contact@acme.com', dossiers: 2, status: 'Société', activite: 'Immobilier', creationDate: '12 Jan 2026' },
  { id: 'CLI-002', name: 'Jean Dupont', email: 'jean.dupont@email.com', dossiers: 1, status: 'Particulier', activite: 'Consultant', creationDate: '05 Mar 2026' },
]

// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    'NOUVEAU': { text: 'Nouveau', class: 'badge-new' },
    'TO_ASSIGN': { text: 'À attribuer', class: 'badge-warning' },
    'IN_PROGRESS': { text: 'En cours', class: 'badge-progress' },
    'WAITING_DOCS': { text: 'Attente Docs', class: 'badge-warning' },
    'IN_REVIEW': { text: 'En contrôle', class: 'badge-new' },
    'VALIDATED': { text: 'Validé', class: 'badge-success' }
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

// --- VIEWS ---

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tableau de bord</h1>
          <p style={{color: 'var(--text-muted)'}}>Vue d'ensemble de vos dossiers et tâches</p>
        </div>
        <button className="btn btn-primary">Nouveau Dossier</button>
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
            {mockDossiers.slice(0, 4).map(d => (
              <tr key={d.id}>
                <td style={{fontWeight: 500}}>{d.id}</td>
                <td>{d.client}</td>
                <td>{d.type}</td>
                <td>{getStatusBadge(d.status)}</td>
                <td>{getPriorityBadge(d.priority)}</td>
                <td style={{color: 'var(--text-muted)'}}>{d.date}</td>
                <td>
                  <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Consulter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const InboxPage = () => {
  const [tab, setTab] = useState('contact');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const renderDropdown = (m) => {
    if (openMenuId !== m.id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setOpenMenuId(null); setProcessMsg(m); }}>
          <Pencil size={14} /> Traiter
        </button>
        <button className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      <div style={{display: 'flex', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          {['contact', 'recrutement', 'interne', 'personnel'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)} 
              style={{
                background: tab === t ? 'var(--primary)' : 'transparent', 
                color: tab === t ? '#FFF' : 'var(--text-muted)', 
                border: tab === t ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                padding: '0 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '28px', fontSize: '0.875rem', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            {tab === 'contact' ? (
              <tr>
                <th>Statut</th>
                <th>Nom / Mail</th>
                <th>Degrés</th>
                <th>Besoin</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            ) : tab === 'recrutement' ? (
              <tr>
                <th>Statut</th>
                <th>Nom / Mail</th>
                <th>Compétence</th>
                <th>Langue</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            ) : (
              <tr>
                <th>Expéditeur</th>
                <th>Dossiers</th>
                <th>Objet</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {tab === 'contact' ? mockContactInbox.map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#F1F5F9', color: '#475569'
                  }}>
                    {m.type}
                  </span>
                </td>
                <td>
                  <strong style={{display: 'block'}}>{m.name}</strong>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.email}</span>
                </td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.degree === 'Chaud' ? '#FEE2E2' : m.degree === 'Tiède' ? '#FEF3C7' : '#E0E7FF',
                    color: m.degree === 'Chaud' ? '#DC2626' : m.degree === 'Tiède' ? '#D97706' : '#4F46E5'
                  }}>
                    {m.degree}
                  </span>
                </td>
                <td>{m.need}</td>
                <td style={{color: 'var(--text-muted)'}}>{m.date}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            )) : tab === 'recrutement' ? mockRecrutementInbox.map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#F1F5F9', color: '#475569'
                  }}>
                    {m.type}
                  </span>
                </td>
                <td>
                  <strong style={{display: 'block'}}>{m.name}</strong>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.email}</span>
                </td>
                <td>{m.skills}</td>
                <td>{m.languages}</td>
                <td style={{color: 'var(--text-muted)'}}>{m.date}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            )) : mockInbox.map(m => (
              <tr key={m.id}>
                <td>
                  <strong style={{display: 'block'}}>{m.name}</strong>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.from}</span>
                </td>
                <td>
                  <span style={{color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 500}}>{m.dossierId || 'Aucun dossier lié'}</span>
                </td>
                <td style={{fontWeight: m.status === 'NOUVEAU' ? 600 : 400}}>{m.subject}</td>
                <td style={{color: 'var(--text-muted)'}}>{m.date}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Traiter Demande */}
      {processMsg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>
                {tab === 'contact' ? 'Détails du Contact' : tab === 'recrutement' ? 'Détails de la Candidature' : 'Détails du Message'}
              </h2>
              <button onClick={() => setProcessMsg(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.name}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.email || processMsg.from}</div>
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.phone || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Date de soumission</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.date}</div>
                </div>
              </div>

              {tab === 'contact' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.type}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Besoin</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.need}</div>
                  </div>
                </div>
              )}

              {tab === 'recrutement' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Profil LinkedIn</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', color: 'var(--primary)'}}>{processMsg.linkedin || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Compétences</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.skills}</div>
                  </div>
                </div>
              )}

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Fichiers joints</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  {(processMsg.cv || processMsg.attachment) ? (
                    <a href="#" onClick={(e) => { e.preventDefault(); setPreviewFile(processMsg.cv || processMsg.attachment); }} style={{color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500}}>
                      <Eye size={14}/> {processMsg.cv || processMsg.attachment}
                    </a>
                  ) : (
                    <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>Aucun fichier</span>
                  )}
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Message / Lettre de motivation</label>
                <div style={{width: '100%', padding: '0.75rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '100px', fontSize: '0.875rem', whiteSpace: 'pre-wrap'}}>
                  {processMsg.message || 'Aucun message.'}
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
              <button onClick={() => setProcessMsg(null)} className="btn btn-outline">Fermer</button>
              {tab === 'interne' ? (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Répondre</button>
              ) : (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer une tâche</button>
              )}
              <button onClick={() => setProcessMsg(null)} className="btn btn-primary">Marquer comme traité</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
        }}>
          <div className="card" style={{width: '500px', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouvelle Tâche'}</h3>
              <button onClick={() => setCreateTaskModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Objet de la réponse' : 'Objet'}</label>
                <input type="text" placeholder={tab === 'interne' ? "Sujet..." : "Sujet de la tâche..."} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Destinataire' : 'Assigner à'}</label>
                <select className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                  <option>Alice Martin (Expert Comptable)</option>
                  <option>Jean Dupont (Juriste)</option>
                  <option>Support Menua</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
                <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                  {(processMsg?.cv || processMsg?.attachment) && (
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem'}}>
                      <input type="checkbox" defaultChecked />
                      <span style={{fontSize: '0.875rem', color: 'var(--text-main)'}}>Inclure le fichier lié ({processMsg.cv || processMsg.attachment})</span>
                    </label>
                  )}
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)'}}>
                    <Files size={16} />
                    <span style={{fontSize: '0.875rem', fontWeight: 500}}>Joindre un autre fichier...</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Message' : 'Message / Consignes'}</label>
                <textarea placeholder={tab === 'interne' ? "Votre réponse..." : "Détails de la tâche à effectuer..."} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              <button onClick={() => setCreateTaskModal(false)} className="btn btn-outline">Annuler</button>
              <button onClick={() => { setCreateTaskModal(false); setProcessMsg(null); alert(tab === 'interne' ? 'Réponse envoyée avec succès !' : 'Tâche créée et assignée avec succès !'); }} className="btn btn-primary">{tab === 'interne' ? 'Envoyer' : 'Créer la tâche'}</button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{width: '80%', height: '80%', background: '#FFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
              <h3 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Eye size={16} /> Prévisualisation du document : {previewFile}
              </h3>
              <button onClick={() => setPreviewFile(null)} className="btn btn-outline" style={{padding: '0.25rem 0.5rem', height: 'auto'}}>Fermer</button>
            </div>
            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', padding: '2rem'}}>
              {/* Fake Document Content */}
              <div style={{width: '100%', maxWidth: '800px', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '3rem', overflowY: 'auto'}}>
                <div style={{width: '30%', height: '20px', background: '#CBD5E1', marginBottom: '2rem', borderRadius: '4px'}}></div>
                <div style={{width: '100%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '90%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '95%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '85%', height: '12px', background: '#F1F5F9', marginBottom: '2rem', borderRadius: '2px'}}></div>
                <div style={{width: '40%', height: '16px', background: '#CBD5E1', marginBottom: '1.5rem', borderRadius: '4px'}}></div>
                <div style={{width: '100%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '92%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{display: 'flex', justifyContent: 'center', margin: '3rem 0'}}>
                  <div style={{padding: '1rem 2rem', border: '2px dashed #CBD5E1', color: '#94A3B8', fontWeight: 500, borderRadius: '8px'}}>
                    Document scanné / PDF original affiché ici ({previewFile})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

const DossiersPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tous les Dossiers</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion complète et cycle de vie</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Docs</th>
              <th>Date Réception</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDossiers.map(d => (
              <tr key={d.id}>
                <td style={{fontWeight: 500}}>{d.id}</td>
                <td><strong style={{display: 'block'}}>{d.client}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{d.contact}</span></td>
                <td>{getStatusBadge(d.status)}</td>
                <td>{getPriorityBadge(d.priority)}</td>
                <td>{d.documents} fichiers</td>
                <td style={{color: 'var(--text-muted)'}}>{d.date}</td>
                <td>
                  <button style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TasksPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Missions & Tâches</h1>
          <p style={{color: 'var(--text-muted)'}}>Attributions internes et ordres de mission</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID Tâche</th>
              <th>Dossier Lié</th>
              <th>Description</th>
              <th>Assigné à</th>
              <th>Statut</th>
              <th>Type</th>
              <th>Échéance</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map(t => (
              <tr key={t.id}>
                <td style={{fontWeight: 500}}>{t.id}</td>
                <td style={{color: 'var(--primary)', fontWeight: 500}}>{t.dossierId}</td>
                <td>{t.name}</td>
                <td>{t.assignedTo}</td>
                <td>{getStatusBadge(t.status)}</td>
                <td><span className="badge" style={{background: '#E2E8F0', color: '#4A5568'}}>{t.type}</span></td>
                <td style={{color: 'var(--danger)', fontWeight: 500}}>{t.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const RolesPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [consultRole, setConsultRole] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const availablePermissions = [
    "Accès total (Administration)",
    "Création / Modification de dossiers",
    "Consultation de dossiers",
    "Gestion des utilisateurs",
    "Assignation de tâches",
    "Envoi de messages",
    "Configuration système"
  ];

  const togglePerm = (perm) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPermissionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const renderDropdown = (role) => {
    if (openMenuId !== role.id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setConsultRole(role); setOpenMenuId(null); }}>
          <Eye size={14} /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { setEditRole(role); setOpenMenuId(null); }}>
          <Pencil size={14} /> Modifier
        </button>
        <button className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Rôles et Permissions</h1>
        <button onClick={() => setShowRoleModal(true)} className="btn btn-primary" style={{display: 'flex', gap: '0.5rem', alignItems: 'center', height: '28px', padding: '0 0.75rem', fontSize: '0.875rem'}}>
          Créer un rôle
        </button>
      </div>

      <div className="card" style={{padding: 0, overflow: 'visible'}}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rôle</th>
                <th>Permissions clés</th>
                <th>Statut</th>
                <th>Utilisateurs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockRoles.map(r => (
                <tr key={r.id}>
                  <td>
                    <strong style={{display: 'block'}}>{r.name}</strong>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>{r.permissions}</span></td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td><span className="badge badge-new" style={{background: '#EFF6FF', color: '#1D4ED8'}}>{r.users} membre{r.users !== 1 ? 's' : ''}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button onClick={(e) => toggleMenu(e, r.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(r)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Créer un Rôle */}
      {showRoleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '500px', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Créer un Rôle</h2>
              <button onClick={() => setShowRoleModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Intitulé du rôle</label>
                <input type="text" placeholder="Ex: GESTIONNAIRE" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Permissions</label>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                  <div 
                    onClick={() => setPermissionsOpen(!permissionsOpen)}
                    style={{width: '100%', padding: '0.5rem', minHeight: '38px', borderRadius: '4px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                  >
                    <span style={{color: selectedPermissions.length > 0 ? 'var(--text-main)' : 'var(--text-muted)'}}>
                      {selectedPermissions.length > 0 ? selectedPermissions.join(', ') : 'Sélectionner des permissions...'}
                    </span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem'}}>▼</span>
                  </div>
                  {permissionsOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      background: 'white', border: '1px solid var(--border)', borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto',
                      padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                      {availablePermissions.map(p => (
                        <label key={p} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p)} onChange={() => togglePerm(p)} /> {p}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" placeholder="Description des responsabilités..." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowRoleModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setShowRoleModal(false); }}>Créer le rôle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier un Rôle */}
      {editRole && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '500px', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier le Rôle</h2>
              <button onClick={() => setEditRole(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Intitulé du rôle</label>
                <input type="text" defaultValue={editRole.name} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Permissions</label>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                  <div 
                    onClick={() => setPermissionsOpen(!permissionsOpen)}
                    style={{width: '100%', padding: '0.5rem', minHeight: '38px', borderRadius: '4px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                  >
                    <span style={{color: selectedPermissions.length > 0 ? 'var(--text-main)' : 'var(--text-muted)'}}>
                      {selectedPermissions.length > 0 ? selectedPermissions.join(', ') : 'Sélectionner des permissions...'}
                    </span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem'}}>▼</span>
                  </div>
                  {permissionsOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      background: 'white', border: '1px solid var(--border)', borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto',
                      padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                      {availablePermissions.map(p => (
                        <label key={p} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p)} onChange={() => togglePerm(p)} /> {p}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" defaultValue={editRole.permissions} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                <select defaultValue={editRole.status} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditRole(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setEditRole(null); }}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter un Rôle */}
      {consultRole && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '500px', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter le Rôle</h2>
              <button onClick={() => setConsultRole(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Intitulé du rôle</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.name}</div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '80px'}}>{consultRole.permissions}</div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.status}</div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setConsultRole(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

const UsersPage = () => {
  const [tab, setTab] = useState('interne');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [consultUser, setConsultUser] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalType, setExternalType] = useState('Particulier');
  const [consultExternal, setConsultExternal] = useState(null);
  const [editExternal, setEditExternal] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const renderDropdown = (id, userObj = null, isExternal = false) => {
    if (openMenuId !== id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setConsultExternal(userObj);
            else setConsultUser(userObj);
          }
        }}>
          <Eye size={14} /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setEditExternal(userObj);
            else setEditUser(userObj);
          }
        }}>
          <Pencil size={14} /> Modifier
        </button>
        <button className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Modal Ajouter Externe */}
      {showExternalModal && tab === 'externe' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Ajouter un Membre Externe</h2>
              <button onClick={() => setShowExternalModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', width: 'fit-content'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="ext_type" checked={externalType === 'Particulier'} onChange={() => setExternalType('Particulier')} />
                <span style={{fontWeight: 500}}>Particulier</span>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="ext_type" checked={externalType === 'Société'} onChange={() => setExternalType('Société')} />
                <span style={{fontWeight: 500}}>Société</span>
              </label>
            </div>

            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {externalType === 'Particulier' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email professionnel</label>
                      <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email personnel</label>
                      <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                    <input type="tel" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea rows="3" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de la société</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>SIRET</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'entreprise</label>
                      <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone de l'entreprise</label>
                      <input type="tel" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de l'employé (contact)</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'employé</label>
                      <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone de l'employé</label>
                      <input type="tel" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description de l'entreprise</label>
                    <textarea rows="3" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              )}

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowExternalModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setShowExternalModal(false); }}>Créer le membre</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Externe */}
      {editExternal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier un Membre Externe</h2>
              <button onClick={() => setEditExternal(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {editExternal.status === 'Particulier' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                      <input type="text" defaultValue={editExternal.name} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" defaultValue={editExternal.activite} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email professionnel</label>
                      <input type="email" defaultValue={editExternal.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email personnel</label>
                      <input type="email" defaultValue={editExternal.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                    <input type="tel" defaultValue="06 12 34 56 78" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea rows="3" defaultValue="Client fidèle depuis 2026." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de la société</label>
                      <input type="text" defaultValue={editExternal.name} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>SIRET</label>
                      <input type="text" defaultValue="12345678900012" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'entreprise</label>
                      <input type="email" defaultValue={editExternal.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone de l'entreprise</label>
                      <input type="tel" defaultValue="01 23 45 67 89" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" defaultValue={editExternal.activite} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de l'employé (contact)</label>
                      <input type="text" defaultValue="Directeur Commercial" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'employé</label>
                      <input type="email" defaultValue={editExternal.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone de l'employé</label>
                      <input type="tel" defaultValue="06 98 76 54 32" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description de l'entreprise</label>
                    <textarea rows="3" defaultValue="Partenaire principal." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              )}

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditExternal(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setEditExternal(null); }}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter Externe */}
      {consultExternal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter un Membre Externe</h2>
              <button onClick={() => setConsultExternal(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {consultExternal.status === 'Particulier' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.activite}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email professionnel</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email personnel</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Numéro de téléphone</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>06 12 34 56 78</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description client</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Client fidèle depuis 2026.</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de la société</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>SIRET</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>12345678900012</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>01 23 45 67 89</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.activite}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de l'employé (contact)</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Directeur Commercial</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email de l'employé</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone de l'employé</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>06 98 76 54 32</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description de l'entreprise</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Partenaire principal.</div>
                  </div>
                </>
              )}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button onClick={() => setConsultExternal(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Interne */}
      {showModal && tab === 'interne' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Ajouter un Membre Interne</h2>
              <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option>Administrateur</option>
                    <option>Superviseur</option>
                    <option>Collaborateur</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pays de résidence</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Ville</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} placeholder="Ex: Master en Droit des Affaires" />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du profil</label>
                <textarea rows="3" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload)</label>
                <input type="file" style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setShowModal(false); }}>Créer le membre</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Interne */}
      {editUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier un Membre Interne</h2>
              <button onClick={() => setEditUser(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" defaultValue={editUser.name} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" defaultValue={editUser.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" defaultValue="+33 6 12 34 56 78" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select defaultValue={editUser.role} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="ADMIN">Administrateur</option>
                    <option value="SUPERVISOR">Superviseur</option>
                    <option value="COLLABORATOR">Collaborateur</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions actuelles (Héritées du rôle)</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  {mockRoles.find(r => r.name === editUser.role)?.permissions || 'Aucune permission'}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pays de résidence</label>
                  <input type="text" defaultValue="France" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Ville</label>
                  <input type="text" defaultValue="Paris" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation</label>
                  <input type="text" defaultValue="Master HEC Paris" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select defaultValue={editUser.status || "Actif"} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du profil</label>
                <textarea rows="3" defaultValue="Consultant Senior spécialisé en audit financier et accompagnement des directions générales." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload nouvelle pièce)</label>
                <input type="file" style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>Fichier actuel : document_identite.pdf</div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setEditUser(null); }}>Sauvegarder les modifications</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter Interne */}
      {consultUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter : {consultUser.name}</h2>
              <button onClick={() => setConsultUser(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.name}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.email}</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Numéro de téléphone</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Rôle</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.role}</div>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions (Héritées du rôle)</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontSize: '0.875rem', color: 'var(--text-main)'}}>
                  {mockRoles.find(r => r.name === consultUser.role)?.permissions || 'Aucune permission'}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Pays de résidence</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Ville</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Formation</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.status || 'Actif'}</div>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description du profil</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '76px'}}>Non renseigné</div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Pièce d'identité</label>
                <div onClick={() => setViewImage('https://images.unsplash.com/photo-1544813545-4827233fc515?q=80&w=1470&auto=format&fit=crop')} style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s'}}>
                  <Eye size={16} /> Voir
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button onClick={() => setConsultUser(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Image Viewer */}
      {viewImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{position: 'relative', maxWidth: '90vw', maxHeight: '90vh'}}>
            <button onClick={() => setViewImage(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', zIndex: 210}}>
              <X size={32} />
            </button>
            <img src={viewImage} alt="Pièce d'identité" style={{maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}} />
          </div>
        </div>
      )}

      <div style={{marginBottom: '1.5rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Membres</h1>
        <p style={{color: 'var(--text-muted)'}}>Gestion des équipes internes et des clients</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
        <button 
          onClick={() => setTab('interne')} 
          style={{
            background: tab === 'interne' ? 'var(--primary)' : 'transparent', 
            color: tab === 'interne' ? '#FFF' : 'var(--text-muted)', 
            border: tab === 'interne' ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
            borderRadius: '6px', 
            padding: '0 0.75rem', 
            height: '28px',
            lineHeight: 1,
            width: 'fit-content',
            whiteSpace: 'nowrap',
            fontSize: '0.875rem', 
            fontWeight: 500, 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Interne
        </button>
        <button 
          onClick={() => setTab('externe')} 
          style={{
            background: tab === 'externe' ? 'var(--primary)' : 'transparent', 
            color: tab === 'externe' ? '#FFF' : 'var(--text-muted)', 
            border: tab === 'externe' ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
            borderRadius: '6px', 
            padding: '0 0.75rem', 
            height: '28px',
            lineHeight: 1,
            width: 'fit-content',
            whiteSpace: 'nowrap',
            fontSize: '0.875rem', 
            fontWeight: 500, 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Externe
        </button>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (tab === 'interne') setShowModal(true);
            else setShowExternalModal(true);
          }}
          style={{ width: 'fit-content', whiteSpace: 'nowrap', padding: '0 0.75rem', fontSize: '0.875rem', height: '28px', lineHeight: 1 }}
        >
          {tab === 'interne' ? 'Ajouter en Interne' : 'Ajouter en Externe'}
        </button>
      </div>

      <div className="table-wrapper">
        {tab === 'interne' ? (
          <table>
            <thead>
              <tr>
                <th>Nom / Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong style={{display: 'block'}}>{u.name}</strong>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{u.email}</span>
                  </td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    <span style={{color: u.status === 'Actif' ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-muted)'}}>{u.lastLogin}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button onClick={(e) => toggleMenu(e, u.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(u.id, u)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom / Mail</th>
                <th>Statut</th>
                <th>Activité</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong style={{display: 'block'}}>{c.name}</strong>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{c.email}</span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: c.status === 'Société' ? '#EFF6FF' : '#F3E8FF',
                      color: c.status === 'Société' ? '#1D4ED8' : '#7E22CE'
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.activite}</span></td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.creationDate}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button onClick={(e) => toggleMenu(e, c.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(c.id, c, true)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function App() {
  const location = useLocation();
  const [user] = useState(MOCK_USER);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold'}}>M</div>
          <span style={{fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.5px'}}>MENUA CRM</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link to="/dossiers" className={`nav-item ${location.pathname.includes('/dossiers') ? 'active' : ''}`}>
            <Files size={20} />
            Dossiers
          </Link>
          <Link to="/inbox" className={`nav-item ${location.pathname.includes('/inbox') ? 'active' : ''}`}>
            <Mail size={20} />
            Boîte de Réception
          </Link>
          {/* SÉPARATION DES ACCÈS (Muraille de Chine visuelle) */}
          {['ADMIN', 'SUPERVISOR'].includes(user.role) && (
            <Link to="/tasks" className={`nav-item ${location.pathname.includes('/tasks') ? 'active' : ''}`}>
              <Briefcase size={20} />
              Missions & Tâches
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/users" className={`nav-item ${location.pathname.includes('/users') ? 'active' : ''}`}>
              <Users size={20} />
              Membres
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/roles" className={`nav-item ${location.pathname.includes('/roles') ? 'active' : ''}`}>
              <Shield size={20} />
              Rôles
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
              <Settings size={20} />
              Configuration
            </Link>
          )}
        </nav>
        <div style={{padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
            <div style={{width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{fontSize: '0.875rem', fontWeight: 500}}>{user.name}</div>
              <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)'}}>{user.role}</div>
            </div>
          </div>
          <button className="btn btn-outline" style={{width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dossiers" element={<DossiersPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/settings" element={
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem'}}>Configuration</h1>
                <div className="card">
                  <p>Réglages de la plateforme (En construction)</p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
