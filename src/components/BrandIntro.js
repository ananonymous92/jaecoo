export const renderBrandIntro = (t, settings = {}) => {
  const section = document.getElementById('about');
  
  const videoUrl = settings.aboutVideoUrl || "https://cdn.pixabay.com/video/2021/08/11/84687-586791244_large.mp4";
  
  section.innerHTML = `
    <!-- Video Background -->
    <video autoplay muted loop playsinline class="brand-intro-video">
      <source src="${videoUrl}" type="video/mp4">
    </video>
    
    <!-- Lighter Overlay for better video visibility -->
    <div class="brand-intro-overlay">
      <div class="brand-intro-content reveal-on-scroll">
        <span class="brand-intro-eyebrow">${t.about.title}</span>
        <h2 class="brand-intro-heading">${t.brandStatement.heading}</h2>
        <div class="brand-intro-divider"></div>
        <p class="brand-intro-desc">${t.about.desc1}</p>
        <p class="brand-intro-desc2">${t.about.desc2}</p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="brand-stats-bar">
      ${t.about.stats.map(stat => `
        <div class="brand-stat-item">
          <span class="brand-stat-value">${stat.value}</span>
          <span class="brand-stat-label">${stat.label}</span>
        </div>
      `).join('')}
    </div>
  `;
};

export const renderTech = () => {
  const section = document.getElementById('technology');
  
  const techFeatures = [
    { icon: 'shield-check', title: '5-Star Global Safety', desc: 'Sertifikasi uji tabrak bintang 5 dari Euro NCAP berkat sangkar bodi ultra-rigid 80% High-Strength Steel.' },
    { icon: 'cpu', title: 'Snapdragon 8155', desc: 'Pemrosesan komputasi cerdas nan cepat untuk memastikan sistem infotainment berjalan mulus tanpa lag.' },
    { icon: 'eye', title: '540° Transparent Chassis', desc: 'Visualisasi 360 derajat keliling plus kolong mobil untuk kemudahan bermanuver di jalan sempit atau off-road.' },
    { icon: 'music', title: 'Sony Acoustic Soundstage', desc: 'Sistem audio 14 speaker besutan Sony dengan amplifier DSP menghadirkan kualitas audio concert hall.' }
  ];

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">TEKNOLOGI PINTAR</span>
        <h2 class="section-title">ENGINEERED FOR MORE</h2>
        <p class="section-subtitle">Inovasi tanpa kompromi untuk kenyamanan, keselamatan, dan kepuasan berkendara tingkat tertinggi.</p>
      </div>
      
      <div class="tech-grid">
        ${techFeatures.map((tech, i) => `
          <div class="tech-card reveal-on-scroll" style="transition-delay: ${0.1 * (i + 1)}s">
            <i data-lucide="${tech.icon}" class="tech-icon"></i>
            <h3 class="tech-title">${tech.title}</h3>
            <p style="font-size: 0.9rem; color: var(--color-soft-gray);">${tech.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};
