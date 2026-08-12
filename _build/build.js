'use strict';
const fs = require('fs');
const path = require('path');

// Load CSS
const css = fs.readFileSync(path.join(__dirname, '../assets/style.css'), 'utf8');

// Load models
const { MODELS, SERVICES, NATIONALITIES, STATIONS, CITIES } = require('../data/models.js');
// URL-safe slug for a city name, used for element ids and query params.
const citySlug = (c) => c.toLowerCase().replace(/\s+/g, '-');
const REAL_MODELS = MODELS.filter(m => m.real);
// Everything served to the general public (home, catalog, search) excludes
// vip:true models entirely — their data only ever leaves the server via
// /api/vip-catalog, which checks payment first. See buildVipModelProfile.
const PUBLIC_MODELS = MODELS.filter(m => !m.vip);
const SITE_URL = 'https://velvetescort.co.uk';
// Single source of truth for the Telegram contact — it lives in the hero,
// the footer and the mobile menu, so define it once.
const TG_LINK = 'https://t.me/paradisemodelslondon?text=Hello%20Paradise%20Models%20%F0%9F%91%8B%F0%9F%8F%BC';
// Full timestamp (YYYYMMDDHHMMSS) so every build busts browser cache,
// even multiple deploys on the same day.
const BUILD_TS = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

// =================== SHARED PARTS ===================

function head(title, desc, canonical, extra = '', themeColor = '#0D0812') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="${themeColor}">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="/images/favicon.png?v=${BUILD_TS}">
<link rel="shortcut icon" type="image/png" href="/images/favicon.png?v=${BUILD_TS}">
<link rel="apple-touch-icon" href="/images/favicon.png?v=${BUILD_TS}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zalando+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${css}</style>
<script>window.BUILD_TS='${BUILD_TS}';</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"><\/script>
<script src="/assets/currency.js?v=${BUILD_TS}"><\/script>
${extra}
</head>`;
}

function navHTML(paradise = false, heroVideo = false) {
  const logo = paradise
    ? `<a class="nav-logo nav-logo-img" href="/" style="cursor:pointer;text-decoration:none"><img src="/images/logo-nav.png?v=${BUILD_TS}" alt="Paradise Models"></a>`
    : `<a class="nav-logo" href="/" style="cursor:pointer;text-decoration:none">VELVET</a>`;
  return _navHTML(logo, heroVideo);
}

function _navHTML(logo, heroVideo = false) {
  return `<!-- CART OVERLAY -->
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>

<!-- CART PANEL -->
<div class="cart-panel" id="cartPanel">
  <div class="cart-header">
    <h3 id="cartPanelTitle">Your Booking</h3>
    <button class="cart-close" onclick="closeCart()">✕</button>
  </div>
  <div id="cartContent">
    <div class="cart-empty">No companions selected yet.<br>Browse our models to get started.</div>
  </div>
</div>

<!-- NAV -->
<nav${heroVideo ? ' class="nav-on-hero"' : ''}>
  ${logo}
  <div class="nav-search" id="navSearch">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <input type="text" placeholder="Search models…" id="navSearchInput" oninput="handleNavSearch(this.value)" onfocus="navSearchFocus()" onblur="navSearchBlur()">
    <div class="search-dropdown" id="searchDropdown"></div>
  </div>
  <button class="nav-search-cancel" id="navSearchCancel" onclick="cancelNavSearch()">Cancel</button>
  <a class="nav-link" href="/models/">Models</a>
  <div class="nav-dropdown">
    <button class="nav-link" type="button">Locations
      <svg class="nav-dropdown-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="nav-dropdown-menu">
      ${CITIES.map(c => `<a href="/models/?city=${citySlug(c)}">${c}</a>`).join('\n      ')}
    </div>
  </div>
  <a class="nav-link" href="/concierge/">Concierge</a>
  <a class="nav-link" href="/events/">Events</a>
  <a class="nav-link" href="/about/">About Us</a>
  <a class="nav-btn nav-btn-vip" href="/vip-models/" style="text-decoration:none">VIP Models</a>
  <div class="nav-cart glass" onclick="openCart()" style="cursor:pointer;padding:0.45rem 0.9rem;border-radius:var(--r);display:flex;align-items:center;gap:6px;font-size:13px;transition:all 0.25s;white-space:nowrap;color:var(--text);">
    Booking
    <div class="cart-badge" id="cartBadge">0</div>
  </div>
  <a class="nav-account-btn" href="/account/" aria-label="My Account">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </a>
  <button class="nav-hamburger-btn" id="navHamburgerBtn" onclick="openMobileMenu()" aria-label="Menu">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>

<!-- MOBILE MENU -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay">
  <div class="mobile-menu-head">
    ${logo}
    <button class="mobile-menu-close" id="mobileMenuClose" onclick="closeMobileMenu()" aria-label="Close menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="mobile-menu-body">
    <div class="mobile-menu-search" id="mobileMenuSearch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" placeholder="Search models…" id="mobileNavSearchInput" oninput="handleMobileNavSearch(this.value)">
      <div class="search-dropdown" id="mobileSearchDropdown"></div>
    </div>
    <a class="mobile-menu-link" href="/models/">Models</a>
    <div class="mobile-menu-accordion">
      <button class="mobile-menu-link mobile-menu-accordion-btn" type="button" onclick="toggleMobileAccordion(this)">
        Locations
        <svg class="nav-dropdown-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-menu-accordion-panel">
        <div class="mobile-menu-accordion-inner">
          ${CITIES.map(c => `<a href="/models/?city=${citySlug(c)}">${c}</a>`).join('\n          ')}
        </div>
      </div>
    </div>
    <a class="mobile-menu-link" href="/concierge/">Concierge</a>
    <a class="mobile-menu-link" href="/events/">Events</a>
    <a class="mobile-menu-link" href="/about/">About Us</a>
    <a class="mobile-menu-link" href="/vip-models/">VIP Models</a>
    <div class="mobile-menu-link" onclick="closeMobileMenu();openCart()" style="cursor:pointer">
      Booking
      <div class="cart-badge" id="mobileCartBadge">0</div>
    </div>
  </div>
  <div class="mobile-menu-foot">
    <a href="${TG_LINK}" class="btn-tg mobile-menu-tg-btn" target="_blank">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      Telegram
    </a>
    <a href="/become-a-model/" class="btn-model-cta mobile-menu-model-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Become a Model
    </a>
  </div>
