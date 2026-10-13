import { getSafeApiUrl } from "../utils/helpers";
import { saveAuthSession } from "../services/api";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const errorTimeoutRef = useRef(null);

  const setTimedError = (msg) => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setError(msg);
    errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "expired") {
      setTimedError("Votre session a expiré. Veuillez vous reconnecter.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setTimedError("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(getSafeApiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setTimedError(data?.error || "Identifiants invalides.");
        return;
      }

      if (!data.user || !data.token) {
        setTimedError("Réponse d'authentification incomplète du serveur.");
        return;
      }

      saveAuthSession(data.user, data.token);
      onLogin(data.user, data.token);
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setTimedError("Impossible de contacter le serveur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[var(--bg-main)] p-4"
    >
      <div
        className="card w-full max-w-sm p-8 bg-white border border-slate-200 rounded-2xl shadow-sm"
      >
        <div className="text-center mb-8">
          <div
            className="bg-[var(--primary)] p-6 flex items-center justify-center mb-6 rounded-xl shadow-sm"
          >
            <img
              src="/logo.png"
              alt="Menua Consulting"
              style={{ height: "64px", objectFit: "contain" }}
            />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Espace d'Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connectez-vous pour accéder au portail CRM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@menuaconsulting.com"
              className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50 transition"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full p-2.5 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50 transition"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                title={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="text-center mt-2">
            <Link
              to="/forgot-password"
              className="text-xs text-[var(--primary)] hover:underline font-medium p-1 inline-block"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

