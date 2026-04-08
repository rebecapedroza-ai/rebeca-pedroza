// ── CONFIG ──
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwM9kyFjrCx6pHttOxlfT-6AnNRswAvweEKxo9QvlSCkyPChE-uVl5UPPezMCI0NKRgKA/exec';

// ── PAÍSES ──
const COUNTRIES = [
  { code: 'CO', flag: '🇨🇴', name: 'Colombia',        dial: '+57'  },
  { code: 'MX', flag: '🇲🇽', name: 'México',          dial: '+52'  },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina',       dial: '+54'  },
  { code: 'VE', flag: '🇻🇪', name: 'Venezuela',       dial: '+58'  },
  { code: 'CL', flag: '🇨🇱', name: 'Chile',           dial: '+56'  },
  { code: 'PE', flag: '🇵🇪', name: 'Perú',            dial: '+51'  },
  { code: 'EC', flag: '🇪🇨', name: 'Ecuador',         dial: '+593' },
  { code: 'BO', flag: '🇧🇴', name: 'Bolivia',         dial: '+591' },
  { code: 'PY', flag: '🇵🇾', name: 'Paraguay',        dial: '+595' },
  { code: 'UY', flag: '🇺🇾', name: 'Uruguay',         dial: '+598' },
  { code: 'BR', flag: '🇧🇷', name: 'Brasil',          dial: '+55'  },
  { code: 'ES', flag: '🇪🇸', name: 'España',          dial: '+34'  },
  { code: 'US', flag: '🇺🇸', name: 'Estados Unidos',  dial: '+1'   },
  { code: 'CA', flag: '🇨🇦', name: 'Canadá',          dial: '+1'   },
  { code: 'CR', flag: '🇨🇷', name: 'Costa Rica',      dial: '+506' },
  { code: 'PA', flag: '🇵🇦', name: 'Panamá',          dial: '+507' },
  { code: 'GT', flag: '🇬🇹', name: 'Guatemala',       dial: '+502' },
  { code: 'HN', flag: '🇭🇳', name: 'Honduras',        dial: '+504' },
  { code: 'SV', flag: '🇸🇻', name: 'El Salvador',     dial: '+503' },
  { code: 'NI', flag: '🇳🇮', name: 'Nicaragua',       dial: '+505' },
  { code: 'DO', flag: '🇩🇴', name: 'Rep. Dominicana', dial: '+1'   },
  { code: 'CU', flag: '🇨🇺', name: 'Cuba',            dial: '+53'  },
  { code: 'PR', flag: '🇵🇷', name: 'Puerto Rico',     dial: '+1'   },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal',        dial: '+351' },
];

let selectedCountry = COUNTRIES[0];
let modalSelectedCountry = COUNTRIES[0];

function renderCountryList(listId, list, currentCode) {
  const container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = list.map(c => `
    <div class="country-option ${c.code === currentCode ? 'selected' : ''}"
         onclick="selectCountry('${c.code}', '${listId}')">
      <span class="country-option-flag">${c.flag}</span>
      <span class="country-option-name">${c.name}</span>
      <span class="country-option-code">${c.dial}</span>
    </div>
  `).join('');
}

function filterCountries(query) {
  const q = query.toLowerCase();
  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q));
  renderCountryList('country-list', filtered, selectedCountry.code);
}

function filterModalCountries(query) {
  const q = query.toLowerCase();
  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q));
  renderCountryList('modal-country-list', filtered, modalSelectedCountry.code);
}

function selectCountry(code, listId) {
  const country = COUNTRIES.find(c => c.code === code);
  if (!country) return;
  if (listId === 'country-list') {
    selectedCountry = country;
    document.getElementById('selected-flag').textContent = country.flag;
    document.getElementById('selected-code').textContent = country.dial;
    closeDropdown('country-dropdown', 'country-search');
  } else {
    modalSelectedCountry = country;
    document.getElementById('modal-selected-flag').textContent = country.flag;
    document.getElementById('modal-selected-code').textContent = country.dial;
    closeDropdown('modal-country-dropdown', null);
  }
}

function toggleDropdown() {
  const dd = document.getElementById('country-dropdown');
  if (!dd) return;
  if (dd.classList.contains('open')) {
    closeDropdown('country-dropdown', 'country-search');
  } else {
    dd.classList.add('open');
    renderCountryList('country-list', COUNTRIES, selectedCountry.code);
    setTimeout(() => document.getElementById('country-search')?.focus(), 50);
  }
}

function toggleModalDropdown() {
  const dd = document.getElementById('modal-country-dropdown');
  if (!dd) return;
  if (dd.classList.contains('open')) {
    closeDropdown('modal-country-dropdown', null);
  } else {
    dd.classList.add('open');
    renderCountryList('modal-country-list', COUNTRIES, modalSelectedCountry.code);
  }
}

function closeDropdown(ddId, searchId) {
  const dd = document.getElementById(ddId);
  if (dd) dd.classList.remove('open');
  if (searchId) {
    const search = document.getElementById(searchId);
    if (search) search.value = '';
  }
}