</div>`;
}

function footerHTML(paradise = false) {
  const brand = paradise ? 'Paradise Models' : 'Velvet London';
  return `<!-- SHARED FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-btns">
      <a href="${TG_LINK}" class="btn-tg" target="_blank" style="font-size:13px;padding:0.5rem 1.1rem">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </a>
      <a href="/blog/" class="btn-blog" style="font-size:13px;padding:0.5rem 1.1rem;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Blog
      </a>
      <a href="/become-a-model/" class="btn-model-cta footer-model-btn" style="font-size:13px;padding:0.5rem 1.1rem;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Become a Model
      </a>
    </div>
    <div class="footer-left">
      <p>© 2026 ${brand}. All rights reserved. For adults 18+ only.</p>
    </div>
  </div>
</footer>`;
}

function ageModalHTML() {
  return `<!-- AGE VERIFICATION MODAL -->
<div id="ageModal" class="age-modal-overlay">
  <div class="age-modal-box">
    <h2 class="age-modal-title">This is an adult website</h2>
    <p class="age-modal-text">This website contains adult-oriented material and is intended strictly for individuals aged 18 years or over, in accordance with the laws of the United Kingdom.</p>
    <p class="age-modal-text">By clicking "Yes", you confirm that:</p>
    <ul class="age-modal-list">
      <li>You are 18 years of age or older;</li>
      <li>You are accessing this site voluntarily;</li>
      <li>You understand and accept the terms of use and privacy policy of this website</li>
    </ul>
    <p class="age-modal-text">If you are under 18 or do not wish to proceed, please click "No" to leave.</p>
    <div class="age-modal-btns">
      <button class="age-btn-no" onclick="exitSite()">No – Exit</button>
      <button class="age-btn-yes" onclick="enterSite()">Yes – I'm 18 or older</button>
    </div>
  </div>
</div>`;
}

function fakeModelOverlayHTML() {
  return '<div id="fakeModelOverlay"></div>';
}

function orbsHTML() {
  return `<div class="orb-container">
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="orb orb3"></div>
</div>`;
}

function modelsDataScript(models = PUBLIC_MODELS) {
  // Serialize the given model list for browser use (with reviews reset to
  // empty). Every current caller uses the PUBLIC_MODELS default — vip:true
  // models are never embedded client-side anywhere; see /api/vip-catalog
  // and buildVipModelProfile below.
  const data = models.map(m => {
    const copy = Object.assign({}, m);
    copy.reviews = [];
    return copy;
  });
  return `<script>
const MODELS = ${JSON.stringify(data)};
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
const CITIES = ${JSON.stringify(CITIES)};
<\/script>`;
}

// =================== HOME PAGE ===================
function buildHome() {
  return head(
    'Paradise Models — HIGH CLASS INTERNATIONAL ESCORT AGENCY',
    'Paradise Models — a high-class international escort agency. Absolute discretion, private events, bespoke travel by private jet, and exclusive introductions you will find nowhere else.',
    SITE_URL + '/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-home">
${orbsHTML()}
${navHTML(true, true)}
${ageModalHTML()}
${fakeModelOverlayHTML()}

<!-- HOME PAGE -->
<div style="position:relative;z-index:1">

  <!-- HERO -->
  <div class="hero" style="position:relative;z-index:1">
    <div class="hero-bg"></div>
    <video class="hero-video" muted loop playsinline preload="none" poster="/images/hero-poster.jpg?v=${BUILD_TS}" data-src="https://paradiseagency.b-cdn.net/background.mp4"></video>
    <video class="hero-video-mobile" muted loop playsinline preload="none" poster="/images/hero-poster-mobile.jpg?v=${BUILD_TS}" data-src="/videos/hero-mobile.mp4?v=${BUILD_TS}"></video>
    <div class="hero-content">
      <div class="hero-hours">
        <span class="dot"></span>
        Available 24/7
      </div>
      <h1>Where discretion meets the <span>extraordinary</span></h1>
      <p class="hero-sub">Paradise Models is a high-class international agency for gentlemen who expect nothing less than absolute discretion. From private encounters and exclusive events to fully bespoke escapes — travel, private jet, every detail handled to perfection — and even lasting introductions arranged with the care of a private matchmaker. We handle everything from the smallest detail to your most exclusive requests. An exclusive experience you will find nowhere else.</p>
      <div class="hero-btns">
        <a href="${TG_LINK}" class="btn-tg" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>
        <a href="/become-a-model/" class="btn-model-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Become a Model
        </a>
      </div>
    </div>
  </div>

  <!-- CITY SECTIONS -->
${CITIES.map((c, i) => `  <div class="section"${i === 0 ? '' : ' style="padding-top:0"'}>
    <div class="section-header">
      <div class="section-title section-title-city"><span>${c}</span></div>
      <a class="see-all" href="/models/?city=${citySlug(c)}">See all →</a>
    </div>
    <div class="models-row" id="cityRow-${citySlug(c)}"></div>
  </div>`).join('\n')}

  <!-- FAQ -->
  <div class="faq-section">
    <div class="section-title" style="margin-bottom:0.3rem">Frequently Asked <span>Questions</span></div>
    <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.5rem">Everything you need to know before making a booking.</p>
    <div id="faqHome"></div>
    <div class="faq-see-all">
      <a class="see-all" href="/faq/">See all FAQs →</a>
    </div>
  </div>

  <!-- PARTNERS -->
  <div class="partners-section">
    <div class="partners-title">Our Partners</div>
    <div class="partners-row">
      <a class="partner-banner" href="https://www.eurogirlsescort.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/EuroEscortGirls.png" alt="EuroGirlsEscort.com">
      </a>
    </div>
  </div>

</div>

${footerHTML(true)}
${modelsDataScript()}
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
  await window.CUR_READY;
  renderHomeCityRows();
  renderFAQs([0,1,2], 'faqHome');
});
<\/script>
</body>
</html>`;
}

