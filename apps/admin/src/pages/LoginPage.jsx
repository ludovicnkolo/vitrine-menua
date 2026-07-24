import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        onLogin(data.token, data.user);
      } else {
        setError(data.error || 'Identifiants invalides');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau ou serveur: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
    setLoading(false);
  };

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)'}}>
      <div className="card" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="/logo.png" alt="Menua Consulting" style={{ height: '70px', objectFit: 'contain' }} />
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {error && <div style={{padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.875rem'}}>{error}</div>}
          <div>
            <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{marginTop: '0.5rem', justifyContent: 'center', width: '100%'}}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;