import { getSafeApiUrl } from "../utils/helpers";

/**
 * Service Client HTTP unifié avec gestion automatique des jetons et des erreurs.
 */
class ApiClient {
  getToken() {
    return (
      sessionStorage.getItem("adminToken") ||
      localStorage.getItem("adminToken") ||
      ""
    );
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : getSafeApiUrl(endpoint);
    const token = this.getToken();

    const headers = {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (response.status === 401) {
      // Éventuelle redirection ou action de déconnexion globale
      const errorData = await response.json().catch(() => ({}));
      if (errorData.action === "FORCE_LOGOUT") {
        sessionStorage.removeItem("adminToken");
        localStorage.removeItem("adminToken");
      }
      throw new Error(errorData.error || "Session expirée. Veuillez vous reconnecter.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || errorData.message || `Erreur serveur (${response.status})`;
      throw new Error(message);
    }

    return response.json().catch(() => ({ success: true }));
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: "GET", headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: "POST", body, headers });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: "PUT", body, headers });
  }

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: "PATCH", body, headers });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: "DELETE", headers });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
