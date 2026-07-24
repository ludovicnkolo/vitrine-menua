require('dotenv').config({ path: '/home/kratos-financials-inc/Documents/kratos/site_web/.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: process.env.SMTP_FROM || 'contact@menuaconsulting.com',
  to: process.env.CONTACT_EMAIL_TO || 'contact@menuaconsulting.com',
  subject: 'Test de routage e-mail',
  text: 'Ceci est un test pour vérifier où atterrit cet e-mail.'
};

transporter.sendMail(mailOptions)
  .then(info => console.log('Email envoyé:', info))
  .catch(err => console.error('Erreur SMTP:', err));
