import React from "react";
import { CheckCircle, Shield, Award, Sparkles, AlertCircle, Phone } from "lucide-react";

interface HeroProps {
  onScrollToPackages: () => void;
  onOpenConsultation: () => void;
}

export default function Hero({ onScrollToPackages, onOpenConsultation }: HeroProps) {
  return (
    <div className="relative">
      {/* Immersive Islamic Brand Hero Section exactly matching the layout */}
      <div className="hero-bg text-white py-24 md:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle pattern background overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-xl md:max-w-2xl text-left space-y-6">
            
            {/* Tagline */}
            <span className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-300 block uppercase font-sans">
              Temukan
            </span>

            {/* Main Heading matched to photo */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              PAKET UMROH TERBAIK
              <span className="block text-xl md:text-2xl font-bold text-slate-200 mt-2 tracking-normal font-sans">
                Bersama Khadijah Travel Indonesia
              </span>
            </h1>

            {/* Description matching photo */}
            <p className="text-sm md:text-base text-slate-200 border-l-2 border-[#d5a81e] pl-4 font-light leading-relaxed max-w-lg">
              Perjalanan ibadah yang nyaman, aman dan penuh berkah
            </p>

            {/* Buttons matching photo */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToPackages}
                className="bg-[#0f5132] hover:bg-[#0c4027] text-white font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md cursor-pointer shadow-md transition-all hover:scale-[1.01] font-sans"
              >
                Lihat Paket
              </button>
              <button
                onClick={onOpenConsultation}
                className="bg-zinc-900/55 hover:bg-zinc-900/70 text-white font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md cursor-pointer border border-slate-200/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] font-sans"
              >
                {/* Custom WhatsApp Green SVG Icon */}
                <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.45 5.3 0 9.6-4.3 9.6-9.6s-4.3-9.6-9.6-9.6C5.9 1.4 1.6 5.7 1.6 11c0 1.9.5 3.7 1.5 5.2l-.94 3.44 3.487-.914z" />
                </svg>
                <span>Konsultasi Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Feature Badges Grid exactly matching Page 2 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200/60 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Badge 1 */}
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20 flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-sm leading-tight">Izin Resmi</h3>
              <p className="text-xs text-slate-500 font-medium">PPIU No.1234/2021</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-sm leading-tight">Pembimbing</h3>
              <p className="text-xs text-slate-500 font-medium">Berpengalaman</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20 flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-sm leading-tight">Pelayanan Terbaik</h3>
              <p className="text-xs text-slate-500 font-medium">24 Jam</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20 flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-sm leading-tight">Harga Terbaik</h3>
              <p className="text-xs text-slate-500 font-medium">& Transparan</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
