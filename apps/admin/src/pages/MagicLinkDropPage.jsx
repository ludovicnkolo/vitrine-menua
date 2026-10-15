import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Lock,
  X,
  Loader2,
  Bell,
  ArrowDown,
} from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".docx"];

const formatFileType = (name) => {
  const ext = name?.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "Document PDF";
    case "jpg":
    case "jpeg":
      return "Image JPEG";
    case "png":
      return "Image PNG";
    case "doc":
    case "docx":
      return "Document Word";
    case "xls":
    case "xlsx":
      return "Tableur Excel";
    case "zip":
      return "Archive ZIP";
    default:
      return ext ? `Fichier .${ext.toUpperCase()}` : "Fichier";
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return null;
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

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
        const res = await fetch(
          getSafeApiUrl(`/api/magic/verify/${encodeURIComponent(token)}`),
        );
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
        setError(
          `Format non autorisé pour : ${file.name}. Formats acceptés : PDF, JPG, PNG, DOCX.`,
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `Le fichier "${file.name}" dépasse la taille maximale de 50 Mo.`,
        );
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
      const res = await fetch(
        getSafeApiUrl(`/api/magic/upload/${encodeURIComponent(token)}`),
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setUploadSuccess(true);
        setFiles([]);
      } else {
        setError(
          data.error || "Une erreur est survenue lors de l'envoi des documents.",
        );
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      setError(
        "Erreur réseau lors de l'envoi. Veuillez réessayer ultérieurement.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (
        !doc.downloadUrl ||
        (!doc.downloadUrl.startsWith("http://") &&
          !doc.downloadUrl.startsWith("https://") &&
          !doc.downloadUrl.startsWith("/"))
      ) {
        setError("Lien de téléchargement invalide ou non sécurisé.");
        return;
      }

      // Traçabilité du téléchargement
      fetch(
        getSafeApiUrl(`/api/magic/log-download/${encodeURIComponent(token)}`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentName: doc.name }),
        },
      ).catch(() => {});

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8fafc] gap-3 text-slate-500 text-sm">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <span>Vérification de la session sécurisée...</span>
      </div>
    );
  }

  if (error && !uploadSuccess && !linkData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc] p-4">
        <div className="card text-center bg-white border border-slate-200 rounded-2xl max-w-md w-full p-8 shadow-sm">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-slate-800 mb-2">
            Accès non autorisé ou expiré
          </h1>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const remainingDays = linkData?.expiresAt
    ? Math.max(
        1,
        Math.ceil(
          (new Date(linkData.expiresAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 7;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8fafc] p-4 sm:p-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-lg">
        {/* ── Top Header Row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell size={20} className="fill-blue-600/10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 m-0 leading-tight">
                {linkData?.type === "ACQUISITION"
                  ? "Dépôt de documents"
                  : "Documents mis à disposition"}
              </h1>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                Dossier {linkData?.dossierRef || "DOS-01"} • Espace sécurisé client
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Valide encore {remainingDays} j
          </span>
        </div>

        {/* ── Note Callout ── */}
        {linkData?.note && (
          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4 mt-5 text-left">
            <div className="text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-1.5">
              NOTE DE VOTRE CONSEILLER
            </div>
            <p className="text-sm text-slate-700 m-0 leading-relaxed whitespace-pre-wrap">
              {linkData.note}
            </p>
          </div>
        )}

        {/* ── Mode LIVRAISON (Téléchargement de fichiers) ── */}
        {linkData?.type === "LIVRAISON" && (
          <div className="mt-5">
            <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2.5">
              FICHIERS DISPONIBLES ({linkData.documents?.length || 0})
            </div>

            {linkData.documents?.length > 0 ? (
              <div className="space-y-2">
                {linkData.documents.map((doc) => {
                  const typeLabel = formatFileType(doc.name);
                  const sizeLabel = formatFileSize(doc.size);
                  const subtext = sizeLabel
                    ? `${typeLabel} • ${sizeLabel}`
                    : typeLabel;

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {doc.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {subtext}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        className="px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm transition cursor-pointer"
                      >
                        <ArrowDown size={14} /> Télécharger
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Aucun document disponible pour le moment.
              </div>
            )}
          </div>
        )}

        {/* ── Mode ACQUISITION (Dépôt de fichiers client) ── */}
        {linkData?.type === "ACQUISITION" && (
          <div className="mt-5">
            {uploadSuccess ? (
              <div className="text-center py-8">
                <CheckCircle
                  size={52}
                  className="text-emerald-500 mx-auto mb-3"
                />
                <h2 className="text-base font-bold text-slate-800 mb-1">
                  Documents transmis avec succès !
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Vos documents ont été chiffrés et transmis à votre conseiller MENUA. Ce lien sécurisé à usage unique est désormais clôturé et expiré. Vous pouvez fermer cet onglet en toute sécurité.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpload}>
                <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2.5">
                  DÉPÔT DE VOS DOCUMENTS
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDragging
                      ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                      : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                  <UploadCloud
                    size={38}
                    className="text-blue-600 mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-slate-800 m-0">
                    Glissez vos fichiers ici ou{" "}
                    <label
                      htmlFor="file-upload"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      parcourir
                    </label>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 mb-0">
                    PDF, PNG, DOCX jusqu'à 25 Mo
                  </p>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                  />

                  {files.length > 0 && (
                    <div className="mt-4 text-left border border-slate-200 bg-white rounded-lg p-3">
                      <span className="block text-xs font-semibold text-slate-700 mb-2">
                        {files.length} document{files.length > 1 ? "s" : ""} sélectionné{files.length > 1 ? "s" : ""} :
                      </span>
                      <ul className="space-y-1.5 max-h-36 overflow-y-auto m-0 p-0 list-none">
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
                              className="text-slate-400 hover:text-red-600 p-0.5 rounded transition cursor-pointer"
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
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || files.length === 0}
                  className="w-full mt-4 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl text-sm font-semibold disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {uploading && <Loader2 size={16} className="animate-spin" />}
                  {uploading ? "Transfert en cours..." : "Transférer les documents"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
          <Lock size={13} className="text-slate-400 shrink-0" />
          <span>
            Chiffrement AES-256 de bout en bout • Transfert certifié MENUA CRM
          </span>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkDropPage;
