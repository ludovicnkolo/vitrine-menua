import React from "react";
import { Trash2, Search, RotateCcw, Folder, Shield, FileText, X } from "lucide-react";

const GedTrashModal = ({
  showTrashModal,
  setShowTrashModal,
  loadingTrash,
  normalizedTrashList = [],
  trashSearchQuery,
  setTrashSearchQuery,
  trashTypeFilter,
  setTrashTypeFilter,
  filteredTrashItems = [],
  trashTotalSize,
  isSuperAdmin,
  handleRestoreTrash,
  handlePurgeTrash,
  handleEmptyAllTrash,
  handleRestoreAllTrash,
  getTrashOrigin,
  getTrashAuthorAndRemaining,
}) => {
  if (!showTrashModal) return null;

  return (
        <div
          className="fade-in fixed inset-0 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.5)",zIndex:1100}}
        >
          <div
            className="w-full flex flex-col" style={{background:"#FFF",borderRadius:"12px",maxWidth:"880px",maxHeight:"90vh",boxShadow:"0 20px 40px rgba(0,0,0,0.15)",overflow:"hidden"}}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center" style={{padding:"1.25rem 1.75rem",borderBottom:"1px solid #F1F5F9"}}
            >
              <div className="flex items-center" style={{gap:"0.6rem"}}>
                <Trash2 size={22} color="#EF4444" />
                <h3
                  className="font-bold text-[var(--text-main)]" style={{fontSize:"1.25rem"}}
                >
                  Corbeille
                </h3>
                {normalizedTrashList.length === 0 ? (
                  <span
                    className="font-semibold" style={{background:"#F1F5F9",color:"#64748B",fontSize:"0.75rem",padding:"0.2rem 0.65rem",borderRadius:"20px"}}
                  >
                    0 élément
                  </span>
                ) : (
                  <span
                    className="font-bold" style={{background:"#FEF3C7",color:"#D97706",fontSize:"0.75rem",padding:"0.2rem 0.65rem",borderRadius:"20px"}}
                  >
                    {normalizedTrashList.length} élément{normalizedTrashList.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center" style={{gap:"0.75rem"}}>
                {normalizedTrashList.length === 0 ? (
                  <span
                    className="font-semibold" style={{background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB",fontSize:"0.75rem",padding:"0.25rem 0.65rem",borderRadius:"6px"}}
                  >
                    Etat vide optimisé
                  </span>
                ) : (
                  <span
                    className="font-semibold" style={{background:"#ECFDF5",border:"1px solid #A7F3D0",color:"#059669",fontSize:"0.75rem",padding:"0.25rem 0.65rem",borderRadius:"6px"}}
                  >
                    Etat avec documents
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowTrashModal(false)}
                  className="cursor-pointer flex items-center justify-center" style={{background:"none",border:"none",color:"#94A3B8",padding:"0.2rem"}}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              className="flex flex-col" style={{flex:1,overflowY:"auto",padding:"1.75rem"}}
            >
              {loadingTrash ? (
                <div className="text-center" style={{padding:"3rem",color:"#64748B"}}>
                  Chargement de la corbeille...
                </div>
              ) : normalizedTrashList.length === 0 ? (
                /* ── ETAT VIDE OPTIMISE (CAPTURE GAUCHE) ── */
                <div className="flex flex-col items-center" style={{margin:"auto 0"}}>
                  {/* Big Pink Circle with Red Trash Icon */}
                  <div
                    className="flex items-center justify-center" style={{width:"88px",height:"88px",borderRadius:"50%",background:"#FEF2F2",border:"1.5px solid #FECACA",marginBottom:"1.25rem"}}
                  >
                    <Trash2 size={40} color="#EF4444" strokeWidth={1.75} />
                  </div>

                  <h4
                    className="font-bold text-[var(--text-main)]" style={{margin:"0 0 0.5rem 0",fontSize:"1.2rem"}}
                  >
                    La corbeille est vide
                  </h4>

                  <p
                    className="text-center" style={{margin:"0 0 1.75rem 0",fontSize:"0.82rem",color:"#64748B",maxWidth:"420px",lineHeight:1.5}}
                  >
                    Aucun document ou dossier n'a été supprimé récemment.<br />
                    Les éléments supprimés restent accessibles ici pendant 30 jours avant d'être définitivement purgés du système.
                  </p>

                  {/* Policy Card */}
                  <div
                    className="w-full" style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"1.25rem 1.5rem",maxWidth:"520px"}}
                  >
                    <div
                      className="flex items-center gap-2 font-bold text-[var(--text-main)]" style={{fontSize:"0.82rem",marginBottom:"0.6rem"}}
                    >
                      <Shield size={16} color="var(--text-main)" />
                      <span>Politique de sécurité & rétention des documents :</span>
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.25rem",
                        fontSize: "0.78rem",
                        color: "#475569",
                        lineHeight: 1.6,
                      }}
                    >
                      <li>Restauration immédiate des fichiers supprimés par inadvertance.</li>
                      <li>Conservation des droits d'accès et de l'arborescence d'origine.</li>
                      <li>Seuls les Super-administrateurs peuvent déclencher une purge définitive.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                /* ── ETAT AVEC DOCUMENTS (CAPTURE DROITE) ── */
                <>
                  {/* Search and Filters Bar */}
                  <div
                    className="flex items-center flex-wrap" style={{gap:"0.75rem",marginBottom:"1.25rem"}}
                  >
                    <div className="relative" style={{flex:1,minWidth:"220px"}}>
                      <Search
                        size={15}
                        className="absolute" style={{left:"0.85rem",top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}
                      />
                      <input
                        type="text"
                        placeholder="Filtrer les éléments supprimés..."
                        value={trashSearchQuery}
                        onChange={(e) => setTrashSearchQuery(e.target.value)}
                        className="w-full text-[var(--text-main)]" style={{padding:"0.55rem 1rem 0.55rem 2.3rem",borderRadius:"8px",border:"1px solid #E2E8F0",background:"#FFF",fontSize:"0.85rem",outline:"none"}}
                      />
                    </div>

                    <select
                      value={trashTypeFilter}
                      onChange={(e) => setTrashTypeFilter(e.target.value)}
                      className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.55rem 1.75rem 0.55rem 0.85rem",borderRadius:"8px",border:"1.5px solid #3B82F6",background:"#FFF",fontSize:"0.85rem",outline:"none"}}
                    >
                      <option value="all">Tous les types</option>
                      <option value="document">Documents</option>
                      <option value="dossier">Dossiers</option>
                      <option value="mission">Missions</option>
                      <option value="tache">Tâches</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleEmptyAllTrash}
                      className="font-semibold inline-flex items-center cursor-pointer" style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",borderRadius:"8px",padding:"0.55rem 1rem",fontSize:"0.82rem",gap:"0.4rem",whiteSpace:"nowrap"}}
                    >
                      <Trash2 size={14} /> Vider la corbeille
                    </button>
                  </div>

                  {/* Table */}
                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#FFF",
                    }}
                  >
                    <table className="w-full" style={{borderCollapse:"collapse",tableLayout:"fixed"}}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                          <th
                            className="text-left font-bold" style={{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"45%"}}
                          >
                            DOCUMENT / DOSSIER
                          </th>
                          <th
                            className="text-left font-bold" style={{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"20%"}}
                          >
                            ORIGINE
                          </th>
                          <th
                            className="table-date-cell text-left font-bold" style={{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"140px"}}
                          >
                            DATE
                          </th>
                          <th
                            className="text-right font-bold" style={{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"15%"}}
                          >
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrashItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center" style={{padding:"2.5rem",color:"#64748B",fontSize:"0.85rem"}}
                            >
                              Aucun élément ne correspond à votre filtre.
                            </td>
                          </tr>
                        ) : (
                          filteredTrashItems.map((item) => {
                            const isFolder = item.itemType === "Dossier" || item.type === "dossier";
                            const origin = getTrashOrigin(item);
                            const { author, daysRemaining } = getTrashAuthorAndRemaining(item);
                            const dateStr = new Date(
                              item.deletedAt || item.updatedAt || item.createdAt || Date.now(),
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            });

                            return (
                              <tr
                                key={item.id}
                                style={{
                                  borderBottom: "1px solid #F1F5F9",
                                  transition: "background 0.15s",
                                }}
                              >
                                {/* DOCUMENT / DOSSIER */}
                                <td style={{ padding: "0.75rem 1rem", verticalAlign: "middle" }}>
                                  <div className="flex items-center" style={{gap:"0.75rem"}}>
                                    {isFolder ? (
                                      <Folder size={18} color="#F59E0B" fill="#F59E0B" style={{ flexShrink: 0 }} />
                                    ) : (
                                      <FileText size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                                    )}
                                    <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                                      <div
                                        className="truncate-name font-semibold text-[var(--text-main)]" style={{fontSize:"0.85rem",maxWidth:"100%"}}
                                        title={item.name}
                                      >
                                        {item.name}
                                      </div>
                                      <div className="truncate-name" style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "2px", maxWidth: "100%" }}>
                                        Par {author} • {daysRemaining}j restants
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* ORIGINE */}
                                <td style={{ padding: "0.75rem 1rem", verticalAlign: "middle" }}>
                                  <span
                                    className="inline-block font-medium" style={{background:"#F1F5F9",border:"1px solid #E2E8F0",color:"#334155",fontSize:"0.72rem",padding:"0.2rem 0.6rem",borderRadius:"4px",maxWidth:"180px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}
                                  >
                                    {origin}
                                  </span>
                                </td>

                                {/* DATE */}
                                <td className="table-date-cell" style={{ padding: "0.75rem 1rem", verticalAlign: "middle", color: "#64748B", fontSize: "0.8rem", width: "140px" }}>
                                  {dateStr}
                                </td>

                                {/* ACTIONS */}
                                <td className="text-right" style={{padding:"0.75rem 1rem",verticalAlign:"middle"}}>
                                  <div className="inline-flex" style={{gap:"0.4rem"}}>
                                    {/* Restore */}
                                    <button
                                      type="button"
                                      onClick={() => handleRestoreTrash(item)}
                                      title="Restaurer"
                                      className="inline-flex items-center justify-center cursor-pointer" style={{width:"32px",height:"32px",borderRadius:"6px",background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB"}}
                                    >
                                      <RotateCcw size={14} />
                                    </button>

                                    {/* Purge */}
                                    <button
                                      type="button"
                                      onClick={() => handlePurgeTrash(item)}
                                      title="Purger définitivement"
                                      className="inline-flex items-center justify-center cursor-pointer" style={{width:"32px",height:"32px",borderRadius:"6px",background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626"}}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tip banner */}
                  <div
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: "8px",
                      padding: "0.65rem 1rem",
                      marginTop: "1.25rem",
                      color: "#1E40AF",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span className="font-bold">Astuce :</span> Cliquez sur Restaurer pour réintégrer un fichier dans son dossier d'origine.
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex justify-between items-center" style={{padding:"1rem 1.75rem",borderTop:"1px solid #F1F5F9",background:"#FFF"}}
            >
              {normalizedTrashList.length === 0 ? (
                <>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    Statut du répertoire : Synchronisé à l'instant
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTrashModal(false)}
                    className="text-[var(--text-main)] font-semibold cursor-pointer" style={{border:"1px solid #E2E8F0",borderRadius:"8px",background:"#FFF",padding:"0.55rem 1.4rem",fontSize:"0.85rem"}}
                  >
                    Fermer
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                    {normalizedTrashList.length} élément{normalizedTrashList.length > 1 ? "s" : ""} • Espace occupé : {trashTotalSize}
                  </div>
                  <div className="flex" style={{gap:"0.75rem"}}>
                    <button
                      type="button"
                      onClick={handleRestoreAllTrash}
                      className="font-semibold cursor-pointer" style={{background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB",fontSize:"0.85rem",padding:"0.55rem 1.25rem",borderRadius:"8px"}}
                    >
                      Tout restaurer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrashModal(false)}
                      className="text-[var(--text-main)] font-semibold cursor-pointer" style={{border:"1px solid #E2E8F0",borderRadius:"8px",background:"#FFF",padding:"0.55rem 1.4rem",fontSize:"0.85rem"}}
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
  );
};

export default GedTrashModal;

