const { PrismaClient } = require("@prisma/client");
const fs = require("node:fs");
const path = require("node:path");
const { listObjectsFromS3, getObjectBufferFromS3 } = require("./src/services/s3Service");

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(__dirname, "backups");
const S3_PREFIX = "backups/database/";

/**
 * Formate la taille en octets de manière lisible
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const sizes = ["B", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

/**
 * Liste toutes les sauvegardes disponibles en local et sur OVH S3
 */
async function listAvailableBackups() {
  console.log("════════════════════════════════════════════════════════════════════");
  console.log(" 📦 SAUVEGARDES DISPONIBLES (Local & OVH Object Storage)");
  console.log("════════════════════════════════════════════════════════════════════\n");

  // 1. Sauvegardes locales
  console.log("📂 Sauvegardes locales (sur le serveur) :");
  const localList = [];
  if (fs.existsSync(BACKUP_DIR)) {
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    for (const f of files) {
      const stats = fs.statSync(path.join(BACKUP_DIR, f));
      localList.push({
        source: "LOCAL",
        name: f,
        path: path.join(BACKUP_DIR, f),
        size: stats.size,
        date: stats.mtime,
      });
    }
  }

  if (localList.length === 0) {
    console.log("   (Aucune sauvegarde locale)");
  } else {
    localList.forEach((b, i) => {
      console.log(`   [L${i + 1}] ${b.name.padEnd(38)} ${formatBytes(b.size).padStart(10)}  ${b.date.toLocaleString("fr-FR")}`);
    });
  }

  // 2. Sauvegardes distantes sur OVH S3
  console.log("\n☁️  Sauvegardes distantes (OVH Object Storage - Bucket privé) :");
  let s3List = [];
  try {
    const s3Objects = await listObjectsFromS3(S3_PREFIX);
    s3List = s3Objects
      .filter((obj) => obj.Key && obj.Key.endsWith(".json"))
      .sort((a, b) => new Date(b.LastModified || 0) - new Date(a.LastModified || 0))
      .map((obj) => ({
        source: "S3",
        key: obj.Key,
        name: obj.Key.replace(S3_PREFIX, ""),
        size: obj.Size || 0,
        date: obj.LastModified ? new Date(obj.LastModified) : new Date(),
      }));
  } catch (err) {
    console.error("   ❌ Impossible de contacter OVH S3 :", err.message);
  }

  if (s3List.length === 0) {
    console.log("   (Aucune sauvegarde sur OVH S3)");
  } else {
    s3List.forEach((b, i) => {
      console.log(`   [S${i + 1}] ${b.name.padEnd(38)} ${formatBytes(b.size).padStart(10)}  ${b.date.toLocaleString("fr-FR")}`);
    });
  }

  console.log("\n────────────────────────────────────────────────────────────────────");
  console.log("💡 Pour restaurer une sauvegarde spécifique, exécutez :");
  console.log("   node restore_db.js <nom_du_fichier>");
  console.log("   Exemples :");
  console.log("     node restore_db.js db_backup_2026-10-13_16-54-54.json");
  console.log("     node restore_db.js latest.json");
  console.log("════════════════════════════════════════════════════════════════════\n");

  return { localList, s3List };
}

/**
 * Récupère le contenu d'un fichier de sauvegarde (local ou depuis S3)
 */
