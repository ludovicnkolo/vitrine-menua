/**
 * Retourne l'URL de base du frontend d'administration CRM.
 * Adapte automatiquement le domaine selon l'environnement d'origine :
 * - En local (navigateur sur localhost / dev) -> renvoie l'URL locale (ex: http://localhost:5173)
 * - En production (navigateur sur menuaconsulting.com) -> renvoie l'URL de production (https://crm-admin.menuaconsulting.com)
 * - Fallback si pas de requête : vérifie NODE_ENV ('production' vs 'development')
 */
const getAdminUrl = (req) => {
  // 1. Détection prioritaire via l'en-tête Origin ou Referer envoyé par le navigateur frontend
  const origin = req?.headers?.origin || req?.headers?.referer;
  if (origin) {
    try {
      const u = new URL(origin);
      // Si l'utilisateur est sur localhost ou 127.0.0.1 (développement local)
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        return `${u.protocol}//${u.host}`;
      }
      // Si l'utilisateur est sur le domaine officiel de production
      if (u.hostname.includes("menuaconsulting.com")) {
        return `${u.protocol}//${u.host}`;
      }
    } catch (_) {}
  }

  // 2. Détection via Host ou X-Forwarded-Host (Reverse proxy ou direct)
  const forwardedHost = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  if (forwardedHost) {
    if (forwardedHost.includes("localhost") || forwardedHost.includes("127.0.0.1")) {
      const port = forwardedHost.includes(":5174") ? "5174" : "5173";
      return `http://localhost:${port}`;
    }
    if (forwardedHost.includes("menuaconsulting.com")) {
      const proto = req?.headers?.["x-forwarded-proto"] || "https";
      return `${proto}://${forwardedHost}`;
    }
  }

  // 3. Fallback sans requête HTTP : vérification du mode NODE_ENV
  if (process.env.NODE_ENV === "production") {
    const prodUrl = process.env.ADMIN_FRONTEND_URL || process.env.ADMIN_URL;
    if (prodUrl && !prodUrl.includes("localhost")) {
      return prodUrl.replace(/\/+$/, "");
    }
    return "https://crm-admin.menuaconsulting.com";
  }

  // 4. Fallback par défaut en environnement local
  const localUrl = process.env.LOCAL_ADMIN_URL || "http://localhost:5173";
  return localUrl.replace(/\/+$/, "");
};

module.exports = { getAdminUrl };
