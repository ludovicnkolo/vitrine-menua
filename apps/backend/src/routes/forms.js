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

router.post('/contact', upload.none(), async (req, res) => {
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

    const typeText = clientType === 'company' ? 'Entreprise / Organisation' : 'Particulier';
    const companyHtml = clientType === 'company' ? `<strong>Société</strong> : <span>${company}</span><br/>` : '';
    const needsHtml = parsedNeeds.length > 0 
      ? `<ul>${parsedNeeds.map(n => `<li>${n}</li>`).join('')}</ul>`
      : '<em>Aucun besoin spécifique coché</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        <strong>Type de client</strong> : <span>${typeText}</span><br/>
        ${companyHtml}
        <strong>Nom complet</strong> : <span>${fullName}</span><br/>
        <strong>Email</strong> : <span>${senderEmail}</span><br/>
        <strong>Téléphone</strong> : <span>${phone || ''}</span>
      </div>
      <strong>Besoins identifiés</strong> : <div>${needsHtml}</div><br/>
      <strong>Description du besoin</strong> : <div>
      ${description ? description.replaceAll('\n', '<br/>') : ''}
      </div>
    `;

    // --- IMMEDIATE VERIFALIA CHECK ---
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
          verifaliaStatus: verification.status === 'VALID' ? 'COMPLETED_VALID' : (verification.reason || 'A_VERIFIER'),
          contact: {
            create: {
              typeBesoin: parsedNeeds.join(', '),
              pieceJointe: null
            }
          }
        },
        include: { contact: true }
      });
    } catch (dbError) {
      console.error({ event: "db_save_error_contact", error: dbError.message || dbError });
      return sendResponse(res, 500, 'ERROR_INTERNAL_SERVER', lang);
    }

    // Si on a pu valider l'email immédiatement, on envoie les notifications tout de suite
    if (!isDeferred && formulaireRecord) {
      await Promise.all([
        sendAutoReply(senderEmail, lang),
        sendAdminNotification(formulaireRecord)
      ]);
    } else if (formulaireRecord) {
      // Pour les cas différés / à vérifier : notifier l'administrateur interne, mais PAS d'envoi externe
      await sendAdminNotification(formulaireRecord);
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
    parsedSkills = parsedSkills.map(s => {
      const isOther = s.toLowerCase().trim() === 'autre' || s.toLowerCase().trim() === 'other';
      return (isOther && otherSkill && otherSkill.trim() !== '') ? `${s} (${otherSkill.trim()})` : s;
    });

    const typeText = profileType === 'company' ? 'Entreprise (B2B)' : 'Particulier';
    const companyHtml = profileType === 'company' ? `<strong>Société</strong> : <span>${company}</span><br/>` : '';
    const skillsHtml = parsedSkills.length > 0 
      ? `<ul>${parsedSkills.map(s => `<li>${s}</li>`).join('')}</ul>`
      : '<em>Aucune compétence spécifique cochée</em>';

    const contentHTML = `
      <div style="margin-bottom: 20px;">
        <strong>Type de profil</strong> : <span>${typeText}</span><br/>
        ${companyHtml}
        <strong>Nom complet</strong> : <span>${lastName + ' ' + firstName}</span><br/>
        <strong>Email</strong> : <span>${email}</span><br/>
        <strong>Téléphone</strong> : <span>${phone || ''}</span><br/>
        <strong>Expérience</strong> : <span>${experience || ''}</span><br/>
        <strong>Langues</strong> : <span>${languages || ''}</span><br/>
        <strong>Localisation</strong> : <span>${location || ''}</span><br/>
        <strong>Disponibilité</strong> : <span>${availability || ''}</span><br/>
        <strong>LinkedIn / Portfolio</strong> : <span>${linkedin ? `<a href="${linkedin}" style="color: #141824;">${linkedin}</a>` : ''}</span>
      </div>
      <strong>Compétences clés</strong> : <div>${skillsHtml}</div><br/>
      <strong>Message / Motivations</strong> : <div>
      ${message ? message.replaceAll('\n', '<br/>') : ''}
      </div>
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
          verifaliaStatus: verification.status === 'VALID' ? 'COMPLETED_VALID' : (verification.reason || 'A_VERIFIER'),
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
    } else if (formulaireRecord) {
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
