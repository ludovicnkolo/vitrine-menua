"use client";
import { useLanguage } from "@/components/LanguageProvider";

export default function Loading() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f5f7fa]">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning premium ring */}
        <div className="absolute w-20 h-20 border-2 border-transparent border-t-[#141824] border-r-[#141824] rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
        
        {/* Inner reverse spinning ring */}
        <div className="absolute w-14 h-14 border-2 border-transparent border-b-[#3874ff] border-l-[#3874ff] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        
        {/* Inner pulsating core */}
        <div className="w-4 h-4 bg-[#141824] rounded-full animate-pulse"></div>
      </div>
      
      {/* Premium typography loader text */}
      <div className="mt-10 overflow-hidden">
        <p className="text-[#141824] text-xs tracking-[0.3em] font-bold uppercase animate-pulse">
          {t("Chargement", "Loading")}
        </p>
      </div>
    </div>
  );
}
