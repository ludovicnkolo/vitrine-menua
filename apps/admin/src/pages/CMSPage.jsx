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

const EMPTY_SECTION = () => ({
  subtitle: "",
  subtitle_en: "",
  text: "",
  text_en: "",
  imageKey: "",
  imagePreview: "",
  uploading: false,
});

const CATEGORIES = [
  "FINANCE ET COMPTABILITÉ",
  "BACK ET MIDDLE OFFICE",
  "DATA ET REPORTING",
  "RISQUES, CONFORMITÉ ET KYC",
  "GESTION DE PATRIMOINE",
  "ORGANISATION ET EXTERNALISATION",
];

const CATEGORY_TRANSLATIONS = {
  "FINANCE ET COMPTABILITÉ": "FINANCE AND ACCOUNTING",
  "BACK ET MIDDLE OFFICE": "BACK AND MIDDLE OFFICE",
  "DATA ET REPORTING": "DATA AND REPORTING",
  "RISQUES, CONFORMITÉ ET KYC": "RISK, COMPLIANCE AND KYC",
  "GESTION DE PATRIMOINE": "WEALTH MANAGEMENT",
  "ORGANISATION ET EXTERNALISATION": "ORGANIZATION AND OUTSOURCING",
};

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

  useEffect(() => {
    fetchPublications();
    if (tab === "parametrage") fetchFormSettings();
  }, [tab]);

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
    setShowModal(false);
    setEditingPub(null);
  };

  const handleSaveAction = async (targetStatus = "PUBLIE", showPreview = false) => {
    if (!title) {
      showToast("Le titre (FR) est requis", "error");
      return;
    }

    const data = {
      title,
      title_en,
      type: "ACTUALITE",
      category,
      category_en,
      contentHtml,
      contentHtml_en,
      coverImage,
      status: targetStatus,
      sections: sections.map((s) => ({
        subtitle: s.subtitle,
        text: s.text,
        imageKey: s.imageKey,
      })),
      sections_en: sections.map((s) => ({
        subtitle: s.subtitle_en,
        text: s.text_en,
        imageKey: s.imageKey,
      })),
    };

    let previewWindow = null;
    if (showPreview) {
      previewWindow = window.open("about:blank", "_blank");
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
        const savedPub = savedData.data;
        if (showPreview && previewWindow) {
          const vitrineUrl =
            window.location.hostname === "localhost"
              ? "http://localhost:3000"
              : "https://menuaconsulting.com";
          previewWindow.location.href = `${vitrineUrl}/actualites/${savedPub.id}?preview=true`;
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
        if (previewWindow) previewWindow.close();
        showToast("Erreur lors de la sauvegarde.", "error");
      }
    } catch (err) {
      console.error(err);
      if (previewWindow) previewWindow.close();
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

  // Upload cover image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
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
      const data = await res.json();
      if (data.success) {
        setCoverImage(data.url);
        showToast("Image uploadée avec succès");
      } else {
        showToast("Erreur lors de l'upload.", "error");
        setPreviewImage(
          coverImage ? (coverImage.startsWith("http") ? coverImage : "") : "",
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  // Sections helpers
  const addSection = () => setSections((prev) => [...prev, EMPTY_SECTION()]);

  const removeSection = (idx) =>
    setSections((prev) => prev.filter((_, i) => i !== idx));

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
    const file = e.target.files[0];
    if (!file) return;
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
      const data = await res.json();
      if (data.success) {
        updateSection(idx, "imageKey", data.url);
        showToast("Image de section uploadée");
      } else {
        showToast("Erreur upload image de section.", "error");
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
                {t("cms.title", "Espace Site Web — Gestion des Publications")}
              </h1>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.85rem" }}>
                {t("cms.subtitle", "Pilotez les actualités, articles et contenus diffusés publiquement sur le site officiel")}
              </p>
            </div>
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => openModal()}
                className="text-white font-semibold inline-flex items-center gap-2 cursor-pointer" style={{background:"var(--text-main)",border:"none",borderRadius:"8px",padding:"0.65rem 1.25rem",fontSize:"0.88rem",transition:"background 0.2s"}}
              >
                {t("cms.newPost", "+ Nouvelle Actualité")}
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div
            className="mb-6 flex items-center gap-4 flex-wrap" style={{background:"#FFF",border:"1px solid #E2E8F0",borderRadius:"12px",padding:"0.85rem 1.25rem"}}
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
                className="w-full text-[var(--text-main)]" style={{padding:"0.6rem 1rem 0.6rem 2.4rem",borderRadius:"8px",border:"1px solid #E2E8F0",fontSize:"0.85rem",outline:"none"}}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.6rem 2rem 0.6rem 0.85rem",borderRadius:"8px",border:"1.5px solid #3B82F6",background:"#FFF",fontSize:"0.85rem",outline:"none"}}
            >
              <option value="all">{t("common.allStatuses", "Tous les statuts")}</option>
              <option value="PUBLIE">{t("status.PUBLIE", "PUBLIÉ")}</option>
              <option value="BROUILLON">{t("status.BROUILLON", "BROUILLON")}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[var(--text-main)] cursor-pointer" style={{padding:"0.6rem 2rem 0.6rem 0.85rem",borderRadius:"8px",border:"1.5px solid #3B82F6",background:"#FFF",fontSize:"0.85rem",outline:"none"}}
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

          {/* Table */}
          <div className="table-wrapper">
            <table className="w-full" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <th
                    className="text-left font-bold" style={{padding:"0.85rem 1.25rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"36%"}}
                  >
                    {t("cms.columns.title", "Titre de l'actualité")}
                  </th>
                  <th
                    className="text-left font-bold" style={{padding:"0.85rem 1.25rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"20%"}}
                  >
                    {t("cms.columns.author", "Auteur")}
                  </th>
                  <th
                    className="text-left font-bold" style={{padding:"0.85rem 1.25rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"15%"}}
                  >
                    {t("cms.columns.status", "Statut")}
                  </th>
                  <th
                    className="table-date-cell text-left font-bold" style={{padding:"0.85rem 1.25rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"190px"}}
                  >
                    {t("cms.columns.publishedAt", "Date de publication")}
                  </th>
                  <th
                    className="text-right font-bold" style={{padding:"0.85rem 1.25rem",fontSize:"0.72rem",color:"#64748B",letterSpacing:"0.05em",textTransform:"uppercase",width:"130px"}}
                  >
                    {t("cms.columns.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center" style={{padding:"3rem",color:"#64748B",fontSize:"0.9rem"}}
                    >
                      {t("common.loading", "Chargement des actualités...")}
                    </td>
                  </tr>
                ) : filteredPubs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center" style={{padding:"3rem",color:"#64748B",fontSize:"0.9rem"}}
                    >
                      {t("common.noResult", "Aucune actualité trouvée.")}
                    </td>
                  </tr>
                ) : (
                  paginatedPubs.map((pub) => {
                    const d = new Date(pub.publishedAt || pub.createdAt || Date.now());
                    const dateStr = d.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                    const timeStr = d.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const authorName = pub.author?.name || "Rosette Fouelefack";
                    const authorInitial = authorName.charAt(0).toUpperCase();

                    return (
                      <tr
                        key={pub.id}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          transition: "background 0.15s",
                        }}
                      >
                        {/* Titre */}
                        <td style={{ padding: "0.85rem 1.25rem", verticalAlign: "middle" }}>
                          <div className="flex items-center" style={{gap:"0.85rem"}}>
                            <button
                              type="button"
                              onClick={() => openModal(pub)}
                              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                              style={{width:"36px",height:"36px",borderRadius:"8px",background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB"}}
                              title={t("common.edit", "Ouvrir la publication")}
                            >
                              <FileText size={18} />
                            </button>
                            <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                              <button
                                type="button"
                                onClick={() => openModal(pub)}
                                className="truncate-name font-bold text-[var(--text-main)] text-left hover:text-[var(--primary)] hover:underline cursor-pointer block w-full"
                                style={{fontSize:"0.88rem",background:"none",border:"none",padding:0,maxWidth:"100%"}}
                                title={pub.title}
                              >
                                {pub.title}
                              </button>
                              <div
                                className="truncate-name"
                                style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px", maxWidth: "100%" }}
                              >
                                {t("cms.category", "Catégorie :")} {pub.category || "Organisation et Externalisation"} • {t("cms.languages", "Langues :")} FR | EN
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Auteur */}
                        <td style={{ padding: "0.85rem 1.25rem", verticalAlign: "middle" }}>
                          <div className="flex items-center" style={{gap:"0.6rem"}}>
                            <div
                              className="flex items-center justify-center font-bold" style={{width:"28px",height:"28px",borderRadius:"50%",background:"#F1F5F9",color:"#334155",fontSize:"0.78rem"}}
                            >
                              {authorInitial}
                            </div>
                            <span
                              className="truncate-name font-semibold text-[var(--text-main)]" style={{fontSize:"0.85rem",maxWidth:"100%"}}
                              title={authorName}
                            >
                              {authorName}
                            </span>
                          </div>
                        </td>

                        {/* Statut */}
                        <td style={{ padding: "0.85rem 1.25rem", verticalAlign: "middle" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.3rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: pub.status === "PUBLIE" ? "#ECFDF5" : "#FEF3C7",
                              color: pub.status === "PUBLIE" ? "#059669" : "#D97706",
                              border: pub.status === "PUBLIE" ? "1px solid #A7F3D0" : "1px solid #FDE68A",
                            }}
                          >
                            <span style={{ fontSize: "0.65rem" }}>●</span>
                            {pub.status === "PUBLIE" ? t("status.PUBLIE", "PUBLIÉ") : t("status.BROUILLON", "BROUILLON")}
                          </span>
                        </td>

                        {/* Date de publication */}
                        <td className="table-date-cell" style={{ padding: "0.85rem 1.25rem", verticalAlign: "middle", width: "190px" }}>
                          <div className="flex items-center gap-2 text-[var(--text-main)]" style={{fontSize:"0.85rem",whiteSpace:"nowrap"}}>
                            <Calendar size={15} style={{ color: "#94A3B8", flexShrink: 0 }} />
                            <span style={{ whiteSpace: "nowrap" }}>{dateStr} {timeStr}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="text-right" style={{padding:"0.85rem 1.25rem",verticalAlign:"middle"}}>
                          <div className="inline-flex items-center justify-end" style={{gap:"0.4rem"}}>
                            {/* Modifier */}
                            <button
                              type="button"
                              onClick={() => openModal(pub)}
                              title={t("common.edit", "Modifier")}
                              className="flex items-center justify-center cursor-pointer" style={{width:"32px",height:"32px",borderRadius:"6px",background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB"}}
                            >
                              <Edit2 size={15} />
                            </button>
                            {/* Voir / Aperçu */}
                            <button
                              type="button"
                              onClick={() => {
                                const vitrineUrl =
                                  window.location.hostname === "localhost"
                                    ? "http://localhost:3000"
                                    : "https://menuaconsulting.com";
                                window.open(`${vitrineUrl}/fr/actualites/${pub.id}?preview=true`, "_blank");
                              }}
                              title={t("common.view", "Consulter l'article")}
                              className="flex items-center justify-center cursor-pointer" style={{width:"32px",height:"32px",borderRadius:"6px",background:"#F1F5F9",border:"1px solid #E2E8F0",color:"#64748B"}}
                            >
                              <Eye size={15} />
                            </button>
                            {/* Supprimer */}
                            {isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDelete(pub.id)}
                                title={t("common.delete", "Supprimer")}
                                className="flex items-center justify-center cursor-pointer" style={{width:"32px",height:"32px",borderRadius:"6px",background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626"}}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: PARAMÉTRAGE DU SITE (IMAGE 4)                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {tab === "parametrage" && (
        <div style={{ maxWidth: "1280px" }}>
          {/* Header */}
          <div className="mb-6">
            <h1
              className="font-bold text-[var(--text-main)]" style={{fontSize:"1.5rem",margin:"0 0 0.25rem 0"}}
            >
              {t("cms.formSettingsTitle", "Paramètres des formulaires du site")}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#64748B", margin: 0 }}>
              {t("cms.formSettingsSub", "Contrôlez l'ouverture des formulaires en ligne et la sécurité anti-spam")}
            </p>
          </div>

          {loadingSettings ? (
            <div className="text-center" style={{padding:"3rem",color:"#64748B"}}>
              {t("common.loading", "Chargement des paramètres...")}
            </div>
          ) : (
            <div>
              {/* Form toggles */}
              <div
                className="grid gap-6 mb-6" style={{gridTemplateColumns:"1fr 1fr"}}
              >
                {/* Contact Card */}
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #E2E8F0",
                    borderTop: "4px solid #2563EB",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <h3 className="font-bold text-[var(--text-main)]" style={{margin:"0 0 0.2rem 0",fontSize:"0.95rem"}}>
                    {t("cms.contactCardTitle", "Formulaire de Contact Public")}
                  </h3>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "#64748B" }}>
                    {t("cms.contactCardSub", "Permet aux visiteurs d'envoyer des demandes de devis et d'informations")}
                  </p>

                  <label
                    className="flex items-center cursor-pointer" style={{gap:"0.75rem",padding:"0.85rem 1.25rem",background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:"8px"}}
                  >
                    <input
                      type="checkbox"
                      checked={formSettings.contactFormEnabled}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, contactFormEnabled: e.target.checked })
                      }
                      className="cursor-pointer" style={{width:"18px",height:"18px",accentColor:"#2563EB"}}
                    />
                    <div>
                      <div className="font-bold" style={{fontSize:"0.85rem",color:"#15803D"}}>
                        {formSettings.contactFormEnabled
                          ? t("cms.contactEnabled", "Activé (Accepte les soumissions)")
                          : t("cms.contactDisabled", "Désactivé (Bloque les soumissions)")}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#16A34A", marginTop: "2px" }}>
                        {t("cms.contactOpen", "Le formulaire est actuellement ouvert et opérationnel sur le site")}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Recrutement Card */}
                <div
                  style={{
                    background: "#FFF",
                    border: "1px solid #E2E8F0",
                    borderTop: "4px solid #9333EA",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <h3 className="font-bold text-[var(--text-main)]" style={{margin:"0 0 0.2rem 0",fontSize:"0.95rem"}}>
                    {t("cms.recruitmentCardTitle", "Formulaire Recrutement (Carrières)")}
                  </h3>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "#64748B" }}>
                    {t("cms.recruitmentCardSub", "Permet aux candidats de déposer leur CV et lettre de motivation")}
                  </p>

                  <label
                    className="flex items-center cursor-pointer" style={{gap:"0.75rem",padding:"0.85rem 1.25rem",background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:"8px"}}
                  >
                    <input
                      type="checkbox"
                      checked={formSettings.recrutementFormEnabled}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, recrutementFormEnabled: e.target.checked })
                      }
                      className="cursor-pointer" style={{width:"18px",height:"18px",accentColor:"#2563EB"}}
                    />
                    <div>
                      <div className="font-bold" style={{fontSize:"0.85rem",color:"#15803D"}}>
                        {formSettings.recrutementFormEnabled
                          ? t("cms.recruitmentEnabled", "Activé (Accepte les candidatures)")
                          : t("cms.recruitmentDisabled", "Désactivé (Bloque les candidatures)")}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#16A34A", marginTop: "2px" }}>
                        {t("cms.recruitmentActiveSub", "Les soumissions de CV sont transmises au vivier de talents")}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Anti-Spam Section */}
              <div
                className="p-6 mb-6" style={{background:"#FFF",border:"1px solid #E2E8F0",borderRadius:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.02)"}}
              >
                <div className="flex items-center gap-2" style={{marginBottom:"0.4rem"}}>
                  <span style={{ fontSize: "1rem" }}>🛑</span>
                  <h3 className="font-bold text-[var(--text-main)]" style={{fontSize:"0.95rem"}}>
                    {t("cms.antiSpamTitle", "Adresses Email bloquées (Protection Anti-Spam)")}
                  </h3>
                </div>
                <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#64748B" }}>
                  {t("cms.antiSpamSub", "Les adresses répertoriées ici ne peuvent pas soumettre de formulaires de contact ou de candidatures")}
                </p>

                <div style={{ height: "1px", background: "#F1F5F9", marginBottom: "1.25rem" }} />

                <label
                  className="block font-semibold mb-2" style={{fontSize:"0.8rem",color:"#374151"}}
                >
                  {t("cms.addBlacklistLabel", "Ajouter une nouvelle adresse indésirable :")}
                </label>
                <div className="flex" style={{gap:"0.75rem",marginBottom:"1.25rem"}}>
                  <input
                    type="email"
                    placeholder="spam@example.com"
                    value={newBlacklistEmail}
                    onChange={(e) => setNewBlacklistEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newBlacklistEmail) {
                        e.preventDefault();
                        setFormSettings({
                          ...formSettings,
                          blacklistedEmails: [...(formSettings.blacklistedEmails || []), newBlacklistEmail],
                        });
                        setNewBlacklistEmail("");
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "0.65rem 1rem",
                      borderRadius: "8px",
                      border: "1.5px solid #3B82F6",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBlacklistEmail) {
                        setFormSettings({
                          ...formSettings,
                          blacklistedEmails: [...(formSettings.blacklistedEmails || []), newBlacklistEmail],
                        });
                        setNewBlacklistEmail("");
                      }
                    }}
                    className="text-white font-semibold cursor-pointer" style={{padding:"0.65rem 1.25rem",background:"var(--text-main)",border:"none",borderRadius:"8px",fontSize:"0.875rem",whiteSpace:"nowrap"}}
                  >
                    {t("cms.addBlacklistBtn", "+ Ajouter")}
                  </button>
                </div>

                <div className="font-semibold mb-2" style={{fontSize:"0.8rem",color:"#374151"}}>
                  {t("cms.blockedCount", { count: formSettings.blacklistedEmails?.length || 0, defaultValue: `Adresses actuellement bloquées (${formSettings.blacklistedEmails?.length || 0} active(s)) :` })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formSettings.blacklistedEmails?.length === 0 || !formSettings.blacklistedEmails) && (
                    <span style={{ color: "#94A3B8", fontSize: "0.82rem" }}>{t("cms.noBlockedEmail", "Aucun email bloqué.")}</span>
                  )}
                  {formSettings.blacklistedEmails?.map((email) => (
                    <div
                      key={email}
                      className="inline-flex items-center gap-2 font-medium" style={{background:"#FEE2E2",color:"#DC2626",padding:"0.3rem 0.8rem",borderRadius:"20px",fontSize:"0.82rem"}}
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() =>
                          setFormSettings({
                            ...formSettings,
                            blacklistedEmails: formSettings.blacklistedEmails.filter((e) => e !== email),
                          })
                        }
                        className="cursor-pointer" style={{background:"none",border:"none",color:"#DC2626",lineHeight:1,fontSize:"0.85rem"}}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex justify-between items-center flex-wrap gap-4"
              >
                <span style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  {t("cms.settingsNotice", "Toute modification des formulaires prend effet immédiatement sur le site public.")}
                </span>
                <button
                  type="button"
                  onClick={saveFormSettings}
                  className="text-white font-semibold cursor-pointer" style={{padding:"0.65rem 1.5rem",background:"var(--text-main)",border:"none",borderRadius:"8px",fontSize:"0.88rem"}}
                >
                  {t("cms.saveSettingsBtn", "Enregistrer les paramètres")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: MODIFIER / CRÉER PUBLICATION (IMAGE 5)                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showModal && (
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
                      className="font-bold text-[var(--text-main)] mb-2" style={{fontSize:"1rem",lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}
                    >
                      {(previewLang === "EN" ? title_en : title) || "Illum maxime Nam ad"}
                    </div>
                    <div
                      className="mb-4" style={{fontSize:"0.78rem",color:"#64748B",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}
                    >
                      {(() => {
                        const raw = (previewLang === "EN" ? contentHtml_en : contentHtml) || "";
                        const plain = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
                        return plain || "Voluptatem enim bla";
                      })()}
                    </div>
                    <div
                      className="inline-flex items-center font-bold cursor-pointer" style={{gap:"0.35rem",color:"#2563EB",fontSize:"0.75rem",letterSpacing:"0.05em"}}
                    >
                      LIRE L'ARTICLE →
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
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type || "warning"}
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Save Options Modal */}
      {saveOptionsModal.isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div className="w-full" style={{background:"#FFF",borderRadius:"16px",maxWidth:"400px",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)",overflow:"hidden",animation:"slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"}}>
            <div className="flex justify-between items-center" style={{padding:"1.5rem 1.5rem 1rem",borderBottom:"1px solid #F1F5F9"}}>
              <h3 className="font-semibold flex items-center gap-2" style={{fontSize:"1.1rem",color:"#1E293B"}}>
                <Check size={20} color="#10B981" />
                Options d'enregistrement
              </h3>
              <button
                onClick={() => setSaveOptionsModal({ isOpen: false, isPreview: false })}
                className="cursor-pointer" style={{background:"none",border:"none",color:"#94A3B8",padding:"0.25rem"}}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p style={{ margin: "0 0 1.5rem", color: "#475569", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Souhaitez-vous enregistrer cet article en tant que brouillon pour y revenir plus tard, ou le publier immédiatement sur le site public ?
              </p>
              <div className="flex flex-col" style={{gap:"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => {
                    setSaveOptionsModal({ isOpen: false, isPreview: false });
                    handleSaveAction("BROUILLON", saveOptionsModal.isPreview);
                  }}
                  className="font-semibold cursor-pointer flex items-center justify-center gap-2" style={{background:"#F8FAFC",border:"1px solid #CBD5E1",borderRadius:"8px",padding:"0.85rem",fontSize:"0.95rem",color:"#334155",transition:"all 0.2s"}}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#94A3B8"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                >
                  <FileText size={18} />
                  Enregistrer en brouillon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaveOptionsModal({ isOpen: false, isPreview: false });
                    handleSaveAction("PUBLIE", saveOptionsModal.isPreview);
                  }}
                  className="font-semibold text-white cursor-pointer flex items-center justify-center gap-2" style={{background:"#10B981",border:"none",borderRadius:"8px",padding:"0.85rem",fontSize:"0.95rem",transition:"all 0.2s"}}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#059669"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "#10B981"; }}
                >
                  <Globe size={18} />
                  Publier sur le site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const fieldLabelStyle = {
  display: "block",
  marginBottom: "0.45rem",
  fontWeight: 600,
  fontSize: "0.82rem",
  color: "#374151",
};

const textInputStyle = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  fontSize: "0.875rem",
  outline: "none",
  color: "var(--text-main)",
  boxSizing: "border-box",
};

const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  background: "#F1F5F9",
  border: "1px solid #CBD5E1",
  borderBottom: "none",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  padding: "0.35rem 0.5rem",
};

const toolbarBtnStyle = {
  background: "#FFF",
  border: "1px solid #E2E8F0",
  borderRadius: "4px",
  padding: "0.2rem 0.5rem",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#334155",
  cursor: "pointer",
  lineHeight: 1.2,
};

const toolbarDividerStyle = {
  width: "1px",
  height: "16px",
  background: "#CBD5E1",
  margin: "0 0.25rem",
};

const sectionIconBtnStyle = {
  background: "#FFF",
  border: "1px solid #E2E8F0",
  borderRadius: "4px",
  cursor: "pointer",
  padding: "0.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748B",
};

export default CMSPage;
