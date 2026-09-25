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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#F8FAFC",
        }}
      >
        Chargement sécurisé...
      </div>
    );
  }

  if (error && !uploadSuccess) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#F8FAFC",
          padding: "1rem",
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: "500px",
            textAlign: "center",
            padding: "3rem 2rem",
          }}
        >
          <AlertCircle
            size={48}
            style={{ color: "var(--danger)", margin: "0 auto 1rem auto" }}
          />
          <h2
            style={{
              marginTop: 0,
              marginBottom: "1rem",
              color: "var(--text-main)",
            }}
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
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "var(--primary)",
          padding: "1.5rem",
          color: "#FFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <ShieldCheck size={24} />
        <span style={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Espace Sécurisé MENUA CRM
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "2.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h1
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "var(--text-main)",
            }}
          >
            {linkData?.type === "ACQUISITION"
              ? "📤 Lien de dépôt de documents"
              : "📦 Documents partagés avec vous"}
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Dossier : <strong>{linkData?.dossierRef || "N/A"}</strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginBottom: "2.5rem",
            }}
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
                  fontSize: "0.875rem",
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
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <CheckCircle
                    size={64}
                    style={{ color: "#10B981", margin: "0 auto 1.5rem auto" }}
                  />
                  <h2 style={{ color: "#10B981", marginBottom: "1rem" }}>
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
                    style={{
                      border: "2px dashed var(--border)",
                      borderRadius: "12px",
                      padding: "3rem 2rem",
                      textAlign: "center",
                      marginBottom: "2rem",
                      background: "#F1F5F9",
                    }}
                  >
                    <UploadCloud
                      size={48}
                      style={{
                        color: "var(--primary)",
                        margin: "0 auto 1rem auto",
                      }}
                    />
                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: "0.75rem",
                        color: "var(--text-main)",
                      }}
                    >
                      Déposez vos documents ici
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Votre conseiller MENUA attend vos fichiers dans le cadre
                      de votre dossier.
                    </p>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginBottom: "1.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      Formats acceptés : PDF, JPG, PNG, DOCX (Max 50Mo/fichier)
                    </p>

                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn btn-outline-primary"
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      Parcourir les fichiers
                    </label>

                    {files.length > 0 && (
                      <div
                        style={{
                          marginTop: "1.5rem",
                          textAlign: "left",
                          background: "#FFF",
                          padding: "1rem",
                          borderRadius: "8px",
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Fichiers sélectionnés :
                        </strong>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.5rem",
                            fontSize: "0.875rem",
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
                      style={{
                        color: "var(--danger)",
                        marginBottom: "1rem",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      fontSize: "1.1rem",
                    }}
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
                style={{
                  background: "#F0F9FF",
                  border: "1px solid #BAE6FD",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, color: "#0369A1", fontWeight: 500 }}>
                  Votre conseiller MENUA met ces documents à votre disposition.
                  Vous pouvez les télécharger librement.
                </p>
              </div>

              {linkData.documents?.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {linkData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        background: "#FFF",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <FileText
                          size={24}
                          style={{ color: "var(--primary)" }}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: 500,
                              color: "var(--text-main)",
                            }}
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
                      <a
                        href={doc.downloadUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{
                          padding: "0.5rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Download size={16} /> Télécharger
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "2rem",
                    background: "#F8FAFC",
                    borderRadius: "8px",
                  }}
                >
                  Aucun document disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "1rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.75rem",
        }}
      >
        Propulsé par MENUA CRM — Tous les transferts sont chiffrés et sécurisés
        de bout en bout.
      </div>
    </div>
  );
};

export default MagicLinkDropPage;
