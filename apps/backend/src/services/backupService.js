const { PrismaClient } = require("@prisma/client");
const fs = require("node:fs");
const path = require("node:path");
const { uploadToS3, listObjectsFromS3, deleteFromS3 } = require("./s3Service");

const prisma = new PrismaClient();

const BACKUP_DIR = path.join(__dirname, "../../backups");
const S3_BACKUP_PREFIX = "backups/database/";
const MAX_BACKUPS_RETAINED = 28; // 7 jours glissants à raison de 4 sauvegardes par jour (toutes les 6h)

/**
 * Génère un horodatage propre pour le nommage des fichiers (ex: 2026-10-13_18-00-00)
 */
function getTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

/**
 * Exporte l'intégralité de la base de données PostgreSQL dans un fichier JSON,
 * l'enregistre en local et l'uploade sur le bucket OVH Object Storage privé.
 */
async function exportDatabase({ uploadS3 = true } = {}) {
  try {
    const timestamp = getTimestamp();
    console.log(`[BACKUP][${new Date().toISOString()}] Début de l'exportation complète de la base de données...`);

    // Récupérer l'intégralité des modèles Prisma
    const data = {
      _metadata: {
        exportedAt: new Date().toISOString(),
        timestamp,
        version: "1.0",
        format: "menua-crm-database-backup",
      },
      roles: await prisma.role.findMany(),
      utilisateurs: await prisma.utilisateur.findMany(),
      polesActivite: await prisma.poleActivite.findMany(),
      clients: await prisma.client.findMany(),
      clientEntreprises: await prisma.clientEntreprise.findMany(),
      formulaires: await prisma.formulaire.findMany(),
      formulaireRecrutements: await prisma.formulaireRecrutement.findMany(),
      formulaireContacts: await prisma.formulaireContact.findMany(),
      dossiers: await prisma.dossier.findMany(),
      missions: await prisma.mission.findMany(),
      taches: await prisma.tache.findMany(),
      documents: await prisma.document.findMany(),
      auditLogs: await prisma.auditLog.findMany(),
      messagePersonnels: await prisma.messagePersonnel.findMany(),
      publications: await prisma.publication.findMany(),
      liensMagiques: await prisma.lienMagique.findMany(),
      notifications: await prisma.notification.findMany(),
    };

    // Calcul du volume total d'enregistrements
    let totalRecords = 0;
    for (const key of Object.keys(data)) {
      if (key !== "_metadata" && Array.isArray(data[key])) {
        totalRecords += data[key].length;
      }
    }
    data._metadata.totalRecords = totalRecords;

    // ── 1. Sauvegarde locale ─────────────────────────────────────────────────
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(jsonContent, "utf-8");

    // Fichier horodaté + fichier latest + fichier rétrocompatible db_export.json
    const timestampedFileName = `db_backup_${timestamp}.json`;
    const localFilePath = path.join(BACKUP_DIR, timestampedFileName);
    const latestFilePath = path.join(BACKUP_DIR, "latest.json");
    const compatFilePath = path.join(BACKUP_DIR, "db_export.json");

    fs.writeFileSync(localFilePath, jsonContent, "utf-8");
    fs.writeFileSync(latestFilePath, jsonContent, "utf-8");
    fs.writeFileSync(compatFilePath, jsonContent, "utf-8");

    console.log(
      `[BACKUP] Sauvegarde locale générée : ${localFilePath} (${(buffer.length / 1024).toFixed(1)} Ko, ${totalRecords} enregistrements)`,
    );

    // ── 2. Sauvegarde OVH Object Storage (Bucket privé) ─────────────────────
    if (uploadS3) {
      const s3TimestampKey = `${S3_BACKUP_PREFIX}${timestampedFileName}`;
      const s3LatestKey = `${S3_BACKUP_PREFIX}latest.json`;

      await uploadToS3(buffer, s3TimestampKey, "application/json");
      await uploadToS3(buffer, s3LatestKey, "application/json");

      console.log(`[BACKUP] Sauvegarde uploadée avec succès sur OVH S3 privé : ${s3TimestampKey}`);

      // ── 3. Rotation et rétention automatique ────────────────────────────────
      await cleanOldBackups();
    }

    return {
      success: true,
      timestamp,
      localFile: localFilePath,
      totalRecords,
      sizeBytes: buffer.length,
    };
  } catch (error) {
    console.error("[BACKUP] Erreur critique lors de l'exportation de la base de données :", error);
    return { success: false, error: error.message };
  }
}

