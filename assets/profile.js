// =================== PROFILE PAGE ===================
let _gallery = {items: [], current: 0};
let _pricing = {type: 'incall', durationIdx: 0, extras: new Set(), includedChoices: new Set(), model: null};

// =================== GALLERY ===================
function probeModelMedia(folder, cb) {
  const found = []; let done = 0;
  const photoMax = 31, videoMax = 10, total = photoMax + videoMax;
  function finish() {
    if (++done === total) {
      const photos = found.filter(x => x.type === 'photo').sort((a, b) => a.idx - b.idx);
      const videos = found.filter(x => x.type === 'video').sort((a, b) => a.idx - b.idx);
      cb([...photos, ...videos]);
    }
  }
  for (let i = 1; i <= photoMax; i++) {
    const img = new Image(); const idx = i;
    const src = `/${folder}/${idx}.webp${window.BUILD_TS ? '?v=' + window.BUILD_TS : ''}`;
    img.onload = () => { found.push({type: 'photo', idx, src}); finish(); };
    img.onerror = finish;
    img.src = src;
  }
  for (let i = 1; i <= videoMax; i++) {
    const v = document.createElement('video'); const idx = i;
    const src = `/${folder}/v${idx}.mp4${window.BUILD_TS ? '?v=' + window.BUILD_TS : ''}`;
    v.onloadedmetadata = () => { found.push({type: 'video', idx, src}); finish(); };
    v.onerror = finish;
    v.preload = 'metadata';
    v.src = src;
  }
}

