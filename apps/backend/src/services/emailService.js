const { transporter } = require('../utils/mailer');
const fs = require('node:fs');
const path = require('node:path');

const buildEmailTemplate = (title, contentHTML) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-top: 5px solid #141824; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 40px; text-align: center; border-bottom: 1px solid #e8e1d7;">
        <h1 style="color: #141824; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 3px;">MENUA CONSULTING</h1>
        <p style="color: #6e7891; margin: 15px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">${title}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px;">
        ${contentHTML}
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 40px; background-color: #141824; border-radius: 0 0 4px 4px; text-align: center;">
        <p style="color: #e8e1d7; margin: 0; font-size: 11px; text-transform: none; letter-spacing: 1.5px;">Cet email a été envoyé depuis le site https://menuaconsulting.com/</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendAutoReply = async (email) => {
  const isEn = false; // We can default to FR if language isn't stored in DB

  const subject = isEn 
    ? 'MENUA CONSULTING — We have received your request'
    : 'MENUA CONSULTING — Nous avons bien reçu votre demande';

  const text = isEn 
    ? `Hello,\n\nWe confirm receipt of your request addressed to MENUA CONSULTING.\nOur team will review it and get back to you to clarify your needs.\n\nTo protect your information, please do not send any sensitive documents by return\nemail unless requested to do so.\n\nBest regards,\nMENUA CONSULTING\nYour operations. Our expertise.`
    : `Bonjour,\n\nNous vous confirmons la bonne réception de votre demande adressée à MENUA CONSULTING.\nNotre équipe va en prendre connaissance et reviendra vers vous afin de préciser votre besoin.\n\nPour protéger vos informations, merci de ne pas transmettre de document sensible par retour\nd'e-mail sans y avoir été invité.\n\nBien cordialement,\nMENUA CONSULTING\nVos opérations. Notre expertise.`;

  const html = buildEmailTemplate(subject, `
    <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin-bottom: 15px;">
      ${isEn ? 'Hello,' : 'Bonjour,'}
    </p>
    <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin-bottom: 15px;">
      ${isEn 
        ? 'We confirm receipt of your request addressed to MENUA CONSULTING.<br>Our team will review it and get back to you to clarify your needs.' 
        : 'Nous vous confirmons la bonne réception de votre demande adressée à MENUA CONSULTING.<br>Notre équipe va en prendre connaissance et reviendra vers vous afin de préciser votre besoin.'}
    </p>
    <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin-bottom: 15px;">
      ${isEn 
        ? 'To protect your information, please do not send any sensitive documents by return email unless requested to do so.' 
        : "Pour protéger vos informations, merci de ne pas transmettre de document sensible par retour d'e-mail sans y avoir été invité."}
    </p>
    <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin-bottom: 0;">
      ${isEn 
        ? 'Best regards,<br><strong>MENUA CONSULTING</strong><br><em>Your operations. Our expertise.</em>' 
        : 'Bien cordialement,<br><strong>MENUA CONSULTING</strong><br><em>Vos opérations. Notre expertise.</em>'}
    </p>
  `);

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: subject,
    text: text,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log({ event: "auto_reply_success", email: email, messageId: info.messageId });
  } catch (error) {
    console.error({ event: "auto_reply_immediate_error", email, error: error.message || error });
  }
};

const sendAdminNotification = async (formulaire) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Configuration SMTP manquante dans l'environnement.");
    return;
  }

  let attachments = [];
  if (formulaire.contact?.pieceJointe) {
    const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
    let destPath = path.join(rootPath, 'formulaires', formulaire.contact.pieceJointe);
    if (!fs.existsSync(destPath)) {
      destPath = path.join(__dirname, '../../../../storage/formulaires', formulaire.contact.pieceJointe);
    }
    if (fs.existsSync(destPath)) {
      attachments.push({
        filename: formulaire.contact.pieceJointe,
        path: destPath
      });
    }
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: formulaire.email,
    subject: formulaire.objet,
    html: buildEmailTemplate(formulaire.objet, formulaire.bodyHtml),
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log({ event: "admin_notification_success", email: formulaire.email });
  } catch (error) {
    console.error(`Erreur SMTP détaillée: Code ${error.responseCode || error.code || 'Inconnu'}`, error);
  }
};

module.exports = {
  sendAutoReply,
  sendAdminNotification
};