async function resolveBackupContent(target) {
  // Cas par défaut ou "latest"
  if (!target || target === "latest" || target === "latest.json") {
    const latestLocal = path.join(BACKUP_DIR, "latest.json");
    if (fs.existsSync(latestLocal)) {
      console.log(`[RESTORE] Utilisation de la sauvegarde locale 'latest.json'...`);
      return fs.readFileSync(latestLocal, "utf-8");
    }
    const compatLocal = path.join(BACKUP_DIR, "db_export.json");
    if (fs.existsSync(compatLocal)) {
      console.log(`[RESTORE] Utilisation de la sauvegarde locale 'db_export.json'...`);
      return fs.readFileSync(compatLocal, "utf-8");
    }
    // Essayer de récupérer latest.json sur S3
    try {
      console.log(`[RESTORE] Téléchargement de 'latest.json' depuis OVH S3...`);
      const buf = await getObjectBufferFromS3(`${S3_PREFIX}latest.json`);
      return buf.toString("utf-8");
    } catch {
      throw new Error("Aucune sauvegarde 'latest' trouvée ni en local ni sur OVH S3.");
    }
  }

  // Si c'est un chemin absolu ou relatif local existant
  if (fs.existsSync(target)) {
    console.log(`[RESTORE] Lecture du fichier local : ${target}`);
    return fs.readFileSync(target, "utf-8");
  }

  // Si le fichier se trouve directement dans le dossier backups local
  const localTarget = path.join(BACKUP_DIR, path.basename(target));
  if (fs.existsSync(localTarget)) {
    console.log(`[RESTORE] Lecture de la sauvegarde locale : ${localTarget}`);
    return fs.readFileSync(localTarget, "utf-8");
  }

  // Sinon, essayer de le télécharger depuis OVH S3
  const s3Key = target.startsWith(S3_PREFIX) ? target : `${S3_PREFIX}${path.basename(target)}`;
  console.log(`[RESTORE] Fichier absent en local, tentative de téléchargement depuis OVH S3 (${s3Key})...`);
  try {
    const s3Buffer = await getObjectBufferFromS3(s3Key);
    console.log(`[RESTORE] Sauvegarde téléchargée avec succès depuis OVH S3 (${formatBytes(s3Buffer.length)}) !`);

    // On garde une copie locale
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(localTarget, s3Buffer);

    return s3Buffer.toString("utf-8");
  } catch (err) {
    throw new Error(`Impossible de trouver la sauvegarde '${target}' ni en local ni sur OVH S3 (${err.message}).`);
  }
}

/**
 * Procédure de restauration complète dans PostgreSQL via Prisma
 */
