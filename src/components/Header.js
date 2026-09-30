import { setLanguage } from '../main.js';

export const renderHeader = (t, modelsData = []) => {
  const header = document.getElementById('site-header');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Render Header
  header.innerHTML = `
    <div class="container header-inner">
      <a href="javascript:void(0)" class="brand-logo" onclick="if(window.closeModals) window.closeModals(); window.location.hash=''; window.scrollTo({top:0, behavior:'smooth'});">
        <img src="/images/logo.png" alt="JAECOO" onerror="this.outerHTML='<span class=\\'logo-text\\'>JAECOO</span>'" style="height: 20px; filter: brightness(0) invert(1);">
      </a>
      
      <nav class="nav-desktop">
        <div class="nav-item-dropdown">
          <a href="#models" class="nav-link dropdown-trigger">
            ${t.nav.model} <i data-lucide="chevron-down" class="dropdown-icon"></i>
          </a>
          <div class="simple-dropdown">
            ${modelsData.map(m => `<a href="javascript:void(0)" onclick="window.openModelDetail('${m.slug}')" class="dropdown-link">${m.name}</a>`).join('')}
          </div>
        </div>
        <a href="#shs" class="nav-link">${t.nav.shs}</a>
        <a href="#technology" class="nav-link">TECHNOLOGY</a>
        <a href="#gallery" class="nav-link">${t.nav.gallery}</a>
        <a href="#news" class="nav-link">${t.nav.news}</a>
        <a href="#about" class="nav-link">${t.nav.about}</a>
        <a href="#dealers" class="nav-link">${t.nav.findUs}</a>
      </nav>

      <div class="header-actions">
        <div class="lang-switch">
          <button class="lang-btn ${window.appState.lang === 'id' ? 'active' : ''}" data-lang="id">ID</button>
          <button class="lang-btn ${window.appState.lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        </div>
        <a href="#reservation" class="btn btn-outline btn-sm hide-on-mobile">${t.nav.reservation}</a>
        
        <button class="hamburger-btn" id="mobile-menu-btn" aria-label="Toggle Menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  `;

  // Render Mobile Drawer
  mobileDrawer.innerHTML = `
    <div class="mobile-nav-links">
      <a href="#models" class="mobile-nav-link menu-close">${t.nav.model}</a>
      <div class="mobile-model-submenu">
        ${modelsData.map(m => `
          <a href="javascript:void(0)" onclick="window.openModelDetail('${m.slug}')" class="mobile-model-item menu-close">
            <span>${m.name}</span>
            <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
          </a>
        `).join('')}
      </div>
      <a href="#shs" class="mobile-nav-link menu-close">${t.nav.shs}</a>
      <a href="#technology" class="mobile-nav-link menu-close">TECHNOLOGY</a>
      <a href="#gallery" class="mobile-nav-link menu-close">${t.nav.gallery}</a>
      <a href="#news" class="mobile-nav-link menu-close">${t.nav.news}</a>
      <a href="#about" class="mobile-nav-link menu-close">${t.nav.about}</a>
      <a href="#dealers" class="mobile-nav-link menu-close">${t.nav.findUs}</a>
      <a href="#reservation" class="mobile-nav-link menu-close" style="color: var(--color-accent-cyan)">${t.nav.reservation}</a>
    </div>
    <div class="mobile-drawer-footer">
      <a href="https://wa.me/6281338384136?text=Halo,%20saya%20ingin%20bertanya%20tentang%20mobil%20JAECOO" target="_blank" class="btn btn-cyan">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:1.2em; height:1.2em; fill:currentColor; margin-right:6px; margin-bottom:-2px;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> HUBUNGI WHATSAPP
      </a>
    </div>
  `;
};

export const initHeaderEvents = () => {
  const header = document.getElementById('site-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.menu-close').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.getAttribute('data-lang');
      if (lang !== window.appState.lang) {
        setLanguage(lang);
      }
    });
  });
};
