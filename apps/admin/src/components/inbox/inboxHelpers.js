import {
  MESSAGE_STATUS_CONFIG,
  MESSAGE_TRANSITIONS_FRONTEND,
  getMessageStatusLabel,
} from "../../utils/constants";

export const normalizeRole = (r) => {
  const str = typeof r === "string" ? r : r?.name || "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .trim();
};

export const isSuperAdmin = (r) => normalizeRole(r).includes("super admin");

export const isOperationalManager = (r) => {
  const norm = normalizeRole(r);
  return norm.includes("responsable operationnel") || norm.includes("operationnel");
};

export const isAdminOrSuperAdmin = (r) => {
  const norm = normalizeRole(r);
  return norm.includes("admin");
};

export const getAllowedMessageStatuses = (currentStatus, category, role) => {
  const isSA = isSuperAdmin(role);
  const isRO = isOperationalManager(role);

  // Rôle non autorisé pour Contact/Recrutement
  if (!isSA && !isRO && category !== "interne") {
    return [{ value: currentStatus, label: getMessageStatusLabel(currentStatus) }];
  }

  const cat = (category || "general").toLowerCase();
  const pipeline = MESSAGE_TRANSITIONS_FRONTEND[cat] || MESSAGE_TRANSITIONS_FRONTEND.general;
  const allowed = pipeline ? pipeline[currentStatus] : undefined;

  // Si statut hors pipeline (ex: EN_ATTENTE hérité), proposer les entrées de pipeline
  if (allowed === undefined) {
    if (cat === "contact") {
      return [currentStatus, "NOUVEAU", "A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"].map(v => ({
        value: v,
        label: getMessageStatusLabel(v),
      }));
    }
    if (cat === "recrutement") {
      return [currentStatus, "NOUVEAU", "A_RAPPELER", "ENTRETIEN", "REFUSE"].map(v => ({
        value: v,
        label: getMessageStatusLabel(v),
      }));
    }
    if (cat === "interne") {
      return ["NON_CONSULTE", "CONSULTE"].map(v => ({
        value: v,
        label: getMessageStatusLabel(v),
      }));
    }
    return [{ value: currentStatus, label: getMessageStatusLabel(currentStatus) }];
  }

  const result = [currentStatus, ...allowed.filter((v) => v !== currentStatus)];
  return result.map((val) => ({
    value: val,
    label: getMessageStatusLabel(val),
  }));
};

export const getDisplayStatus = (status, t) => {
  if (!status) return t ? t("status.NOUVEAU", "Nouveau") : "Nouveau";
  const s = String(status).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const cfg = MESSAGE_STATUS_CONFIG[s];
  if (cfg) {
    return t ? t(`status.${s}`, cfg.label) : cfg.label;
  }
  if (s === "CLASSE") return t ? t("status.CLASSE", "Classé") : "Classé";
  return t ? t(`status.${s}`, status) : status;
};

export const getStatusBadge = (status) => {
  if (!status) return { bg: "#DBEAFE", color: "#1E3A8A" };
  const s = String(status).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const cfg = MESSAGE_STATUS_CONFIG[s];
  if (cfg) {
    return { bg: cfg.bg, color: cfg.color };
  }
  return { bg: "#F1F5F9", color: "#475569" };
};

export const getVerifaliaBadge = (vStatus) => {
  if (!vStatus) return { text: "Non vérifié", bg: "#F1F5F9", color: "#64748B" };
  const s = String(vStatus).toUpperCase();
  if (s.includes("VALID") || s === "DELIVERABLE" || s === "COMPLETED_VALID") {
    return { text: "Valide", bg: "#DCFCE7", color: "#166534" };
  }
  if (s.includes("INVALID") || s === "UNDELIVERABLE") {
    return { text: "Invalide", bg: "#FEE2E2", color: "#991B1B" };
  }
  return { text: "À vérifier", bg: "#FEF3C7", color: "#92400E" };
};

export const formatPriority = (p, t) => {
  if (!p) return t ? t("priority.NORMAL", "Normal") : "Normal";
  const s = String(p).trim().toUpperCase();
  if (s === "URGENT" || s === "URGENTE") return t ? t("priority.URGENT", "Urgent") : "Urgent";
  if (s === "PRIORITAIRE" || s === "HAUTE" || s === "ELEVE" || s === "ELEVEE") return t ? t("priority.PRIORITAIRE", "Prioritaire") : "Prioritaire";
  if (s === "FAIBLE" || s === "BASSE") return t ? t("priority.FAIBLE", "Faible") : "Faible";
  if (s === "NORMAL" || s === "NORMALE") return t ? t("priority.NORMAL", "Normal") : "Normal";
  const title = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  return t ? t(`priority.${s}`, title) : title;
};

export const getPriorityBadge = (p) => {
  const norm = formatPriority(p);
  if (norm === "Urgent")
    return { bg: "#FEE2E2", color: "#DC2626" }; // Red
  if (norm === "Prioritaire")
    return { bg: "#FEF3C7", color: "#D97706" }; // Orange
  return { bg: "#DCFCE7", color: "#166534" }; // Green for Normal
};
