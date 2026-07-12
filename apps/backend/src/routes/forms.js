const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/contact', upload.single('file'), async (req, res) => {
  try {
    const {
      clientType, company, siret, name, position, email, phone, urgency, description, needs
    } = req.body;

    const parsedNeeds = Array.isArray(needs) ? needs : (needs ? [needs] : []);

    let attachments = [];
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: "Le fichier doit obligatoirement être au format PDF." });
      }
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: "Le fichier PDF dépasse la limite de 10 Mo." });
      }
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Menua Consulting Website" <noreply@menuaconsulting.com>',
      to: process.env.CONTACT_EMAIL_TO || 'crm-reception@menuaconsulting.com',
      replyTo: email,
      subject: `Nouvelle demande de contact - ${clientType === 'company' ? company : name}`,
      text: `Nouvelle demande de contact via le site web Menua Consulting:

Vous êtes: ${clientType === 'company' ? 'Une entreprise' : 'Un particulier'}
${clientType === 'company' ? `Société: ${company}\nSIRET: ${siret}` : ''}
Nom: ${name}
Fonction: ${position}
Email: ${email}
Téléphone: ${phone}
Urgence: ${urgency}

Besoins:
${parsedNeeds.join(', ')}

Description:
${description}`,
      html: `
        <h2>Nouvelle demande de contact via le site web</h2>
        <p><strong>Vous êtes:</strong> ${clientType === 'company' ? 'Une entreprise' : 'Un particulier'}</p>
        ${clientType === 'company' ? `<p><strong>Société:</strong> ${company}</p><p><strong>SIRET:</strong> ${siret}</p>` : ''}
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Fonction:</strong> ${position}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Urgence:</strong> ${urgency}</p>
        <br/>
        <h3>Besoins:</h3>
        <ul>
          ${parsedNeeds.map(n => `<li>${n}</li>`).join('')}
        </ul>
        <br/>
        <h3>Description:</h3>
        <p>${description ? description.replace(/\n/g, '<br/>') : ''}</p>
      `,
      attachments,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP_USER or SMTP_PASS non défini. L'email ne sera pas réellement envoyé, mais le traitement est simulé.");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({ success: true, message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de l'envoi de votre message." });
  }
});

router.post('/join', upload.none(), async (req, res) => {
  try {
    const {
      profileType, company, siret, lastName, firstName, email, phone,
      experience, languages, location, availability, linkedin, message, skills
    } = req.body;

    const parsedSkills = Array.isArray(skills) ? skills : (skills ? [skills] : []);

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Menua Consulting Website" <noreply@menuaconsulting.com>',
      to: process.env.CONTACT_EMAIL_TO || 'crm-reception@menuaconsulting.com',
      replyTo: email,
      subject: `Nouvelle candidature - ${profileType === 'company' ? company : `${firstName} ${lastName}`}`,
      text: `Nouvelle candidature via le site web Menua Consulting:

Vous êtes: ${profileType === 'company' ? 'Une entreprise' : 'Un particulier'}
${profileType === 'company' ? `Société: ${company}\nSIRET: ${siret}` : ''}
Nom: ${lastName}
Prénom: ${firstName}
Email: ${email}
Téléphone: ${phone}

Expérience: ${experience}
Langues: ${languages}
Localisation: ${location}
Disponibilité: ${availability}
LinkedIn/Portfolio: ${linkedin}

Compétences clés:
${parsedSkills.join(', ')}

Message:
${message}`,
      html: `
        <h2>Nouvelle candidature via le site web</h2>
        <p><strong>Vous êtes:</strong> ${profileType === 'company' ? 'Une entreprise' : 'Un particulier'}</p>
        ${profileType === 'company' ? `<p><strong>Société:</strong> ${company}</p><p><strong>SIRET:</strong> ${siret}</p>` : ''}
        <p><strong>Nom:</strong> ${lastName}</p>
        <p><strong>Prénom:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <br/>
        <p><strong>Expérience:</strong> ${experience}</p>
        <p><strong>Langues:</strong> ${languages}</p>
        <p><strong>Localisation:</strong> ${location}</p>
        <p><strong>Disponibilité:</strong> ${availability}</p>
        <p><strong>LinkedIn/Portfolio:</strong> ${linkedin}</p>
        <br/>
        <h3>Compétences clés:</h3>
        <ul>
          ${parsedSkills.map(s => `<li>${s}</li>`).join('')}
        </ul>
        <br/>
        <h3>Message:</h3>
        <p>${message ? message.replace(/\n/g, '<br/>') : ''}</p>
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP_USER or SMTP_PASS non défini. L'email ne sera pas réellement envoyé, mais le traitement est simulé.");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({ success: true, message: "Candidature envoyée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la candidature:", error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de l'envoi de votre candidature." });
  }
});

module.exports = router;
