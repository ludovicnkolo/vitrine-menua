import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL ;
      const res = await fetch(getSafeApiUrl(`/api/auth/setup-password`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setTimeout(() => setError(null), 3000);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC'}}>
        <div className="card" style={{maxWidth: 400, textAlign: 'center'}}>
          <h2 style={{color: '#E53E3E', marginBottom: '1rem'}}>Lien invalide</h2>
          <p>Le lien d'activation est manquant ou incorrect.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC'}}>
      <div className="card" style={{maxWidth: 400, width: '100%', padding: '2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
            <h1 style={{margin: 0, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px'}}>MENUA CONSULTING</h1>
          </div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Activer votre compte</h2>
          <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem'}}>Veuillez configurer votre mot de passe pour accéder au CRM.</p>
        </div>

        {error && (
          <div style={{background: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center'}}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{background: '#D1FAE5', color: '#059669', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
            <h3 style={{margin: '0 0 0.5rem 0'}}>Compte activé !</h3>
            <p style={{margin: 0, fontSize: '0.875rem'}}>Redirection vers la page de connexion...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label htmlFor="auto-field-1785016991509-1" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nouveau mot de passe</label>
              <input id="auto-field-1785016991509-1"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC'}}
              />
            </div>
            <div>
              <label htmlFor="auto-field-1785016991509-2" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Confirmer le mot de passe</label>
              <input id="auto-field-1785016991509-2"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC'}}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{width: '100%', padding: '0.75rem', marginTop: '1rem', justifyContent: 'center'}}
            >
              {loading ? 'Enregistrement...' : 'Activer mon compte'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupPasswordPage;
