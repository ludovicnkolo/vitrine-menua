import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Shield,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { getSafeApiUrl, apiFetch } from "../utils/helpers";
import ConfirmModal from "../components/ConfirmModal";
import TabsNavigation from "../components/TabsNavigation";
import PaginationControls from "../components/PaginationControls";

import {
  EMPTY_SECTION,
  CATEGORIES,
  CATEGORY_TRANSLATIONS,
} from "../components/cms/cmsStyles";
import SaveOptionsModal from "../components/cms/SaveOptionsModal";
import PublicationEditorModal from "../components/cms/PublicationEditorModal";
import CmsSettingsTab from "../components/cms/CmsSettingsTab";
import CmsPublicationsTable from "../components/cms/CmsPublicationsTable";

const CMSPage = () => {
  const { t } = useTranslation();
  const [publications, setPublications] = useState([]);
  const _adminUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    } catch {
      return {};
    }
  })();
  const _role = _adminUser?.role || "";
  const isSuperAdmin = _role === "Super-administrateur";

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPub, setEditingPub] = useState(null);

  const storageKey = `active_tab_${window.location.pathname}`;
  const [tab, setTab] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved || "publication";
  });

  const handleTabChange = (newTab) => {
    setTab(newTab);
    sessionStorage.setItem(storageKey, newTab);
  };

  // Search & Filters on publications
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Form states
  const [previewLang, setPreviewLang] = useState("FR");
  const [title, setTitle] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentHtml_en, setContentHtmlEn] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("PUBLIE");
  const [category, setCategory] = useState("ORGANISATION ET EXTERNALISATION");
  const [category_en, setCategoryEn] = useState("ORGANIZATION AND OUTSOURCING");
  const [sections, setSections] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
    confirmText: "Confirmer",
    cancelText: "Annuler",
  });

  const [saveOptionsModal, setSaveOptionsModal] = useState({
    isOpen: false,
    isPreview: false,
  });

  // Paramètres Formulaires State
  const [formSettings, setFormSettings] = useState({
    contactFormEnabled: true,
    recrutementFormEnabled: true,
    blacklistedEmails: [],
    blacklistedDomains: [],
  });
  const [newBlacklistEmail, setNewBlacklistEmail] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    if (type === "success") {
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        5000,
      );
    }
  };

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/cms");
      if (res.ok) {
        const data = await res.json();
        setPublications(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormSettings = async () => {
    if (!isSuperAdmin) return;
    try {
      setLoadingSettings(true);
      const res = await apiFetch("/api/cms/settings/forms");
      if (res.ok) {
        const data = await res.json();
        if (data.data) setFormSettings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveFormSettings = async () => {
    try {
      const res = await apiFetch(
        "/api/cms/settings/forms",
        "PUT",
        formSettings,
      );
      if (res.ok) {
        showToast("Paramètres mis à jour avec succès.");
      } else {
        showToast("Erreur lors de la mise à jour des paramètres.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const handleRemoveBlacklistEmail = (emailToRemove) => {
    setFormSettings((prev) => ({
      ...prev,
      blacklistedEmails: (prev.blacklistedEmails || []).filter(
        (e) => e.toLowerCase() !== emailToRemove.toLowerCase(),
      ),
    }));
  };

  const handleAddBlacklistEmail = () => {
    const trimmed = (newBlacklistEmail || "").trim().toLowerCase();
    if (!trimmed) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      showToast("Veuillez saisir une adresse email valide.", "error");
      return;
    }
    if (formSettings.blacklistedEmails?.some((e) => e.toLowerCase() === trimmed)) {
      showToast("Cette adresse email est déjà dans la liste de blocage.", "error");
      return;
    }
    setFormSettings((prev) => ({
      ...prev,
      blacklistedEmails: [...(prev.blacklistedEmails || []), trimmed],
    }));
    setNewBlacklistEmail("");
  };

  useEffect(() => {
    fetchPublications();
    if (tab === "parametrage") fetchFormSettings();
  }, [tab]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      sections.forEach((sec) => {
        if (sec.imagePreview && sec.imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(sec.imagePreview);
        }
      });
    };
  }, [previewImage, sections]);

  const openModal = (pub = null) => {
    if (pub) {
      setEditingPub(pub);
      setTitle(pub.title || "");
      setTitleEn(pub.title_en || "");
      setContentHtml(pub.contentHtml || "");
      setContentHtmlEn(pub.contentHtml_en || "");
      setCoverImage(pub.coverImage || "");
      setStatus(pub.status || "PUBLIE");
      const cat = pub.category || "ORGANISATION ET EXTERNALISATION";
      setCategory(cat);
      setCategoryEn(
        pub.category_en || CATEGORY_TRANSLATIONS[cat] || "ORGANIZATION AND OUTSOURCING",
      );

      const vitrineUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://menuaconsulting.com";
      const formatImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("/uploads")) return `${vitrineUrl}${url}`;
        return url;
      };

      setPreviewImage(formatImageUrl(pub.coverImageUrl || pub.coverImage));

      // Parse sections
      let parsedSections = [];
      if (pub.sections) {
        try {
          const raw =
            typeof pub.sections === "string"
              ? JSON.parse(pub.sections)
              : pub.sections;
          const rawEn =
            typeof pub.sections_en === "string"
              ? JSON.parse(pub.sections_en)
              : pub.sections_en || [];
          parsedSections = Array.isArray(raw)
            ? raw.map((s, idx) => {
                const enSec = Array.isArray(rawEn) ? rawEn[idx] : null;
                return {
                  subtitle: s.subtitle || "",
                  subtitle_en: enSec?.subtitle || "",
                  text: s.text || "",
                  text_en: enSec?.text || "",
                  imageKey: s.imageKey || "",
                  imagePreview: formatImageUrl(s.imageUrl || s.imageKey),
                  uploading: false,
                };
              })
            : [];
        } catch (_) {}
      }
      setSections(parsedSections);
    } else {
      setEditingPub(null);
      setTitle("");
      setTitleEn("");
      setContentHtml("");
      setContentHtmlEn("");
      setCoverImage("");
      setPreviewImage("");
      setStatus("PUBLIE");
      setCategory("ORGANISATION ET EXTERNALISATION");
      setCategoryEn("ORGANIZATION AND OUTSOURCING");
      setSections([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    sections.forEach((sec) => {
      if (sec.imagePreview && sec.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(sec.imagePreview);
      }
    });
    setShowModal(false);
    setEditingPub(null);
  };

  const handleSaveAction = async (targetStatus = "PUBLIE", showPreview = false) => {
    if (!title || !title.trim()) {
      showToast("Le titre (FR) est requis", "error");
      return;
    }

    const data = {
      title: title.trim(),
      title_en: title_en.trim(),
      type: "ACTUALITE",
      category,
      category_en,
      contentHtml,
      contentHtml_en,
      coverImage,
      status: targetStatus,
      sections: sections.map((s) => ({
        subtitle: s.subtitle || "",
        text: s.text || "",
        imageKey: s.imageKey || "",
      })),
      sections_en: sections.map((s) => ({
        subtitle: s.subtitle_en || "",
        text: s.text_en || "",
        imageKey: s.imageKey || "",
      })),
    };

    let previewWindow = null;
    if (showPreview) {
      try {
        previewWindow = window.open("", "_blank");
        if (previewWindow) {
          previewWindow.document.write("<!DOCTYPE html><html><head><title>Aperçu — MENUA CONSULTING</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0A0F1D;color:#E2E8F0;text-align:center;}</style></head><body><div><h3 style='margin-bottom:8px;'>Chargement de l'aperçu...</h3><p style='color:#94A3B8;font-size:14px;margin:0;'>Préparation de la publication en cours</p></div></body></html>");
        }
      } catch (e) {
        console.warn("Popup bloquée par le navigateur", e);
      }
    }

    try {
      let res;
      if (editingPub) {
        res = await apiFetch(`/api/cms/${editingPub.id}`, "PUT", data);
      } else {
        res = await apiFetch("/api/cms", "POST", data);
      }
      if (res.ok) {
        const savedData = await res.json();
        const savedPub = savedData.data || savedData;
        const vitrineUrl =
          window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://menuaconsulting.com";
        const previewUrl = `${vitrineUrl}/fr/actualites/${savedPub.id}?preview=true`;

        if (showPreview) {
          if (previewWindow && !previewWindow.closed) {
            previewWindow.location.href = previewUrl;
          } else {
            window.open(previewUrl, "_blank", "noopener,noreferrer");
          }
          setEditingPub(savedPub);
          showToast("Aperçu ouvert dans un nouvel onglet.");
        } else {
          showToast(
            `Publication ${targetStatus === "PUBLIE" ? "publiée" : "sauvegardée"} avec succès.`,
          );
          closeModal();
        }
        fetchPublications();
      } else {
        if (previewWindow && !previewWindow.closed) previewWindow.close();
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Erreur lors de la sauvegarde.", "error");
      }
    } catch (err) {
      console.error(err);
      if (previewWindow && !previewWindow.closed) previewWindow.close();
      showToast("Erreur lors de la sauvegarde.", "error");
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer la publication",
      message:
        "Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.",
      type: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          const res = await apiFetch(`/api/cms/${id}`, "DELETE");
          if (res.ok) {
            showToast("Publication supprimée.");
            fetchPublications();
          } else showToast("Erreur lors de la suppression.", "error");
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  // Upload cover image with ObjectURL cleanup
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    const localBlob = URL.createObjectURL(file);
    setPreviewImage(localBlob);
    setUploadingImg(true);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl("/api/cms/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.url) {
        setCoverImage(data.url);
        showToast("Image uploadée avec succès");
      } else {
        showToast(data.error || "Erreur lors de l'upload.", "error");
        if (localBlob.startsWith("blob:")) {
          URL.revokeObjectURL(localBlob);
        }
        setPreviewImage(
          coverImage ? (coverImage.startsWith("http") || coverImage.startsWith("/uploads") ? coverImage : "") : "",
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
      if (localBlob.startsWith("blob:")) {
        URL.revokeObjectURL(localBlob);
      }
      setPreviewImage(
        coverImage ? (coverImage.startsWith("http") || coverImage.startsWith("/uploads") ? coverImage : "") : "",
      );
    } finally {
      setUploadingImg(false);
    }
  };

  // Sections helpers
  const addSection = () => setSections((prev) => [...prev, EMPTY_SECTION()]);

  const removeSection = (idx) => {
    const sec = sections[idx];
    if (sec?.imagePreview && sec.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(sec.imagePreview);
    }
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveSection = (idx, dir) => {
    setSections((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const updateSection = (idx, field, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  };

  const handleSectionImageUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldBlob = sections[idx]?.imagePreview;
    if (oldBlob && oldBlob.startsWith("blob:")) {
      URL.revokeObjectURL(oldBlob);
    }

    const localUrl = URL.createObjectURL(file);
    updateSection(idx, "imagePreview", localUrl);
    updateSection(idx, "uploading", true);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl("/api/cms/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.url) {
        updateSection(idx, "imageKey", data.url);
        showToast("Image de section uploadée");
      } else {
        showToast(data.error || "Erreur upload image de section.", "error");
        removeSectionImage(idx);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
      removeSectionImage(idx);
    } finally {
      updateSection(idx, "uploading", false);
    }
  };

  const removeSectionImage = (idx) => {
    const sec = sections[idx];
    if (sec?.imagePreview && sec.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(sec.imagePreview);
    }
    updateSection(idx, "imageKey", "");
    updateSection(idx, "imagePreview", "");
  };

  // Rich text formatting toolbar helper
  const insertFormatting = (tag, isEn = false) => {
    let openTag = `<${tag}>`;
    let closeTag = `</${tag}>`;
    let sample = "texte";

    if (tag === "link") {
      openTag = '<a href="https://example.com" target="_blank">';
      closeTag = "</a>";
      sample = "lien";
    } else if (tag === "ul") {
      openTag = "<ul>\n  <li>";
      closeTag = "</li>\n</ul>";
      sample = "élément";
    } else if (tag === "ol") {
      openTag = "<ol>\n  <li>";
      closeTag = "</li>\n</ol>";
      sample = "élément";
    } else if (tag === "html") {
      openTag = '<div style="margin: 1rem 0;">\n  ';
      closeTag = "\n</div>";
      sample = "contenu personnalisé";
    }

    if (isEn) {
      setContentHtmlEn((prev) =>
        prev ? `${prev}\n${openTag}${sample}${closeTag}` : `${openTag}${sample}${closeTag}`,
      );
    } else {
      setContentHtml((prev) =>
        prev ? `${prev}\n${openTag}${sample}${closeTag}` : `${openTag}${sample}${closeTag}`,
      );
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  // Filtered actualités
  const filteredPubs = useMemo(() => {
    return publications
      .filter((p) => {
        if (p.type !== "ACTUALITE") return false;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (p.title || "").toLowerCase().includes(q) ||
          (p.title_en || "").toLowerCase().includes(q) ||
          (p.author?.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "all" || p.status === statusFilter;

        const matchesCategory =
          categoryFilter === "all" || p.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime());
  }, [publications, searchQuery, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPubs.length / limit));

  const paginatedPubs = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredPubs.slice(startIndex, startIndex + limit);
  }, [filteredPubs, page, limit]);

  const onlineCount = useMemo(() => {
    return publications.filter((p) => p.type === "ACTUALITE" && p.status === "PUBLIE").length;
  }, [publications]);

  const formattedCurrentDate = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).toUpperCase();
  }, []);

  return (
    <div className="mx-auto" style={{maxWidth:"1280px",padding:"0 1rem"}}>
      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            color: "#FFF",
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "0.88rem" }}>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="cursor-pointer text-white font-bold" style={{background:"transparent",border:"none",fontSize:"1rem",padding:"0 4px"}}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Tabs */}
      <TabsNavigation
        tabs={[
          { id: "publication", label: "Publication" },
          { id: "parametrage", label: "Paramétrage Du Site" },
        ]}
        activeTab={tab}
        onTabChange={handleTabChange}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: PUBLICATION (IMAGE 3)                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {tab === "publication" && (
        <>
          {/* Header */}
          <div
            className="flex justify-between items-center mb-6 flex-wrap gap-4"
          >
            <div>
              <h1
                className="font-bold text-[var(--text-main)]" style={{fontSize:"1.5rem",margin:"0 0 0.25rem 0"}}
              >
                {t("cms.title", "Gestion des Publications")}
              </h1>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.85rem" }}>
                {t("cms.subtitle", "Pilotez les actualités, articles et contenus diffusés publiquement sur le site officiel")}
              </p>
            </div>
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => openModal()}
                className="btn btn-primary font-semibold inline-flex items-center gap-2 cursor-pointer"
                style={{ borderRadius: "8px", padding: "0.65rem 1.25rem", fontSize: "0.88rem" }}
              >
                {t("cms.newPost", "+ Nouvelle Actualité")}
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div
            className="mb-6 flex items-center gap-4 flex-wrap" style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px",padding:"0.85rem 1.25rem"}}
          >
            <div className="relative" style={{flex:"1 1 260px"}}>
              <Search
                size={16}
                className="absolute" style={{left:"0.85rem",top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}
              />
              <input
                type="text"
                placeholder={t("cms.searchPlaceholder", "Rechercher par titre, auteur, mot-clé...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-[var(--text-main)]" style={{padding:"0.6rem 1rem 0.6rem 2.4rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--bg-main)",fontSize:"0.85rem",outline:"none"}}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.6rem 2rem 0.6rem 0.85rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--bg-main)",fontSize:"0.85rem",outline:"none"}}
            >
              <option value="all">{t("common.allStatuses", "Tous les statuts")}</option>
              <option value="PUBLIE">{t("status.PUBLIE", "PUBLIÉ")}</option>
              <option value="BROUILLON">{t("status.BROUILLON", "BROUILLON")}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.6rem 2rem 0.6rem 0.85rem",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--bg-main)",fontSize:"0.85rem",outline:"none"}}
            >
              <option value="all">{t("cms.allCategories", "Toutes les catégories")}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Green count badge */}
            <div
              className="font-semibold inline-flex items-center gap-2" style={{background:"#ECFDF5",color:"#059669",border:"1px solid #A7F3D0",padding:"0.45rem 1rem",borderRadius:"8px",fontSize:"0.82rem",whiteSpace:"nowrap",marginLeft:"auto"}}
            >
              <span style={{ fontSize: "0.7rem" }}>🟢</span>
              {t("cms.onlineCount", { count: onlineCount, defaultValue: `${onlineCount} Actualité${onlineCount > 1 ? "s" : ""} en ligne` })}
            </div>
          </div>

          <CmsPublicationsTable
            loading={loading}
            filteredPubs={filteredPubs}
            paginatedPubs={paginatedPubs}
            page={page}
            limit={limit}
            totalPages={totalPages}
            setPage={setPage}
            openModal={openModal}
            handleDelete={handleDelete}
            isSuperAdmin={isSuperAdmin}
          />
        </>
      )}

      {/* TAB 2: PARAMÉTRAGE DU SITE */}
      <CmsSettingsTab
        tab={tab}
        loadingSettings={loadingSettings}
        formSettings={formSettings}
        setFormSettings={setFormSettings}
        newBlacklistEmail={newBlacklistEmail}
        setNewBlacklistEmail={setNewBlacklistEmail}
        handleAddBlacklistEmail={handleAddBlacklistEmail}
        handleRemoveBlacklistEmail={handleRemoveBlacklistEmail}
        saveFormSettings={saveFormSettings}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: MODIFIER / CRÉER PUBLICATION */}
      <PublicationEditorModal
        showModal={showModal}
        editingPub={editingPub}
        handleCloseModal={handleCloseModal}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
        formData={formData}
        setFormData={setFormData}
        sections={sections}
        setSections={setSections}
        mainImage={mainImage}
        mainImagePreview={mainImagePreview}
        setMainImage={setMainImage}
        setMainImagePreview={setMainImagePreview}
        mainImageInputRef={mainImageInputRef}
        applyToolbar={applyToolbar}
        addSection={addSection}
        removeSection={removeSection}
        moveSection={moveSection}
        updateSection={updateSection}
        handleSectionImageUpload={handleSectionImageUpload}
        removeSectionImage={removeSectionImage}
        setSaveOptionsModal={setSaveOptionsModal}
        getMediaUrl={getMediaUrl}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type || "warning"}
        confirmText={confirmModal.confirmText || "Confirmer"}
        cancelText={confirmModal.cancelText || "Annuler"}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Save Options Modal */}
      <SaveOptionsModal
        saveOptionsModal={saveOptionsModal}
        setSaveOptionsModal={setSaveOptionsModal}
        handleSaveAction={handleSaveAction}
      />
    </div>
  );
};

export default CMSPage;
