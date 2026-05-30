export interface UmrohPackage {
  id: string;
  name: string;
  duration: number; // e.g. 12
  price: number; // e.g. 35000000
  schedule: string; // e.g. "12 Mei 2026"
  status: "Aktif" | "Non-Aktif";
  description: string;
  hotelMakkah: string;
  hotelMadinah: string;
  maskapai: string;
  image: string;
  bestSeller?: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "UMR-2026-001"
  userEmail: string;
  userName: string;
  userPhone: string;
  packageId: string;
  packageName: string;
  price: number;
  date: string; // booking date, e.g. "12 Mei 2026"
  status: "Verifikasi" | "Pending" | "Proses" | "Selesai";
  paymentStatus: "Lunas" | "DP" | "Belum Bayar";
  travelDate: string; // departure date
  trackingStep: number; // 1 to 5
  maskapai: string;
  hotelMakkah: string;
  hotelMadinah: string;
  duration: number;
  // Personal profile extension fields
  userNik?: string;
  userPassport?: string;
  userBirthPlace?: string;
  userBirthDate?: string;
  userAddress?: string;
  userVaccine?: string;
  userDocPaspor?: boolean;
  userDocKtp?: boolean;
  userDocKk?: boolean;
  userDocFoto?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "jamaah";
  phone: string;
}

export interface TrackingStep {
  step: number; // 1 to 5
  label: string;
  date: string;
  time: string;
  isCompleted: boolean;
}
