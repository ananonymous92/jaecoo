export const renderNews = (t, newsData = []) => {
  const section = document.getElementById('news');
  
  // Display only top 3 news on homepage
  const recentNews = newsData.slice(0, 3);

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.news.title}</span>
        <h2 class="section-title">${t.news.subtitle}</h2>
      </div>

      <div class="news-grid">
        ${recentNews.map((news, i) => `
          <div class="news-card reveal-on-scroll" data-slug="${news.slug}" style="transition-delay: ${0.1 * i}s">
            <div class="news-img-wrap">
              <span class="news-category-badge">${news.category}</span>
              <img src="${news.image}" alt="${news.title}" class="news-img" loading="lazy">
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span><i data-lucide="calendar" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>${news.date}</span>
                <span><i data-lucide="clock" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>${news.readTime}</span>
              </div>
              <h3 class="news-title">${news.title}</h3>
              <p class="news-excerpt">${news.excerpt}</p>
              <a href="javascript:void(0)" onclick="window.openNewsDetail('${news.slug}')" class="news-readmore">${t.news.readMore} <i data-lucide="arrow-right" style="width:16px;height:16px"></i></a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

export const initNewsEvents = () => {
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent double trigger if clicked on the readmore link itself
      if(!e.target.closest('.news-readmore')) {
        const slug = card.getAttribute('data-slug');
        window.openNewsDetail(slug);
      }
    });
  });
};

export const renderArticleModal = (slug) => {
  // Get news from dynamic state
  const newsData = window.appState?.data?.news || [];
  const article = newsData.find(n => n.slug === slug);
  if (!article) return;

  const modal = document.getElementById('article-modal');
  
  modal.innerHTML = `
    <button class="detail-close-btn" onclick="window.closeModals()">
      <i data-lucide="x"></i>
    </button>

    <div class="article-header">
      <img src="${article.image}" class="article-hero-img" alt="${article.title}">
      <div class="article-header-overlay">
        <div class="container">
          <span class="badge badge-cyan" style="margin-bottom: 1rem;">${article.category}</span>
          <h1 style="font-size: clamp(2rem, 4vw, 3.5rem); margin-bottom: 1rem;">${article.title}</h1>
          <div style="display: flex; gap: 1.5rem; color: var(--color-light-gray); font-size: 0.95rem;">
            <span><i data-lucide="calendar" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:6px;"></i>${article.date}</span>
            <span><i data-lucide="clock" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:6px;"></i>${article.readTime}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="article-body">
      ${article.content}
    </div>
    
    <div class="text-center" style="padding: 4rem 0; border-top: 1px solid var(--color-border-light);">
      <button class="btn btn-outline" onclick="window.closeModals()">KEMBALI KE BERANDA</button>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({
      icons: window.lucide.icons,
      root: modal,
      nameAttr: 'data-lucide',
      attrs: { class: 'lucide', 'stroke-width': 1.5 }
    });
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};
