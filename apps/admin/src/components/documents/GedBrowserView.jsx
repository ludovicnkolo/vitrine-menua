import React from "react";
import { Folder, Upload } from "lucide-react";
import { getFileIconAndColor } from "./gedHelpers";

const GedBrowserView = ({
  isSearching,
  searchFolders = [],
  searchFiles = [],
  folders = [],
  documents = [],
  currentPath = [],
  canWriteCurrent,
  navigateTo,
  navigateToFromSearch,
  handleContextMenu,
  setPreviewFile,
  setUploadFile,
  setShowUploadModal,
}) => {
  return (
    <>
        {/* --- SEARCH RESULTS --- */}
        {isSearching && (
          <div>
            {searchFolders.length > 0 && (
              <div className="mb-8">
                <h3
                  className="mb-4" style={{color:"var(--text-muted)",fontSize:"0.9rem",textTransform:"uppercase"}}
                >
                  Dossiers trouvés
                </h3>
                <div
                  className="flex flex-wrap gap-6"
                >
                  {searchFolders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() =>
                        navigateToFromSearch(folder.id, true)
                      }
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, folder, "folder");
                      }}
                      className="cursor-pointer flex flex-col items-center gap-2" style={{width:"150px",background:"#F8FAFC",border:"1px solid var(--border)",padding:"1rem 0.5rem",borderRadius:"0.5rem",transition:"background 0.2s, border-color 0.2s"}}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <Folder size={40} color="#D97706" fill="#FBBF24" />
                      <div
                        className="text-center font-medium text-[var(--text-main)] w-full" style={{wordBreak:"normal",overflowWrap:"anywhere",fontSize:"0.75rem"}}
                      >
                        {folder.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchFiles.length > 0 && (
              <div>
                <h3
                  className="mb-4" style={{color:"var(--text-muted)",fontSize:"0.9rem",textTransform:"uppercase"}}
                >
                  Fichiers trouvés
                </h3>
                <div
                  className="flex flex-wrap gap-6"
                >
                  {searchFiles.map((doc) => {
                    const { Icon, color } = getFileIconAndColor(doc.name);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setPreviewFile(doc.url)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, doc, "file");
                        }}
                        className="flex flex-col items-center gap-2 cursor-pointer" style={{width:"150px",background:"#F8FAFC",border:"1px solid var(--border)",padding:"1rem 0.5rem",borderRadius:"0.5rem"}}
                      >
                        <Icon size={40} color={color} />
                        <div
                          className="text-center text-[var(--text-main)] w-full" style={{wordBreak:"normal",overflowWrap:"anywhere",fontSize:"0.75rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                          title={doc.name}
                        >
                          {doc.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Dans: {doc.dossierName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- NORMAL FOLDER VIEW --- */}
        {!isSearching && (
          <div>
            {/* Render Subfolders */}
            {childFolders.length > 0 && (
              <div className="mb-8">
                <h3
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",margin:"0 0 1rem 0"}}
                >
                  {currentFolder
                    ? `Dossiers de la mission (${childFolders.length} sous-dossier${childFolders.length > 1 ? "s" : ""})`
                    : `Dossiers (${childFolders.length})`}
                </h3>

                <div
                  className="grid" style={{gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:"1.25rem"}}
                >
                  {childFolders.map((folder) => {
                    const badge = (() => {
                      if (folder.mission?.reference) return folder.mission.reference;
                      if (folder.reference && folder.reference.startsWith("MSN-")) return folder.reference;
                      const match = folder.name?.match(/(MSN-\d+|TCH-\d+|DOS-\d+)/i);
                      if (match) return match[0].toUpperCase();
                      const misMatch = folder.name?.match(/mis[-_]?(\d+)/i);
                      if (misMatch) return `MSN-${misMatch[1].padStart(2, "0")}`;
                      return null;
                    })();

                    const isAmber =
                      badge &&
                      (badge.includes("02") ||
                        badge.includes("ATTENTE") ||
                        badge.includes("COURS"));

                    return (
                      <div
                        key={folder.id}
                        onClick={() => navigateTo(folder)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, folder, "folder");
                        }}
                        className="cursor-pointer relative" style={{background:"#FFF",border:"1px solid #E2E8F0",padding:"1.25rem",borderRadius:"10px",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#F59E0B";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(245,158,11,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.03)";
                        }}
                      >
                        <div
                          className="flex justify-between items-start"
                        >
                          <Folder size={32} color="#D97706" fill="#FBBF24" />
                          {badge && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.6rem",
                                borderRadius: "4px",
                                background: isAmber ? "#FEF3C7" : "#EFF6FF",
                                color: isAmber ? "#D97706" : "#2563EB",
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                        <div
                          className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",marginTop:"0.75rem",wordBreak:"break-word"}}
                        >
                          {folder.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748B",
                            marginTop: "0.25rem",
                          }}
                        >
                          {folder.description ||
                            (folder.name.includes("interne")
                              ? "Dossier interne de la mission"
                              : "Dossier de documents")}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94A3B8",
                            marginTop: "0.35rem",
                          }}
                        >
                          Modifié le{" "}
                          {new Date(
                            folder.updatedAt || folder.createdAt || Date.now()
                          ).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Render Documents */}
            {documents.length > 0 && (
              <div className="mb-8">
                <h3
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem",margin:"0 0 1rem 0"}}
                >
                  Documents ({documents.length})
                </h3>
                <div
                  className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))"}}
                >
                  {documents.map((doc) => {
                    const { Icon, color } = getFileIconAndColor(doc.name);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setPreviewFile(doc.url)}
                        onContextMenu={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, doc, "file");
                        }}
                        className="p-4 flex items-center cursor-pointer" style={{background:"#FFF",border:"1px solid #E2E8F0",borderRadius:"10px",gap:"0.75rem",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2563EB";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                      >
                        <Icon size={32} color={color} style={{ flexShrink: 0 }} />
                        <div style={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
                          <div
                            className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.85rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                            title={doc.name}
                          >
                            {doc.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString("fr-FR")
                              : "Document"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dropzone : uniquement affiché à l'intérieur d'un dossier, jamais à la racine */}
            {currentFolderId && canWriteCurrent && (
              <div
                onClick={() => setShowUploadModal(true)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.background = "#EFF6FF";
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.background = "#F8FAFC";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.background = "#F8FAFC";
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setUploadFile(e.dataTransfer.files[0]);
                    setShowUploadModal(true);
                  }
                }}
                className="text-center mt-6 cursor-pointer" style={{border:"2px dashed #CBD5E1",borderRadius:"10px",background:"#F8FAFC",padding:"3.5rem 1.5rem",transition:"all 0.2s"}}
              >
                <div className="font-semibold" style={{color:"#334155",fontSize:"0.95rem"}}>
                  Glissez déposez des fichiers ici ou cliquez sur Importer pour ajouter des pièces
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                  Formats supportés : PDF, XLSX, DOCX, PNG, JPG (Max 50 Mo)
                </div>
              </div>
            )}
          </div>
        )}

    </>
  );
};

export default GedBrowserView;
