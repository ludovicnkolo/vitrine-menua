/**
 * Retourne l'URL de base du frontend d'administration CRM.
 * Détecte intelligemment le domaine de production si la requête provient de Nginx/reverse proxy,
 * ou utilise les variables d'environnement appropriées.
 */
const getAdminUrl = (req) => {
  // 1. Détecter si la requête HTTP entrante vient du domaine de prod (via origin ou referer)
  const origin = req?.headers?.origin || req?.headers?.referer;
  if (origin) {
    try {
      const u = new URL(origin);
      if (u.hostname.includes("menuaconsulting.com")) {
        return `${u.protocol}//${u.host}`;
      }
    } catch (_) {}
  }

  // 2. Détecter si le reverse proxy Nginx transmet le domaine de prod
  const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  if (host && host.includes("menuaconsulting.com")) {
    const proto = req?.headers?.["x-forwarded-proto"] || "https";
    return `${proto}://${host}`;
  }

  // 3. Variable d'environnement explicite si définie et non localhost
  const envUrl = process.env.ADMIN_FRONTEND_URL || process.env.ADMIN_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }

  // 4. Si en mode production
  if (process.env.NODE_ENV === "production") {
    return "https://crm-admin.menuaconsulting.com";
  }

  // 5. Fallback variable d'environnement ou localhost en dev
  return (envUrl || "http://localhost:5173").replace(/\/+$/, "");
};

module.exports = { getAdminUrl };
