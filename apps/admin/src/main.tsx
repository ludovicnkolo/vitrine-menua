import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./i18n.js";
import { setupFetchInterceptor, redirectToLogin, clearAuthSession } from "./services/api";

// Initialisation immédiate de l'intercepteur de requêtes
setupFetchInterceptor(() => {
  redirectToLogin("expired");
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-8" style={{background:"#FEE2E2",color:"#B91C1C",minHeight:"100vh",fontFamily:"sans-serif"}}
        >
          <h1
            className="font-bold mb-4" style={{fontSize:"1.5rem"}}
          >
            Erreur critique de l'application
          </h1>
          <p className="mb-4">
            Une erreur s'est produite lors du rendu de la page :
          </p>
          <pre
            className="p-4" style={{background:"#fff",borderRadius:"8px",overflowX:"auto",border:"1px solid #F87171"}}
          >
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </pre>
          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/";
            }}
            className="mt-4 text-white cursor-pointer" style={{padding:"0.5rem 1rem",background:"#B91C1C",border:"none",borderRadius:"4px"}}
          >
            Vider le cache et recommencer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
