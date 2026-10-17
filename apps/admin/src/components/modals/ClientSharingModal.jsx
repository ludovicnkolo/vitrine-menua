import React, { useState, useRef } from "react";
import {
  X,
  UserCheck,
  Link as LinkIcon,
  CheckCircle2,
  ChevronDown,
  Loader2,
  ArrowUp,
  FileText,
} from "lucide-react";
import { getSafeApiUrl } from "../../utils/helpers";
import DirectClientShareSection from "./DirectClientShareSection";

const ClientSharingModal = ({
  isOpen,
  onClose,
  consultDossier,
  dbClients = [],
  dbUsers = [],
  onRefresh,
}) => {
  const [shareMode, setShareMode] = useState("DIRECT"); // "DIRECT" | "MAGIC"

  const [magicType, setMagicType] = useState("ACQUISITION");
  const [magicExpires, setMagicExpires] = useState("7");
  const [magicNote, setMagicNote] = useState("");
  const [generatedMagicUrl, setGeneratedMagicUrl] = useState("");
  const [generatedMagicLinkId, setGeneratedMagicLinkId] = useState(null);
  const magicFileInputRef = useRef(null);
  const [isGeneratingMagic, setIsGeneratingMagic] = useState(false);
  const [magicFiles, setMagicFiles] = useState([]);
  const [magicEmailRecipient, setMagicEmailRecipient] = useState("");
  const [magicEmailSending, setMagicEmailSending] = useState(false);
  const [magicEmailSent, setMagicEmailSent] = useState(false);
  const [magicLinkCopied, setMagicLinkCopied] = useState(false);

  if (!isOpen || !consultDossier) return null;

  const targetClientId = consultDossier?.clientId || consultDossier?.client?.id;
  const clientFromDb = dbClients.find((c) => c.id === targetClientId);
  const activeConsultClient = clientFromDb || consultDossier?.client;
  const activeConsultClientUser =
    clientFromDb?.user ||
    consultDossier?.client?.user ||
    activeConsultClient?.user;
  const isConsultClientAccountActive = Boolean(
    activeConsultClientUser &&
      String(activeConsultClientUser.status || "").trim().toLowerCase() === "actif" &&
      !activeConsultClientUser.isBlocked
  );

  const handleGenerateMagicLink = async () => {
    setIsGeneratingMagic(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";

      const attachedDocumentIds = [];
      if (magicType === "LIVRAISON" && magicFiles.length > 0) {
        for (const file of magicFiles) {
          const formData = new FormData();
          formData.append("bucket", "ged");
          formData.append("dossierId", consultDossier.id);
          formData.append("name", file.name);
          formData.append("file", file);
          formData.append("category", "LIVRABLE");
          formData.append("isSentToClient", "true");
          formData.append("direction", "SORTANT");
          const uploadRes = await fetch(
            getSafeApiUrl("/api/files/upload-and-attach"),
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            }
          );
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.document?.id) {
              attachedDocumentIds.push(uploadData.document.id);
            }
          } else {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(
              errData.error || `Erreur d'upload pour le fichier ${file.name}`
            );
          }
        }
      }

      const res = await fetch(getSafeApiUrl("/api/magic/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dossierId: consultDossier.id,
          type: magicType,
          expiresInDays: parseInt(magicExpires, 10),
          note: magicNote.trim() || null,
          attachedDocumentIds:
            magicType === "LIVRAISON" && attachedDocumentIds.length > 0
              ? attachedDocumentIds
              : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const magicUrl = `${window.location.origin}/depot/${data.data.token}`;
        setGeneratedMagicUrl(magicUrl);
        setGeneratedMagicLinkId(data.data.id);
        const defaultEmail =
          consultDossier?.client?.email ||
          dbClients.find((c) => c.id === consultDossier?.clientId)?.email ||
          consultDossier?.targetUser?.email ||
          dbUsers.find((u) => u.id === consultDossier?.targetUserId)?.email ||
          "";
        setMagicEmailRecipient(defaultEmail);
        setMagicEmailSent(false);
        setMagicLinkCopied(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert(
          errData.error || "Erreur lors de la génération du lien."
        );
      }
    } catch (err) {
      console.error("Erreur génération lien magique:", err);
      window.customAlert(err.message || "Erreur réseau");
    } finally {
      setIsGeneratingMagic(false);
    }
  };

  const handleSendMagicEmail = async () => {
    if (!magicEmailRecipient.trim() || !generatedMagicLinkId) {
      window.customAlert("Veuillez renseigner une adresse email valide.");
      return;
    }
    setMagicEmailSending(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";
      const res = await fetch(
        getSafeApiUrl(`/api/magic/send-email/${generatedMagicLinkId}`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipientEmail: magicEmailRecipient.trim(),
            magicUrl: generatedMagicUrl,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMagicEmailSent(true);
      } else {
        window.customAlert(
          data.error || "Une erreur est survenue lors de l'envoi de l'email."
        );
      }
    } catch (err) {
      console.error("Erreur envoi email:", err);
      window.customAlert(
        err.message || "Erreur réseau lors de l'envoi de l'email."
      );
    } finally {
      setMagicEmailSending(false);
    }
  };

  return (
    <div
      className="fade-in fixed inset-0 flex items-center justify-center p-4"
      style={{
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: generatedMagicUrl ? "500px" : "540px" }}
      >
        {/* Entête du modal */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 m-0">
              Partage de document
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-0">
              Dossier : {consultDossier.reference || consultDossier.name} • Cible :{" "}
              {consultDossier?.client?.name ||
                dbClients.find((c) => c.id === consultDossier?.clientId)?.name ||
                "Client"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sélecteur des méthodes de partage */}
        {!generatedMagicUrl && (
          <>
            {isConsultClientAccountActive ? (
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setShareMode("DIRECT");
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    shareMode === "DIRECT"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <UserCheck
                    size={16}
                    className={shareMode === "DIRECT" ? "text-blue-600" : ""}
                  />
                  Compte client direct
                </button>

                <button
                  type="button"
                  onClick={() => setShareMode("MAGIC")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    shareMode === "MAGIC"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <LinkIcon
                    size={16}
                    className={shareMode === "MAGIC" ? "text-amber-600" : ""}
                  />
                  Lien magique
                </button>
              </div>
            ) : (
              <div className="bg-slate-100/80 p-2.5 rounded-xl mb-5 flex items-center justify-between text-xs border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <LinkIcon size={16} className="text-amber-600" />
                  <span>Partage par Lien magique</span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {activeConsultClientUser
                    ? "Compte client non actif (Lien magique requis)"
                    : "Client sans compte portail (Lien magique requis)"}
                </span>
              </div>
            )}
          </>
        )}

        {/* MODE 1 : INTERACTION DIRECTE AVEC LE COMPTE CLIENT */}
        {shareMode === "DIRECT" && isConsultClientAccountActive && !generatedMagicUrl && (
          <DirectClientShareSection
            consultDossier={consultDossier}
            dbClients={dbClients}
            onClose={onClose}
            onRefresh={onRefresh}
          />
        )}

        {/* MODE 2 : LIEN MAGIQUE TEMPORAIRE SÉCURISÉ */}
        {(shareMode === "MAGIC" || !isConsultClientAccountActive || generatedMagicUrl) && (
          <>
            {!generatedMagicUrl ? (
              <>
                <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setMagicType("ACQUISITION")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      magicType === "ACQUISITION"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Demander des fichiers
                  </button>
                  <button
                    type="button"
                    onClick={() => setMagicType("LIVRAISON")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                      magicType === "LIVRAISON"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Envoyer des fichiers
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    DURÉE DE VALIDITÉ DU LIEN
                  </label>
                  <div className="relative">
                    <select
                      value={magicExpires}
                      onChange={(e) => setMagicExpires(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="7">7 jours (Recommandé)</option>
                      <option value="1">24 heures</option>
                      <option value="2">48 heures</option>
                      <option value="14">14 jours</option>
                      <option value="30">30 jours</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    MESSAGE POUR LE DESTINATAIRE (OPTIONNEL)
                  </label>
                  <textarea
                    value={magicNote}
                    onChange={(e) => setMagicNote(e.target.value)}
                    placeholder={
                      magicType === "ACQUISITION"
                        ? "Ex: Merci de nous transmettre vos pièces justificatives..."
                        : "Ex: Veuillez trouver ci-joint les documents préparés..."
                    }
                    rows={3}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {magicType === "LIVRAISON" && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                      DOCUMENTS À JOINDRE
                    </label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dropped = Array.from(e.dataTransfer.files);
                        setMagicFiles((prev) => [...prev, ...dropped]);
                      }}
                      onClick={() => magicFileInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-200 bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-5 text-center cursor-pointer transition-all"
                    >
                      <input
                        ref={magicFileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const selected = Array.from(e.target.files);
                          setMagicFiles((prev) => [...prev, ...selected]);
                          e.target.value = "";
                        }}
                      />
                      <div className="flex justify-center mb-1 text-blue-600">
                        <ArrowUp size={22} strokeWidth={2.4} />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 m-0">
                        Glissez vos fichiers ici <span className="text-blue-600 hover:underline">parcourir</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-0">
                        PDF, PNG, DOCX jusqu'à 25 Mo
                      </p>
                    </div>

                    {magicFiles.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                        {magicFiles.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={16} className="text-slate-400 shrink-0" />
                              <span className="truncate font-medium">{f.name}</span>
                              <span className="text-slate-400 shrink-0">
                                ({(f.size / 1024 / 1024).toFixed(1)} Mo)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMagicFiles((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                              }}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={
                      isGeneratingMagic ||
                      (magicType === "LIVRAISON" && magicFiles.length === 0)
                    }
                    onClick={handleGenerateMagicLink}
                    className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    {isGeneratingMagic && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {isGeneratingMagic
                      ? "Génération..."
                      : "Générer le lien magique"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 m-0">
                      Lien magique de partage prêt
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 mb-0">
                      Actif pendant {magicExpires} jours •{" "}
                      {magicType === "LIVRAISON"
                        ? `${magicFiles.length || 1} document${
                            (magicFiles.length || 1) > 1 ? "s" : ""
                          } attaché${(magicFiles.length || 1) > 1 ? "s" : ""}`
                        : "Demande de fichiers client"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    LIEN SÉCURISÉ GÉNÉRÉ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedMagicUrl}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 truncate font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedMagicUrl);
                        setMagicLinkCopied(true);
                        setTimeout(() => setMagicLinkCopied(false), 2000);
                      }}
                      className="px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl shrink-0 transition cursor-pointer"
                    >
                      {magicLinkCopied ? "Copié !" : "Copier"}
                    </button>
                  </div>
                </div>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    OU
                  </span>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    TRANSMETTRE DIRECTEMENT PAR EMAIL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={magicEmailRecipient}
                      onChange={(e) => setMagicEmailRecipient(e.target.value)}
                      placeholder="client@entreprise.com"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      disabled={magicEmailSending || !magicEmailRecipient.trim()}
                      onClick={handleSendMagicEmail}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shrink-0 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {magicEmailSending && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      {magicEmailSending ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                  {magicEmailSent && (
                    <p className="text-xs text-emerald-600 font-medium mt-1.5 mb-0">
                      ✅ Email transmis avec succès à {magicEmailRecipient} !
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientSharingModal;
