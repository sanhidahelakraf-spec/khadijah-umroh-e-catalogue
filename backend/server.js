const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ==================== PAKET UMROH ====================
app.get('/api/paket', (req, res) => {
  db.query('SELECT * FROM paket_umroh', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/paket', (req, res) => {
  const { id, name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller } = req.body;
  db.query(
    'INSERT INTO paket_umroh (id, name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [id, name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller ? 1 : 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, result });
    }
  );
});

app.put('/api/paket/:id', (req, res) => {
  const { name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller } = req.body;
  db.query(
    'UPDATE paket_umroh SET name=?, duration=?, price=?, schedule=?, status=?, description=?, hotelMakkah=?, hotelMadinah=?, maskapai=?, image=?, bestSeller=? WHERE id=?',
    [name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller ? 1 : 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/paket/:id', (req, res) => {
  db.query('DELETE FROM paket_umroh WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ==================== BOOKING / PESANAN ====================
app.get('/api/pesanan', (req, res) => {
  db.query('SELECT * FROM pesanan ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/pesanan', (req, res) => {
  const b = req.body;
  db.query(
    `INSERT INTO pesanan (id, bookingCode, userEmail, userName, userPhone, packageId, packageName, price, date, status, paymentStatus, travelDate, trackingStep, maskapai, hotelMakkah, hotelMadinah, duration)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [b.id, b.bookingCode, b.userEmail, b.userName, b.userPhone, b.packageId, b.packageName, b.price, b.date, b.status, b.paymentStatus, b.travelDate, b.trackingStep, b.maskapai, b.hotelMakkah, b.hotelMadinah, b.duration],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.put('/api/pesanan/:id', (req, res) => {
  const b = req.body;
  db.query(
    `UPDATE pesanan SET status=?, paymentStatus=?, trackingStep=?, travelDate=? WHERE id=?`,
    [b.status, b.paymentStatus, b.trackingStep, b.travelDate, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ==================== JAMAAH / USERS ====================
app.get('/api/jamaah', (req, res) => {
  db.query('SELECT * FROM jamaah', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/jamaah', (req, res) => {
  const { id, email, name, role, phone } = req.body;
  db.query(
    'INSERT IGNORE INTO jamaah (id, email, name, role, phone) VALUES (?,?,?,?,?)',
    [id, email, name, role || 'jamaah', phone],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ==================== PROMO ====================
app.get('/api/promo', (req, res) => {
  db.query('SELECT * FROM promo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==================== TRACKING ====================
app.get('/api/tracking/:bookingCode', (req, res) => {
  db.query('SELECT * FROM tracking WHERE bookingCode=?', [req.params.bookingCode], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==================== ADMIN LOGIN ====================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM admin WHERE email=? AND password=?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Login gagal' });
    res.json({ message: 'Login berhasil', user: results[0] });
  });
});

// ==================== SEED DATA (isi data awal ke DB) ====================
app.post('/api/seed', (req, res) => {
  const { packages, bookings, users } = req.body;

  let done = 0;
  const total = packages.length + bookings.length + users.length;
  const errors = [];

  packages.forEach(p => {
    db.query(
      'INSERT IGNORE INTO paket_umroh (id, name, duration, price, schedule, status, description, hotelMakkah, hotelMadinah, maskapai, image, bestSeller) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [p.id, p.name, p.duration, p.price, p.schedule, p.status, p.description, p.hotelMakkah, p.hotelMadinah, p.maskapai, p.image, p.bestSeller ? 1 : 0],
      (err) => { if (err) errors.push(err.message); done++; if (done === total) res.json({ success: true, errors }); }
    );
  });

  bookings.forEach(b => {
    db.query(
      'INSERT IGNORE INTO pesanan (id, bookingCode, userEmail, userName, userPhone, packageId, packageName, price, date, status, paymentStatus, travelDate, trackingStep, maskapai, hotelMakkah, hotelMadinah, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [b.id, b.bookingCode, b.userEmail, b.userName, b.userPhone, b.packageId, b.packageName, b.price, b.date, b.status, b.paymentStatus, b.travelDate, b.trackingStep, b.maskapai, b.hotelMakkah, b.hotelMadinah, b.duration],
      (err) => { if (err) errors.push(err.message); done++; if (done === total) res.json({ success: true, errors }); }
    );
  });

  users.forEach(u => {
    db.query(
      'INSERT IGNORE INTO jamaah (id, email, name, role, phone) VALUES (?,?,?,?,?)',
      [u.id, u.email, u.name, u.role, u.phone],
      (err) => { if (err) errors.push(err.message); done++; if (done === total) res.json({ success: true, errors }); }
    );
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});