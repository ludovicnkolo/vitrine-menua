"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="w-full px-6 py-4 md:py-8 mt-auto">
      <div className="max-w-6xl mx-auto bg-[#1B3680] rounded-[1.5rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center border border-white/5">
        
        {/* Background decorative elements */}
        {/* Sweeping lines bottom-left */}
        <div className="absolute bottom-0 left-0 w-[80%] md:w-[50%] h-[150%] opacity-20 pointer-events-none overflow-hidden rounded-bl-[1.5rem]">
           <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform translate-y-[30%] -translate-x-[20%]">
             <path d="M0 400 C150 350, 250 450, 400 250" stroke="#3B82F6" strokeWidth="0.5" />
             <path d="M0 380 C160 330, 260 430, 400 230" stroke="#3B82F6" strokeWidth="0.5" />
             <path d="M0 360 C170 310, 270 410, 400 210" stroke="#3B82F6" strokeWidth="0.5" />
             <path d="M0 340 C180 290, 280 390, 400 190" stroke="#3B82F6" strokeWidth="0.5" />
             <path d="M0 320 C190 270, 290 370, 400 170" stroke="#3B82F6" strokeWidth="0.5" />
             <path d="M0 300 C200 250, 300 350, 400 150" stroke="#3B82F6" strokeWidth="0.5" />
           </svg>
        </div>

        {/* Dots pattern top-right */}
        <div className="absolute top-12 right-12 opacity-30 pointer-events-none hidden md:grid grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-blue-300" />
          ))}
        </div>
        
        {/* Abstract large rings */}
        <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#3B82F6]/10 pointer-events-none hidden md:block" />
        <div className="absolute top-1/2 right-[5%] transform -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-[#3B82F6]/5 pointer-events-none hidden md:block" />

        {/* LEFT COLUMN: Content */}
        <div className="w-full md:w-[55%] p-10 md:p-14 lg:p-20 z-10 relative">
          <p className="text-white/60 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4">
            {t("Prenons contact", "Get in touch")}
          </p>
          <div className="w-10 h-[2px] bg-[#3B82F6] mb-8" />
          
          <h2 className="text-white text-[1.8rem] md:text-[2.2rem] lg:text-[2.6rem] leading-[1.2] font-bold uppercase mb-6 tracking-wide">
            {t("Un projet\nd'externalisation ?\nParlons-en.", "An outsourcing\nproject?\nLet's talk.").split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
          
          <p className="text-[#93A5CE] text-[0.95rem] leading-[1.7] mb-10 max-w-md font-normal">
            {t(
              "Nos équipes analysent votre besoin et vous proposent un dispositif adapté à vos contraintes opérationnelles et réglementaires.",
              "Our teams analyze your needs and offer a solution tailored to your operational and regulatory constraints."
            )}
          </p>
          
          <Link
            href="/nous-contacter"
            className="inline-flex items-center gap-3 bg-white text-[#1B3680] hover:bg-gray-100 px-8 py-3.5 text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-all duration-300"
          >
            {t("Nous contacter", "Contact us")} <ArrowRight size={16} />
          </Link>
        </div>

        {/* RIGHT COLUMN: Chat Bubbles Graphic */}
        <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-[450px] flex items-center justify-center p-8 z-10">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-20">
              <defs>
                <linearGradient id="frontBubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B3B82" />
                  <stop offset="100%" stopColor="#0B1A42" />
                </linearGradient>
              </defs>

              {/* Back bubble */}
              <path d="M220,130 C310,130 380,180 380,240 C380,265 365,288 340,305 L360,350 L310,335 C280,345 250,350 220,350 C130,350 60,300 60,240 C60,210 75,185 100,165" fill="#071029" stroke="#1A3477" strokeWidth="3" opacity="0.8"/>
              
              {/* Front bubble */}
              <path d="M160,50 C260,50 340,110 340,190 C340,225 320,255 290,275 L310,330 L250,310 C220,325 190,330 160,330 C60,330 0,270 0,190 C0,110 60,50 160,50 Z" fill="url(#frontBubbleGrad)" />
              
              {/* Inner lines */}
              <rect x="80" y="145" width="160" height="10" rx="5" fill="#2E5BA3" />
              <rect x="80" y="185" width="140" height="10" rx="5" fill="#2E5BA3" />
              <rect x="80" y="225" width="110" height="10" rx="5" fill="#2E5BA3" />
            </svg>
            
          </div>
        </div>
      </div>
    </section>
  );
}