// =================== MODELS CATALOG PAGE ===================
function buildModels() {
  return head(
    'Our Companions — Paradise Models',
    'Browse our exclusive roster of London companions. Filter by location, nationality, services and more.',
    SITE_URL + '/models/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}
${fakeModelOverlayHTML()}

<div style="position:relative;z-index:1">
  <div class="models-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back
    </a>
    <div class="models-page-header">
      <h1>Our <span>Companions</span></h1>
      <p>Browse and filter our exclusive roster of London companions</p>
    </div>
    <div class="models-layout">
      <!-- MOBILE FILTER TOGGLE -->
      <button class="mobile-filter-toggle" id="filterToggle" onclick="toggleMobileFilters()">
        <span style="display:flex;align-items:center;gap:8px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>Choose Filters</span>
        <svg id="filterToggleChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <!-- SIDEBAR -->
      <div class="filters-sidebar" id="filtersSidebar">
        <div style="font-size:1rem;font-weight:700;margin-bottom:1.2rem">Filters</div>

        <!-- Category -->
        <div class="filter-group">
          <div class="filter-title">Category</div>
          <div class="filter-chips" id="catChips">
            <button class="filter-chip active" data-cat="all" onclick="setCat(this,'all')">All</button>
            <button class="filter-chip" data-cat="recommended" onclick="setCat(this,'recommended')">Recommended</button>
            <button class="filter-chip" data-cat="under25" onclick="setCat(this,'under25')">Under 25</button>
            <button class="filter-chip" data-cat="toprated" onclick="setCat(this,'toprated')">Top Rated</button>
            <button class="filter-chip" data-cat="new" onclick="setCat(this,'new')">New Models</button>
          </div>
        </div>

        <!-- Location -->
        <div class="filter-group">
          <div class="filter-title">Location</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search city…" oninput="filterCities(this.value)" id="citySearch">
          </div>
          <div class="filter-list" id="cityList"></div>
        </div>

        <!-- Nationality -->
        <div class="filter-group">
          <div class="filter-title">Nationality</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search nationality…" oninput="filterNat(this.value)" id="natSearch">
          </div>
          <div class="filter-list" id="natList"></div>
        </div>

        <!-- Age -->
        <div class="filter-group">
          <div class="filter-title">Age</div>
          <div class="range-wrap" id="ageWrap">
            <div class="range-row"><span>18</span><span class="range-vals" id="ageVals">18 – 60</span><span>60</span></div>
            <div class="range-track" id="ageTrack">
              <div class="range-fill" id="ageFill"></div>
              <input type="range" min="18" max="60" value="18" id="ageMin" oninput="updateRange('age')">
              <input type="range" min="18" max="60" value="60" id="ageMax" oninput="updateRange('age')">
            </div>
          </div>
        </div>

        <!-- Weight -->
        <div class="filter-group">
          <div class="filter-title">Weight (kg)</div>
          <div class="range-wrap" id="weightWrap">
            <div class="range-row"><span>40</span><span class="range-vals" id="weightVals">40 – 100</span><span>100</span></div>
            <div class="range-track" id="weightTrack">
              <div class="range-fill" id="weightFill"></div>
              <input type="range" min="40" max="100" value="40" id="weightMin" oninput="updateRange('weight')">
              <input type="range" min="40" max="100" value="100" id="weightMax" oninput="updateRange('weight')">
            </div>
          </div>
        </div>

        <!-- Height -->
        <div class="filter-group">
          <div class="filter-title">Height (cm)</div>
          <div class="range-wrap" id="heightWrap">
            <div class="range-row"><span>150</span><span class="range-vals" id="heightVals">150 – 185</span><span>185</span></div>
            <div class="range-track" id="heightTrack">
              <div class="range-fill" id="heightFill"></div>
              <input type="range" min="150" max="185" value="150" id="heightMin" oninput="updateRange('height')">
              <input type="range" min="150" max="185" value="185" id="heightMax" oninput="updateRange('height')">
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="filter-group">
          <div class="filter-title">Services</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search service…" oninput="filterSvc(this.value)" id="svcSearch">
          </div>
          <div class="services-wrap filter-list" id="svcList"></div>
        </div>

        <button class="clear-filters" onclick="clearFilters()">✕ Clear all filters</button>
      </div>

      <!-- GRID -->
      <div>
        <div class="filters-top-bar">
          <div class="results-count" id="resultsCount">Showing all models</div>
          <select class="sort-select" onchange="sortModels(this.value)">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="age-asc">Age: Youngest first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
        <div class="models-grid-main" id="modelsGrid"></div>
      </div>
    </div>
  </div>
</div>

${footerHTML(true)}
${modelsDataScript()}
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/catalog.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
  await window.CUR_READY;
  initModelsPage();
});
<\/script>
</body>
</html>`;
}

// =================== MODEL PROFILE PAGE ===================
function buildModelProfile(m) {
  const initRate = m.incallRates[0];
  const minPrice = Math.min(...m.incallRates.map(r => r.price));
  const desc = `${m.name} — ${m.nationality} escort in London. Available for incall from £${minPrice}. Book now at Paradise Models.`;

  return head(
    `${m.name} — Elite London Escort | Paradise Models`,
    desc,
    `${SITE_URL}/models/${m.slug}/`,
    `<meta property="og:image" content="${SITE_URL}/${m.folder}/1.webp">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="model-detail-page" id="modelDetailContent">
    <div style="text-align:center;padding:4rem;color:var(--text-muted)">Loading profile…</div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODEL_DATA = ${JSON.stringify(Object.assign({}, m, {reviews: []}))};
const MODELS = [MODEL_DATA];
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/profile.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
  await window.CUR_READY;
  openRealModel(MODEL_DATA);
});
<\/script>
</body>
</html>`;
}

// vip:true models get a different page shell at the same /models/{slug}/
// URL: no bio/photos/rates/og:image baked into the HTML (nothing to leak
// via view-source or a crawler), just a slug. The real data is fetched
// client-side from /api/vip-catalog, which only returns it once it has
// verified the caller has paid — see assets/profile.js's
// initVipModelProfile. Everyone else sees a locked notice.
function buildVipModelProfile(m) {
  return head(
    'VIP Companion — Paradise Models',
    'An exclusive VIP companion, available to members with active VIP catalog access.',
    `${SITE_URL}/models/${m.slug}/`,
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="model-detail-page" id="modelDetailContent">
    <div style="text-align:center;padding:4rem;color:var(--text-muted)">Loading…</div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/profile.js?v=${BUILD_TS}"><\/script>
<script src="/assets/auth.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  initVipModelProfile(${JSON.stringify(m.slug)});
});
<\/script>
</body>
</html>`;
}

