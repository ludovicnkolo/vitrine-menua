import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    // TACHE
    'NOUVEAU': { text: 'Nouveau', class: 'badge-new' },
    'EN_COURS': { text: 'En cours', class: 'badge-progress' },
    'A_VERIFIER': { text: 'À vérifier', class: 'badge-warning' },
    'A_CORRIGER': { text: 'À corriger', style: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 } },
    'REATTRIBUEE': { text: 'Réattribuée', class: 'badge-warning' },
    'EN_CONTROLE': { text: 'En contrôle', class: 'badge-warning' },
    'EN_VALIDATION_FINALE': { text: 'En validation finale', style: { backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 } },
    'TERMINEE': { text: 'Terminée', class: 'badge-success' },
    
    // MISSION
    'NON_DEMARREE': { text: 'Non démarrée', class: 'badge-new' },
    
    // DOSSIER
    'OUVERT': { text: 'Ouvert', class: 'badge-progress' },
    'BLOQUE': { text: 'Bloqué', style: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 } },
    'CLOTURE': { text: 'Clôturé', class: 'badge-success' },
    'ARCHIVE': { text: 'Archivé', class: 'badge-warning' },

    // Fallbacks for legacy/other statuses if needed
    'EN_ATTENTE': { text: 'En attente', class: 'badge-new' },
    'EN_FINALISATION': { text: 'En finalisation', class: 'badge-warning' },
    'A_AMELIORER': { text: 'À améliorer', style: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 } },
    'EN_REVISION': { text: 'En révision', style: { backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 } },
    'TO_ASSIGN': { text: 'À attribuer', class: 'badge-warning' },
    'IN_PROGRESS': { text: 'En cours', class: 'badge-progress' },
    'WAITING_DOCS': { text: 'Attente Docs', class: 'badge-warning' },
    'IN_REVIEW': { text: 'En contrôle', class: 'badge-new' },
    'VALIDATED': { text: 'Validé', class: 'badge-success' },
    'FERME': { text: 'Fermé', class: 'badge-success' },
    'Actif': { text: 'Actif', style: { backgroundColor: '#DEF7EC', color: '#03543F' } },
    'Inactif': { text: 'Inactif', style: { backgroundColor: '#FDE8E8', color: '#9B1C1C' } }
  }
  const s = map[status] || { text: status, class: 'badge-new' }
  return <span className={`badge ${s.class || ''}`} style={s.style || {}}>{s.text}</span>
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
    'Super-administrateur': { text: 'Super-administrateur', bg: '#4C1D95', color: '#FFF' },
    'Responsable opérationnel': { text: 'Responsable opérationnel', bg: '#DD6B20', color: '#FFF' },
    'Relecteur': { text: 'Relecteur', bg: '#805AD5', color: '#FFF' },
    'Collaborateur': { text: 'Collaborateur', bg: '#319795', color: '#FFF' },
    'Administrateur technique': { text: 'Administrateur technique', bg: '#718096', color: '#FFF' }
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
  const formatUnknown = (st) => st ? st.charAt(0).toUpperCase() + st.slice(1).toLowerCase().replaceAll('_', ' ') : '';
  const s = map[status] || { text: formatUnknown(status), bg: '#718096', color: '#FFF' }
  return <span className="badge" style={{backgroundColor: s.bg, color: s.color}}>{s.text}</span>
}

export { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge };

function getSafeApiUrl(path) {
  const base = import.meta.env.VITE_API_URL || '';
  try {
    const origin = base || window.location.origin;
    const url = new URL(path, origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return path;
    return url.toString();
  } catch(e) {
    return path;
  }
}

/**
 * Fetch authentifié vers l'API CRM.
 * @param {string} endpoint - Chemin de l'API (ex: '/api/crm/users')
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} method
 * @param {object|null} body - Corps JSON optionnel
 */
async function apiFetch(endpoint, method = 'GET', body = null) {
  const token = sessionStorage.getItem('adminToken');
  const options = {
    method,
    headers: { 'Authorization': `Bearer ${token}` }
  };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  return fetch(new URL(getSafeApiUrl(endpoint)).toString(), options);
}

/**
 * Upload d'un fichier vers le serveur.
 * @param {File} file - Fichier à uploader
 * @param {string} bucket - Répertoire de destination ('formulaires', 'users_id_cards', etc.)
 * @returns {Promise<string|null>} - Nom du fichier ou URL selon le bucket, null si erreur
 */
async function uploadFile(file, bucket = 'formulaires') {
  if (!file) return null;
  const formData = new FormData();
  formData.append('bucket', bucket);
  formData.append('file', file);
  try {
    const res = await fetch(getSafeApiUrl('/api/files/upload'), {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('adminToken') },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      return bucket === 'users_id_cards'
        ? getSafeApiUrl(`/api/files/view/${data.fileData.path}`)
        : data.fileData.filename;
    }
  } catch(e) { console.error('Upload error', e); }
  return null;
}

/**
 * Formate une date en chaîne lisible fr-FR.
 * @param {string|Date} date
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export { getSafeApiUrl, apiFetch, uploadFile, formatDate };

/**
 * Extrait une valeur depuis du HTML structuré (utilisé pour les formulaires de contact/recrutement).
 */
function extractContentFromHtml(html, label, isBlock = false) {
  if (!html) return null;
  let regex = new RegExp(String.raw`>\s*${label}\s*<\/strong>\s*<div[^>]*>([\s\S]*?)<\/div>`, 'i');
  let match = html.match(regex);
  if (!match && !isBlock) {
    regex = new RegExp(String.raw`>\s*${label}\s*<\/strong>\s*:\s*<span[^>]*>([\s\S]*?)<\/span>`, 'i');
    match = html.match(regex);
  }
  if (match?.[1]) {
    let content = match[1];
    if (isBlock) content = content.replace(/<br\s*\/?>/gi, '\n');
    return content.replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
}

const extractFieldFromHtml = (html, fieldName) => extractContentFromHtml(html, fieldName, false);
const extractBlockFromHtml = (html, blockName) => extractContentFromHtml(html, blockName, true);

export { extractFieldFromHtml, extractBlockFromHtml };