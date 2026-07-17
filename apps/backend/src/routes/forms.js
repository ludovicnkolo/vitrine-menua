const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const xss = require('xss');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit at multer level
});

// Strict rate limiting specifically for forms (5 per hour)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Increased from 5 to 500 to allow debugging
  message: { success: false, error: 'Trop de soumissions, veuillez réessayer plus tard.' }
});

router.use(formLimiter);

const sanitizeInput = (data) => {
  if (typeof data === 'string') return xss(data);
  if (Array.isArray(data)) return data.map(sanitizeInput);
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const key in data) {
      sanitized[key] = sanitizeInput(data[key]);
    }
    return sanitized;
  }
  return data;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- EMAIL PREMIUM TEMPLATE UTILS ---
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
        <p style="color: #e8e1d7; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Cet email a été envoyé depuis le site menuaconsulting.com</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buildRow = (label, value) => `
  <div style="margin-bottom: 20px;">
    <strong style="color: #141824; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">${label}</strong>
    <div style="color: #4a5568; font-size: 15px; line-height: 1.6; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">${value || '<em style="color:#a0aabf;">Non renseigné</em>'}</div>
  </div>
`;
// -------------------------------------

router.post('/contact', upload.single('file'), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      clientType, company, siret, name, position, email, phone, urgency, description, needs
    } = sanitizedBody;

    const parsedNeeds = Array.isArray(needs) ? needs : (needs ? [needs] : []);

    let attachments = [];
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: "Le fichier doit obligatoirement être au format PDF." });
      }
      if (req.file.size > 1 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: "Le fichier PDF dépasse la limite de 1 Mo." });
      }
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    const typeText = clientType === 'company' ? 'Entreprise' : 'Particulier';
    const companyHtml = clientType === 'company' ? buildRow('Société', company) + buildRow('SIRET', siret) : '';
    const needsHtml = parsedNeeds.length > 0 
      ? `<ul style="margin:0; padding-left: 20px; color: #4a5568; font-size: 15px;">${parsedNeeds.map(n => `<li style="margin-bottom: 5px;">${n}</li>`).join('')}</ul>`
      : 'Aucun besoin spécifique coché';

    const contentHTML = `
      ${buildRow('Type de client', typeText)}
      ${companyHtml}
      ${buildRow('Nom du contact', name)}
      ${buildRow('Fonction', position)}
      ${buildRow('Email', email)}
      ${buildRow('Téléphone', phone)}
      ${buildRow("Niveau d'urgence", urgency)}
      ${buildRow('Besoins identifiés', needsHtml)}
      ${buildRow('Description du besoin', description ? description.replace(/\n/g, '<br/>') : '')}
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Menua Consulting Website" <noreply@menuaconsulting.com>',
      to: process.env.CONTACT_EMAIL_TO || 'crm-reception@menuaconsulting.com',
      replyTo: email,
      subject: `Nouvelle demande de contact - ${clientType === 'company' ? company : name}`,
      text: `Nouvelle demande de contact via le site web Menua Consulting:\n\nVous êtes: ${typeText}\n${clientType === 'company' ? `Société: ${company}\nSIRET: ${siret}\n` : ''}Nom: ${name}\nFonction: ${position}\nEmail: ${email}\nTéléphone: ${phone}\nUrgence: ${urgency}\n\nBesoins:\n${parsedNeeds.join(', ')}\n\nDescription:\n${description}`,
      html: buildEmailTemplate('Nouvelle demande de contact', contentHTML),
      attachments,
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Configuration SMTP manquante dans l'environnement.");
    }
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de l'envoi de votre message." });
  }
});

router.post('/join', upload.none(), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      profileType, company, siret, lastName, firstName, email, phone,
      experience, languages, location, availability, linkedin, message, skills
    } = sanitizedBody;

    const parsedSkills = Array.isArray(skills) ? skills : (skills ? [skills] : []);

    const typeText = profileType === 'company' ? 'Entreprise (B2B)' : 'Particulier';
    const companyHtml = profileType === 'company' ? buildRow('Société', company) + buildRow('SIRET', siret) : '';
    const skillsHtml = parsedSkills.length > 0 
      ? `<ul style="margin:0; padding-left: 20px; color: #4a5568; font-size: 15px;">${parsedSkills.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('')}</ul>`
      : 'Aucune compétence spécifique cochée';

    const contentHTML = `
      ${buildRow('Type de profil', typeText)}
      ${companyHtml}
      ${buildRow('Nom complet', lastName + ' ' + firstName)}
      ${buildRow('Email', email)}
      ${buildRow('Téléphone', phone)}
      ${buildRow('Expérience', experience)}
      ${buildRow('Langues', languages)}
      ${buildRow('Localisation', location)}
      ${buildRow('Disponibilité', availability)}
      ${buildRow('LinkedIn / Portfolio', linkedin ? `<a href="${linkedin}" style="color: #141824;">${linkedin}</a>` : '')}
      ${buildRow('Compétences clés', skillsHtml)}
      ${buildRow('Message / Motivations', message ? message.replace(/\n/g, '<br/>') : '')}
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Menua Consulting Website" <noreply@menuaconsulting.com>',
      to: process.env.CONTACT_EMAIL_TO || 'crm-reception@menuaconsulting.com',
      replyTo: email,
      subject: `Nouvelle candidature - ${profileType === 'company' ? company : `${firstName} ${lastName}`}`,
      text: `Nouvelle candidature via le site web Menua Consulting:\n\nVous êtes: ${typeText}\n${profileType === 'company' ? `Société: ${company}\nSIRET: ${siret}\n` : ''}Nom: ${lastName}\nPrénom: ${firstName}\nEmail: ${email}\nTéléphone: ${phone}\n\nExpérience: ${experience}\nLangues: ${languages}\nLocalisation: ${location}\nDisponibilité: ${availability}\nLinkedIn: ${linkedin}\n\nCompétences clés:\n${parsedSkills.join(', ')}\n\nMessage:\n${message}`,
      html: buildEmailTemplate('Nouvelle candidature', contentHTML),
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Configuration SMTP manquante dans l'environnement.");
    }
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Candidature envoyée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la candidature:", error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de l'envoi de votre candidature." });
  }
});

module.exports = router;
