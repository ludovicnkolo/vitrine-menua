import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./i18n.js";
import { setupFetchInterceptor, redirectToLogin, clearAuthSession } from "./services/api";

// Patch de résilience React contre les extensions et outils de traduction automatique (Google Translate, Chrome Translate)
// Empêche le crash "NotFoundError: Failed to execute 'insertBefore' on 'Node'"
if (typeof Node === "function" && Node.prototype) {
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };
}

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
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-white cursor-pointer px-4 py-2 bg-red-700 hover:bg-red-800 rounded font-medium"
            >
              Recharger la page
            </button>
            <button
              type="button"
              onClick={() => {
                clearAuthSession();
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="text-white cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 rounded"
            >
              Vider le cache et aller à l'accueil
            </button>
          </div>
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
