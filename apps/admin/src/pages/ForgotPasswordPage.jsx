import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Veuillez renseigner votre adresse e-mail.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(getSafeApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Impossible d'envoyer le lien de réinitialisation.");
      }
    } catch {
      setError("Erreur réseau. Impossible de contacter le serveur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)] p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="bg-[var(--primary)] p-5 rounded-xl flex items-center justify-center mb-6 shadow-sm">
          <img
            src="/logo.png"
            alt="Menua Consulting"
            style={{ height: "56px", objectFit: "contain" }}
          />
        </div>

        {submitted ? (
          <div className="text-center flex flex-col items-center gap-4 py-2">
            <CheckCircle2 size={48} className="text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">E-mail de réinitialisation envoyé</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Si un compte est associé à <strong>{email}</strong>, un lien sécurisé vous a été transmis par courrier électronique.
            </p>
            <Link
              to="/"
              className="btn btn-primary w-full mt-2 py-2.5 text-sm font-semibold text-center justify-center"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <h1 className="text-lg font-bold text-slate-800">Mot de passe oublié</h1>
              <p className="text-xs text-slate-500 mt-1">
                Saisissez votre e-mail pour recevoir un lien d'activation sécurisé.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse e-mail
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50"
                placeholder="nom@menuaconsulting.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>

            <Link
              to="/"
              className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 text-center"
            >
              Annuler
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

