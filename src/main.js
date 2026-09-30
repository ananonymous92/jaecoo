import { createIcons, icons } from 'lucide';
import { translations } from './data/i18n.js';
import { fetchAllPublicData } from './utils/apiClient.js';

window.lucide = { createIcons, icons };

// Component Imports
import { renderHeader, initHeaderEvents } from './components/Header.js';
import { renderHero, initHeroEvents } from './components/Hero.js';
import { renderBrandIntro } from './components/BrandIntro.js';
import { renderModels, initModelEvents } from './components/ModelShowcase.js';
import { renderSHS, initSHSEvents } from './components/ShsDiagram.js';
import { renderTech } from './components/BrandIntro.js';
import { renderGallery, initGalleryEvents } from './components/Gallery.js';
import { renderTestimony, initTestimonyEvents } from './components/TestimonySlider.js';
import { renderNews, initNewsEvents } from './components/NewsSection.js';
import { renderDealerLocator, initDealerEvents } from './components/DealerLocator.js';
import { renderForms, initFormEvents } from './components/ReservationForm.js';
import { renderFooter, initFooterEvents } from './components/Footer.js';
import { initRouter } from './components/Router.js';

// Global State
window.appState = {
  lang: 'id',
  t: translations['id'],
  // Dynamic data from API (populated before first render)
  data: {
    models: [],
    news: [],
    dealers: [],
    testimonials: [],
    gallery: [],
    settings: {}
  }
};

export const setLanguage = (lang) => {
  if (translations[lang]) {
    window.appState.lang = lang;
    window.appState.t = translations[lang];
    renderApp();
  }
};

const renderApp = () => {
  const t = window.appState.t;
  const data = window.appState.data;
  
  renderHeader(t, data.models);
  renderHero(t, data.models);
  renderModels(t, data.models);
  renderSHS(t);
  renderTech(t);
  renderGallery(t, data.gallery);
  renderTestimony(t, data.testimonials);
  renderNews(t, data.news);
  renderBrandIntro(t, data.settings);
  renderDealerLocator(t, data.dealers);
  renderForms(t, data.models, data.dealers);
  renderFooter(t, data.settings);

  // Initialize Icons
  createIcons({
    icons,
    nameAttr: 'data-lucide',
    attrs: {
      class: 'lucide',
      'stroke-width': 1.5
    }
  });

  // Re-attach events
  initHeaderEvents();
  initHeroEvents();
  initModelEvents();
  initFormEvents();
  initSHSEvents();
  initGalleryEvents();
  initTestimonyEvents();
  initNewsEvents();
  initDealerEvents();
  initFormEvents();
  initFooterEvents();
};

const init = async () => {
  // Fetch all dynamic data from API before rendering
  try {
    const data = await fetchAllPublicData();
    window.appState.data = data;
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }

  renderApp();
  initRouter();
  
  // Reveal on scroll
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
