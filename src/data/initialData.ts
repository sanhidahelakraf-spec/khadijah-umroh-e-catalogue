import { UmrohPackage, Booking, User } from "../types";

export const initialPackages: UmrohPackage[] = [
  {
    id: "pkg-ekonomis",
    name: "Umroh Ekonomis",
    duration: 9,
    price: 21900000,
    schedule: "Mei 2026",
    status: "Aktif",
    description: "Paket Umroh Ekonomis dengan pelayanan terbaik dan akomodasi nyaman yang sangat dekat dengan area Masjid Al-Haram dan Masjid Nabawi.",
    hotelMakkah: "Louloua Al-Sharq / Setaraf (★3)",
    hotelMadinah: "Al-Eiman Nour / Setaraf (★3)",
    maskapai: "AirAsia X / Lion Air",
    image: "https://wallpapercave.com/wp/wp2182984.jpg",
    bestSeller: false,
  },
  {
    id: "pkg-reguler",
    name: "Umroh Reguler",
    duration: 12,
    price: 28900000,
    schedule: "Mei 2026",
    status: "Aktif",
    description: "Paket Umroh Reguler dengan durasi perjalanan ideal dan akomodasi hotel bintang 4 yang strategis, membuat ibadah Anda lebih khusyuk.",
    hotelMakkah: "Anjum Hotel / Setaraf (★4)",
    hotelMadinah: "Al-Ansar Golden / Setaraf (★4)",
    maskapai: "Batik Air / Flynas",
    image: "https://wallpapercave.com/wp/wp2182984.jpg",
    bestSeller: false,
  },
  {
    id: "pkg-premium",
    name: "Umroh Premium",
    duration: 12,
    price: 35000000,
    schedule: "Juni 2026",
    status: "Aktif",
    description: "Paket umroh premium dengan pelayanan terbaik untuk kenyamanan ibadah Anda. Hotel bintang 5 langsung menghadap pelataran masjid, maskapai penerbangan langsung tanpa transit, dan pembimbing berpengalaman.",
    hotelMakkah: "Swissotel / Setaraf (★5)",
    hotelMadinah: "Pullman / Setaraf (★5)",
    maskapai: "Saudia Airlines",
    image: "https://wallpapercave.com/wp/wp2182984.jpg",
    bestSeller: true,
  },
  {
    id: "pkg-private",
    name: "Umroh Private",
    duration: 16,
    price: 48900000,
    schedule: "Juni 2026",
    status: "Aktif",
    description: "Nikmati perjalanan ibadah eksklusif bersama keluarga tercinta dengan paket Private. Jadwal bimbingan private yang fleksibel, hotel super luxury, dan penerbangan terbaik.",
    hotelMakkah: "Fairmont Makkah Clock Royal Tower (★5)",
    hotelMadinah: "The Oberoi Madinah (★5)",
    maskapai: "Saudia Airlines (Business Class)",
    image: "https://wallpapercave.com/wp/wp2182984.jpg",
    bestSeller: false,
  },
];

export const initialBookings: Booking[] = [
  {
    id: "booking-001",
    bookingCode: "UMR-2026-001",
    userEmail: "ahmad.fauzi@gmail.com",
    userName: "Ahmad Fauzi",
    userPhone: "0812-3456-7890",
    packageId: "pkg-premium",
    packageName: "Umroh VIP", // to match Page 3 table
    price: 35000000,
    date: "12 Mei 2026",
    status: "Verifikasi",
    paymentStatus: "Lunas",
    travelDate: "20 Mei 2026",
    trackingStep: 4, // 4 means completed up to Step 4
    maskapai: "Saudi Airlines",
    hotelMakkah: "Movenpick",
    hotelMadinah: "Dallah Taibah",
    duration: 16, // matching specs from Page 3 bottom: duration 16 days under Ahmad Fauzi profile
  },
  {
    id: "booking-002",
    bookingCode: "UMR-2026-002",
    userEmail: "siti.aliyah@gmail.com",
    userName: "Siti Aliyah",
    userPhone: "0813-2345-6789",
    packageId: "pkg-reguler",
    packageName: "Umroh Reguler",
    price: 28900000,
    date: "11 Mei 2026",
    status: "Pending",
    paymentStatus: "DP",
    travelDate: "12 Mei 2026", // matching table Page 5
    trackingStep: 2,
    maskapai: "Batik Air",
    hotelMakkah: "Anjum Hotel",
    hotelMadinah: "Al-Ansar Golden",
    duration: 12,
  },
  {
    id: "booking-003",
    bookingCode: "UMR-2026-003",
    userEmail: "rizky.maulana@gmail.com",
    userName: "Rizky Maulana",
    userPhone: "0814-2233-4455",
    packageId: "pkg-premium",
    packageName: "Umroh Premium",
    price: 35000000,
    date: "10 Mei 2026",
    status: "Proses",
    paymentStatus: "Lunas",
    travelDate: "12 Mei 2026",
    trackingStep: 3,
    maskapai: "Saudia Airlines",
    hotelMakkah: "Swissotel",
    hotelMadinah: "Pullman",
    duration: 12,
  },
  {
    id: "booking-004",
    bookingCode: "UMR-2026-004",
    userEmail: "dewi.sartika@gmail.com",
    userName: "Dewi Sartika",
    userPhone: "0815-6677-8899",
    packageId: "pkg-ekonomis",
    packageName: "Umroh Ekonomis",
    price: 21900000,
    date: "09 Mei 2026",
    status: "Pending", // Page 5 says status: Pending, Pembayaran: Belum Bayar
    paymentStatus: "Belum Bayar",
    travelDate: "12 Mei 2026",
    trackingStep: 1,
    maskapai: "Lion Air",
    hotelMakkah: "Louloua Al-Sharq",
    hotelMadinah: "Al-Eiman Nour",
    duration: 9,
  },
];

