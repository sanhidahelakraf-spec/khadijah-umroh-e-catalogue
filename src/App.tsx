import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PackageCard from "./components/PackageCard";
import PackageDetail from "./components/PackageDetail";
import BookingModal from "./components/BookingModal";
import LoginView from "./components/LoginView";
import AdminDashboard from "./components/AdminDashboard";
import JamaahDashboard from "./components/JamaahDashboard";
import TrackingSearchModal from "./components/TrackingSearchModal";
import { UmrohPackage, Booking, User } from "./types";
import { initialPackages, initialBookings, initialUsers } from "./data/initialData";
import { Phone, MapPin, Mail, Clock, HelpCircle, ArrowUpRight, ShieldCheck, Check } from "lucide-react";

export default function App() {
  // --- 1. Core State Initialization with Persistency ---
// --- 1. Core State ---
const [packages, setPackages] = React.useState<UmrohPackage[]>(initialPackages);
const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);
const [users, setUsers] = React.useState<User[]>(initialUsers);

// Ambil data dari backend saat pertama load
React.useEffect(() => {
  fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/paket')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) setPackages(data);
    })
    .catch(() => {});

  fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/pesanan')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) setBookings(data);
    })
    .catch(() => {});

  fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/jamaah')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) setUsers(data);
    })
    .catch(() => {});
}, []);
const refreshPackages = () => {
  fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/paket')
    .then(r => r.json())
    .then(data => { if (Array.isArray(data) && data.length > 0) setPackages(data); })
    .catch(() => {});
};

  // Active Screen View: "public" | "login" | "admin" | "jamaah"
  const [activeView, setActiveView] = React.useState<"public" | "login" | "admin" | "jamaah">("public");

  // Current Logged-in Auth states
  const [currentEmail, setCurrentEmail] = React.useState<string>("ahmad.fauzi@gmail.com");
  const [currentRole, setCurrentRole] = React.useState<"admin" | "jamaah" | null>("jamaah");

  // Detailed selected package (Defaults to Premium pkg for direct Slide 2 replication)
  const [selectedPackage, setSelectedPackage] = React.useState<UmrohPackage | null>(() => {
    return initialPackages.find(p => p.id === "pkg-premium") || initialPackages[0];
  });

  // Modal open controllers
  const [bookingModalPkg, setBookingModalPkg] = React.useState<UmrohPackage | null>(null);
  const [consultModalOpen, setConsultModalOpen] = React.useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = React.useState(false);
  const [successBooking, setSuccessBooking] = React.useState<Booking | null>(null);
  const [activePromo, setActivePromo] = React.useState<any>(null);

React.useEffect(() => {
  fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/promo/active')
    .then(r => r.json())
    .then(data => setActivePromo(data))
    .catch(() => {});
}, []);

  // --- 2. Action & Authentication Handlers ---
  const handleLoginSuccess = (email: string, role: "admin" | "jamaah") => {
    setCurrentEmail(email);
    setCurrentRole(role);
    setActiveView(role);
  };

  const handleLogout = () => {
    setCurrentEmail("");
    setCurrentRole(null);
    setActiveView("public");
  };

  // Triggered when client submits the online reservation form
