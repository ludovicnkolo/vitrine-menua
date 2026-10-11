import { getSafeApiUrl } from "../utils/helpers";
import { saveAuthSession } from "../services/api";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const form = e.currentTarget;
    const formEmail = (email || form.elements?.["login-email"]?.value || form.elements?.["email"]?.value || "").trim();
    const formPassword = password || form.elements?.["login-password"]?.value || form.elements?.["password"]?.value || "";

    if (!formEmail || !formPassword) {
      setError("Veuillez renseigner votre email et mot de passe.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getSafeApiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, password: formPassword }),
      });
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Réponse inattendue du serveur (${res.status})`);
      }
      if (data.success && data.user) {
        const token = data.token || "authenticated";
        saveAuthSession(data.user, token);
        onLogin(data.user, token);
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
        
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
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
                className="block font-medium" style={{marginBottom:"0.25rem"}}
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)"}}
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block font-medium" style={{marginBottom:"0.25rem"}}
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full" style={{padding:"0.75rem",paddingRight:"2.5rem",borderRadius:"8px",border:"1px solid var(--border)"}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer flex items-center justify-center" style={{right:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text-light, #6e7891)"}}
                  title={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-2 justify-center w-full" style={{padding:"0.85rem",fontSize:"1rem"}}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <div className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="inline-block font-medium p-2" style={{color:"var(--primary)",textDecoration:"underline",fontSize:"0.95rem"}}
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
