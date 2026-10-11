import { getSafeApiUrl } from "../utils/helpers";

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminUser");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const userStr = sessionStorage.getItem("adminUser") || localStorage.getItem("adminUser");
  if (!userStr || userStr === "null" || userStr === "undefined") return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function saveAuthSession(user: any, token: string) {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem("adminToken", token);
    localStorage.setItem("adminToken", token);
  }
  if (user) {
    const userStr = JSON.stringify(user);
    sessionStorage.setItem("adminUser", userStr);
    localStorage.setItem("adminUser", userStr);
  }
}

let isRedirecting = false;
export function redirectToLogin(reason = "expired") {
  if (typeof window === "undefined" || isRedirecting) return;
  isRedirecting = true;
  clearAuthSession();
  window.location.href = `/?logout=${reason}`;
}

let interceptorInstalled = false;

/**
 * Configure global fetch interceptor to inject credentials and handle 401/403.
 * Should be called once at application startup.
 */
export function setupFetchInterceptor(onSessionExpired?: () => void) {
  if (typeof window === "undefined" || interceptorInstalled) return;
  interceptorInstalled = true;

  const originalFetch = window.fetch;

  window.fetch = async (...args: any[]) => {
    try {
      let [input, options] = args;
      options = options ? { ...options } : {};
      options.credentials = "include"; // Forcer l'envoi du cookie HttpOnly

      const urlString = typeof input === "string" 
        ? input 
        : (input instanceof URL ? input.toString() : (input && (input as Request).url ? (input as Request).url : ""));

      // Ne pas déconnecter sur les routes publiques d'authentification
      const isPublicAuthRoute = 
        urlString.includes("/api/auth/login") ||
        urlString.includes("/api/auth/forgot-password") ||
        urlString.includes("/api/auth/setup-password") ||
        urlString.includes("/api/auth/verify-magic");

      const token = getStoredToken();
      const headers = new Headers(options.headers || (input instanceof Request ? input.headers : {}));

      const currentAuth = headers.get("Authorization");
      if (currentAuth === "Bearer null" || currentAuth === "Bearer undefined" || currentAuth === "Bearer ") {
        headers.delete("Authorization");
      }

      if (!headers.has("Authorization") && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      options.headers = headers;

      const response = await originalFetch(input, options);

      // Si 401 (token manquant, invalide ou session expirée) ou 403 avec ordre de déconnexion
      if ((response.status === 401 || response.status === 403) && !isPublicAuthRoute) {
        let shouldLogout = response.status === 401;
        if (!shouldLogout) {
          try {
            const clone = response.clone();
            const data = await clone.json();
            if (data?.action === "FORCE_LOGOUT" || data?.error?.toLowerCase().includes("bloqué")) {
              shouldLogout = true;
            }
          } catch {
            // Ignorer l'erreur de parsing JSON
          }
        }

        if (shouldLogout) {
          console.warn("[AUTH] Session expirée ou non autorisée. Déconnexion immédiate...");
          if (onSessionExpired) {
            onSessionExpired();
          } else {
            redirectToLogin("expired");
          }
        }
      }

      return response;
    } catch (err) {
      throw err;
    }
  };
}