const handleCreateBooking = async (details: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
  }) => {
    if (!bookingModalPkg) return;

    const orderNo = bookings.length + 1;
    const bCode = `UMR-2026-${orderNo.toString().padStart(3, "0")}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      bookingCode: bCode,
      userEmail: details.email,
      userName: details.fullName,
      userPhone: details.phone,
      packageId: bookingModalPkg.id,
      packageName: bookingModalPkg.name,
      price: bookingModalPkg.price,
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      }),
      status: "Pending",
      paymentStatus: "Belum Bayar",
      travelDate: "12 Mei 2026",
      trackingStep: 1,
      maskapai: bookingModalPkg.maskapai,
      hotelMakkah: bookingModalPkg.hotelMakkah,
      hotelMadinah: bookingModalPkg.hotelMadinah,
      duration: bookingModalPkg.duration,
      password: details.password,
    };

    // 1. Simpan pesanan ke database Railway
    await fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/pesanan', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newBooking)
    }).catch(() => {});

    // 2. Simpan jamaah baru ke database jika belum ada
    const userExist = users.some(u => u.email.toLowerCase() === details.email.toLowerCase());
    if (!userExist) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: details.email,
        name: details.fullName,
        role: "jamaah",
        phone: details.phone,
      };
      await fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/jamaah', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
      }).catch(() => {});
      setUsers(prev => [...prev, newUser]);
    }

    // 3. Kurangi kuota paket
    await fetch(`https://khadijah-umroh-e-catalogue-production.up.railway.app/api/paket/${bookingModalPkg.id}/booking`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    }).catch(() => {});

    // 4. Update state lokal
    setBookings(prev => [newBooking, ...prev]);
    setBookingModalPkg(null);
    setSuccessBooking(newBooking);
  };
  // Demo Switcher fast triggers
  const handleFastLoginAdmin = () => {
    handleLoginSuccess("admin@khadijah.com", "admin");
  };

  const handleFastLoginJamaah = () => {
    // defaults to Ahmad Fauzi UMR-2026-001 demo profile
    handleLoginSuccess("ahmad.fauzi@gmail.com", "jamaah");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col font-sans">
      
      {/* 2. Switch UI Views dynamically */}
      {activeView === "login" ? (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={() => setActiveView("public")}
        />
      ) : activeView === "admin" ? (
        <AdminDashboard
          currentEmail={currentEmail}
          packages={packages}
          bookings={bookings}
          users={users}
          onUpdatePackages={(pkgs) => {
  setPackages(pkgs);
  setTimeout(() => refreshPackages(), 500);
}}
          onUpdateBookings={setBookings}
          onLogout={handleLogout}
          onGoToPublic={() => setActiveView("public")}
        />
      ) : activeView === "jamaah" ? (
        <JamaahDashboard
          currentEmail={currentEmail}
          bookings={bookings}
          onUpdateBookings={setBookings}
          onLogout={handleLogout}
          onGoToPublic={() => setActiveView("public")}
        />
      ) : (
        /* PUBLIC CATALOG & INTRO WEB VIEW */
        <div className="flex-1 flex flex-col min-h-screen text-slate-700">
          
          {/* Header Component */}
          <Header
            onNavClick={(view) => setActiveView(view as any)}
            activeView={activeView}
            onOpenConsultation={() => setConsultModalOpen(true)}
            onOpenTrackingSearch={() => setTrackingModalOpen(true)}
          />

          {/* Hero Banner Component */}
          <Hero
            onScrollToPackages={() => {
              document.getElementById("paket-pilihan")?.scrollIntoView({ behavior: "smooth" });
            }}
            onOpenConsultation={() => setConsultModalOpen(true)}
          />

          {/* Core Packages Grid Section - Matches slide Page 2 title and subtexts */}
          <section id="paket-pilihan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0f5132] bg-[#0f5132]/10 px-3.5 py-1.5 rounded-full border border-[#0f5132]/20">
                Pilihan Paket Berkah
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Paket Umroh Pilihan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto">
                Berbagai pilihan paket umroh terbaik sesuai kebutuhan Anda. Kami menyediakan akomodasi hotel bintang 3 hingga 5 dengan kenyamanan terbaik.
              </p>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={(p) => {
                    setSelectedPackage(p);
                    setTimeout(() => {
                      document.getElementById("detail-paket")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Detail Paket Section (Renders Selected Package from slide specs Page 2 bottom) */}
          {selectedPackage && (
            <section className="py-12 bg-[#f8fafc] border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <PackageDetail
                  pkg={selectedPackage}
                  onBookNow={(p) => setBookingModalPkg(p)}
                />
              </div>
            </section>
          )}

          {/* Promo Banner Section */}
          <section id="promo-section" className="py-20 bg-[#0f5132] text-white relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(240,240,240,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(240,240,240,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {activePromo ? (
                <>
                  <div className="md:col-span-8 space-y-4 text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c5a880] block">Special Offers</span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                      {activePromo.title} {activePromo.discountAmount ? `Potongan ${new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(activePromo.discountAmount)}` : ""}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-100 font-light leading-relaxed">
                      {activePromo.description}
                    </p>
                  </div>
                  <div className="md:col-span-4 flex justify-center">
                    <button
                      onClick={() => {
                        const premPkg = packages.find(p => p.id === "pkg-premium") || packages[0];
                        setBookingModalPkg(premPkg);
                      }}
                      className="px-8 py-4 bg-white hover:bg-slate-100 text-[#0f5132] font-black rounded-xl text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer border border-[#c5a880]/40"
                    >
                      Klaim Diskon Sekarang
                    </button>
                  </div>
                </>
              ) : (
                <div className="md:col-span-12 text-center space-y-3 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c5a880] block">Special Offers</span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Diskon Belum Tersedia Saat Ini
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 font-light max-w-lg mx-auto">
                    Promo dan diskon spesial akan kami informasikan segera. Pantau terus halaman ini untuk penawaran menarik berikutnya.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Tentang Kami / Brand Trust */}
          <section id="tentang-kami" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-[#0f5132]/10 text-[#0f5132] text-xs font-bold px-3 py-1 rounded border border-[#0f5132]/20">
                Tentang Khadijah Travel
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Penyelenggara Perjalanan Ibadah Umroh (PPIU) Resmi Terbaik
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                PT.Khadijah Travel Indonesiadidirikan dengan visi melayani tamu-tamu Allah SWT dengan dedikasi tinggi, kejujuran, dan kehangatan keluarga. Merupakan PPIU berizin resmi dari Kementerian Agama RI, menjamin keamanan berkas paspor, akurasi visa, kenyamanan kabin penerbangan langsung, serta mutawwif mutasertifikasi syariah di bawah bimbingan ustadz ahli.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20">✓</div>
                  <span>Izin PPIU No.1234/2021 Kementerian Agama RI</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20">✓</div>
                  <span>Keberangkatan 100% On-Schedule & Tiket Transparan</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#0f5132]/10 flex items-center justify-center text-[#0f5132] border border-[#0f5132]/20">✓</div>
                  <span>Bimbingan Manasik Intensif Teori & Praktek Visual</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-96 relative border border-slate-200 shadow-lg">
              <img
                src="https://www.islamiclandmarks.com/wp-content/uploads/2023/05/interesting_facts_about_the_holy_kaaba_house_of_Allah.jpg"
                alt="Muslim pilgrims at mosque courtyard"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
          </section>

          {/* Polished Visual footer */}
          <footer className="bg-[#0f5132] text-slate-200 pt-16 pb-8 border-t border-[#0c4027] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
              
              {/* Box 1: Brand details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0c4027] flex items-center justify-center border border-[#1d7049]">
                    <svg className="w-5 h-5 text-[#c5a880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8 6 8 10 8 13.5C8 17 9.8 20 12 21.5C14.2 20 16 17 16 13.5C16 10 16 6 12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-sm block">KHADIJAH</span>
                    <span className="text-[9px] text-[#c5a880] block uppercase font-bold tracking-widest -mt-1">Travel Indonesia</span>
                  </div>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Melayani jamaah setulus hati, mengantar impian ibadah Anda meraih ketenangan jiwa dan keluhuran Umroh mabrur.
                </p>
                <div className="text-[10px] text-[#c5a880] font-bold">
                  PPIU No.1234/2021 Kemenag RI
                </div>
              </div>

              {/* Box 2: Useful buttons menu */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#c5a880] uppercase tracking-wider">Navigasi Pilihan</h4>
                <ul className="space-y-2 text-xs font-medium text-stone-300">
                  <li>
                    <button 
                      onClick={() => {
                        setSelectedPackage(packages.find(p => p.id === "pkg-premium") || packages[0]);
                        document.getElementById("detail-paket")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="hover:text-white hover:underline cursor-pointer"
                    >
                      Katalog Premium
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setTrackingModalOpen(true)}
                      className="hover:text-white hover:underline cursor-pointer"
                    >
                      Cek Tracking Pesanan
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setConsultModalOpen(true)}
                      className="hover:text-white hover:underline cursor-pointer"
                    >
                      Hubungi Admin / Konsultasi
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveView("login")}
                      className="hover:text-white hover:underline cursor-pointer text-[#c5a880]"
                    >
                      Login Area Jamaah
                    </button>
                  </li>
                </ul>
              </div>

              {/* Box 3: Contact offices */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#c5a880] uppercase tracking-wider">Kantor Cabang Utama</h4>
                <ul className="space-y-3 text-xs text-stone-400 font-light">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                    <span>Perumahan Poris Centrum No B23, RT.001/RW.007, Cipondoh Indah, Kec. Cipondoh, Kota Tangerang, Banten 15148</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                    <span> +62 813-9965-384 (WhatsApp)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                    <span>khadijahtravelid@gmail.com</span>
                  </li>
                </ul>
              </div>

              {/* Box 4: Jam operasional */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#c5a880] uppercase tracking-wider">Jam Operasional Layanan</h4>
                <ul className="space-y-2.5 text-xs text-stone-400 font-light">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#c5a880]" />
                    <span>Senin - Sabtu: 08:30 - 17:00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#c5a880]" />
                    <span>Ahad: (Janji Temu):</span>
                  </li>
                  <li className="text-[10px] text-amber-500 font-bold bg-[#1e1e1e] border border-[#2b2b2b] rounded p-2.5">
                    🚨 Pelayanan darurat darat Madinah/Makkah beroperasi 24 Jam Non-Stop selama musim umroh aktif.
                  </li>
                </ul>
              </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1e1e1e] mt-12 pt-6 text-center text-xs text-stone-500 font-medium">
              <p>© 2025 Khadijah Travel Indonesia (Sistem E-Catalogue & Manajemen Umroh Syariah). All Rights Reserved.</p>
            </div>
          </footer>

        </div>
      )}

      {/* --- 3. Persistent Action Modals & Sheets --- */}
      
      {/* 3.1 Booking Form Modal */}
      {bookingModalPkg && (
        <BookingModal
          pkg={bookingModalPkg}
          onClose={() => setBookingModalPkg(null)}
          onSubmit={handleCreateBooking}
        />
      )}

      {/* 3.2 Dynamic Interactive Booking Success Sheet */}
      {successBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="bg-[#252526] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#2b2b2b] text-center animate-scale-up">
            <div className="bg-[#323233] text-white p-8 space-y-3 flex flex-col items-center border-b border-[#1e1e1e]">
              <div className="h-16 w-16 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[#c5a880] border-4 border-[#2b2b2b] mb-1">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold font-sans">Alhamdulillah, Pemesanan Berhasil!</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">Pendaftaran paket Umroh Anda telah diterima di sistem kami. Mohon selesaikan berkas fisik ke kantor kami.</p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-5 text-xs text-gray-300 font-medium text-left bg-[#1e1e1e] border-b border-[#2b2b2b]">
              <div className="flex justify-between items-center text-sm font-extrabold pb-2 border-b border-[#2b2b2b]">
                <span className="text-stone-400">Kode Booking Anda:</span>
                <span className="text-[#c5a880] font-mono tracking-wider">{successBooking.bookingCode}</span>
              </div>
              <div>
                <span className="text-stone-400 font-bold block">Nama Calon Jamaah:</span>
                <span className="text-white font-extrabold text-sm block mt-0.5">{successBooking.userName}</span>
              </div>
              <div>
                <span className="text-stone-400 font-bold block">Paket Terpilih:</span>
                <span className="text-[#c5a880] font-extrabold block mt-0.5">{successBooking.packageName} ({successBooking.duration} Hari)</span>
              </div>
              <div className="p-3 bg-amber-950/25 border border-amber-900/35 rounded-lg text-[10px] text-stone-300 font-sans leading-relaxed">
                ℹ️ Gunakan email: <strong className="text-white font-bold font-mono">{successBooking.userEmail}</strong> & password pilihan Anda untuk melihat update status tracking visa / paspor Anda kapan saja.
              </div>
            </div>

            <div className="p-4 bg-[#252526] flex gap-3">
              <button
                onClick={() => {
                  setSuccessBooking(null);
                  setActiveView("public");
                }}
                className="flex-1 py-3 border border-[#2b2b2b] hover:bg-[#2d2d2d] text-xs font-black text-[#cccccc] rounded-lg cursor-pointer"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={() => {
                  setCurrentEmail(successBooking.userEmail);
                  setCurrentRole("jamaah");
                  setSuccessBooking(null);
                  setActiveView("jamaah");
                }}
                className="flex-1 py-3 bg-[#112a1d] hover:bg-[#193f2c] text-[#c5a880] text-xs font-black rounded-lg cursor-pointer flex items-center justify-center gap-1 border border-[#c5a880]/30 shadow-sm animate-pulse"
              >
                <span>Masuk Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3.3 Consultation details helper */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="bg-[#252526] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#2b2b2b] p-6 text-center space-y-4 text-[#cccccc]">
            <div className="w-12 h-12 bg-[#1e1e1e] text-[#c5a880] border border-[#2b2b2b] rounded-full flex items-center justify-center mx-auto mb-2">
              <Phone className="w-5 h-5 fill-[#c5a880]/10" />
            </div>
            <h3 className="font-bold text-white text-base">WhatsApp Konsultasi Khadijah</h3>
            <p className="text-xs text-[#9cdcfe] font-light leading-relaxed">
              Konsultasikan jadwal manasik, pembagian porsi kuota Kemenag, ketersediaan kamar hotel, dan validasi paspor langsung dengan ustadz pembimbing via WhatsApp.
            </p>
            <div className="p-3.5 bg-[#1e1e1e] rounded-lg font-mono font-bold text-[#c5a880] tracking-wide border border-[#2b2b2b] text-sm">
              +62 813-9965-384
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConsultModalOpen(false)}
                className="flex-1 py-2.5 border border-[#2b2b2b] text-xs font-bold rounded-lg hover:bg-[#323233] text-stone-300 cursor-pointer"
              >
                Tutup
              </button>
              <a
                href="https://wa.me/628139965384"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#112a1d] hover:bg-[#193f2c] text-[#c5a880] text-xs font-bold rounded-lg cursor-pointer block text-center border border-[#c5a880]/30"
              >
                Hubungi Langsung
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3.4 Tracking Search Modal */}
      {trackingModalOpen && (
        <TrackingSearchModal
          bookings={bookings}
          onClose={() => setTrackingModalOpen(false)}
        />
      )}

    </div>
  );
}
