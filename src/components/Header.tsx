import React from "react";
import { Phone, Compass, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import CompanyLogo from "./CompanyLogo";

interface HeaderProps {
  onNavClick: (view: string) => void;
  activeView: string;
  onOpenConsultation: () => void;
  onOpenTrackingSearch: () => void;
}

export default function Header({
  onNavClick,
  activeView,
  onOpenConsultation,
  onOpenTrackingSearch,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 text-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => onNavClick("public")} 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-90"
          >
            <CompanyLogo variant="compact" iconSize="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavClick("public")}
              className={`text-sm font-semibold transition-colors py-2 cursor-pointer ${
                activeView === "public" ? "text-[#0f5132] border-b-2 border-[#0f5132]" : "text-slate-600 hover:text-[#0f5132]"
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => {
                onNavClick("public");
                setTimeout(() => {
                  document.getElementById("paket-pilihan")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-sm font-semibold text-slate-600 hover:text-[#0f5132] transition-colors py-2 cursor-pointer"
            >
              Paket Umroh
            </button>
            <button
              onClick={() => {
                onNavClick("public");
                setTimeout(() => {
                  document.getElementById("promo-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-sm font-semibold text-slate-600 hover:text-[#0f5132] transition-colors py-2 cursor-pointer"
            >
              Promo
            </button>
            <button
              onClick={onOpenTrackingSearch}
              className="text-sm font-semibold text-slate-600 hover:text-[#0f5132] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
            >
              <span>Tracking Order</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
            <button
              onClick={() => {
                onNavClick("public");
                setTimeout(() => {
                  document.getElementById("tentang-kami")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-sm font-semibold text-slate-600 hover:text-[#0f5132] transition-colors py-2 cursor-pointer"
            >
              Tentang Kami
            </button>
            <button
              onClick={onOpenConsultation}
              className="text-sm font-semibold text-slate-600 hover:text-[#0f5132] transition-colors py-2 cursor-pointer"
            >
              Kontak
            </button>
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavClick("login")}
              className="px-4 py-2 text-sm font-semibold text-[#0f5132] hover:text-[#0c4027] hover:bg-slate-50 rounded-lg transition-all"
            >
              Masuk / Login
            </button>
            <button
              onClick={onOpenConsultation}
              className="flex items-center gap-2 bg-[#0f5132] hover:bg-[#0c4027] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md cursor-pointer border border-[#c5a880]/30 transition-all hover:translate-x-0.5"
            >
              <Phone className="w-4 h-4 fill-white text-[#c5a880]" />
              <span>Konsultasi</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => onNavClick("login")}
              className="text-xs font-bold text-[#0f5132] px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#0f5132] hover:text-[#0c4027] p-1 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg py-4 px-4 space-y-3 absolute top-20 left-0 w-full animate-fade-in text-slate-700">
          <button
            onClick={() => {
              onNavClick("public");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md"
          >
            Beranda
          </button>
          <button
            onClick={() => {
              onNavClick("public");
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById("paket-pilihan")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md"
          >
            Paket Umroh
          </button>
          <button
            onClick={() => {
              onNavClick("public");
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById("promo-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md"
          >
            Promo
          </button>
          <button
            onClick={() => {
              onOpenTrackingSearch();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md flex items-center justify-between"
          >
            <span>Tracking Order</span>
            <span className="px-2 py-0.5 bg-slate-50 text-[#0f5132] text-xs rounded-full font-bold border border-slate-200">Cek Status</span>
          </button>
          <button
            onClick={() => {
              onNavClick("public");
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById("tentang-kami")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => {
              onOpenConsultation();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0f5132] rounded-md"
          >
            Kontak / Hubungi Kami
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#0f5132] text-white px-4 py-2.5 rounded-lg text-sm font-bold border border-[#c5a880]/30 hover:bg-[#0c4027]"
            >
              <Phone className="w-4 h-4 fill-white text-[#c5a880]" />
              <span>Konsultasi Sekarang</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
