import React from "react";
import { 
  Compass, User, Calendar, BookOpen, Clock, Check, Plane, Hotel,
  LogOut, Globe, Milestone, ShieldCheck, Save, Download, AlertCircle, FileCheck,
  Menu, X
} from "lucide-react";
import { Booking } from "../types";
import { getTrackingTimeline } from "../data/initialData";
import CompanyLogo from "./CompanyLogo";

interface JamaahDashboardProps {
  currentEmail: string;
  bookings: Booking[];
  onUpdateBookings?: (bks: Booking[]) => void;
  onLogout: () => void;
  onGoToPublic: () => void;
}

export default function JamaahDashboard({
  currentEmail,
  bookings,
  onUpdateBookings,
  onLogout,
  onGoToPublic,
}: JamaahDashboardProps) {
  
  // Find the exact booking associated with this logged-in email.
  const myBooking = bookings.find(
    b => b.userEmail.toLowerCase() === currentEmail.toLowerCase()
  ) || bookings[0]; // fallback safely to Ahmad Fauzi

  const timelineSteps = getTrackingTimeline(myBooking);

  // Sidebar and active tab states
  const [activeTab, setActiveTab3] = React.useState<"dashboard" | "pribadi" | "brosur">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Profile forms fields dynamically initialized from myBooking model
  const [fullName, setFullName] = React.useState(myBooking.userName || "");
  const [phone, setPhone] = React.useState(myBooking.userPhone || "");
  const [nik, setNik] = React.useState(myBooking.userNik || "3171020409850003");
  const [passport, setPassport] = React.useState(myBooking.userPassport || "C7829019");
  const [birthPlace, setBirthPlace] = React.useState(myBooking.userBirthPlace || "Jakarta");
  const [birthDate, setBirthDate] = React.useState(myBooking.userBirthDate || "12 September 1985");
  const [address, setAddress] = React.useState(myBooking.userAddress || "Jl. Mawar Merah No. 45, Duren Sawit, Jakarta Timur");
  const [vaccine, setVaccine] = React.useState(myBooking.userVaccine || "Sudah (Meningitis & Influenza)");
  
  // Checklist states for physical/softcopy verification documents
  const [docPaspor, setDocPaspor] = React.useState(myBooking.userDocPaspor ?? true);
  const [docKtp, setDocKtp] = React.useState(myBooking.userDocKtp ?? true);
  const [docKk, setDocKk] = React.useState(myBooking.userDocKk ?? true);
  const [docFoto, setDocFoto] = React.useState(myBooking.userDocFoto ?? false);

  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Brochure list
  const brochures = [
    {
      id: "b-premium",
      title: "Brosur Paket Umroh Premium & VIP 2026",
      size: "4.8 MB",
      format: "PDF",
      highlights: "Hotel Bintang 5 Mekkah (Swissotel) & Madinah (Pullman)",
      description: "Detail lengkap itinerary perjalanan 12 hari, mutawwif ustadz pembimbing tersertifikasi, ragam menu hidangan Nusantara, dan pembagian porsi kuota bandara."
    },
    {
      id: "b-reguler",
      title: "Katalog Perjalanan Umroh Reguler Syawal 1447 H",
      size: "3.2 MB",
      format: "PDF",
      highlights: "Hotel Bintang 4 Mekkah (Anjum) & Madinah (Al-Ansar)",
      description: "Berisi estimasi jadwal manasik pra-keberangkatan, rincian biaya ziarah opsional ke Thaif dan Goa Hira, serta subsidi potongan harga keluarga."
    },
    {
      id: "b-panduan",
      title: "Buku Saku Doa & Panduan Praktis Manasik",
      size: "2.1 MB",
      format: "PDF",
      highlights: "Edisi Digital Lengkap Transliterasi Arab-Latin",
      description: "Kumpulan doa tawaf, sa'i, wukuf, tahallul, tata cara mengenakan kain ihram yang sah, serta tips menjaga kesehatan stamina selama perjalanan ibadah."
    }
  ];

  // Brochure download states
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = React.useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    if (onUpdateBookings) {
      const updatedBookings = bookings.map((b) => {
        if (b.id === myBooking.id) {
          return {
            ...b,
            userName: fullName,
            userPhone: phone,
            userNik: nik,
            userPassport: passport,
            userBirthPlace: birthPlace,
            userBirthDate: birthDate,
            userAddress: address,
            userVaccine: vaccine,
            userDocPaspor: docPaspor,
            userDocKtp: docKtp,
            userDocKk: docKk,
            userDocFoto: docFoto,
          };
        }
        return b;
      });
      onUpdateBookings(updatedBookings);
    }

    setSaveSuccess(true);
    // Auto clear success toast
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4500);
  };

  const handleTriggerDownload = (brochureId: string, title: string) => {
    setDownloadingId(brochureId);
    setDownloadProgress(0);
    setDownloadSuccessMessage(null);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadSuccessMessage(`Alhamdulillah! Berkas "${title}" berhasil diunduh ke folder Downloads perangkat Anda.`);
          }, 350);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden"
        />
      )}

      {/* Sidebar - matches standard jamaah drawer perfectly (Elegant Light Green Theme) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f5132] text-white/90 flex-shrink-0 flex flex-col justify-between py-6 px-4 border-r border-[#0f5132]/25 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="px-2 flex items-center justify-between">
            <div>
              <CompanyLogo variant="compact" iconSize="sm" theme="dark" />
              <span className="text-[10px] text-emerald-100/50 block uppercase font-bold tracking-wider mt-1.5 pl-1 font-sans">Daftar Jamaah</span>
            </div>
            {/* Close button on mobile sidebar */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-white hover:text-[#c5a880] md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab3("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#0c4027] text-white border-l-4 border-l-[#c5a880]"
                  : "text-white/80 hover:text-white hover:bg-[#0c4027]/50"
              }`}
            >
              <Compass className="w-4 h-4 text-[#c5a880]" />
              <span>Dashboard Saya</span>
            </button>

            <button 
              onClick={() => { setActiveTab3("pribadi"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "pribadi"
                  ? "bg-[#0c4027] text-white border-l-4 border-l-[#c5a880]"
                  : "text-white/80 hover:text-white hover:bg-[#0c4027]/50"
              }`}
            >
              <User className="w-4 h-4 text-[#c5a880]" />
              <span>Data Pribadi</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab3("dashboard");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById("tracking-berkas")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-[#0c4027]/50 transition-all cursor-pointer"
            >
              <Milestone className="w-4 h-4 text-[#c5a880]" />
              <span>Tracking Alur</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab3("brosur");
                setDownloadSuccessMessage(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "brosur"
                  ? "bg-[#0c4027] text-white border-l-4 border-l-[#c5a880]"
                  : "text-white/80 hover:text-white hover:bg-[#0c4027]/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#c5a880]" />
              <span>Download Brosur</span>
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-[#0c4027] space-y-2">
          <button
            onClick={() => { onGoToPublic(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-emerald-100/70 hover:text-white hover:bg-[#0c4027]/50 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#c5a880]" />
            <span>Kunjungi Web Publik</span>
          </button>
          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-300 hover:text-white hover:bg-red-900/45 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Header Panel */}
        <div className="bg-white border-b border-slate-200 py-5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-sans">
          <div className="flex items-center gap-3">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-[#0f5132] hover:text-[#0c4027] md:hidden cursor-pointer flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold uppercase bg-[#0f5132]/10 text-[#0f5132] border border-[#0f5132]/20 px-3 py-1 rounded">
              Member Area
            </span>
            <h1 className="text-sm font-bold text-slate-850 hidden sm:block">
              Halaman Panduan Jamaah Umruhnologi
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 block">{fullName}</span>
              <span className="text-[10px] text-slate-400 block">{myBooking.userEmail}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0f5132]/10 border border-[#0f5132]/20 flex items-center justify-center font-bold text-[#0f5132] shadow-xs">
              {fullName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Dynamic section indicator and views */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 font-sans">
          
          {/* TAB 1: DASHBOARD Saya */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Section Indicator */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-white text-[#0f5132] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded shadow-xs border border-slate-200">
                    DASHBOARD JAMAAH (USER)
                  </span>
                  <p className="text-xs text-slate-500 font-medium mt-1">Status kelengkapan visa, tiket pesawat, dan jadwal akomodasi resmi Anda.</p>
                </div>
              </div>

              {/* Welcome Banner Box */}
              <div className="bg-white text-slate-800 rounded-2xl overflow-hidden p-6 sm:p-8 relative shadow-md border border-slate-200">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 bg-[radial-gradient(#c5a880_1.5px,transparent_1.5px)] [background-size:16px_16px] hidden sm:block" />
                <div className="absolute right-10 top-6 bottom-6 w-52 opacity-15 bg-cover bg-center rounded-xl bg-[url('https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=400&auto=format&fit=crop')] hidden sm:block" />
                
                <div className="space-y-3 relative z-10 max-w-lg font-sans">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f5132] tracking-tight">
                    Selamat Datang, {fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    Semoga perjalanan ibadah Anda lancar, diberikan kesehatan wal'afiat, dan mendapatkan pahala serta derajat Umroh yang mabrur. Aamiin ya Rabbal Alamin.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0f5132]" />
                    <span className="text-[10px] sm:text-xs font-bold text-[#0f5132]">Pendaftaran Terverifikasi Resmi Sistem Kemenag</span>
                  </div>
                </div>
              </div>

              {/* Core Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Card 1: Paket Saya */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Paket Saya</span>
                  <strong className="text-base sm:text-lg font-black text-[#0f5132] block truncate">{myBooking.packageName}</strong>
                  <span className="text-[9px] text-[#0f5132] font-bold block bg-[#0f5132]/10 px-2 py-0.5 rounded border border-[#0f5132]/20 w-max">Fasilitas Lengkap</span>
                </div>

                {/* Card 2: Tanggal Berangkat */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Tanggal Berangkat</span>
                  <strong className="text-base sm:text-lg font-black text-[#0f5132] block">{myBooking.travelDate}</strong>
                  <span className="text-[9px] text-slate-500 font-medium block">Kloter Utama</span>
                </div>

                {/* Card 3: Status */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Status</span>
                  <div className="block pt-1">
                    {myBooking.status === "Verifikasi" && (
                      <span className="px-3 py-1 bg-emerald-50 text-[#0f5132] border border-emerald-200 rounded-full font-bold text-xs font-sans">
                        Verifikasi
                      </span>
                    )}
                    {myBooking.status === "Pending" && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-xs font-sans">
                        Pending
                      </span>
                    )}
                    {myBooking.status === "Proses" && (
                      <span className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-full font-bold text-xs font-sans">
                        Proses
                      </span>
                    )}
                    {myBooking.status === "Selesai" && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-full font-bold text-xs font-sans">
                        Selesai
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium block pt-1">Berkas valid</span>
                </div>

                {/* Card 4: Kode Booking */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Kode Booking</span>
                  <strong className="text-base sm:text-lg font-mono font-black text-[#0f5132] block">{myBooking.bookingCode}</strong>
                  <span className="text-[9px] text-slate-500 font-medium block">Gunakan saat cek manual</span>
                </div>

              </div>

              {/* Informasi Perjalanan */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
                <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase border-b pb-2 border-slate-100">
                  Informasi Perjalanan
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  
                  {/* Maskapai Block */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Maskapai</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Plane className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.maskapai}</span>
                    </div>
                  </div>

                  {/* Hotel Makkah Block */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hotel Makkah</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Hotel className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.hotelMakkah}</span>
                    </div>
                  </div>

                  {/* Hotel Madinah Block */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hotel Madinah</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Hotel className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.hotelMadinah}</span>
                    </div>
                  </div>

                  {/* Durasi Block */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Durasi</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Clock className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span>{myBooking.duration} Hari Perjalanan</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive Timeline progress under user view */}
              <div id="tracking-berkas" className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase">
                      Progress Tracking Keberangkatan Anda
                    </h3>
                    <p className="text-[10px] text-[#0f5132] font-bold">Dipantau real-time oleh tim mutawwif dan admin Khadijah Travel.</p>
                  </div>
                  <span className="text-xs font-bold text-[#0f5132] bg-[#0f5132]/10 px-2.5 py-1 rounded border border-[#0f5132]/20">
                    Langkah {myBooking.trackingStep} dari 5 Selesai
                  </span>
                </div>

                <div className="relative border-l-2 border-slate-200 ml-5 pl-8 space-y-8 py-2">
                  {timelineSteps.map((timeline) => (
                    <div key={timeline.step} className="relative">
                      
                      {/* Circle check badge */}
                      <div className={`absolute left-[-42px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        timeline.isCompleted
                          ? "bg-[#0f5132] text-white border-[#0f5132]/80 scale-110 shadow-xs"
                          : "bg-white text-slate-400 border-slate-200"
                      }`}>
                        {timeline.isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-bold font-mono">{timeline.step}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start font-sans">
                        
                        {/* Label and timestamps */}
                        <div className="md:col-span-1">
                           <h4 className={`text-sm font-black ${
                            timeline.isCompleted ? "text-[#0f5132]" : "text-slate-400"
                          }`}>
                            {timeline.label}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                            {timeline.date} - {timeline.time}
                          </span>
                        </div>

                        {/* Technical instructions or description */}
                        <div className="md:col-span-3 text-xs text-slate-500 leading-relaxed font-light font-sans">
                          {timeline.description}
                          {timeline.step === myBooking.trackingStep && (
                            <div className="mt-2 text-[10px] font-bold text-[#0f5132] flex items-center gap-1 bg-[#0f5132]/10 rounded px-2.5 py-1 w-max border border-[#0f5132]/25">
                              <span className="h-1.5 w-1.5 bg-[#0f5132] rounded-full animate-ping"></span>
                              <span>Tahap Berlangsung / Aktif</span>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA PRIBADI (Extended Feature) */}
          {activeTab === "pribadi" && (
            <div className="space-y-8 animate-slide-up font-sans">
              <div>
                <span className="bg-white text-[#0f5132] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded shadow-xs border border-slate-200">
                  MANAJEMEN DATA PRIBADI JAMAAH
                </span>
                <p className="text-xs text-slate-500 font-medium mt-1 font-sans">Lengkapi data profil, NIK KTP, paspor, dan pastikan berkas administrasi Anda terunggah.</p>
              </div>

              {saveSuccess && (
                <div className="p-4 bg-emerald-50 text-[#0f5132] rounded-xl border border-emerald-200 flex items-start gap-3 animate-scale-up font-sans">
                  <ShieldCheck className="w-5 h-5 text-[#0c4027] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-black text-slate-900">Alhamdulillah, Data Berhasil Diperbaharui!</strong>
                    <span className="text-xs text-slate-700 font-light leading-relaxed block mt-0.5">
                      Perubahan profil Anda telah tersimpan dengan aman di database travel. Admin melakukan sinkronisasi otomatis paspor dan NIK untuk penerbitan visa e-Umrah dari Kementerian Haji Saudi.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form Profile Inputs Block - Col-span-2 */}
                <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  
                  <h3 className="font-extrabold text-slate-800 text-base tracking-tight flex items-center gap-2 border-b pb-3 border-slate-100">
                    <User className="w-5 h-5 text-[#0f5132]" />
                    <span>Formulir Kelengkapan Profil Jamaah</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Nama Lengkap Sesuai KTP <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-bold"
                      />
                    </div>

                    {/* Email - Disabled */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block font-sans">Alamat Email Pendaftaran (Tetap)</label>
                      <input
                        type="email"
                        disabled
                        value={myBooking.userEmail}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-slate-50 border border-slate-100 text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>

                    {/* No WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">No. HP / WhatsApp <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 0812-3456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-mono font-medium"
                      />
                    </div>

                    {/* NIK KTP */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Nomor Induk Kependudukan (NIK KTP) <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="16 digit angka KTP"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-mono"
                      />
                    </div>

                    {/* Passport Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Nomor Paspor Aktif <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: C1234567 atau B789012"
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-mono"
                      />
                    </div>

                    {/* Birth Place */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Tempat Lahir Sesuai KTP <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-medium"
                      />
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Tanggal Lahir Sesuai KTP <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 12 September 1985"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-medium"
                      />
                    </div>

                    {/* Vaccination status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block font-sans">Status Vaksin Meningitis <span className="text-red-500">*</span></label>
                      <select
                        value={vaccine}
                        onChange={(e) => setVaccine(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-sans font-medium"
                      >
                        <option value="Sudah (Meningitis & Influenza)">Sudah (Lengkap Meningitis & Influenza)</option>
                        <option value="Sudah Vaksin Meningitis Saja">Sudah Vaksin Meningitis Saja</option>
                        <option value="Belum Vaksin / Masih Dijadwalkan">Belum Vaksin / Masih Dijadwalkan</option>
                      </select>
                    </div>

                  </div>

                  {/* Complete House Address */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-xs font-bold text-slate-500 block font-sans">Alamat Rumah Lengkap Domisili <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded bg-white border border-slate-200 text-slate-800 focus:border-[#0f5132] focus:outline-hidden font-sans font-medium"
                    />
                  </div>

                  {/* Submission Row */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#0f5132] hover:bg-[#0c4027] text-white border border-transparent font-black rounded-lg text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all hover:scale-101 font-sans shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#c5a880]" />
                      <span>Simpan Rincian Data Pribadi</span>
                    </button>
                  </div>

                </form>

                {/* Document Verification Side panel */}
                <div className="space-y-6">
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase border-b pb-2 border-slate-100 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#c5a880]" />
                      <span>Administrasi Berkas Fisik</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans">
                      Centang berkas-berkas yang telah Anda persiapkan atau serahkan ke pihak representative Khadijah Travel Menteng:
                    </p>

                    <div className="space-y-3.5 pt-2 text-xs">
                      
                      {/* Document 1: Passport */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={docPaspor}
                          onChange={(e) => setDocPaspor(e.target.checked)}
                          className="h-4 w-4 bg-white border-slate-200 text-[#0f5132] rounded focus:ring-[#0f5132]"
                        />
                        <div className="space-y-0.5">
                          <span className={`font-sans ${docPaspor ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>Paspor Asli Sesuai Nama</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Sisa masa aktif min. 8 Bulan</span>
                        </div>
                      </label>

                      {/* Document 2: KTP */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={docKtp}
                          onChange={(e) => setDocKtp(e.target.checked)}
                          className="h-4 w-4 bg-white border-slate-200 text-[#0f5132] rounded focus:ring-[#0f5132]"
                        />
                        <div className="space-y-0.5">
                          <span className={`font-sans ${docKtp ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>Fotokopi KTP Berwarna</span>
                          <span className="text-[9px] text-[#0f5132]/65 block font-sans">Data terbaca tajam tanpa pantulan</span>
                        </div>
                      </label>

                      {/* Document 3: KK */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={docKk}
                          onChange={(e) => setDocKk(e.target.checked)}
                          className="h-4 w-4 bg-white border-slate-200 text-[#0f5132] rounded focus:ring-[#0f5132]"
                        />
                        <div className="space-y-0.5">
                          <span className={`font-sans ${docKk ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>Kartu Keluarga (KK)</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Wajib menyatakan ikatan keluarga</span>
                        </div>
                      </label>

                      {/* Document 4: Pas Foto */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={docFoto}
                          onChange={(e) => setDocFoto(e.target.checked)}
                          className="h-4 w-4 bg-white border-slate-200 text-[#0f5132] rounded focus:ring-[#0f5132]"
                        />
                        <div className="space-y-0.5">
                          <span className={`font-sans ${docFoto ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>Pas Foto Latar Belakang Putih</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Ukuran 4x6 zoom muka 80% (2 lembar)</span>
                        </div>
                      </label>

                    </div>

                    <div className="p-3.5 bg-amber-50 border border-amber-200/65 rounded-lg text-[10px] text-amber-900 leading-relaxed font-sans mt-4">
                      <strong>⚠️ Catatan Verifikator Paspor:</strong>
                      <p className="mt-1">
                        Ejaan nama di Paspor Anda wajib melampirkan minimal 2 (dua) suku kata utuh (contoh: Ahmad Fauzi) untuk mendaftar visa e-Umrah reguler KSA.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: DOWNLOAD BROSUR */}
          {activeTab === "brosur" && (
            <div className="space-y-8 animate-slide-up font-sans">
              <div>
                <span className="bg-white text-[#0f5132] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded shadow-xs border border-slate-200">
                  PUSAT UNDUHAN KATALOG & BROSUR TRAVEL
                </span>
                <p className="text-xs text-slate-500 font-medium mt-1 font-sans">Unduh panduan manasik, kuitansi, itinerary perjalanan, atau flyer rincian fasilitas hotel bintang secara gratis.</p>
              </div>

              {downloadSuccessMessage && (
                <div className="p-4 bg-emerald-50 text-[#0f5132] rounded-xl border border-emerald-250 flex items-center gap-3 animate-scale-up text-xs font-bold leading-normal font-sans shadow-xs">
                  <Check className="h-5 w-5 text-[#0f5132] flex-shrink-0" />
                  <span>{downloadSuccessMessage}</span>
                </div>
              )}

              {/* Brochure grid options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brochures.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    
                    {/* Top Detail */}
                    <div className="p-6 space-y-4">
                      
                      {/* Badge format / size */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase font-sans">{item.format} File</span>
                        <span className="text-[10px] text-[#0f5132] font-black">{item.size}</span>
                      </div>

                      {/* Title display */}
                      <h4 className="text-slate-900 text-sm font-black tracking-tight font-sans leading-snug">
                        {item.title}
                      </h4>

                      {/* Highlights */}
                      <span className="text-[10px] text-amber-800 font-bold block bg-amber-50 px-2 py-1 rounded border border-amber-100 font-sans">
                        {item.highlights}
                      </span>

                      {/* Brief text info */}
                      <p className="text-xs text-slate-600 leading-relaxed font-light font-sans">
                        {item.description}
                      </p>

                    </div>

                    {/* Footer Trigger buttons */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 pt-3.5">
                      {downloadingId === item.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold py-1">
                            <span className="text-slate-500 font-sans">Sedang mengunduh berkas...</span>
                            <span className="text-[#0f5132]">{downloadProgress}%</span>
                          </div>
                          {/* Animated progress bar indicator */}
                          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-250">
                            <div 
                              className="bg-[#0f5132] h-full transition-all duration-100 ease-out"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTriggerDownload(item.id, item.title)}
                          className="w-full py-2.5 bg-[#0f5132] hover:bg-[#0c4027] text-white font-black tracking-wider uppercase rounded-lg border border-transparent text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all font-sans shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Brosur</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

              {/* Informative advice banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 font-sans shadow-xs">
                <div className="space-y-1.5 max-w-xl font-sans">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-550 flex-shrink-0" />
                    <strong className="text-xs text-slate-800 uppercase font-black">Butuh Versi Cetak / Fisik?</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                    Setiap pendaftaran paket Umroh VIP atau Premium di Khadijah Travel mengikutsertakan tas koper eksklusif fiber 24 inch, tas paspor gantung, buku ma'tsurat cetak, kain ihram (syal batik) bagi ikhwan, dan mukena bordir premium bagi akhwat secara cuma-cuma.
                  </p>
                </div>
                <button
                  onClick={() => alert("Permintaan katalog fisik berhasil dikirim! Kurir kami akan mengirimkannya ke alamat rumah Anda.")}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-250 text-[10px] tracking-wider uppercase font-black text-[#0f5132] rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  Kirim Versi Cetak Ke Rumah
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
