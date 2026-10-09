export const renderTestimony = (t, testimonialsData = []) => {
  const section = document.getElementById('testimony');
  
  section.innerHTML = `
    <div class="container" style="overflow: hidden;">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.testimony.title}</span>
        <h2 class="section-title">${t.testimony.subtitle}</h2>
      </div>

      <div class="testimony-slider" id="testimony-track">
        ${testimonialsData.map((review, i) => `
          <div class="testimony-card reveal-on-scroll" style="transition-delay: ${0.1 * i}s">
            <div class="testimony-header">
              <img src="${review.avatar}" alt="${review.name}" class="testimony-avatar">
              <div class="testimony-meta">
                <h4>${review.name}</h4>
                <p>${review.role} — <strong>${review.model}</strong></p>
              </div>
            </div>
            <div class="testimony-rating">
              ${'<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'.repeat(review.rating)}
            </div>
            <p class="testimony-quote">"${review.quote}"</p>
          </div>
        `).join('')}
      </div>

      <div class="slider-controls reveal-on-scroll">
        <button class="btn btn-icon btn-outline" id="testimony-prev"><i data-lucide="chevron-left"></i></button>
        <button class="btn btn-icon btn-outline" id="testimony-next"><i data-lucide="chevron-right"></i></button>
      </div>
    </div>
  `;
};

export const initTestimonyEvents = () => {
  const track = document.getElementById('testimony-track');
  const prevBtn = document.getElementById('testimony-prev');
  const nextBtn = document.getElementById('testimony-next');
  
  if(!track || !prevBtn || !nextBtn) return;
  
  const getCardWidth = () => {
    const card = track.querySelector('.testimony-card');
    // Card width + 2rem gap
    return card ? card.offsetWidth + 32 : 412;
  };

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    // If near the end, loop back
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    }
  });
};
