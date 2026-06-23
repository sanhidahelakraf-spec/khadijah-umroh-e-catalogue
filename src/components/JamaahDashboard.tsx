import React from "react";
import { 
  Compass, User, Calendar, Clock, Check, Plane, Hotel,
  LogOut, Globe, Milestone, ShieldCheck, Save, FileCheck,
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
  
  const myBooking = bookings.find(
    b => b.userEmail.toLowerCase() === currentEmail.toLowerCase()
  ) || bookings[0];

  const timelineSteps = getTrackingTimeline(myBooking);

  const [activeTab, setActiveTab3] = React.useState<"dashboard" | "pribadi">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [fullName, setFullName] = React.useState(myBooking.userName || "");
  const [phone, setPhone] = React.useState(myBooking.userPhone || "");
  const [nik, setNik] = React.useState(myBooking.userNik || "3171020409850003");
  const [passport, setPassport] = React.useState(myBooking.userPassport || "C7829019");
  const [birthPlace, setBirthPlace] = React.useState(myBooking.userBirthPlace || "Jakarta");
  const [birthDate, setBirthDate] = React.useState(myBooking.userBirthDate || "12 September 1985");
  const [address, setAddress] = React.useState(myBooking.userAddress || "Jl. Mawar Merah No. 45, Duren Sawit, Jakarta Timur");
  const [vaccine, setVaccine] = React.useState(myBooking.userVaccine || "Sudah (Meningitis & Influenza)");
  
  const [docPaspor, setDocPaspor] = React.useState(myBooking.userDocPaspor ?? true);
  const [docKtp, setDocKtp] = React.useState(myBooking.userDocKtp ?? true);
  const [docKk, setDocKk] = React.useState(myBooking.userDocKk ?? true);
  const [docFoto, setDocFoto] = React.useState(myBooking.userDocFoto ?? false);

  const [saveSuccess, setSaveSuccess] = React.useState(false);

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
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f5132] text-white/90 flex-shrink-0 flex flex-col justify-between py-6 px-4 border-r border-[#0f5132]/25 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          
          <div className="px-2 flex items-center justify-between">
            <div>
              <CompanyLogo variant="compact" iconSize="sm" theme="dark" />
              <span className="text-[10px] text-emerald-100/50 block uppercase font-bold tracking-wider mt-1.5 pl-1 font-sans">Daftar Jamaah</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-white hover:text-[#c5a880] md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
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
          </nav>
        </div>

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

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        <div className="bg-white border-b border-slate-200 py-5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-sans">
          <div className="flex items-center gap-3">
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
              Halaman Panduan Jamaah Umroh
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

        <div className="p-6 sm:p-8 space-y-8 flex-1 font-sans">
          
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-white text-[#0f5132] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded shadow-xs border border-slate-200">
                    DASHBOARD JAMAAH (USER)
                  </span>
                  <p className="text-xs text-slate-500 font-medium mt-1">Status kelengkapan visa, tiket pesawat, dan jadwal akomodasi resmi Anda.</p>
                </div>
              </div>

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

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Paket Saya</span>
                  <strong className="text-base sm:text-lg font-black text-[#0f5132] block truncate">{myBooking.packageName}</strong>
                  <span className="text-[9px] text-[#0f5132] font-bold block bg-[#0f5132]/10 px-2 py-0.5 rounded border border-[#0f5132]/20 w-max">Fasilitas Lengkap</span>
                </div>

                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Tanggal Berangkat</span>
                  <strong className="text-base sm:text-lg font-black text-[#0f5132] block">{myBooking.travelDate}</strong>
                  <span className="text-[9px] text-slate-500 font-medium block">Kloter Utama</span>
                </div>

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

                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-1.5 hover:shadow-md transition-shadow">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Kode Booking</span>
                  <strong className="text-base sm:text-lg font-mono font-black text-[#0f5132] block">{myBooking.bookingCode}</strong>
                  <span className="text-[9px] text-slate-500 font-medium block">Gunakan saat cek manual</span>
                </div>

              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
                <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase border-b pb-2 border-slate-100">
                  Informasi Perjalanan
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Maskapai</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Plane className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.maskapai}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hotel Makkah</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Hotel className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.hotelMakkah}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hotel Madinah</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Hotel className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span className="truncate">{myBooking.hotelMadinah}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Durasi</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Clock className="w-4 h-4 text-[#0f5132] flex-shrink-0" />
                      <span>{myBooking.duration} Hari Perjalanan</span>
                    </div>
                  </div>

                </div>
              </div>

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
                
                <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  
                  <h3 className="font-extrabold text-slate-800 text-base tracking-tight flex items-center gap-2 border-b pb-3 border-slate-100">
                    <User className="w-5 h-5 text-[#0f5132]" />
                    <span>Formulir Kelengkapan Profil Jamaah</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block font-sans">Alamat Email Pendaftaran (Tetap)</label>
                      <input
                        type="email"
                        disabled
                        value={myBooking.userEmail}
                        className="w-full text-xs px-3.5 py-2.5 rounded bg-slate-50 border border-slate-100 text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>

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

                <div className="space-y-6">
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase border-b pb-2 border-slate-100 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#c5a880]" />
                      <span>Administrasi Berkas Fisik</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans">
                      Centang berkas-berkas yang telah Anda persiapkan atau serahkan ke pihak representative Khadijah Travel:
                    </p>

                    <div className="space-y-3.5 pt-2 text-xs">
                      
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

        </div>
      </main>
    </div>
  );
}