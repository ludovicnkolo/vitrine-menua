async function verifyTurnstile(token, ip) {
  if (process.env.NODE_ENV !== "production" || !process.env.TURNSTILE_SECRET_KEY) {
    // If not in production mode or no secret key is configured, bypass validation
    console.warn(
      "Turnstile validation bypassed (Development mode or TURNSTILE_SECRET_KEY missing).",
    );
    return true;
  }

  try {
    const body = {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    };
    if (ip) {
      body.remoteip = ip;
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
