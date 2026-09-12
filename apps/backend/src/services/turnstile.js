async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    // If no secret key is configured, bypass for local dev, but warn in production
    console.warn('TURNSTILE_SECRET_KEY is not set. Bypassing Turnstile validation.');
    return true;
  }

  try {
    const body = {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token
    };
    if (ip) {
      body.remoteip = ip;
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!data.success) {
      console.error('Turnstile verification failed:', data);
    }
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

module.exports = { verifyTurnstile };
