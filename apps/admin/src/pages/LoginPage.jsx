import { getSafeApiUrl } from "../utils/helpers";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "expired") {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getSafeApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Réponse inattendue du serveur (${res.status})`);
      }
      if (data.success && data.token) {
        onLogin(data.token, data.user);
      } else {
        setError(data.error || "Identifiants invalides");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur: " + err.message);
      setTimeout(() => setError(""), 3000);
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
        
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#FEE2E2",
                  color: "#B91C1C",
                  borderRadius: "8px",
                  
                }}
              >
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  
                  fontWeight: 500,
                }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  marginBottom: "0.25rem",
                  fontWeight: 500,
                }}
              >
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                marginTop: "0.5rem",
                justifyContent: "center",
                width: "100%",
                padding: "0.85rem",
                fontSize: "1rem"
              }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <Link
                to="/forgot-password"
                style={{
                  display: "inline-block",
                  color: "var(--primary)",
                  textDecoration: "underline",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  padding: "0.5rem"
                }}
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
