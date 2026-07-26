import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SubmitStatusModalProps {
  status: { type: "success" | "error"; message: string } | null;
}

export default function SubmitStatusModal({ status }: SubmitStatusModalProps) {
  if (!status) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141824]/20 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-[#fcfbf9] px-4 py-6 flex flex-col items-center justify-center max-w-[200px] w-[85%] shadow-[0_5px_15px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
        
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
              <svg className="absolute bottom-1 -left-3 w-3 h-3 text-[#d4af37] animate-pulse delay-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              
              {/* Little dots */}
              <div className="absolute top-0 left-2 w-0.5 h-0.5 rounded-full bg-[#d4af37]"></div>
              <div className="absolute bottom-2 -right-1 w-1 h-1 rounded-full bg-[#d4af37]"></div>
            </div>
            
            <p className="font-bold tracking-widest text-[0.65rem] text-[#141824] uppercase text-center leading-relaxed">Envoi réussi</p>
          </>
        ) : (
          <>
            <div className="relative w-14 h-14 flex items-center justify-center mb-3">
              <div className="absolute inset-0 rounded-full border-2 border-red-400 bg-white shadow-[0_0_10px_rgba(248,113,113,0.15)]"></div>
              <AlertCircle className="w-6 h-6 text-red-500 z-10 stroke-[2]" />
            </div>
            <h3 className="text-[#141824] text-[0.7rem] font-bold uppercase tracking-wider mb-1 text-center">Erreur</h3>
            <p className="font-bold tracking-widest text-[0.65rem] text-[#6e7891] uppercase text-center leading-relaxed">{status.message}</p>
          </>
        )}
      </div>
    </div>
  );
}
