import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Nettoyage sécurisé des minuteurs pour éviter les fuites de mémoire
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!success) return;
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 2500);
    return () => clearTimeout(redirectTimer);
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe saisis ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getSafeApiUrl(`/api/auth/setup-password`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de l'activation.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-slate-50 p-4"
      >
        <div className="card text-center max-w-md w-full p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Lien d'activation manquant ou invalide
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Le lien d'invitation est incomplet ou a expiré. Veuillez contacter un administrateur pour recevoir une nouvelle invitation.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-outline w-full py-2.5 text-sm"
          >
            Retourner à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-slate-50 p-4"
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div
            className="bg-[var(--primary)] text-white p-3.5 mb-6 rounded-xl shadow-sm"
          >
            <h1
              className="text-sm font-extrabold uppercase tracking-widest"
              style={{ margin: 0 }}
            >
              MENUA CONSULTING
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Activer votre compte
          </h2>
          <p
            className="mt-2 text-sm text-slate-500"
          >
            Configurez votre mot de passe pour accéder à votre espace CRM.
          </p>
        </div>

        {error && (
          <div
            className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div
            className="flex flex-col items-center p-6 text-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
          >
            <div className="w-12 h-12 mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold mb-1">Compte activé avec succès !</h3>
            <p className="text-sm text-emerald-700">
              Redirection automatique vers la page de connexion...
            </p>
            <Loader2 size={18} className="animate-spin mt-4 text-emerald-600" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="setup-password"
                className="block mb-1.5 text-xs font-semibold text-slate-700"
              >
                <span>Nouveau mot de passe <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  id="setup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full pr-10 pl-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Masquer" : "Afficher"}
                >
                  <span className="flex items-center">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="setup-confirm-password"
                className="block mb-1.5 text-xs font-semibold text-slate-700"
              >
                <span>Confirmer le mot de passe <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  id="setup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full pr-10 pl-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showConfirmPassword ? "Masquer" : "Afficher"}
                >
                  <span className="flex items-center">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </button>
              </div>
            </div>

            {/* Aide visuelle sur la correspondance */}
            <div className="text-xs flex items-center gap-1.5 mt-0.5 min-h-[20px]">
              {confirmPassword ? (
                password === confirmPassword ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Les mots de passe correspondent</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>Les mots de passe sont différents</span>
                  </span>
                )
              ) : null}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 justify-center py-2.5 text-sm font-semibold flex items-center gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>{loading ? "Enregistrement en cours..." : "Activer mon compte"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupPasswordPage;

