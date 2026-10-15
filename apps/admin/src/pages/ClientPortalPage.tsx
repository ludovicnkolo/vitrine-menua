import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Folder,
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Calendar,
  Building,
  UserCheck,
} from "lucide-react";
import { getSafeApiUrl, formatDate } from "../utils/helpers";
import { User } from "../types/auth";

interface ClientPortalPageProps {
  user: User;
}

export default function ClientPortalPage({ user }: ClientPortalPageProps) {
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    if (user.clientId) {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      fetch(getSafeApiUrl(`/api/crm/clients/${user.clientId}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setClientData(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user.clientId]);

  return (
    <div className="fade-in flex flex-col gap-6" style={{ padding: "1rem 0" }}>
      {/* Bannière de Bienvenue Espace Client */}
      <div
        className="flex items-center justify-between flex-wrap gap-4 p-6"
        style={{
          background: "linear-gradient(135deg, #141824 0%, #1e293b 100%)",
          borderRadius: "14px",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center font-bold shrink-0"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "rgba(201, 156, 92, 0.2)",
              color: "#c99c5c",
              border: "1.5px solid rgba(201, 156, 92, 0.4)",
              fontSize: "1.5rem",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "12px",
                  backgroundColor: "rgba(201, 156, 92, 0.25)",
                  color: "#e2b87a",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Portail Client Sécurisé
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{
                  fontSize: "0.75rem",
                  color: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "12px",
                }}
              >
                <CheckCircle2 size={12} /> Accès Chiffré & Cloisonné
              </span>
            </div>
            <h1 className="font-bold text-white mt-1 mb-0" style={{ fontSize: "1.5rem" }}>
              Bienvenue, {user.name}
            </h1>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
              Plateforme documentaire dédiée aux échanges entre vous et l'équipe MENUA CONSULTING.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.12)" }}
          >
            <Lock size={16} color="#c99c5c" />
            <span style={{ fontSize: "0.8rem", color: "#e2e8f0" }}>
              Identifiant : <strong>{user.email}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Règle de Cloisonnement & Information de Sécurité */}
      <div
        className="p-4 flex items-start gap-3"
        style={{
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderLeft: "4px solid #c99c5c",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <ShieldCheck size={22} color="#c99c5c" className="shrink-0 mt-0.5" />
        <div style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.5 }}>
          <strong>Espace Confidentiel et Restreint :</strong> Conformément aux normes de déontologie de MENUA CONSULTING, votre espace est strictement isolé.
          Vous n'avez accès qu'aux pièces justificatives que vous transmettez et aux livrables finaux validés par votre gestionnaire.
        </div>
      </div>

      {/* Cartes d'activité et synthèse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="p-5 flex flex-col justify-between"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Fiche Client
            </span>
            <Building size={20} color="var(--primary, #c99c5c)" />
          </div>
          <div className="mt-3">
            <div className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.1rem" }}>
              {clientData?.entreprise?.raisonSociale || clientData?.name || user.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Type : {clientData?.type === "SOCIETE" ? "Entreprise / Société" : "Particulier"}
            </div>
          </div>
        </div>

        <div
          className="p-5 flex flex-col justify-between"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Statut du Compte
            </span>
            <UserCheck size={20} color="#059669" />
          </div>
          <div className="mt-3">
            <span
              className="inline-flex items-center gap-1 font-bold"
              style={{
                fontSize: "0.85rem",
                padding: "0.2rem 0.65rem",
                borderRadius: "16px",
                backgroundColor: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
              }}
            >
              <CheckCircle2 size={13} /> Compte Client Actif
            </span>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Dernière connexion enregistrée
            </div>
          </div>
        </div>

        <div
          className="p-5 flex flex-col justify-between"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Sécurité des Flux
            </span>
            <ShieldCheck size={20} color="#2563EB" />
          </div>
          <div className="mt-3">
            <div className="font-bold text-[var(--text-main)]" style={{ fontSize: "0.95rem" }}>
              Audit Log Intégral
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Tous les dépôts et téléchargements sont tracés
            </div>
          </div>
        </div>
      </div>

      {/* Section Dépôt & Restitution Documentaire */}
      <div
        className="p-6 flex flex-col gap-4"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "rgba(201, 156, 92, 0.12)",
                color: "var(--primary, #c99c5c)",
              }}
            >
              <Folder size={22} />
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.15rem", margin: 0 }}>
                Dossier Documentaire Client
              </h2>
              <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Consultez les livrables restitués et déposez vos pièces justificatives
              </p>
            </div>
          </div>
        </div>

        {/* Message d'état du dossier documentaire */}
        <div
          className="p-8 flex flex-col items-center justify-center text-center gap-3"
          style={{
            backgroundColor: "#F8FAFC",
            borderRadius: "10px",
            border: "1.5px dashed #CBD5E1",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-main)]" style={{ fontSize: "1.05rem", margin: 0 }}>
              Dossier Documentaire Initialisé
            </h3>
            <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "520px" }}>
              Votre compte client est désormais actif. Votre gestionnaire MENUA CONSULTING finalise l'arborescence de restitution de vos livrables. Vous serez notifié par email à chaque nouvelle pièce déposée ou restituée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
