const express = require('express');
const multer = require('multer');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const dns = require('dns').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

const validateEmail = async (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (e) {
    return false;
  }
};
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE) }
});

// Strict rate limiting specifically for forms
const formLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_FORM_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_FORM_MAX),
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
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: false,
  debug: false
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
        <p style="color: #e8e1d7; margin: 0; font-size: 11px; text-transform: none; letter-spacing: 1.5px;">Cet email a été envoyé depuis le site https://menuaconsulting.com/</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buildInlineRow = (label, value) => `
  <div style="margin-bottom: 8px; font-size: 14px; color: #4a5568; line-height: 1.5;">
    <strong style="color: #141824; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${label}</strong> : 
    <span style="margin-left: 4px;">${value || '<em style="color:#a0aabf;">Non renseigné</em>'}</span>
  </div>
`;

const buildBlockRow = (label, value) => `
  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
    <strong style="color: #141824; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px;">${label}</strong>
    <div style="color: #4a5568; font-size: 14px; line-height: 1.6; background-color: #fcfcfc; padding: 15px; border-radius: 4px;">${value || '<em style="color:#a0aabf;">Non renseigné</em>'}</div>
  </div>
`;

const buildListRow = (label, htmlList) => `
  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
    <strong style="color: #141824; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">${label}</strong>
    ${htmlList}
  </div>
