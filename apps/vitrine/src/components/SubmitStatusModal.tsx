import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface SubmitStatusModalProps {
  status: { type: "success" | "error"; message: string } | null;
  onClose?: () => void;
}

export default function SubmitStatusModal({ status, onClose }: SubmitStatusModalProps) {
  if (!status) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141824]/30 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-[#fcfbf9] px-6 py-6 flex flex-col items-center justify-center min-w-[240px] max-w-[320px] w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-[#e8e1d7] animate-in zoom-in-95 duration-300 relative">
        
        {/* Close button */}
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-2 right-2 text-[#141824]/60 hover:text-[#141824] p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* Corner Decorative Accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e8e1d7] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e8e1d7] opacity-50"></div>

        {status.type === "success" ? (
          <>
            <div className="relative w-14 h-14 flex items-center justify-center mb-3">
              {/* Golden Circle Border */}
              <div className="absolute inset-0 rounded-full border-2 border-[#cda052] bg-white shadow-[0_0_10px_rgba(205,160,82,0.1)]"></div>
              
              {/* Thick Golden Checkmark */}
              <svg className="w-6 h-6 z-10" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#aa7c11" />
                    <stop offset="100%" stopColor="#8a610c" />
                  </linearGradient>
                </defs>
                <polyline points="20 6 9 17 4 12" />
              </svg>

              {/* Sparkles / Stars */}
              <svg className="absolute -top-3 -left-2 w-3 h-3 text-[#d4af37] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <svg className="absolute top-1 -right-3 w-4 h-4 text-[#d4af37] animate-pulse delay-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            
            <p className="font-bold tracking-widest text-[0.8rem] text-[#141824] uppercase text-center leading-relaxed mb-1">
              Envoi réussi
            </p>
            <p className="text-[0.85rem] text-[#6e7891] text-center font-light leading-snug">
              {status.message}
            </p>
          </>
        ) : (
          <>
            <div className="relative w-14 h-14 flex items-center justify-center mb-3">
              <div className="absolute inset-0 rounded-full border-2 border-red-400 bg-white shadow-[0_0_10px_rgba(248,113,113,0.15)]"></div>
              <AlertCircle className="w-6 h-6 text-red-500 z-10 stroke-[2]" />
            </div>
            <h3 className="text-[#141824] text-[0.8rem] font-bold uppercase tracking-wider mb-1 text-center">Erreur</h3>
            <p className="text-[0.85rem] text-[#6e7891] font-light text-center leading-snug mb-3">{status.message}</p>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-1.5 bg-[#141824] text-white text-[0.75rem] font-bold uppercase tracking-wider hover:bg-[#2b334a] transition-colors"
              >
                Fermer
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
