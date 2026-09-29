import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ─── Config ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser (no extra dependency needed)
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch (e) { /* ignore */ }
}
loadEnv();

const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jaecoo2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me-' + crypto.randomBytes(16).toString('hex');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'images');

// Ensure directories exist
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ─── Express App ───────────────────────────────────────────────────
const app = express();

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: IS_PROD ? false : (corsOrigins.length > 0 ? corsOrigins : true),
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/images', express.static(UPLOAD_DIR));

// In production, serve the Vite build output
if (IS_PROD) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
}

// ─── Simple Session / Auth ─────────────────────────────────────────
// Using a simple token-based approach (no extra session dependency)
const activeSessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please login first.' });
  }
  // Refresh session expiry
  const session = activeSessions.get(token);
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  next();
}

// Clean expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions) {
    if (session.expiresAt < now) activeSessions.delete(token);
  }
}, 60 * 60 * 1000); // Every hour

// ─── JSON Data Helpers ─────────────────────────────────────────────
function readJSON(filename) {
  try {
    const fp = path.join(DATA_DIR, filename);
    if (fs.existsSync(fp)) {
      return JSON.parse(fs.readFileSync(fp, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
  }
  return Array.isArray(filename) ? [] : null;
}

function readJSONArray(filename) {
  const data = readJSON(filename);
  return Array.isArray(data) ? data : [];
}

function writeJSON(filename, data) {
  try {
    const fp = path.join(DATA_DIR, filename);
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Error writing ${filename}:`, e.message);
    return false;
  }
}

// ─── Input Sanitization ────────────────────────────────────────────
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Remove potential script tags but allow other HTML (for news content)
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ─── Upload Configuration ──────────────────────────────────────────
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
  'video/mp4', 'video/webm'
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type "${file.mimetype}" not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`));
    }
  }
});

// ─── Rate Limiting (simple in-memory) ──────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const entry = rateLimitMap.get(ip);
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Please wait.' });
  }
  next();
}

app.use('/api', rateLimit);

// ═══════════════════════════════════════════════════════════════════
//  PUBLIC API ROUTES (no auth required)
// ═══════════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, timestamp: new Date().toISOString() });
});

// ── Auth ───────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken();
    activeSessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

app.get('/api/auth/check', (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  const valid = token && activeSessions.has(token);
  res.json({ authenticated: !!valid });
});

// ── Public Data (GET only, no auth) ────────────────────────────────
app.get('/api/models', (req, res) => res.json(readJSONArray('models.json')));
app.get('/api/news', (req, res) => res.json(readJSONArray('news.json')));
app.get('/api/news/categories', (req, res) => res.json(readJSONArray('news-categories.json')));
app.get('/api/dealers', (req, res) => res.json(readJSONArray('dealers.json')));
app.get('/api/testimonials', (req, res) => res.json(readJSONArray('testimonials.json')));
app.get('/api/gallery', (req, res) => res.json(readJSONArray('gallery.json')));
app.get('/api/settings', (req, res) => res.json(readJSON('settings.json') || {}));

// ── Public Form Submissions (no auth, but with validation) ─────────
app.post('/api/contacts', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required.' });
  }
  const contacts = readJSONArray('contacts.json');
  contacts.unshift({
    id: Date.now(),
    name: sanitizeString(name),
    email: sanitizeString(email || ''),
    phone: sanitizeString(phone),
    message: sanitizeString(message),
    date: new Date().toISOString()
  });
  writeJSON('contacts.json', contacts)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save contact' });
});

app.post('/api/reservations', (req, res) => {
  const { name, phone, email, model, dealer, date, time, notes } = req.body;
  if (!name || !phone || !model || !dealer) {
    return res.status(400).json({ error: 'Name, phone, model, and dealer are required.' });
  }
  const reservations = readJSONArray('reservations.json');
  reservations.unshift({
    id: Date.now(),
    name: sanitizeString(name),
    phone: sanitizeString(phone),
    email: sanitizeString(email || ''),
    model: sanitizeString(model),
    dealer: sanitizeString(dealer),
    date: sanitizeString(date || ''),
    time: sanitizeString(time || ''),
    notes: sanitizeString(notes || ''),
    createdAt: new Date().toISOString()
  });
  writeJSON('reservations.json', reservations)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save reservation' });
});

// ═══════════════════════════════════════════════════════════════════
//  ADMIN API ROUTES (auth required)
// ═══════════════════════════════════════════════════════════════════

// Upload file (admin only)
app.post('/api/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/images/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  });
});

// ── Admin CRUD for all data types ──────────────────────────────────

// Models
app.post('/api/admin/models', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array of models' });
  writeJSON('models.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save models' });
});

// News
app.post('/api/admin/news', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array of news' });
  writeJSON('news.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save news' });
});

// Dealers
app.post('/api/admin/dealers', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array of dealers' });
  writeJSON('dealers.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save dealers' });
});

// Gallery
app.post('/api/admin/gallery', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array of gallery items' });
  writeJSON('gallery.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save gallery' });
});

// Testimonials
app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected array of testimonials' });
  writeJSON('testimonials.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save testimonials' });
});

// Settings
app.post('/api/admin/settings', authMiddleware, (req, res) => {
  const data = sanitizeObject(req.body);
  writeJSON('settings.json', data)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Failed to save settings' });
});

// Contacts (admin read)
app.get('/api/admin/contacts', authMiddleware, (req, res) => {
  res.json(readJSONArray('contacts.json'));
});

// Reservations (admin read)
app.get('/api/admin/reservations', authMiddleware, (req, res) => {
  res.json(readJSONArray('reservations.json'));
});

// Dashboard stats
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  res.json({
    models: readJSONArray('models.json').length,
    news: readJSONArray('news.json').length,
    dealers: readJSONArray('dealers.json').length,
    gallery: readJSONArray('gallery.json').length,
    contacts: readJSONArray('contacts.json').length,
    reservations: readJSONArray('reservations.json').length
  });
});

// ═══════════════════════════════════════════════════════════════════
//  SPA Fallback (production only)
// ═══════════════════════════════════════════════════════════════════
if (IS_PROD) {
  // Serve admin.html for /admin route
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'admin.html'));
  });
  // Fallback to index.html for SPA routing
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// ─── Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════════╗`);
  console.log(`║  JAECOO Backend Server                        ║`);
  console.log(`║  Mode: ${NODE_ENV.padEnd(39)}║`);
  console.log(`║  Port: ${String(PORT).padEnd(39)}║`);
  console.log(`║  Data: ${DATA_DIR.slice(-38).padEnd(39)}║`);
  console.log(`╚═══════════════════════════════════════════════╝\n`);
});