document.addEventListener('click', (e) => {
  const sel = document.querySelector('.country-selector');
  if (sel && !sel.contains(e.target)) closeDropdown('country-dropdown', 'country-search');
  const modal = document.getElementById('videoModal');
  if (modal && e.target === modal) hideModal();
});

async function detectCountryByIP() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const country = COUNTRIES.find(c => c.code === data.country_code);
    if (country) {
      selectedCountry = country;
      modalSelectedCountry = country;
      const flag = document.getElementById('selected-flag');
      const code = document.getElementById('selected-code');
      if (flag) flag.textContent = country.flag;
      if (code) code.textContent = country.dial;
    }
  } catch {
    selectCountry('CO', 'country-list');
  }
}

// ── NAVEGACIÓN ──
const sections = document.querySelectorAll('.snap-section');
const dots = document.querySelectorAll('.nav-dot');
const progress = document.getElementById('progress');

function goTo(index) {
  const top = sections[index].getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: 'smooth' });
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (scrollTop / total * 100) + '%';
  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      dots.forEach(d => d.classList.remove('active'));
      dots[i] && dots[i].classList.add('active');
    }
  });
}, { passive: true });

// ── REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── PARTÍCULAS ──
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `left:${Math.random()*100}%;bottom:${Math.random()*20}%;width:${size}px;height:${size}px;--dur:${Math.random()*8+5}s;--delay:${Math.random()*6}s;opacity:0;`;
    container.appendChild(p);
  }
}
createParticles();

// ── SHEETS ──
async function sendToSheets(data) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) { console.error('Error Sheets:', err); }
}

