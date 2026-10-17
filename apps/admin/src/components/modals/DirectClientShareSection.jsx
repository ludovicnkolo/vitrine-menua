import React, { useState, useRef } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  ArrowUp,
  FileText,
  X,
} from "lucide-react";
import { getSafeApiUrl } from "../../utils/helpers";

const DirectClientShareSection = ({
  consultDossier,
  dbClients = [],
  onClose,
  onRefresh,
}) => {
  const [directShareType, setDirectShareType] = useState("ACQUISITION");
  const [directShareFiles, setDirectShareFiles] = useState([]);
  const [directShareStatus, setDirectShareStatus] = useState("VALIDE");
  const [directShareNote, setDirectShareNote] = useState("");
  const [isSubmittingDirectShare, setIsSubmittingDirectShare] = useState(false);
  const [directShareSuccess, setDirectShareSuccess] = useState(false);
  const directFileInputRef = useRef(null);

  const [directRequestTitle, setDirectRequestTitle] = useState("");
  const [directRequestInstructions, setDirectRequestInstructions] = useState("");
  const [directRequestDeadline, setDirectRequestDeadline] = useState("7");
  const [isSubmittingDirectRequest, setIsSubmittingDirectRequest] = useState(false);
  const [directRequestSuccess, setDirectRequestSuccess] = useState(false);

  const handleDirectShareSubmit = async () => {
    if (!consultDossier?.id || directShareFiles.length === 0) {
      window.customAlert(
        "Veuillez sélectionner au moins un fichier à déposer sur le compte client."
      );
      return;
    }

    setIsSubmittingDirectShare(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";
      for (const file of directShareFiles) {
        const formData = new FormData();
        formData.append("bucket", "ged");
        formData.append("dossierId", consultDossier.id);
        formData.append("name", file.name);
        formData.append("file", file);
        formData.append("status", directShareStatus);
        formData.append("category", "RESTITUTION");
        formData.append("isSentToClient", "true");
        formData.append("direction", "SORTANT");
        if (directShareNote.trim()) {
          formData.append("note", directShareNote.trim());
        }

        const res = await fetch(getSafeApiUrl("/api/files/upload-and-attach"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error || `Erreur d'upload pour le fichier ${file.name}`
          );
        }
      }

      setDirectShareSuccess(true);
      setDirectShareFiles([]);
      setDirectShareNote("");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Erreur partage direct client:", err);
      window.customAlert(
        err.message || "Erreur réseau lors de la publication."
      );
    } finally {
      setIsSubmittingDirectShare(false);
    }
  };

  const handleDirectRequestSubmit = async () => {
    if (!consultDossier?.id) return;
    if (!directRequestTitle.trim()) {
      window.customAlert(
        "Veuillez renseigner l'intitulé des pièces ou documents sollicités."
      );
      return;
    }

    setIsSubmittingDirectRequest(true);
    try {
      const token =
        sessionStorage.getItem("adminToken") ||
        localStorage.getItem("adminToken") ||
        "";
      const res = await fetch(
        getSafeApiUrl(
          `/api/crm/dossiers/${consultDossier.id}/request-client-documents`
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentTitle: directRequestTitle.trim(),
            instructions: directRequestInstructions.trim(),
            deadlineDays: parseInt(directRequestDeadline, 10),
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setDirectRequestSuccess(true);
        setDirectRequestTitle("");
        setDirectRequestInstructions("");
      } else {
        window.customAlert(
          data.error || "Erreur lors de la transmission de la demande."
        );
      }
    } catch (err) {
      console.error("Erreur demande documents client:", err);
      window.customAlert(err.message || "Erreur réseau lors de la demande.");
    } finally {
      setIsSubmittingDirectRequest(false);
    }
  };

  return (
    <div>
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => {
            setDirectShareType("ACQUISITION");
            setDirectRequestSuccess(false);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            directShareType === "ACQUISITION"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Demander des fichiers
        </button>
        <button
          type="button"
          onClick={() => {
            setDirectShareType("LIVRAISON");
            setDirectShareSuccess(false);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            directShareType === "LIVRAISON"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Envoyer des fichiers
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">
          {directShareType === "ACQUISITION"
            ? "Sollicitez des pièces justificatives directement sur le portail sécurisé de votre client. Une notification et un email lui seront automatiquement transmis."
            : "Déposez directement un livrable ou un document validé sur l'Espace Client sécurisé. Il y aura accès immédiatement dès sa connexion."}
        </p>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>
            <strong>Compte Client Actif</strong> (
            {consultDossier?.client?.email ||
              dbClients.find((c) => c.id === consultDossier?.clientId)?.email}
            ) — Le client sera notifié en direct.
          </span>
        </div>
      </div>

      {/* DEMANDER DES FICHIERS */}
      {directShareType === "ACQUISITION" && (
        <>
          {directRequestSuccess ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={26} />
              </div>
              <h4 className="text-base font-bold text-slate-900 m-0">
                Demande de documents transmise !
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Votre client a été notifié et peut déposer ses pièces directement depuis son Espace Client.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDirectRequestSuccess(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Faire une autre demande
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  INTITULÉ DE LA DEMANDE <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={directRequestTitle}
                  onChange={(e) => setDirectRequestTitle(e.target.value)}
                  placeholder="Ex: Dernier bilan comptable certifié, Kbis < 3 mois..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  INSTRUCTIONS COMPLÉMENTAIRES (FACULTATIF)
                </label>
                <textarea
                  value={directRequestInstructions}
                  onChange={(e) => setDirectRequestInstructions(e.target.value)}
                  placeholder="Précisez ici le format attendu, les signatures requises ou toute consigne particulière..."
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  DÉLAI DE TRANSMISSION SOUHAITÉ
                </label>
                <div className="relative">
                  <select
                    value={directRequestDeadline}
                    onChange={(e) => setDirectRequestDeadline(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="3">3 jours (Urgent)</option>
                    <option value="7">7 jours (Recommandé)</option>
                    <option value="15">15 jours</option>
                    <option value="30">30 jours</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

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
                  disabled={isSubmittingDirectRequest || !directRequestTitle.trim()}
                  onClick={handleDirectRequestSubmit}
                  className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isSubmittingDirectRequest && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {isSubmittingDirectRequest
                    ? "Envoi de la demande..."
                    : "Notifier le client"}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ENVOYER DES FICHIERS */}
      {directShareType === "LIVRAISON" && (
        <>
          {directShareSuccess ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={26} />
              </div>
              <h4 className="text-base font-bold text-slate-900 m-0">
                Documents publiés avec succès !
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Les fichiers sont maintenant accessibles par le client dans son Espace Client.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDirectShareSuccess(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Déposer d'autres fichiers
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  LIVRABLE OU DOCUMENT À DÉPOSER
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropped = Array.from(e.dataTransfer.files);
                    setDirectShareFiles((prev) => [...prev, ...dropped]);
                  }}
                  onClick={() => directFileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-200 bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <input
                    ref={directFileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files);
                      setDirectShareFiles((prev) => [...prev, ...selected]);
                      e.target.value = "";
                    }}
                  />
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                    <ArrowUp size={20} strokeWidth={2.4} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 m-0">
                    Glissez vos livrables ici <span className="text-blue-600 hover:underline">parcourir</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 mb-0">
                    PDF, Excel, Word, ZIP jusqu'à 200 Mo
                  </p>
                </div>

                {directShareFiles.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 max-h-32 overflow-y-auto">
                    {directShareFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText size={15} className="text-blue-600 shrink-0" />
                          <span className="truncate font-medium">{f.name}</span>
                          <span className="text-slate-400 shrink-0">
                            ({(f.size / 1024 / 1024).toFixed(1)} Mo)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDirectShareFiles((prev) =>
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

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  QUALIFICATION DU LIVRABLE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectShareStatus("VALIDE")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer flex items-center gap-2 ${
                      directShareStatus === "VALIDE"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    ✓ Validé & Conforme
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectShareStatus("A_CORRIGER")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer flex items-center gap-2 ${
                      directShareStatus === "A_CORRIGER"
                        ? "border-rose-500 bg-rose-50 text-rose-800"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    ⚠ À corriger / En révision
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  NOTE / COMMENTAIRE D'ACCOMPAGNEMENT
                </label>
                <textarea
                  value={directShareNote}
                  onChange={(e) => setDirectShareNote(e.target.value)}
                  placeholder="Ex: Version finale validée par le pôle gestion..."
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

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
                  disabled={isSubmittingDirectShare || directShareFiles.length === 0}
                  onClick={handleDirectShareSubmit}
                  className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isSubmittingDirectShare && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {isSubmittingDirectShare
                    ? "Publication..."
                    : "Publier sur l'Espace Client"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DirectClientShareSection;
