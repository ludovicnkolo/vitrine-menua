import { getSafeApiUrl } from "../utils/helpers";
import { saveAuthSession } from "../services/api";
import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [searchParams] = useSearchParams();

  // Détection du portail par défaut via URL ou localStorage
  const urlPortal = searchParams.get("portal");
  const urlEmail = searchParams.get("email");
  const isActivated = searchParams.get("activated") === "true";
  const isReset = searchParams.get("reset") === "true";
  const isExpired = searchParams.get("logout") === "expired";

  const initialPortal = urlPortal === "client" ? "client" : (
    urlPortal === "team" ? "team" : (localStorage.getItem("menua_portal_pref") || "team")
  );

  const [portal, setPortal] = useState(initialPortal);
  const [email, setEmail] = useState(urlEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState(
    isActivated
      ? "Votre compte a été activé avec succès ! Vous pouvez maintenant vous connecter."
      : isReset
      ? "Votre mot de passe a été réinitialisé avec succès ! Veuillez vous connecter."
      : ""
  );

  const errorTimeoutRef = useRef(null);

  const setTimedError = (msg) => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setError(msg);
    errorTimeoutRef.current = setTimeout(() => setError(""), 5000);
  };

  useEffect(() => {
    if (urlPortal) {
      setPortal(urlPortal);
      localStorage.setItem("menua_portal_pref", urlPortal);
    }
  }, [urlPortal]);

  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [urlEmail]);

  useEffect(() => {
    if (isExpired) {
      setTimedError("Votre session a expiré. Veuillez vous reconnecter.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [isExpired]);

  const handlePortalSwitch = (newPortal) => {
    setPortal(newPortal);
    localStorage.setItem("menua_portal_pref", newPortal);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setTimedError("Veuillez renseigner votre email et votre mot de passe.");
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

  const isClientPortal = portal === "client";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main,#f8fafc)] p-4">
      <div className="card w-full max-w-sm p-8 bg-white border border-slate-200 rounded-2xl shadow-md transition-all">
        
        {/* Logo MENUA CONSULTING */}
        <div className="text-center mb-6">
          <div className="bg-[var(--primary,#141824)] p-5 flex items-center justify-center mb-5 rounded-xl shadow-sm">
            <img
              src="/logo.png"
              alt="Menua Consulting"
              style={{ height: "60px", objectFit: "contain" }}
            />
          </div>

          {/* Onglets de sélection : Espace Client vs Espace Collaborateur */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
            <button
              type="button"
              onClick={() => handlePortalSwitch("client")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                isClientPortal
                  ? "bg-white text-[#b8863d] shadow-xs border border-amber-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 size={14} />
              <span>Espace Client</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch("team")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                !isClientPortal
                  ? "bg-[var(--primary,#141824)] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck size={14} />
              <span>Collaborateur</span>
            </button>
          </div>

          {/* Titre et sous-titre contextuels */}
          <h1 className="text-xl font-bold text-slate-800">
            {isClientPortal ? "Espace Client" : "Espace Collaborateur"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {isClientPortal
              ? "Accédez à vos documents, dossiers et livrables sécurisés"
              : "Connectez-vous pour accéder au portail CRM"}
          </p>
        </div>

        {/* Bannière de succès (activation ou reset) */}
        {successBanner && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium mb-4">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{successBanner}</div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              {isClientPortal ? "Adresse email du client" : "Adresse email collaborateur"}
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
              placeholder={isClientPortal ? "votre.email@entreprise.com" : "adresse@menuaconsulting.com"}
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
            className="btn btn-primary w-full mt-2 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            style={isClientPortal ? {
              backgroundColor: "#c99c5c",
              borderColor: "#c99c5c",
              color: "#ffffff"
            } : {}}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading
              ? "Connexion en cours..."
              : (isClientPortal ? "Accéder à mon espace client" : "Se connecter au CRM")}
          </button>

          <div className="text-center mt-2">
            <Link
              to={`/forgot-password?portal=${portal}`}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline font-medium p-1 inline-block"
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
