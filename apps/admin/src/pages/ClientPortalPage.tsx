import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Check,
  PenLine,
  Zap,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  LogOut,
  Inbox,
  Send,
  Menu,
} from "lucide-react";
import { getSafeApiUrl, formatDate } from "../utils/helpers";
import { User } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

interface ClientPortalPageProps {
  user: User;
}

interface DocumentItem {
  id: string;
  name: string;
  fileSize?: string;
  dateStr?: string;
  status: "VALIDE" | "EN_ATTENTE" | "A_CORRIGER" | "TRAITE" | string;
  category?: "RESTITUTION" | "DEPOT_CLIENT" | string;
  url?: string;
  note?: string;
  badges?: { text: string; variant: "blue" | "gray" | "green" | "amber" }[];
}

export default function ClientPortalPage({ user }: ClientPortalPageProps) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);

  // Barre latérale mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Menu déroulant du profil
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Modal de correction
  const [correctionModalDoc, setCorrectionModalDoc] = useState<DocumentItem | null>(null);
  const [correctionFeedback, setCorrectionFeedback] = useState("");

  // État barre latérale active (Documents reçus vs Documents transmis)
  const [activeTab, setActiveTab] = useState<"RECUS" | "TRANSMIS">("RECUS");

  // État de téléversement (Action Requise ou Envoi Direct)
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Documents réels issus de la base de données
  const [receivedDocs, setReceivedDocs] = useState<DocumentItem[]>([]);
  const [transmittedDocs, setTransmittedDocs] = useState<DocumentItem[]>([]);

  // Demande de document active initiée par le CRM (null si aucune demande)
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    title: string;
    motif: string;
    isCompleted: boolean;
  } | null>(null);

  const fetchClientData = () => {
    setLoading(true);
    const token =
      sessionStorage.getItem("adminToken") ||
      localStorage.getItem("adminToken") ||
      "";

    const targetUrl = user.clientId
      ? getSafeApiUrl(`/api/crm/clients/${user.clientId}`)
      : getSafeApiUrl(`/api/crm/clients/me`);

    fetch(targetUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok && user.clientId) {
          return fetch(getSafeApiUrl(`/api/crm/clients/me`), {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json());
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.error) return;
        setClientData(data);

        // Parser tous les documents réels rattachés au client
        const realReceived: DocumentItem[] = [];
        const realTransmitted: DocumentItem[] = [];
        let foundActiveDemand: any = null;

        if (data?.dossiers && Array.isArray(data.dossiers)) {
          data.dossiers.forEach((d: any) => {
            const folderName = String(d.name || "").toLowerCase();
            const isEntrantFolder = folderName.includes("entrant");

            if (d.documents && Array.isArray(d.documents)) {
              d.documents.forEach((doc: any) => {
                // Détection de demande active initiée par le CRM
                if (doc.category === "DEMANDE" && doc.status === "ACTION_REQUISE") {
                  if (!foundActiveDemand) {
                    foundActiveDemand = {
                      id: doc.id,
                      title: doc.name.startsWith("Demande")
                        ? doc.name
                        : `Demande de document : ${doc.name}`,
                      motif:
                        doc.note ||
                        "Veuillez inclure les pièces justificatives demandées par votre conseiller.",
                      isCompleted: false,
                    };
                  }
                  return;
                }

                // Ignorer les demandes archivées/traitées pour la liste de fichiers
                if (doc.category === "DEMANDE") return;

                const isDepot =
                  doc.category === "DEPOT_CLIENT" || isEntrantFolder;

                const item: DocumentItem = {
                  id: doc.id,
                  name: doc.name,
                  fileSize: doc.fileSize || "1.5 Mo",
                  dateStr: isDepot
                    ? `Envoyé le ${formatDate(doc.createdAt)}`
                    : formatDate(doc.createdAt),
                  status: doc.status || (isDepot ? "EN_COURS" : "EN_ATTENTE"),
                  category: doc.category,
                  url: doc.url,
                  note: doc.note,
                };

                if (isDepot) {
                  item.badges =
                    doc.status === "VALIDE"
                      ? [{ text: "Traité ✓", variant: "green" }]
                      : [
                          { text: "Reçu par Menua", variant: "blue" },
                          { text: "En cours de revue", variant: "gray" },
                        ];
                  realTransmitted.push(item);
                } else {
                  realReceived.push(item);
                }
              });
            }
          });
        }

        setReceivedDocs(realReceived);
        setTransmittedDocs(realTransmitted);
        setActiveRequest(foundActiveDemand);
      })
      .catch((err) => console.error("Erreur chargement client:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientData();
  }, [user.clientId]);

  // Dossier principal (racine du client : parentDossierId === null)
  const primaryDossier =
    clientData?.dossiers?.find((d: any) => !d.parentDossierId) ||
    clientData?.dossiers?.[0] ||
    null;
  const primaryDossierRef = primaryDossier?.reference || "DOS-01";

  // Nom d'affichage & initiales
  const rawDisplayName =
    clientData?.entreprise?.raisonSociale || clientData?.name || user.name || "Ea";
  const greetingName = rawDisplayName.split(" ")[0];
  const avatarInitials =
    rawDisplayName
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EA";

  // Actions sur documents
  const handleValidateDoc = async (doc: DocumentItem) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      if (doc.url) {
        await fetch(getSafeApiUrl(`/api/crm/documents/${doc.id}`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "VALIDE" }),
        }).catch(() => {});
      }

      setReceivedDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: "VALIDE" } : d))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCorrection = (doc: DocumentItem) => {
    setCorrectionModalDoc(doc);
    setCorrectionFeedback("");
  };

  const handleSubmitCorrection = async () => {
    if (!correctionModalDoc) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      if (correctionModalDoc.url) {
        await fetch(getSafeApiUrl(`/api/crm/documents/${correctionModalDoc.id}`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "A_CORRIGER",
            note: correctionFeedback.trim(),
          }),
        }).catch(() => {});
      }

      setReceivedDocs((prev) =>
        prev.map((d) =>
          d.id === correctionModalDoc.id
            ? { ...d, status: "A_CORRIGER", note: correctionFeedback.trim() }
            : d
        )
      );
      setCorrectionModalDoc(null);
      setCorrectionFeedback("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    const token = sessionStorage.getItem("adminToken");
    if (doc.url) {
      const url = getSafeApiUrl(
        `/api/files/view/${doc.url}?token=${encodeURIComponent(token || "")}&stream=true`
      );
      window.open(url, "_blank");
    } else {
      const blob = new Blob([`Contenu du document : ${doc.name}`], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = doc.name;
      link.click();
    }
  };

  // Gestion du glisser-déposer
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      setUploadFiles((prev) => [...prev, ...dropped]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setUploadFiles((prev) => [...prev, ...selected]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const token = sessionStorage.getItem("adminToken");
      const targetDossierId = primaryDossier?.id;

      if (targetDossierId) {
        for (const file of uploadFiles) {
          const formData = new FormData();
          formData.append("bucket", "ged");
          formData.append("dossierId", targetDossierId);
          if (activeRequest?.id) {
            formData.append("demandId", activeRequest.id);
          }
          formData.append("file", file);
          formData.append("name", file.name);
          formData.append("status", "EN_ATTENTE");
          formData.append("category", "DEPOT_CLIENT");
          formData.append(
            "note",
            activeRequest
              ? `Réponse à la demande : ${activeRequest.title}`
              : "Pièce justificative transmise par le client"
          );

          await fetch(getSafeApiUrl("/api/files/upload-and-attach"), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
      }

      // Ajouter aux documents transmis dans l'interface
      const newItems: DocumentItem[] = uploadFiles.map((file, idx) => ({
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} Mo`,
        dateStr: `Envoyé le ${new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`,
        status: "EN_COURS",
        category: "DEPOT_CLIENT",
        badges: [
          { text: "Reçu par Menua", variant: "blue" },
          { text: "En cours de revue", variant: "gray" },
        ],
      }));

      setTransmittedDocs((prev) => [...newItems, ...prev]);

      // IMMÉDIAT : L'espace d'upload disparaît tout de suite après l'envoi réussi
      setActiveRequest(null);
      setUploadSuccess(true);
      setUploadFiles([]);
      setTimeout(() => setUploadSuccess(false), 5000);

      // Re-synchronisation base de données
      fetchClientData();
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Erreur lors de la transmission du document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#1A365D] selection:text-white">
      {/* Overlay pour affichage mobile de la barre latérale */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* BARRE LATÉRALE GAUCHE : IDENTIQUE CRM, COMPLÈTEMENT CLIQUABLE         */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#141824] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Sidebar : Logo MENUA CONSULTING */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path d="M4 23L12 5L18 17L12 27L4 23Z" fill="#a38b6d" />
                <path d="M28 23L20 5L14 17L20 27L28 23Z" fill="#D4AF37" />
                <path d="M16 13L20 5L12 5L16 13Z" fill="#e8c766" />
              </svg>
              <div>
                <span className="font-extrabold text-white tracking-tight text-sm block leading-tight">
                  MENUA
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Espace Client
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation latérale : Documents reçus & Documents transmis */}
          <div className="p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Espace documentaire
            </div>
            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("RECUS");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "RECUS"
                    ? "bg-[#1A365D] text-white shadow-sm border border-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox
                    size={17}
                    className={activeTab === "RECUS" ? "text-amber-400" : "text-slate-400"}
                  />
                  <span>Documents reçus</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === "RECUS"
                      ? "bg-amber-400 text-slate-900"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {receivedDocs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("TRANSMIS");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "TRANSMIS"
                    ? "bg-[#1A365D] text-white shadow-sm border border-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send
                    size={17}
                    className={activeTab === "TRANSMIS" ? "text-amber-400" : "text-slate-400"}
                  />
                  <span>Documents transmis</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === "TRANSMIS"
                      ? "bg-amber-400 text-slate-900"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {transmittedDocs.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer Sidebar : Compte client & Déconnexion */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
              {avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate m-0">
                {rawDisplayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate m-0">
                Dossier : {primaryDossierRef}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 flex items-center justify-center gap-2 transition cursor-pointer border border-rose-500/20"
          >
            <LogOut size={13} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ZONE CENTRALE : HEADER SUPÉRIEUR + CONTENU DYNAMIQUE                  */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* HEADER DÉDIÉ : TITRE NAVIGATION • CLOCHE NOTIFICATIONS • PROFIL (SANS ICÔNE MESSAGE) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
          {/* Gauche : Bouton menu mobile + Titre de section */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              title="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base m-0 tracking-tight">
                {activeTab === "RECUS" ? "Documents reçus" : "Documents transmis"}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {activeTab === "RECUS" ? receivedDocs.length : transmittedDocs.length}
              </span>
            </div>
          </div>

          {/* Droite : NotificationBell (temps réel CRM) + Profil EA (Icône message supprimée) */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Cloche officielle des notifications */}
            <NotificationBell />

            {/* Bouton Profil avec EA */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <UserIcon size={16} className="text-slate-600" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Profil
                </span>
                <div className="w-7 h-7 rounded-full bg-[#f1ebe5] text-slate-800 text-xs font-bold flex items-center justify-center ml-1">
                  {avatarInitials}
                </div>
              </button>

              {/* Dropdown Menu Profil */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-3 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-900 m-0 truncate">
                      {rawDisplayName}
                    </p>
                    <p className="text-xs text-slate-500 m-0 mt-0.5 truncate">
                      {user.email || "client@menuaconsulting.com"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        Compte Client Actif
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 text-xs text-slate-500 border-b border-slate-100">
                    <span>Dossier de rattachement : </span>
                    <span className="font-bold text-slate-700">{primaryDossierRef}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CORPS PRINCIPAL : ACCUEIL + ACTION REQUISE + TABLEAU DES DOCUMENTS   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <main className="max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6 flex-1">
          {/* ── ACCUEIL / GREETING ── */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">
              Bonjour {greetingName},
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 mb-0">
              Retrouvez vos documents officiels, vos validations en attente et vos envois.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* SECTION ACTION REQUISE (DISPARAÎT IMMÉDIATEMENT APRÈS LE DÉPÔT)    */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeRequest && !activeRequest.isCompleted && (
            <section className="space-y-2.5 animate-in fade-in duration-200">
              <div className="text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                ACTION REQUISE
              </div>

              <div className="bg-gradient-to-br from-[#faf7f2] via-[#f7f2ea] to-[#f2eae0] border border-[#e8ded1] rounded-2xl p-6 sm:p-7 shadow-xs">
                {/* Pill jaune/ambre */}
                <div className="inline-flex items-center gap-1.5 bg-[#fef3c7]/90 text-[#92400e] border border-[#fde68a] px-3 py-1 rounded-full text-xs font-semibold shadow-2xs">
                  <Zap size={13} className="fill-[#b45309] text-[#b45309]" />
                  <span>ACTION REQUISE : Demande de document en cours</span>
                </div>

                {/* Titre et motif */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-1">
                  {activeRequest.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 mb-5">
                  <span className="font-bold">Motif :</span> {activeRequest.motif}
                </p>

                {/* Zone Drag & Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col sm:flex-row items-center justify-center gap-3 ${
                    isDragging
                      ? "border-[#b89e80] bg-white/90"
                      : "border-[#d8c8b4] hover:border-[#b89e80] bg-white/60 hover:bg-white/80"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* Icône Document avec flèche upload */}
                  <div className="text-slate-600 shrink-0">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="12" y2="12" />
                      <line x1="15" y1="15" x2="12" y2="12" />
                    </svg>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700">
                    <span>Glissez-déposer le document demandé ici ou </span>
                    <span className="text-[#1A365D] font-bold hover:underline cursor-pointer">
                      [ Déposer la pièce ]
                    </span>
                  </div>
                </div>

                {/* Fichiers sélectionnés en attente d'envoi */}
                {uploadFiles.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-[#e8ded1] space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      Fichier(s) prêt(s) à être transmis :
                    </div>
                    <div className="space-y-2">
                      {uploadFiles.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={14} className="text-slate-500 shrink-0" />
                            <span className="font-semibold truncate">{file.name}</span>
                            <span className="text-slate-400">
                              ({(file.size / (1024 * 1024)).toFixed(1)} Mo)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                            title="Retirer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleUploadSubmit}
                      disabled={isUploading}
                      className="w-full py-2.5 bg-[#1A365D] hover:bg-[#142a47] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUploading && <Loader2 size={15} className="animate-spin" />}
                      {isUploading ? "Transmission en cours..." : "Transmettre le document à MENUA"}
                    </button>
                  </div>
                )}

                {/* Bannière d'erreur */}
                {uploadError && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="text-red-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bannière de confirmation d'envoi réussi */}
          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold m-0">Document transmis avec succès !</p>
                <p className="text-xs text-emerald-700 m-0 mt-0.5">
                  Votre document a été rattaché à votre dossier et une notification a été envoyée à l'équipe MENUA.
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* PAN PRINCIPAL : DOCUMENTS (CORRESPONDANT À L'ONGLET DE LA SIDEBAR)   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Header du tableau */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  {activeTab === "RECUS" ? "Documents reçus de MENUA" : "Documents transmis par vos soins"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                  {activeTab === "RECUS" ? receivedDocs.length : transmittedDocs.length}
                </span>
              </div>
            </div>

            {/* Contenu : Documents reçus */}
            {activeTab === "RECUS" && (
              <div className="divide-y divide-slate-100">
                {receivedDocs.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400">
                    Aucun document reçu de MENUA pour le moment.
                  </div>
                ) : (
                  receivedDocs.map((doc) => {
                    const isEnAttente =
                      doc.status === "EN_ATTENTE" || doc.status === "En attente";
                    const isValide = doc.status === "VALIDE" || doc.status === "Validé";
                    const isACorriger =
                      doc.status === "A_CORRIGER" || doc.status === "À corriger";

                    return (
                      <div
                        key={doc.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                      >
                        {/* Partie gauche : Icône fichier, Nom, Taille, Date, Statut */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <FileText
                            className="w-5 h-5 text-slate-700 shrink-0"
                            strokeWidth={1.8}
                          />

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {doc.name}
                            </span>

                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {doc.fileSize} • {doc.dateStr}
                            </span>

                            {/* Statut Badge */}
                            {isEnAttente && (
                              <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2.5 py-0.5 rounded-md text-xs font-medium">
                                En attente
                              </span>
                            )}

                            {isValide && (
                              <span className="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md text-xs font-semibold inline-flex items-center gap-1">
                                Validé <Check size={12} strokeWidth={2.5} />
                              </span>
                            )}

                            {isACorriger && (
                              <span className="bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] px-2.5 py-0.5 rounded-md text-xs font-medium">
                                À corriger
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Partie droite : Boutons d'action */}
                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                          {isEnAttente && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenCorrection(doc)}
                                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                              >
                                <PenLine size={13} className="text-slate-600" />
                                <span>À corriger</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleValidateDoc(doc)}
                                className="bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                              >
                                <Check size={14} strokeWidth={2.5} />
                                <span>Valider</span>
                              </button>
                            </>
                          )}

                          {(isValide || isACorriger) && (
                            <button
                              type="button"
                              onClick={() => handleDownload(doc)}
                              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                            >
                              <Download size={13} className="text-slate-600" />
                              <span>Télécharger</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Contenu : Documents transmis */}
            {activeTab === "TRANSMIS" && (
              <div className="divide-y divide-slate-100">
                {transmittedDocs.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400">
                    Aucun document transmis pour le moment.
                  </div>
                ) : (
                  transmittedDocs.map((doc, idx) => {
                    const isZip =
                      doc.name.toLowerCase().endsWith(".zip") ||
                      doc.name.toLowerCase().endsWith(".rar");

                    return (
                      <div
                        key={doc.id || idx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {isZip ? (
                            <div className="w-5 h-5 rounded border border-slate-400 text-[9px] font-bold text-slate-700 flex items-center justify-center shrink-0">
                              ZIP
                            </div>
                          ) : (
                            <FileText
                              className="w-5 h-5 text-slate-700 shrink-0"
                              strokeWidth={1.8}
                            />
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {doc.name}
                            </span>

                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {doc.fileSize} • {doc.dateStr}
                            </span>

                            {/* Badges statut */}
                            {doc.badges?.map((badge, bIdx) => {
                              let style =
                                "bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]";
                              if (badge.variant === "blue") {
                                style =
                                  "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]";
                              } else if (badge.variant === "green") {
                                style =
                                  "bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]";
                              } else if (badge.variant === "amber") {
                                style =
                                  "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]";
                              }

                              return (
                                <span
                                  key={bIdx}
                                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${style}`}
                                >
                                  {badge.text}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bouton Télécharger la copie */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleDownload(doc)}
                            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                          >
                            <Download size={13} className="text-slate-600" />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* ── FOOTER DISCRET ── */}
          <footer className="text-center pt-4 pb-8 text-xs text-slate-400 font-medium">
            Échanges sécurisés et chiffrés de bout en bout
          </footer>
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : REMARQUE OU CORRECTION DEMANDÉE                            */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {correctionModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 m-0">
                Demande de correction
              </h3>
              <button
                type="button"
                onClick={() => setCorrectionModalDoc(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 m-0">
                Vous signalez un point à modifier sur le document{" "}
                <span className="font-bold text-slate-800">
                  {correctionModalDoc.name}
                </span>
                .
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Remarque ou précision pour MENUA :
                </label>
                <textarea
                  value={correctionFeedback}
                  onChange={(e) => setCorrectionFeedback(e.target.value)}
                  placeholder="Ex: Merci d'ajuster le chiffre d'affaires sur la page 3 conformément aux extraits fournis..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:bg-white resize-none transition"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCorrectionModalDoc(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitCorrection}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1A365D] hover:bg-[#142a47] text-white transition cursor-pointer shadow-xs"
              >
                Transmettre la remarque
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

