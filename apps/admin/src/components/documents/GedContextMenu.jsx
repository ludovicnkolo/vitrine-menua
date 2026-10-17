import React from "react";
import { Folder, File, Edit, Trash, Eye, Download, RefreshCw } from "lucide-react";

const GedContextMenu = ({
  contextMenu,
  closeContextMenu,
  canWriteCurrent,
  setShowNewFolderModal,
  setShowUploadModal,
  openRenameModal,
  handleDeleteFolder,
  handleDeleteDocument,
  setPreviewFile,
  openReplaceFileDialog,
  isSuperAdmin,
}) => {
  if (!contextMenu) return null;

  return (
        <div
          style={{
            position: "fixed",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            background: "#FFF",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            zIndex: 9999,
            minWidth: "180px",
            padding: "0.5rem 0",
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          {contextMenu.type === "empty" && canWriteCurrent && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  setShowNewFolderModal(true);
                }}
                className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Folder size={16} /> Nouveau sous-dossier
              </button>
              {currentFolderId && (
                <button
                  onClick={() => {
                    closeContextMenu();
                    setShowUploadModal(true);
                  }}
                  className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#F1F5F9")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onFocus={(e) =>
                    (e.currentTarget.style.background = "#F1F5F9")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <File size={16} /> Ajouter un fichier
                </button>
              )}
            </>
          )}

          {contextMenu.type === "folder" && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  navigateTo(contextMenu.item);
                }}
                className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Folder size={16} /> Ouvrir
              </button>
              {(isSuperAdmin || contextMenu.item.canWrite) && (
                <>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      setRenameItem(contextMenu.item);
                      setRenameName(contextMenu.item.name);
                      setShowRenameModal(true);
                    }}
                    className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Edit size={16} /> Renommer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleDeleteDossier(contextMenu.item);
                    }}
                    className="flex items-center w-full cursor-pointer text-left" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none",color:"var(--danger)"}}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash size={16} /> Supprimer
                  </button>
                </>
              )}
            </>
          )}

          {contextMenu.type === "file" && (
            <>
              <button
                onClick={() => {
                  closeContextMenu();
                  setPreviewFile(contextMenu.item.url);
                }}
                className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Eye size={16} /> Ouvrir le fichier
              </button>
              <button
                onClick={() => {
                  closeContextMenu();
                  handleDownloadDocument(contextMenu.item.url);
                }}
                className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#F1F5F9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onFocus={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onBlur={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Download size={16} /> Télécharger
              </button>
              {canWriteCurrent && (
                <>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleReplaceDocument(contextMenu.item.id);
                    }}
                    className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <RefreshCw size={16} /> Remplacer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleRenameDocument(contextMenu.item);
                    }}
                    className="flex items-center w-full cursor-pointer text-left text-[var(--text-main)]" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none"}}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#F1F5F9")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Edit size={16} /> Renommer
                  </button>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      handleDeleteDocument(contextMenu.item.id);
                    }}
                    className="flex items-center w-full cursor-pointer text-left" style={{gap:"0.75rem",padding:"0.5rem 1rem",background:"none",border:"none",color:"var(--danger)"}}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = "#FEF2F2")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash size={16} /> Supprimer
                  </button>
                </>
              )}
            </>
          )}
        </div>
  );
};

export default GedContextMenu;

