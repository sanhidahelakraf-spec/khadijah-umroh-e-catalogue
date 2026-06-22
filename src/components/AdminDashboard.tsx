import React from "react";
import { 
  BarChart3, Users, Briefcase, DollarSign, Plus, Search, 
  Edit, Trash2, CheckCircle, Check, X,
  Menu, LogOut, Package, RefreshCw, FileText, Settings, Globe, UserPlus
} from "lucide-react";
import { UmrohPackage, Booking, User } from "../types";
import { getTrackingTimeline } from "../data/initialData";
import CompanyLogo from "./CompanyLogo";

const API = "https://khadijah-umroh-e-catalogue-production.up.railway.app/api";

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

type TabType = "dashboard" | "paket" | "jamaah" | "tracking" | "promo" | "laporan" | "pengaturan" | "users";

export default function AdminDashboard({
  currentEmail, packages, bookings, users,
  onUpdatePackages, onUpdateBookings, onLogout, onGoToPublic,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isAddingPackage, setIsAddingPackage] = React.useState(false);
  const [editingPackageId, setEditingPackageId] = React.useState<string | null>(null);
  const [promoCode, setPromoCode] = React.useState("");
  const [activePromo, setActivePromo] = React.useState<any>(null);
const [promoTitle, setPromoTitle] = React.useState("");
const [promoDescription, setPromoDescription] = React.useState("");
const [promoDiscountAmount, setPromoDiscountAmount] = React.useState(3000000);

React.useEffect(() => {
  fetch(`${API}/promo/active`)
    .then(r => r.json())
    .then(data => setActivePromo(data))
    .catch(() => {});
}, []);

const handleSetPromo = async () => {
  if (!promoTitle || !promoDescription) return alert("Judul dan deskripsi wajib diisi!");
  await fetch(`${API}/promo/set`, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: promoTitle, description: promoDescription, discountAmount: promoDiscountAmount })
  });
  setActivePromo({ title: promoTitle, description: promoDescription, discountAmount: promoDiscountAmount });
  setPromoTitle(""); setPromoDescription(""); setPromoDiscountAmount(3000000);
  alert("Promo berhasil diaktifkan!");
};

