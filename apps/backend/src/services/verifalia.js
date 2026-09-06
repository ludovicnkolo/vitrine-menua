const axios = require('axios');
const https = require('https');
// Force IPv4-only — avoids ETIMEDOUT on IPv6-unreachable networks
const httpsAgent = new https.Agent({ family: 4 });

/**
 * VerifaliaService — Email validation via Verifalia API v2.7
 * Credentials MUST be provided via environment variables.
 * Never fallback to hardcoded secrets.
 */
class VerifaliaService {
  constructor() {
    this.baseUrl = 'https://api.verifalia.com/v2.7';
    // No fallback values — fail fast if env vars are missing
    this.username = process.env.VERIFALIA_USERNAME;
    this.password = process.env.VERIFALIA_PASSWORD;
    this.token = null;
    this.tokenExpiresAt = null;
    
    // Circuit Breaker state
    this.pauseUntil = null;
    this.pauseReason = null; // 'QUOTA' or 'API_ERROR'
    
    // Shared axios instance: IPv4 only, 15s timeout
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      httpsAgent
    });
  }

  isPaused() {
    if (this.pauseUntil && Date.now() < this.pauseUntil) {
      return true;
    }
    if (this.pauseUntil && Date.now() >= this.pauseUntil) {
      console.log(`[Verifalia] Pause expired (${this.pauseReason}). Resuming API checks.`);
      this.pauseUntil = null;
      this.pauseReason = null;
    }
    return false;
  }

  setPause(reason) {
    if (reason === 'QUOTA') {
      this.pauseUntil = Date.now() + 24 * 60 * 60 * 1000;
      this.pauseReason = 'QUOTA';
      console.warn(`[Verifalia] Quota exceeded (402). API globally paused for 24 hours.`);
    } else if (reason === 'API_ERROR' && this.pauseReason !== 'QUOTA') {
      this.pauseUntil = Date.now() + 2 * 60 * 60 * 1000;
      this.pauseReason = 'API_ERROR';
      console.warn(`[Verifalia] Network/API Error. API globally paused for 2 hours.`);
    }
  }


  /**
   * Validates that required env vars are present.
   * Call this at application startup — fail loudly instead of silently.
   */
  validateConfig() {
    if (!this.username || !this.password) {
      throw new Error(
        '[Verifalia] FATAL: VERIFALIA_USERNAME and VERIFALIA_PASSWORD must be set in environment variables. ' +
        'Never hardcode credentials in source code.'
      );
    }
  }

  async getToken() {
    if (!this.username || !this.password) {
      throw new Error('[Verifalia] Missing credentials. Set VERIFALIA_USERNAME and VERIFALIA_PASSWORD env vars.');
    }
    // Return cached token if still valid (60s buffer before expiry)
    if (this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60000) {
      return this.token;
    }

    try {
      const response = await this.client.post('/auth/tokens', {
        username: this.username,
        password: this.password
      });
      this.token = response.data.accessToken;
      // Decode JWT exp claim to cache the token until it expires
      const payload = JSON.parse(Buffer.from(this.token.split('.')[1], 'base64').toString());
      this.tokenExpiresAt = payload.exp * 1000;
      return this.token;
    } catch (error) {
      // Never log credentials — only log the HTTP status
      const status = error.response?.status;
      console.error(`[Verifalia] Auth failed — HTTP ${status ?? 'NETWORK_ERROR'}`);
      throw new Error(`[Verifalia] Authentication failed: ${status ?? error.message}`);
    }
  }

  async submitVerification(email) {
    const token = await this.getToken();
    try {
      const response = await this.client.post('/email-validations', {
        entries: [{ inputData: email }]
        // quality and retention not set — uses MENUA account defaults (Standard / 5 min) configured by admin
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.overview;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 402) {
          const err = new Error('Verifalia Quota Exceeded');
          err.code = 'QUOTA_EXCEEDED';
          this.setPause('QUOTA');
          throw err;
        }
        if (error.response.status === 429) {
          const err = new Error('Verifalia Throttling');
          err.code = 'THROTTLED';
          this.setPause('API_ERROR');
          throw err;
        }
        this.setPause('API_ERROR');
        throw new Error(`Verifalia API Error: ${error.response.status} — ${JSON.stringify(error.response.data)}`);
      }
      this.setPause('API_ERROR');
      throw error;
    }
  }

  async getJobEntries(jobId) {
    const token = await this.getToken();
    try {
      const response = await this.client.get(`/email-validations/${jobId}/entries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data; // { data: [...entries] }
    } catch (error) {
      if (error.response) {
        throw new Error(`Verifalia getJobEntries Error: ${error.response.status}`);
      }
      throw error;
    }
  }

  async getJob(jobId) {
    const token = await this.getToken();
    try {
      const response = await this.client.get(`/email-validations/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.overview;
    } catch (error) {
      if (error.response) {
        throw new Error(`Verifalia getJob Error: ${error.response.status}`);
      }
      throw error;
    }
  }

  /**
   * Attempts to verify an email immediately (synchronously from the user's perspective).
   * Polls for completion for a maximum of ~4 seconds.
   * 
   * @returns {Object} { status: 'VALID' | 'INVALID' | 'DEFERRED', reason?: string, jobId?: string }
   */
  async verifyEmailImmediate(email) {
    if (this.isPaused()) {
      return { status: 'DEFERRED' };
    }

    try {
      const job = await this.submitVerification(email);
      let fetchedJob = job;
      let attempts = 0;
      
      // Wait for completion (max 6 attempts, 1s apart = 6s total)
      while (fetchedJob.status !== 'Completed' && attempts < 6) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        fetchedJob = await this.getJob(job.id);
        attempts++;
      }

      if (fetchedJob.status === 'Completed') {
        const entriesData = await this.getJobEntries(job.id);
        const result = entriesData.data[0];
        
        // Verifalia Classifications: Deliverable, Undeliverable, Risky, Unknown
        if (result.classification === 'Undeliverable' || result.isDisposableEmailAddress) {
          return { status: 'INVALID', reason: 'Email invalide, inexistant ou jetable' };
        }
        
        if (result.classification === 'Deliverable' && !result.isDisposableEmailAddress) {
          return { status: 'VALID' };
        }

        return {
          status: 'DEFERRED',
          jobId: job.id,
          reason: result.classification || 'Unknown'
        };
      }

      // If not completed in time, defer it to cron
      return { status: 'DEFERRED', jobId: job.id };
    } catch (error) {
      console.error('[Verifalia] Immediate verification failed, deferring to cron:', error.message);
      // Quota exceeded, throttling, or network errors -> Defer to background processing
      return { status: 'DEFERRED' };
    }
  }
}

module.exports = new VerifaliaService();