// =================== FAQ PAGE ===================
function buildFaq() {
  return head(
    'FAQ — Paradise Models',
    'Frequently asked questions about our services, companions, and bookings at Paradise Models.',
    SITE_URL + '/faq/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="faq-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <h1>FAQ — <span>All Questions</span></h1>
    <p class="sub">Frequently asked questions about our services, companions, and bookings.</p>
    <div id="faqAll"></div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const allIds = Array.from({length: 17}, (_, i) => i);
  renderFAQs(allIds, 'faqAll');
});
<\/script>
</body>
</html>`;
}

// =================== BECOME A MODEL PAGE ===================
function buildBecome() {
  return head(
    'Become a Model — Paradise Models',
    'Apply to join Paradise Models as an escort companion. Submit your application and our team will review within 24–48 hours.',
    SITE_URL + '/become-a-model/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>Become a <span>Model</span></h1>
      <p>Fill in the application below. Our team will review your profile within 24–48 hours.</p>
    </div>
    <div id="becomeFormWrap">
    <form id="becomeForm" onsubmit="submitApplication(event)">

      <!-- PERSONAL INFO -->
      <div class="form-section">
        <div class="form-section-title">Personal Information</div>
        <div class="form-grid-2">
          <div class="form-field"><label>Real Name *</label><input class="form-input" type="text" name="realName" placeholder="Legal name" required></div>
          <div class="form-field"><label>Working Name *</label><input class="form-input" type="text" name="workingName" placeholder="Model name" required></div>
          <div class="form-field"><label>Phone Number *</label><input class="form-input" type="tel" name="phone" placeholder="+44 7700 000000" required></div>
          <div class="form-field"><label>Telegram Username</label><input class="form-input" type="text" name="telegram" placeholder="@username"></div>
          <div class="form-field"><label>Age *</label><input class="form-input" type="number" name="age" placeholder="18" min="18" max="60" required></div>
          <div class="form-field"><label>Nationality *</label><input class="form-input" type="text" name="nationality" placeholder="e.g. Russian" required></div>
        </div>
      </div>

      <!-- PHYSICAL -->
      <div class="form-section">
        <div class="form-section-title">Physical Details</div>
        <div class="form-grid-3">
          <div class="form-field"><label>Height (cm) *</label><input class="form-input" type="number" name="height" placeholder="168" min="150" max="185" required></div>
          <div class="form-field"><label>Weight (kg) *</label><input class="form-input" type="number" name="weight" placeholder="55" min="40" max="100" required></div>
          <div class="form-field"><label>Dress Size (UK)</label><input class="form-input" type="text" name="dress" placeholder="8, 10, 12…"></div>
          <div class="form-field"><label>Feet Size (UK)</label><input class="form-input" type="text" name="feet" placeholder="4, 5, 6…"></div>
          <div class="form-field"><label>Breast Size</label><input class="form-input" type="text" name="breast" placeholder="32B, 34C…"></div>
        </div>
        <div class="form-grid-2" style="margin-top:1rem">
          <div class="form-field"><label>Breast Type</label><div class="btn-group" id="breastType"><button type="button" class="btn-option" onclick="selectOpt('breastType',this)">Natural</button><button type="button" class="btn-option" onclick="selectOpt('breastType',this)">Silicone</button></div></div>
          <div class="form-field"><label>Do You Smoke?</label><div class="btn-group" id="smoke"><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">No</button><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">Sometimes</button><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">Yes</button></div></div>
          <div class="form-field"><label>Eyes Colour</label><div class="btn-group" id="eyes"><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Brown</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Blue</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Green</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Grey</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Hazel</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Amber</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Black</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Mixed</button></div></div>
          <div class="form-field"><label>Hair Colour</label><div class="btn-group" id="hair"><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Light Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Dark Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Brown</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Dark Brown</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Black</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Red</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Auburn</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Platinum</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">White/Grey</button></div></div>
          <div class="form-field"><label>Tattoo</label><div class="btn-group" id="tattoo"><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">None</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Small</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Medium</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Large</button></div></div>
          <div class="form-field"><label>Piercing</label><div class="btn-group" id="piercing"><button type="button" class="btn-option" onclick="toggleOpt(this)">None</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Ears</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Nose</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Eyebrow</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Lip</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Tongue</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Belly Button</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Nipples</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Intimate</button></div></div>
        </div>
      </div>

      <!-- LANGUAGES -->
      <div class="form-section">
        <div class="form-section-title">Languages</div>
        <div id="langRows"></div>
        <button type="button" class="add-lang-btn" onclick="addLangRow()">+ Add another language</button>
      </div>

      <!-- PREFERENCES -->
      <div class="form-section">
        <div class="form-section-title">Preferences &amp; Orientation</div>
        <div class="form-grid-2">
          <div class="form-field"><label>Orientation</label><div class="btn-group" id="orientation"><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Straight</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Bisexual</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Lesbian</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Gay</button></div></div>
          <div class="form-field"><label>Work With Couples?</label><div class="btn-group" id="couples"><button type="button" class="btn-option" onclick="selectOpt('couples',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('couples',this)">No</button></div></div>
          <div class="form-field"><label>Work With Women?</label><div class="btn-group" id="women"><button type="button" class="btn-option" onclick="selectOpt('women',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('women',this)">No</button></div></div>
          <div class="form-field"><label>Work With Black Clients?</label><div class="btn-group" id="blackClients"><button type="button" class="btn-option" onclick="selectOpt('blackClients',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('blackClients',this)">No</button></div></div>
          <div class="form-field"><label>Work With Disabled Clients?</label><div class="btn-group" id="disabledClients"><button type="button" class="btn-option" onclick="selectOpt('disabledClients',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('disabledClients',this)">No</button></div></div>
        </div>
      </div>

      <!-- RATES -->
      <div class="form-section">
        <div class="form-section-title">Rates</div>
        <div class="rates-section">
          <label class="rates-toggle-header"><input type="checkbox" id="incallToggle" onchange="toggleRates('incall',this.checked)"><span>Incall</span></label>
          <div class="rates-fields" id="incallFields">
            <div class="form-field"><label>30 min</label><input class="form-input" type="text" name="incall30" placeholder="£"></div>
            <div class="form-field"><label>45 min</label><input class="form-input" type="text" name="incall45" placeholder="£"></div>
            <div class="form-field"><label>1 hour</label><input class="form-input" type="text" name="incall1h" placeholder="£"></div>
            <div class="form-field"><label>Extra hour</label><input class="form-input" type="text" name="incallExtra" placeholder="£"></div>
            <div class="form-field"><label>Overnight</label><input class="form-input" type="text" name="incallOver" placeholder="£"></div>
          </div>
        </div>
        <div class="rates-section" style="margin-top:1.25rem">
          <label class="rates-toggle-header"><input type="checkbox" id="outcallToggle" onchange="toggleRates('outcall',this.checked)"><span>Outcall</span></label>
          <div class="rates-fields" id="outcallFields">
            <div class="form-field"><label>30 min</label><input class="form-input" type="text" name="outcall30" placeholder="£"></div>
            <div class="form-field"><label>45 min</label><input class="form-input" type="text" name="outcall45" placeholder="£"></div>
            <div class="form-field"><label>1 hour</label><input class="form-input" type="text" name="outcall1h" placeholder="£"></div>
            <div class="form-field"><label>Extra hour</label><input class="form-input" type="text" name="outcallExtra" placeholder="£"></div>
            <div class="form-field"><label>Overnight</label><input class="form-input" type="text" name="outcallOver" placeholder="£"></div>
          </div>
        </div>
      </div>

      <!-- ADDRESS -->
      <div class="form-section">
        <div class="form-section-title">Address (Incall Location)</div>
        <div class="form-grid-2">
          <div class="form-field" style="grid-column:1/-1"><label>Street</label><input class="form-input" type="text" name="street" placeholder="123 Baker Street"></div>
          <div class="form-field"><label>Building Name</label><input class="form-input" type="text" name="building" placeholder="Building / Complex name"></div>
          <div class="form-field"><label>Apartment Number</label><input class="form-input" type="text" name="apt" placeholder="Flat 4A"></div>
          <div class="form-field"><label>Postcode</label><input class="form-input" type="text" name="postcode" placeholder="W1A 1AA"></div>
          <div class="form-field"><label>Nearest Tube Station</label><select class="form-select" name="tube" id="tubeSelect"><option value="">Select station…</option></select></div>
        </div>
      </div>

      <!-- SERVICES -->
      <div class="form-section">
        <div class="form-section-title">Services Offered</div>
        <div class="services-chk-grid" id="servicesCheckList"></div>
      </div>

      <!-- PHOTOS & VIDEOS -->
      <div class="form-section">
        <div class="form-section-title">Photos &amp; Videos</div>
        <p style="font-size:13px;color:var(--text-soft);margin-bottom:1rem">Upload clear, recent photos and/or short video clips. Minimum 3 photos. JPG, PNG, MP4, MOV.</p>
        <div class="photo-upload-area" onclick="document.getElementById('photoInput').click()">
          <input type="file" id="photoInput" multiple accept="image/*,video/*" onchange="handleFiles(this)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(176,127,222,0.5)" stroke-width="1.5" style="margin-bottom:0.75rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p style="color:var(--text-soft);font-size:14px;margin:0">Click to select photos &amp; videos</p>
          <p style="color:var(--text-muted);font-size:12px;margin:4px 0 0">JPG, PNG · MP4, MOV · multiple files allowed</p>
        </div>
        <div class="photo-list" id="photoList"></div>
        <p style="font-size:12px;color:var(--text-muted);margin-top:0.75rem">All files are sent securely to our team. Video files are shown with a ▶ icon.</p>
      </div>

      <button type="submit" class="submit-app-btn">Submit Application →</button>
    </form>
    </div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/become.js?v=${BUILD_TS}"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  initBecomePage();
});
<\/script>
</body>
</html>`;
}