const handleDeactivatePromo = async () => {
  if (window.confirm("Matikan promo ini?")) {
    await fetch(`${API}/promo/deactivate`, { method: 'POST' });
    setActivePromo(null);
  }
};
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
  const [editingBookingId, setEditingBookingId] = React.useState<string | null>(null);
  const [editBookingStatus, setEditBookingStatus] = React.useState<"Verifikasi" | "Pending" | "Proses" | "Selesai">("Pending");
  const [editBookingPayment, setEditBookingPayment] = React.useState<"Lunas" | "DP" | "Belum Bayar">("Belum Bayar");
  const [editBookingPhone, setEditBookingPhone] = React.useState("");
  const [editBookingStep, setEditBookingStep] = React.useState(1);
  const [selectedTrackingBookingId, setSelectedTrackingBookingId] = React.useState<string>(bookings[0]?.id || "");

  // User management states
  const [adminList, setAdminList] = React.useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = React.useState("");
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserPassword, setNewUserPassword] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState<"admin" | "jamaah">("jamaah");
  const [newUserPhone, setNewUserPhone] = React.useState("");

  React.useEffect(() => {
    fetch(`${API}/admin`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAdminList(data); })
      .catch(() => {});
  }, []);

  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const totalPackagesCount = packages.length;
  const totalJamaahCount = bookings.length;
  const activeOrdersCount = bookings.filter(b => b.status === "Pending" || b.status === "Proses" || b.status === "Verifikasi").length;
  const totalIncome = bookings.filter(b => b.paymentStatus === "Lunas" || b.paymentStatus === "DP").reduce((sum, b) => sum + (b.paymentStatus === "Lunas" ? b.price : b.price * 0.5), 0);

  const filteredPackages = packages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBookings = bookings.filter(b => b.userName.toLowerCase().includes(searchQuery.toLowerCase()) || b.packageName.toLowerCase().includes(searchQuery.toLowerCase()) || b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()));

  const resetForm = () => {
    setIsAddingPackage(false); setEditingPackageId(null); setFormName("");
    setFormPrice(28000000); setFormDuration(12); setFormSchedule("Mei 2026");
    setFormHotelMakkah(""); setFormHotelMadinah(""); setFormMaskapai("Saudia Airlines");
    setFormDescription(""); setFormImage(""); setFormBestSeller(false);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;
    const imgUrl = formImage || "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=600&auto=format&fit=crop";
    if (editingPackageId) {
      const updatedPkg = { name: formName, price: Number(formPrice), duration: Number(formDuration), schedule: formSchedule, hotelMakkah: formHotelMakkah, hotelMadinah: formHotelMadinah, maskapai: formMaskapai, description: formDescription, image: imgUrl, bestSeller: formBestSeller };
      await fetch(`${API}/paket/${editingPackageId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedPkg) });
      onUpdatePackages(packages.map(p => p.id === editingPackageId ? { ...p, ...updatedPkg } : p));
    } else {
      const newPkg: UmrohPackage = { id: "pkg-" + Date.now(), name: formName, price: Number(formPrice), duration: Number(formDuration), schedule: formSchedule, status: "Aktif", hotelMakkah: formHotelMakkah || "Hotel Makkah (★4)", hotelMadinah: formHotelMadinah || "Hotel Madinah (★4)", maskapai: formMaskapai, description: formDescription || "Rencana perjalanan umroh dengan pelayanan terbaik.", image: imgUrl, bestSeller: formBestSeller };
      await fetch(`${API}/paket`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newPkg) });
      onUpdatePackages([...packages, newPkg]);
    }
    resetForm();
  };

  const startEditPackage = (pkg: UmrohPackage) => {
    setEditingPackageId(pkg.id); setFormName(pkg.name); setFormPrice(pkg.price);
    setFormDuration(pkg.duration); setFormSchedule(pkg.schedule); setFormHotelMakkah(pkg.hotelMakkah);
    setFormHotelMadinah(pkg.hotelMadinah); setFormMaskapai(pkg.maskapai); setFormDescription(pkg.description);
    setFormImage(pkg.image); setFormBestSeller(!!pkg.bestSeller); setIsAddingPackage(true);
  };

 const handleDeletePackage = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      await fetch(`${API}/paket/${id}`, { method: 'DELETE' }).catch(() => {});
      onUpdatePackages(packages.filter(p => p.id !== id));
    }
  };

  const startEditBooking = (b: Booking) => {
    setEditingBookingId(b.id); setEditBookingStatus(b.status);
    setEditBookingPayment(b.paymentStatus); setEditBookingPhone(b.userPhone);
    setEditBookingStep(b.trackingStep);
  };

  const handleSaveBookingEdit = async () => {
    if (!editingBookingId) return;
    const booking = bookings.find(b => b.id === editingBookingId);
    if (!booking) return;
    const updatedData = { status: editBookingStatus, paymentStatus: editBookingPayment, trackingStep: editBookingStep, travelDate: booking.travelDate };
    await fetch(`${API}/pesanan/${editingBookingId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    onUpdateBookings(bookings.map(b => b.id === editingBookingId ? { ...b, status: editBookingStatus, paymentStatus: editBookingPayment, userPhone: editBookingPhone, trackingStep: editBookingStep } : b));
    setEditingBookingId(null);
  };

const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Hapus data jamaah ini?")) {
      await fetch(`${API}/pesanan/${id}`, { method: 'DELETE' }).catch(() => {});
      onUpdateBookings(bookings.filter(b => b.id !== id));
    }
  };
  const handleUpdateStepDirectly = async (id: string, step: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    await fetch(`${API}/pesanan/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: booking.status, paymentStatus: booking.paymentStatus, trackingStep: step, travelDate: booking.travelDate }) });
    onUpdateBookings(bookings.map(b => b.id === id ? { ...b, trackingStep: step } : b));
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserName) return alert("Email dan nama wajib diisi!");
    if (newUserRole === "admin") {
      if (!newUserPassword) return alert("Password wajib diisi untuk admin!");
      await fetch(`${API}/admin`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: newUserEmail, name: newUserName, password: newUserPassword, role: "admin" }) });
      const res = await fetch(`${API}/admin`);
      const data = await res.json();
      setAdminList(data);
    } else {
      const newJamaah = { id: `user-${Date.now()}`, email: newUserEmail, name: newUserName, role: "jamaah", phone: newUserPhone };
      await fetch(`${API}/jamaah`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newJamaah) });
      onUpdateBookings(bookings); // trigger refresh
    }
    setNewUserEmail(""); setNewUserName(""); setNewUserPassword(""); setNewUserPhone("");
    alert(`User ${newUserRole} berhasil ditambahkan!`);
  };

  const selectedTrackingBooking = bookings.find(b => b.id === selectedTrackingBookingId) || bookings[0];

 const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4 text-[#c5a880]" /> },
    { id: "paket", label: "Paket Umroh", icon: <Briefcase className="w-4 h-4 text-[#c5a880]" /> },
    { id: "jamaah", label: "Data Jamaah", icon: <Users className="w-4 h-4 text-[#c5a880]" /> },
    { id: "tracking", label: "Tracking Order", icon: <RefreshCw className="w-4 h-4 text-[#c5a880]" /> },
    { id: "promo", label: "Promo & Hub", icon: <FileText className="w-4 h-4 text-[#c5a880]" /> },
    { id: "users", label: "Manajemen User", icon: <UserPlus className="w-4 h-4 text-[#c5a880]" /> },
    { id: "pengaturan", label: "Pengaturan", icon: <Settings className="w-4 h-4 text-[#c5a880]" /> },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc] flex flex-col md:flex-row font-mono relative overflow-x-hidden">
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-30 bg-black/60 md:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#252526] flex-shrink-0 flex flex-col justify-between py-6 px-4 border-r border-[#1e1e1e] transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="space-y-8">
          <div className="px-2 flex items-center justify-between">
            <div>
              <CompanyLogo variant="compact" iconSize="sm" theme="dark" />
              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider mt-1.5 pl-1 font-sans">Admin Server</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#cccccc] hover:text-[#c5a880] md:hidden cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${activeTab === item.id ? "bg-[#37373d] text-white border-l-4 border-l-[#007acc]" : "hover:bg-[#2d2d2d] text-[#cccccc] hover:text-[#c5a880]"}`}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-6 border-t border-[#1e1e1e] space-y-2">
          <button onClick={() => { onGoToPublic(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-[#2d2d2d] cursor-pointer">
            <Globe className="w-4 h-4 text-[#c5a880]" /><span>Kunjungi Web Publik</span>
          </button>
          <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-[#2d2d2d]/50 cursor-pointer">
            <LogOut className="w-4 h-4" /><span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="bg-[#252526] border-b border-[#1e1e1e] py-5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 px-2 border border-[#2b2b2b] rounded-md bg-[#1e1e1e] text-[#c5a880] hover:text-white md:hidden cursor-pointer">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-extrabold uppercase bg-[#1e1e1e] text-[#c5a880] border border-[#2b2b2b] px-3 py-1 rounded">Super Admin Mode</span>
            <h1 className="text-lg font-bold text-white hidden sm:block">Sistem E-Catalogue & Manajemen Jamaah</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-white block">Admin Super</span>
              <span className="text-[10px] text-gray-500 block">{currentEmail}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2b2b2b] flex items-center justify-center font-bold text-[#c5a880]">AD</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8 flex-1">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">DASHBOARD ADMIN</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between">
                  <div><span className="text-xs text-gray-400 font-bold uppercase block">Total Paket</span><strong className="text-3xl font-black text-gray-900 block">{totalPackagesCount}</strong></div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center"><Package className="w-6 h-6 text-emerald-700" /></div>
                </div>
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between">
                  <div><span className="text-xs text-gray-400 font-bold uppercase block">Total Jamaah</span><strong className="text-3xl font-black text-gray-900 block">{totalJamaahCount}</strong></div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center"><Users className="w-6 h-6 text-amber-700" /></div>
                </div>
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between">
                  <div><span className="text-xs text-gray-400 font-bold uppercase block">Pesanan Aktif</span><strong className="text-3xl font-black text-gray-900 block">{activeOrdersCount}</strong></div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-sky-700" /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-3">
                <h3 className="font-extrabold text-[#0f5132] text-sm uppercase">Pesanan Terbaru</h3>
                <div className="space-y-2">
                  {bookings.slice(0, 5).map(bk => (
                    <div key={bk.id} onClick={() => { setSelectedTrackingBookingId(bk.id); setActiveTab("tracking"); }} className="p-3 bg-gray-50 hover:bg-emerald-50/20 border border-gray-100 rounded-lg flex items-center justify-between text-xs cursor-pointer">
                      <div><span className="font-mono text-gray-500 font-bold">{bk.bookingCode}</span> | <span className="font-extrabold text-gray-900">{bk.userName}</span></div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${bk.status === "Verifikasi" ? "bg-emerald-50 text-emerald-800" : bk.status === "Pending" ? "bg-amber-50 text-amber-800" : bk.status === "Proses" ? "bg-sky-50 text-sky-800" : "bg-gray-50 text-gray-600"}`}>{bk.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAKET */}
          {activeTab === "paket" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h2 className="text-xl sm:text-2xl font-black text-gray-900">DATA PAKET UMROH</h2></div>
                {!isAddingPackage && (
                  <button onClick={() => { setEditingPackageId(null); setFormName(""); setFormPrice(28000000); setFormHotelMakkah(""); setFormHotelMadinah(""); setFormDescription(""); setIsAddingPackage(true); }}
                    className="flex items-center gap-2 bg-[#0f5132] hover:bg-[#146c43] text-white font-extrabold text-xs px-4 py-3 rounded-lg cursor-pointer">
                    <Plus className="w-4 h-4 text-[#c5a880]" /><span>+ Tambah Paket</span>
                  </button>
                )}
              </div>
              {isAddingPackage && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
                  <div className="bg-emerald-800 text-white p-4 font-bold flex items-center justify-between">
                    <span>{editingPackageId ? "Edit Paket" : "Tambah Paket"}</span>
                    <button onClick={resetForm} className="text-white hover:text-[#c5a880] cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSavePackage} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Nama Paket *</label><input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Harga (Rp) *</label><input type="number" required value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Durasi</label><select value={formDuration} onChange={e => setFormDuration(Number(e.target.value))} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden"><option value={9}>9 Hari</option><option value={12}>12 Hari</option><option value={16}>16 Hari</option></select></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Jadwal</label><input type="text" required value={formSchedule} onChange={e => setFormSchedule(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Hotel Makkah *</label><input type="text" required value={formHotelMakkah} onChange={e => setFormHotelMakkah(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Hotel Madinah *</label><input type="text" required value={formHotelMadinah} onChange={e => setFormHotelMadinah(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Maskapai</label><select value={formMaskapai} onChange={e => setFormMaskapai(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden"><option>Saudia Airlines</option><option>Garuda Indonesia</option><option>Batik Air</option><option>Lion Air</option></select></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">URL Foto</label><input type="text" value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="Kosongkan untuk default" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden font-mono" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Deskripsi</label><textarea rows={3} value={formDescription} onChange={e => setFormDescription(e.target.value)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden" /></div>
                    <div className="flex items-center gap-2"><input type="checkbox" id="bs" checked={formBestSeller} onChange={e => setFormBestSeller(e.target.checked)} /><label htmlFor="bs" className="text-xs font-bold text-gray-700 cursor-pointer">Tandai sebagai Best Seller</label></div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={resetForm} className="px-4 py-2 text-xs border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 rounded">Batal</button>
                      <button type="submit" className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 rounded">Simpan Paket</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <div className="relative w-72"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input type="text" placeholder="Cari paket..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3.5 py-2 border border-gray-200 text-xs rounded bg-white text-gray-800" /></div>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr><th className="py-3 px-4">No</th><th className="py-3 px-4">Nama Paket</th><th className="py-3 px-4">Durasi</th><th className="py-3 px-4">Harga</th><th className="py-3 px-4">Jadwal</th><th className="py-3 px-4">Status</th><th className="py-3 px-4 text-center">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {filteredPackages.map((pkg, idx) => (
                        <tr key={pkg.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{idx + 1}</td>
                          <td className="py-3.5 px-4"><div className="flex items-center gap-2"><span className="font-extrabold text-gray-900">{pkg.name}</span>{pkg.bestSeller && <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.5 rounded">Best Seller</span>}</div></td>
                          <td className="py-3.5 px-4 font-bold">{pkg.duration} Hari</td>
                          <td className="py-3.5 px-4 font-extrabold text-[#0f5132]">{formatIDR(pkg.price)}</td>
                          <td className="py-3.5 px-4">{pkg.schedule}</td>
                          <td className="py-3.5 px-4"><span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100 text-[10px]">{pkg.status}</span></td>
                          <td className="py-3.5 px-4"><div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEditPackage(pkg)} className="p-1 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"><Edit className="w-3 h-3" /><span>Edit</span></button>
                            <button onClick={() => handleDeletePackage(pkg.id)} className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"><Trash2 className="w-3 h-3" /><span>Hapus</span></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* JAMAAH */}
          {activeTab === "jamaah" && (
            <div className="space-y-8">
              <div><h2 className="text-xl sm:text-2xl font-black text-gray-900">DATA JAMAAH & TRANSAKSI</h2></div>
              {editingBookingId && (
                <div className="bg-white rounded-xl border border-amber-100 shadow-md p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">Ubah Status Jamaah</h3>
                    <button onClick={() => setEditingBookingId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">Status</label><select value={editBookingStatus} onChange={(e: any) => setEditBookingStatus(e.target.value)} className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800"><option value="Pending">Pending</option><option value="Verifikasi">Verifikasi</option><option value="Proses">Proses</option><option value="Selesai">Selesai</option></select></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">Pembayaran</label><select value={editBookingPayment} onChange={(e: any) => setEditBookingPayment(e.target.value)} className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800"><option value="Belum Bayar">Belum Bayar</option><option value="DP">DP</option><option value="Lunas">Lunas</option></select></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">No. HP</label><input type="text" value={editBookingPhone} onChange={e => setEditBookingPhone(e.target.value)} className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800 font-mono" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">Progress Step</label><select value={editBookingStep} onChange={e => setEditBookingStep(Number(e.target.value))} className="w-full text-xs py-2 px-3 border border-gray-200 rounded bg-white text-gray-800"><option value={1}>1. Data Diterima</option><option value={2}>2. Verifikasi Pembayaran</option><option value={3}>3. Proses Visa</option><option value={4}>4. Jadwal Keberangkatan</option><option value={5}>5. Selesai</option></select></div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => setEditingBookingId(null)} className="px-3 py-1.5 border text-gray-500 font-semibold text-xs hover:bg-gray-50 rounded">Batal</button>
                    <button onClick={handleSaveBookingEdit} className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded hover:bg-emerald-900">Simpan Update</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <div className="relative w-72"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input type="text" placeholder="Cari jamaah..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3.5 py-2 border border-gray-200 text-xs rounded bg-white text-gray-800" /></div>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr><th className="py-3 px-4">No</th><th className="py-3 px-4">Nama Jamaah</th><th className="py-3 px-4">Paket</th><th className="py-3 px-4">No. HP</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Pembayaran</th><th className="py-3 px-4 text-center">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {filteredBookings.map((bk, idx) => (
                        <tr key={bk.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{idx + 1}</td>
                          <td className="py-3.5 px-4"><span className="font-extrabold text-gray-900 block">{bk.userName}</span><span className="text-[10px] font-mono text-gray-400">{bk.userEmail}</span></td>
                          <td className="py-3.5 px-4"><span className="font-extrabold text-emerald-800 block">{bk.packageName}</span><span className="text-[10px] text-gray-400">{bk.bookingCode}</span></td>
                          <td className="py-3.5 px-4 font-mono">{bk.userPhone}</td>
                          <td className="py-3.5 px-4"><span className={`px-2 py-0.5 font-bold rounded text-[9px] ${bk.status === "Verifikasi" ? "bg-emerald-50 text-emerald-800" : bk.status === "Pending" ? "bg-amber-50 text-amber-800" : bk.status === "Proses" ? "bg-sky-50 text-sky-800" : "bg-gray-50 text-gray-600"}`}>{bk.status}</span></td>
                          <td className="py-3.5 px-4"><span className={`px-2.5 py-0.5 font-bold rounded-md text-[9px] text-white ${bk.paymentStatus === "Lunas" ? "bg-emerald-800" : bk.paymentStatus === "DP" ? "bg-amber-500" : "bg-red-600"}`}>{bk.paymentStatus}</span></td>
                          <td className="py-3.5 px-4"><div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEditBooking(bk)} className="p-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer text-[10px] font-bold">Edit</button>
                            <button onClick={() => { setSelectedTrackingBookingId(bk.id); setActiveTab("tracking"); }} className="p-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 cursor-pointer text-[10px] font-bold">Track {bk.trackingStep}/5</button>
                            <button onClick={() => handleDeleteBooking(bk.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TRACKING */}
          {activeTab === "tracking" && (
            <div className="space-y-8">
              <div><h2 className="text-xl sm:text-2xl font-black text-gray-900">KONTROL TIMELINE TRACKING</h2></div>
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <select value={selectedTrackingBookingId} onChange={e => setSelectedTrackingBookingId(e.target.value)} className="text-sm font-bold border border-gray-200 rounded p-2.5 bg-white text-emerald-950 outline-hidden font-sans w-full sm:w-64">
                  {bookings.map(bk => <option key={bk.id} value={bk.id}>{bk.userName} ({bk.bookingCode})</option>)}
                </select>
                <div className="flex gap-2.5">
                  {[1,2,3,4,5].map(step => (
                    <button key={step} onClick={() => handleUpdateStepDirectly(selectedTrackingBookingId, step)} className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black cursor-pointer border ${selectedTrackingBooking?.trackingStep >= step ? "bg-emerald-800 text-white border-emerald-900" : "bg-gray-100 text-gray-400 border-gray-200"}`}>{step}</button>
                  ))}
                  <button onClick={() => { const s = selectedTrackingBooking?.trackingStep || 0; handleUpdateStepDirectly(selectedTrackingBookingId, s < 5 ? s + 1 : 1); }} className="px-4 h-9 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-lg cursor-pointer">Langkah Berikutnya</button>
                </div>
              </div>
              {selectedTrackingBooking && (
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
                  <h3 className="font-extrabold text-[#0f5132] text-sm uppercase">Live Timeline - {selectedTrackingBooking.userName}</h3>
                  <div className="relative border-l-2 border-emerald-100 ml-5 pl-8 space-y-8 py-2">
                    {getTrackingTimeline(selectedTrackingBooking).map(timeline => (
                      <div key={timeline.step} className="relative">
                        <div className={`absolute left-[-42px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 ${timeline.isCompleted ? "bg-emerald-800 text-white border-emerald-900" : "bg-white text-gray-300 border-gray-200"}`}>
                          {timeline.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10.5px] font-bold font-mono">{timeline.step}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div><h4 className={`text-sm font-black ${timeline.isCompleted ? "text-emerald-800" : "text-gray-400"}`}>{timeline.label}</h4><span className="text-[10px] font-mono text-gray-400">{timeline.date} - {timeline.time}</span></div>
                          <div className="md:col-span-3 text-xs text-gray-500">{timeline.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROMO */}
          {activeTab === "promo" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">MANAJEMEN PROMO</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Atur banner diskon yang tampil di halaman publik.</p>
              </div>

              {activePromo && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-bold flex items-center justify-between">
                  <span>Promo Aktif: {activePromo.title}</span>
                  <button onClick={handleDeactivatePromo} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 text-[10px] font-bold cursor-pointer">
                    Matikan Promo
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-3">Buat / Update Promo</h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Judul Promo *</label>
                  <input type="text" value={promoTitle} onChange={e => setPromoTitle(e.target.value)} placeholder="Contoh: Subsidi Khusus Diskon Ramadhan" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Deskripsi Promo *</label>
                  <textarea rows={3} value={promoDescription} onChange={e => setPromoDescription(e.target.value)} placeholder="Contoh: Dapatkan potongan subsidi dana keberangkatan..." className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Jumlah Diskon (Rp) *</label>
                  <input type="number" value={promoDiscountAmount} onChange={e => setPromoDiscountAmount(Number(e.target.value))} placeholder="3000000" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSetPromo} className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 rounded shadow-md cursor-pointer">
                    Aktifkan Promo
                  </button>
                </div>
              </div>
            </div>
          )}

          

          {/* MANAJEMEN USER */}
          {activeTab === "users" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">MANAJEMEN USER</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Tambah atau hapus admin dan jamaah.</p>
              </div>

              {/* Form tambah user */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-3">Tambah User Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Nama Lengkap *</label>
                    <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Nama lengkap" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Email *</label>
                    <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="email@example.com" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">No. HP</label>
                    <input type="text" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} placeholder="08xx-xxxx-xxxx" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Role</label>
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden">
                      <option value="jamaah">Jamaah</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {newUserRole === "admin" && (
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block">Password (khusus admin) *</label>
                      <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Password admin" className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded bg-white text-gray-800 focus:outline-hidden focus:border-emerald-800" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleAddUser} className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 rounded shadow-md cursor-pointer flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /><span>Tambah User</span>
                  </button>
                </div>
              </div>

              {/* Daftar Admin */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-3">Daftar Admin ({adminList.length})</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr><th className="py-3 px-4">Nama</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Role</th><th className="py-3 px-4 text-center">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {adminList.map(admin => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold">{admin.name}</td>
                          <td className="py-3 px-4">{admin.email}</td>
                          <td className="py-3 px-4"><span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">{admin.role}</span></td>
                          <td className="py-3 px-4 text-center">
                            <button onClick={async () => {
                              if (window.confirm("Hapus admin ini?")) {
                                await fetch(`${API}/admin/${admin.id}`, { method: 'DELETE' });
                                setAdminList(prev => prev.filter(a => a.id !== admin.id));
                              }
                            }} className="p-1 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer text-[10px] font-bold">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Daftar Jamaah */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-3">Daftar Jamaah Terdaftar ({users.length})</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0f5132]/5 text-emerald-950 font-extrabold uppercase border-b border-gray-100">
                      <tr><th className="py-3 px-4">Nama</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">No. HP</th><th className="py-3 px-4 text-center">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold">{u.name}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4 font-mono">{u.phone}</td>
                          <td className="py-3 px-4 text-center">
                            <button onClick={async () => {
                              if (window.confirm("Hapus jamaah ini?")) {
                                await fetch(`${API}/jamaah/${u.id}`, { method: 'DELETE' });
                                onUpdateBookings(bookings.filter(b => b.userEmail !== u.email));
                              }
                            }} className="p-1 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer text-[10px] font-bold">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PENGATURAN */}
          {activeTab === "pengaturan" && (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Pengaturan Sistem</h2>
              <div className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">Nama Travel</label><input type="text" defaultValue="Khadijah Travel Indonesia" className="w-full text-xs py-2 px-3 border border-gray-200 rounded" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">No. Izin PPIU</label><input type="text" defaultValue="PPIU No.1234/2021" className="w-full text-xs py-2 px-3 border border-gray-200 rounded" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">No. WhatsApp</label><input type="text" defaultValue=" +62 813-9965-384" className="w-full text-xs py-2 px-3 border border-gray-200 rounded" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-600 block">Minimal DP (%)</label><input type="text" defaultValue="50%" className="w-full text-xs py-2 px-3 border border-gray-200 rounded" /></div>
                </div>
                <button onClick={() => alert("Pengaturan disimpan!")} className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded cursor-pointer">Simpan Perubahan</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}