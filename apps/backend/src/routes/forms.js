const express = require('express');
const multer = require('multer');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const dns = require('dns').promises;
const { PrismaClient } = require('@prisma/client');
const { sendResponse } = require('../utils/responses');
const { transporter } = require('../utils/mailer');
const prisma = new PrismaClient();

const router = express.Router();

const { verifyTurnstile } = require('../services/turnstile');
const verifalia = require('../services/verifalia');
const { sendAutoReply, sendAdminNotification } = require('../services/emailService');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: Number.parseInt(process.env.UPLOAD_MAX_FILE_SIZE) }
});

// Strict rate limiting specifically for forms
const formLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_FORM_WINDOW_MS),
  max: Number.parseInt(process.env.RATE_LIMIT_FORM_MAX),
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

// Email templates are now in emailService.js

router.post('/contact', upload.single('file'), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      clientType, company, firstName, lastName, email, phone, description, needs, "cf-turnstile-response": turnstileToken
    } = sanitizedBody;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const senderEmail = email;
    const lang = req.query.lang || req.body.lang || 'fr';

    if (!senderEmail) {
      return sendResponse(res, 400, 'ERROR_EMAIL_REQUIRED', lang);
    }
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const isTurnstileValid = await verifyTurnstile(turnstileToken, ip);
    if (!isTurnstileValid) {
      return sendResponse(res, 400, 'ERROR_INVALID_CAPTCHA', lang);
    }

    // Validation des champs obligatoires (*)
    if (!firstName || !lastName) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (!description) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (clientType === 'company' && !company) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }

    let parsedNeeds = [];
    if (Array.isArray(needs)) {
      parsedNeeds = needs;
    } else if (needs) {
      parsedNeeds = [needs];
    }

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
      if (req.file.size > Number.parseInt(process.env.UPLOAD_MAX_FILE_SIZE)) {
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
          destPath = require('node:path').join(rootPath, 'formulaires');
          require('node:fs').mkdirSync(destPath, { recursive: true });
        } catch (dirErr) {
          // Fallback to local storage if permission denied
          destPath = require('node:path').join(__dirname, '../../../storage/formulaires');
          require('node:fs').mkdirSync(destPath, { recursive: true });
        }
        
        const randomHex = crypto.randomBytes(8).toString('hex');
        const uniqueSuffix = Date.now() + '-' + randomHex;
        const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        savedFilename = uniqueSuffix + '-' + safeOriginalName;
        
        require('node:fs').writeFileSync(require('node:path').join(destPath, savedFilename), req.file.buffer);
      } catch (err) {
        console.error("Impossible de sauvegarder le fichier :", err);
        savedFilename = req.file.originalname; // ultimate fallback
      }
    }

    const typeText = clientType === 'company' ? 'Entreprise / Organisation' : 'Particulier';
    const companyHtml = clientType === 'company' ? `Société : ${company}<br/>` : '';
    const needsHtml = parsedNeeds.length > 0 
      ? `<ul>${parsedNeeds.map(n => `<li>${n}</li>`).join('')}</ul>`
      : '<em>Aucun besoin spécifique coché</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        Type de client : ${typeText}<br/>
        ${companyHtml}
        Nom complet : ${fullName}<br/>
        Email : ${senderEmail}<br/>
        Téléphone : ${phone}
      </div>
      Besoins identifiés : ${needsHtml}<br/>
      Description du besoin : <br/>
      ${description ? description.replaceAll('\n', '<br/>') : ''}
    `;

    // --- IMMMEDIATE VERIFALIA CHECK ---
    const verification = await verifalia.verifyEmailImmediate(senderEmail);
    if (verification.status === 'INVALID') {
      return sendResponse(res, 400, 'ERROR_EMAIL_INVALID', lang);
    }
    
    // Si VALID => on procède normalement (NOUVEAU) et on envoie les emails.
    // Si DEFERRED => on enregistre avec A_VERIFIER pour que le cron prenne le relais.
    const isDeferred = verification.status === 'DEFERRED';
    const formStatus = isDeferred ? 'A_VERIFIER' : 'NOUVEAU';

    // Enregistrement dans le CRM
    let formulaireRecord;
    try {
      formulaireRecord = await prisma.formulaire.create({
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
          status: formStatus,
          verifaliaJobId: isDeferred ? verification.jobId : null,
          contact: {
            create: {
              typeBesoin: parsedNeeds.join(', '),
              pieceJointe: savedFilename
            }
          }
        },
        // We include contact so sendAdminNotification can access pieceJointe
        include: { contact: true }
      });
    } catch (dbError) {
      console.error({ event: "db_save_error_contact", error: dbError.message || dbError });
      return sendResponse(res, 500, 'ERROR_INTERNAL_SERVER', lang);
    }

    // Si on a pu valider l'email immédiatement, on envoie les notifications tout de suite
    if (!isDeferred && formulaireRecord) {
      sendAutoReply(senderEmail, lang);
      sendAdminNotification(formulaireRecord);
    }

    return sendResponse(res, 200, 'SUCCESS_CONTACT', lang);
  } catch (error) {
    const lang = req.query.lang || req.body.lang || 'fr';
    console.error({ event: "contact_email_error", error: error.message || error });
    return sendResponse(res, 500, 'ERROR_SENDING_EMAIL', lang);
  }
});

router.post('/join', upload.none(), async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const {
      profileType, company, lastName, firstName, email, phone,
      experience, languages, location, availability, linkedin, message, skills, otherSkill, "cf-turnstile-response": turnstileToken
    } = sanitizedBody;
    const lang = req.query.lang || req.body.lang || 'fr';

    if (!email) {
      return sendResponse(res, 400, 'ERROR_EMAIL_REQUIRED', lang);
    }
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const isTurnstileValid = await verifyTurnstile(turnstileToken, ip);
    if (!isTurnstileValid) {
      return sendResponse(res, 400, 'ERROR_INVALID_CAPTCHA', lang);
    }

    // Validation des champs obligatoires (*) pour le formulaire de recrutement
    if (!firstName || !lastName) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (!message) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (!experience) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (!languages) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    if (!availability) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }
    // Compétences clés obligatoires
    const rawSkills = req.body.skills;
    const hasSkills = rawSkills && (Array.isArray(rawSkills) ? rawSkills.length > 0 : true);
    if (!hasSkills) {
      return sendResponse(res, 400, 'ERROR_SKILLS_REQUIRED', lang);
    }
    if (profileType === 'company' && !company) {
      return sendResponse(res, 400, 'ERROR_REQUIRED_FIELDS', lang);
    }

    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (skills) {
      parsedSkills = [skills];
    }
    parsedSkills = parsedSkills.map(s => s === 'Autre' && otherSkill ? `Autre (${otherSkill})` : s);

    const typeText = profileType === 'company' ? 'Entreprise (B2B)' : 'Particulier';
    const companyHtml = profileType === 'company' ? `Société : ${company}<br/>` : '';
    const skillsHtml = parsedSkills.length > 0 
      ? `<ul>${parsedSkills.map(s => `<li>${s}</li>`).join('')}</ul>`
      : '<em>Aucune compétence spécifique cochée</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        Type de profil : ${typeText}<br/>
        ${companyHtml}
        Nom complet : ${lastName + ' ' + firstName}<br/>
        Email : ${email}<br/>
        Téléphone : ${phone}<br/>
        Expérience : ${experience}<br/>
        Langues : ${languages}<br/>
        Localisation : ${location}<br/>
        Disponibilité : ${availability}<br/>
        LinkedIn / Portfolio : ${linkedin ? `<a href="${linkedin}" style="color: #141824;">${linkedin}</a>` : ''}
      </div>
      Compétences clés : ${skillsHtml}<br/>
      Message / Motivations : <br/>
      ${message ? message.replaceAll('\n', '<br/>') : ''}
    `;

    // --- IMMMEDIATE VERIFALIA CHECK ---
    const verification = await verifalia.verifyEmailImmediate(email);
    if (verification.status === 'INVALID') {
      return sendResponse(res, 400, 'ERROR_EMAIL_INVALID', lang);
    }
    
    // Si VALID => on procède normalement (NOUVEAU) et on envoie les emails.
    // Si DEFERRED => on enregistre avec A_VERIFIER pour que le cron prenne le relais.
    const isDeferred = verification.status === 'DEFERRED';
    const formStatus = isDeferred ? 'A_VERIFIER' : 'NOUVEAU';

    // Enregistrement dans le CRM
    let formulaireRecord;
    try {
      formulaireRecord = await prisma.formulaire.create({
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
          status: formStatus,
          verifaliaJobId: isDeferred ? verification.jobId : null,
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
      console.error({ event: "db_save_error_join", error: dbError.message || dbError });
      return sendResponse(res, 500, 'ERROR_INTERNAL_SERVER', lang);
    }

    // Si on a pu valider l'email immédiatement, on envoie les notifications tout de suite
    if (!isDeferred && formulaireRecord) {
      sendAutoReply(email, lang);
      sendAdminNotification(formulaireRecord);
    }

    return sendResponse(res, 200, 'SUCCESS_JOIN', lang);
  } catch (error) {
    const lang = req.query.lang || req.body.lang || 'fr';
    console.error({ event: "join_email_error", error: error.message || error });
    return sendResponse(res, 500, 'ERROR_SENDING_EMAIL', lang);
  }
});

module.exports = router;
