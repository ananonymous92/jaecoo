/**
 * JAECOO API Client
 * Centralized API communication for both public frontend and admin panel.
 * Uses relative URLs so it works in both dev (Vite proxy) and production (same server).
 */

const API_BASE = '/api';

// ─── Core Fetch Helpers ────────────────────────────────────────────

async function request(method, endpoint, body = null, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...options.headers };

  // Attach admin token if available
  const token = getAdminToken();
  if (token) {
    headers['X-Admin-Token'] = token;
  }

  const config = { method, headers };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    config.body = body;
  }

  const res = await fetch(url, config);

  if (res.status === 401) {
    // Clear invalid token
    clearAdminToken();
    if (endpoint !== '/auth/login' && typeof window !== 'undefined' && window.onAuthExpired) {
      window.onAuthExpired();
    }
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ─── Admin Token Management ────────────────────────────────────────

function getAdminToken() {
  return sessionStorage.getItem('jaecoo_admin_token');
}

function setAdminToken(token) {
  sessionStorage.setItem('jaecoo_admin_token', token);
}

function clearAdminToken() {
  sessionStorage.removeItem('jaecoo_admin_token');
}

// ─── Public API ────────────────────────────────────────────────────

export const api = {
  // GET requests (public, no auth needed)
  getModels:       () => request('GET', '/models'),
  getNews:         () => request('GET', '/news'),
  getCategories:   () => request('GET', '/news/categories'),
  getDealers:      () => request('GET', '/dealers'),
  getTestimonials: () => request('GET', '/testimonials'),
  getGallery:      () => request('GET', '/gallery'),
  getSettings:     () => request('GET', '/settings'),

  // Public form submissions (no auth)
  submitContact:     (data) => request('POST', '/contacts', data),
  submitReservation: (data) => request('POST', '/reservations', data),
};

// ─── Admin API ─────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: async (username, password) => {
    const result = await request('POST', '/auth/login', { username, password });
    if (result.token) setAdminToken(result.token);
    return result;
  },
  logout: async () => {
    await request('POST', '/auth/logout').catch(() => {});
    clearAdminToken();
  },
  checkAuth: () => request('GET', '/auth/check'),

  // Dashboard
  getStats: () => request('GET', '/admin/stats'),

  // CRUD (admin-protected)
  saveModels:       (data) => request('POST', '/admin/models', data),
  saveNews:         (data) => request('POST', '/admin/news', data),
  saveDealers:      (data) => request('POST', '/admin/dealers', data),
  saveGallery:      (data) => request('POST', '/admin/gallery', data),
  saveTestimonials: (data) => request('POST', '/admin/testimonials', data),
  saveSettings:     (data) => request('POST', '/admin/settings', data),

  // Read-only admin data
  getContacts:     () => request('GET', '/admin/contacts'),
  getReservations: () => request('GET', '/admin/reservations'),

  // File upload
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('POST', '/upload', formData);
  },

  // Token helpers
  isLoggedIn: () => !!getAdminToken(),
  clearToken: clearAdminToken,
};

// ─── Data Fetcher for Frontend ─────────────────────────────────────

/**
 * Fetch all data needed for the public frontend in parallel.
 * Returns an object with all data sets.
 */
export async function fetchAllPublicData() {
  try {
    const [models, news, dealers, testimonials, gallery, settings] = await Promise.all([
      api.getModels(),
      api.getNews(),
      api.getDealers(),
      api.getTestimonials(),
      api.getGallery(),
      api.getSettings(),
    ]);

    return { models, news, dealers, testimonials, gallery, settings };
  } catch (error) {
    console.error('Failed to fetch data from API:', error);
    // Return empty defaults so the app doesn't crash
    return {
      models: [],
      news: [],
      dealers: [],
      testimonials: [],
      gallery: [],
      settings: {}
    };
  }
}
