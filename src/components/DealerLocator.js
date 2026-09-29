export const renderDealerLocator = (t, dealersData = []) => {
  const section = document.getElementById('dealers');
  
  // Get the first dealer data
  const dealer = dealersData[0] || {
    name: "JAECOO Experience Center",
    address: "Lokasi belum ditentukan",
    lat: -6.2, lng: 106.8,
    whatsapp: ""
  };
  
  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="eyebrow">${t.dealers.title}</span>
        <h2 class="section-title">${t.dealers.subtitle}</h2>
      </div>

      <div class="single-location-wrapper reveal-on-scroll" style="transition-delay: 0.2s">
        <div class="location-info">
          <div class="location-header">
            <i data-lucide="map-pin"></i>
            <h3>${dealer.name}</h3>
          </div>
          <p class="address-text">${dealer.address}</p>
          ${dealer.phone ? `<p class="address-desc" style="display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;"><i data-lucide="phone" style="width:16px;height:16px;"></i> ${dealer.phone}</p>` : ''}
          
          <div class="location-actions">
            <a href="https://maps.google.com/?q=${dealer.lat},${dealer.lng}" target="_blank" class="btn-directions">
              <i data-lucide="navigation"></i> ${t.dealers.viewMap}
            </a>
            ${dealer.whatsapp ? `
            <a href="https://wa.me/${dealer.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn-directions" style="background: rgba(37,211,102,0.15); color: #25D366;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:1.2em; height:1.2em; fill:currentColor; margin-right:4px;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> ${t.dealers.contactDealer}
            </a>` : ''}
          </div>
        </div>
        
        <div class="location-map-container">
          <iframe 
            src="https://maps.google.com/maps?q=${dealer.lat},${dealer.lng}&hl=${window.appState?.lang || 'id'}&z=15&output=embed" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  `;
};

export const initDealerEvents = () => {
  // Initialize lucide icons for the newly injected HTML
  const section = document.getElementById('dealers');
  if (window.lucide) {
    window.lucide.createIcons({
      root: section,
      nameAttr: 'data-lucide',
      attrs: { class: 'lucide', 'stroke-width': 1.5 }
    });
  }
};
