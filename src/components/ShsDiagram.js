export const renderSHS = (t) => {
  const section = document.getElementById('shs');
  
  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.shs.title}</span>
        <h2 class="section-title">${t.shs.subtitle}</h2>
        <p class="section-subtitle">${t.shs.desc}</p>
      </div>

      <!-- Interactive Flow Diagram -->
      <div class="shs-diagram-container reveal-on-scroll" style="transition-delay: 0.2s">
        <div class="energy-flow-lines">
          <div class="energy-particle" style="animation-delay: 0s"></div>
          <div class="energy-particle" style="animation-delay: 1s"></div>
          <div class="energy-particle" style="animation-delay: 2s"></div>
        </div>
        
        <div class="shs-diagram-grid">
          <!-- Engine & DHT -->
          <div class="shs-node" id="node-engine">
            <i data-lucide="settings" class="shs-node-icon" style="animation: spin 8s linear infinite;"></i>
            <h4 class="shs-node-title">1.5 TGDI Turbo + DHT</h4>
            <p class="shs-node-desc">Efisiensi termal 44.5% dengan transmisi khusus hybrid</p>
          </div>

          <!-- Dual Motor -->
          <div class="shs-node" id="node-motor">
            <i data-lucide="zap" class="shs-node-icon"></i>
            <h4 class="shs-node-title">Dual Electric Motors</h4>
            <p class="shs-node-desc">Torsi instan dan transisi daya tanpa jeda (seamless)</p>
          </div>

          <!-- Battery & AI -->
          <div class="shs-node" id="node-battery">
            <i data-lucide="battery-charging" class="shs-node-icon"></i>
            <h4 class="shs-node-title">High-Power Battery</h4>
            <p class="shs-node-desc">Baterai blade khusus PHEV dengan manajemen suhu cerdas</p>
          </div>
        </div>
      </div>

      <!-- Mode Cards -->
      <div class="shs-modes-grid">
        <div class="shs-mode-card reveal-on-scroll" style="transition-delay: 0.3s">
          <span class="shs-mode-number">01</span>
          <h4 class="shs-mode-title">${t.shs.mode1Title}</h4>
          <p class="shs-mode-desc">${t.shs.mode1Desc}</p>
        </div>
        <div class="shs-mode-card reveal-on-scroll" style="transition-delay: 0.4s">
          <span class="shs-mode-number">02</span>
          <h4 class="shs-mode-title">${t.shs.mode2Title}</h4>
          <p class="shs-mode-desc">${t.shs.mode2Desc}</p>
        </div>
        <div class="shs-mode-card reveal-on-scroll" style="transition-delay: 0.5s">
          <span class="shs-mode-number">03</span>
          <h4 class="shs-mode-title">${t.shs.mode3Title}</h4>
          <p class="shs-mode-desc">${t.shs.mode3Desc}</p>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
  `;
};

export const initSHSEvents = () => {
  // Additional interactive effects can be added here
};