function _galleryMove() {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  track.querySelectorAll('video').forEach(v => v.pause());
  const w = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${_gallery.current * w}px)`;
  document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === _gallery.current));
  const ctr = document.getElementById('gallery-counter');
  if (ctr) ctr.textContent = `${_gallery.current + 1} / ${_gallery.items.length}`;
}

function galleryGo(dir) {
  const n = _gallery.items.length; if (!n) return;
  _gallery.current = (_gallery.current + dir + n) % n;
  _galleryMove();
}

function galleryGoTo(idx) {
  _gallery.current = idx;
  _galleryMove();
}

function initGalleryTouch() {
  const el = document.querySelector('.detail-gallery');
  if (!el) return;
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
  el.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    const dy = sy - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) galleryGo(dx > 0 ? 1 : -1);
  }, {passive: true});
}

// =================== PHOTO LIGHTBOX ===================
// Reuses the same _gallery.items/current state as the inline gallery
// (galleryGo() below keeps both in sync), so opening/closing the lightbox
// never leaves the inline strip pointing at a different photo.
function _renderLightbox() {
  const content = document.getElementById('lightboxContent');
  const counter = document.getElementById('lightboxCounter');
  if (!content) return;
  const item = _gallery.items[_gallery.current];
  if (!item) return;
  content.innerHTML = item.type === 'video'
    ? `<video src="${item.src}" controls autoplay playsinline></video>`
    : `<img src="${item.src}" alt="">`;
  if (counter) counter.textContent = `${_gallery.current + 1} / ${_gallery.items.length}`;
}
function openLightbox(idx) {
  if (typeof idx === 'number') _gallery.current = idx;
  const overlay = document.getElementById('lightboxOverlay');
  // Gallery items load async (probeModelMedia) — before that resolves,
  // _gallery.items may not exist yet even though the fallback <img> is
  // already clickable.
  if (!overlay || !_gallery.items || !_gallery.items.length) return;
  _renderLightbox();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  const content = document.getElementById('lightboxContent');
  if (content) { content.querySelectorAll('video').forEach(v => v.pause()); content.innerHTML = ''; }
}
function lightboxGo(dir) {
  galleryGo(dir);
  _renderLightbox();
}
function initLightboxTouch() {
  const el = document.getElementById('lightboxOverlay');
  if (!el) return;
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
  el.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    const dy = sy - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) lightboxGo(dx > 0 ? 1 : -1);
  }, {passive: true});
  document.addEventListener('keydown', e => {
    if (!el.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lightboxGo(-1);
    else if (e.key === 'ArrowRight') lightboxGo(1);
  });
}

// =================== PRICING ===================
function selectPriceType(type) {
  _pricing.type = type; _pricing.durationIdx = 0; _pricing.extras = new Set();
  document.querySelectorAll('.price-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const rates = type === 'incall' ? _pricing.model.incallRates : _pricing.model.outcallRates;
  const dur = document.getElementById('duration-btns');
  if (dur) dur.innerHTML = rates.map((r, i) => `<button class="duration-btn${i === 0 ? ' active' : ''}" onclick="selectDuration(${i})">${r.label}</button>`).join('');
  document.querySelectorAll('.extra-svc-chk').forEach(c => c.classList.remove('on'));
  refreshPriceDisplay();
}

function selectDuration(idx) {
  _pricing.durationIdx = idx;
  document.querySelectorAll('.duration-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  refreshPriceDisplay();
}

function toggleExtraSvc(idx) {
  if (_pricing.extras.has(idx)) _pricing.extras.delete(idx);
  else _pricing.extras.add(idx);
  const rows = document.querySelectorAll('.extra-svc-row');
  if (rows[idx]) rows[idx].querySelector('.extra-svc-chk').classList.toggle('on', _pricing.extras.has(idx));
  refreshPriceDisplay();
}

// Included services carry no price — this is just so a client can flag
// which of them they specifically want, included with the booking request
// so the model knows what to prepare for (see submitBooking in main.js).
function toggleIncludedSvc(idx, el) {
  if (_pricing.includedChoices.has(idx)) _pricing.includedChoices.delete(idx);
  else _pricing.includedChoices.add(idx);
  el.classList.toggle('on', _pricing.includedChoices.has(idx));
  const chk = el.querySelector('.extra-svc-chk');
  if (chk) chk.classList.toggle('on', _pricing.includedChoices.has(idx));
}

function refreshPriceDisplay() {
  const m = _pricing.model; if (!m) return;
  const rates = _pricing.type === 'incall' ? m.incallRates : m.outcallRates;
  const rate = rates[_pricing.durationIdx] || rates[0];
  let extras = 0; _pricing.extras.forEach(i => extras += m.extraSvcs[i].price);
  const total = rate.price + extras;
  const pEl = document.getElementById('price-main');
  const sEl = document.getElementById('price-sub');
  const tEl = document.getElementById('price-total-val');
  if (pEl) pEl.textContent = fmtPrice(total);
  if (sEl) sEl.textContent = `${rate.label} · ${_pricing.type === 'incall' ? 'Incall' : 'Outcall'}${extras ? ` + ${fmtPrice(extras)} extras` : ''}`;
  if (tEl) tEl.textContent = fmtPrice(total);
}

// =================== MODEL DETAIL BUILDER ===================
function buildRealModelHTML(m) {
  const initRate = m.incallRates[0];
  const stats = [
    ['Age', m.age], ['Height', `${m.height}cm`], ['Weight', `${m.weight}kg`], ['Clothing', m.clothingSize],
    ['Breast', m.breastSize], ['Type', m.breastType], ['Eyes', m.eyeColor], ['Hair', m.hairColor],
  ];
  const mapQ = encodeURIComponent(m.station + ' Underground Station London');
  return `
    <a class="back-btn" href="/models/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Models
    </a>
    <div class="real-detail-layout">
      <div class="detail-left">
        <div class="detail-gallery">
          <div class="gallery-track" id="gallery-track">
            <img class="gallery-slide" src="/${m.folder}/1.webp" alt="${m.name}" onclick="openLightbox(0)">
          </div>
          <button class="gallery-arrow prev" onclick="galleryGo(-1)">&#8249;</button>
          <button class="gallery-arrow next" onclick="galleryGo(1)">&#8250;</button>
          <div class="gallery-dots" id="gallery-dots"><span class="gallery-dot active"></span></div>
          <div class="gallery-counter" id="gallery-counter">1 / 1</div>
        </div>
        <div class="model-bio">
          <div class="services-title">About Model</div>
          ${m.description.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
      <div class="model-detail-info">
        <div>
          <div class="model-detail-name">${m.name}</div>
          <div style="color:var(--text-soft);font-size:14px;margin-top:4px">${m.nationality} · ${m.station}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
            ${m.cats.includes('toprated') ? '<span class="badge badge-top">Top Rated</span>' : ''}
            ${m.cats.includes('new') ? '<span class="badge badge-new">New</span>' : ''}
          </div>
        </div>
        <div class="stat-grid-ext">
          ${stats.map(([l, v]) => `<div class="stat-box"><div class="stat-label">${l}</div><div class="stat-val" style="font-size:0.82rem">${v}</div></div>`).join('')}
        </div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px">
          <span style="color:var(--text-muted);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Languages:</span>
          ${m.languages.split(' · ').map(l => `<span class="service-chip">${l}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px">
          <span style="color:var(--text-muted);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Orientation:</span>
          <span class="service-chip">${m.orientation}</span>
        </div>
        <div class="price-calc">
          <div class="price-calc-title">Book a Session</div>
          <div class="price-type-row">
            <button class="price-type-btn active" data-type="incall" onclick="selectPriceType('incall')">Incall</button>
            <button class="price-type-btn" data-type="outcall" onclick="selectPriceType('outcall')">Outcall <span style="font-size:10px;opacity:0.6">min 1hr</span></button>
          </div>
          <div class="duration-row" id="duration-btns">
            ${m.incallRates.map((r, i) => `<button class="duration-btn${i === 0 ? ' active' : ''}" onclick="selectDuration(${i})">${r.label}</button>`).join('')}
          </div>
          <div class="price-display-row">
            <div id="price-main" class="price-main">${fmtPrice(initRate.price)}</div>
          </div>
          <div id="price-sub" class="price-sub">${initRate.label} · Incall</div>
          <div class="price-total-bar">
            <span class="price-total-label">Total</span>
            <span class="price-total-val" id="price-total-val">${fmtPrice(initRate.price)}</span>
          </div>
          ${m.extraHourPrice ? `<div class="price-extra-note">Extending your meeting? Every extra hour: <strong>${fmtPrice(m.extraHourPrice)}</strong></div>` : ''}
        </div>
        ${m.svcs && m.svcs.length ? `
        <div class="model-detail-services">
          <div class="services-title">Choose Your Services</div>
          <div class="services-chips">${m.svcs.map((s, i) => `<span class="service-chip svc-choice" onclick="toggleIncludedSvc(${i},this)"><span class="extra-svc-chk">✓</span>${s}</span>`).join('')}</div>
        </div>` : ''}
        ${m.extraSvcs && m.extraSvcs.length ? `
        <div class="model-detail-services">
          <div class="services-title">Extra Services</div>
          <div class="extra-svc-list">
            ${m.extraSvcs.map((s, i) => `
            <div class="extra-svc-row" onclick="toggleExtraSvc(${i})">
              <div class="extra-svc-left">
                <div class="extra-svc-chk">✓</div>
                <span class="extra-svc-name">${s.name}</span>
              </div>
              <span class="extra-svc-price">+${fmtPrice(s.price)}</span>
            </div>`).join('')}
          </div>
        </div>` : ''}
        <button class="make-booking-btn" onclick="makeBooking()">Make a Booking</button>
        <div style="font-size:12px;color:var(--text-muted);text-align:center">Available 24/7</div>
      </div>
      <div class="model-map-block">
        <iframe src="https://maps.google.com/maps?q=${mapQ}&z=15&output=embed" loading="lazy"></iframe>
      </div>
    </div>`;
}

function openRealModel(m) {
  _pricing = {type: 'incall', durationIdx: 0, extras: new Set(), includedChoices: new Set(), model: m};
  // Seeded with the fallback single photo so the lightbox works even
  // before probeModelMedia's async scan resolves and replaces it below.
  _gallery = {items: [{type: 'photo', idx: 1, src: `/${m.folder}/1.webp`}], current: 0};
  const container = document.getElementById('modelDetailContent');
  if (container) container.innerHTML = buildRealModelHTML(m);
  initGalleryTouch();
  initLightboxTouch();
  probeModelMedia(m.folder, items => {
    _gallery.items = items;
    const track = document.getElementById('gallery-track');
    if (!track) return;
    track.innerHTML = items.map((item, i) => {
      if (item.type === 'video') {
        return `<div class="gallery-slide video-slide">
          <video src="${item.src}" preload="none" playsinline controls style="width:100%;height:100%;object-fit:contain;background:#000"></video>
          <div class="video-play-icon" onclick="this.parentElement.querySelector('video').play();this.style.display='none'">
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="22" fill="rgba(0,0,0,0.55)"/>
              <polygon points="17,13 34,22 17,31" fill="white"/>
            </svg>
          </div>
        </div>`;
      }
      return `<img class="gallery-slide" src="${item.src}" alt="${m.name}" onclick="openLightbox(${i})">`;
    }).join('');
    const dotsEl = document.getElementById('gallery-dots');
    if (dotsEl) dotsEl.innerHTML = items.map((item, i) => {
      const cls = item.type === 'video' ? ' video-dot' : '';
      return `<span class="gallery-dot${cls}${i === 0 ? ' active' : ''}" onclick="galleryGoTo(${i})"></span>`;
    }).join('');
    const ctr = document.getElementById('gallery-counter');
    if (ctr) ctr.textContent = `1 / ${items.length}`;
    if (items.length <= 1) document.querySelectorAll('.gallery-arrow').forEach(a => a.style.display = 'none');
  });
}

// =================== VIP MODEL PROFILE ===================
// VIP model pages (data/models.js vip:true) never get their bio/photos/
// rates baked into the page's HTML/JS the way public profiles do — the
// build only ships a slug. This fetches the real data from /api/vip-catalog,
// which only returns it after verifying the caller has paid, and falls
// back to a locked notice for everyone else (signed out, signed in but
// unpaid, or any network/auth failure).
function vipLockedProfileHTML() {
  return `
    <div style="padding:2rem 0">
      <div class="vip-paywall-card" style="margin:0 auto">
        <div class="form-section-title">VIP Profile</div>
        <p>This companion is part of our VIP catalog — available to members with active VIP catalog access.</p>
        <a class="submit-app-btn" style="display:block;text-decoration:none;text-align:center;margin-top:1rem" href="/vip-models/">View VIP Access</a>
      </div>
    </div>`;
}

async function initVipModelProfile(slug) {
  const container = document.getElementById('modelDetailContent');
  const showLocked = () => { if (container) container.innerHTML = vipLockedProfileHTML(); };

  const user = await authGetUser();
  if (!user) { showLocked(); return; }

  try {
    const {data: sessionData} = await sb.auth.getSession();
    const token = sessionData && sessionData.session && sessionData.session.access_token;
    const r = await fetch('/api/vip-catalog?slug=' + encodeURIComponent(slug), {
      headers: {Authorization: `Bearer ${token}`}
    });
    if (!r.ok) { showLocked(); return; }
    const json = await r.json();
    if (!json.model) { showLocked(); return; }
    if (window.CUR_READY) await window.CUR_READY;
    openRealModel(json.model);
  } catch (e) {
    showLocked();
  }
}
