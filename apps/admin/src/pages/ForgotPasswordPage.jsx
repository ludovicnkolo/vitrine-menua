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
        setSuccessMessage(""); // We don't show the big green alert for sending OTP
        setResetStep(2);
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-main)",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: "400px", width: "100%", padding: "2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              background: "var(--primary)",
              padding: "1.5rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src="/logo.png"
              alt="Menua Consulting"
              style={{ height: "70px", objectFit: "contain" }}
            />
          </div>
        </div>

        {resetStep === 1 ? (
          <form
            onSubmit={handleSendOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h3 style={{ margin: 0, textAlign: "center" }}>Réinitialiser le mot de passe</h3>
            {error && (
              <div style={{ padding: "0.75rem", background: "#FEE2E2", color: "#B91C1C", borderRadius: "8px" }}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="forgot-email" style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}>
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label htmlFor="new-password" style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}>
                Nouveau mot de passe
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: "0.5rem", justifyContent: "center", width: "100%", padding: "0.85rem", fontSize: "1rem" }}
            >
              {loading ? "Envoi..." : "Envoyer OTP"}
            </button>
            <Link
              to="/"
              className="btn"
              style={{ justifyContent: "center", width: "100%", border: "1px solid var(--border)", background: "transparent", textDecoration: "none" }}
            >
              Retour à la connexion
            </Link>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h3 style={{ margin: 0, textAlign: "center" }}>Validation OTP</h3>
            {error && (
              <div style={{ padding: "0.75rem", background: "#FEE2E2", color: "#B91C1C", borderRadius: "8px" }}>
                {error}
              </div>
            )}
            {successMessage && (
              <div style={{ padding: "0.75rem", background: "#D1FAE5", color: "#065F46", borderRadius: "8px" }}>
                {successMessage}
              </div>
            )}
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
              Un code de vérification vous a été envoyé par mail.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Code OTP (4 chiffres)
              </label>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^[0-9]*$/.test(val)) return;
                      const newOtp = [...otp];
                      newOtp[index] = val;
                      setOtp(newOtp);
                      if (val && index < 3) {
                        inputRefs.current[index + 1].focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        inputRefs.current[index - 1].focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
                      if (pastedData) {
                        const newOtp = ["", "", "", ""];
                        for (let i = 0; i < pastedData.length; i++) {
                          newOtp[i] = pastedData[i];
                        }
                        setOtp(newOtp);
                        const nextFocusIndex = Math.min(pastedData.length, 3);
                        inputRefs.current[nextFocusIndex].focus();
                      }
                    }}
                    required
                    style={{
                      width: "3rem",
                      height: "3.5rem",
                      padding: "0",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: "0.5rem", justifyContent: "center", width: "100%", padding: "0.85rem", fontSize: "1rem" }}
            >
              {loading ? "Validation..." : "Valider et réinitialiser"}
            </button>
            <button
              type="button"
              onClick={() => {
                setResetStep(1);
                setOtp(["", "", "", ""]);
              }}
              className="btn"
              style={{ justifyContent: "center", width: "100%", border: "1px solid var(--border)", background: "transparent" }}
            >
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
