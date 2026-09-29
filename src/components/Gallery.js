export const renderGallery = (t, galleryData = []) => {
  const section = document.getElementById('gallery');
  
  // Extract unique categories
  const categories = ['ALL', ...new Set(galleryData.map(item => item.category))];

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.gallery.title}</span>
        <h2 class="section-title">${t.gallery.subtitle}</h2>
      </div>

      <div class="gallery-filters reveal-on-scroll">
        ${categories.map((cat, i) => `
          <button class="gallery-filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>
        `).join('')}
      </div>

      <div class="gallery-grid" id="gallery-grid">
        ${galleryData.map((item, i) => `
          <div class="gallery-item reveal-on-scroll" data-category="${item.category}" data-index="${i}" style="transition-delay: ${0.05 * (i % 6)}s">
            <img src="${item.thumb}" alt="${item.title}" class="gallery-img" loading="lazy">
            <div class="gallery-overlay">
              <span class="gallery-item-category">${item.category}</span>
              <h4 class="gallery-item-title">${item.title}</h4>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

export const initGalleryEvents = () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  
  // Get gallery data from dynamic state
  const galleryData = window.appState?.data?.gallery || [];
  
  if(!lightbox) return;

  // Render lightbox internals if empty
  if (lightbox.innerHTML === '') {
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lb-close"><i data-lucide="x" style="width:32px;height:32px"></i></button>
      <button class="lightbox-nav lightbox-prev" id="lb-prev"><i data-lucide="chevron-left"></i></button>
      <div class="lightbox-img-wrap">
        <img src="" class="lightbox-img" id="lb-img" alt="Gallery Image">
        <div class="lightbox-caption" id="lb-caption"></div>
      </div>
      <button class="lightbox-nav lightbox-next" id="lb-next"><i data-lucide="chevron-right"></i></button>
    `;
    
    if (window.lucide) {
      window.lucide.createIcons({
        root: lightbox,
        nameAttr: 'data-lucide',
        attrs: { class: 'lucide', 'stroke-width': 1.5 }
      });
    }
  }

  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  let currentIndex = 0;
  let currentFilteredList = [...galleryData];

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      items.forEach(item => {
        if (filter === 'ALL' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
      
      currentFilteredList = filter === 'ALL' ? galleryData : galleryData.filter(d => d.category === filter);
    });
  });

  // Lightbox opening
  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'));
      const dataItem = galleryData[idx];
      if (dataItem) openLightbox(dataItem);
    });
  });

  const openLightbox = (dataItem) => {
    lbImg.src = dataItem.full;
    lbCaption.innerHTML = `<strong>${dataItem.title}</strong><br>${dataItem.caption}`;
    lightbox.classList.add('active');
    currentIndex = currentFilteredList.findIndex(d => d.id === dataItem.id);
    if(currentIndex === -1) currentIndex = 0;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const navigateLb = (direction) => {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = currentFilteredList.length - 1;
    if (currentIndex >= currentFilteredList.length) currentIndex = 0;
    
    const dataItem = currentFilteredList[currentIndex];
    lbImg.style.opacity = 0;
    setTimeout(() => {
      lbImg.src = dataItem.full;
      lbCaption.innerHTML = `<strong>${dataItem.title}</strong><br>${dataItem.caption}`;
      lbImg.style.opacity = 1;
    }, 200);
  };

  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lb-prev')?.addEventListener('click', () => navigateLb(-1));
  document.getElementById('lb-next')?.addEventListener('click', () => navigateLb(1));
  
  // Close on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrap')) {
      closeLightbox();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLb(-1);
    if (e.key === 'ArrowRight') navigateLb(1);
  });
};