/**
 * Nettoie les anciennes sauvegardes au-delà du seuil de rétention (local + S3)
 */
async function cleanOldBackups() {
  try {
    // 1. Nettoyage local
    if (fs.existsSync(BACKUP_DIR)) {
      const localFiles = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.startsWith("db_backup_") && f.endsWith(".json"))
        .sort()
        .reverse();

      if (localFiles.length > MAX_BACKUPS_RETAINED) {
        const toDelete = localFiles.slice(MAX_BACKUPS_RETAINED);
        for (const file of toDelete) {
          try {
            fs.unlinkSync(path.join(BACKUP_DIR, file));
            console.log(`[BACKUP ROTATION] Ancienne sauvegarde locale purgée : ${file}`);
          } catch (e) {
            // ignore
          }
        }
      }
    }

    // 2. Nettoyage OVH S3
    const s3Objects = await listObjectsFromS3(S3_BACKUP_PREFIX);
    const s3Backups = s3Objects
      .filter((obj) => obj.Key && obj.Key.includes("db_backup_") && obj.Key.endsWith(".json"))
      .sort((a, b) => new Date(b.LastModified || 0) - new Date(a.LastModified || 0));

    if (s3Backups.length > MAX_BACKUPS_RETAINED) {
      const toDelete = s3Backups.slice(MAX_BACKUPS_RETAINED);
      for (const obj of toDelete) {
        try {
          await deleteFromS3(obj.Key);
          console.log(`[BACKUP ROTATION] Ancienne sauvegarde S3 purgée : ${obj.Key}`);
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (err) {
    console.warn("[BACKUP ROTATION] Avertissement lors du nettoyage des anciennes sauvegardes :", err.message);
  }
}

/**
 * Vérifie si une sauvegarde a déjà été réalisée récemment (dans les dernières X minutes)
 */
function hasRecentBackup(maxAgeMinutes) {
  try {
    const latestPath = path.join(BACKUP_DIR, "latest.json");
    if (!fs.existsSync(latestPath)) return false;
    const stats = fs.statSync(latestPath);
    const ageMs = Date.now() - stats.mtimeMs;
    return ageMs < maxAgeMinutes * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Démarre le planificateur de sauvegarde automatique
 * Fréquence par défaut : 360 minutes (6 heures).
 */
function startBackupScheduler() {
  const intervalMinStr = process.env.DB_BACKUP_INTERVAL_MINUTES || "360";
  const intervalMin = Number.parseInt(intervalMinStr, 10);

  if (intervalMin <= 0 || Number.isNaN(intervalMin)) {
    console.log(`[BACKUP] Sauvegarde automatique désactivée (DB_BACKUP_INTERVAL_MINUTES=${intervalMinStr}).`);
    return;
  }

  console.log(
    `[BACKUP] Planificateur de sauvegarde activé : fréquence de ${intervalMin} minutes (${(intervalMin / 60).toFixed(1)} heures).`,
  );

  // Vérifier si un export récent existe déjà pour éviter un double export au redémarrage
  if (!hasRecentBackup(intervalMin)) {
    console.log("[BACKUP] Aucune sauvegarde récente détectée au démarrage, déclenchement immédiat...");
    exportDatabase().catch((e) => console.error("[BACKUP] Erreur export initial :", e));
  } else {
    console.log("[BACKUP] Une sauvegarde récente existe déjà (< 6h), prochain export dans le cycle planifié.");
  }

  // Intervalle récurrent (6 heures)
  const intervalMs = intervalMin * 60 * 1000;
  setInterval(() => {
    console.log(`[BACKUP][${new Date().toISOString()}] Exécution planifiée de la sauvegarde automatique (cycle 6h)...`);
    exportDatabase().catch((e) => console.error("[BACKUP] Erreur export planifié :", e));
  }, intervalMs);
}

module.exports = {
  exportDatabase,
  startBackupScheduler,
  cleanOldBackups,
  BACKUP_DIR,
  S3_BACKUP_PREFIX,
};
