import React from 'react';

const UserFormFields = ({ user, setUser, rolesList, isEdit, setSelectedFile }) => {
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'isBlocked') {
      value = value === 'Inactif';
    }
    setUser({ ...user, [field]: value });
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Nom complet</label>
          <input type="text" value={user.name || ''} onChange={handleChange('name')} required={isEdit} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Email {isEdit ? '' : <span style={{ color: 'red' }}>*</span>}</label>
          <input type="email" value={user.email || ''} onChange={handleChange('email')} required={isEdit} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Numéro de téléphone</label>
          <input type="tel" value={user.telephone || ''} onChange={handleChange('telephone')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Rôle</label>
          <select value={user.roleId || ''} onChange={handleChange('roleId')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white' }}>
            <option value="">Sélectionner un rôle...</option>
            {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Lieu de résidence</label>
          <input type="text" value={user.lieuResidence || ''} onChange={handleChange('lieuResidence')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Expérience clé</label>
          <input type="text" value={user.experienceCle || ''} onChange={handleChange('experienceCle')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Langues</label>
          <input type="text" value={user.langues || ''} onChange={handleChange('langues')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} placeholder="Ex: Français, Anglais" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Statut</label>
          <select value={user.isBlocked ? 'Inactif' : (user.status || 'Actif')} onChange={isEdit ? handleChange('isBlocked') : handleChange('status')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white' }}>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Description profil</label>
        <textarea rows="3" value={user.profile || ''} onChange={handleChange('profile')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Pièce d'identité ({isEdit ? 'Upload nouvelle pièce' : 'Upload'})</label>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)' }} />
        {isEdit && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fichier actuel : document_identite.pdf</div>}
      </div>
    </>
  );
};

export default UserFormFields;
