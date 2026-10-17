import React from "react";
import { UserPlus, Loader } from "lucide-react";
import Modal from "../ui/Modal";

const ConvertClientAccountModal = ({
  convertModalClient,
  onClose,
  convertName,
  setConvertName,
  convertEmail,
  setConvertEmail,
  accountActionLoading,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={Boolean(convertModalClient)}
      onClose={onClose}
      title="Convertir en Compte Client"
      subtitle="Initialisation des accès au portail sécurisé GED"
      icon={<UserPlus size={24} />}
      maxWidth="520px"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-semibold"
            style={{
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "#FFFFFF",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={accountActionLoading || !convertEmail.trim()}
            onClick={onConfirm}
            className="cursor-pointer font-bold inline-flex items-center gap-2"
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary, #c99c5c)",
              color: "#FFFFFF",
              fontSize: "0.85rem",
              opacity: accountActionLoading || !convertEmail.trim() ? 0.6 : 1,
            }}
          >
            {accountActionLoading ? (
              <>
                <Loader size={16} className="animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Créer le compte & Inviter
              </>
            )}
          </button>
        </>
      }
    >
      <div
        style={{
          backgroundColor: "#F8FAFC",
          borderLeft: "4px solid var(--primary, #c99c5c)",
          padding: "0.75rem 1rem",
          borderRadius: "0 6px 6px 0",
          fontSize: "0.85rem",
          color: "#334155",
          lineHeight: 1.5,
        }}
      >
        Un compte nominatif va être créé pour ce client. Une invitation officielle contenant un lien sécurisé d'activation lui sera transmise par e-mail afin qu'il définisse son mot de passe de manière autonome.
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block font-bold text-[var(--text-main)] mb-1" style={{ fontSize: "0.8rem" }}>
            Nom / Raison Sociale affiché(e)
          </label>
          <input
            type="text"
            value={convertName}
            onChange={(e) => setConvertName(e.target.value)}
            className="w-full"
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <label className="block font-bold text-[var(--text-main)] mb-1" style={{ fontSize: "0.8rem" }}>
            Adresse email du compte (pour réception de l'invitation) <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="email"
            value={convertEmail}
            onChange={(e) => setConvertEmail(e.target.value)}
            required
            className="w-full"
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "0.9rem",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConvertClientAccountModal;
