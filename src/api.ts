const BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Paket
  getPaket: () => fetch(`${BASE_URL}/paket`).then(r => r.json()),
  
  // Pesanan
  getPesanan: () => fetch(`${BASE_URL}/pesanan`).then(r => r.json()),
  postPesanan: (data: any) => fetch(`${BASE_URL}/pesanan`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  }).then(r => r.json()),

  // Jamaah
  getJamaah: () => fetch(`${BASE_URL}/jamaah`).then(r => r.json()),
  postJamaah: (data: any) => fetch(`${BASE_URL}/jamaah`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  }).then(r => r.json()),

  // Promo
  getPromo: () => fetch(`${BASE_URL}/promo`).then(r => r.json()),

  // Seed data awal
  seedData: (data: any) => fetch(`${BASE_URL}/seed`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  }).then(r => r.json()),
};