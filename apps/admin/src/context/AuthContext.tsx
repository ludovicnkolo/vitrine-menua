import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserData, Role } from "../types/auth";
import { ALLOWED_ROLES } from "../constants/roles";
import { getSafeApiUrl } from "../utils/helpers";
import {
  getStoredUser,
  getStoredToken,
  saveAuthSession,
  clearAuthSession,
  redirectToLogin,
  setupFetchInterceptor,
} from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: UserData, token?: string) => void;
  logout: (reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (!token || !storedUser) {
      clearAuthSession();
      return null;
    }
    return storedUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => Boolean(getStoredToken() && getStoredUser())
  );

  const handleLogout = async (reason = "") => {
    try {
      await fetch(getSafeApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignorer l'erreur réseau — on se déconnecte quand même
    }
    setIsAuthenticated(false);
    setUser(null);
    redirectToLogin(reason || "logout");
  };

  // Synchronisation et validation initiale
  useEffect(() => {
    setupFetchInterceptor((reason = "expired") => {
      setIsAuthenticated(false);
      setUser(null);
      redirectToLogin(reason);
    });

    if (localStorage.getItem("adminTheme") === "dark") {
      document.body.classList.add("dark");
    }

    // Si utilisateur ou token manquant lors du montage -> déconnexion immédiate
    const currentToken = getStoredToken();
    const currentUser = getStoredUser();
    if ((!currentToken || !currentUser) && (user || isAuthenticated)) {
      console.warn("[AUTH] Session incomplète (token ou utilisateur manquant). Redirection...");
      handleLogout("expired");
    }
  }, []);

  // Timer d'inactivité et Ping
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.warn("Déconnexion automatique pour inactivité (1h).");
        handleLogout("expired");
      }, 3600000); // 1 hour
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => document.addEventListener(event, resetTimer, true));
    resetTimer();

    const pingInterval = setInterval(async () => {
      try {
        const res = await window.fetch(getSafeApiUrl("/api/auth/verify"), {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.roleChanged === true) {
            console.warn("Rôle modifié par l'administrateur. Reconnexion requise.");
            handleLogout("role_changed");
          }
        } else if (res.status === 401 || res.status === 403) {
          console.warn("Vérification de session échouée. Déconnexion immédiate.");
          handleLogout("expired");
        }
      } catch (e) {
        // network err
      }
    }, 15000);

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetTimer, true));
      clearTimeout(inactivityTimer);
      clearInterval(pingInterval);
    };
  }, [user]);

  const login = (userData: UserData, token?: string) => {
    const role = String(userData?.role || "SANS ROLE").trim() as Role;
    if (!ALLOWED_ROLES.includes(role)) {
      console.error("Rôle utilisateur non autorisé.");
      return;
    }

    const email = String(userData?.email || "").trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.error("Email invalide.");
      return;
    }

    const id = String(userData?.id || "").replace(/[^a-zA-Z0-9-]/g, "");
    if (!id || id.length > 50) {
      console.error("ID invalide.");
      return;
    }

    const name = String(userData?.name || "").trim().replace(/[<>]/g, "");

    const cleanUserData: User = { id, email, name, role };
    const validToken = token || getStoredToken() || "";
    saveAuthSession(cleanUserData, validToken);
    setIsAuthenticated(Boolean(validToken));
    setUser(cleanUserData);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
