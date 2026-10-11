import { getSafeApiUrl } from "../utils/helpers";
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setTimeout(() => setError(null), 3000);
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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setTimeout(() => setError(null), 3000);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="flex items-center justify-center" style={{height:"100vh",background:"#F8FAFC"}}
      >
        <div className="card text-center" style={{maxWidth:400}}>
          <h2 className="mb-4" style={{color:"#E53E3E"}}>
            Lien invalide
          </h2>
          <p>Le lien d'activation est manquant ou incorrect.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center" style={{height:"100vh",background:"#F8FAFC"}}
    >
      <div
        className="card w-full p-8" style={{maxWidth:400}}
      >
        <div className="text-center mb-8">
          <div
            className="bg-[var(--primary)] text-white p-4 mb-6" style={{borderRadius:"8px"}}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "1.2rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              MENUA CONSULTING
            </h1>
          </div>
          <h2 className="font-semibold" style={{fontSize:"1.5rem"}}>
            Activer votre compte
          </h2>
          <p
            className="mt-2" style={{color:"var(--text-muted)"}}
          >
            Veuillez configurer votre mot de passe pour accéder au CRM.
          </p>
        </div>

        {error && (
          <div
            className="p-4 mb-4 text-center" style={{background:"#FEE2E2",color:"#DC2626",borderRadius:"8px"}}
          >
            {error}
          </div>
        )}

        {success ? (
          <div
            className="p-4 text-center" style={{background:"#D1FAE5",color:"#059669",borderRadius:"8px"}}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>Compte activé !</h3>
            <p style={{ margin: 0,  }}>
              Redirection vers la page de connexion...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="setup-password"
                className="block mb-2 font-medium"
              >
                Nouveau mot de passe
              </label>
              <input
                id="setup-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC"}}
              />
            </div>
            <div>
              <label
                htmlFor="setup-confirm-password"
                className="block mb-2 font-medium"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="setup-confirm-password"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC"}}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 justify-center p-3"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Activer mon compte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupPasswordPage;
