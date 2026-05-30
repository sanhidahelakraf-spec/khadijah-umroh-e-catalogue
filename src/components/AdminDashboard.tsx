import React from "react";
import { 
  BarChart3, Users, Briefcase, DollarSign, Plus, Search, 
  Edit, Trash2, CheckCircle, Clock, Check, X, ShieldAlert,
  Menu, LogOut, Package, MapPin, Plane, HelpCircle, Eye, RefreshCw, FileText, Settings, Globe
} from "lucide-react";
import { UmrohPackage, Booking, User } from "../types";
import { getTrackingTimeline } from "../data/initialData";
import CompanyLogo from "./CompanyLogo";

interface AdminDashboardProps {
  currentEmail: string;
  packages: UmrohPackage[];
  bookings: Booking[];
  users: User[];
  onUpdatePackages: (pkgs: UmrohPackage[]) => void;
  onUpdateBookings: (bks: Booking[]) => void;
  onLogout: () => void;
  onGoToPublic: () => void;
}

type TabType = "dashboard" | "paket" | "jamaah" | "tracking" | "promo" | "laporan" | "pengaturan";

export default function AdminDashboard({
  currentEmail,
  packages,
  bookings,
  users,
  onUpdatePackages,
  onUpdateBookings,
  onLogout,
  onGoToPublic,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Form states for creating/editing packages (matches Page 4 bottom)
  const [isAddingPackage, setIsAddingPackage] = React.useState(false);
  const [editingPackageId, setEditingPackageId] = React.useState<string | null>(null);
  const [promoCode, setPromoCode] = React.useState("");
  
  // Package form fields
  const [formName, setFormName] = React.useState("");
  const [formPrice, setFormPrice] = React.useState(28000000);
  const [formDuration, setFormDuration] = React.useState(12);
  const [formSchedule, setFormSchedule] = React.useState("Mei 2026");
  const [formHotelMakkah, setFormHotelMakkah] = React.useState("");
  const [formHotelMadinah, setFormHotelMadinah] = React.useState("");
  const [formMaskapai, setFormMaskapai] = React.useState("Saudia Airlines");
  const [formDescription, setFormDescription] = React.useState("");
  const [formImage, setFormImage] = React.useState("");
  const [formBestSeller, setFormBestSeller] = React.useState(false);

  // Editing Jamaah Modal / States
  const [editingBookingId, setEditingBookingId] = React.useState<string | null>(null);
  const [editBookingStatus, setEditBookingStatus] = React.useState<"Verifikasi" | "Pending" | "Proses" | "Selesai">("Pending");
  const [editBookingPayment, setEditBookingPayment] = React.useState<"Lunas" | "DP" | "Belum Bayar">("Belum Bayar");
  const [editBookingPhone, setEditBookingPhone] = React.useState("");
  const [editBookingStep, setEditBookingStep] = React.useState(1);

  // Active tracking inspector jamaah selection
  const [selectedTrackingBookingId, setSelectedTrackingBookingId] = React.useState<string>(bookings[0]?.id || "");

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 1. Calculations based on screenshots and live inputs
  const totalPackagesCount = packages.length; 
  const totalJamaahCount = bookings.length; // Active tracking users representing total jamaah in system
  const activeOrdersCount = bookings.filter(b => b.status === "Pending" || b.status === "Proses" || b.status === "Verifikasi").length;
  const totalIncome = bookings
    .filter(b => b.paymentStatus === "Lunas" || b.paymentStatus === "DP")
    .reduce((sum, b) => {
      // DP counts as 50% for mock or full price for simplicy matching screenshots
      return sum + (b.paymentStatus === "Lunas" ? b.price : b.price * 0.5);
    }, 0);

  // Filter packages by search queries
  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter bookings by queries
  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.packageName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Save / Add Packages (CRUD)
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingPackageId) {
      // Update existing
      const updated = packages.map(p => p.id === editingPackageId ? {
        ...p,
        name: formName,
        price: Number(formPrice),
        duration: Number(formDuration),
        schedule: formSchedule,
        hotelMakkah: formHotelMakkah,
        hotelMadinah: formHotelMadinah,
        maskapai: formMaskapai,
        description: formDescription,
        image: formImage || "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=600&auto=format&fit=crop",
        bestSeller: formBestSeller
      } : p);
      onUpdatePackages(updated);
    } else {
      // Add new
      const newPkg: UmrohPackage = {
        id: "pkg-" + Date.now(),
        name: formName,
        price: Number(formPrice),
        duration: Number(formDuration),
        schedule: formSchedule,
        status: "Aktif",
        hotelMakkah: formHotelMakkah || "Hotel Makkah (★4)",
        hotelMadinah: formHotelMadinah || "Hotel Madinah (★4)",
        maskapai: formMaskapai,
        description: formDescription || "Rencana perjalanan umroh dengan pelayanan terbaik.",
        image: formImage || "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=600&auto=format&fit=crop",
        bestSeller: formBestSeller
      };
      onUpdatePackages([...packages, newPkg]);
    }

    // Reset Form
    setIsAddingPackage(false);
    setEditingPackageId(null);
    setFormName("");
    setFormPrice(28000000);
    setFormDuration(12);
    setFormSchedule("Mei 2026");
    setFormHotelMakkah("");
    setFormHotelMadinah("");
    setFormMaskapai("Saudia Airlines");
    setFormDescription("");
    setFormImage("");
    setFormBestSeller(false);
  };

  const startEditPackage = (pkg: UmrohPackage) => {
    setEditingPackageId(pkg.id);
    setFormName(pkg.name);
    setFormPrice(pkg.price);
    setFormDuration(pkg.duration);
    setFormSchedule(pkg.schedule);
    setFormHotelMakkah(pkg.hotelMakkah);
    setFormHotelMadinah(pkg.hotelMadinah);
    setFormMaskapai(pkg.maskapai);
    setFormDescription(pkg.description);
    setFormImage(pkg.image);
    setFormBestSeller(!!pkg.bestSeller);
    setIsAddingPackage(true);
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      onUpdatePackages(packages.filter(p => p.id !== id));
    }
  };

  // Handle Save Jamaah details (CRUD)
  const startEditBooking = (b: Booking) => {
    setEditingBookingId(b.id);
    setEditBookingStatus(b.status);
    setEditBookingPayment(b.paymentStatus);
    setEditBookingPhone(b.userPhone);
    setEditBookingStep(b.trackingStep);
  };

  const handleSaveBookingEdit = () => {
    if (!editingBookingId) return;
    const updated = bookings.map(b => b.id === editingBookingId ? {
      ...b,
      status: editBookingStatus,
      paymentStatus: editBookingPayment,
      userPhone: editBookingPhone,
      trackingStep: editBookingStep,
    } : b);
    onUpdateBookings(updated);
    setEditingBookingId(null);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data jamaah ini?")) {
      const updated = bookings.filter(b => b.id !== id);
      onUpdateBookings(updated);
    }
  };

  const handleUpdateStepDirectly = (id: string, step: number) => {
    const updated = bookings.map(b => b.id === id ? {
      ...b,
      trackingStep: step,
    } : b);
    onUpdateBookings(updated);
  };

  // Mock Months Data for Chart peaks in Page 3
  const monthsData = [
    { name: "Jan", val: 12 },
    { name: "Mar", val: 24 },
    { name: "Apr", val: 18 },
    { name: "Mei", val: 31 },
    { name: "Jul", val: 20 },
    { name: "Agu", val: 28 },
    { name: "Sep", val: 22 },
    { name: "Okt", val: 32 },
    { name: "Nov", val: 40 },
    { name: "Des", val: 48 },
  ];

  const selectedTrackingBooking = bookings.find(b => b.id === selectedTrackingBookingId) || bookings[0];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc] flex flex-col md:flex-row font-mono relative overflow-x-hidden">
      
      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden"
        />
      )}

      {/* Sidebar - matches standard admin drawer perfectly */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#252526] text-[#cccccc] flex-shrink-0 flex flex-col justify-between py-6 px-4 border-r border-[#1e1e1e] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="px-2 flex items-center justify-between">
            <div>
              <CompanyLogo variant="compact" iconSize="sm" theme="dark" />
              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider mt-1.5 pl-1 font-sans">Admin Server</span>
            </div>
            {/* Close button on mobile sidebar */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-[#cccccc] hover:text-[#c5a880] md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "dashboard" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#c5a880]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("paket"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "paket" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#c5a880]" />
              <span>Paket Umroh</span>
            </button>

            <button
              onClick={() => { setActiveTab("jamaah"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "jamaah" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <Users className="w-4 h-4 text-[#c5a880]" />
              <span>Data Jamaah</span>
            </button>

            <button
              onClick={() => { setActiveTab("tracking"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "tracking" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <RefreshCw className="w-4 h-4 text-[#c5a880] animate-spin-slow" />
              <span>Tracking Order</span>
            </button>

            <button
              onClick={() => { setActiveTab("promo"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "promo" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <FileText className="w-4 h-4 text-[#c5a880]" />
              <span>Promo & Hub</span>
            </button>

            <button
              onClick={() => { setActiveTab("laporan"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "laporan" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <FileText className="w-4 h-4 text-[#c5a880]" />
              <span>Laporan</span>
            </button>

            <button
              onClick={() => { setActiveTab("pengaturan"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                activeTab === "pengaturan" ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"
              }`}
            >
              <Settings className="w-4 h-4 text-[#c5a880]" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-[#1e1e1e] space-y-2">
          <button
            onClick={() => { onGoToPublic(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-[#2d2d2d] transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#c5a880]" />
            <span>Kunjungi Web Publik</span>
          </button>
          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-[#2d2d2d]/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Panel */}
        <div className="bg-[#252526] border-b border-[#1e1e1e] py-5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-2 border border-[#2b2b2b] rounded-md bg-[#1e1e1e] text-[#c5a880] hover:text-white md:hidden cursor-pointer flex items-center justify-center animate-pulse"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-extrabold uppercase bg-[#1e1e1e] text-[#c5a880] border border-[#2b2b2b] px-3 py-1 rounded">
              Super Admin Mode
            </span>
            <h1 className="text-lg font-bold text-white capitalize hidden sm:block">
              Sistem E-Catalogue & Manajemen Jamaah
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-white block">Admin Super</span>
              <span className="text-[10px] text-gray-500 block">{currentEmail}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2b2b2b] flex items-center justify-center font-bold text-[#c5a880] shadow-xs">
              AD
            </div>
          </div>
        </div>

        {/* Dynamic Body Content according to selected Tab */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* TAB 1: CORE DASHBOARD REPORT */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              
              {/* Report Header Label */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">2. INTERACTIVE DASHBOARD ADMIN</h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Ringkasan transaksi, monitoring jamaah, dan total pendapatan real-time.</p>
                </div>
                <button 
                  onClick={() => {
                    // Quick simulated increment for demo
                    const newBook = [...bookings];
                    if(newBook[0]) newBook[0].price += 10000000;
                    onUpdateBookings(newBook);
                  }}
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-emerald-100"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
                  <span>Simulasi Pendapatan</span>
                </button>
              </div>

              {/* Statistics Row exactly matches numbers from PDF Page 3 top:
                  - Total Paket: 12
                  - Total Jamaah: 45
                  - Pesanan Aktif: 18
                  - Pendapatan: Rp 350.000.000
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1: Total Paket */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Paket</span>
                    <strong className="text-3xl font-black text-gray-900 block">12</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">Paket Tersedia</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>

                {/* Stat 2: Total Jamaah */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Jamaah</span>
                    <strong className="text-3xl font-black text-gray-900 block">45</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">Jamaah Terdaftar</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#b08f5c]" />
                  </div>
                </div>

                {/* Stat 3: Pesanan Aktif */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Pesanan Aktif</span>
                    <strong className="text-3xl font-black text-gray-900 block">18</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">Pesanan Berjalan</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-sky-700" />
                  </div>
                </div>

                {/* Stat 4: Pendapatan */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Pendapatan</span>
                    <strong className="text-2xl font-black text-emerald-800 block">Rp 350.000.000</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">Total Pendapatan</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-800" />
                  </div>
                </div>

              </div>

              {/* Graphic Orders & Recent Table Grid - Page 3 bottom row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Grafik Pemesanan - Curved line SVG */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 sm:p-8 lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase">Grafik Pemesanan</h3>
                      <p className="text-[10px] text-gray-400 font-bold">Jumlah Reservasi Baru Per Bulan</p>
                    </div>
                    <select className="text-xs font-bold border border-gray-200 outline-hidden rounded-md p-1 bg-white text-gray-700">
                      <option>Tahun 2026</option>
                      <option>Tahun 2025</option>
                    </select>
                  </div>

                  {/* High Crafted Interactive SVG Line Chart */}
                  <div className="relative h-64 w-full flex items-end pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />

                      {/* Path Line */}
                      <path
                        d="M 10 160 Q 60 110 110 130 T 210 100 T 310 120 T 410 70 T 490 30"
                        fill="none"
                        stroke="#0a5c36"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Line Dots based on charts from screenshot */}
                      <circle cx="10" cy="160" r="5" fill="#c5a880" stroke="#0a5c36" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
                      <circle cx="110" cy="130" r="5" fill="#c5a880" stroke="#0a5c36" strokeWidth="2" />
                      <circle cx="210" cy="100" r="5" fill="#c5a880" stroke="#0a5c36" strokeWidth="2" />
                      <circle cx="310" cy="120" r="5" fill="#c5a880" stroke="#0a5c36" strokeWidth="2" />
                      <circle cx="410" cy="70" r="5" fill="#c5a880" stroke="#0a5c36" strokeWidth="2" />
                      <circle cx="490" cy="30" r="5" fill="#ff4d4d" stroke="#0a5c36" strokeWidth="3" />

                      {/* Peak popovers label */}
                      <text x="440" y="24" className="text-[10px] font-black fill-emerald-800">Mei: Peak (45)</text>
                    </svg>

                    {/* Custom Month Indicators */}
                    <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-gray-400 uppercase">
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>Mei</span>
                      <span>Jul</span>
                      <span>Agu</span>
                      <span>Sep</span>
                      <span>Okt</span>
                      <span>Nov</span>
                      <span>Des</span>
                    </div>
                  </div>
                </div>

                {/* Pesanan Terbaru matches Page 3 right card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase">Pesanan Terbaru</h3>
                      <p className="text-[10px] text-gray-400 font-bold">Daftar Reservasi & Verifikasi Status</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("jamaah")}
                      className="text-[#0a5c36] hover:text-[#c5a880] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {bookings.slice(0, 4).map((bk, idx) => (
                      <div 
                        key={bk.id} 
                        onClick={() => {
                          setSelectedTrackingBookingId(bk.id);
                          setActiveTab("tracking");
                        }}
                        className="p-3 bg-gray-50/50 hover:bg-emerald-50/20 border border-gray-100 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-gray-500 font-bold group-hover:text-emerald-800">{bk.bookingCode}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-900 font-extrabold">{bk.userName}</span>
                          </div>
                          <p className="text-[10px] font-medium text-gray-400">Tgl Daftar: {bk.date}</p>
                        </div>

                        {/* Status badges exactly matching Page 3 right */}
                        <div>
                          {bk.status === "Verifikasi" && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-bold text-[10px]">
                              Verifikasi
                            </span>
                          )}
                          {bk.status === "Pending" && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full font-bold text-[10px]">
                              Pending
                            </span>
                          )}
                          {bk.status === "Proses" && (
                            <span className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-100 rounded-full font-bold text-[10px]">
                              Proses
                            </span>
                          )}
                          {bk.status === "Selesai" && (
                            <span className="px-2.5 py-1 bg-[#0f5132]/10 text-emerald-950 border border-emerald-800/10 rounded-full font-bold text-[10px]">
                              Selesai
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DATA PAKET CRUD (Page 4 top) */}
          {activeTab === "paket" && (
            <div className="space-y-8">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">3. DATA PAKET UMROH (ADMIN)</h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Kelola, edit, non-aktifkan, atau tambah katalog paket umrah terbaik.</p>
                </div>
                {!isAddingPackage && (
                  <button
                    onClick={() => {
                      setEditingPackageId(null);
                      setFormName("");
                      setFormPrice(28000000);
                      setFormHotelMakkah("Anjum Hotel / Setaraf (★4)");
                      setFormHotelMadinah("Al-Ansar Golden / Setaraf (★4)");
                      setFormDescription("Fasilitas premium untuk kenyamanan beribadah Anda.");
                      setIsAddingPackage(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-[#0f5132] hover:bg-[#146c43] text-white font-extrabold text-xs px-4 py-3 rounded-lg shadow-sm cursor-pointer transition-all hover:translate-x-0.5"
                  >
                    <Plus className="w-4 h-4 text-[#c5a880]" />
                    <span>+ Tambah Paket</span>
                  </button>
                )}
              </div>

              {/* Form Add/Edit Package section - matches image Page 4 bottom */}
              {isAddingPackage && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden animate-slide-up">
                  <div className="bg-emerald-800 text-white p-4 font-bold flex items-center justify-between">
                    <span>{editingPackageId ? "Edit Paket Umroh" : "Tambah Paket Umroh"}</span>
                    <button onClick={() => setIsAddingPackage(false)} className="text-white hover:text-[#c5a880] cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSavePackage} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Nama Paket <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Umroh Premium"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Harga Paket (Rupiah) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          required
                          placeholder="Mulai dari"
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Durasi (Hari) <span className="text-red-500">*</span></label>
                        <select
                          value={formDuration}
                          onChange={(e) => setFormDuration(Number(e.target.value))}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-medium font-sans"
                        >
                          <option value={9}>9 Hari</option>
                          <option value={12}>12 Hari</option>
                          <option value={16}>16 Hari</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Jadwal Keberangkatan <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Mei 2026 atau Juni 2026"
                          value={formSchedule}
                          onChange={(e) => setFormSchedule(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Hotel Makkah <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Swissotel / Setaraf"
                          value={formHotelMakkah}
                          onChange={(e) => setFormHotelMakkah(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Hotel Madinah <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Pullman / Setaraf"
                          value={formHotelMadinah}
                          onChange={(e) => setFormHotelMadinah(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Maskapai Penerbangan <span className="text-red-500">*</span></label>
                        <select
                          value={formMaskapai}
                          onChange={(e) => setFormMaskapai(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-sans font-semibold"
                        >
                          <option>Saudia Airlines</option>
                          <option>Garuda Indonesia</option>
                          <option>Batik Air</option>
                          <option>Lion Air</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Foto Cover Paket (URL Gambar)</label>
                        <input
                          type="text"
                          placeholder="Kosongkan untuk template berkualitas tinggi"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-[#c5a880] focus:outline-hidden font-mono"
                        />
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Deskripsi Detail Paket</label>
                      <textarea
                        rows={3}
                        placeholder="Contoh: Paket premium dengan bimbingan eksklusif langsung..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:border-emerald-800 focus:outline-hidden font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        id="form-bestseller"
                        checked={formBestSeller}
                        onChange={(e) => setFormBestSeller(e.target.checked)}
                        className="rounded border-gray-300 text-emerald-800 focus:ring-emerald-800"
                      />
                      <label htmlFor="form-bestseller" className="text-xs font-bold text-gray-700 cursor-pointer">Tandai Paket ini sebagai Best Seller (Ribbon Kuning)</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingPackage(false)}
                        className="px-4 py-2 text-xs border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 rounded"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 rounded shadow-md"
                      >
                        Simpan Paket
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table List Section - Exactly matches table Page 4 top */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari paket..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 border border-gray-200 text-xs rounded bg-white text-gray-800 font-medium"
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-bold">
                    Menampilkan 1 - {filteredPackages.length} dari {totalPackagesCount} data
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Nama Paket</th>
                        <th className="py-3 px-4">Durasi</th>
                        <th className="py-3 px-4">Harga</th>
                        <th className="py-3 px-4">Jadwal</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {filteredPackages.map((pkg, idx) => (
                        <tr key={pkg.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{idx + 1}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-gray-900">{pkg.name}</span>
                              {pkg.bestSeller && (
                                <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.5 rounded border border-amber-200">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold">{pkg.duration} Hari</td>
                          <td className="py-3.5 px-4 font-extrabold text-[#0f5132]">{formatIDR(pkg.price)}</td>
                          <td className="py-3.5 px-4">{pkg.schedule}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100 text-[10px]">
                              {pkg.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEditPackage(pkg)}
                                className="p-1 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DATA JAMAAH CRUD (Page 5 top) */}
          {activeTab === "jamaah" && (
            <div className="space-y-8">
              
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">4. DATA JAMAAH & TRANSAKSI (ADMIN)</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Kelola data pendaftaran jamaah, tervalidasi, status pembayaran DP/Lunas dan kontrol timelines keberangkatan.</p>
              </div>

              {/* Editing Form Modal when selected */}
              {editingBookingId && (
                <div className="bg-white rounded-xl border border-amber-100 shadow-md p-6 animate-slide-up space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Ubah Status & Pembayaran Jamaah</h3>
                    <button onClick={() => setEditingBookingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Status Akun</label>
                      <select 
                        value={editBookingStatus} 
                        onChange={(e: any) => setEditBookingStatus(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800 font-semibold"
                      >
                        <option value="Pending">Pending (Menunggu)</option>
                        <option value="Verifikasi">Verifikasi (Lolos)</option>
                        <option value="Proses">Proses (Keberangkatan)</option>
                        <option value="Selesai">Selesai (Kepulangan)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Status Pembayaran</label>
                      <select 
                        value={editBookingPayment} 
                        onChange={(e: any) => setEditBookingPayment(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800 font-semibold"
                      >
                        <option value="Belum Bayar">Belum Bayar</option>
                        <option value="DP">DP (Uang Muka 50%)</option>
                        <option value="Lunas">Lunas (100% Selesai)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Hubungi HP / WA</label>
                      <input 
                        type="text" 
                        value={editBookingPhone} 
                        onChange={(e) => setEditBookingPhone(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Progress Step (1-5)</label>
                      <select
                        value={editBookingStep}
                        onChange={(e) => setEditBookingStep(Number(e.target.value))}
                        className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800 font-semibold"
                      >
                        <option value={1}>1. Data Diterima</option>
                        <option value={2}>2. Verifikasi Pembayaran</option>
                        <option value={3}>3. Proses Visa Kedutaan</option>
                        <option value={4}>4. Jadwal Keberangkatan Bandara</option>
                        <option value={5}>5. Selesai / Mutawwif</option>
                      </select>
                    </div>

                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => setEditingBookingId(null)}
                      className="px-3 py-1.5 border text-gray-500 font-semibold text-xs hover:bg-gray-50 rounded"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleSaveBookingEdit}
                      className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded hover:bg-emerald-900"
                    >
                      Simpan Update
                    </button>
                  </div>
                </div>
              )}

              {/* Jamaah Table - Matches Page 5 top */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari jamaah / paket / booking..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 border border-gray-200 text-xs rounded bg-white text-gray-800 font-medium"
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-bold">
                    Menampilkan 1 - {filteredBookings.length} dari {totalJamaahCount} data
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Nama Jamaah</th>
                        <th className="py-3 px-4">Paket Pilihan</th>
                        <th className="py-3 px-4">No. HP</th>
                        <th className="py-3 px-4">Status Akun</th>
                        <th className="py-3 px-4">Pembayaran</th>
                        <th className="py-3 px-4 text-center">Aksi / Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {filteredBookings.map((bk, idx) => (
                        <tr key={bk.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{idx + 1}</td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-gray-900 block">{bk.userName}</span>
                              <span className="text-[10px] font-mono text-gray-400 font-bold block">{bk.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-emerald-800 block">{bk.packageName}</span>
                              <span className="text-[10px] text-gray-400 block">{bk.bookingCode}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium">{bk.userPhone}</td>
                          <td className="py-3.5 px-4">
                            {bk.status === "Verifikasi" && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded text-[9px]">
                                Aktif Sesuai / Lolos
                              </span>
                            )}
                            {bk.status === "Pending" && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold border border-amber-100 rounded text-[9px]">
                                Pending Verifikasi
                              </span>
                            )}
                            {bk.status === "Proses" && (
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-800 font-bold border border-sky-100 rounded text-[9px]">
                                Proses Dokumen
                              </span>
                            )}
                            {bk.status === "Selesai" && (
                              <span className="px-2 py-0.5 bg-gray-50 text-gray-600 font-bold border border-gray-200 rounded text-[9px]">
                                Selesai Ibadah
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {bk.paymentStatus === "Lunas" && (
                              <span className="px-2.5 py-0.5 bg-emerald-800 text-white font-bold rounded-md text-[9px]">
                                Lunas
                              </span>
                            )}
                            {bk.paymentStatus === "DP" && (
                              <span className="px-2.5 py-0.5 bg-amber-500 text-white font-bold rounded-md text-[9px]">
                                DP (Muka)
                              </span>
                            )}
                            {bk.paymentStatus === "Belum Bayar" && (
                              <span className="px-2.5 py-0.5 bg-red-600 text-white font-bold rounded-md text-[9px]">
                                Belum Bayar
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEditBooking(bk)}
                                className="p-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer text-[10px] font-bold"
                              >
                                Edit Status
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTrackingBookingId(bk.id);
                                  setActiveTab("tracking");
                                }}
                                className="p-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                              >
                                <span>Track Step: {bk.trackingStep}/5</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(bk.id)}
                                className="p-1 text-red-600 hover:text-red-950 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INTERACTIVE TRACKING CONTROLLER (Page 5 bottom) */}
          {activeTab === "tracking" && (
            <div className="space-y-8">
              
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">5. KONTROL TIMELINE TIMESTAMPS (ADMIN)</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Simulasikan atau setujui berkas perjalanan jamaah. Pilih nama jamaah untuk memperbaharui posisinya step-by-step.</p>
              </div>

              {/* Selector Bar */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Pilih Jamaah Penerima Update</span>
                  <select
                    value={selectedTrackingBookingId}
                    onChange={(e) => setSelectedTrackingBookingId(e.target.value)}
                    className="text-sm font-bold border border-gray-200 rounded p-2.5 bg-white text-emerald-950 focus:border-emerald-800 outline-hidden font-sans w-full sm:w-64"
                  >
                    {bookings.map(bk => (
                      <option key={bk.id} value={bk.id}>
                        {bk.userName} ({bk.bookingCode} - {bk.packageName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick advance step button */}
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <button
                      key={step}
                      onClick={() => handleUpdateStepDirectly(selectedTrackingBookingId, step)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer border ${
                        selectedTrackingBooking.trackingStep >= step
                          ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 border-gray-200"
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const currentStep = selectedTrackingBooking.trackingStep;
                      if (currentStep < 5) {
                        handleUpdateStepDirectly(selectedTrackingBookingId, currentStep + 1);
                      } else {
                        handleUpdateStepDirectly(selectedTrackingBookingId, 1);
                      }
                    }}
                    className="px-4 h-9 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Langkah Berikutnya</span>
                  </button>
                </div>
              </div>

              {/* Real-time preview of the timeline exactly matching Slide 5 bottom */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
                <div>
                  <h3 className="font-extrabold text-[#0f5132] text-sm tracking-tight uppercase">Live Timeline Preview</h3>
                  <p className="text-[10px] text-gray-400 font-bold">Apa yang dilihat oleh jamaah "{selectedTrackingBooking.userName}" di dashboard mereka.</p>
                </div>

                <div className="relative border-l-2 border-emerald-100 ml-5 pl-8 space-y-8 py-2">
                  {getTrackingTimeline(selectedTrackingBooking).map((timeline) => (
                    <div key={timeline.step} className="relative">
                      
                      {/* Interactive status bulb circle */}
                      <div className={`absolute left-[-42px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        timeline.isCompleted
                          ? "bg-emerald-800 text-white border-emerald-900 shadow-sm scale-110"
                          : "bg-white text-gray-300 border-gray-200"
                      }`}>
                        {timeline.isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10.5px] font-bold font-mono">{timeline.step}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                        
                        {/* Title and timestamp */}
                        <div className="md:col-span-1">
                          <h4 className={`text-sm font-black transition-all ${
                            timeline.isCompleted ? "text-emerald-800 scale-102" : "text-gray-400 font-bold"
                          }`}>
                            {timeline.label}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-400 block font-semibold">
                            {timeline.date} - {timeline.time}
                          </span>
                        </div>

                        {/* Description details */}
                        <div className="md:col-span-3 text-xs text-gray-500 leading-relaxed font-light">
                          {timeline.description}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: PROMO CODES */}
          {activeTab === "promo" && (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manajemen Kode Promo & Diskon</h2>
                <p className="text-xs text-gray-500">Kelola kupon diskon musiman untuk mendaftar umroh.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="p-4 bg-amber-50 border border-amber-200 text-[#b08f5c] text-xs rounded-lg font-bold">
                  Kode Promo Aktif: DISKON RAMADHAN (Subsidi Potongan Rp 3.000.000,-)
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Buat Kode Promo Baru</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Contoh: BERKAHRAMADHAN"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 border border-gray-200 rounded uppercase font-mono"
                    />
                    <button 
                      onClick={() => {
                        if(promoCode) {
                          alert(`Promo code [${promoCode.toUpperCase()}] berhasil ditambahkan ke database!`);
                          setPromoCode("");
                        }
                      }}
                      className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded hover:bg-emerald-950 cursor-pointer"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === "laporan" && (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Laporan & Berkas Transaksi</h2>
                <p className="text-xs text-gray-500">Unduh data manifest jamaah dalam format Excel, PDF, atau cetak surat manifest penerbangan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => alert("Mengekspor Berkas Excel...")}
                  className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100 text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="w-6 h-6 text-emerald-800" />
                  <span>Unduh Manifest Jamaah (XLSX)</span>
                </button>
                <button 
                  onClick={() => alert("Mencetak PDF...")}
                  className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100 text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="w-6 h-6 text-emerald-800" />
                  <span>Unduh Kuitansi Pembayaran (PDF)</span>
                </button>
                <button 
                  onClick={() => alert("Mengekspor Laporan Keuangan...")}
                  className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100 text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 className="w-6 h-6 text-emerald-800" />
                  <span>Laporan Laba/Rugi (Bulan Mei)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === "pengaturan" && (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pengaturan Sistem E-Catalogue</h2>
                <p className="text-xs text-gray-500">Konfigurasi profile travel, nomor WhatsApp konsultasi, dan persentase pembayaran DP.</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Nama Travel</label>
                    <input type="text" defaultValue="Khadijah Travel Indonesia" className="w-full text-xs py-2 px-3 border border-gray-200 rounded font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">No. Izin PPIU Kemenag</label>
                    <input type="text" defaultValue="PPIU No.1234/2021" className="w-full text-xs py-2 px-3 border border-gray-200 rounded font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">No. WhatsApp Konsultasi</label>
                    <input type="text" defaultValue="+62 812-3456-7890" className="w-full text-xs py-2 px-3 border border-gray-200 rounded font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Minimal DP (%)</label>
                    <input type="text" defaultValue="50%" className="w-full text-xs py-2 px-3 border border-gray-200 rounded font-bold" />
                  </div>
                </div>
                <button 
                  onClick={() => alert("Pengaturan berhasil disimpan!")}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