// =================== VIP MODELS PAGE (placeholder) ===================
function buildVipModels() {
  return head(
    'VIP Models — Paradise Models',
    'An exclusive selection of VIP companions at Paradise Models. Unlock with a one-time payment.',
    SITE_URL + '/vip-models/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="models-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="models-page-header">
      <h1>VIP <span>Models</span></h1>
      <p>Our most exclusive selection of companions — available to members with unlocked VIP access.</p>
    </div>

    <div id="vipLoading" style="text-align:center;padding:3rem 0;color:var(--text-soft)">Checking your access…</div>

    <div id="vipLocked" style="display:none">
      <div class="vip-teaser-wrap">
        <div id="vipTeaserGrid" class="models-row vip-teaser-grid"></div>
        <div class="vip-paywall-overlay">
          <div class="vip-paywall-card">
            <div class="form-section-title">VIP Access Required</div>
            <p id="vipPaywallCopy" style="margin-bottom:1.1rem">Sign in to unlock the VIP catalog.</p>
            <div id="vipPriceTag" style="font-size:1.7rem;font-weight:700;margin-bottom:1.1rem"></div>
            <button type="button" class="submit-app-btn" id="vipUnlockBtn" onclick="handleVipCta()" style="margin-top:0">Sign In</button>
            <div id="vipError" style="display:none;color:#ff8a8a;font-size:13px;margin-top:0.9rem"></div>
            <p style="font-size:12px;color:var(--text-muted);margin-top:1rem">One-time payment. No subscription.</p>
          </div>
        </div>
      </div>
    </div>

    <div id="vipUnlocked" class="models-row" style="display:none"></div>
  </div>
</div>

${footerHTML(true)}
${modelsDataScript()}
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/auth.js?v=${BUILD_TS}"><\/script>
<script src="/assets/vip.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

// =================== SIMPLE PLACEHOLDER PAGE ===================
function buildPlaceholder({title, slug, heading, headingAccent, lead, metaTitle, metaDesc}) {
  return head(
    metaTitle,
    metaDesc,
    SITE_URL + slug,
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="faq-page" style="text-align:center;min-height:70vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
    <a class="back-btn" href="/" style="position:absolute;top:90px;left:2rem">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <h1 style="font-size:clamp(2.4rem,5vw,4rem);font-weight:700;margin-bottom:1rem">${heading} <span style="background:linear-gradient(135deg,#1a5f7a,#123a66);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${headingAccent}</span></h1>
    <p style="color:var(--text-soft);font-size:1.1rem;max-width:520px">${lead}</p>
    <p style="color:var(--text-muted);font-size:1rem;margin-top:1.5rem">Coming soon.</p>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
const CITIES = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

function buildConcierge() {
  const categories = [
    ['Travel & Getaways', 'Private jets, secluded resorts and bespoke itineraries — routes built around you, not a brochure.', 'travel'],
    ['Events & Celebrations', 'Private dinners, parties and milestone occasions, produced and run from first idea to last detail.', 'events'],
    ['Lifestyle Support', 'Personal shoppers, private chefs, wellness and security — the everyday handled seamlessly.', 'lifestyle'],
    ['Access & Reservations', 'Tables, tickets and rooms that are normally closed to the public, opened through our contacts.', 'art'],
    ['Rare Acquisitions', 'Hard-to-get pieces — watches, bags, gifts — sourced through relationships built over years.', 'rare'],
    ['Stays & Real Estate', 'Private villas, penthouses and islands, arranged for a weekend or an entire season.', 'estate'],
    ['Yachts & Private Aviation', 'Charter or full management, arranged on short notice when timing matters most.', 'aviation'],
    ['Bespoke Requests', "Anything else. If it can be arranged, we'll arrange it — tell us what you need.", 'bespoke'],
  ];

  return head(
    'Concierge — Paradise Models',
    'The Paradise Models concierge — bespoke travel, events, access and rare acquisitions, arranged with the same discretion as everything else we do.',
    SITE_URL + '/concierge/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:960px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>Paradise <span>Concierge</span></h1>
      <p>A dedicated concierge for the details that matter — bespoke travel, private events, and tailored arrangements handled with absolute discretion.</p>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title">How It Works</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.8">No memberships, no subscriptions, no annual fees — you send a request, and we arrange it. Every request is handled personally, by the same team you already trust for discretion, and you pay only for what you ask for.</p>
    </div>

    <div class="form-grid-2" style="margin-bottom:2.5rem">
      ${categories.map(([title, desc, img]) => `
      <div class="form-section" style="padding:0;overflow:hidden">
        <div style="aspect-ratio:3/2;background:url('/images/concierge/${img}.webp?v=${BUILD_TS}') center/cover no-repeat"></div>
        <div style="padding:1.25rem">
          <div class="form-section-title">${title}</div>
          <p style="color:var(--text-soft);font-size:14px;line-height:1.75">${desc}</p>
        </div>
      </div>`).join('')}
    </div>

    <div class="form-section" style="text-align:center">
      <div class="form-section-title">Make a Request</div>
      <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.25rem">Tell us what you need — however specific or unusual — and our concierge team will come back to you within hours.</p>
      <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="${TG_LINK}" target="_blank" rel="noopener">Message on Telegram</a>
    </div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
const CITIES = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

function buildEvents() {
  const gallery = [
    {src: 'sinlist-1.webp', alt: 'The Sin List — masquerade evening'},
    {src: 'sinlist-2.webp', alt: 'The Sin List — private encounter'},
    {src: 'sinlist-3.webp', alt: 'The Sin List — costumed guests'},
    {src: 'sinlist-4.webp', alt: 'The Sin List — ritual detail'},
  ];
  const facts = [
    ['Performers', '20+'],
    ['Format', 'Masquerade'],
    ['Structure', '9 Circles'],
    ['Access', 'By interview'],
  ];
  const tiers = [
    {price: '£10,000', name: 'Main Access', items: ['Main zones', 'Guest approval required']},
    {price: '£15,000', name: 'Extended Access', items: ['All zones', 'VIP domination zone', 'Two guests permitted']},
    {price: '£30,000', name: 'Full Access', items: ['Unrestricted entry', 'Private comfort manager', 'Accompanied model', 'Two guests permitted']},
  ];

  return head(
    'Private Events — Paradise Models',
    'Paradise Models private events — our own invite-only evenings, and bespoke events we produce entirely around you.',
    SITE_URL + '/events/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:960px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>Private <span>Events</span></h1>
      <p>Two ways to go beyond a booking — join one of our own invite-only evenings, or commission a fully bespoke event built entirely around you.</p>
    </div>

    <div class="form-grid-2" style="margin-bottom:2.5rem">
      <div class="form-section">
        <div class="form-section-title">Our Own Events</div>
        <p style="color:var(--text-soft);font-size:14px;line-height:1.75">From time to time we produce our own private, invite-only evenings in London — immersive, theatrical, unlike anything else on offer. Places are strictly limited and granted by application.</p>
      </div>
      <div class="form-section">
        <div class="form-section-title">Bespoke, For You</div>
        <p style="color:var(--text-soft);font-size:14px;line-height:1.75">Commission a private event built entirely for you — venue, theme, cast and every detail handled end-to-end, with the same discretion as everything else we do.</p>
      </div>
    </div>

    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div style="position:relative;min-height:220px;display:flex;align-items:flex-end;padding:2.5rem 1.75rem 1.75rem;background:linear-gradient(180deg,rgba(10,4,8,0.15),rgba(10,4,8,0.88)),url('/images/events/sinlist-hero.webp') center/cover no-repeat">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#d99aa8;font-weight:700;margin-bottom:0.5rem">An Example of Our Work</div>
          <div style="font-size:1.6rem;font-weight:700;color:#fff">The Sin List — Opening Night</div>
          <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:0.35rem">A private members' club we produced in London — an immersive, theatrical evening exploring the architecture of desire.</div>
        </div>
      </div>

      <div style="padding:1.75rem">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0.5rem;margin-bottom:1.5rem">
          ${facts.map(([l, v]) => `<div class="stat-box"><div class="stat-label">${l}</div><div class="stat-val" style="font-size:0.82rem">${v}</div></div>`).join('')}
        </div>

        <p style="color:var(--text-soft);font-size:14px;line-height:1.8;margin-bottom:1.25rem">Structured as nine circles — nine progressive spaces, each its own state of experience — guests moved through a sequence of sensation, tension and release, from observation to full participation. More than twenty actors and actresses built a fully theatrical environment around every guest, from a masquerade dress code through to a private, guided evening.</p>
        <p style="color:var(--text-soft);font-size:14px;line-height:1.8;margin-bottom:1.5rem">Discretion was the foundation of the evening — no devices inside the space, consent as the basis of every interaction, and comfort maintained throughout by our own team.</p>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:0.5rem">
          ${gallery.map(g => `<div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/${g.src}" alt="${g.alt}" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title">Access Tiers — This Event</div>
      <p style="color:var(--text-soft);font-size:13px;margin-bottom:1.25rem">The investment shown reflects this specific evening — every private event we build is scoped and priced around its own venue, cast and ambition.</p>
      <div class="form-grid-2" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${tiers.map(t => `
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);border-radius:var(--r-xs);padding:1.1rem">
          <div style="font-size:1.35rem;font-weight:700;color:#fff">${t.price}</div>
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#70e9ff;font-weight:700;margin:0.35rem 0 0.75rem">${t.name}</div>
          <ul style="margin:0;padding-left:1.1rem;color:var(--text-soft);font-size:13px;line-height:1.9">
            ${t.items.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>`).join('')}
      </div>
    </div>

    <div class="form-section" style="text-align:center">
      <div class="form-section-title">Interested in Something Similar?</div>
      <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.25rem">Whether you'd like to apply for one of our own events, or discuss a private event of your own, get in touch and our concierge team will take it from there.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="/concierge/">Contact Concierge</a>
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem;background:rgba(255,255,255,0.08)!important;box-shadow:none!important" href="${TG_LINK}" target="_blank" rel="noopener">Message on Telegram</a>
      </div>
    </div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
const CITIES = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

function buildAbout() {
  const featuredNationalities = ['Russian', 'British', 'Brazilian', 'French', 'Italian', 'Spanish', 'Ukrainian', 'Eastern European'];
  const teaserModels = PUBLIC_MODELS.filter(m => m.real).slice(0, 2);

  return head(
    'High Class London Escorts | Paradise Models',
    'Paradise Models — a high-class international escort agency in London, Paris, Monaco, Milan, Dubai, New York, Miami, Zurich and Amsterdam. Verified photos, discreet service, available 24/7 from £300/h.',
    SITE_URL + '/about/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:960px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>

    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div class="about-hero" style="position:relative;min-height:280px;display:flex;align-items:center;padding:2.5rem 1.75rem">
        <div style="max-width:520px">
          <h1 style="font-size:clamp(1.7rem,4vw,2.4rem);font-weight:700;color:#1a1e42;line-height:1.15;margin-bottom:0.9rem">High Class <span style="background:linear-gradient(135deg,#1a5f7a,#123a66);-webkit-background-clip:text;-webkit-text-fill-color:transparent">London Escorts</span></h1>
          <p style="color:rgba(26,30,66,0.8);font-size:14.5px;line-height:1.8">Introducing our exclusive gallery of high class international escorts. At Paradise Models, we have a range of busty blondes, Russian brunettes and leggy redheads eager to please the discerning gentlemen of ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]}. Whether you opt for an incall or an outcall, we have the perfect elite escort for you offering a range of services from romantic dinner dates to thrilling duo experiences. Our girls are available 24/7 from £300/h. Browse through their verified photos, selfies and videos and call us to book now!</p>
        </div>
      </div>
      <div style="padding:1.1rem 1.75rem;display:flex;flex-wrap:wrap;gap:6px">
        ${CITIES.map(c => `<span style="display:inline-block;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:var(--text);font-size:12px">${c}</span>`).join('')}
      </div>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title" style="font-size:1.15rem">Why Choose Paradise Models?</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1rem">As a respected high class international escort agency, we carefully select every model in our gallery. Each elite London escort has been chosen for her beauty, intelligence and class. We offer a wide range of models catering to every taste who each meet our high standards of sophistication. Client's privacy and confidentiality is our top priority. Our ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]} elite escorts always provide a discreet service to give you peace of mind.</p>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.5rem">At Paradise Models, we focus on providing a professional, reliable and discreet service across every area of London. In keeping with this, we offer our direct support for anyone who needs help or has further questions in regards to our services, escorts or agency in general. To get in contact, feel free to contact us online or message us directly to speak to a friendly member of staff.</p>
      <div style="border-left:3px solid #70e9ff;padding:0.25rem 0 0.25rem 1.1rem;margin-bottom:1.5rem">
        <p style="color:var(--text);font-size:1.05rem;font-style:italic;line-height:1.6">"We pride ourselves on being a boutique agency and not a mass market platform."</p>
      </div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85">Every model you see with us has been carefully cast and selected to meet the highest standards of beauty, charm, and professionalism. This dedication to quality ensures you receive not only exceptional companionship but also the finest escort service London has to offer. With Paradise Models, you're not just booking a date — you're experiencing a curated, top-tier encounter designed for those who value exclusivity and excellence.</p>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title" style="font-size:1.15rem">Find Your Ideal High Class International Escort</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1rem">Our lineup of high class ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]} escorts includes the most stunning models you will ever meet. From Russians to Europeans to Brazilians to Brits, our gallery has girls from all over the world, each adding their own unique flair to your date. Each high class escort brings her own distinct style, personality and charm to every meeting.</p>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.25rem">Choose from girls with different nationalities, hair colours and body types to suit your desires. With curvy blondes, petite Russians and all-natural party girls, our gallery has every type of high class escort our cities can offer. What they all have in common is the commitment to client satisfaction and tailored experiences you can only receive from high class escorts in ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]}.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.5rem">
        ${featuredNationalities.map(n => `<span style="display:inline-block;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:var(--text);font-size:12px">${n}</span>`).join('')}
      </div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.25rem">The profiles of our elite London escorts feature high-quality photos, selfies and personal videos. They also list detailed stats, services, rates, and verified reviews to learn more about each high class escort. Want to narrow down your options? Use our filter to sort by rate, or browse by category and city from the models menu.</p>
      ${teaserModels.length ? `
      <div style="display:grid;grid-template-columns:repeat(${teaserModels.length},1fr);gap:1rem;max-width:360px">
        ${teaserModels.map(m => `
        <a href="/models/${m.slug}/" style="text-decoration:none;display:block;border-radius:var(--r-xs);overflow:hidden;position:relative;aspect-ratio:3/4">
          <img src="/${m.folder}/1.webp?v=${BUILD_TS}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;display:block">
          <div style="position:absolute;left:0;right:0;bottom:0;padding:0.6rem;background:linear-gradient(0deg,rgba(0,0,0,0.65),transparent);color:#fff;font-size:13px;font-weight:600">${m.name}</div>
        </a>`).join('')}
      </div>` : ''}
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title" style="font-size:1.15rem">Where Can I Meet My Elite Escort?</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.5rem">Our high class escorts are available throughout ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]}. Find an escort close to you using our models menu to see girls in your city. We have girls who offer both incalls and outcalls for your convenience. Our VIP escorts have exclusive apartments that are easy to find if you're looking for an incall — or we can deliver the most stunning elite escort straight to your home or hotel. Looking for a plus-one to an event? Our elite escorts are happy to attend business events or exclusive parties with you in an outcall.</p>
      <div style="text-align:center">
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="/models/">Browse Models</a>
      </div>
    </div>

    <div class="form-section" style="text-align:center">
      <div class="form-section-title" style="font-size:1.15rem">How To Book A VIP Escort</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.25rem;text-align:left">Prefer something more exclusive? Our <a href="/vip-models/" style="color:#70e9ff">VIP Models</a> section is a separate, closed catalog — hidden from public browsing and visible only to members who've unlocked it. Create a free account, complete a single one-time payment (no subscription, no recurring charge), and you'll have ongoing access to our VIP companions the moment it clears. Everyone else can still browse the full public gallery as usual — VIP is simply a further step in, for those who want it.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="/vip-models/">View VIP Models</a>
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem;background:rgba(255,255,255,0.08)!important;box-shadow:none!important" href="${TG_LINK}" target="_blank" rel="noopener">Message on Telegram</a>
      </div>
    </div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
const CITIES = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

function buildBlog() {
  return buildPlaceholder({
    metaTitle: 'Blog — Paradise Models',
    metaDesc: 'The Paradise Models blog — insights, city guides and news from the world of high-class companionship.',
    slug: '/blog/',
    heading: 'The', headingAccent: 'Blog',
    lead: 'Insights, city guides, and news from the world of high-class companionship.',
  });
}

function buildAccount() {
  return head(
    'My Account — Paradise Models',
    'Sign in to your Paradise Models account to manage VIP catalog access.',
    SITE_URL + '/account/',
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body>
${orbsHTML()}
${navHTML(true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:460px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>My <span>Account</span></h1>
      <p id="acctLead">Sign in to manage your VIP catalog access.</p>
    </div>

    <div id="acctLoading" class="form-section" style="text-align:center;color:var(--text-soft)">Loading…</div>

    <!-- Signed out: sign in / create account -->
    <div id="acctAuthBox" class="form-section" style="display:none">
      <div id="acctFormFields">
        <div class="form-section-title" id="acctModeTitle">Sign In</div>
        <div class="form-grid-2" style="margin-bottom:1rem">
          <button type="button" class="bf-method active" id="acctTabSignin" onclick="setAcctMode('signin')">Sign In</button>
          <button type="button" class="bf-method" id="acctTabSignup" onclick="setAcctMode('signup')">Create Account</button>
        </div>
        <div class="form-field" style="margin-bottom:0.9rem">
          <label>Email</label>
          <input class="form-input" type="email" id="acctEmail" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="form-field" style="margin-bottom:0.9rem">
          <label>Password</label>
          <input class="form-input" type="password" id="acctPassword" placeholder="••••••••" autocomplete="current-password">
        </div>
        <div id="acctError" style="display:none;color:#ff8a8a;font-size:13px;margin-bottom:0.9rem"></div>
        <button type="button" class="submit-app-btn" id="acctSubmitBtn" onclick="submitAcctForm()" style="margin-top:0">Sign In</button>
      </div>
      <div id="acctSignupNotice" style="display:none;text-align:center;padding:0.5rem 0">
        <div style="font-size:1.3rem;font-weight:800;color:#70e9ff;margin-bottom:0.6rem">Check your email</div>
        <p style="color:var(--text-soft);font-size:14px;margin:0">We've sent a confirmation link to your inbox — click it, then come back here and sign in.</p>
      </div>
    </div>

    <!-- Signed in -->
    <div id="acctDashboard" class="form-section" style="display:none">
      <div class="form-section-title">Signed In</div>
      <p style="margin-bottom:1.25rem">Signed in as <strong id="acctEmailDisplay"></strong></p>
      <div id="acctVipStatus" style="padding:1rem;border-radius:var(--r-xs);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);margin-bottom:1.25rem"></div>
      <button type="button" class="submit-app-btn" onclick="handleSignOut()" style="margin-top:0;background:rgba(255,255,255,0.08)!important;box-shadow:none!important">Sign Out</button>
    </div>
  </div>
</div>

${footerHTML(true)}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
const CITIES = [];
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/auth.js?v=${BUILD_TS}"><\/script>
<script src="/assets/account.js?v=${BUILD_TS}"><\/script>
</body>
</html>`;
}

// =================== SITEMAP ===================
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    {url: '/', priority: '1.0'},
    {url: '/models/', priority: '0.9'},
    {url: '/vip-models/', priority: '0.9'},
    {url: '/concierge/', priority: '0.7'},
    {url: '/events/', priority: '0.7'},
    {url: '/about/', priority: '0.7'},
    {url: '/blog/', priority: '0.7'},
    {url: '/account/', priority: '0.4'},
    {url: '/faq/', priority: '0.7'},
    {url: '/become-a-model/', priority: '0.6'},
    // vip:true models don't get a sitemap entry — nothing should advertise
    // that their URL exists to crawlers ahead of a visitor unlocking it.
    ...PUBLIC_MODELS.filter(m => m.real).map(m => ({url: `/models/${m.slug}/`, priority: '0.8'})),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// =================== WRITE OUTPUT ===================
function write(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Generated:', filePath);
}

const OUT = path.join(__dirname, '..');

write(path.join(OUT, 'index.html'), buildHome());
write(path.join(OUT, 'models/index.html'), buildModels());
REAL_MODELS.forEach(m => {
  write(path.join(OUT, `models/${m.slug}/index.html`), m.vip ? buildVipModelProfile(m) : buildModelProfile(m));
});
write(path.join(OUT, 'faq/index.html'), buildFaq());
write(path.join(OUT, 'become-a-model/index.html'), buildBecome());
write(path.join(OUT, 'vip-models/index.html'), buildVipModels());
write(path.join(OUT, 'concierge/index.html'), buildConcierge());
write(path.join(OUT, 'events/index.html'), buildEvents());
write(path.join(OUT, 'about/index.html'), buildAbout());
write(path.join(OUT, 'blog/index.html'), buildBlog());
write(path.join(OUT, 'account/index.html'), buildAccount());
write(path.join(OUT, 'sitemap.xml'), buildSitemap());
write(path.join(OUT, 'robots.txt'), buildRobots());

console.log('\nBuild complete!');
