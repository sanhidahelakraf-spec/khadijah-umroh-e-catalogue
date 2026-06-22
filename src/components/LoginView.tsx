import React from "react";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import CompanyLogo from "./CompanyLogo";

const API = "https://khadijah-umroh-e-catalogue-production.up.railway.app/api";

interface LoginViewProps {
  onLoginSuccess: (email: string, role: "admin" | "jamaah") => void;
  onBackToPublic: () => void;
}

export default function LoginView({ onLoginSuccess, onBackToPublic }: LoginViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [validationError, setValidationError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setLoading(true);

    try {
      // ... isi kode ...
    } catch (err) {
      setValidationError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };
    // Cek jamaah (harus sudah pernah booking dengan email & password yang sesuai)
const jamaahRes = await fetch(`${API}/login-jamaah`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

if (jamaahRes.ok) {
  onLoginSuccess(email, "jamaah");
  return;
}

setValidationError("Email atau password salah, atau Anda belum pernah melakukan pemesanan.");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans text-slate-700">
      
      <button 
        onClick={onBackToPublic}
        className="absolute top-6 left-6 text-slate-700 text-xs bg-white border border-slate-200/80 rounded-lg px-4 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-all shadow-xs"
      >
        <ArrowLeft className="w-4 h-4 text-[#0f5132]" />
        <span>Kembali ke Katalog</span>
      </button>

      <div className="absolute top-6 right-6 hidden sm:block">
        <span className="bg-white text-[#0f5132] text-xs font-black tracking-widest uppercase px-4 py-2 rounded-md shadow-xs border border-slate-200">
          SISTEM KEAMANAN JAMAAH
        </span>
      </div>

      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-8 sm:p-10 border border-slate-200/85 border-t-4 border-t-[#0f5132] relative z-10">
        
        <div className="text-center space-y-2 mb-8 flex flex-col items-center">
          <CompanyLogo variant="full" iconSize="lg" className="mb-4" />
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Sistem E-Catalogue Umroh</h2>
            <p className="text-xs text-slate-500 font-medium">Silakan login untuk melanjutkan</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {validationError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">
              {validationError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-medium text-slate-800 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-medium text-slate-800 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0f5132] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xs text-slate-500 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#0f5132]"
              />
              <span>Ingat saya</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Hubungi admin untuk reset password.")}
              className="text-xs text-[#0f5132] hover:text-[#0c4027] font-bold hover:underline"
            >
              Lupa password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f5132] hover:bg-[#0c4027] text-white font-extrabold text-sm py-3.5 rounded-lg shadow-md cursor-pointer transition-colors block text-center mt-2 disabled:opacity-60"
          >
            {loading ? "Memverifikasi..." : "MASUK"}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 font-medium mt-8 select-none">
          © 2026 Khadijah Travel Indonesia
        </p>
      </div>
    </div>
  );
}