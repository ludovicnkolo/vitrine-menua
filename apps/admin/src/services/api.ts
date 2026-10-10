import { getSafeApiUrl } from "../utils/helpers";

/**
 * Configure global fetch interceptor to inject credentials and handle 401/403.
 * Should be called once at application startup.
 */
export function setupFetchInterceptor(onSessionExpired: () => void) {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      let [url, options] = args;
      options = options || {};
      options.credentials = "include"; // Forcer l'envoi du cookie HttpOnly
      
      const token = sessionStorage.getItem("adminToken");
      const headersObj = options.headers ? new Headers(options.headers) : new Headers();

      const currentAuth = headersObj.get("Authorization");
      if (currentAuth === "Bearer null" || currentAuth === "Bearer undefined" || currentAuth === "Bearer ") {
        headersObj.delete("Authorization");
      }

      if (!headersObj.has("Authorization") && token && token !== "null" && token !== "undefined") {
        headersObj.set("Authorization", `Bearer ${token}`);
      }

      options.headers = headersObj;

      const response = await originalFetch(url, options);
      
      if (response.status === 401) {
        const clone = response.clone();
        try {
          const data = await clone.json();
          if (data?.action === "FORCE_LOGOUT" || response.status === 401) {
            console.error("Accès révoqué ou session expirée. Déconnexion forcée.");
            onSessionExpired();
          }
        } catch (e) {
          onSessionExpired();
        }
      }
      return response;
    } catch (err) {
      throw err;
    }
  };
}
