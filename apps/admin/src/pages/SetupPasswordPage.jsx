import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2,
  ShieldCheck, KeyRound, UserCheck, Building2
} from "lucide-react";

// ─── Configurations contextuelles selon le type d'utilisateur et l'opération ───
const CONTEXT_CONFIG = {
  activation: {
    client: {
      badge: "Espace Client Sécurisé",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      accentColor: "#2563eb",
      icon: <Building2 size={24} className="text-white" />,
      iconBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      title: "Activez votre Espace Client",
      subtitle: "Bienvenue sur votre portail client MENUA CONSULTING. Définissez un mot de passe personnel pour accéder à vos documents, dossiers et livrables en toute confidentialité.",
      btnLabel: "Activer mon espace client",
      portal: "client",
      successTitle: "Votre espace client est activé !",
      successMsg: "Votre mot de passe a été enregistré avec succès. Vous allez être redirigé vers la page de connexion de votre espace client...",
    },
    internal: {
      badge: "Espace Collaborateur",
      badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
      accentColor: "#141824",
      icon: <UserCheck size={24} className="text-white" />,
      iconBg: "linear-gradient(135deg, #141824 0%, #1e2a3a 100%)",
      title: "Activez votre compte collaborateur",
      subtitle: "Bienvenue au sein de l'équipe MENUA CONSULTING. Choisissez un mot de passe sécurisé pour accéder à votre espace de travail CRM.",
      btnLabel: "Activer mon compte",
      portal: "team",
      successTitle: "Compte activé avec succès !",
      successMsg: "Votre mot de passe a été enregistré. Redirection vers la connexion au CRM...",
    },
  },
  reset: {
    client: {
      badge: "Espace Client — Réinitialisation",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      accentColor: "#2563eb",
      icon: <ShieldCheck size={24} className="text-white" />,
      iconBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      title: "Réinitialisez votre mot de passe",
      subtitle: "Définissez un nouveau mot de passe sécurisé pour retrouver l'accès à votre espace client MENUA CONSULTING.",
      btnLabel: "Enregistrer mon nouveau mot de passe",
      portal: "client",
      successTitle: "Mot de passe mis à jour !",
      successMsg: "Votre mot de passe a été modifié avec succès. Redirection vers votre espace client...",
    },
    internal: {
      badge: "Réinitialisation de mot de passe",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      accentColor: "#2563eb",
      icon: <KeyRound size={24} className="text-white" />,
      iconBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      title: "Nouveau mot de passe CRM",
      subtitle: "Choisissez un nouveau mot de passe sécurisé pour accéder à votre espace CRM.",
      btnLabel: "Enregistrer le mot de passe",
      portal: "team",
      successTitle: "Mot de passe réinitialisé !",
      successMsg: "Votre mot de passe a été mis à jour. Redirection vers la page de connexion...",
    },
  },
};

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Contexte résolu depuis l'API backend
  const [tokenContext, setTokenContext] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  // ─── 1. Vérifier le token dès l'ouverture ─────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenError("Aucun jeton de sécurité fourni dans l'adresse du lien.");
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(getSafeApiUrl(`/api/auth/verify-token?token=${token}`));
        const data = await res.json().catch(() => ({}));
        if (data.valid) {
          setTokenContext(data);
        } else {
          setTokenError(
            data.expired
              ? "Ce lien d'accès a expiré ou a déjà été utilisé. Veuillez demander un nouveau lien."
              : (data.error || "Lien invalide.")
          );
        }
      } catch {
        setTokenError("Impossible de vérifier le lien. Veuillez vérifier votre connexion.");
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  // ─── 2. Auto-clear de l'erreur après 5s ──────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // ─── 3. Redirection automatique vers la connexion appropriée après succès ─────
  useEffect(() => {
    if (!success) return;
    const isClient = tokenContext?.isClient;
    const isReset = tokenContext?.context === "reset";
    const emailParam = encodeURIComponent(tokenContext?.userEmail || "");
    const statusParam = isReset ? "reset=true" : "activated=true";

    const targetUrl = isClient
      ? `/client/login?${statusParam}&email=${emailParam}`
      : `/app/login?${statusParam}&email=${emailParam}`;
    const timer = setTimeout(() => navigate(targetUrl), 2600);
    return () => clearTimeout(timer);
  }, [success, tokenContext, navigate]);

  // Déterminer la configuration UI selon le contexte retourné par le backend
  const contextKey = tokenContext?.context || "activation";
  const isClient = tokenContext?.isClient || false;
  const ui = CONTEXT_CONFIG[contextKey]?.[isClient ? "client" : "internal"] || CONTEXT_CONFIG.activation.internal;

  // Calcul force du mot de passe
  const pwdStrength = (() => {
    if (password.length === 0) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 1) return { label: "Faible", color: "#ef4444", width: "25%" };
    if (score <= 3) return { label: "Moyen", color: "#f59e0b", width: "60%" };
    return { label: "Fort", color: "#16a34a", width: "100%" };
  })();

  // ─── 4. Soumission du mot de passe ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe saisis ne sont pas identiques.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getSafeApiUrl("/api/auth/setup-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de l'enregistrement.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Écran de vérification initiale ─────────────────────────────────────────
  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main,#f8fafc)] p-4">
        <div className="card w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
          <Loader2 size={36} className="animate-spin text-slate-700 mx-auto mb-4" />
          <p className="text-sm text-slate-600 font-medium">Vérification de votre lien en cours...</p>
        </div>
      </div>
    );
  }

  // ─── Écran de lien invalide ou expiré ────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main,#f8fafc)] p-4">
        <div className="card w-full max-w-md p-8 bg-white border-t-4 border-t-red-500 border border-slate-200 rounded-2xl shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertCircle size={28} />
          </div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 mb-3">
            Lien expiré ou invalide
          </span>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Ce lien n'est plus accessible</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            {tokenError}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-left text-xs text-slate-600 mb-6">
            <p className="font-semibold text-slate-700 mb-1">Comment procéder ?</p>
            <p>
              Pour des raisons de sécurité, les liens d'activation sont limités dans le temps.
              Veuillez contacter votre interlocuteur MENUA CONSULTING ou utiliser la procédure de mot de passe oublié.
            </p>
          </div>

          <button
            onClick={() => navigate(tokenContext?.isClient ? "/client/login" : "/app/login")}
            className="w-full py-2.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            {tokenContext?.isClient ? "Retourner à la connexion Client" : "Retourner à la connexion Collaborateur"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Interface principale de saisie du mot de passe ─────────────────────────
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main,#f8fafc)] p-4">
      <div
        className="card w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-md transition-all"
        style={{ borderTop: `4px solid ${ui.accentColor}` }}
      >
        {/* En-tête : Bannière logo Menua Consulting */}
        <div className="text-center mb-6">
          <div className="bg-[var(--primary,#141824)] p-4 flex items-center justify-center mb-4 rounded-xl shadow-sm">
            <img
              src="/logo.png"
              alt="Menua Consulting"
              style={{ height: "52px", objectFit: "contain" }}
            />
          </div>

          {/* Badge contextuel */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-2.5 shadow-2xs"
               style={{
                 borderColor: isClient ? "#f0d9a0" : "#cbd5e1",
                 backgroundColor: isClient ? "#fef9f0" : "#f1f5f9",
                 color: isClient ? "#a07340" : "#1e293b",
               }}>
            {isClient ? <Building2 size={13} /> : <UserCheck size={13} />}
            <span>{ui.badge}</span>
          </div>

          <h1 className="text-xl font-bold text-slate-800">
            {ui.title}
          </h1>

          {tokenContext?.userName && (
            <p className="text-xs font-medium text-slate-600 mt-1">
              {isClient ? "Client : " : "Collaborateur : "}
              <strong className="text-slate-900">{tokenContext.userName}</strong>
              {tokenContext?.userEmail && <span className="text-slate-400"> ({tokenContext.userEmail})</span>}
            </p>
          )}

          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
            {ui.subtitle}
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium mb-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* État de succès */}
        {success ? (
          <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-bold text-emerald-900 mb-1">
              {ui.successTitle}
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed mb-4">
              {ui.successMsg}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
              <Loader2 size={15} className="animate-spin" />
              <span>Redirection en cours...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nouveau mot de passe */}
            <div>
              <label
                htmlFor="setup-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {contextKey === "activation" ? "Nouveau mot de passe" : "Nouveau mot de passe"}
                <span className="text-red-500"> *</span>
              </label>
              <div className="relative">
                <input
                  id="setup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full p-2.5 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Jauge de force */}
              {pwdStrength && (
                <div className="mt-1.5">
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: pwdStrength.width, backgroundColor: pwdStrength.color }}
                    />
                  </div>
                  <p className="text-[11px] font-semibold mt-1" style={{ color: pwdStrength.color }}>
                    Niveau : {pwdStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label
                htmlFor="setup-confirm-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Confirmer le mot de passe
                <span className="text-red-500"> *</span>
              </label>
              <div className="relative">
                <input
                  id="setup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full p-2.5 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showConfirmPassword ? "Masquer" : "Afficher"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Indicateur visuel de correspondance */}
              {confirmPassword && (
                <div className="text-xs flex items-center gap-1 mt-1 font-medium">
                  {password === confirmPassword ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Les mots de passe correspondent
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
                      <AlertCircle size={13} /> Les mots de passe ne correspondent pas
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Aide sécurité */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} /> Critères recommandés :
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className={password.length >= 8 ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                  • 8 caractères min.
                </span>
                <span className={/[A-Z]/.test(password) ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                  • Une majuscule
                </span>
                <span className={/[0-9]/.test(password) ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                  • Un chiffre
                </span>
                <span className={/[^a-zA-Z0-9]/.test(password) ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                  • Un symbole
                </span>
              </div>
            </div>

            {/* Bouton de validation */}
            <button
              type="submit"
              disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
              className="btn btn-primary w-full mt-2 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              style={{
                backgroundColor: ui.accentColor,
                borderColor: ui.accentColor,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Enregistrement en cours..." : ui.btnLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupPasswordPage;
