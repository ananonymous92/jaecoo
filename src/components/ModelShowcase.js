// Models data is now dynamic — stored on window.appState.data.models
// and passed in from main.js

export const renderModels = (t, modelsData = []) => {
  const section = document.getElementById('models');

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.models.title}</span>
        <h2 class="section-title">${t.models.subtitle}</h2>
      </div>

      <div class="model-showcase-grid">
        ${modelsData.map((model, i) => `
          <div class="model-card reveal-on-scroll" style="transition-delay: ${0.1 * i}s">
            <span class="model-card-badge">${model.badge}</span>
            <div class="model-card-image-wrap">
              <img src="${model.cardImage}" alt="${model.name}" class="model-card-image">
            </div>
            <div class="model-card-content">
              <h3 class="model-card-title">${model.name}</h3>
              <p class="model-card-tagline">${model.category}</p>
              
              <div class="model-card-specs">
                <div class="spec-item">
                  <i data-lucide="zap" class="spec-icon"></i>
                  <span>${model.specs.power}</span>
                </div>
                <div class="spec-item">
                  <i data-lucide="gauge" class="spec-icon"></i>
                  <span>${model.specs.torque}</span>
                </div>
                <div class="spec-item">
                  <i data-lucide="battery" class="spec-icon"></i>
                  <span>${model.specs.drivingRange || model.specs.evRange}</span>
                </div>
              </div>
              
              <div class="model-card-price">${model.price}</div>
              
              <div class="model-card-actions">
                <a href="javascript:void(0)" onclick="window.openModelDetail('${model.slug}')" class="btn btn-outline-dark" style="color:var(--color-white); border-color:var(--color-border-light)">${t.models.learnMore}</a>
                <a href="#reservation" class="btn btn-primary">${t.models.reservation}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

export const initModelEvents = () => {
  // Setup color selector events in the detail view modal when triggered by Router
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch-wrap');
    if (swatch) {
      const src = swatch.getAttribute('data-img');
      const name = swatch.getAttribute('data-name');
      const targetImg = document.getElementById('active-color-img');
      const nameTitle = document.getElementById('active-color-title');

      if (targetImg && src) {
        targetImg.style.opacity = 0;
        setTimeout(() => {
          targetImg.src = src;
          targetImg.style.opacity = 1;
        }, 200);

        if (nameTitle && name) {
          nameTitle.textContent = name;
        }

        document.querySelectorAll('.color-swatch-wrap').forEach(el => el.classList.remove('active'));
        swatch.classList.add('active');
      }
    }
  });
};

export const renderModelDetailView = (slug) => {
  try {
    // Get models from dynamic state
    const modelsData = window.appState?.data?.models || [];
    const model = modelsData.find(m => m.slug === slug);
    if (!model) return;

    const view = document.getElementById('model-detail-view');

    // Get active translation
    const t = window.appState.t;

    view.innerHTML = `
      <div class="model-page-container" style="position:relative;">
        <button onclick="window.closeModals()" style="position:fixed; top:2rem; right:2rem; z-index:9999; background:rgba(0,0,0,0.4); border:none; border-radius:50%; width:45px; height:45px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; transition:background 0.3s ease;" onmouseover="this.style.background='rgba(0,0,0,0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.4)'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <!-- ═══ HERO ═══ -->
        <div class="model-page-hero" style="background-image: url('${model.heroImage}');">
          <div class="model-hero-content text-center">
            <!-- Text overlay removed to prevent overlap with designed banners -->
          </div>
          <div class="scroll-indicator" style="position:absolute; right: 2rem; bottom: 10rem; display:flex; flex-direction:column; align-items:center; gap:0.5rem; color:#fff;">
            <div class="mouse-icon" style="width:24px; height:36px; border:2px solid #fff; border-radius:12px; position:relative;">
              <div style="width:4px; height:8px; background:#fff; border-radius:2px; position:absolute; top:6px; left:50%; transform:translateX(-50%);"></div>
            </div>
            <span style="writing-mode: vertical-rl; transform: rotate(180deg); font-size: 0.7rem; letter-spacing: 0.2em;">SCROLL TO DISCOVER MORE</span>
          </div>
        </div>

        <!-- ═══ SPECS / POWERTRAIN ═══ -->
        ${model.specs ? `
        <div style="padding: 5rem 0; background: #0a0a0a; color: #fff;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <div style="text-align:center; margin-bottom: 3.5rem;">
              <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600; text-transform:uppercase;">${model.powertrain ? 'POWERTRAIN' : 'SPECIFICATIONS'}</span>
              <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight:700; margin-top:0.5rem; letter-spacing:-0.02em;">${model.powertrain || 'TECHNICAL SPECS'}</h2>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1px; background:rgba(255,255,255,0.08); border-radius:16px; overflow:hidden;">
              ${Object.entries(model.specs).filter(([key]) => !['wadingDepth'].includes(key)).map(([key, value]) => {
      const labels = {
        power: 'Max Power', torque: 'Max Torque', battery: 'Battery', evRange: 'EV Range',
        drivingRange: 'Driving Range', acceleration: 'Acceleration', driveSystem: 'Drive System',
        groundClearance: 'Ground Clearance', wadingDepth: 'Wading Depth',
        chargingTime: 'Charging', energyEfficiency: 'Efficiency'
      };
      const specIcons = {
        power: 'zap', torque: 'gauge', battery: 'battery-charging', evRange: 'route',
        drivingRange: 'map', acceleration: 'timer', driveSystem: 'settings',
        groundClearance: 'arrow-up-from-line', chargingTime: 'plug-zap', energyEfficiency: 'leaf'
      };
      return `
                <div style="background:#111; padding:1.5rem; text-align:center;">
                  <i data-lucide="${specIcons[key] || 'info'}" style="width:22px; height:22px; color:#00D2C4; margin-bottom:0.6rem;"></i>
                  <div style="font-size:0.7rem; color:#888; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.4rem;">${labels[key] || key}</div>
                  <div style="font-size:0.95rem; font-weight:600; line-height:1.3;">${value}</div>
                </div>`;
    }).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- ═══ COLOR PICKER ═══ -->
        ${model.colors && model.colors.length > 0 ? `
        <div class="model-page-colors" style="padding: 5rem 0; background: #fff; color: #000; text-align: center; width: 100%;">
          <div style="text-align:center; margin-bottom: 2.5rem;">
            <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">PILIH WARNA ANDA</span>
            <h2 style="font-size:1.8rem; font-weight:700; margin-top:0.5rem; color:#111;">EXTERIOR COLORS</h2>
          </div>
          <div class="color-preview-container" style="max-width:900px; margin: 0 auto; position: relative; display: flex; justify-content: center;">
            <img src="${model.colors[0].img}" id="active-color-img" class="model-color-car-img" style="width:100%; max-width:800px; transition: opacity 0.3s ease; position: relative; z-index: 2;">
            <div style="position: absolute; bottom: 5%; left: 15%; right: 15%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%); z-index: 1;"></div>
          </div>
          <h2 id="active-color-title" style="font-weight:400; letter-spacing:0.4em; font-size: 1.1rem; margin: 2rem auto 1.5rem auto; text-transform: uppercase; color: #111; text-align: center;">${model.colors[0].name}</h2>
          <style>
            .color-swatch-wrap { width: 32px; height: 32px; border-radius: 50%; padding: 3px; border: 2px solid transparent; cursor: pointer; transition: all 0.3s ease; }
            .color-swatch-wrap:hover { transform: scale(1.15); }
            .color-swatch-wrap.active { border-color: #111; }
          </style>
          <div class="color-options" style="display:flex; align-items:center; justify-content:center; gap:1.2rem; flex-wrap:wrap;">
            ${model.colors.map((color, idx) => `
              <div class="color-swatch-wrap ${idx === 0 ? 'active' : ''}" data-img="${color.img}" data-name="${color.name}">
                <div class="color-swatch" style="width:100%; height:100%; background-color: ${color.hex}; border-radius:50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);"></div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- ═══ KEY FEATURES ═══ -->
        ${model.keyFeatures && model.keyFeatures.length > 0 ? `
        <div style="padding: 5rem 0; background: #0a0a0a; color: #fff;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <div style="text-align:center; margin-bottom: 3.5rem;">
              <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">KEY FEATURES</span>
              <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight:700; margin-top:0.5rem; letter-spacing:-0.02em;">WHAT SETS IT APART</h2>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
              ${model.keyFeatures.map((feat, i) => {
      const featureIcons = ['cpu', 'shield-check', 'eye', 'music', 'settings', 'zap', 'compass', 'star'];
      return `
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:2rem; transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(0,210,196,0.3)'" onmouseout="this.style.transform=''; this.style.borderColor='rgba(255,255,255,0.08)'">
                  <div style="width:48px; height:48px; background:rgba(0,210,196,0.1); border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:1.2rem;">
                    <i data-lucide="${featureIcons[i % featureIcons.length]}" style="width:24px; height:24px; color:#00D2C4;"></i>
                  </div>
                  <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:0.6rem; letter-spacing:0.02em;">${feat.title}</h3>
                  <p style="font-size:0.9rem; color:rgba(255,255,255,0.6); line-height:1.6;">${feat.desc}</p>
                </div>`;
    }).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- ═══ INTERIOR FEATURES ═══ -->
        ${model.interiorFeatures && model.interiorFeatures.length > 0 ? `
        <div style="padding: 5rem 0; background: #fff; color: #000;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4rem; align-items:start;">
              <div>
                <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">INTERIOR</span>
                <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight:700; margin-top:0.5rem; color:#111; margin-bottom:2rem;">CRAFTED LUXURY WITHIN</h2>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  ${model.interiorFeatures.map(feat => `
                    <div style="display:flex; align-items:flex-start; gap:1rem; padding:1rem; background:rgba(0,0,0,0.02); border-radius:12px; border-left:3px solid #00D2C4;">
                      <i data-lucide="check" style="width:18px; height:18px; color:#00D2C4; flex-shrink:0; margin-top:2px;"></i>
                      <span style="font-size:0.95rem; color:#333; line-height:1.5;">${feat}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div>
                <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">EXTERIOR</span>
                <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight:700; margin-top:0.5rem; color:#111; margin-bottom:2rem;">BOLD DESIGN LANGUAGE</h2>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  ${(model.exteriorFeatures || []).map(feat => `
                    <div style="display:flex; align-items:flex-start; gap:1rem; padding:1rem; background:rgba(0,0,0,0.02); border-radius:12px; border-left:3px solid #111;">
                      <i data-lucide="check" style="width:18px; height:18px; color:#111; flex-shrink:0; margin-top:2px;"></i>
                      <span style="font-size:0.95rem; color:#333; line-height:1.5;">${feat}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- ═══ INTERIOR HOTSPOTS ═══ -->
        ${model.interiorImage ? `
        <div class="model-page-interior" style="position:relative; width:100%; background: #000; overflow:hidden;">
           <img src="${model.interiorImage}" style="width:100%; height:auto; display:block;">
           <div class="hotspots-container" style="position:absolute; top:0; left:0; width:100%; height:100%;">
             ${(model.hotspots || []).map(h => `
               <div class="hotspot" style="position:absolute; top:${h.top}%; left:${h.left}%; transform:translate(-50%, -50%); display:flex; align-items:center; gap:0.5rem; background:#fff; padding:0.6rem 1.2rem; border-radius:24px; color:#000; font-weight:500; font-size:0.85rem; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2); transition:transform 0.3s ease;" onmouseover="this.style.transform='translate(-50%, -50%) scale(1.05)'" onmouseout="this.style.transform='translate(-50%, -50%) scale(1)'">
                 <i data-lucide="plus-circle" style="width:18px; height:18px;"></i> ${h.label}
               </div>
             `).join('')}
           </div>
        </div>
        ` : ''}

        <!-- ═══ GALLERY ═══ -->
        ${model.gallery && model.gallery.length > 0 ? `
        <div style="padding: 5rem 0; background: #0a0a0a; color: #fff;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <div style="text-align:center; margin-bottom: 3rem;">
              <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">GALLERY</span>
              <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight:700; margin-top:0.5rem;">EXPLORE EVERY ANGLE</h2>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
              ${model.gallery.map((img, i) => `
                <div style="overflow:hidden; border-radius:12px; aspect-ratio: 16/10; cursor:pointer; position:relative;" onmouseover="this.querySelector('img').style.transform='scale(1.05)'" onmouseout="this.querySelector('img').style.transform='scale(1)'">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease;" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- ═══ TRIMS ═══ -->
        ${model.trims && model.trims.length > 0 ? `
        <div class="model-page-trims text-center" style="padding: 5rem 0; background: #fff; color: #000; text-align: center;">
           <div style="text-align:center; margin-bottom: 3.5rem;">
             <span style="color:#00D2C4; font-size:0.75rem; letter-spacing:0.2em; font-weight:600;">CHOOSE YOURS</span>
             <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight:700; margin-top:0.5rem; color:#111;">PILIH ${model.name} ANDA</h2>
           </div>
           <div class="container" style="display:flex; justify-content:center; gap:3rem; flex-wrap:wrap; max-width: 1200px; margin: 0 auto;">
             ${model.trims.map(trim => `
               <div class="trim-card" style="flex:1; min-width:300px; max-width:480px; display: flex; flex-direction: column; align-items: center; background:rgba(0,0,0,0.02); border-radius:16px; padding:2rem; border:1px solid rgba(0,0,0,0.06);">
                 <div style="position: relative; width: 100%; margin-bottom: 1.5rem;">
                   <img src="${trim.img}" style="width:100%; position: relative; z-index: 2;">
                   <div style="position: absolute; bottom: 8%; left: 15%; right: 15%; height: 25px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%); z-index: 1;"></div>
                 </div>
                 <h3 style="font-weight:600; margin-bottom:1rem; font-size:1.2rem; color: #111;">${trim.name}</h3>
                 <ul style="list-style:none; padding:0; margin:0 0 1.5rem 0; font-size:0.85rem; color:#555; line-height: 2; text-align:left; width:100%;">
                   ${trim.features.map(f => `<li style="display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check-circle-2" style="width:14px; height:14px; color:#00D2C4; flex-shrink:0;"></i> ${f}</li>`).join('')}
                 </ul>
                 <h4 style="font-weight:700; font-size:1.4rem; color:#000;">${trim.price}</h4>
               </div>
             `).join('')}
           </div>
        </div>
        ` : ''}

        <!-- ═══ CTA SECTION ═══ -->
        <div style="padding: 5rem 0; background: linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a1a1a 100%); color: #fff; text-align:center;">
          <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 2rem;">
            <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight:700; margin-bottom:1rem;">INTERESTED IN ${model.name}?</h2>
            <p style="color:rgba(255,255,255,0.6); font-size:1rem; margin-bottom:2rem; line-height:1.6;">Jadwalkan test drive dan rasakan langsung performa serta teknologi ${model.name}.</p>
            <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
              <a href="#reservation" onclick="window.closeModals()" class="btn btn-primary" style="padding:0.9rem 2.5rem; font-size:0.9rem; background:#00D2C4; color:#000; border:none; border-radius:8px; font-weight:600; text-decoration:none; letter-spacing:0.05em; transition:transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">RESERVASI TEST DRIVE</a>
              <a href="https://wa.me/6281338384136?text=${encodeURIComponent('Halo, saya ingin bertanya tentang mobil JAECOO (' + model.name + ')')}" target="_blank" style="padding:0.9rem 2.5rem; font-size:0.9rem; background:rgba(37,211,102,0.15); color:#25D366; border:1px solid rgba(37,211,102,0.3); border-radius:8px; font-weight:600; text-decoration:none; letter-spacing:0.05em; display:flex; align-items:center; gap:0.5rem; transition:transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:18px; height:18px; fill:currentColor;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> HUBUNGI WHATSAPP
              </a>
            </div>
            <p style="color:rgba(255,255,255,0.3); font-size:0.8rem; margin-top:1.5rem;">${model.price}</p>
          </div>
        </div>
      </div>
    `;

    // Init lucide icons dynamically in this view
    if (window.lucide) {
      window.lucide.createIcons({
        icons: window.lucide.icons,
        root: view,
        nameAttr: 'data-lucide',
        attrs: { class: 'lucide', 'stroke-width': 1.5 }
      });
    }

    view.scrollTop = 0; // Ensure it starts at the top
    view.classList.add('active');
    view.style.display = 'block'; // Force display
    view.style.opacity = '1';
    view.style.visibility = 'visible';
    view.style.zIndex = '2500';
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error("Error in renderModelDetailView:", error);
  }
};
