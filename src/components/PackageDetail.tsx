import React from "react";
import { 
  Calendar, Clock, Hotel, Plane, ShieldCheck, 
  MapPin, Utensils, Award, Tag, Check, Ticket 
} from "lucide-react";
import { UmrohPackage } from "../types";

interface PackageDetailProps {
  pkg: UmrohPackage;
  onBookNow: (pkg: UmrohPackage) => void;
}

export default function PackageDetail({ pkg, onBookNow }: PackageDetailProps) {
  // Format currency to IDR
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Preset sub-images matching premium specs list (Masjid Al-Haram, Medina, Food, Luxury Hotel)
  const subImages = [
    "https://wallpapercave.com/wp/wp2182984.jpg",
    "https://i.pinimg.com/originals/4d/6d/81/4d6d8168bfdede50e5ad865e92bd06d0.jpg",
    "https://www.islamiclandmarks.com/wp-content/uploads/2023/05/interesting_facts_about_the_holy_kaaba_house_of_Allah.jpg",
    "https://wallpapercave.com/wp/BLWHbTj.jpg",
  ];

  return (
    <div id="detail-paket" className="bg-white rounded-2xl border border-slate-200/85 shadow-lg overflow-hidden scroll-mt-24 text-slate-700">
      {/* Detail Paket Header Section */}
      <div className="bg-slate-50 text-slate-800 p-6 sm:px-10 flex items-center justify-between border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-[#0f5132] uppercase tracking-widest block">Detail Paket Terpilih</span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-0.5">Spesifikasi Lengkap Paket</h2>
        </div>
        <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
          {pkg.duration} Hari Perjalanan
        </div>
      </div>

      <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Gallery & Images */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4">
          <div className="rounded-xl overflow-hidden h-72 sm:h-96 bg-slate-100 relative group border border-slate-200 shadow-xs">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {pkg.bestSeller && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded shadow-xs border border-amber-600/20">
                Pilihan Terbaik
              </span>
            )}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent text-white">
              <span className="text-xs font-bold text-[#c5a880]">Khadijah Travel Indonesia</span>
              <p className="text-sm font-semibold truncate mt-0.5">{pkg.name} Terpercaya</p>
            </div>
          </div>

          {/* Sub-images Gallery */}
          <div className="grid grid-cols-4 gap-2.5">
            {subImages.map((src, idx) => (
              <div 
                key={idx} 
                className="h-16 sm:h-20 rounded-lg overflow-hidden border border-slate-200 hover:border-[#0f5132]/30 opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
              >
                <img 
                  src={src} 
                  alt="Umroh step item" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Information */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Header: Name and Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pkg.name}</h1>
                {pkg.bestSeller && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Best Seller</span>
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0f5132]">{formatIDR(pkg.price)}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ Jamaah (Sekamar Ber-4)</span>
              </div>
            </div>

            {/* Core Specifications Table */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100 bg-white">
              
              {/* Duration item */}
              <div className="grid grid-cols-3 p-4 text-sm">
                <div className="font-extrabold text-[#0f5132] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0f5132]" />
                  <span>Durasi</span>
                </div>
                <div className="col-span-2 text-slate-800 font-semibold">{pkg.duration} Hari</div>
              </div>

              {/* Hotel item */}
              <div className="grid grid-cols-3 p-4 text-sm">
                <div className="font-extrabold text-[#0f5132] flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#0f5132]" />
                  <span>Hotel</span>
                </div>
                <div className="col-span-2 text-slate-800 space-y-1">
                  <div><strong className="text-slate-950 font-bold">Makkah:</strong> {pkg.hotelMakkah}</div>
                  <div><strong className="text-slate-950 font-bold">Madinah:</strong> {pkg.hotelMadinah}</div>
                </div>
              </div>

              {/* Airline item */}
              <div className="grid grid-cols-3 p-4 text-sm">
                <div className="font-extrabold text-[#0f5132] flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#0f5132]" />
                  <span>Maskapai</span>
                </div>
                <div className="col-span-2 text-slate-800 font-semibold flex items-center gap-2">
                  <span>{pkg.maskapai}</span>
                  <span className="text-[10px] uppercase font-bold text-[#0f5132] bg-[#0f5132]/10 px-2 py-0.5 rounded border border-[#0f5132]/20">
                    Penerbangan Langsung
                  </span>
                </div>
              </div>

              {/* Schedule item */}
              <div className="grid grid-cols-3 p-4 text-sm">
                <div className="font-extrabold text-[#0f5132] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0f5132]" />
                  <span>Keberangkatan</span>
                </div>
                <div className="col-span-2 text-slate-800 font-semibold">12 {pkg.schedule}</div>
              </div>

            </div>

            {/* Facilities Grids (Tiket PP, Hotel, Makan 3x, Ziarah, Visa, Asuransi) */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-950 tracking-tight uppercase">Fasilitas Termasuk (All-In)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                
                {/* 1. Tiket PP */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <Ticket className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Tiket PP Exec/Econ</span>
                </div>

                {/* 2. Hotel Bintang */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <Hotel className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Hotel Dekat Masjid</span>
                </div>

                {/* 3. Makan 3x */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <Utensils className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Makan 3x Fullboard</span>
                </div>

                {/* 4. Ziarah */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Ziarah Makkah & Madinah</span>
                </div>

                {/* 5. Visa */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Visa Umroh Resmi</span>
                </div>

                {/* 6. Asuransi */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-8 h-8 rounded bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                   </div>
                  <span className="text-xs font-bold text-slate-700">Asuransi Perjalanan</span>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-tight font-black">Deskripsi Paket</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {pkg.description}
              </p>
            </div>

            {/* Promo Card to Match Page 2 bottom */}
            <div className="flex items-center gap-4 bg-amber-50 rounded-xl p-4 border border-amber-200/50 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#0f5132] flex-shrink-0">
                <Tag className="w-5 h-5 fill-[#0f5132]/10 text-[#0f5132]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Promo Tersedia</h4>
                <p className="text-xs text-slate-950 font-bold mt-0.5">Diskon Ramadhan</p>
                <p className="text-xs text-slate-600">Potongan langsung sebesar <strong className="text-[#0f5132] font-bold">Rp 3.000.000,-</strong> berlaku keberangkatan hingga <span className="font-semibold text-slate-950">30 April 2026</span></p>
              </div>
            </div>

          </div>

          {/* Book Now Button exactly styled like Page 2 */}
          <div className="pt-6 border-t border-slate-200">
            <button
               onClick={() => onBookNow(pkg)}
               className="w-full bg-[#0f5132] hover:bg-[#0c4027] text-white font-black text-center py-4 rounded-xl shadow-md transition-all tracking-wide cursor-pointer text-sm border border-[#c5a880]/25"
            >
              Pesan Sekarang
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
