import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".docx"];

const MagicLinkDropPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState(null);

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(getSafeApiUrl(`/api/magic/verify/${encodeURIComponent(token)}`));
        const data = await res.json();

        if (res.ok && data.success) {
          setLinkData(data.data);
        } else {
          setError(data.error || "Ce lien sécurisé est invalide ou a expiré.");
        }
      } catch (err) {
        console.error("Erreur vérification token:", err);
        setError("Impossible de contacter le serveur sécurisé.");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const validateAndAddFiles = (newFiles) => {
    setError(null);
    const valid = [];
    for (const file of newFiles) {
      const ext = "." + file.name.split(".").pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Format non autorisé pour : ${file.name}. Formats acceptés : PDF, JPG, PNG, DOCX.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`Le fichier "${file.name}" dépasse la taille maximale de 50 Mo.`);
        return;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0 || uploading) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch(getSafeApiUrl(`/api/magic/upload/${encodeURIComponent(token)}`), {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setUploadSuccess(true);
        setFiles([]);
      } else {
        setError(data.error || "Une erreur est survenue lors de l'envoi des documents.");
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      setError("Erreur réseau lors de l'envoi. Veuillez réessayer ultérieurement.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (!doc.downloadUrl || (!doc.downloadUrl.startsWith("http://") && !doc.downloadUrl.startsWith("https://") && !doc.downloadUrl.startsWith("/"))) {
        setError("Lien de téléchargement invalide ou non sécurisé.");
        return;
      }

      // Traçabilité du téléchargement
      fetch(getSafeApiUrl(`/api/magic/log-download/${encodeURIComponent(token)}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentName: doc.name }),
      }).catch(() => {});

      const safeLink = document.createElement("a");
      safeLink.href = doc.downloadUrl;
      safeLink.download = doc.name;
      safeLink.target = "_blank";
      safeLink.rel = "noopener noreferrer";
      document.body.appendChild(safeLink);
      safeLink.click();
      document.body.removeChild(safeLink);
    } catch {
      setError("Impossible d'initier le téléchargement.");
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen bg-slate-50 gap-3 text-slate-500 text-sm"
      >
        <Loader2 size={32} className="animate-spin text-blue-900" />
        <span>Vérification de la session sécurisée...</span>
      </div>
    );
  }

  if (error && !uploadSuccess && !linkData) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-slate-50 p-4"
      >
        <div
          className="card text-center bg-white border border-slate-200 rounded-xl max-w-md w-full p-8 shadow-sm"
        >
          <AlertCircle
            size={44}
            className="text-red-500 mx-auto mb-4"
          />
          <h1
            className="text-lg font-bold text-slate-800 mb-2"
          >
            Accès non autorisé ou expiré
          </h1>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50"
    >
      <header
        className="bg-blue-900 px-6 py-4 text-white flex justify-center items-center gap-2 shadow-sm"
      >
        <ShieldCheck size={22} className="text-emerald-400" />
        <span className="font-semibold text-base tracking-wide">
          Espace Sécurisé MENUA CRM
        </span>
      </header>

      <main
        className="flex-1 flex justify-center items-center p-4 sm:p-8"
      >
        <div
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 max-w-xl w-full shadow-sm"
        >
          <h1
            className="text-xl font-bold text-center text-slate-800 mb-1"
          >
            {linkData?.type === "ACQUISITION"
              ? "📤 Dépôt sécurisé de documents"
              : "📦 Documents partagés avec vous"}
          </h1>
          <p
            className="text-center text-xs text-slate-500 mb-6"
          >
            Dossier : <strong className="text-slate-700">{linkData?.dossierRef || "N/A"}</strong> — Client :{" "}
            <strong className="text-slate-700">{linkData?.clientName}</strong>
          </p>

          {/* Note / Consignes du conseiller */}
          {linkData?.note && (
            <div
              className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed ${
                linkData.type === "ACQUISITION"
                  ? "bg-amber-50/70 border-amber-200 text-amber-900"
                  : "bg-sky-50/70 border-sky-200 text-sky-900"
              }`}
            >
              <strong className="block mb-1 font-semibold">
                {linkData.type === "ACQUISITION"
                  ? "📋 Consignes de dépôt :"
                  : "📄 Message de votre conseiller :"}
              </strong>
              <div className="whitespace-pre-wrap">{linkData.note}</div>
            </div>
          )}

          {linkData?.type === "ACQUISITION" && (
            <>
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle
                    size={56}
                    className="text-emerald-500 mx-auto mb-4"
                  />
                  <h2 className="text-lg font-bold text-slate-800 mb-2">
                    Documents transmis avec succès !
                  </h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Vos documents ont été chiffrés et transmis à votre conseiller MENUA. Vous pouvez fermer cet onglet en toute sécurité.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpload}>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? "border-blue-700 bg-blue-50/70 scale-[1.01]"
                        : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <UploadCloud
                      size={44}
                      className="text-blue-900 mx-auto mb-3"
                    />
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">
                      Glissez vos fichiers ici
                    </h3>
                    <p className="text-xs text-slate-500 mb-1">
                      Votre conseiller MENUA attend vos pièces justificatives.
                    </p>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Formats acceptés : PDF, JPG, PNG, DOCX (Max 50 Mo par fichier)
                    </p>

                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer inline-block shadow-xs transition"
                    >
                      Parcourir les fichiers
                    </label>

                    {files.length > 0 && (
                      <div className="mt-6 text-left border border-slate-200 bg-white rounded-lg p-3">
                        <span className="block text-xs font-semibold text-slate-700 mb-2">
                          {files.length} document{files.length > 1 ? "s" : ""} sélectionné{files.length > 1 ? "s" : ""} :
                        </span>
                        <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                          {files.map((f, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100"
                            >
                              <span className="truncate pr-2 font-medium">
                                {f.name} ({(f.size / 1024 / 1024).toFixed(2)} Mo)
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="text-slate-400 hover:text-red-600 p-0.5 rounded transition"
                                title="Supprimer ce fichier"
                              >
                                <X size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="w-full mt-6 py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm transition"
                  >
                    {uploading && <Loader2 size={16} className="animate-spin" />}
                    {uploading ? "Transfert sécurisé en cours..." : "Transférer les documents"}
                  </button>
                </form>
              )}
            </>
          )}

          {linkData?.type === "LIVRAISON" && (
            <div className="flex flex-col gap-3">
              <div className="p-4 mb-2 text-center bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs leading-relaxed font-medium">
                Votre conseiller MENUA met ces documents à votre disposition. Vous pouvez les télécharger librement.
              </div>

              {linkData.documents?.length > 0 ? (
                linkData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex justify-between items-center p-3.5 border border-slate-200 rounded-xl bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <FileText size={22} className="text-blue-900 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase">
                          {doc.type || "Fichier"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 shrink-0 transition"
                    >
                      <Download size={14} /> Télécharger
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Aucun document disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-400">
        Propulsé par MENUA CRM — Tous les transferts sont chiffrés et sécurisés de bout en bout.
      </footer>
    </div>
  );
};

export default MagicLinkDropPage;
