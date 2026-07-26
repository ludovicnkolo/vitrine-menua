import React from 'react';

const renderInputField = (label, key, stateObj, setStateFn, type = "text", required = false, isTextarea = false) => {
  if (isTextarea) {
    return (
      <div>
        <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>{label} {required && <span style={{color: 'red'}}>*</span>}</label>
        <textarea rows="3" value={stateObj[key] || ''} onChange={e => setStateFn({...stateObj, [key]: e.target.value})} required={required} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
      </div>
    );
  }
  return (
    <div>
      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>{label} {required && <span style={{color: 'red'}}>*</span>}</label>
      <input type={type} value={stateObj[key] || ''} onChange={e => setStateFn({...stateObj, [key]: e.target.value})} required={required} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
    </div>
  );
};

const ClientFormFields = ({ client, setClient, type = 'Particulier', isEdit = false }) => {
  const isParticulier = type === 'Particulier' || type === 'PARTICULIER';

  return (
    <>
      {isParticulier ? (
        <>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Nom complet", "name", client, setClient, "text", true)}
            {renderInputField("Email", "email", client, setClient, "email", true)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Téléphone", "telephone", client, setClient, "tel")}
            {renderInputField("Contact secondaire", "contactSecondaire", client, setClient)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Secteur d'activité", "secteurActivite", client, setClient)}
          </div>
        </>
      ) : (
        <>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Nom de la société / Raison Sociale", "raisonSociale", client, setClient, "text", true)}
            {renderInputField("SIRET", "siret", client, setClient)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Email de l'entreprise", "emailEntreprise", client, setClient, "email")}
            {renderInputField("Numéro de l'entreprise", "telephoneEntreprise", client, setClient, "tel")}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Nom du contact", "name", client, setClient, "text", true)}
            {renderInputField("Email du contact", "email", client, setClient, "email", true)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Numéro du contact", "telephone", client, setClient, "tel")}
            {renderInputField("Contact secondaire", "contactSecondaire", client, setClient)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {renderInputField("Secteur d'activité", "secteurActivite", client, setClient)}
          </div>
        </>
      )}
      
      {isEdit && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Type de client</label>
            <select value={client.type || 'Particulier'} onChange={e=>setClient({...client, type: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
              <option value="Particulier">Particulier</option>
              <option value="Société">Société</option>
            </select>
          </div>
        </div>
      )}

      {renderInputField("Description client", "description", client, setClient, "text", false, true)}
    </>
  );
};

export default ClientFormFields;