export const initialUsers: User[] = [
  {
    id: "user-admin",
    email: "admin@khadijah.com",
    name: "Admin Super",
    role: "admin",
    phone: "0811-1111-2222",
  },
  {
    id: "user-ahmad",
    email: "ahmad.fauzi@gmail.com",
    name: "Ahmad Fauzi",
    role: "jamaah",
    phone: "0812-3456-7890",
  },
  {
    id: "user-siti",
    email: "siti.aliyah@gmail.com",
    name: "Siti Aliyah",
    role: "jamaah",
    phone: "0813-2345-6789",
  },
  {
    id: "user-rizky",
    email: "rizky.maulana@gmail.com",
    name: "Rizky Maulana",
    role: "jamaah",
    phone: "0814-2233-4455",
  },
  {
    id: "user-dewi",
    email: "dewi.sartika@gmail.com",
    name: "Dewi Sartika",
    role: "jamaah",
    phone: "0815-6677-8899",
  },
];

export const getTrackingTimeline = (booking: Booking) => {
  const formatTimestamp = (ts?: string) => {
    if (!ts) return { date: "-", time: "-" };
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
      time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const s1 = formatTimestamp(booking.step1Date);
  const s2 = formatTimestamp(booking.step2Date);
  const s3 = formatTimestamp(booking.step3Date);
  const s4 = formatTimestamp(booking.step4Date);
  const s5 = formatTimestamp(booking.step5Date);

  return [
    {
      step: 1,
      label: "Data diterima",
      date: booking.step1Date ? s1.date : booking.date,
      time: booking.step1Date ? s1.time : "-",
      description: "Pendaftaran online & kelengkapan berkas berhasil diterima oleh Admin.",
      isCompleted: booking.trackingStep >= 1,
    },
    {
      step: 2,
      label: "Verifikasi pembayaran",
      date: booking.trackingStep >= 2 ? s2.date : "-",
      time: booking.trackingStep >= 2 ? s2.time : "-",
      description: `Pembayaran status [${booking.paymentStatus}] terverifikasi di sistem kami.`,
      isCompleted: booking.trackingStep >= 2,
    },
    {
      step: 3,
      label: "Proses visa",
      date: booking.trackingStep >= 3 ? s3.date : "-",
      time: booking.trackingStep >= 3 ? s3.time : "-",
      description: "Dokumen paspor dan suntik meningitis diproses ke Kedutaan Saudi.",
      isCompleted: booking.trackingStep >= 3,
    },
    {
      step: 4,
      label: "Jadwal keberangkatan",
      date: booking.trackingStep >= 4 ? s4.date : booking.travelDate,
      time: booking.trackingStep >= 4 ? s4.time : "-",
      description: `Pelepasan jamaah di Terminal 3 Bandara Soekarno-Hatta dengan ${booking.maskapai}.`,
      isCompleted: booking.trackingStep >= 4,
    },
    {
      step: 5,
      label: "Selesai",
      date: booking.trackingStep >= 5 ? s5.date : "-",
      time: booking.trackingStep >= 5 ? s5.time : "-",
      description: "Melaksanakan ibadah Umroh dengan pendampingan mutawwif ahli.",
      isCompleted: booking.trackingStep >= 5,
    },
  ];
};