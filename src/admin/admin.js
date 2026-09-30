/**
 * JAECOO Admin Panel
 * Unified admin dashboard with authentication, CRUD for all data types.
 */
import { createIcons, icons } from 'lucide';
import { adminApi } from '../utils/apiClient.js';

// ─── Config ────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'banner', label: 'Banner & Settings', icon: 'image' },
  { id: 'models', label: 'Our Models', icon: 'car' },
  { id: 'news', label: 'News & Updates', icon: 'newspaper' },
  { id: 'gallery', label: 'Gallery', icon: 'images' },
  { id: 'dealers', label: 'Dealers Location', icon: 'map-pin' },
  { id: 'reservation', label: 'Reservations', icon: 'calendar-check' },
  { id: 'contacts', label: 'Contact Messages', icon: 'mail' },
];

let currentTab = 'dashboard';

// ─── State ─────────────────────────────────────────────────────────
let newsData = [];
let modelsAdminData = [];
let dealersData = [];
let galleryData = [];
let settingsData = {};
let editingModelIndex = -1;

// ─── Auth ──────────────────────────────────────────────────────────
function initAuth() {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const adminApp = document.getElementById('admin-app');
  const logoutBtn = document.getElementById('logout-btn');

  // Check if already logged in
  if (adminApi.isLoggedIn()) {
    adminApi.checkAuth().then(res => {
      if (res.authenticated) {
        showDashboard();
      } else {
        adminApi.clearToken();
        showLogin();
      }
    }).catch(() => showLogin());
  } else {
    showLogin();
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in...';
      errorEl.style.display = 'none';

      await adminApi.login(username, password);
      showDashboard();
    } catch (err) {
      errorEl.textContent = err.message || 'Login gagal. Periksa username dan password.';
      errorEl.style.display = 'block';
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await adminApi.logout();
    showLogin();
  });

  // Handle auth expiry
  window.onAuthExpired = () => {
    alert('Sesi Anda telah berakhir. Silakan login kembali.');
    showLogin();
  };

  function showLogin() {
    loginScreen.style.display = 'flex';
    adminApp.style.display = 'none';
  }

  function showDashboard() {
    loginScreen.style.display = 'none';
    adminApp.style.display = '';
    initAdmin();
  }
}

// ─── Admin Panel Init ──────────────────────────────────────────────
function initAdmin() {
  renderSidebar();
  renderContent();
}

function renderSidebar() {
  const navContainer = document.getElementById('sidebar-nav');
  navContainer.innerHTML = '';
  
  TABS.forEach(tab => {
    const a = document.createElement('a');
    a.href = `#${tab.id}`;
    a.className = `nav-item ${currentTab === tab.id ? 'active' : ''}`;
    a.innerHTML = `<i data-lucide="${tab.icon}"></i><span>${tab.label}</span>`;
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      currentTab = tab.id;
      document.getElementById('current-page-title').textContent = tab.label;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
      renderContent();
    });
    
    navContainer.appendChild(a);
  });
  
  createIcons({ icons });
}

// ─── Content Router ────────────────────────────────────────────────
function renderContent() {
  const container = document.getElementById('content-area');
  
  switch(currentTab) {
    case 'dashboard': initDashboard(); break;
    case 'banner': initSettingsTab(); break;
    case 'news': initNewsTab(); break;
    case 'models': initModelsTab(); break;
    case 'gallery': initGalleryTab(); break;
    case 'dealers': initDealersTab(); break;
    case 'reservation': initReservationTab(); break;
    case 'contacts': initContactTab(); break;
    default:
      container.innerHTML = renderPlaceholderView(currentTab, 'Loading...');
  }
  
  createIcons({ icons });
}

