import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

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
      : `/login?${statusParam}&email=${emailParam}`;
    const timer = setTimeout(() => navigate(targetUrl), 2400);
    return () => clearTimeout(timer);
  }, [success, tokenContext, navigate]);

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
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-4">
        <div className="w-full max-w-[360px] p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm text-center">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-sm text-slate-600 font-medium">Vérification de votre lien en cours...</p>
        </div>
      </div>
    );
  }

  // ─── Écran de lien invalide ou expiré ────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-4">
        <div className="w-full max-w-[360px] p-7 bg-white border border-slate-200/90 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">Lien expiré ou invalide</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            {tokenError}
          </p>
          <button
            onClick={() => navigate(tokenContext?.isClient ? "/client/login" : "/login")}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Retourner à la connexion
          </button>
        </div>
      </div>
    );
  }

  // ─── Interface principale — Identique au design Image 1 ──────────────────────
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-4">
      <div className="w-full max-w-[360px] bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-7 transition-all">
        {/* Logo dans carré sombre centré */}
        <div className="w-14 h-14 bg-[#142340] rounded-xl flex items-center justify-center mx-auto mb-6 p-2 shadow-xs">
          <img
            src="/logo.png"
            alt="Menua Consulting"
            className="max-h-8 max-w-full object-contain"
          />
        </div>

        {/* Titre : Nouveau mot de passe */}
        <h1 className="text-[28px] font-bold text-slate-900 text-center mb-7 leading-[1.2] tracking-tight">
          Nouveau<br />mot de passe
        </h1>

        {/* Alerte Erreur */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium mb-4">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* État Succès */}
        {success ? (
          <div className="text-center py-4 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-base font-bold text-emerald-900 mb-1">Mot de passe enregistré !</h3>
            <p className="text-xs text-emerald-700 leading-relaxed mb-4">
              Votre nouveau mot de passe a été configuré avec succès.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
              <Loader2 size={14} className="animate-spin" />
              <span>Redirection en cours...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Champ 1 : Mot de passe */}
            <div>
              <label
                htmlFor="setup-password"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Mot de passe
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
                  placeholder="8 caractères min."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Champ 2 : Confirmer */}
            <div>
              <label
                htmlFor="setup-confirm-password"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Confirmer
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
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupPasswordPage;
