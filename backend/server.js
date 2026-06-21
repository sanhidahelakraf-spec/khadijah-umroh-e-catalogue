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
app.delete('/api/pesanan/:id', (req, res) => {
  db.query('DELETE FROM pesanan WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
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
// Setup tabel database
app.get('/api/setup', (req, res) => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS paket_umroh (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100),
      duration INT,
      price BIGINT,
      schedule VARCHAR(50),
      status VARCHAR(20),
      description TEXT,
      hotelMakkah VARCHAR(100),
      hotelMadinah VARCHAR(100),
      maskapai VARCHAR(100),
      image TEXT,
      bestSeller TINYINT(1) DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS pesanan (
      id VARCHAR(50) PRIMARY KEY,
      bookingCode VARCHAR(20),
      userEmail VARCHAR(100),
      userName VARCHAR(100),
      userPhone VARCHAR(20),
      packageId VARCHAR(50),
      packageName VARCHAR(100),
      price BIGINT,
      date VARCHAR(50),
      status VARCHAR(20),
      paymentStatus VARCHAR(20),
      travelDate VARCHAR(50),
      trackingStep INT DEFAULT 1,
      maskapai VARCHAR(100),
      hotelMakkah VARCHAR(100),
      hotelMadinah VARCHAR(100),
      duration INT
    )`,
    `CREATE TABLE IF NOT EXISTS jamaah (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(100),
      name VARCHAR(100),
      role VARCHAR(20) DEFAULT 'jamaah',
      phone VARCHAR(20)
    )`,
    `CREATE TABLE IF NOT EXISTS admin (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(100),
      name VARCHAR(100),
      password VARCHAR(100),
      role VARCHAR(20) DEFAULT 'admin'
    )`
  ];

  let done = 0;
  queries.forEach(q => {
    db.query(q, (err) => {
      done++;
      if (done === queries.length) res.json({ success: true, message: 'Tabel berhasil dibuat!' });
    });
  });
});
// Insert admin
app.post('/api/setup-admin', (req, res) => {
  db.query(
    "INSERT IGNORE INTO admin (id, email, name, password, role) VALUES ('admin-001', 'admin@khadijah.com', 'Admin Super', 'admin123', 'admin')",
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Admin berhasil dibuat!' });
    }
  );
});
// Tambah admin baru
app.post('/api/admin', (req, res) => {
  const { id, email, name, password, role } = req.body;
  db.query(
    'INSERT IGNORE INTO admin (id, email, name, password, role) VALUES (?,?,?,?,?)',
    [id || `admin-${Date.now()}`, email, name, password, role || 'admin'],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Hapus jamaah
app.delete('/api/jamaah/:id', (req, res) => {
  db.query('DELETE FROM jamaah WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Hapus admin
app.delete('/api/admin/:id', (req, res) => {
  db.query('DELETE FROM admin WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get semua admin
app.get('/api/admin', (req, res) => {
  db.query('SELECT id, email, name, role FROM admin', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
fetch('https://khadijah-umroh-e-catalogue-production.up.railway.app/api/setup', {
  method: 'GET'
}).then(r=>r.json()).then(console.log)
// Setup kolom kuota
app.get('/api/setup-kuota', (req, res) => {
  db.query(
    'ALTER TABLE paket_umroh ADD COLUMN IF NOT EXISTS kuota INT DEFAULT 50',
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      // Set kuota default untuk semua paket
      db.query('UPDATE paket_umroh SET kuota = 50 WHERE kuota IS NULL OR kuota = 0', (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: 'Kolom kuota berhasil ditambahkan!' });
      });
    }
  );
});
app.post('/api/setup-kuota2', (req, res) => {
  db.query("SHOW COLUMNS FROM paket_umroh LIKE 'kuota'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.json({ success: true, message: 'Kolom kuota sudah ada!' });
    }
    db.query('ALTER TABLE paket_umroh ADD COLUMN kuota INT DEFAULT 50', (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      db.query('UPDATE paket_umroh SET kuota = 50', (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ success: true, message: 'Kolom kuota berhasil ditambahkan dan diset 50!' });
      });
    });
  });
});
app.post('/api/setup-password', (req, res) => {
  db.query("SHOW COLUMNS FROM pesanan LIKE 'password'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.json({ success: true, message: 'Kolom password sudah ada di pesanan!' });
    }
    db.query('ALTER TABLE pesanan ADD COLUMN password VARCHAR(100)', (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, message: 'Kolom password berhasil ditambahkan ke pesanan!' });
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});