function selectPill(el) {
  const group = el.closest('.pills');
  if (!group) return;
  group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

function getSelectedPills(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return '';
  return Array.from(container.querySelectorAll('.pill.active')).map(p => p.textContent.trim()).join(', ');
}

// ── SUBMIT FORM ──
async function submitForm() {
  const nombre   = document.getElementById('form-nombre')?.value.trim();
  const email    = document.getElementById('form-email')?.value.trim();
  const numero   = document.getElementById('form-whatsapp')?.value.trim();
  const whatsapp = selectedCountry.dial.replace('+', '') + ' ' + numero;
  const tiempo      = getSelectedPills('pills-tiempo');
  const experiencia = getSelectedPills('pills-experiencia');

  if (!nombre || !email || !numero) { alert('Por favor completá todos los campos.'); return; }

  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  sendToSheets({ nombre, email, whatsapp, tiempo, experiencia });
  sessionStorage.setItem('formCompleted', '1');
  sessionStorage.setItem('leadData', JSON.stringify({ nombre, email, whatsapp }));
  setTimeout(() => showSuccess(), 600);
}

// ── SUCCESS ──
function showSuccess() {
  const overlay = document.getElementById('successOverlay');
  if (!overlay) return;
  overlay.classList.add('visible');
  startCountdown(10);
}

function startCountdown(seconds) {
  const num = document.getElementById('countdownNum');
  if (!num) return;
  num.textContent = seconds;
  if (seconds <= 0) { goToCalendar(); return; }
  setTimeout(() => startCountdown(seconds - 1), 1000);
}

function goToCalendar() {
  const overlay = document.getElementById('successOverlay');
  if (overlay) overlay.classList.remove('visible');
  goTo(3);
}

// ── TOAST ──
function createToast() {
  const toast = document.createElement('div');
  toast.className = 'video-toast';
  toast.id = 'videoToast';
  toast.innerHTML = `
    <span class="video-toast-text">¿Te está gustando?</span>
    <button class="video-toast-btn" onclick="showModal()">Quiero más info</button>
    <button class="video-toast-close" onclick="hideToast()">✕</button>
  `;
  document.body.appendChild(toast);
}

function showToast() {
  const toast = document.getElementById('videoToast');
  if (toast && !sessionStorage.getItem('toastDismissed')) toast.classList.add('visible');
}

function hideToast() {
  const toast = document.getElementById('videoToast');
  if (toast) toast.classList.remove('visible');
  sessionStorage.setItem('toastDismissed', '1');
}

// ── MODAL VIDEO ──
function createModal() {
  const modal = document.createElement('div');
  modal.className = 'video-modal-overlay';
  modal.id = 'videoModal';
  modal.innerHTML = `
    <div class="video-modal">
      <button class="video-modal-close" onclick="hideModal()">✕</button>
      <div class="video-modal-eyebrow">Paso 1 de 3</div>
      <h2 class="video-modal-title">Dejame<br><em>tus datos</em></h2>
      <p class="video-modal-sub">Solo 60 segundos — el primer paso real.</p>
      <div class="field">
        <label>Nombre completo</label>
        <input type="text" id="modal-nombre" placeholder="¿Cómo te llaman?" />
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" id="modal-email" placeholder="tu@email.com" />
      </div>
      <div class="field">
        <label>WhatsApp</label>
        <div class="phone-wrap">
          <div class="country-selector">
            <button class="country-btn" onclick="toggleModalDropdown()" type="button">
              <span class="country-flag" id="modal-selected-flag">🇨🇴</span>
              <span class="country-code" id="modal-selected-code">+57</span>
              <span class="country-arrow">▼</span>
            </button>
            <div class="country-dropdown" id="modal-country-dropdown">
              <input class="country-search" placeholder="Buscar país..." oninput="filterModalCountries(this.value)" />
              <div class="country-list" id="modal-country-list"></div>
            </div>
          </div>
          <div class="phone-input">
            <input type="tel" id="modal-whatsapp" placeholder="300 000 0000" />
          </div>
        </div>
      </div>
      <button class="video-modal-submit" id="modal-submit-btn" onclick="submitModal()">
        Quiero agendar mi llamada →
      </button>
      <button class="video-modal-skip" onclick="hideModal()">
        Ahora no, seguir viendo
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function showModal() {
  hideToast();
  const modal = document.getElementById('videoModal');
  if (modal && !sessionStorage.getItem('modalDismissed')) {
    modal.classList.add('visible');
    document.getElementById('modal-selected-flag').textContent = selectedCountry.flag;
    document.getElementById('modal-selected-code').textContent = selectedCountry.dial;
    modalSelectedCountry = selectedCountry;
    const iframe = document.querySelector('#s2 iframe');
    if (iframe) iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
}

function hideModal() {
  const modal = document.getElementById('videoModal');
  if (modal) modal.classList.remove('visible');
  sessionStorage.setItem('modalDismissed', '1');
}

async function submitModal() {
  const nombre   = document.getElementById('modal-nombre')?.value.trim();
  const email    = document.getElementById('modal-email')?.value.trim();
  const numero   = document.getElementById('modal-whatsapp')?.value.trim();
  const whatsapp = modalSelectedCountry.dial.replace('+', '') + ' ' + numero;

  if (!nombre || !email || !numero) { alert('Por favor completá todos los campos.'); return; }

  const btn = document.getElementById('modal-submit-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  sendToSheets({ nombre, email, whatsapp, tiempo: 'modal video', experiencia: 'modal video' });
  sessionStorage.setItem('formCompleted', '1');
  hideModal();
  setTimeout(() => showSuccess(), 400);
}

// ── VIDEO MODAL TESTIMONIOS ──
function openVideoModal(videoId) {
  const overlay = document.getElementById('testiModal');
  const iframe = document.getElementById('testiIframe');
  if (!overlay || !iframe) return;
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  overlay.classList.add('visible');
}

function closeVideoModal() {
  const overlay = document.getElementById('testiModal');
  const iframe = document.getElementById('testiIframe');
  if (!overlay || !iframe) return;
  iframe.src = '';
  overlay.classList.remove('visible');
}



// ── YOUTUBE API ──
let player, toastShown = false, modalShown = false, videoCompleted = false;

function onYouTubeIframeAPIReady() {
  const iframe = document.querySelector('#s2 iframe');
  if (!iframe) return;
  player = new YT.Player(iframe, {
    events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange }
  });
}

function onPlayerReady() { startProgressCheck(); }

function onPlayerStateChange(event) {
  if (event.data === 0 && !videoCompleted) {
    videoCompleted = true;
    hideToast();
    if (!sessionStorage.getItem('formCompleted')) {
      if (!sessionStorage.getItem('modalDismissed')) showModal();
      else setTimeout(() => goTo(2), 500);
    }
  }
}

function startProgressCheck() {
  const interval = setInterval(() => {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const current = player.getCurrentTime();
    const duration = player.getDuration() || 132;
    const percent = current / duration;
    if (current >= 30 && !toastShown && !sessionStorage.getItem('toastDismissed')) { toastShown = true; showToast(); }
    if (percent >= 0.8 && !modalShown && !sessionStorage.getItem('modalDismissed')) { modalShown = true; showModal(); }
    if (videoCompleted) clearInterval(interval);
  }, 1000);
}

// ── CAL MODAL ──
let calLoaded = false;

function openCalModal() {
  const overlay = document.getElementById('cal-modal-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  if (!calLoaded) {
    calLoaded = true;
    Cal.ns["llamada-de-descubrimiento"]("inline", {
      elementOrSelector: "#cal-modal-container",
      calLink: "conecta2.ai/llamada-de-descubrimiento",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" }
    });

    Cal.ns["llamada-de-descubrimiento"]("on", {
      action: "bookingSuccessfulV2",
      callback: () => {
        closeCalModal();
        const wp = document.getElementById('whatsapp-post-booking');
        if (wp) {
          wp.style.display = 'block';
          setTimeout(() => wp.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        }
      }
    });
  }
}

function closeCalModal() {
  const overlay = document.getElementById('cal-modal-overlay');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCalModal();
    closeVideoModal();
  }
});

// ── INICIALIZAR ──
document.addEventListener('DOMContentLoaded', () => {
  createToast();
  createModal();
  detectCountryByIP();
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
});