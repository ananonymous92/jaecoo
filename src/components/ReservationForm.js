import { api } from '../utils/apiClient.js';

export const renderForms = (t, modelsData = [], dealersData = []) => {
  const reservationSection = document.getElementById('reservation');
  
  reservationSection.innerHTML = `
    <div class="container">
      <div class="reservation-wrapper reveal-on-scroll">
        <div class="reservation-image"></div>
        <div class="reservation-content">
          <div style="text-align: center; margin-bottom: 2rem;">
            <span class="eyebrow">${t.reservation.title}</span>
            <h2 style="font-size: clamp(1.6rem, 5vw, 2.5rem); margin-top: 0.5rem; margin-bottom: 0; color: var(--color-white); line-height: 1.3;">${t.reservation.subtitle}</h2>
          </div>
          
          <form id="reservationForm">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">${t.reservation.fullName} *</label>
                <input type="text" id="res-name" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">${t.reservation.waNumber} *</label>
                <input type="tel" id="res-phone" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">${t.reservation.email}</label>
                <input type="email" id="res-email" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">${t.reservation.selectModel} *</label>
                <select id="res-model" class="form-control" required>
                  <option value="">-- Pilih Model --</option>
                  ${modelsData.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">${t.reservation.selectDealer} *</label>
                <select id="res-dealer" class="form-control" required>
                  <option value="">-- Pilih Dealer --</option>
                  ${dealersData.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">${t.reservation.testDriveDate}</label>
                <input type="date" id="res-date" class="form-control">
              </div>
            </div>
            
            <div class="form-submit-wrap">
              <button type="submit" class="btn btn-cyan" id="res-submit-btn">${t.reservation.submit}</button>
            </div>
          </form>
          
          <!-- Success State Hidden by Default -->
          <div id="reservationSuccess" style="display: none; text-align: center; padding: 3rem 0;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(0,210,196,0.1); color: var(--color-accent-cyan); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style="font-size: 1.75rem; margin-bottom: 1rem; color: var(--color-white);">${t.reservation.successTitle}</h3>
            <p style="color: var(--color-soft-gray); font-size: 1.05rem; line-height: 1.6;">${t.reservation.successDesc}</p>
          </div>

        </div>
      </div>
    </div>
  `;
};

// Guard flag: ensures the document-level listener is registered only ONCE
let _formListenerAttached = false;

async function handleReservationSubmit(e) {
  const form = e.target;
  if (!form || form.id !== 'reservationForm') return;
  
  e.preventDefault();
  e.stopImmediatePropagation();
  
  const submitBtn = document.getElementById('res-submit-btn');
  const successState = document.getElementById('reservationSuccess');
  const reservationForm = document.getElementById('reservationForm');
  
  const data = {
    name: document.getElementById('res-name')?.value || '',
    phone: document.getElementById('res-phone')?.value || '',
    email: document.getElementById('res-email')?.value || '',
    model: document.getElementById('res-model')?.value || '',
    dealer: document.getElementById('res-dealer')?.value || '',
    date: document.getElementById('res-date')?.value || '',
  };

  // Validate required fields
  if (!data.name || !data.phone || !data.model || !data.dealer) {
    alert('Mohon lengkapi semua field yang wajib diisi (*)');
    return;
  }

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
    }
    
    const result = await api.submitReservation(data);
    console.log('Reservation submitted successfully:', result);
    
    if (reservationForm) reservationForm.style.display = 'none';
    if (successState) successState.style.display = 'block';
    
  } catch (error) {
    console.error('Reservation error:', error);
    alert('Terjadi kesalahan. Silakan coba lagi.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SUBMIT RESERVATION';
    }
  }
}

export const initFormEvents = () => {
  if (_formListenerAttached) return; // Prevent duplicate listeners
  _formListenerAttached = true;
  
  document.addEventListener('submit', handleReservationSubmit, true); // Use capture phase
  console.log('[ReservationForm] Form event listener attached (once).');
};

