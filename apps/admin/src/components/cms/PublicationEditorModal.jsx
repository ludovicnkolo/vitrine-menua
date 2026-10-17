import React from "react";
import { X, ChevronDown, ChevronUp, Eye, ImageIcon } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_TRANSLATIONS,
  fieldLabelStyle,
  textInputStyle,
  toolbarStyle,
  toolbarBtnStyle,
  toolbarDividerStyle,
  sectionIconBtnStyle,
} from "./cmsStyles";

const PublicationEditorModal = ({
  showModal,
  editingPub,
  closeModal,
  title,
  setTitle,
  title_en,
  setTitleEn,
  category,
  setCategory,
  category_en,
  setCategoryEn,
  contentHtml,
  setContentHtml,
  contentHtml_en,
  setContentHtmlEn,
  coverImage,
  previewImage,
  uploadingImg,
  handleImageUpload,
  insertFormatting,
  sections,
  addSection,
  removeSection,
  moveSection,
  updateSection,
  handleSectionImageUpload,
  removeSectionImage,
  previewLang,
  setPreviewLang,
  status,
  formattedCurrentDate,
  handleSaveAction,
  setSaveOptionsModal,
}) => {
  if (!showModal) return null;

  return (
        <div
          className="fixed inset-0 flex items-start justify-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "2rem 1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-full flex flex-col" style={{background:"#FFF",borderRadius:"12px",maxWidth:"1150px",boxShadow:"0 20px 40px rgba(0,0,0,0.2)",overflow:"hidden"}}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center" style={{padding:"1.25rem 2rem",borderBottom:"1px solid #E2E8F0"}}
            >
              <div className="flex" style={{alignItems:"baseline",gap:"0.75rem"}}>
                <h2 className="font-bold text-[var(--text-main)]" style={{fontSize:"1.2rem"}}>
                  {editingPub ? "Modifier la publication" : "Créer une publication"}
                </h2>
                <span style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  Édition bilingue (FR/EN) avec aperçu en temps réel
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer" style={{background:"transparent",border:"none",color:"#94A3B8",fontSize:"1.2rem",padding:"0.2rem"}}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex" style={{flex:1,minHeight:"600px",overflow:"hidden"}}>
              {/* Left Column (Form) */}
              <div
                style={{
                  flex: 1,
                  padding: "1.75rem 2rem",
                  overflowY: "auto",
                  maxHeight: "75vh",
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveAction(status || "PUBLIE");
                  }}
                >
                  {/* Titre FR & EN */}
                  <div className="flex gap-4" style={{marginBottom:"1.25rem"}}>
                    <div style={{ flex: 1 }}>
                      <label style={fieldLabelStyle}>Titre (FR) *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Illum maxime Nam ad"
                        required
                        style={textInputStyle}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={fieldLabelStyle}>Titre (EN)</label>
                      <input
                        type="text"
                        value={title_en}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="Facere debitis qui a"
                        style={textInputStyle}
                      />
                    </div>
                  </div>

                  {/* Image de couverture */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={fieldLabelStyle}>Image de couverture</label>
                    <div className="flex items-center" style={{gap:"0.75rem"}}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        id="cms-image-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="cms-image-upload"
                        className="inline-block font-medium cursor-pointer" style={{padding:"0.5rem 1rem",borderRadius:"8px",border:"1px solid #CBD5E1",background:"#FFF",fontSize:"0.85rem",color:"#334155"}}
                      >
                        {uploadingImg ? "Upload..." : "Parcourir..."}
                      </label>
                      <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                        Formats acceptés : JPG, PNG, WEBP (Max 5 Mo)
                      </span>
                    </div>
                  </div>

                  {/* Catégories FR & EN */}
                  <div className="flex gap-4" style={{marginBottom:"1.25rem"}}>
                    <div style={{ flex: 1 }}>
                      <label style={fieldLabelStyle}>Catégorie (FR) * (Select interactif)</label>
                      <select
                        value={category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCategory(val);
                          setCategoryEn(CATEGORY_TRANSLATIONS[val] || "");
                        }}
                        required
                        style={{ ...textInputStyle, border: "1.5px solid #3B82F6", cursor: "pointer" }}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={fieldLabelStyle}>
                        Catégorie (EN) — <span style={{ fontWeight: "normal", color: "#64748B" }}>Généré automatiquement</span>
                      </label>
                      <input
                        type="text"
                        value={category_en}
                        readOnly
                        disabled
                        style={{
                          ...textInputStyle,
                          background: "#F8FAFC",
                          color: "#64748B",
                          cursor: "not-allowed",
                          borderColor: "#E2E8F0",
                        }}
                      />
                    </div>
                  </div>

                  {/* Contenu FR */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={fieldLabelStyle}>Contenu principal (FR) — Texte / HTML</label>
                    <div style={toolbarStyle}>
                      <button type="button" onClick={() => insertFormatting("b", false)} style={toolbarBtnStyle} title="Gras"><b>B</b></button>
                      <button type="button" onClick={() => insertFormatting("i", false)} style={toolbarBtnStyle} title="Italique"><i>I</i></button>
                      <button type="button" onClick={() => insertFormatting("u", false)} style={toolbarBtnStyle} title="Souligné"><u>U</u></button>
                      <span style={toolbarDividerStyle} />
                      <button type="button" onClick={() => insertFormatting("ul", false)} style={toolbarBtnStyle} title="Liste à puces">≡</button>
                      <button type="button" onClick={() => insertFormatting("ol", false)} style={toolbarBtnStyle} title="Liste ordonnée">≡</button>
                      <span style={toolbarDividerStyle} />
                      <button type="button" onClick={() => insertFormatting("link", false)} style={toolbarBtnStyle} title="Lien">Lien</button>
                      <button type="button" onClick={() => insertFormatting("html", false)} style={toolbarBtnStyle} title="HTML">HTML</button>
                    </div>
                    <textarea
                      value={contentHtml}
                      onChange={(e) => setContentHtml(e.target.value)}
                      rows={4}
                      placeholder="Voluptatem enim bla"
                      style={{
                        ...textInputStyle,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Contenu EN */}
                  <div className="mb-2">
                    <label style={fieldLabelStyle}>Contenu principal (EN) — Texte / HTML</label>
                    <div style={toolbarStyle}>
                      <button type="button" onClick={() => insertFormatting("b", true)} style={toolbarBtnStyle} title="Bold"><b>B</b></button>
                      <button type="button" onClick={() => insertFormatting("i", true)} style={toolbarBtnStyle} title="Italic"><i>I</i></button>
                      <button type="button" onClick={() => insertFormatting("u", true)} style={toolbarBtnStyle} title="Underline"><u>U</u></button>
                      <span style={toolbarDividerStyle} />
                      <button type="button" onClick={() => insertFormatting("ul", true)} style={toolbarBtnStyle} title="Bullet list">≡</button>
                      <button type="button" onClick={() => insertFormatting("ol", true)} style={toolbarBtnStyle} title="Numbered list">≡</button>
                      <span style={toolbarDividerStyle} />
                      <button type="button" onClick={() => insertFormatting("link", true)} style={toolbarBtnStyle} title="Link">Lien</button>
                      <button type="button" onClick={() => insertFormatting("html", true)} style={toolbarBtnStyle} title="HTML">HTML</button>
                    </div>
                    <textarea
                      value={contentHtml_en}
                      onChange={(e) => setContentHtmlEn(e.target.value)}
                      rows={4}
                      placeholder="Amet dolore tempor..."
                      style={{
                        ...textInputStyle,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <p style={{ fontSize: "0.78rem", color: "#64748B", margin: "0 0 1.25rem 0" }}>
                    Note : Vous pouvez utiliser des balises HTML pour enrichir le texte (listes, citations, gras).
                  </p>

                  {/* Sections */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center" style={{marginBottom:"0.75rem"}}>
                      <label style={{ ...fieldLabelStyle, margin: 0 }}>
                        Sections{" "}
                        <span className="font-normal" style={{color:"#64748B",fontSize:"0.78rem"}}>
                          (sous-titres + contenu + image optionnelle)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={addSection}
                        className="font-semibold inline-flex items-center cursor-pointer" style={{background:"#EFF6FF",color:"#2563EB",border:"1px solid #BFDBFE",borderRadius:"8px",padding:"0.4rem 0.8rem",fontSize:"0.8rem",gap:"0.4rem"}}
                      >
                        + Ajouter une section
                      </button>
                    </div>

                    {sections.length === 0 ? (
                      <div
                        className="text-center" style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"1.25rem",color:"#64748B",fontSize:"0.82rem"}}
                      >
                        Aucune section ajoutée. Cliquez sur "Ajouter une section" pour enrichir l'article.
                      </div>
                    ) : (
                      sections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="mb-4" style={{border:"1px solid #E2E8F0",borderRadius:"10px",padding:"1.25rem",background:"#FAFBFC"}}
                        >
                          <div className="flex justify-between items-center" style={{marginBottom:"0.75rem"}}>
                            <span className="font-semibold text-[var(--text-main)]" style={{fontSize:"0.85rem"}}>
                              Section {idx + 1}
                            </span>
                            <div className="flex" style={{gap:"0.25rem"}}>
                              <button
                                type="button"
                                onClick={() => moveSection(idx, -1)}
                                disabled={idx === 0}
                                style={sectionIconBtnStyle}
                                title="Monter"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSection(idx, 1)}
                                disabled={idx === sections.length - 1}
                                style={sectionIconBtnStyle}
                                title="Descendre"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(idx)}
                                style={{ ...sectionIconBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}
                                title="Supprimer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-4" style={{marginBottom:"0.75rem"}}>
                            <div style={{ flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Sous-titre (FR)..."
                                value={sec.subtitle}
                                onChange={(e) => updateSection(idx, "subtitle", e.target.value)}
                                style={textInputStyle}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Sous-titre (EN)..."
                                value={sec.subtitle_en}
                                onChange={(e) => updateSection(idx, "subtitle_en", e.target.value)}
                                style={textInputStyle}
                              />
                            </div>
                          </div>

                          <div className="flex gap-4" style={{marginBottom:"0.75rem"}}>
                            <div style={{ flex: 1 }}>
                              <textarea
                                rows={2}
                                placeholder="Texte (FR)..."
                                value={sec.text}
                                onChange={(e) => updateSection(idx, "text", e.target.value)}
                                style={textInputStyle}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <textarea
                                rows={2}
                                placeholder="Texte (EN)..."
                                value={sec.text_en}
                                onChange={(e) => updateSection(idx, "text_en", e.target.value)}
                                style={textInputStyle}
                              />
                            </div>
                          </div>

                          <div>
                            {sec.imagePreview ? (
                              <div className="relative inline-block">
                                <img
                                  src={sec.imagePreview}
                                  alt="Section"
                                  style={{ height: "70px", borderRadius: "6px", objectFit: "cover" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSectionImage(idx)}
                                  className="absolute text-white cursor-pointer flex items-center justify-center" style={{top:"-6px",right:"-6px",background:"#EF4444",border:"none",borderRadius:"50%",width:"18px",height:"18px"}}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`sec-img-${idx}`}
                                  onChange={(e) => handleSectionImageUpload(e, idx)}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`sec-img-${idx}`}
                                  className="cursor-pointer inline-flex items-center" style={{gap:"0.4rem",fontSize:"0.78rem",padding:"0.35rem 0.75rem",borderRadius:"6px",border:"1px solid #CBD5E1",background:"#FFF"}}
                                >
                                  <ImageIcon size={13} /> {sec.uploading ? "Upload..." : "Choisir une image"}
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column (Aperçu) */}
              <div
                className="flex flex-col" style={{width:"420px",borderLeft:"1px solid #E2E8F0",padding:"1.75rem",background:"#FFF",overflowY:"auto",maxHeight:"75vh"}}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center font-bold text-[var(--text-main)]" style={{gap:"0.4rem",fontSize:"0.95rem"}}>
                    <Eye size={16} color="#2563EB" /> Aperçu de la Publication
                  </div>
                  {/* Lang Tabs */}
                  <div className="flex" style={{background:"#F1F5F9",borderRadius:"6px",padding:"2px"}}>
                    <button
                      type="button"
                      onClick={() => setPreviewLang("FR")}
                      style={{
                        border: "none",
                        background: previewLang === "FR" ? "var(--text-main)" : "transparent",
                        color: previewLang === "FR" ? "#FFF" : "#64748B",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      FR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLang("EN")}
                      style={{
                        border: "none",
                        background: previewLang === "EN" ? "var(--text-main)" : "transparent",
                        color: previewLang === "EN" ? "#FFF" : "#64748B",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <p style={{ margin: "0 0 1rem 0", fontSize: "0.75rem", color: "#64748B" }}>
                  Rendu fidèle tel qu'il apparaîtra sur la page d'actualités publique :
                </p>

                {/* Preview Card */}
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {/* Hero / Cover */}
                  <div
                    className="relative flex flex-col items-center justify-center" style={{height:"150px",background:"#0A0F1D",overflow:"hidden"}}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Cover"
                        className="w-full h-full" style={{objectFit:"cover"}}
                      />
                    ) : (
                      <>
                        <div
                          style={{
                            color: "#E2E8F0",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            fontSize: "0.95rem",
                            textTransform: "uppercase",
                          }}
                        >
                          MENUA CONSULTING
                        </div>
                        <div style={{ color: "#94A3B8", fontSize: "0.72rem", marginTop: "4px" }}>
                          Actualité d'expertise
                        </div>
                      </>
                    )}

                    {/* Category badge */}
                    <div
                      className="absolute text-[var(--text-main)]" style={{top:"10px",left:"10px",background:"#FFF",padding:"3px 8px",fontSize:"0.62rem",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.05em",borderRadius:"4px"}}
                    >
                      {(previewLang === "EN" ? category_en : category) || "ORGANISATION ET EXTERNALISATION"}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1.25rem" }}>
                    <div className="font-semibold" style={{fontSize:"0.7rem",color:"#64748B",letterSpacing:"0.05em",marginBottom:"0.4rem"}}>
                      {formattedCurrentDate}
                    </div>
                    <div
                      className="font-bold text-[var(--text-main)]" style={{fontSize:"1rem",lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}
                    >
                      {(previewLang === "EN" ? title_en : title) || "Illum maxime Nam ad"}
                    </div>
                  </div>
                </div>

                {/* Blue Sync Notice Box */}
                <div
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    marginTop: "auto",
                  }}
                >
                  <div className="font-bold" style={{color:"#2563EB",fontSize:"0.82rem"}}>
                    ✓ Synchronisation dynamique active
                  </div>
                  <div style={{ color: "#1E40AF", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                    Les modifications saisies à gauche se reflètent instantanément ici.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex justify-between items-center" style={{borderTop:"1px solid #E2E8F0",padding:"1rem 2rem",background:"#FFF"}}
            >
              <button
                type="button"
                onClick={closeModal}
                className="font-semibold cursor-pointer" style={{background:"#FFF",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"0.6rem 1.25rem",fontSize:"0.85rem",color:"#334155"}}
              >
                Fermer
              </button>
              <div className="flex" style={{gap:"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => handleSaveAction(status === "PUBLIE" ? "PUBLIE" : "BROUILLON", true)}
                  className="font-semibold inline-flex items-center cursor-pointer" style={{background:"#FFF",border:"1.5px solid #3B82F6",borderRadius:"8px",padding:"0.6rem 1.25rem",fontSize:"0.85rem",color:"#2563EB",gap:"0.4rem"}}
                >
                  <Eye size={15} /> Aperçu
                </button>
                <button
                  type="button"
                  onClick={() => setSaveOptionsModal({ isOpen: true, isPreview: false })}
                  className="font-semibold text-white cursor-pointer" style={{background:"#10B981",border:"none",borderRadius:"8px",padding:"0.6rem 1.5rem",fontSize:"0.85rem"}}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>

  );
};

export default PublicationEditorModal;
