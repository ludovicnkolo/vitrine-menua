import React, { useState, useRef } from "react";
import { getSafeApiUrl } from "../utils/helpers";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [resetStep, setResetStep] = useState(1); // 1=ask email+pass, 2=verify otp
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await fetch(getSafeApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Un lien de réinitialisation sécurisé vous a été envoyé par e-mail.");
      } else {
        setError(data.error || "Erreur lors de la demande");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur: " + err.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await fetch(getSafeApiUrl("/api/auth/reset-password-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la connexion.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(data.error || "OTP invalide ou expiré");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center" style={{minHeight:"100vh",background:"var(--bg-main)"}}
    >
      <div
        className="card w-full p-8" style={{maxWidth:"400px"}}
      >
        <div className="text-center mb-8">
          <div
            className="bg-[var(--primary)] p-6 flex items-center justify-center mb-6" style={{borderRadius:"12px"}}
          >
            <img
              src="/logo.png"
              alt="Menua Consulting"
              style={{ height: "70px", objectFit: "contain" }}
            />
          </div>
        </div>

        {successMessage ? (
          <div className="text-center flex flex-col gap-4">
            <div className="p-4 font-medium" style={{background:"#D1FAE5",color:"#065F46",borderRadius:"8px"}}>
              {successMessage}
            </div>
            <Link
              to="/"
              className="btn btn-primary justify-center w-full" style={{padding:"0.85rem",fontSize:"1rem",textDecoration:"none"}}
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSendOtp}
            className="flex flex-col gap-4"
          >
            <h3 className="text-center">Réinitialiser le mot de passe</h3>
            {error && (
              <div style={{ padding: "0.75rem", background: "#FEE2E2", color: "#B91C1C", borderRadius: "8px" }}>
                {error}
              </div>
            )}
            <p className="text-center" style={{fontSize:"0.95rem",color:"var(--text-muted)"}}>
              Saisissez votre adresse e-mail. Nous vous enverrons un lien unique sécurisé.
            </p>
            <div>
              <label htmlFor="forgot-email" className="block font-medium" style={{marginBottom:"0.25rem"}}>
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-2 justify-center w-full" style={{padding:"0.85rem",fontSize:"1rem"}}
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
            <Link
              to="/"
              className="btn justify-center w-full" style={{border:"1px solid var(--border)",background:"transparent",textDecoration:"none"}}
            >
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
