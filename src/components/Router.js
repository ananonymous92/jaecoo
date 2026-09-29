import { renderModelDetailView } from './ModelShowcase.js';
import { renderArticleModal } from './NewsSection.js';

window.openModelDetail = (slug) => {
  const modelView = document.getElementById('model-detail-view');
  const articleModal = document.getElementById('article-modal');
  if (modelView) {
    modelView.classList.remove('active');
    modelView.style.display = '';
  }
  if (articleModal) articleModal.classList.remove('active');
  document.body.style.overflow = '';

  renderModelDetailView(slug);
  window.location.hash = `#/model/${slug}`;
};

window.closeModals = () => {
  const modelView = document.getElementById('model-detail-view');
  const articleModal = document.getElementById('article-modal');
  if (modelView) {
    modelView.classList.remove('active');
    modelView.style.display = 'none';
  }
  if (articleModal) {
    articleModal.classList.remove('active');
  }
  document.body.style.overflow = '';
  // Avoid reloading page, just clear the hash locally without triggering history
  if (window.location.hash.startsWith('#/')) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
};

window.openNewsDetail = (slug) => {
  const modelView = document.getElementById('model-detail-view');
  const articleModal = document.getElementById('article-modal');
  if (modelView) {
    modelView.classList.remove('active');
    modelView.style.display = '';
  }
  if (articleModal) articleModal.classList.remove('active');
  document.body.style.overflow = '';

  renderArticleModal(slug);
  window.location.hash = `#/news/${slug}`;
};

export const initRouter = () => {
  const handleRouteChange = () => {
    let hash = window.location.hash;
    try {
      hash = decodeURIComponent(hash);
    } catch (e) {}

    // Only route if modal is not already open to prevent infinite loops
    if (hash.startsWith('#/model/')) {
      const slug = hash.replace('#/model/', '');
      const view = document.getElementById('model-detail-view');
      if (!view || !view.classList.contains('active')) {
        window.openModelDetail(slug);
      }
    } else if (hash.startsWith('#/news/')) {
      const slug = hash.replace('#/news/', '');
      const modal = document.getElementById('article-modal');
      if (!modal || !modal.classList.contains('active')) {
        window.openNewsDetail(slug);
      }
    } else {
       // Close modals if navigating back to home
       const modelView = document.getElementById('model-detail-view');
       const articleModal = document.getElementById('article-modal');
       if (modelView && modelView.classList.contains('active')) {
         modelView.classList.remove('active');
         modelView.style.display = 'none';
         document.body.style.overflow = '';
       }
       if (articleModal && articleModal.classList.contains('active')) {
         articleModal.classList.remove('active');
         document.body.style.overflow = '';
       }
    }
  };

  window.addEventListener('hashchange', handleRouteChange);
  
  // Initial check on load
  handleRouteChange();
};
