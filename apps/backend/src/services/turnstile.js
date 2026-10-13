async function verifyTurnstile(token, ip) {
  const isProduction = process.env.NODE_ENV === "production";
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // En production, la clé est obligatoire — bloquer si absente
  if (isProduction && !secretKey) {
    console.error(
      "[SECURITE][Turnstile] TURNSTILE_SECRET_KEY absent en production. Requête rejetée par sécurité."
    );
    return false;
  }

  // Hors production (développement, test) : bypass autorisé avec avertissement
  if (!isProduction || !secretKey) {
    console.warn(
      "[Turnstile] Validation contournée (mode développement — TURNSTILE_SECRET_KEY non configuré)."
    );
    return true;
  }

  try {
    const body = {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    };
    if (ip) {
      const cleanIp = typeof ip === "string" ? ip.split(",")[0].trim() : ip;
      if (cleanIp) {
        body.remoteip = cleanIp;
      }
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();
    if (!data.success) {
      console.error("Turnstile verification failed:", data);
    }
    return data.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

module.exports = { verifyTurnstile };
