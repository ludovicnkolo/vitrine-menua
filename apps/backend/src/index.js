const express = require("express");
const cors = require("cors");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// ─── VALIDATION DES VARIABLES D'ENVIRONNEMENT CRITIQUES ────────────────────────
// Fail fast at startup — never silently run with missing secrets
const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "VERIFALIA_USERNAME",
  "VERIFALIA_PASSWORD",
];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(
    `[STARTUP] FATAL — Variables d'environnement manquantes: ${missingVars.join(", ")}`,
  );
  console.error(
    "[STARTUP] Le serveur refuse de démarrer. Vérifiez votre fichier .env.",
  );
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "https://menuaconsulting.com/",
      "https://crm-admin.menuaconsulting.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected to Socket.IO");
  
  socket.on("join_entity", (entityId) => {
    socket.join(entityId);
  });

  socket.on("leave_entity", (entityId) => {
    socket.leave(entityId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from Socket.IO");
  });
});

const prisma = new PrismaClient();

// Confiance au reverse proxy (Nginx) pour obtenir l'adresse IP réelle de l'utilisateur
app.set("trust proxy", 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        frameSrc: ["'self'"], // Permettre l'iframe pour les PDF depuis la même origine
      },
    },
    xDownloadOptions: false, // Permet l'affichage inline sur les vieux navigateurs
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permet au frontend de charger la ressource (PDF/Images)
    xFrameOptions: { action: "sameorigin" }, // Autorise l'intégration dans une iframe depuis la même origine
  }),
);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "https://menuaconsulting.com/",
      "https://crm-admin.menuaconsulting.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS, 10), // from .env
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_MAX, 10), // from .env
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Trop de requêtes, veuillez réessayer plus tard.",
  },
});
app.use(limiter);
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT })); // from .env
app.use(cookieParser());

// Middlewares
const logAudit = async (userId, action, targetId, targetType, details) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetId,
        targetType,
        details: JSON.stringify(details),
      },
    });
  } catch (error) {
    console.error("Failed to log audit", error);
  }
};

// Routes placeholder
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MENUA CRM Backend is running" });
});

// Forms routes (Contact & Join)
const formsRouter = require("./routes/forms");
app.use("/api/forms", formsRouter);

// Auth routes (Login, Setup)
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

// Files routes (Secure Buckets)
const filesRouter = require("./routes/files");
app.use("/api/files", filesRouter);

// CRM routes (Modularized)
app.use("/api/crm", require("./routes/crm/users"));
app.use("/api/crm", require("./routes/crm/clients"));
app.use("/api/crm", require("./routes/crm/dossiers"));
app.use("/api/crm", require("./routes/crm/audit"));
app.use("/api/crm", require("./routes/crm/missions"));
app.use("/api/crm", require("./routes/crm/taches"));
app.use("/api/crm", require("./routes/crm/documents"));
app.use("/api/crm", require("./routes/crm/messages"));
app.use("/api/crm", require("./routes/crm/dashboard"));
app.use("/api/crm", require("./routes/crm/notifications"));

// CMS routes (Publications, Offres)
const cmsRouter = require("./routes/cms");
app.use("/api/cms", cmsRouter);

// Poles d'activité routes
const polesRouter = require("./routes/poles");
app.use("/api/poles", polesRouter);

// Magic Links routes
const magicRouter = require("./routes/magic");
app.use("/api/magic", magicRouter);

// Get all dossiers
app.get("/api/dossiers", async (req, res) => {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: { tasks: true },
    });
    res.json(dossiers);
  } catch (error) {
    console.error("Erreur récupération dossiers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);

  // Auto-seed default roles and admin on startup
  try {
    const { execFileSync } = require("node:child_process");
    console.log(
      "Running seed_admin.js to ensure default roles and admin exist...",
    );
    execFileSync(process.execPath, ["seed_admin.js"], {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
  } catch (err) {
    console.error("Failed to run seed_admin.js on startup:", err);
  }

  // Lancement de l'export de la base de données toutes les 10 minutes
  try {
    const exportDatabase = require("../export_db");
    // On fait un premier export au démarrage (optionnel, mais utile)
    exportDatabase();

    const intervalMinStr = process.env.DB_BACKUP_INTERVAL_MINUTES || "10";
    const intervalMin = parseInt(intervalMinStr, 10);
    if (intervalMin > 0) {
      const intervalMs = intervalMin * 60 * 1000;
      setInterval(() => {
        const date = new Date().toLocaleString();
        console.log(`[${date}] Nouvelle exécution planifiée de l'export...`);
        exportDatabase();
      }, intervalMs);
      console.log(
        `Tâche d'export automatique de la base de données configurée (toutes les ${intervalMin} min).`,
      );
    } else {
      console.log(
        `Export automatique désactivé (DB_BACKUP_INTERVAL_MINUTES=${intervalMinStr}).`,
      );
    }
  } catch (err) {
    console.error("Erreur lors du paramétrage de l'export automatique :", err);
  }

  // Start Verifalia Cron
  try {
    const { startVerifaliaCron } = require("./services/verifaliaCron");
    startVerifaliaCron();
    console.log("Verifalia Cron started.");
  } catch (err) {
    console.error("Failed to start Verifalia Cron:", err);
  }

  // Start Storage Cleanup Cron (GED & CMS)
  try {
    const { startStorageCron } = require("./services/storageCron");
    startStorageCron();
    console.log("Storage Cron started.");
  } catch (err) {
    console.error("Failed to start Storage Cron:", err);
  }

  // Start Local S3 Sync Cron (Fallback uploads)
  try {
    const { startLocalUploadSyncCron } = require("./services/localUploadSync");
    startLocalUploadSyncCron();
    console.log("Local S3 Sync Cron started.");
  } catch (err) {
    console.error("Failed to start Local S3 Sync Cron:", err);
  }

  // Alignement automatique : les anciens emails importés avec EN_ATTENTE passent au statut standard NOUVEAU
  prisma.messagePersonnel
    .updateMany({
      where: { status: "EN_ATTENTE" },
      data: { status: "NOUVEAU" },
    })
    .then((res) => {
      if (res.count > 0) {
        console.log(`[Migration] ${res.count} email(s) aligné(s) vers le statut NOUVEAU.`);
      }
    })
    .catch((err) => console.error("Erreur alignement statuts emails:", err.message));
});
