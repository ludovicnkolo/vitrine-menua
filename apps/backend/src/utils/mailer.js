const nodemailer = require('nodemailer');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('[Mailer] FATAL: SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in environment variables.');
}

const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,    // No fallback — must be explicit
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: false,
  debug: false
});

module.exports = { transporter };
