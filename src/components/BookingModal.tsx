import React from "react";
import { X, Calendar, User, Phone, Mail, Lock, ShieldCheck } from "lucide-react";
import { UmrohPackage } from "../types";

interface BookingModalProps {
  pkg: UmrohPackage;
  onClose: () => void;
  onSubmit: (details: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
  }) => void;
}

export default function BookingModal({ pkg, onClose, onSubmit }: BookingModalProps) {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("rahasia123");
  const [termsAccepted, setTermsAccepted] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMsg("Mohon lengkapi semua kolom wajib.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Anda harus menyetujui syarat & ketentuan.");
      return;
    }
    setErrorMsg("");
    onSubmit({ fullName, phone, email, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col my-8">
        
        {/* Decorative Top Bar */}
        <div className="bg-[#0f5132] text-white p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-emerald-150/80 hover:text-white hover:bg-[#0c4027]/50 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-[#c5a880] font-bold block">Formulir Pesanan Online</span>
            <h3 className="text-xl font-bold">Booking Paket {pkg.name}</h3>
            <p className="text-xs text-stone-200/80 font-light font-sans">Lengkapi data diri Anda di bawah ini untuk memulai langkah pendaftaran berkah.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg font-bold">
              {errorMsg}
            </div>
          )}

          {/* Package brief card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Paket Pilihan</span>
              <strong className="text-[#0f5132] font-black">{pkg.name} ({pkg.duration} Hari)</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-xs block">Harga</span>
              <strong className="text-[#0f5132] font-black">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits:0 }).format(pkg.price)}
              </strong>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Nama Lengkap Sesuai Paspor <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Fauzi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-medium text-gray-800 bg-white"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">No. Handphone (WhatsApp Aktif) <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-medium text-gray-800 bg-white"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Alamat Email Aktif <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Contoh: ahmad@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-medium text-gray-800 bg-white"
              />
            </div>
          </div>

          {/* Password (for user login creation) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <label className="text-xs font-bold text-gray-700 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Password Akun Jamaah Baru</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan password akun baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded bg-white text-gray-800 font-mono"
            />
            <p className="text-[10px] text-gray-400 leading-tight">
              Gunakan password di atas untuk login ke Dashboard Jamaah setelah formulir dikirimkan.
            </p>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-gray-500 font-medium cursor-pointer py-1 select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#0f5132] focus:ring-[#0f5132]"
            />
            <span>Saya menyetujui semua data paspor & berkah adalah legal dan menyetujui ketentuan pemesanan di Khadijah Travel Indonesia.</span>
          </label>

          {/* Submission and Close buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg text-sm transition-colors hover:bg-gray-150 cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#0f5132] hover:bg-[#0c4027] text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Kirim Pemesanan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
