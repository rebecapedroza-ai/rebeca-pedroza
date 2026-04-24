// ── CONFIG ──
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwM9kyFjrCx6pHttOxlfT-6AnNRswAvweEKxo9QvlSCkyPChE-uVl5UPPezMCI0NKRgKA/exec';
const SUPABASE_URL = 'https://bsyrxfhflfujtujlkeze.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeXJ4ZmhmbGZ1anR1amxrZXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzQ2NDUsImV4cCI6MjA5MjYxMDY0NX0.Buy_5jilZf7fhkaR8T2EVfoZjn7noLDPFG0AZiAgEyg';

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

// ── SELECTOR DE PAÍSES ──
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

// ── DETECTAR PAÍS POR IP ──
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

// ── GUARDAR LEAD ──
async function saveLead(data) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
  } catch (err) { console.error('Error Supabase:', err); }

  fetch(SHEETS_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
}

// ── PILLS ──
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

// ── SUBMIT FORM S3 ──
async function submitForm() {
  const nombre   = document.getElementById('form-nombre')?.value.trim();
  const email    = document.getElementById('form-email')?.value.trim();
  const numero   = document.getElementById('form-whatsapp')?.value.trim();
  const whatsapp = selectedCountry.dial + numero;
  const tiempo      = getSelectedPills('pills-tiempo');
  const experiencia = getSelectedPills('pills-experiencia');

  if (!nombre || !email || !numero) { alert('Por favor completá todos los campos.'); return; }

  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  saveLead({ nombre, email, whatsapp, tiempo, experiencia, fuente: 'formulario' });
  sessionStorage.setItem('formCompleted', '1');
  sessionStorage.setItem('leadData', JSON.stringify({ nombre, email, whatsapp }));

  // Flujo según origen:
  // - Vino del popup "quiero mi llamada" → modal "En breve te llamamos"
  // - Bajó directo al formulario → modal countdown → calendario
  if (sessionStorage.getItem('wantsCall') === 'yes') {
    setTimeout(() => showCallingModal(), 400);
  } else {
    setTimeout(() => showSuccess(), 600);
  }
}

// ── SUCCESS (countdown → calendario) ──
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

// ── POPUP BUENAS NOTICIAS (80% del video) ──
function createNoticePopup() {
  const popup = document.createElement('div');
  popup.id = 'noticePopup';
  popup.className = 'notice-popup-overlay';
  popup.innerHTML = `
    <div class="notice-popup">
      <div class="notice-popup-icon">🎉</div>
      <div class="notice-popup-eyebrow">¡Buenas noticias!</div>
      <h2 class="notice-popup-title">Por llegar hasta aquí<br>tenemos algo <em>especial</em> para ti</h2>
      <p class="notice-popup-sub">Nos gustaría realizarte una llamada, entender tu situación y proponerte exactamente cómo podemos ayudarte a generar ingresos digitales.</p>
      <p class="notice-popup-question">¿Te gustaría recibir esa llamada?</p>
      <button class="notice-popup-yes" onclick="closeNoticePopup('yes')">
        ¡Sí, quiero mi llamada! →
      </button>
      <button class="notice-popup-later" onclick="closeNoticePopup('later')">
        Recibir después
      </button>
    </div>
  `;
  document.body.appendChild(popup);
}

function showNoticePopup() {
  const popup = document.getElementById('noticePopup');
  if (popup) {
    popup.classList.add('visible');
    const iframe = document.querySelector('#s2 iframe');
    if (iframe) iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
}

function closeNoticePopup(action) {
  const popup = document.getElementById('noticePopup');
  if (popup) popup.classList.remove('visible');

  if (action === 'yes') {
    sessionStorage.setItem('wantsCall', 'yes');
    setTimeout(() => goTo(2), 300);
  } else {
    // Recibir después → countdown → calendario
    setTimeout(() => showSuccess(), 300);
  }
}

// ── MODAL EN BREVE TE LLAMAMOS ──
function createCallingModal() {
  const modal = document.createElement('div');
  modal.className = 'calling-modal-overlay';
  modal.id = 'callingModal';
  modal.innerHTML = `
    <div class="calling-modal">
      <div class="calling-icon">📞</div>
      <div class="calling-eyebrow">¡Todo listo!</div>
      <h2 class="calling-title">
        En breve<br>
        <em>te llamamos</em>
      </h2>
      <p class="calling-sub">
        Uno de nuestros asesores se comunicará contigo en los próximos minutos para entender tu situación y mostrarte exactamente cómo empezar.
      </p>
      <div class="calling-number-wrap">
        <span class="calling-number-label">Nuestro número de contacto</span>
        <span class="calling-number">+1 218 630 7181</span>
        <div class="calling-number-actions">
          <button class="calling-btn-copy" id="copyBtn" onclick="copyNumber()">
            📋 Copiar número
          </button>
          <a class="calling-btn-save"
             href="data:text/vcard;charset=utf-8,BEGIN:VCARD%0AVERSION:3.0%0AFN:Rebeca+Pedroza+Team%0ATEL:+12186307181%0AEND:VCARD"
             download="rebeca-pedroza.vcf">
            💾 Guardar contacto
          </a>
        </div>
      </div>
      <a href="https://group.wha.link/bWQ6oe" target="_blank" rel="noopener noreferrer" class="btn-whatsapp calling-whatsapp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.513 5.831L.057 23.882a.5.5 0 00.611.611l6.051-1.456A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.516-5.224-1.415l-.374-.22-3.862.929.929-3.862-.22-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Unirme a la comunidad de WhatsApp
      </a>
    </div>
  `;
  document.body.appendChild(modal);
}

function showCallingModal() {
  const modal = document.getElementById('callingModal');
  if (modal) modal.classList.add('visible');
}

function copyNumber() {
  navigator.clipboard.writeText('+1 218 630 7181').then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copiar número';
        btn.classList.remove('copied');
      }, 2000);
    }
  });
}

// ── TOAST (30s del video) ──
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
  if (toast) toast.classList.add('visible');
}

function hideToast() {
  const toast = document.getElementById('videoToast');
  if (toast) toast.classList.remove('visible');
}

// ── MODAL DEL VIDEO (formulario rápido) ──
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
  const whatsapp = modalSelectedCountry.dial + numero;

  if (!nombre || !email || !numero) { alert('Por favor completá todos los campos.'); return; }

  const btn = document.getElementById('modal-submit-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  saveLead({ nombre, email, whatsapp, tiempo: 'modal video', experiencia: 'modal video', fuente: 'modal_video' });
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

// ── YOUTUBE API ──
let player, toastShown = false, noticeShown = false, videoCompleted = false;

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
      showNoticePopup();
    }
  }
}

function startProgressCheck() {
  const interval = setInterval(() => {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const current = player.getCurrentTime();
    const duration = player.getDuration() || 132;
    const percent = current / duration;

    // 30s → toast suave "¿Te está gustando?"
    if (current >= 30 && !toastShown) {
      toastShown = true;
      showToast();
    }

    // 80% → popup buenas noticias
    if (percent >= 0.8 && !noticeShown) {
      noticeShown = true;
      hideToast();
      showNoticePopup();
    }

    if (videoCompleted) clearInterval(interval);
  }, 1000);
}

// ── INICIALIZAR ──
document.addEventListener('DOMContentLoaded', () => {
  createToast();
  createModal();
  createNoticePopup();
  createCallingModal();
  detectCountryByIP();
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
});