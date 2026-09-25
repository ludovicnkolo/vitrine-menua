const messages = require("../config/messages.json");

/**
 * Retourne le message traduit selon la clé et la langue.
 * @param {string} key - La clé du message dans messages.json
 * @param {string} lang - La langue ('fr' ou 'en'), par défaut 'fr'
 * @returns {string} Le message traduit
 */
const getMessage = (key, lang = "fr") => {
  const normalizedLang = ["fr", "en"].includes(lang?.toLowerCase())
    ? lang.toLowerCase()
    : "fr";
  if (messages[key]) {
    return messages[key][normalizedLang] || messages[key]["fr"];
  }
  return key; // Retourne la clé par défaut si non trouvée
};

/**
 * Génère une réponse JSON standardisée.
 * @param {Object} res - L'objet réponse Express
 * @param {number} statusCode - Code HTTP (ex: 200, 400, 500)
 * @param {string} messageKey - Clé du message (ex: 'SUCCESS_CONTACT')
 * @param {string} lang - Langue de la requête
 * @param {Object} [data] - Données additionnelles éventuelles
 */
const sendResponse = (res, statusCode, messageKey, lang = "fr", data = {}) => {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  const message = getMessage(messageKey, lang);

  const responseBody = {
    success: isSuccess,
    code: messageKey,
    ...(isSuccess ? { message } : { error: message }),
    ...data,
  };

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  getMessage,
  sendResponse,
};