`;
// -------------------------------------

router.post('/contact', upload.single('file'), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      clientType, company, firstName, lastName, email, phone, description, needs
    } = sanitizedBody;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const senderEmail = email;
    const lang = req.query.lang || req.body.lang || 'fr';

    if (!senderEmail) {
      return sendResponse(res, 400, 'ERROR_EMAIL_REQUIRED', lang);
    }

    const isEmailValid = await validateEmail(senderEmail);
    if (!isEmailValid) {
      return sendResponse(res, 400, 'ERROR_EMAIL_INVALID', lang);
    }

    const parsedNeeds = Array.isArray(needs) ? needs : (needs ? [needs] : []);

    let attachments = [];
    let savedFilename = null;
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return sendResponse(res, 400, 'ERROR_FILE_PDF_ONLY', lang);
      }
      const magicBytes = req.file.buffer.toString('hex', 0, 5);
      if (magicBytes !== '255044462d') { // %PDF-
        return sendResponse(res, 400, 'ERROR_FILE_CORRUPTED', lang);
      }
      if (req.file.size > parseInt(process.env.UPLOAD_MAX_FILE_SIZE)) {
        return sendResponse(res, 400, 'ERROR_FILE_TOO_LARGE', lang);
      }
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });

      // Sauvegarde physique du fichier pour le CRM
      try {
        let destPath;
        const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
        try {
          destPath = require('path').join(rootPath, 'formulaires');
          require('fs').mkdirSync(destPath, { recursive: true });
        } catch (dirErr) {
          // Fallback to local storage if permission denied
          destPath = require('path').join(__dirname, '../../../storage/formulaires');
          require('fs').mkdirSync(destPath, { recursive: true });
        }
        
        const randomHex = crypto.randomBytes(8).toString('hex');
        const uniqueSuffix = Date.now() + '-' + randomHex;
        const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        savedFilename = uniqueSuffix + '-' + safeOriginalName;
        
        require('fs').writeFileSync(require('path').join(destPath, savedFilename), req.file.buffer);
      } catch (err) {
        console.error("Impossible de sauvegarder le fichier :", err);
        savedFilename = req.file.originalname; // ultimate fallback
      }
    }

    const typeText = clientType === 'company' ? 'Entreprise / Organisation' : 'Particulier';
    const companyHtml = clientType === 'company' ? buildInlineRow('Société', company) : '';
    const needsHtml = parsedNeeds.length > 0 
      ? `<ul style="margin:0; padding-left: 20px; color: #4a5568; font-size: 14px;">${parsedNeeds.map(n => `<li style="margin-bottom: 5px;">${n}</li>`).join('')}</ul>`
      : '<em style="color:#a0aabf; font-size: 14px;">Aucun besoin spécifique coché</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        ${buildInlineRow('Type de client', typeText)}
        ${companyHtml}
        ${buildInlineRow('Nom complet', fullName)}
        ${buildInlineRow('Email', senderEmail)}
        ${buildInlineRow('Téléphone', phone)}
      </div>
      ${buildListRow('Besoins identifiés', needsHtml)}
      ${buildBlockRow('Description du besoin', description ? description.replace(/\n/g, '<br/>') : '')}
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: senderEmail,
      subject: 'Demande de contact',
      text: `Nouvelle demande de contact via le site web Menua Consulting:\n\nVous êtes: ${typeText}\n${clientType === 'company' ? `Société: ${company}\n` : ''}Nom: ${fullName}\nEmail: ${senderEmail}\nTéléphone: ${phone}\n\nBesoins:\n${parsedNeeds.join(', ')}\n\nDescription:\n${description}`,
      html: buildEmailTemplate('Demande de contact', contentHTML),
      attachments,
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Configuration SMTP manquante dans l'environnement.");
    }
    
    try {
      transporter.sendMail(mailOptions).catch(err => {
        console.error("Erreur lors de l'envoi de l'email en arrière-plan (Contact):", err);
      });
    } catch (smtpError) {
      console.error(`Erreur SMTP détaillée: Code ${smtpError.responseCode || smtpError.code || 'Inconnu'}`, smtpError);
      throw smtpError;
    }

    // Enregistrement dans le CRM
    try {
      await prisma.formulaire.create({
        data: {
          formulaireId: crypto.randomUUID(),
          type: 'CONTACT',
          statusSubmitter: clientType === 'company' ? 'SOCIETE' : 'PARTICULIER',
          nomPrenom: fullName,
          email: senderEmail,
          telephone: phone || null,
          description: description || null,
          raisonSocial: company || null,
          objet: 'Demande de contact',
          bodyHtml: contentHTML,
          isAnonyme: true,
          status: 'NOUVEAU',
          contact: {
            create: {
              typeBesoin: parsedNeeds.join(', '),
              pieceJointe: savedFilename
            }
          }
        }
      });
    } catch (dbError) {
      console.error("Erreur lors de l'enregistrement en DB (Contact):", dbError);
    }

    return sendResponse(res, 200, 'SUCCESS_CONTACT', lang);
  } catch (error) {
    const lang = req.query.lang || req.body.lang || 'fr';
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    return sendResponse(res, 500, 'ERROR_SENDING_EMAIL', lang);
  }
});

router.post('/join', upload.none(), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      profileType, company, lastName, firstName, email, phone,
      experience, languages, location, availability, linkedin, message, skills, otherSkill
    } = sanitizedBody;
    const lang = req.query.lang || req.body.lang || 'fr';

    if (!email) {
      return sendResponse(res, 400, 'ERROR_EMAIL_REQUIRED', lang);
    }

    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      return sendResponse(res, 400, 'ERROR_EMAIL_INVALID', lang);
    }

    let parsedSkills = Array.isArray(skills) ? skills : (skills ? [skills] : []);
    parsedSkills = parsedSkills.map(s => s === 'Autre' && otherSkill ? `Autre (${otherSkill})` : s);

    const typeText = profileType === 'company' ? 'Entreprise (B2B)' : 'Particulier';
    const companyHtml = profileType === 'company' ? buildInlineRow('Société', company) : '';
    const skillsHtml = parsedSkills.length > 0 
      ? `<ul style="margin:0; padding-left: 20px; color: #4a5568; font-size: 14px;">${parsedSkills.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('')}</ul>`
      : '<em style="color:#a0aabf; font-size: 14px;">Aucune compétence spécifique cochée</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        ${buildInlineRow('Type de profil', typeText)}
        ${companyHtml}
        ${buildInlineRow('Nom complet', lastName + ' ' + firstName)}
        ${buildInlineRow('Email', email)}
        ${buildInlineRow('Téléphone', phone)}
        ${buildInlineRow('Expérience', experience)}
        ${buildInlineRow('Langues', languages)}
        ${buildInlineRow('Localisation', location)}
        ${buildInlineRow('Disponibilité', availability)}
        ${buildInlineRow('LinkedIn / Portfolio', linkedin ? `<a href="${linkedin}" style="color: #141824;">${linkedin}</a>` : '')}
      </div>
      ${buildListRow('Compétences clés', skillsHtml)}
      ${buildBlockRow('Message / Motivations', message ? message.replace(/\n/g, '<br/>') : '')}
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: 'Demande de collaboration',
      text: `Nouvelle candidature via le site web Menua Consulting:\n\nVous êtes: ${typeText}\n${profileType === 'company' ? `Société: ${company}\n` : ''}Nom: ${lastName}\nPrénom: ${firstName}\nEmail: ${email}\nTéléphone: ${phone}\n\nExpérience: ${experience}\nLangues: ${languages}\nLocalisation: ${location}\nDisponibilité: ${availability}\nLinkedIn: ${linkedin}\n\nCompétences clés:\n${parsedSkills.join(', ')}\n\nMessage:\n${message}`,
      html: buildEmailTemplate('Demande de collaboration', contentHTML),
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Configuration SMTP manquante dans l'environnement.");
    }
    transporter.sendMail(mailOptions).catch(err => {
      console.error("Erreur lors de l'envoi de l'email en arrière-plan (Recrutement):", err);
    });

    // Enregistrement dans le CRM
    try {
      await prisma.formulaire.create({
        data: {
          formulaireId: crypto.randomUUID(),
          type: 'RECRUTEMENT',
          statusSubmitter: profileType === 'company' ? 'SOCIETE' : 'PARTICULIER',
          nomPrenom: `${firstName || ''} ${lastName || ''}`.trim(),
          email: email,
          telephone: phone || null,
          description: message || null,
          raisonSocial: company || null,
          objet: 'Demande de collaboration',
          bodyHtml: contentHTML,
          isAnonyme: true,
          status: 'NOUVEAU',
          recrutement: {
            create: {
              competenceCle: parsedSkills.join(', '),
              anneeExperience: experience || null,
              lieuResidence: location || null,
              langue: languages || null,
              lienLinkedin: linkedin || null
            }
          }
        }
      });
    } catch (dbError) {
      console.error("Erreur lors de l'enregistrement en DB (Recrutement):", dbError);
    }

    return sendResponse(res, 200, 'SUCCESS_JOIN', lang);
  } catch (error) {
    const lang = req.query.lang || req.body.lang || 'fr';
    console.error("Erreur lors de l'envoi de la candidature:", error);
    return sendResponse(res, 500, 'ERROR_SENDING_EMAIL', lang);
  }
});

module.exports = router;
