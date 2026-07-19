import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#FEE2E2', color: '#B91C1C', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Erreur critique de l'application</h1>
          <p style={{ marginBottom: '1rem' }}>Une erreur s'est produite lors du rendu de la page :</p>
          <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #F87171' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#B91C1C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Vider le cache et recommencer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
