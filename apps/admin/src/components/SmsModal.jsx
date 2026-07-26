import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const SmsModal = ({ isOpen, onClose, contextData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const apiUrl = import.meta.env.VITE_API_URL ;
          const res = await fetch(getSafeApiUrl(`/api/crm/users`), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setUsers(await res.json());
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUserId || !content || !subject) {
      alert("Veuillez remplir l'objet, le contenu et le destinataire.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL ;
      
      let attachmentStr = null;
      if (file) {
        const formData = new FormData();
        formData.append('bucket', 'formulaires');
        formData.append('file', file);
        const uploadRes = await fetch(getSafeApiUrl(`/api/files/upload`), {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          attachmentStr = uploadData.fileData.filename;
        }
      }

      // Find selected user name
      const targetUser = users.find(u => u.id === targetUserId);
      const recipientName = targetUser ? targetUser.name : 'Inconnu';

      // Send to messages endpoint
      const payload = {
        type: 'INTERNE',
        subType: `SMS Collaborateur pour ${recipientName}`,
        objet: subject,
        bodyText: content,
        attachment: attachmentStr,
        dossierId: contextData?.dossierId || null,
        missionId: contextData?.missionId || null,
      };

      const res = await fetch(getSafeApiUrl(`/api/crm/messages/interne`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("SMS envoyé avec succès !");
        onClose();
        setSubject('');
        setContent('');
        setTargetUserId('');
        setFile(null);
      } else {
        alert("Erreur lors de l'envoi du SMS.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="fade-in" style={{background: '#FFF', width: '90%', maxWidth: '600px', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
          <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Envoyer un SMS Collaborateur</h2>
          <button type="button" onClick={onClose} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label htmlFor="smsDestinataire" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Destinataire (Collaborateur)</label>
            <select id="smsDestinataire" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} required className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
              <option value="">-- Sélectionner un collaborateur --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="smsSubject" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
            <input id="smsSubject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Sujet du SMS" className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}} />
          </div>

          <div>
            <label htmlFor="smsContent" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Contenu du message</label>
            <textarea id="smsContent" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Tapez votre message ici..." className="input-field" rows={5} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', resize: 'vertical'}} />
          </div>

          <div>
            <label htmlFor="smsFile" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Fichier joint (Optionnel)</label>
            <input id="smsFile" type="file" onChange={(e) => setFile(e.target.files[0])} className="input-field" style={{width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}} />
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{padding: '0.75rem 1.5rem'}}>Annuler</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Send size={16} />
              {loading ? 'Envoi...' : 'Envoyer SMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmsModal;
