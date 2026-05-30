import React from "react";
import { Calendar, Clock, Hotel, ArrowRight } from "lucide-react";
import { UmrohPackage } from "../types";

interface PackageCardProps {
  key?: string;
  pkg: UmrohPackage;
  onSelect: (pkg: UmrohPackage) => void;
}

export default function PackageCard({ pkg, onSelect }: PackageCardProps) {
  // Format currency to IDR Rupiah
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full relative group">
      {/* Best Seller ribbon banner */}
      {pkg.bestSeller && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#c5a880] text-emerald-950 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-xs block border border-[#b08f5c]/20">
            Best Seller
          </span>
        </div>
      )}

      {/* Package Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-[#0f5132] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
          Amanah
        </div>
      </div>

      {/* Key Details Block */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Khadijah Travel
          </span>
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
            {pkg.name}
          </h3>
          
          <div className="space-y-1.5 pt-2">
            
            {/* Duration */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <span>{pkg.duration} Hari</span>
            </div>

            {/* Hotel */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Hotel className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <span className="truncate">Hotel {pkg.id.includes("premium") ? "Bintang 5" : pkg.id.includes("reguler") ? "Bintang 4" : "Bintang 3"}</span>
            </div>

          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Mulai dari</span>
            <span className="text-base font-black text-[#0f5132]">
              {formatIDR(pkg.price)}
            </span>
          </div>

          <button
            onClick={() => onSelect(pkg)}
            className="w-full mt-3 bg-white hover:bg-[#0f5132]/5 text-[#334155] hover:text-[#0f5132] text-xs font-bold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
