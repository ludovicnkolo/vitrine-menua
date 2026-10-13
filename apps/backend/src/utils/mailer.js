const nodemailer = require("nodemailer");

const getTransporter = () => {
  const smtpPort = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "ssl0.ovh.net",
    port: smtpPort,
    secure: smtpSecure,
    requireTLS: !smtpSecure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: false,
    debug: false,
  });
};

const transporter = {
  sendMail: async (...args) => {
    const t = getTransporter();
    return t.sendMail(...args);
  },
  verify: async () => {
    const t = getTransporter();
    return t.verify();
  },
};

module.exports = { transporter, getTransporter };
