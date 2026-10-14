import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FilePreviewModal = ({ previewFile, onClose }) => {
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!previewFile) {
      setPreviewBlobUrl(null);
      setError(null);
      setIsLoading(false);
      setNumPages(null);
      setPageNumber(1);
      setScale(1.0);
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      if (previewFile.startsWith("http://") || previewFile.startsWith("https://")) {
        setPreviewBlobUrl(previewFile);
        return;
      }

      const token = sessionStorage.getItem("adminToken");
      const cleanPath = previewFile.startsWith("/") ? previewFile.slice(1) : previewFile;
      const parts = cleanPath.split("/");
      let bucket = "formulaires";
      let filename = cleanPath;
      if (parts.length > 1) {
        bucket = parts.shift();
        filename = parts.join("/");
      }
      // Utilise le proxy backend avec stream=true pour contourner le blocage CORS de S3 OVH
      // (S3 OVH ne retourne pas Access-Control-Allow-Origin sur les URLs présignées)
      // On encode chaque segment du filename séparément pour préserver les "/" (clés S3 multi-niveaux)
      const encodedFilename = filename.split("/").map(encodeURIComponent).join("/");
      const urlObj = new URL(
        getSafeApiUrl(
          `/api/files/view/${encodeURIComponent(bucket)}/${encodedFilename}`,
        ),
      );
      if (token) urlObj.searchParams.set("token", token);
      urlObj.searchParams.set("stream", "true");
      urlObj.searchParams.set("t", Date.now()); // Cache buster pour contourner le cache du navigateur

      setPreviewBlobUrl(urlObj.toString());
    } catch (err) {
      console.error("Error setting preview URL:", err);
      setError(err.message || "Invalid URL");
      setIsLoading(false);
    }
  }, [previewFile]);

  if (!previewFile) return null;

  const isImage = previewFile.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i);
  const isPdf = previewFile.match(/\.pdf$/i);
  const isUnsupported = !isImage && !isPdf;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center" style={{background:"rgba(0,0,0,0.8)",zIndex:200}}
    >
      <div
        className="flex flex-col" style={{width:"80%",height:"80%",background:"#FFF",borderRadius:"8px",overflow:"hidden"}}
      >
        {/* En-tête */}
        <div
          className="p-4 flex justify-between items-center" style={{borderBottom:"1px solid var(--border)",background:"#F8FAFC"}}
        >
          <h3
            className="flex items-center gap-2 font-semibold text-[var(--text-main)]"
            style={{ fontSize: "1rem", margin: 0 }}
          >
            <Eye size={18} color="var(--primary, #1e3a8a)" />
            <span
              style={{
                maxWidth: "450px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {previewFile.split("/").pop() || "Aperçu du fichier"}
            </span>
          </h3>

          {/* Barre de contrôle pour le PDF */}
          {!isImage && !error && previewBlobUrl && (
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2" style={{background:"#FFF",padding:"0.25rem",borderRadius:"6px",border:"1px solid var(--border)"}}
              >
                <button
                  onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
                  className="cursor-pointer flex items-center" style={{background:"none",border:"none"}}
                >
                  <ZoomOut size={16} />
                </button>
                <span
                  className="text-center" style={{minWidth:"40px"}}
                >
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale((s) => s + 0.2)}
                  className="cursor-pointer flex items-center" style={{background:"none",border:"none"}}
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            style={{ padding: "0.25rem 0.5rem", height: "auto" }}
          >
            Fermer
          </button>
        </div>

        {/* Zone d'affichage */}
        <div
          className="flex items-center justify-center p-8" style={{flex:1,background:"#E2E8F0",overflow:"hidden"}}
        >
          <div
            className="w-full h-full flex justify-center" style={{background:"#FFF",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",borderRadius:"8px",overflow:"auto"}}
          >
            {(() => {
              if (error) {
                return (
                  <div
                    className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center"
                  >
                    <div className="font-medium" style={{color:"var(--danger)"}}>
                      Ce fichier est introuvable ou inaccessible.<br />
                      Détails de l'erreur: {String(error)}
                    </div>
                    <a
                      href={previewBlobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ textDecoration: "none" }}
                    >
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                );
              }
              if (!previewBlobUrl) {
                return (
                  <div
                    className="flex flex-col items-center justify-center h-full gap-4" style={{color:"var(--text-muted)"}}
                  >
                    <div style={{
                      width: "40px",
                      height: "40px",
                      border: "3px solid var(--border)",
                      borderTopColor: "var(--primary)",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    <span>Chargement du fichier...</span>
                  </div>
                );
              }
              if (isImage) {
                return (
                  <div className="w-full h-full flex items-center justify-center relative p-4" style={{ minHeight: "300px" }}>
                    {isLoading && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                        style={{ color: "var(--text-muted)", background: "#FFF", zIndex: 10 }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "3px solid var(--border)",
                            borderTopColor: "var(--primary)",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        <span>Chargement de l'image...</span>
                      </div>
                    )}
                    <img
                      src={previewBlobUrl}
                      alt={previewFile.split("/").pop()}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        opacity: isLoading ? 0 : 1,
                        transition: "opacity 0.2s ease-in-out",
                      }}
                      onLoad={() => setIsLoading(false)}
                      onError={() => {
                        setIsLoading(false);
                        setError("Impossible de charger l'image.");
                      }}
                    />
                  </div>
                );
              }
              if (isUnsupported) {
                return (
                  <div
                    className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center"
                  >
                    <div
                      style={{ fontSize: "3rem", color: "var(--text-muted)" }}
                    >
                      📄
                    </div>
                    <div className="text-[var(--text-main)] font-medium">
                      Ce type de fichier ne peut pas être prévisualisé
                      directement.
                    </div>
                    <a
                      href={previewBlobUrl}
                      download={previewFile.split("/").pop()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ textDecoration: "none" }}
                    >
                      Télécharger le fichier
                    </a>
                  </div>
                );
              }
              return (
                <div className="p-4">
                  <Document
                    file={previewBlobUrl}
                    onLoadSuccess={({ numPages }) => { setNumPages(numPages); setIsLoading(false); }}
                    onLoadError={(err) => {
                      console.error("React-pdf error:", err);
                      setError(err.message || String(err));
                      setIsLoading(false);
                    }}
                    loading={
                      <div className="p-8">
                        Chargement du PDF...
                      </div>
                    }
                    error={
                      <div className="p-8" style={{color:"var(--danger)"}}>
                        Impossible de charger le PDF.
                      </div>
                    }
                  >
                    {Array.from(new Array(numPages || 0), (el, index) => (
                      <div
                        key={`page_${index + 1}`}
                        className="mb-8" style={{boxShadow:"0 4px 6px rgba(0,0,0,0.1)"}}
                      >
                        <Page
                          pageNumber={index + 1}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      </div>
                    ))}
                  </Document>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
