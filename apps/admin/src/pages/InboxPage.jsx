import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';
import { mockDossiers, mockTasks, mockInbox, mockContactInbox, mockRecrutementInbox, mockClients, mockRoles } from '../utils/mockData';

const InboxPage = () => {
  const [tab, setTab] = useState('contact');
  const [filterTraite, setFilterTraite] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [isNewDossier, setIsNewDossier] = useState(true);
  const menuRef = useRef(null);
  const isAnyModalOpen = processMsg || createTaskModal;

  const filterFn = (m) => {
    const statusMatch = filterTraite === 'all' ? true : filterTraite === 'traite' ? m.isProcessed === true : m.isProcessed !== true;
    if (!statusMatch) return false;
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const nameMatch = (m.name || '').toLowerCase().includes(term);
    const emailMatch = (m.email || m.from || '').toLowerCase().includes(term);
    return nameMatch || emailMatch;
  };

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
      {!isAnyModalOpen && (
      <>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem', width: '100%'}}>
          {['contact', 'recrutement', 'interne', 'personnel'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)} 
              style={{
                flex: 1,
                background: tab === t ? 'var(--primary)' : 'transparent', 
                color: tab === t ? '#FFF' : 'var(--text-muted)', 
                border: tab === t ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontSize: '1.05rem', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{display: 'flex', gap: '1rem', width: '100%', alignItems: 'center'}}>
          <div style={{flex: 1, position: 'relative'}}>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: '#F8FAFC'}}
            />
          </div>
          <select 
            value={filterTraite}
            onChange={(e) => setFilterTraite(e.target.value)}
            style={{padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', fontSize: '0.875rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', minWidth: '150px'}}
          >
            <option value="all">Tous (Traitement)</option>
            <option value="non_traite">Non Traités</option>
            <option value="traite">Traités</option>
          </select>
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
            {tab === 'contact' ? mockContactInbox.filter(filterFn).map(m => (
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
            )) : tab === 'recrutement' ? mockRecrutementInbox.filter(filterFn).map(m => (
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
            )) : mockInbox.filter(filterFn).map(m => (
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
      </>
      )}

      {/* Modal Traiter Demande */}
      {processMsg && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>
                {tab === 'contact' ? 'Détails du Contact' : tab === 'recrutement' ? 'Détails de la Candidature' : 'Détails du Message'}
              </h2>
              <button onClick={() => setProcessMsg(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
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

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Objet</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.subject || (tab === 'contact' ? 'Demande : ' + processMsg.need : tab === 'recrutement' ? 'Candidature spontanée' : 'Aucun objet')}</div>
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
        <div className="fade-in" style={{width: '100%', padding: '0'}}>
          <div className="" style={{width: '100%', padding: '0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouvelle Tâche'}</h3>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
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

              {tab !== 'interne' && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
                  <div style={{display: 'flex', gap: '1.5rem', marginBottom: '0.75rem'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" name="dossierType" value="new" checked={isNewDossier} onChange={() => setIsNewDossier(true)} />
                      Nouveau dossier
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" name="dossierType" value="existing" checked={!isNewDossier} onChange={() => setIsNewDossier(false)} />
                      Dossier existant
                    </label>
                  </div>
                  {isNewDossier ? (
                    <input type="text" placeholder="Nom du nouveau dossier..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                  ) : (
                    <select className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                      <option>ACME Corp (DOSS-2026-001)</option>
                      <option>Paul Dupont (DOSS-2026-002)</option>
                      <option>TechStart (DOSS-2026-003)</option>
                    </select>
                  )}
                </div>
              )}

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
                <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                  {(processMsg?.cv || processMsg?.attachment) && (
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem'}}>
                      <input type="checkbox" defaultChecked />
                      <span style={{fontSize: '0.875rem', color: 'var(--text-main)'}}>Inclure le fichier lié ({processMsg.cv || processMsg.attachment})</span>
                    </label>
                  )}
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginBottom: 0}}>
                    <Files size={16} />
                    <span style={{fontSize: '0.875rem', fontWeight: 500}}>
                      {newTaskFile ? newTaskFile.name : 'Joindre un autre fichier...'}
                    </span>
                    <input 
                      type="file" 
                      style={{display: 'none'}} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setNewTaskFile(e.target.files[0]);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Message' : 'Message / Consignes'}</label>
                <textarea placeholder={tab === 'interne' ? "Votre réponse..." : "Détails de la tâche à effectuer..."} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline">Annuler</button>
              <button onClick={() => { setCreateTaskModal(false); setProcessMsg(null); setNewTaskFile(null); alert(tab === 'interne' ? 'Réponse envoyée avec succès !' : 'Tâche créée et assignée avec succès !'); }} className="btn btn-primary">{tab === 'interne' ? 'Envoyer' : 'Créer la tâche'}</button>
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

export default InboxPage;