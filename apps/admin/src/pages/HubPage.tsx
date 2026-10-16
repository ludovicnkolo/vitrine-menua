import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Briefcase, FileText, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export default function HubPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans text-slate-800">
      {/* ── EN-TÊTE ── */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <svg
            width="34"
            height="34"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
            aria-label="Logo MENUA CONSULTING"
          >
            <path d="M4 23L12 5L18 17L12 27L4 23Z" fill="#a38b6d" />
            <path d="M28 23L20 5L14 17L20 27L28 23Z" fill="#D4AF37" />
            <path d="M16 13L20 5L12 5L16 13Z" fill="#e8c766" />
          </svg>
          <div>
            <span className="font-extrabold text-[#1A365D] tracking-tight text-lg sm:text-xl block leading-none">
              MENUA CONSULTING
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5 block">
              Cabinet d'Expertise & Conseil
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm text-xs text-slate-600 font-medium">
          <Lock size={13} className="text-emerald-600" />
          <span>Accès Sécurisé SSL 256-bit</span>
        </div>
      </header>

      {/* ── ZONE CENTRALE : HUB DE SÉLECTION ── */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-xs">
            <ShieldCheck size={14} /> Portail Unifié de Connexion
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Bienvenue sur votre espace digital
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Veuillez sélectionner votre profil pour accéder à vos services et outils de gestion dédiés.
          </p>
        </div>

        {/* ── GRILLE DES 2 CARTES DE CHOIX ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {/* CARTE 1 : ESPACE CLIENT */}
          <div className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-[#D4AF37] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#e8c766] rounded-t-2xl"></div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform duration-300">
                  <FileText size={24} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Clients & Partenaires
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors">
                Espace Client
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Consultez vos dossiers, déposez vos pièces comptables et suivez l'avancement de vos demandes en temps réel et en toute confidentialité.
              </p>

              <ul className="space-y-2 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Dépôt et téléchargement de documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Suivi direct des restitutions et livrables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Échanges simplifiés avec votre équipe conseil</span>
                </li>
              </ul>
            </div>

            <Link
              to="/client/login"
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#1A365D] hover:bg-[#2B6CB0] text-white shadow-sm transition-all duration-200 group-hover:bg-[#1A365D]"
            >
              <span>Accéder à l'Espace Client</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* CARTE 2 : ÉQUIPE & COLLABORATEURS */}
          <div className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1A365D] to-blue-600 rounded-t-2xl"></div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase size={24} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Équipe Cabinet
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                Équipe & Collaborateurs
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Accédez à la tour de contrôle du cabinet, à la production des dossiers clients, à la messagerie centralisée et aux outils de gestion opérationnelle.
              </p>

              <ul className="space-y-2 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Tour de contrôle & météo opérationnelle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Traitement des dossiers et gestion des tâches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Administration globale et GED interne</span>
                </li>
              </ul>
            </div>

            <Link
              to="/app/login"
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
            >
              <span>Connexion Collaborateur</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── PIED DE PAGE ── */}
      <footer className="max-w-5xl w-full mx-auto text-center py-4 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} MENUA CONSULTING. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          <span>Plateforme hautement sécurisée</span>
          <span>•</span>
          <span>Confidentialité garantie</span>
        </p>
      </footer>
    </div>
  );
}
