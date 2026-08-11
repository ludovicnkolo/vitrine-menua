const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifaliaService = require('./verifalia');

async function processVerifaliaJobs() {
  if (verifaliaService.isPaused()) {
    return; // Coupe-circuit actif : on ne fait rien pour ne pas spammer l'API ni surcharger la BDD
  }
  console.log('[Verifalia] Cron started');
  // 1. Process forms that are 'A_VERIFIER' and have no job ID (meaning we need to submit them to Verifalia)
  const pendingSubmissions = await prisma.formulaire.findMany({
    where: {
      status: 'A_VERIFIER',
      verifaliaJobId: null,
      OR: [
        { verifaliaNextRetry: null },
        { verifaliaNextRetry: { lte: new Date() } }
      ],
      verifaliaRetries: { lt: 8 } // max 8 retries total as discussed
    }
  });

  for (const form of pendingSubmissions) {
    try {
      console.log(`[Verifalia] Submitting email for form ${form.id}`);
      const job = await verifaliaService.submitVerification(form.email);
      await prisma.formulaire.update({
        where: { id: form.id },
        data: {
          verifaliaJobId: job.id,
          verifaliaStatus: job.status,
          verifaliaNextRetry: null
        }
      });
    } catch (err) {
      console.error(`[Verifalia] Error submitting ${form.id}:`, err.message);
      let nextRetry = new Date(Date.now() + 2 * 60 * 60 * 1000); // Default 2 hours
      if (err.code === 'QUOTA_EXCEEDED') {
        const tomorrow = new Date();
        tomorrow.setUTCHours(24, 0, 0, 0);
        nextRetry = tomorrow;
      }
      
      const retries = form.verifaliaRetries + 1;
      
      if (retries >= 8) {
        // Abandonner et passer en contrôle manuel
        await prisma.formulaire.update({
          where: { id: form.id },
          data: {
            status: 'CONTROLE_MANUEL',
            verifaliaRetries: retries
          }
        });
      } else {
        await prisma.formulaire.update({
          where: { id: form.id },
          data: {
            verifaliaNextRetry: nextRetry,
            verifaliaRetries: retries
          }
        });
      }
    }
  }

  // 2. Process forms that have a verifaliaJobId but are still 'A_VERIFIER' (we need to fetch the result)
  const pendingResults = await prisma.formulaire.findMany({
    where: {
      status: 'A_VERIFIER',
      verifaliaJobId: { not: null }
    }
  });

  for (const form of pendingResults) {
    try {
      console.log(`[Verifalia] Checking job ${form.verifaliaJobId} for form ${form.id}`);
      const job = await verifaliaService.getJob(form.verifaliaJobId);
      
      if (job.status === 'Completed') {
        const entriesData = await verifaliaService.getJobEntries(form.verifaliaJobId);
        if (entriesData && entriesData.data && entriesData.data.length > 0) {
            const result = entriesData.data[0];
            
            // Classification: Deliverable, Risky, Undeliverable, Unknown
            if (!result.isDisposableEmailAddress && (result.classification === 'Deliverable' || result.classification === 'Risky')) {
              await prisma.formulaire.update({
                where: { id: form.id },
                data: {
                  status: 'NOUVEAU',
                  verifaliaStatus: 'COMPLETED_VALID'
                }
              });

              // Send deferred emails
              const fullForm = await prisma.formulaire.findUnique({
                where: { id: form.id },
                include: { contact: true, recrutement: true }
              });
              const emailService = require('./emailService');
              await emailService.sendAutoReply(fullForm.email);
              await emailService.sendAdminNotification(fullForm);

            } else if (result.classification === 'Undeliverable' || result.isDisposableEmailAddress) {
              await prisma.formulaire.update({
                where: { id: form.id },
                data: {
                  status: 'INVALIDE',
                  verifaliaStatus: 'COMPLETED_INVALID'
                }
              });
            } else {
              // Unknown
              await prisma.formulaire.update({
                where: { id: form.id },
                data: {
                  status: 'CONTROLE_MANUEL',
                  verifaliaStatus: 'COMPLETED_UNKNOWN'
                }
              });
            }
          }
        }
    } catch (err) {
      console.error(`[Verifalia] Error fetching job ${form.verifaliaJobId}:`, err.message);
      // We keep it pending. It will be retried next time.
    }
  }
}

function startVerifaliaCron() {
  // Run every 2 minutes
  setInterval(processVerifaliaJobs, 2 * 60 * 1000);
  // Also run immediately on startup
  setTimeout(processVerifaliaJobs, 5000);
}

module.exports = { startVerifaliaCron };
