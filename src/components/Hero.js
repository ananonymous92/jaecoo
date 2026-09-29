export const renderHero = (t, modelsData = []) => {
  const hero = document.getElementById('hero');
  
  // Use up to 3 models for hero banner
  const heroModels = modelsData.slice(0, 3);
  
  if (heroModels.length === 0) {
    hero.innerHTML = `<div class="hero-slide active" style="background: var(--color-deep-black); display:flex; align-items:center; justify-content:center; min-height:100vh;">
      <div class="hero-content"><div class="container"><h1 class="hero-headline">JAECOO Indonesia</h1></div></div>
    </div>`;
    return;
  }

  hero.innerHTML = `
    <div class="hero-slider" id="hero-slider">
      ${heroModels.map((model, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}">
          <img src="${model.heroImage}" class="hero-slide-bg" alt="${model.name}">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="container">
              <span class="hero-badge">${model.badge}</span>
              <h1 class="hero-headline">${model.name}</h1>
              <p class="hero-subheadline">${model.tagline}. ${model.shortDesc.substring(0, 100)}...</p>
              <div class="hero-actions">
                <a href="javascript:void(0)" onclick="window.openModelDetail('${model.slug}')" class="btn btn-primary">${t.hero.ctaExplore || 'EXPLORE MODEL'}</a>
                <a href="#reservation" class="btn btn-outline">${t.hero.ctaReservation || 'BOOK TEST DRIVE'}</a>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="hero-controls">
      <div class="container">
        <div class="hero-pagination" id="hero-pagination">
          ${heroModels.map((_, index) => `
            <div class="hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}"><div class="hero-dot-progress"></div></div>
          `).join('')}
        </div>
        <div class="hero-nav">
          <button class="hero-nav-btn" id="hero-prev"><i data-lucide="chevron-left"></i></button>
          <button class="hero-nav-btn" id="hero-next"><i data-lucide="chevron-right"></i></button>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <span>SCROLL</span>
      <div class="scroll-line"></div>
    </div>
  `;
};

export const initHeroEvents = () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000;

  if (!slides.length) return;

  const goToSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => {
      d.classList.remove('active');
      // Reset animation
      const progress = d.querySelector('.hero-dot-progress');
      if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight; // trigger reflow
      }
    });

    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    const progress = dots[currentSlide].querySelector('.hero-dot-progress');
    if (progress) {
      progress.style.animation = `progress ${slideDuration/1000}s linear forwards`;
    }

    resetInterval();
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const resetInterval = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  resetInterval();
  
  // Initialize first animation
  if (dots[0]) {
    const firstProgress = dots[0].querySelector('.hero-dot-progress');
    if (firstProgress) {
      firstProgress.style.animation = `progress ${slideDuration/1000}s linear forwards`;
    }
  }
};
