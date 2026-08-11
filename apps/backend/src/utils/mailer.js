const nodemailer = require('nodemailer');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('[Mailer] FATAL: SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in environment variables.');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,    // No fallback — must be explicit
  port: Number.parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: false,
  debug: false
});

module.exports = { transporter };
