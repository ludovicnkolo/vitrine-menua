import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

const ForgotPasswordPage = ({ portal: portalProp }) => {
  const location = useLocation();
  const portal = portalProp || (location.pathname.startsWith("/client") ? "client" : "team");
  const isClient = portal === "client";

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

  const loginUrl = isClient ? "/client/login" : "/app/login";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main,#f8fafc)] p-4">
      <div
        className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-md"
        style={{ borderTop: `4px solid ${isClient ? "#c99c5c" : "#141824"}` }}
      >
        {/* En-tête avec Logo Menua */}
        <div className="bg-[var(--primary,#141824)] p-4 rounded-xl flex items-center justify-center mb-5 shadow-sm">
          <img
            src="/logo.png"
            alt="Menua Consulting"
            style={{ height: "52px", objectFit: "contain" }}
          />
        </div>

        {submitted ? (
          <div className="text-center flex flex-col items-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-base font-bold text-slate-800">Lien sécurisé envoyé</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Si un compte est associé à <strong className="text-slate-800">{email}</strong>, un lien sécurisé de réinitialisation vous a été transmis par courrier électronique.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-500 text-left w-full mt-2">
              <p>⏱️ Le lien est valable pendant <strong>15 minutes</strong>. Pensez à vérifier vos dossiers courriers indésirables (spams) si vous ne le recevez pas rapidement.</p>
            </div>
            <Link
              to={loginUrl}
              className="btn btn-primary w-full mt-3 py-2.5 text-sm font-semibold text-center justify-center"
              style={isClient ? { backgroundColor: "#c99c5c", borderColor: "#c99c5c" } : {}}
            >
              Retour à la page de connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-1">
              <h1 className="text-lg font-bold text-slate-800">
                {isClient ? "Récupération d'accès client" : "Mot de passe oublié"}
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isClient
                  ? "Saisissez l'adresse e-mail de votre compte client pour recevoir un lien de réinitialisation sécurisé."
                  : "Saisissez votre e-mail collaborateur pour réinitialiser votre accès au CRM."}
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
                {isClient ? "Adresse e-mail client" : "Adresse e-mail"}
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-700 disabled:bg-slate-50 transition"
                placeholder={isClient ? "votre.email@entreprise.com" : "nom@menuaconsulting.com"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              style={isClient ? { backgroundColor: "#c99c5c", borderColor: "#c99c5c" } : {}}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>

            <Link
              to={loginUrl}
              className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Annuler et retourner à la connexion</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