function renderPlaceholderView(title, description) {
  return `
    <div class="dashboard-card">
      <div class="card-header"><h3 class="card-title">Manage ${title}</h3></div>
      <div class="empty-state">
        <i data-lucide="loader" class="empty-icon" style="animation: spin 2s linear infinite"></i>
        <h4 style="margin-bottom: 8px; color: var(--text-main);">${description}</h4>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════
async function initDashboard() {
  const container = document.getElementById('content-area');
  try {
    const stats = await adminApi.getStats();
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Welcome to JAECOO Admin</h3></div>
        <p style="color: var(--text-muted); margin-bottom: 20px;">
          Panel administrasi JAECOO Indonesia. Semua perubahan langsung tersimpan dan terlihat di website.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
          ${[
            { label: 'Models', value: stats.models, icon: 'car', color: '#00D2C4' },
            { label: 'News', value: stats.news, icon: 'newspaper', color: '#0077FF' },
            { label: 'Gallery', value: stats.gallery, icon: 'images', color: '#FFB800' },
            { label: 'Dealers', value: stats.dealers, icon: 'map-pin', color: '#FF5722' },
            { label: 'Reservations', value: stats.reservations, icon: 'calendar-check', color: '#9C27B0' },
            { label: 'Contacts', value: stats.contacts, icon: 'mail', color: '#4CAF50' },
          ].map(s => `
            <div style="background: rgba(255,255,255,0.04); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom: 12px;">
                <div style="width:36px;height:36px;background:${s.color}15;color:${s.color};border-radius:8px;display:flex;align-items:center;justify-content:center;">
                  <i data-lucide="${s.icon}" style="width:18px;height:18px;"></i>
                </div>
                <span style="color:var(--text-muted);font-size:0.85rem;">${s.label}</span>
              </div>
              <div style="font-size: 2rem; font-weight: 700;">${s.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="dashboard-card"><p style="color:var(--danger);">Error loading dashboard: ${err.message}</p></div>`;
  }
  createIcons({ icons });
}

// ═══════════════════════════════════════════════════════════════════
//  NEWS CRUD
// ═══════════════════════════════════════════════════════════════════
async function initNewsTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('News', 'Loading news data...');
  try {
    const res = await fetch('/api/news');
    newsData = await res.json();
    renderNewsTable();
  } catch (err) {
    container.innerHTML = renderPlaceholderView('News', 'Error loading news data.');
  }
}

function renderNewsTable() {
  const container = document.getElementById('content-area');
  let rows = newsData.map((news, index) => `
    <tr>
      <td><img src="${news.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${news.title}</strong><br><small style="color: var(--text-muted)">${news.date} - ${news.category}</small></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-news" data-index="${index}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-news" data-index="${index}">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage News & Updates</h3>
        <button class="btn btn-primary" id="add-news-btn"><i data-lucide="plus"></i> Add News</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Title & Info</th><th width="150">Actions</th></tr></thead>
        <tbody>${rows.length ? rows : '<tr><td colspan="3" class="empty-state">No news found</td></tr>'}</tbody>
      </table>
    </div>
  `;
  createIcons({ icons });

  // Event delegation
  document.getElementById('add-news-btn')?.addEventListener('click', () => editNews(-1));
  container.querySelectorAll('[data-action="edit-news"]').forEach(btn => {
    btn.addEventListener('click', () => editNews(parseInt(btn.dataset.index)));
  });
  container.querySelectorAll('[data-action="delete-news"]').forEach(btn => {
    btn.addEventListener('click', () => deleteNews(parseInt(btn.dataset.index)));
  });
}

function editNews(index) {
  const container = document.getElementById('content-area');
  const isNew = index === -1;
  const news = isNew ? { title: '', category: 'NEWS', date: '', excerpt: '', content: '', image: '', slug: '', id: '' } : newsData[index];

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${isNew ? 'Add New Article' : 'Edit Article'}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-news-btn">Cancel</button>
          <button class="btn btn-primary" id="save-news-btn">Save Changes</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Title</label><input type="text" id="news-title" class="form-control" value="${news.title}"></div>
      <div class="form-group" style="display: flex; gap: 20px;">
        <div style="flex: 1"><label class="form-label">Category</label><input type="text" id="news-cat" class="form-control" value="${news.category}"></div>
        <div style="flex: 1"><label class="form-label">Date</label><input type="text" id="news-date" class="form-control" value="${news.date}" placeholder="e.g. 14 September 2026"></div>
      </div>
      <div class="form-group"><label class="form-label">Image URL</label>
        <div style="display:flex;gap:5px;"><input type="text" id="news-img" class="form-control" value="${news.image}"><button class="btn btn-outline" style="padding:0 10px;" id="upload-news-img">Upload</button></div>
      </div>
      <div class="form-group"><label class="form-label">Excerpt</label><textarea id="news-excerpt" class="form-control" style="min-height: 60px;">${news.excerpt}</textarea></div>
      <div class="form-group"><label class="form-label">Content (HTML allowed)</label><textarea id="news-content" class="form-control" style="min-height: 200px;">${news.content}</textarea></div>
    </div>
  `;

  document.getElementById('cancel-news-btn').addEventListener('click', () => initNewsTab());
  document.getElementById('save-news-btn').addEventListener('click', () => saveNews(index));
  document.getElementById('upload-news-img').addEventListener('click', () => uploadToInput('news-img'));
}

async function saveNews(index) {
  const title = document.getElementById('news-title').value;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const updatedNews = {
    id: index === -1 ? slug : newsData[index].id,
    slug,
    category: document.getElementById('news-cat').value,
    date: document.getElementById('news-date').value,
    title,
    excerpt: document.getElementById('news-excerpt').value,
    content: document.getElementById('news-content').value,
    image: document.getElementById('news-img').value,
    readTime: index === -1 ? "3 min read" : newsData[index].readTime
  };

  if (index === -1) { newsData.unshift(updatedNews); }
  else { newsData[index] = updatedNews; }

  try {
    await adminApi.saveNews(newsData);
    initNewsTab();
  } catch (err) { alert('Error saving: ' + err.message); }
}

async function deleteNews(index) {
  if (confirm('Are you sure you want to delete this news?')) {
    newsData.splice(index, 1);
    try {
      await adminApi.saveNews(newsData);
      initNewsTab();
    } catch (err) { alert('Error deleting: ' + err.message); }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  MODELS CRUD
// ═══════════════════════════════════════════════════════════════════
async function initModelsTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Models', 'Loading models...');
  try {
    const res = await fetch('/api/models');
    modelsAdminData = await res.json();
    renderModelsTable();
  } catch (e) { console.error(e); }
}

function renderModelsTable() {
  const container = document.getElementById('content-area');
  let rows = modelsAdminData.map((m, i) => `
    <tr>
      <td><img src="${m.heroImage}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td><strong>${m.name}</strong><br><small>${m.category}</small></td>
      <td>${m.price}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px;" data-action="edit-model" data-index="${i}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-model" data-index="${i}">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Models</h3>
        <button class="btn btn-primary" id="add-model-btn"><i data-lucide="plus"></i> Add Model</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Name & Category</th><th>Price</th><th width="150">Actions</th></tr></thead>
        <tbody>${rows.length ? rows : '<tr><td colspan="4" class="empty-state">No models found</td></tr>'}</tbody>
      </table>
    </div>
  `;
  createIcons({ icons });

  document.getElementById('add-model-btn')?.addEventListener('click', () => editModel(-1));
  container.querySelectorAll('[data-action="edit-model"]').forEach(btn => {
    btn.addEventListener('click', () => editModel(parseInt(btn.dataset.index)));
  });
  container.querySelectorAll('[data-action="delete-model"]').forEach(btn => {
    btn.addEventListener('click', () => deleteModel(parseInt(btn.dataset.index)));
  });
}

function editModel(index) {
  editingModelIndex = index;
  const isNew = index === -1;
  const editingData = isNew ? {
    id: '', slug: '', name: '', category: '', tagline: '', shortDesc: '', price: '', badge: '', heroImage: '', cardImage: '', interiorImage: '',
    specs: { power: '', torque: '', groundClearance: '', wadingDepth: '' },
    colors: [], trims: [], hotspots: [], keyFeatures: [], interiorFeatures: [], exteriorFeatures: [], gallery: []
  } : JSON.parse(JSON.stringify(modelsAdminData[index]));

  if (!editingData.specs) editingData.specs = {};
  if (!editingData.colors) editingData.colors = [];
  if (!editingData.trims) editingData.trims = [];
  if (!editingData.hotspots) editingData.hotspots = [];

  window._editingModelData = editingData;
  renderModelForm();
}

function syncModelFormToState() {
  const m = window._editingModelData;
  if (!m) return;
  m.name = document.getElementById('mod-name')?.value || '';
  m.category = document.getElementById('mod-cat')?.value || '';
  m.price = document.getElementById('mod-price')?.value || '';
  m.badge = document.getElementById('mod-badge')?.value || '';
  m.tagline = document.getElementById('mod-tagline')?.value || '';
  m.shortDesc = document.getElementById('mod-desc')?.value || '';
  m.heroImage = document.getElementById('mod-hero')?.value || '';
  m.cardImage = document.getElementById('mod-card')?.value || '';
  m.interiorImage = document.getElementById('mod-interior')?.value || '';
  m.specs.power = document.getElementById('mod-spec-power')?.value || '';
  m.specs.torque = document.getElementById('mod-spec-torque')?.value || '';
  m.specs.groundClearance = document.getElementById('mod-spec-gc')?.value || '';
  m.specs.wadingDepth = document.getElementById('mod-spec-wd')?.value || '';
  m.specs.battery = document.getElementById('mod-spec-battery')?.value || '';
  m.specs.evRange = document.getElementById('mod-spec-ev')?.value || '';
  m.specs.drivingRange = document.getElementById('mod-spec-dr')?.value || '';
  m.specs.acceleration = document.getElementById('mod-spec-accel')?.value || '';
  m.specs.driveSystem = document.getElementById('mod-spec-ds')?.value || '';
  m.specs.chargingTime = document.getElementById('mod-spec-charge')?.value || '';
  m.specs.energyEfficiency = document.getElementById('mod-spec-eff')?.value || '';

  m.colors.forEach((c, i) => {
    c.name = document.getElementById(`mod-col-name-${i}`)?.value || '';
    c.hex = document.getElementById(`mod-col-hex-${i}`)?.value || '';
    c.img = document.getElementById(`mod-col-img-${i}`)?.value || '';
  });
  m.trims.forEach((t, i) => {
    t.name = document.getElementById(`mod-trim-name-${i}`)?.value || '';
    t.price = document.getElementById(`mod-trim-price-${i}`)?.value || '';
    t.img = document.getElementById(`mod-trim-img-${i}`)?.value || '';
    const featVal = document.getElementById(`mod-trim-feat-${i}`)?.value || '';
    t.features = featVal.split('\n').map(s => s.trim()).filter(s => s);
  });
  m.hotspots.forEach((h, i) => {
    h.label = document.getElementById(`mod-hs-label-${i}`)?.value || '';
    h.top = document.getElementById(`mod-hs-top-${i}`)?.value || 50;
    h.left = document.getElementById(`mod-hs-left-${i}`)?.value || 50;
  });
  m.keyFeatures.forEach((kf, i) => {
    kf.title = document.getElementById(`mod-kf-title-${i}`)?.value || '';
    kf.desc = document.getElementById(`mod-kf-desc-${i}`)?.value || '';
  });
}

function renderModelForm() {
  const m = window._editingModelData;
  const container = document.getElementById('content-area');
  const isNew = editingModelIndex === -1;

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header" style="position: sticky; top: 0; background: var(--color-surface-1); z-index: 10; padding: 15px 0; border-bottom: 1px solid var(--color-border-light);">
        <h3 class="card-title">${isNew ? 'Add New Model' : 'Edit Model: ' + m.name}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-model-btn">Cancel</button>
          <button class="btn btn-primary" id="save-model-btn">Save Changes</button>
        </div>
      </div>
      <div style="padding-top: 20px;">
        <h4 style="margin-bottom:15px; color:var(--color-accent-cyan);">General Info</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="form-group"><label class="form-label">Model Name</label><input type="text" id="mod-name" class="form-control" value="${m.name}"></div>
          <div class="form-group"><label class="form-label">Category</label><input type="text" id="mod-cat" class="form-control" value="${m.category}"></div>
          <div class="form-group"><label class="form-label">Price</label><input type="text" id="mod-price" class="form-control" value="${m.price}"></div>
          <div class="form-group"><label class="form-label">Badge</label><input type="text" id="mod-badge" class="form-control" value="${m.badge || ''}"></div>
        </div>
        <div class="form-group"><label class="form-label">Tagline</label><input type="text" id="mod-tagline" class="form-control" value="${m.tagline || ''}"></div>
        <div class="form-group"><label class="form-label">Short Description</label><textarea id="mod-desc" class="form-control" style="min-height: 60px;">${m.shortDesc || ''}</textarea></div>
        
        <h4 style="margin:25px 0 15px 0; color:var(--color-accent-cyan);">Images</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <div class="form-group"><label class="form-label">Hero Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-hero" class="form-control" value="${m.heroImage || ''}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-hero">Upload</button></div></div>
          <div class="form-group"><label class="form-label">Card Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-card" class="form-control" value="${m.cardImage || ''}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-card">Upload</button></div></div>
          <div class="form-group"><label class="form-label">Interior Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-interior" class="form-control" value="${m.interiorImage || ''}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-interior">Upload</button></div></div>
        </div>

        <h4 style="margin:25px 0 15px 0; color:var(--color-accent-cyan);">Specs</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px;">
          <div class="form-group"><label class="form-label">Max Power</label><input type="text" id="mod-spec-power" class="form-control" value="${m.specs.power || ''}"></div>
          <div class="form-group"><label class="form-label">Torque</label><input type="text" id="mod-spec-torque" class="form-control" value="${m.specs.torque || ''}"></div>
          <div class="form-group"><label class="form-label">Ground Clearance</label><input type="text" id="mod-spec-gc" class="form-control" value="${m.specs.groundClearance || ''}"></div>
          <div class="form-group"><label class="form-label">Wading Depth</label><input type="text" id="mod-spec-wd" class="form-control" value="${m.specs.wadingDepth || ''}"></div>
          <div class="form-group"><label class="form-label">Battery</label><input type="text" id="mod-spec-battery" class="form-control" value="${m.specs.battery || ''}"></div>
          <div class="form-group"><label class="form-label">EV Range</label><input type="text" id="mod-spec-ev" class="form-control" value="${m.specs.evRange || ''}"></div>
          <div class="form-group"><label class="form-label">Driving Range</label><input type="text" id="mod-spec-dr" class="form-control" value="${m.specs.drivingRange || ''}"></div>
          <div class="form-group"><label class="form-label">Acceleration</label><input type="text" id="mod-spec-accel" class="form-control" value="${m.specs.acceleration || ''}"></div>
          <div class="form-group"><label class="form-label">Drive System</label><input type="text" id="mod-spec-ds" class="form-control" value="${m.specs.driveSystem || ''}"></div>
          <div class="form-group"><label class="form-label">Charging</label><input type="text" id="mod-spec-charge" class="form-control" value="${m.specs.chargingTime || ''}"></div>
          <div class="form-group"><label class="form-label">Efficiency</label><input type="text" id="mod-spec-eff" class="form-control" value="${m.specs.energyEfficiency || ''}"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Colors</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-color-btn">+ Add Color</button>
        </div>
        <div id="colors-container">
        ${m.colors.map((c, i) => `
          <div style="display: grid; grid-template-columns: 1fr 100px 2fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Color Name</label><input type="text" id="mod-col-name-${i}" class="form-control" value="${c.name}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">HEX</label><input type="color" id="mod-col-hex-${i}" class="form-control" value="${c.hex}" style="height:38px; padding:2px;"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Car Image URL</label><div style="display:flex;gap:5px;"><input type="text" id="mod-col-img-${i}" class="form-control" value="${c.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-col-img-${i}">Upload</button></div></div>
            <button class="btn btn-outline remove-color-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${i}">Remove</button>
          </div>
        `).join('')}
        </div>
        ${m.colors.length === 0 ? '<p style="color:#666; font-size:0.9rem;">No colors added yet.</p>' : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Trims / Tipe Mobil</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-trim-btn">+ Add Trim</button>
        </div>
        <div id="trims-container">
        ${m.trims.map((t, i) => `
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Name</label><input type="text" id="mod-trim-name-${i}" class="form-control" value="${t.name}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Price</label><input type="text" id="mod-trim-price-${i}" class="form-control" value="${t.price}"></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Trim Image</label><div style="display:flex;gap:5px;"><input type="text" id="mod-trim-img-${i}" class="form-control" value="${t.img}"><button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="mod-trim-img-${i}">Upload</button></div></div>
            </div>
            <div class="form-group" style="margin-top:15px;"><label class="form-label">Features (satu per baris)</label><textarea id="mod-trim-feat-${i}" class="form-control" style="min-height: 80px;">${(t.features || []).join('\n')}</textarea></div>
            <button class="btn btn-outline remove-trim-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:5px; font-size:0.85rem;" data-index="${i}">Remove Trim</button>
          </div>
        `).join('')}
        </div>
        ${m.trims.length === 0 ? '<p style="color:#666; font-size:0.9rem;">No trims added yet.</p>' : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Key Features</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-kf-btn">+ Add Feature</button>
        </div>
        <div id="kf-container">
        ${m.keyFeatures.map((kf, i) => `
          <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div class="form-group" style="margin:0 0 10px 0;"><label class="form-label">Feature Title</label><input type="text" id="mod-kf-title-${i}" class="form-control" value="${kf.title}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Description</label><textarea id="mod-kf-desc-${i}" class="form-control" style="min-height: 60px;">${kf.desc}</textarea></div>
            <button class="btn btn-outline remove-kf-btn" style="border-color:var(--danger); color:var(--danger); padding:4px 12px; margin-top:10px; font-size:0.85rem;" data-index="${i}">Remove Feature</button>
          </div>
        `).join('')}
        </div>
        ${m.keyFeatures.length === 0 ? '<p style="color:#666; font-size:0.9rem;">No key features added yet.</p>' : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; margin:25px 0 15px 0;">
          <h4 style="color:var(--color-accent-cyan); margin:0;">Interior Hotspots</h4>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" id="add-hotspot-btn">+ Add Hotspot</button>
        </div>
        <div id="hotspots-container">
        ${m.hotspots.map((h, i) => `
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; align-items:end;">
            <div class="form-group" style="margin:0;"><label class="form-label">Label</label><input type="text" id="mod-hs-label-${i}" class="form-control" value="${h.label}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Top (%)</label><input type="number" id="mod-hs-top-${i}" class="form-control" value="${h.top}"></div>
            <div class="form-group" style="margin:0;"><label class="form-label">Left (%)</label><input type="number" id="mod-hs-left-${i}" class="form-control" value="${h.left}"></div>
            <button class="btn btn-outline remove-hotspot-btn" style="border-color:var(--danger); color:var(--danger); padding:8px 12px;" data-index="${i}">Remove</button>
          </div>
        `).join('')}
        </div>
        ${m.hotspots.length === 0 ? '<p style="color:#666; font-size:0.9rem;">No hotspots added yet.</p>' : ''}
      </div>
    </div>
  `;

  // Attach event listeners
  document.getElementById('cancel-model-btn').addEventListener('click', () => initModelsTab());
  document.getElementById('save-model-btn').addEventListener('click', saveModel);
  document.getElementById('add-color-btn')?.addEventListener('click', () => { syncModelFormToState(); m.colors.push({ name: '', hex: '#ffffff', img: '' }); renderModelForm(); });
  document.getElementById('add-trim-btn')?.addEventListener('click', () => { syncModelFormToState(); m.trims.push({ name: '', price: '', img: '', features: [] }); renderModelForm(); });
  document.getElementById('add-hotspot-btn')?.addEventListener('click', () => { syncModelFormToState(); m.hotspots.push({ label: '', top: 50, left: 50 }); renderModelForm(); });
  document.getElementById('add-kf-btn')?.addEventListener('click', () => { syncModelFormToState(); m.keyFeatures.push({ title: '', desc: '' }); renderModelForm(); });

  container.querySelectorAll('.remove-color-btn').forEach(btn => {
    btn.addEventListener('click', () => { syncModelFormToState(); m.colors.splice(parseInt(btn.dataset.index), 1); renderModelForm(); });
  });
  container.querySelectorAll('.remove-trim-btn').forEach(btn => {
    btn.addEventListener('click', () => { syncModelFormToState(); m.trims.splice(parseInt(btn.dataset.index), 1); renderModelForm(); });
  });
  container.querySelectorAll('.remove-hotspot-btn').forEach(btn => {
    btn.addEventListener('click', () => { syncModelFormToState(); m.hotspots.splice(parseInt(btn.dataset.index), 1); renderModelForm(); });
  });
  container.querySelectorAll('.remove-kf-btn').forEach(btn => {
    btn.addEventListener('click', () => { syncModelFormToState(); m.keyFeatures.splice(parseInt(btn.dataset.index), 1); renderModelForm(); });
  });
  container.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', () => uploadToInput(btn.dataset.target));
  });

  createIcons({ icons });
}

async function saveModel() {
  syncModelFormToState();
  const m = window._editingModelData;
  if (!m.name) { alert("Model Name is required!"); return; }
  
  const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  m.slug = slug;
  m.id = slug;

  if (editingModelIndex === -1) { modelsAdminData.push(m); }
  else { modelsAdminData[editingModelIndex] = m; }

  try {
    await adminApi.saveModels(modelsAdminData);
    initModelsTab();
  } catch (err) { alert('Error saving: ' + err.message); }
}

async function deleteModel(index) {
  if (confirm('Are you sure you want to delete this model?')) {
    modelsAdminData.splice(index, 1);
    try {
      await adminApi.saveModels(modelsAdminData);
      initModelsTab();
    } catch (err) { alert('Error deleting: ' + err.message); }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  DEALERS
// ═══════════════════════════════════════════════════════════════════
async function initDealersTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Dealers', 'Loading...');
  try {
    const res = await fetch('/api/dealers');
    dealersData = await res.json();
    renderDealersTable();
  } catch (e) { console.error(e); }
}

let editingDealerIndex = -1;

function renderDealersTable() {
  const container = document.getElementById('content-area');
  let rows = dealersData.map((d, i) => `
    <tr>
      <td><strong>${d.name}</strong><br><small>${d.city || ''}</small></td>
      <td>${d.address || ''}</td>
      <td>${d.phone || ''}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; margin-right: 5px;" data-action="edit-dealer" data-index="${i}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-dealer" data-index="${i}">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Dealers</h3>
        <button class="btn btn-primary" id="add-dealer-btn">+ Add Dealer</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Dealer Info</th><th>Address</th><th>Phone</th><th width="120">Actions</th></tr></thead>
        <tbody>${rows.length ? rows : '<tr><td colspan="4" class="empty-state">No dealers found</td></tr>'}</tbody>
      </table>
    </div>
  `;

  document.getElementById('add-dealer-btn').addEventListener('click', () => {
    editingDealerIndex = -1;
    renderDealerForm();
  });

  container.querySelectorAll('[data-action="edit-dealer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      editingDealerIndex = parseInt(btn.dataset.index);
      renderDealerForm();
    });
  });

  container.querySelectorAll('[data-action="delete-dealer"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this dealer?')) {
        dealersData.splice(parseInt(btn.dataset.index), 1);
        try { await adminApi.saveDealers(dealersData); renderDealersTable(); }
        catch (err) { alert('Error: ' + err.message); }
      }
    });
  });
}

function renderDealerForm() {
  const container = document.getElementById('content-area');
  const d = editingDealerIndex === -1 ? { name: '', city: '', address: '', phone: '', lat: '', lng: '', whatsapp: '' } : dealersData[editingDealerIndex];
  
  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${editingDealerIndex === -1 ? 'Add Dealer' : 'Edit Dealer'}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-dealer-btn">Cancel</button>
          <button class="btn btn-primary" id="save-dealer-btn">Save</button>
        </div>
      </div>
      <div style="padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group"><label class="form-label">Dealer Name</label><input type="text" id="dlr-name" class="form-control" value="${d.name || ''}"></div>
        <div class="form-group"><label class="form-label">City</label><input type="text" id="dlr-city" class="form-control" value="${d.city || ''}"></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" id="dlr-phone" class="form-control" value="${d.phone || ''}"></div>
        <div class="form-group"><label class="form-label">WhatsApp</label><input type="text" id="dlr-wa" class="form-control" value="${d.whatsapp || ''}"></div>
        <div class="form-group" style="grid-column: 1 / -1;"><label class="form-label">Address</label><input type="text" id="dlr-address" class="form-control" value="${d.address || ''}"></div>
        <div class="form-group"><label class="form-label">Latitude</label><input type="text" id="dlr-lat" class="form-control" value="${d.lat || ''}"></div>
        <div class="form-group"><label class="form-label">Longitude</label><input type="text" id="dlr-lng" class="form-control" value="${d.lng || ''}"></div>
      </div>
    </div>
  `;

  document.getElementById('cancel-dealer-btn').addEventListener('click', renderDealersTable);
  document.getElementById('save-dealer-btn').addEventListener('click', async () => {
    const newDealer = {
      name: document.getElementById('dlr-name').value,
      city: document.getElementById('dlr-city').value,
      phone: document.getElementById('dlr-phone').value,
      whatsapp: document.getElementById('dlr-wa').value,
      address: document.getElementById('dlr-address').value,
      lat: document.getElementById('dlr-lat').value,
      lng: document.getElementById('dlr-lng').value
    };
    if (!newDealer.name) return alert("Name is required");

    if (editingDealerIndex === -1) {
      dealersData.push(newDealer);
    } else {
      dealersData[editingDealerIndex] = newDealer;
    }

    try { 
      await adminApi.saveDealers(dealersData); 
      renderDealersTable();
    } catch (err) { alert('Error: ' + err.message); }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  GALLERY
// ═══════════════════════════════════════════════════════════════════
async function initGalleryTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Gallery', 'Loading...');
  try {
    const res = await fetch('/api/gallery');
    galleryData = await res.json();
    renderGalleryTable();
  } catch (e) { console.error(e); }
}

let editingGalleryIndex = -1;

function renderGalleryTable() {
  const container = document.getElementById('content-area');
  let rows = galleryData.map((g, i) => `
    <tr>
      <td><img src="${g.thumb || g.src}" style="width: 80px; border-radius: 4px;"></td>
      <td><strong>${g.title}</strong><br><small>${g.category}</small></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; margin-right: 5px;" data-action="edit-gallery" data-index="${i}">Edit</button>
        <button class="btn btn-outline" style="padding: 4px 8px; color: var(--danger); border-color: var(--danger)" data-action="delete-gallery" data-index="${i}">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Manage Gallery</h3>
        <button class="btn btn-primary" id="add-gallery-btn">+ Add Image</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Image</th><th>Details</th><th width="120">Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  document.getElementById('add-gallery-btn').addEventListener('click', () => {
    editingGalleryIndex = -1;
    renderGalleryForm();
  });

  container.querySelectorAll('[data-action="edit-gallery"]').forEach(btn => {
    btn.addEventListener('click', () => {
      editingGalleryIndex = parseInt(btn.dataset.index);
      renderGalleryForm();
    });
  });

  container.querySelectorAll('[data-action="delete-gallery"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this gallery item?')) {
        galleryData.splice(parseInt(btn.dataset.index), 1);
        try { await adminApi.saveGallery(galleryData); renderGalleryTable(); }
        catch (err) { alert('Error: ' + err.message); }
      }
    });
  });
}

function renderGalleryForm() {
  const container = document.getElementById('content-area');
  const g = editingGalleryIndex === -1 ? { title: '', category: 'exterior', src: '', thumb: '', width: 1200, height: 800 } : galleryData[editingGalleryIndex];
  
  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${editingGalleryIndex === -1 ? 'Add Gallery Image' : 'Edit Gallery Image'}</h3>
        <div>
          <button class="btn btn-outline" id="cancel-gallery-btn">Cancel</button>
          <button class="btn btn-primary" id="save-gallery-btn">Save</button>
        </div>
      </div>
      <div style="padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group"><label class="form-label">Title</label><input type="text" id="gal-title" class="form-control" value="${g.title || ''}"></div>
        <div class="form-group"><label class="form-label">Category</label>
          <select id="gal-cat" class="form-control">
            <option value="exterior" ${g.category === 'exterior' ? 'selected' : ''}>Exterior</option>
            <option value="interior" ${g.category === 'interior' ? 'selected' : ''}>Interior</option>
            <option value="performance" ${g.category === 'performance' ? 'selected' : ''}>Performance</option>
            <option value="technology" ${g.category === 'technology' ? 'selected' : ''}>Technology</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Image URL</label>
          <div style="display:flex;gap:5px;">
            <input type="text" id="gal-src" class="form-control" value="${g.src || ''}">
            <button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="gal-src">Upload</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Thumbnail URL</label>
          <div style="display:flex;gap:5px;">
            <input type="text" id="gal-thumb" class="form-control" value="${g.thumb || g.src || ''}">
            <button class="btn btn-outline upload-btn" style="padding:0 10px;" data-target="gal-thumb">Upload</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Width</label><input type="number" id="gal-w" class="form-control" value="${g.width || 1200}"></div>
        <div class="form-group"><label class="form-label">Height</label><input type="number" id="gal-h" class="form-control" value="${g.height || 800}"></div>
      </div>
    </div>
  `;

  container.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', () => uploadToInput(btn.dataset.target));
  });

  document.getElementById('cancel-gallery-btn').addEventListener('click', renderGalleryTable);
  document.getElementById('save-gallery-btn').addEventListener('click', async () => {
    const newItem = {
      title: document.getElementById('gal-title').value,
      category: document.getElementById('gal-cat').value,
      src: document.getElementById('gal-src').value,
      thumb: document.getElementById('gal-thumb').value,
      width: parseInt(document.getElementById('gal-w').value) || 1200,
      height: parseInt(document.getElementById('gal-h').value) || 800
    };
    if (!newItem.title || !newItem.src) return alert("Title and Image URL are required");

    if (editingGalleryIndex === -1) {
      galleryData.push(newItem);
    } else {
      galleryData[editingGalleryIndex] = newItem;
    }

    try { 
      await adminApi.saveGallery(galleryData); 
      renderGalleryTable();
    } catch (err) { alert('Error: ' + err.message); }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACTS & RESERVATIONS (Read-only)
// ═══════════════════════════════════════════════════════════════════
async function initContactTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Contacts', 'Loading...');
  try {
    const data = await adminApi.getContacts();
    let rows = data.map(c => `
      <tr>
        <td><strong>${c.name}</strong><br><small>${c.email || '-'}</small></td>
        <td>${c.phone}</td>
        <td>${(c.message || '').substring(0, 50)}...</td>
        <td><small>${c.date ? new Date(c.date).toLocaleString() : '-'}</small></td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Contact Messages</h3></div>
        <table class="data-table">
          <thead><tr><th>Sender</th><th>Phone</th><th>Message</th><th>Date</th></tr></thead>
          <tbody>${rows.length ? rows : '<tr><td colspan="4" class="empty-state">No messages yet</td></tr>'}</tbody>
        </table>
      </div>
    `;
  } catch (e) { container.innerHTML = '<div class="dashboard-card"><p style="color:var(--danger);">Error loading contacts.</p></div>'; }
}

async function initReservationTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Reservations', 'Loading...');
  try {
    const data = await adminApi.getReservations();
    let rows = data.map(r => `
      <tr>
        <td><strong>${r.name}</strong><br><small>${r.phone}</small></td>
        <td><span class="badge badge-active">${r.model}</span></td>
        <td>${r.dealer}</td>
        <td>${r.date || '-'} ${r.time || ''}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="dashboard-card" style="margin-bottom: 2rem;">
        <div class="card-header"><h3 class="card-title">Reservation Form Settings</h3></div>
        <div class="form-group">
          <label class="form-label">Gambar Latar Reservasi (Reservation Image)</label>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="res-image-url" class="form-control" placeholder="https://..." value="">
            <button class="btn btn-outline" onclick="uploadToInput('res-image-url')"><i data-lucide="upload"></i> Upload</button>
            <button class="btn btn-primary" id="save-res-settings">Save</button>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-header"><h3 class="card-title">Test Drive Reservations</h3></div>
        <table class="data-table">
          <thead><tr><th>Customer</th><th>Model</th><th>Dealer</th><th>Schedule</th></tr></thead>
          <tbody>${rows.length ? rows : '<tr><td colspan="4" class="empty-state">No reservations yet</td></tr>'}</tbody>
        </table>
      </div>
    `;
    
    // Fetch and populate current setting
    fetch('/api/settings').then(r=>r.json()).then(s => {
      if(s.reservationImage) document.getElementById('res-image-url').value = s.reservationImage;
    });

    document.getElementById('save-res-settings')?.addEventListener('click', async () => {
      try {
        const s = await fetch('/api/settings').then(r=>r.json());
        s.reservationImage = document.getElementById('res-image-url').value;
        await adminApi.saveSettings(s);
        alert('Pengaturan reservasi berhasil disimpan!');
      } catch (err) { alert('Gagal menyimpan: ' + err.message); }
    });

  } catch (e) { container.innerHTML = '<div class="dashboard-card"><p style="color:var(--danger);">Error loading reservations.</p></div>'; }
}

// ═══════════════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════════════
async function initSettingsTab() {
  const container = document.getElementById('content-area');
  container.innerHTML = renderPlaceholderView('Settings', 'Loading...');
  try {
    const res = await fetch('/api/settings');
    settingsData = await res.json();
    renderSettingsView();
  } catch (e) { console.error(e); }
}

function renderSettingsView() {
  const container = document.getElementById('content-area');
  container.innerHTML = `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">Media & Settings</h3>
        <button class="btn btn-primary" id="save-settings-btn"><i data-lucide="save"></i> Save Changes</button>
      </div>
      <div class="form-group">
        <label class="form-label">Video "Tentang Kami" (About Us Video URL)</label>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Masukkan link video MP4 atau unggah langsung.</p>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <input type="text" id="setting-about-video" class="form-control" value="${settingsData.aboutVideoUrl || ''}" placeholder="https://.../video.mp4">
        </div>
        <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px dashed var(--border-color);">
          <label class="form-label" style="margin-bottom: 10px; display: block;">Unggah Video Baru (MP4, WebM)</label>
          <div style="display: flex; align-items: center; gap: 15px;">
            <input type="file" id="video-upload-input" accept="video/mp4,video/webm" style="color: var(--text-main);">
            <button class="btn btn-outline" id="btn-upload-video"><i data-lucide="upload"></i> Unggah Video</button>
          </div>
          <div id="video-upload-status" style="margin-top: 10px; font-size: 0.85rem; color: var(--success); display: none;">Video berhasil diunggah!</div>
        </div>
      </div>
    </div>
  `;
  createIcons({ icons });

  document.getElementById('save-settings-btn').addEventListener('click', async () => {
    settingsData.aboutVideoUrl = document.getElementById('setting-about-video').value;
    try {
      await adminApi.saveSettings(settingsData);
      alert('Settings saved!');
    } catch (err) { alert('Error: ' + err.message); }
  });

  document.getElementById('btn-upload-video').addEventListener('click', async () => {
    const fileInput = document.getElementById('video-upload-input');
    if (!fileInput.files?.length) { alert('Pilih file video terlebih dahulu!'); return; }
    try {
      const data = await adminApi.upload(fileInput.files[0]);
      document.getElementById('setting-about-video').value = data.url;
      const status = document.getElementById('video-upload-status');
      status.style.display = 'block';
      setTimeout(() => status.style.display = 'none', 5000);
    } catch (err) { alert('Upload error: ' + err.message); }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  UPLOAD HELPER
// ═══════════════════════════════════════════════════════════════════
function uploadToInput(inputId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const targetInput = document.getElementById(inputId);
    if (!targetInput) return;
    const oldVal = targetInput.value;
    targetInput.value = 'Uploading...';
    try {
      const data = await adminApi.upload(file);
      targetInput.value = data.url;
    } catch (err) {
      alert('Upload error: ' + err.message);
      targetInput.value = oldVal;
    }
  };
  input.click();
}

// ─── Bootstrap ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
