export const renderFooter = (t, settings = {}) => {
  const footerData = settings.footer || {};
  const address = footerData.address || 'Wisma JAECOO Indonesia<br>Jl. TB Simatupang Kav. 88<br>Jakarta Selatan 12430';
  const phone = footerData.phone || '1-500-000';
  const whatsapp = footerData.whatsapp || '+62 811 8800 991';
  const email = footerData.email || 'customercare@jaecoo.id';
  
  const facebook = footerData.facebook || 'https://web.facebook.com/profile.php?id=61584045292756';
  const instagram = footerData.instagram || 'https://www.instagram.com/jaecootangerangofficial';
  const youtube = footerData.youtube || 'https://www.youtube.com/@RiriJaecooTangerang';
  const twitter = footerData.twitter || '#';

  const footer = document.getElementById('footer');
  const floatingActions = document.getElementById('floating-actions');

  footer.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <!-- Col 1 -->
        <div class="footer-col-1">
          <div class="footer-logo">JAECOO</div>
          <p class="footer-desc">${t.footer.desc}</p>
        </div>
        
        <!-- Col 2 -->
        <div>
          <h4 class="footer-heading">${t.footer.quickLinks}</h4>
          <ul class="footer-links">
            <li><a href="#models">${t.nav.model}</a></li>
            <li><a href="#about">${t.nav.about}</a></li>
            <li><a href="#shs">${t.nav.shs}</a></li>
            <li><a href="#gallery">${t.nav.gallery}</a></li>
            <li><a href="#news">${t.nav.news}</a></li>
            <li><a href="#reservation">${t.nav.reservation}</a></li>
          </ul>
        </div>
        
        <!-- Col 3 -->
        <div>
          <h4 class="footer-heading">${t.footer.contact}</h4>
          <ul class="footer-contact-list">
            <li class="footer-contact-item">
              <i data-lucide="map-pin" class="footer-contact-icon"></i>
              <span class="footer-contact-text">${address}</span>
            </li>
            <li class="footer-contact-item">
              <i data-lucide="phone" class="footer-contact-icon"></i>
              <span class="footer-contact-text">${phone}</span>
            </li>
            <li class="footer-contact-item">
              <i data-lucide="message-circle" class="footer-contact-icon"></i>
              <span class="footer-contact-text">${whatsapp}</span>
            </li>
            <li class="footer-contact-item">
              <i data-lucide="mail" class="footer-contact-icon"></i>
              <span class="footer-contact-text">${email}</span>
            </li>
          </ul>
        </div>
        
        <!-- Col 4 -->
        <div>
          <h4 class="footer-heading">${t.footer.socialMedia}</h4>
          <div class="footer-socials">
            <a href="${instagram}" class="social-btn" target="_blank"><i data-lucide="instagram"></i></a>
            <a href="${facebook}" class="social-btn" target="_blank"><i data-lucide="facebook"></i></a>
            <a href="${youtube}" class="social-btn" target="_blank"><i data-lucide="youtube"></i></a>
            <a href="${twitter}" class="social-btn" target="_blank"><i data-lucide="twitter"></i></a>
          </div>
        </div>
      </div>
      
      <!-- Bottom -->
      <div class="footer-bottom">
        <div class="copyright">${t.footer.copyright}</div>
        <div class="legal-links">
          <a href="#">${t.footer.privacy}</a>
          <a href="#">${t.footer.terms}</a>
          <a href="#">${t.footer.cookie}</a>
        </div>
      </div>
    </div>
  `;

  // Floating Actions
  floatingActions.innerHTML = `
    <a href="https://wa.me/6281338384136?text=Halo,%20saya%20ingin%20bertanya%20tentang%20mobil%20JAECOO" target="_blank" class="floating-btn btn-whatsapp" aria-label="WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:24px; height:24px; fill:currentColor;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
    </a>
    <button class="floating-btn btn-back-to-top" id="back-to-top" aria-label="Back to top">
      <i data-lucide="chevron-up"></i>
    </button>
  `;
};

export const initFooterEvents = () => {
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 800) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
};
