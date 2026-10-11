import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  ShieldCheck,
} from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";

const MagicLinkDropPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState(null);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(getSafeApiUrl(`/api/magic/verify/${token}`));
        const data = await res.json();

        if (data.success) {
          setLinkData(data.data);
        } else {
          setError(data.error || "Lien invalide ou expiré.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch(getSafeApiUrl(`/api/magic/upload/${token}`), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadSuccess(true);
      } else {
        setError(data.error || "Erreur lors de l'upload.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center" style={{height:"100vh",background:"#F8FAFC"}}
      >
        Chargement sécurisé...
      </div>
    );
  }

  if (error && !uploadSuccess) {
    return (
      <div
        className="flex justify-center items-center p-4" style={{height:"100vh",background:"#F8FAFC"}}
      >
        <div
          className="card text-center" style={{maxWidth:"500px",padding:"3rem 2rem"}}
        >
          <AlertCircle
            size={48}
            style={{ color: "var(--danger)", margin: "0 auto 1rem auto" }}
          />
          <h2
            className="mb-4 text-[var(--text-main)]"
          >
            Lien invalide
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col" style={{minHeight:"100vh",background:"#F8FAFC"}}
    >
      <div
        className="bg-[var(--primary)] p-6 text-white flex justify-center items-center gap-2"
      >
        <ShieldCheck size={24} />
        <span className="font-semibold" style={{fontSize:"1.25rem"}}>
          Espace Sécurisé MENUA CRM
        </span>
      </div>

      <div
        className="flex justify-center items-center" style={{flex:1,padding:"2rem 1rem"}}
      >
        <div
          className="card w-full" style={{maxWidth:"600px",padding:"2.5rem",boxShadow:"0 10px 25px rgba(0,0,0,0.05)"}}
        >
          <h1
            className="mb-2 text-center text-[var(--text-main)]" style={{fontSize:"1.5rem"}}
          >
            {linkData?.type === "ACQUISITION"
              ? "📤 Lien de dépôt de documents"
              : "📦 Documents partagés avec vous"}
          </h1>
          <p
            className="text-center mb-2" style={{color:"var(--text-muted)"}}
          >
            Dossier : <strong>{linkData?.dossierRef || "N/A"}</strong>
          </p>
          <p
            className="text-center" style={{color:"var(--text-muted)",marginBottom:"2.5rem"}}
          >
            Client : <strong>{linkData?.clientName}</strong>
          </p>

          {/* Note / Instructions */}
          {linkData?.note && (
            <div
              style={{
                marginBottom: "2rem",
                padding: "1rem 1.25rem",
                background:
                  linkData.type === "ACQUISITION" ? "#FFF7ED" : "#F0F9FF",
                border: `1px solid ${linkData.type === "ACQUISITION" ? "#FED7AA" : "#BAE6FD"}`,
                borderRadius: "8px",
                borderLeft: `4px solid ${linkData.type === "ACQUISITION" ? "#F97316" : "#0EA5E9"}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  
                  color:
                    linkData.type === "ACQUISITION" ? "#9A3412" : "#0369A1",
                  marginBottom: "0.4rem",
                }}
              >
                {linkData.type === "ACQUISITION"
                  ? "📋 Documents demandés :"
                  : "📄 Message de votre conseiller :"}
              </p>
              <p
                style={{
                  margin: 0,
                  color:
                    linkData.type === "ACQUISITION" ? "#7C2D12" : "#075985",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {linkData.note}
              </p>
            </div>
          )}

          {linkData?.type === "ACQUISITION" && (
            <>
              {uploadSuccess ? (
                <div className="text-center" style={{padding:"2rem 0"}}>
                  <CheckCircle
                    size={64}
                    style={{ color: "#10B981", margin: "0 auto 1.5rem auto" }}
                  />
                  <h2 className="mb-4" style={{color:"#10B981"}}>
                    Fichiers transmis avec succès !
                  </h2>
                  <p style={{ color: "var(--text-muted)" }}>
                    Votre conseiller MENUA a été notifié. Vous pouvez fermer
                    cette page en toute sécurité.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpload}>
                  <div
                    className="text-center mb-8" style={{border:"2px dashed var(--border)",borderRadius:"12px",padding:"3rem 2rem",background:"#F1F5F9"}}
                  >
                    <UploadCloud
                      size={48}
                      style={{
                        color: "var(--primary)",
                        margin: "0 auto 1rem auto",
                      }}
                    />
                    <h3
                      className="text-[var(--text-main)]" style={{marginBottom:"0.75rem"}}
                    >
                      Déposez vos documents ici
                    </h3>
                    <p
                      className="mb-2" style={{color:"var(--text-muted)"}}
                    >
                      Votre conseiller MENUA attend vos fichiers dans le cadre
                      de votre dossier.
                    </p>
                    <p
                      className="mb-6" style={{color:"var(--text-muted)",fontSize:"0.8rem"}}
                    >
                      Formats acceptés : PDF, JPG, PNG, DOCX (Max 50Mo/fichier)
                    </p>

                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      id="file-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn btn-outline-primary cursor-pointer inline-block"
                    >
                      Parcourir les fichiers
                    </label>

                    {files.length > 0 && (
                      <div
                        className="mt-6 text-left p-4" style={{background:"#FFF",borderRadius:"8px"}}
                      >
                        <strong
                          className="block mb-2"
                        >
                          Fichiers sélectionnés :
                        </strong>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.5rem",
                            
                            color: "var(--text-muted)",
                          }}
                        >
                          {files.map((f, i) => (
                            <li key={i}>
                              {f.name} ({(f.size / 1024 / 1024).toFixed(2)} Mo)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div
                      className="mb-4 text-center" style={{color:"var(--danger)"}}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="btn btn-primary w-full p-4" style={{fontSize:"1.1rem"}}
                  >
                    {uploading
                      ? "Transfert sécurisé en cours..."
                      : "Transférer de manière sécurisée"}
                  </button>
                </form>
              )}
            </>
          )}

          {linkData?.type === "LIVRAISON" && (
            <div>
              <div
                className="p-6 mb-8 text-center" style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:"8px"}}
              >
                <p className="font-medium" style={{color:"#0369A1"}}>
                  Votre conseiller MENUA met ces documents à votre disposition.
                  Vous pouvez les télécharger librement.
                </p>
              </div>

              {linkData.documents?.length > 0 ? (
                <div
                  className="flex flex-col gap-4"
                >
                  {linkData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4" style={{border:"1px solid var(--border)",borderRadius:"8px",background:"#FFF"}}
                    >
                      <div
                        className="flex items-center" style={{gap:"0.75rem"}}
                      >
                        <FileText
                          size={24}
                          style={{ color: "var(--primary)" }}
                        />
                        <div>
                          <div
                            className="font-medium text-[var(--text-main)]"
                          >
                            {doc.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {doc.type}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline flex items-center gap-2 cursor-pointer" style={{padding:"0.5rem 1rem"}}
                        onClick={async () => {
                          // Log the download for traceability
                          try {
                            await fetch(getSafeApiUrl(`/api/magic/log-download/${token}`), {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ documentName: doc.name }),
                            });
                          } catch (_) {}
                          // Open/download the file
                          const a = document.createElement("a");
                          a.href = doc.downloadUrl;
                          a.download = doc.name;
                          a.target = "_blank";
                          a.rel = "noopener noreferrer";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                      >
                        <Download size={16} /> Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center p-8" style={{color:"var(--text-muted)",background:"#F8FAFC",borderRadius:"8px"}}
                >
                  Aucun document disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="p-4 text-center" style={{color:"var(--text-muted)",fontSize:"0.75rem"}}
      >
        Propulsé par MENUA CRM — Tous les transferts sont chiffrés et sécurisés
        de bout en bout.
      </div>
    </div>
  );
};

export default MagicLinkDropPage;