async function restoreDatabase(targetArg) {
  try {
    if (targetArg === "--list" || targetArg === "-l") {
      await listAvailableBackups();
      process.exit(0);
    }

    console.log("════════════════════════════════════════════════════════════════════");
    console.log(" 🔄 RESTAURATION DE LA BASE DE DONNÉES MENUA CRM");
    console.log("════════════════════════════════════════════════════════════════════\n");

    const rawJson = await resolveBackupContent(targetArg);
    const data = JSON.parse(rawJson);

    if (data._metadata) {
      console.log(`ℹ️  Métadonnées de sauvegarde :`);
      console.log(`   Exporté le : ${data._metadata.exportedAt || data._metadata.timestamp}`);
      console.log(`   Total enregistrements : ${data._metadata.totalRecords || "N/A"}\n`);
    }

    console.log("🗑️  Suppression des données actuelles dans l'ordre strict des dépendances...");
    await prisma.document.deleteMany();
    await prisma.auditLog.deleteMany();
    if (prisma.notification) await prisma.notification.deleteMany().catch(() => {});
    if (prisma.lienMagique) await prisma.lienMagique.deleteMany().catch(() => {});
    await prisma.tache.deleteMany();
    await prisma.messagePersonnel.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.formulaireRecrutement.deleteMany();
    await prisma.formulaireContact.deleteMany();
    await prisma.formulaire.deleteMany();
    await prisma.dossier.deleteMany();
    await prisma.clientEntreprise.deleteMany();
    await prisma.client.deleteMany();
    if (prisma.publication) await prisma.publication.deleteMany().catch(() => {});
    await prisma.utilisateur.deleteMany();
    if (prisma.poleActivite) await prisma.poleActivite.deleteMany().catch(() => {});
    await prisma.role.deleteMany();
    console.log("   ✓ Données existantes nettoyées proprement.\n");

    console.log("📥 Insertion des données de sauvegarde dans l'ordre relationnel...");

    if (data.roles && data.roles.length > 0) {
      await prisma.role.createMany({ data: data.roles });
      console.log(`   ✓ ${data.roles.length} rôle(s) restauré(s).`);
    }

    if (data.polesActivite && data.polesActivite.length > 0 && prisma.poleActivite) {
      await prisma.poleActivite.createMany({ data: data.polesActivite }).catch(() => {});
      console.log(`   ✓ ${data.polesActivite.length} pôle(s) d'activité restauré(s).`);
    }

    if (data.utilisateurs && data.utilisateurs.length > 0) {
      await prisma.utilisateur.createMany({ data: data.utilisateurs });
      console.log(`   ✓ ${data.utilisateurs.length} utilisateur(s) restauré(s).`);
    }

    if (data.publications && data.publications.length > 0 && prisma.publication) {
      await prisma.publication.createMany({ data: data.publications }).catch(() => {});
      console.log(`   ✓ ${data.publications.length} publication(s) CMS restaurée(s).`);
    }

    if (data.clients && data.clients.length > 0) {
      await prisma.client.createMany({ data: data.clients });
      console.log(`   ✓ ${data.clients.length} client(s) restauré(s).`);
    }

    if (data.clientEntreprises && data.clientEntreprises.length > 0) {
      await prisma.clientEntreprise.createMany({ data: data.clientEntreprises });
      console.log(`   ✓ ${data.clientEntreprises.length} entreprise(s) cliente(s) restaurée(s).`);
    }

    if (data.dossiers && data.dossiers.length > 0) {
      await prisma.dossier.createMany({ data: data.dossiers });
      console.log(`   ✓ ${data.dossiers.length} dossier(s) restauré(s).`);
    }

    if (data.formulaires && data.formulaires.length > 0) {
      await prisma.formulaire.createMany({ data: data.formulaires });
      console.log(`   ✓ ${data.formulaires.length} formulaire(s) restauré(s).`);
    }

    if (data.formulaireContacts && data.formulaireContacts.length > 0) {
      await prisma.formulaireContact.createMany({ data: data.formulaireContacts });
      console.log(`   ✓ ${data.formulaireContacts.length} contact(s) de formulaire restauré(s).`);
    }

    if (data.formulaireRecrutements && data.formulaireRecrutements.length > 0) {
      await prisma.formulaireRecrutement.createMany({ data: data.formulaireRecrutements });
      console.log(`   ✓ ${data.formulaireRecrutements.length} candidature(s) restaurée(s).`);
    }

    if (data.missions && data.missions.length > 0) {
      await prisma.mission.createMany({ data: data.missions });
      console.log(`   ✓ ${data.missions.length} mission(s) restaurée(s).`);
    }

    if (data.messagePersonnels && data.messagePersonnels.length > 0) {
      await prisma.messagePersonnel.createMany({ data: data.messagePersonnels });
      console.log(`   ✓ ${data.messagePersonnels.length} message(s) personnel(s) / e-mail(s) restauré(s).`);
    }

    if (data.taches && data.taches.length > 0) {
      await prisma.tache.createMany({ data: data.taches });
      console.log(`   ✓ ${data.taches.length} tâche(s) restaurée(s).`);
    }

    if (data.documents && data.documents.length > 0) {
      await prisma.document.createMany({ data: data.documents });
      console.log(`   ✓ ${data.documents.length} document(s) GED restauré(s).`);
    }

    if (data.auditLogs && data.auditLogs.length > 0) {
      await prisma.auditLog.createMany({ data: data.auditLogs });
      console.log(`   ✓ ${data.auditLogs.length} entrée(s) d'audit restaurée(s).`);
    }

    if (data.liensMagiques && data.liensMagiques.length > 0 && prisma.lienMagique) {
      await prisma.lienMagique.createMany({ data: data.liensMagiques }).catch(() => {});
      console.log(`   ✓ ${data.liensMagiques.length} lien(s) magique(s) restauré(s).`);
    }

    if (data.notifications && data.notifications.length > 0 && prisma.notification) {
      await prisma.notification.createMany({ data: data.notifications }).catch(() => {});
      console.log(`   ✓ ${data.notifications.length} notification(s) restaurée(s).`);
    }

    console.log("\n════════════════════════════════════════════════════════════════════");
    console.log(" ✅ RESTAURATION TERMINÉE AVEC SUCCÈS !");
    console.log("════════════════════════════════════════════════════════════════════\n");

  } catch (error) {
    console.error("\n❌ ERREUR LORS DE LA RESTAURATION :", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution avec le premier argument CLI (ex: node restore_db.js db_backup_2026-10-13_16-54-54.json)
const targetArg = process.argv[2];
restoreDatabase(targetArg);
