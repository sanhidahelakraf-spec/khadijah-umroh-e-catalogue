import React from "react";
import { X, Search, Check, AlertCircle, MapPin, Plane, Clock } from "lucide-react";
import { Booking } from "../types";
import { getTrackingTimeline } from "../data/initialData";

interface TrackingSearchModalProps {
  bookings: Booking[];
  onClose: () => void;
}

export default function TrackingSearchModal({ bookings, onClose }: TrackingSearchModalProps) {
  const [code, setCode] = React.useState("");
  const [foundBooking, setFoundBooking] = React.useState<Booking | null>(null);
  const [searched, setSearched] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (!code) return;
    const match = bookings.find(
      b => b.bookingCode.trim().toUpperCase() === code.trim().toUpperCase()
    );
    setFoundBooking(match || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-emerald-100 flex flex-col">
        
        {/* Header decoration */}
        <div className="bg-[#0f5132] text-white p-6 relative flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-[#c5a880] font-bold block font-sans">Sistem Cek Resi Keberangkatan</span>
            <h3 className="text-lg font-bold">Tracking Status Jamaah</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-emerald-100/80 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Lookup Input */}
          <form onSubmit={handleSearch} className="space-y-2.5">
            <label className="text-xs font-bold text-gray-700 block">Masukkan Kode Booking / No. Registrasi Anda</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: UMR-2026-001 atau UMR-2026-002"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#0f5132] font-mono font-bold uppercase text-gray-800 bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0f5132] hover:bg-[#0c4027] text-white px-5 py-3 rounded-lg text-xs font-black tracking-wider uppercase cursor-pointer shadow-sm transition-colors"
              >
                Cek Status
              </button>
            </div>
          
          </form>

          {/* Results Block */}
          {searched && (
            <div className="border-t border-gray-100 pt-5 animate-fade-in space-y-6">
              {foundBooking ? (
                <div className="space-y-6">
                  
                  {/* Participant and core brief info */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Nama Jamaah</span>
                      <strong className="text-gray-900 text-sm font-black">{foundBooking.userName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Paket Terdaftar</span>
                      <strong className="text-[#0f5132] text-sm font-black">{foundBooking.packageName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Tanggal Berangkat</span>
                      <strong className="text-gray-900 text-sm font-black">{foundBooking.travelDate}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Status Validasi</span>
                      <strong className="text-[#0f5132] text-xs font-black block mt-0.5">{foundBooking.status}</strong>
                    </div>
                  </div>

                  {/* Vertical Progress Log */}
                  <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-7 py-1">
                    {getTrackingTimeline(foundBooking).map((step) => (
                      <div key={step.step} className="relative text-xs font-sans">
                        
                        <div className={`absolute left-[-38px] top-0 h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                          step.isCompleted
                            ? "bg-[#0f5132] text-white border-[#0f5132] scale-110 shadow-xs"
                            : "bg-white text-gray-300 border-gray-200"
                        }`}>
                          {step.isCompleted ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="text-[9px] font-bold font-mono">{step.step}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-black ${
                              step.isCompleted ? "text-[#0f5132]" : "text-gray-400"
                            }`}>
                              {step.label}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono font-bold">
                              ({step.date} - {step.time})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed font-light font-sans">
                            {step.description}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>Kode booking salah atau tidak terdaftar. Periksa kembali entri Anda atau hubungi admin Khadijah untuk sinkronisasi paspor.</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
