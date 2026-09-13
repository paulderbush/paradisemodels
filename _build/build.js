'use strict';
const fs = require('fs');
const path = require('path');

// Load CSS
const css = fs.readFileSync(path.join(__dirname, '../assets/style.css'), 'utf8');

// Load models
const { MODELS, VIP_TEASER_MODELS, SERVICES, NATIONALITIES, STATIONS, CITIES, CATEGORIES } = require('../data/models.js');
const { BLOG_POSTS } = require('../data/blog.js');
// URL-safe slug for a city name, used for element ids and query params.
const citySlug = (c) => c.toLowerCase().replace(/\s+/g, '-');
const REAL_MODELS = MODELS.filter(m => m.real);
// Everything served to the general public (home, catalog, search) excludes
// vip:true models entirely — their data only ever leaves the server via
// /api/vip-catalog, which checks payment first. See buildVipModelProfile.
const PUBLIC_MODELS = MODELS.filter(m => !m.vip);
// The homepage only ever shows a section for a fixed, curated list of
// cities (CITIES) — a new touring model's city shouldn't spawn a homepage
// section on its own. The /models/ filter dropdown is different: any city
// a public model is actually based in should be selectable there, so it's
// CITIES plus whatever extra cities show up among PUBLIC_MODELS.
const FILTER_CITIES = Array.from(new Set([...CITIES, ...PUBLIC_MODELS.map(m => m.city)]));
// A city row with fewer than 4 public models used to look like the agency
// had no presence there at all, even when it actually has real VIP models
// in that city sitting behind the paywall. To fix that without leaking any
// gated data, this ships only the minimum needed for an enticing locked
// card — name, age, nationality and a destroyed-detail blurred cover (see
// vip-models/README's teaser-blur.webp recipe) — never services, rates,
// or anything from the real profile. Cards built from this always link to
// /vip-models/, never to the model's own (also-gated) /models/{slug}/.
const VIP_CITY_TEASERS = MODELS
  .filter(m => m.vip && m.real && CITIES.includes(m.city))
  .map(m => ({
    id: m.id,
    name: m.name,
    age: m.age ?? null,
    nationality: m.nationality ?? null,
    city: m.city,
    initials: m.initials,
    teaserImg: `/${m.folder}/teaser-blur.webp`,
  }));
const SITE_URL = 'https://velvetescort.co.uk';
// Single source of truth for the Telegram contact — it lives in the hero,
// the footer and the mobile menu, so define it once.
const TG_LINK = 'https://t.me/paradisemodelslondon?text=Hello%20Paradise%20Models%20%F0%9F%91%8B%F0%9F%8F%BC';
// Paradise Erotic Events runs its own Telegram channel, separate from the
// main concierge contact above.
const SINLIST_TG_LINK = 'https://t.me/thesinlist';
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

function navHTML(paradise = false, heroVideo = false, newLogo = false) {
  // The client's new logo (PARADISE wordmark only, no MODELS subtitle) is
  // opt-in per page — homepage always wants it (heroVideo is only ever
  // true there), and callers can also pass newLogo explicitly for other
  // pages carrying the new design (e.g. Julia's profile trial).
  const logoFile = (heroVideo || newLogo) ? 'logo-new.png' : 'logo-nav.png';
  const logo = paradise
    ? `<a class="nav-logo nav-logo-img" href="/" style="cursor:pointer;text-decoration:none"><img src="/images/${logoFile}?v=${BUILD_TS}" alt="Paradise Models"></a>`
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
      <div class="footer-legal-links">
        <a href="/terms/">Terms and Conditions</a>
        <a href="/privacypolicy/">Privacy Policy</a>
      </div>
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

function lightboxHTML() {
  return `<!-- PHOTO LIGHTBOX -->
<div class="lightbox-overlay" id="lightboxOverlay" onclick="if(event.target===this)closeLightbox()">
  <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">&#10005;</button>
  <button class="lightbox-arrow prev" onclick="lightboxGo(-1)" aria-label="Previous">&#8249;</button>
  <div class="lightbox-content" id="lightboxContent"></div>
  <button class="lightbox-arrow next" onclick="lightboxGo(1)" aria-label="Next">&#8250;</button>
  <div class="lightbox-counter" id="lightboxCounter"></div>
</div>`;
}

function orbsHTML() {
  return `<div class="orb-container">
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="orb orb3"></div>
</div>`;
}

function modelsDataScript(models = PUBLIC_MODELS, cities = CITIES) {
  // Serialize the given model list for browser use (with reviews reset to
  // empty). Every current caller uses the PUBLIC_MODELS default — vip:true
  // models are never embedded client-side anywhere; see /api/vip-catalog
  // and buildVipModelProfile below. `cities` defaults to the homepage's
  // fixed list — the /models/ page passes FILTER_CITIES instead so its
  // filter dropdown also covers touring models' own cities.
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
const CITIES = ${JSON.stringify(cities)};
const CATEGORIES = ${JSON.stringify(CATEGORIES)};
<\/script>`;
}

// =================== HOME PAGE ===================
function buildHome() {
  return head(
    'Paradise Models — HIGH CLASS INTERNATIONAL ESCORT AGENCY',
    'Paradise Models — a high-class international escort agency. Absolute discretion, private events, bespoke travel by private jet, and exclusive introductions you will find nowhere else.',
    SITE_URL + '/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
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
    <video class="hero-video" muted loop playsinline preload="none" poster="/images/hero-poster.jpg?v=${BUILD_TS}" data-src="/videos/hero-desktop.mp4?v=${BUILD_TS}"></video>
    <!-- Trying the client's new mobile clip (hero-mobile-new.mp4) for
         preview — hero-mobile.mp4 (the current one) is intentionally kept
         in the repo unused, so this is a one-line revert if they don't
         like it. -->
    <video class="hero-video-mobile" muted loop playsinline preload="none" poster="/images/hero-poster-mobile.jpg?v=${BUILD_TS}" data-src="/videos/hero-mobile-new.mp4?v=${BUILD_TS}"></video>
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
      <a class="partner-banner" href="https://devozki.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/Devozki.webp" alt="Devozki">
      </a>
      <a class="partner-banner" href="https://www.ukadultzone.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/UKAdultZone.webp" alt="UK Adult Zone">
      </a>
      <a class="partner-banner" href="https://www.happyescorts.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/HappyEscorts.webp" alt="HappyEscorts">
      </a>
      <a class="partner-banner" href="https://escortnews.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/EscortNews.webp" alt="EscortNews">
      </a>
      <a class="partner-banner" href="https://www.erotic-guide.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/EroticGuide.webp" alt="EroticGuide">
      </a>
    </div>
  </div>

</div>

${footerHTML(true)}
${modelsDataScript()}
<script>
const VIP_CITY_TEASERS = ${JSON.stringify(VIP_CITY_TEASERS)};
<\/script>
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-models">
${orbsHTML()}
${navHTML(true, false, true)}
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
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search category…" oninput="filterCat(this.value)" id="catSearch">
          </div>
          <div class="filter-list" id="catList"></div>
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
            <div class="range-row"><span>150</span><span class="range-vals" id="heightVals">150 – 195</span><span>195</span></div>
            <div class="range-track" id="heightTrack">
              <div class="range-fill" id="heightFill"></div>
              <input type="range" min="150" max="195" value="150" id="heightMin" oninput="updateRange('height')">
              <input type="range" min="150" max="195" value="195" id="heightMax" oninput="updateRange('height')">
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
          <div class="filter-search name-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search models…" oninput="filterByName(this.value)" id="nameSearch">
          </div>
          <select class="sort-select" onchange="sortModels(this.value)">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="age-asc">Age: Youngest first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
        <div class="models-grid-main" id="modelsGrid"></div>
        <a class="vip-catalog-cta" href="/vip-models/">Looking for VIP models? →</a>
      </div>
    </div>
  </div>
</div>

${footerHTML(true)}
${modelsDataScript(undefined, FILTER_CITIES)}
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
  // Outcall-only models (Gelato) and "rates on request" ones (Euphoria)
  // have no incallRates at all — Math.min() of an empty array is Infinity,
  // not a real price, so this falls back to outcallRates and finally to a
  // generic line when neither has anything on file.
  const rates = (m.incallRates && m.incallRates.length) ? m.incallRates : (m.outcallRates || []);
  const minPrice = rates.length ? Math.min(...rates.map(r => r.price)) : null;
  const desc = minPrice !== null
    ? `${m.name} — ${m.nationality} escort in London. Available for incall from £${minPrice}. Book now at Paradise Models.`
    : `${m.name} — ${m.nationality} escort in London. Contact Paradise Models for rates and availability.`;

  return head(
    `${m.name} — Elite London Escort | Paradise Models`,
    desc,
    `${SITE_URL}/models/${m.slug}/`,
    `<meta property="og:image" content="${SITE_URL}/${m.folder}/1.webp">
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-model">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}
${lightboxHTML()}

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
const TG_LINK = ${JSON.stringify(TG_LINK)};
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-model">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}
${lightboxHTML()}

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
const TG_LINK = ${JSON.stringify(TG_LINK)};
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-faq">
${orbsHTML()}
${navHTML(true, false, true)}
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-become">
${orbsHTML()}
${navHTML(true, false, true)}
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
          <div class="form-field"><label>Height (cm) *</label><input class="form-input" type="number" name="height" placeholder="168" min="150" max="195" required></div>
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
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--purple3)" stroke-width="1.5" style="margin-bottom:0.75rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-vip-models">
${orbsHTML()}
${navHTML(true, false, true)}
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
            <a class="submit-app-btn" id="vipTelegramCta" href="${TG_LINK}" target="_blank" rel="noopener" style="margin-top:0;display:none;text-decoration:none">Message on Telegram</a>
            <div id="vipError" style="display:none;color:#ff8a8a;font-size:13px;margin-top:0.9rem"></div>
            <p id="vipPaymentNote" style="font-size:12px;color:var(--text-muted);margin-top:1rem">One-time payment. No subscription.</p>
          </div>
        </div>
      </div>
    </div>

    <div id="vipUnlockedWrap" class="models-layout" style="display:none">
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
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search category…" oninput="filterVipCat(this.value)">
          </div>
          <div class="filter-list" id="vipCatList"></div>
        </div>

        <!-- Location -->
        <div class="filter-group">
          <div class="filter-title">Location</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search city…" oninput="filterVipCities(this.value)">
          </div>
          <div class="filter-list" id="vipCityList"></div>
        </div>

        <!-- Nationality -->
        <div class="filter-group">
          <div class="filter-title">Nationality</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search nationality…" oninput="filterVipNat(this.value)">
          </div>
          <div class="filter-list" id="vipNatList"></div>
        </div>

        <!-- Age -->
        <div class="filter-group">
          <div class="filter-title">Age</div>
          <div class="range-wrap">
            <div class="range-row"><span>18</span><span class="range-vals" id="vipAgeVals">18 – 60</span><span>60</span></div>
            <div class="range-track" id="vipAgeTrack">
              <div class="range-fill" id="vipAgeFill"></div>
              <input type="range" min="18" max="60" value="18" id="vipAgeMin" oninput="updateVipRange('age')">
              <input type="range" min="18" max="60" value="60" id="vipAgeMax" oninput="updateVipRange('age')">
            </div>
          </div>
        </div>

        <!-- Weight -->
        <div class="filter-group">
          <div class="filter-title">Weight (kg)</div>
          <div class="range-wrap">
            <div class="range-row"><span>40</span><span class="range-vals" id="vipWeightVals">40 – 100</span><span>100</span></div>
            <div class="range-track" id="vipWeightTrack">
              <div class="range-fill" id="vipWeightFill"></div>
              <input type="range" min="40" max="100" value="40" id="vipWeightMin" oninput="updateVipRange('weight')">
              <input type="range" min="40" max="100" value="100" id="vipWeightMax" oninput="updateVipRange('weight')">
            </div>
          </div>
        </div>

        <!-- Height -->
        <div class="filter-group">
          <div class="filter-title">Height (cm)</div>
          <div class="range-wrap">
            <div class="range-row"><span>150</span><span class="range-vals" id="vipHeightVals">150 – 195</span><span>195</span></div>
            <div class="range-track" id="vipHeightTrack">
              <div class="range-fill" id="vipHeightFill"></div>
              <input type="range" min="150" max="195" value="150" id="vipHeightMin" oninput="updateVipRange('height')">
              <input type="range" min="150" max="195" value="195" id="vipHeightMax" oninput="updateVipRange('height')">
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="filter-group">
          <div class="filter-title">Services</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search service…" oninput="filterVipSvc(this.value)">
          </div>
          <div class="services-wrap filter-list" id="vipSvcList"></div>
        </div>

        <button class="clear-filters" onclick="clearVipFilters()">✕ Clear all filters</button>
      </div>

      <!-- GRID -->
      <div>
        <div class="filters-top-bar">
          <div class="results-count" id="vipResultsCount">Showing all VIP companions</div>
          <div class="filter-search name-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search VIP models…" oninput="filterVipByName(this.value)" id="vipNameSearch">
          </div>
          <select class="sort-select" onchange="sortVipModels(this.value)">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="age-asc">Age: Youngest first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
        <div class="models-grid-main" id="vipUnlocked"></div>
      </div>
    </div>
  </div>
</div>

${footerHTML(true)}
${modelsDataScript()}
<script>
// Kept separate from MODELS above on purpose — these are display-only
// stand-ins for the locked teaser grid (see vipTeaserPool in
// assets/vip.js) and must never surface in the general catalog or nav
// search, which both read from MODELS.
const VIP_TEASER_MODELS = ${JSON.stringify(VIP_TEASER_MODELS)};
<\/script>
<script src="/assets/main.js?v=${BUILD_TS}"><\/script>
<script src="/assets/chat.js?v=${BUILD_TS}"><\/script>
<script src="/assets/auth.js?v=${BUILD_TS}"><\/script>
<script src="/assets/vip.js?v=${BUILD_TS}"><\/script>
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
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-concierge">
${orbsHTML()}
${navHTML(true, false, true)}
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
  const eventThemes = [
    'Nine Sins', 'Mystical Night', 'The Masquerade', 'Velvet Confessional',
    'Garden of Temptation', 'Private Jet Affair — In-Flight, With Stewardesses',
  ];

  return head(
    'Paradise Erotic Events — Paradise Models',
    'Paradise Erotic Events — black tie masquerades, intimate dinners, and immersive theatrical evenings, or a fully bespoke private event built entirely around you.',
    SITE_URL + '/events/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-events">
<div style="position:fixed;inset:0;z-index:0;background:linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.8)),url('/images/events.webp?v=${BUILD_TS}') center/cover no-repeat"></div>
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:960px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>Paradise Erotic <span>Events</span></h1>
      <p>Two ways to go beyond a booking — join one of our own invite-only evenings, or commission a fully bespoke event built entirely around you.</p>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85">Paradise Erotic Events are known for black tie masquerades, intimate dinners, and immersive theatrical events created for a discerning membership. Each gathering is designed as a living work of art. Beauty, ritual, and performance come together within a framework of elegance and consent.</p>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title">The Experience</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.1rem">Paradise Erotic Events evening unfolds in layers. It begins as a refined salon and then becomes an immersive world of performance and participation. Guests arrive to candlelight and are greeted by performers in ritual attire. Music and sensual choreography lead into theatrical vignettes that explore the sacred and the profane.</p>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85">Guests may observe or participate. Etiquette guides the flow. Every action within Paradise Erotic Events must be voluntary and beautiful. Lighting, scent, costume, and choreography aim to evoke mystery, control, and transcendence.</p>
    </div>

    <div class="form-grid-2" style="margin-bottom:2.5rem">
      <div class="form-section" style="display:flex;flex-direction:column">
        <div style="width:44px;height:44px;border-radius:50%;background:rgba(217,154,168,0.14);border:1px solid rgba(217,154,168,0.35);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;flex-shrink:0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d99aa8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="form-section-title">Join Our Event</div>
        <p style="color:var(--text-soft);font-size:14px;line-height:1.75;margin-bottom:1rem">We host closed, invite-only erotic events in London, and every one has its own theme — never the same evening twice. Among them:</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.25rem">
          ${eventThemes.map(t => `<span style="display:inline-block;padding:4px 11px;border-radius:20px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:var(--text);font-size:12px">${t}</span>`).join('')}
        </div>
        <a class="submit-app-btn" style="margin-top:auto;display:inline-block;text-decoration:none;width:auto;padding:0.75rem 1.5rem;align-self:flex-start" href="${SINLIST_TG_LINK}" target="_blank" rel="noopener">Talk to Us About Upcoming Event</a>
      </div>
      <div class="form-section" style="display:flex;flex-direction:column">
        <div style="width:44px;height:44px;border-radius:50%;background:rgba(217,154,168,0.14);border:1px solid rgba(217,154,168,0.35);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;flex-shrink:0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d99aa8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <div class="form-section-title">Order Your Private Event <span style="font-weight:400;color:var(--text-muted);font-size:12px">(up to 10 people)</span></div>
        <p style="color:var(--text-soft);font-size:14px;line-height:1.75;margin-bottom:1.25rem">Share your fantasy with us. Tell us what you desire — a theme, a scenario, a role you've always wanted to play — and we will bring it to life for your company of up to 10 people. Venue, cast, wardrobe, choreography and every last detail are produced entirely around you, with the same artistry, theatrical craft and discretion as our own events.</p>
        <a class="submit-app-btn" style="margin-top:auto;display:inline-block;text-decoration:none;width:auto;padding:0.75rem 1.5rem;align-self:flex-start" href="${SINLIST_TG_LINK}" target="_blank" rel="noopener">Discuss Your Event</a>
      </div>
    </div>

    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div style="position:relative;min-height:220px;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:0.9rem;padding:2.5rem 1.75rem 1.75rem;background:linear-gradient(180deg,rgba(10,4,8,0.15),rgba(10,4,8,0.88)),url('/images/events/sinlist-hero.webp') center/cover no-repeat">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#d99aa8;font-weight:700;margin-bottom:0.5rem">An Example of Our Work</div>
          <div style="font-size:1.6rem;font-weight:700;color:#fff">The Sin List</div>
        </div>
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.75rem 1.5rem" href="/sinlist/">Explore Our Previous Event</a>
      </div>
    </div>

    <div class="form-section" style="text-align:center">
      <div style="width:44px;height:44px;border-radius:50%;background:rgba(217,154,168,0.14);border:1px solid rgba(217,154,168,0.35);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d99aa8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </div>
      <div class="form-section-title">Your Most Unforgettable Night</div>
      <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.25rem">Contact us to reserve your place at an upcoming Paradise Erotic Event, or begin planning a private evening entirely your own. One conversation is all it takes.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="${SINLIST_TG_LINK}" target="_blank" rel="noopener">Contact Event Manager</a>
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

// =================== SIN LIST — PAST EVENT PAGE ===================
function buildSinlist() {
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
  const womenOutfits = ['sinlist-women-1.webp', 'sinlist-women-2.webp', 'sinlist-women-3.webp'];
  const menOutfits = ['sinlist-men-1.webp', 'sinlist-men-2.webp', 'sinlist-men-3.webp'];
  // Full-bleed image panel with a dark tint and bottom-anchored text —
  // reused for every section below sourced from a scene photo rather than
  // a plain panel.
  const imagePanel = (img, eyebrow, title, body, minH = 260) => `
    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div style="position:relative;min-height:${minH}px;display:flex;align-items:flex-end;padding:2.5rem 1.75rem 1.75rem;background:linear-gradient(180deg,rgba(10,4,8,0.25),rgba(10,4,8,0.92)),url('/images/events/${img}') center/cover no-repeat">
        <div>
          ${eyebrow ? `<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#d99aa8;font-weight:700;margin-bottom:0.5rem">${eyebrow}</div>` : ''}
          <div style="font-size:clamp(1.3rem,3vw,1.7rem);font-weight:700;color:#fff;margin-bottom:0.6rem">${title}</div>
          <div style="color:rgba(255,255,255,0.82);font-size:14px;line-height:1.8;max-width:560px">${body}</div>
        </div>
      </div>
    </div>`;

  return head(
    'The Sin List — Opening Night | Paradise Erotic Events',
    "The Sin List — Opening Night: a private members' club we produced in London, an immersive theatrical evening structured as nine circles.",
    SITE_URL + '/sinlist/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-sinlist">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:960px">
    <a class="back-btn" href="/events/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Events
    </a>

    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div style="position:relative;min-height:300px;display:flex;align-items:flex-end;padding:2.5rem 1.75rem 1.75rem;background:linear-gradient(180deg,rgba(10,4,8,0.15),rgba(10,4,8,0.9)),url('/images/events/sinlist-hero.webp') center/cover no-repeat">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#d99aa8;font-weight:700;margin-bottom:0.5rem">An Example of Our Work</div>
          <div style="font-size:clamp(1.8rem,4vw,2.4rem);font-weight:700;color:#fff">The Sin List — Opening Night</div>
          <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:0.5rem;max-width:560px">A private members' club we produced in London — an immersive, theatrical evening exploring the architecture of desire. Secret key for your fantasies.</div>
        </div>
      </div>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0.5rem">
        ${facts.map(([l, v]) => `<div class="stat-box"><div class="stat-label">${l}</div><div class="stat-val" style="font-size:0.82rem">${v}</div></div>`).join('')}
      </div>
    </div>

    ${imagePanel('sinlist-invitation-bg.webp', 'Invitation', 'A Space For a Selected Few',
      "The Sin List unveiled a space accessible only to a selected few — a private members' club where desire became part of the experience, and inner impulses served as an entry point into personal transformation.")}

    <div class="form-section" style="margin-bottom:2.5rem;overflow:hidden">
      <div class="form-grid-2" style="align-items:center">
        <div>
          <div class="form-section-title">Concept — 9 Circles</div>
          <p style="color:var(--text-soft);font-size:14px;line-height:1.8;margin-bottom:1rem">The evening was structured as an architecture of nine states. Each space represented a distinct level of experience, inspired by the deeper nature of human desire — guests moved through a sequence of sensations, states and interactions, entering a scenario where attention was directed inward.</p>
          <p style="color:var(--text-soft);font-size:14px;line-height:1.8;margin-bottom:1rem">Structured as nine progressive circles, the night moved from observation to full participation, from tension to release. More than twenty actors and actresses built a fully theatrical environment around every guest, from a masquerade dress code through to a private, guided evening.</p>
          <p style="color:var(--text);font-style:italic;font-size:14.5px;line-height:1.8">An experience where control shifted into exploration, and restraint evolved into conscious presence.</p>
        </div>
        <div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/sinlist-concept-bg.webp" alt="The Sin List — the gate, before the nine circles" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      </div>
    </div>

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title">The Experience</div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.8;margin-bottom:1.5rem">The Sin List was an immersive environment where every detail was designed to reveal a new dimension of self. The evening unfolded progressively — from tension to release, from observation to participation — with depth of immersion as its primary instrument. More than 20 actors and actresses immersed every guest in a sensual experience of engaging with their own shadow self.</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:0.5rem">
        ${gallery.map(g => `<div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/${g.src}" alt="${g.alt}" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}
      </div>
    </div>

    ${imagePanel('sinlist-etiquette-bg.webp', 'Etiquette', 'Discretion Was a Fundamental Principle',
      "All devices remained outside the space. Within the environment: respect for personal boundaries, consent as the basis of all interaction, and conscious presence at all times. Each guest's comfort was maintained by the club's own internal team.", 300)}

    <div class="form-section" style="padding:0;overflow:hidden;margin-bottom:2.5rem">
      <div style="position:relative;min-height:220px;display:flex;align-items:flex-end;padding:2.5rem 1.75rem 1.75rem;background:linear-gradient(180deg,rgba(10,4,8,0.2),rgba(10,4,8,0.9)),url('/images/events/sinlist-dresscode-bg.webp') center/cover no-repeat">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#d99aa8;font-weight:700;margin-bottom:0.5rem">Dress Code</div>
          <div style="font-size:clamp(1.3rem,3vw,1.7rem);font-weight:700;color:#fff;margin-bottom:0.6rem">Black Tie &amp; Masquerade</div>
          <div style="color:rgba(255,255,255,0.82);font-size:14px;line-height:1.8;max-width:560px">Your look was part of the experience and directly shaped the depth of immersion.</div>
        </div>
      </div>
      <div style="padding:1.75rem">
        <div class="form-grid-2" style="margin-bottom:1.75rem">
          <div>
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--purple3);font-weight:700;margin-bottom:0.65rem">Recommended Aesthetic — Women</div>
            <ul style="margin:0;padding-left:1.1rem;color:var(--text-soft);font-size:13.5px;line-height:1.95">
              <li>Mask, worn for the full evening</li>
              <li>Materials: leather, silk, latex, metal</li>
              <li>Colours: black, grey, silver, milk, white</li>
              <li>Dark sensuality, structured sexuality, ritualistic and symbolic elements</li>
            </ul>
          </div>
          <div>
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--purple3);font-weight:700;margin-bottom:0.65rem">Recommended Aesthetic — Men</div>
            <ul style="margin:0;padding-left:1.1rem;color:var(--text-soft);font-size:13.5px;line-height:1.95">
              <li>Mask, worn for the full evening</li>
              <li>Black tie suit</li>
              <li>Colours: black</li>
            </ul>
          </div>
        </div>
        <div class="form-grid-2" style="grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:0.5rem">
          ${womenOutfits.map(w => `<div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/${w}" alt="The Sin List — recommended aesthetic for women" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}
        </div>
        <div class="form-grid-2" style="grid-template-columns:repeat(3,1fr);gap:8px">
          ${menOutfits.map(m => `<div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/${m}" alt="The Sin List — recommended aesthetic for men" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}
        </div>
      </div>
    </div>

    ${imagePanel('sinlist-compliance-bg.webp', '', 'Your appearance had to be intentional, refined, and aligned with the atmosphere of the evening.',
      'Guests who did not comply with the dress code were not admitted.', 200)}

    ${imagePanel('sinlist-access-bg.webp', 'Access', 'Entry By Invitation Only',
      'Entry was granted by personal invitation or upon approved application. Guest capacity was strictly limited, and the location was disclosed only on the day of the event.', 300)}

    <div class="form-section" style="margin-bottom:2.5rem">
      <div class="form-section-title">Access Tiers — This Event</div>
      <p style="color:var(--text-soft);font-size:13px;margin-bottom:1.25rem">The investment shown reflects this specific evening — every private event we build is scoped and priced around its own venue, cast and ambition.</p>
      <div class="form-grid-2" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${tiers.map(t => `
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);border-radius:var(--r-xs);padding:1.1rem">
          <div style="font-size:1.35rem;font-weight:700;color:#fff">${t.price}</div>
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--purple3);font-weight:700;margin:0.35rem 0 0.75rem">${t.name}</div>
          <ul style="margin:0;padding-left:1.1rem;color:var(--text-soft);font-size:13px;line-height:1.9">
            ${t.items.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>`).join('')}
      </div>
    </div>

    ${imagePanel('sinlist-details-bg.webp', 'Details', 'Date: 13 June 2026 · Location: London, UK',
      "There are places you don't talk about. Only a select few gained access — admission was granted through a strict private interview. The exact location was disclosed to confirmed guests on the day of the event.", 280)}

    <div class="form-section" style="margin-bottom:2.5rem;overflow:hidden">
      <div class="form-grid-2" style="align-items:center">
        <div>
          <div class="form-section-title">P.S. — Complete Discretion At Every Level</div>
          <ul style="margin:0 0 1.25rem;padding-left:1.1rem;color:var(--text-soft);font-size:14px;line-height:1.95">
            <li>Our guests gained access to a refined, private environment where security, comfort and confidentiality were fundamental.</li>
            <li>Each member was individually selected through a strict and considered process.</li>
            <li>Our community consisted of accomplished individuals — entrepreneurs, public figures, and recognized personalities.</li>
          </ul>
        </div>
        <div style="border-radius:var(--r-xs);overflow:hidden;aspect-ratio:3/4"><img src="/images/events/sinlist-8.webp" alt="The Sin List — a moment of surrender" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      </div>
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:0.75rem">Confidentiality was the core principle of every experience we create. All participants formally agreed to maintain absolute discretion, ensuring that no details regarding identities, attendance, or any aspect of our events, experiences, or operations were ever disclosed.</p>
      <p style="color:var(--text);font-style:italic;font-size:13.5px">June 2026, London, UK</p>
    </div>

    <div class="form-section" style="text-align:center">
      <div style="width:44px;height:44px;border-radius:50%;background:rgba(217,154,168,0.14);border:1px solid rgba(217,154,168,0.35);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d99aa8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </div>
      <div class="form-section-title">Your Most Unforgettable Night</div>
      <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.25rem">This is only one evening from our calendar — get in touch to hear about what's next, or to commission an evening entirely your own.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem" href="${SINLIST_TG_LINK}" target="_blank" rel="noopener">Message on Telegram</a>
        <a class="submit-app-btn" style="margin-top:0;display:inline-block;text-decoration:none;width:auto;padding:0.85rem 1.75rem;background:rgba(255,255,255,0.08)!important;box-shadow:none!important" href="/events/">All Events</a>
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
  const teaserModels = PUBLIC_MODELS.filter(m => m.real).slice(0, 4);

  return head(
    'High Class London Escorts | Paradise Models',
    'Paradise Models — a high-class international escort agency in London, Paris, Monaco, Milan, Dubai, New York, Miami, Zurich and Amsterdam. Verified photos, discreet service, available 24/7 from £300/h.',
    SITE_URL + '/about/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-about">
${orbsHTML()}
${navHTML(true, false, true)}
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
          <h1 style="font-size:clamp(1.7rem,4vw,2.4rem);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:0.9rem">High Class <span style="background:linear-gradient(135deg,var(--glow-light),var(--glow-mid));-webkit-background-clip:text;-webkit-text-fill-color:transparent">London Escorts</span></h1>
          <p style="color:var(--text-soft);font-size:14.5px;line-height:1.8">Introducing our exclusive gallery of high class international escorts. At Paradise Models, we have a range of busty blondes, Russian brunettes and leggy redheads eager to please the discerning gentlemen of ${CITIES.slice(0, -1).join(', ')} and ${CITIES[CITIES.length - 1]}. Whether you opt for an incall or an outcall, we have the perfect elite escort for you offering a range of services from romantic dinner dates to thrilling duo experiences. Our girls are available 24/7 from £300/h. Browse through their verified photos, selfies and videos and call us to book now!</p>
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
      <div style="border-left:3px solid var(--purple3);padding:0.25rem 0 0.25rem 1.1rem;margin-bottom:1.5rem">
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
      <div class="about-teaser-grid">
        ${teaserModels.map(m => `
        <a href="/models/${m.slug}/">
          <img src="/${m.folder}/1.webp?v=${BUILD_TS}" alt="${m.name}">
          <div class="about-teaser-name">${m.name}</div>
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
      <p style="color:var(--text-soft);font-size:14px;line-height:1.85;margin-bottom:1.25rem;text-align:left">Prefer something more exclusive? Our <a href="/vip-models/" style="color:var(--purple3)">VIP Models</a> section is a separate, closed catalog — hidden from public browsing and visible only to members who've unlocked it. Create a free account, complete a single one-time payment (no subscription, no recurring charge), and you'll have ongoing access to our VIP companions the moment it clears. Everyone else can still browse the full public gallery as usual — VIP is simply a further step in, for those who want it.</p>
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

// Shared wrapper for a long-form legal document page: title, an anchor-link
// table of contents, then the numbered sections themselves. scroll-margin-top
// on each heading keeps it clear of the fixed nav when a TOC link is clicked.
function legalDocPage({title, desc, path: urlPath, heading, intro = '', toc, sections}) {
  return head(
    `${title} | Paradise Models`,
    desc,
    SITE_URL + urlPath,
    `<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-about">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:820px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>

    <div class="form-section" style="margin-bottom:2rem">
      <h1 style="font-size:clamp(1.5rem,3.5vw,2rem);font-weight:700;color:var(--text);line-height:1.2;margin-bottom:0.75rem">${heading}</h1>
      ${intro}
      <ol style="margin:0;padding-left:1.25rem;color:var(--text-soft);font-size:14px;line-height:2">
        ${toc.map(([id, label]) => `<li><a href="#${id}" style="color:var(--purple3);text-decoration:none">${label}</a></li>`).join('\n        ')}
      </ol>
    </div>

    ${sections.map(([id, label, body]) => `
    <div class="form-section" id="${id}" style="scroll-margin-top:90px">
      <div class="form-section-title" style="font-size:1.05rem;color:var(--text);text-transform:none;letter-spacing:normal">${label}</div>
      <div style="color:var(--text-soft);font-size:14px;line-height:1.85">${body}</div>
    </div>`).join('\n')}
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

function buildTerms() {
  const toc = [
    ['introduction', 'Introduction'],
    ['copyright-notice', 'Copyright notice'],
    ['licence-to-use-website', 'Licence to use website'],
    ['acceptable-use', 'Acceptable use'],
    ['services', 'Services'],
    ['registration-and-accounts', 'Registration and accounts'],
    ['user-ids-and-passwords', 'User IDs and passwords'],
    ['cancellation-and-suspension-of-accounts', 'Cancellation and suspension of accounts'],
    ['your-content-licence', 'Your content: Licence'],
  ];
  const sections = [
    ['introduction', '1. Introduction', `
      <p style="margin-bottom:0.6rem">1.1 These terms and conditions govern your use of our website.</p>
      <p style="margin-bottom:0.6rem">1.2 By using our website, you accept these terms and conditions in full; accordingly, if you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.</p>
      <p style="margin-bottom:0.6rem">1.3 If you register with our website or make a purchase on our website, we will ask you to expressly agree to these terms and conditions.</p>
      <p style="margin-bottom:0.6rem">1.4 You must be at least 18 years of age to use our website; and by using our website or agreeing to these terms and conditions, you warrant and represent to us that you are at least 18 years of age.</p>
      <p>1.5 Our website uses cookies; by using our website or agreeing to these terms and conditions, you consent to our use of cookies in accordance with the terms of our <a href="/privacypolicy/" style="color:var(--purple3)">privacy policy</a>.</p>
    `],
    ['copyright-notice', '2. Copyright notice', `
      <p style="margin-bottom:0.6rem">2.1 Copyright (c) 2026 Paradise Models International.</p>
      <p style="margin-bottom:0.4rem">2.2 Subject to the express provisions of these terms and conditions:</p>
      <ol style="margin:0 0 0 1.25rem;padding:0;list-style-type:lower-alpha">
        <li style="margin-bottom:0.4rem">we, together with our licensors, own and control all the copyright and other intellectual property rights in our website and the material on our website; and</li>
        <li>all the copyright and other intellectual property rights in our website and the material on our website are reserved.</li>
      </ol>
    `],
    ['licence-to-use-website', '3. Licence to use website', `
      <p style="margin-bottom:0.4rem">3.1 You may:</p>
      <ol style="margin:0 0 0.6rem 1.25rem;padding:0;list-style-type:lower-alpha">
        <li style="margin-bottom:0.3rem">view pages from our website in a web browser;</li>
        <li style="margin-bottom:0.3rem">download pages from our website for caching in a web browser;</li>
        <li style="margin-bottom:0.3rem">print pages from our website for your own personal and non-commercial use, provided that such printing is not systematic or excessive; and</li>
        <li>use our booking and enquiry services on our website in accordance with these terms and conditions,</li>
      </ol>
      <p style="margin-bottom:0.6rem">subject to the other provisions of these terms and conditions.</p>
      <p style="margin-bottom:0.6rem">3.2 Except as expressly permitted by Section 3.1 or the other provisions of these terms and conditions, you must not download any material from our website or save any such material to your computer.</p>
      <p style="margin-bottom:0.6rem">3.3 You may only use our website for your own personal and business purposes, and you must not use our website for any other purposes.</p>
      <p style="margin-bottom:0.6rem">3.4 Except as expressly permitted by these terms and conditions, you must not edit or otherwise modify any material on our website.</p>
      <p style="margin-bottom:0.4rem">3.5 Unless you own or control the relevant rights in the material, you must not:</p>
      <ol style="margin:0 0 0.6rem 1.25rem;padding:0;list-style-type:lower-alpha">
        <li style="margin-bottom:0.3rem">republish material from our website (including republication on another website);</li>
        <li style="margin-bottom:0.3rem">sell, rent or sub-license material from our website;</li>
        <li style="margin-bottom:0.3rem">show any material from our website in public;</li>
        <li style="margin-bottom:0.3rem">exploit our website's material for a commercial purpose; or</li>
        <li>redistribute material from our website.</li>
      </ol>
      <p>3.6 We reserve the right to restrict access to areas of our website, or indeed our whole website, at our discretion; you must not circumvent or bypass, or attempt to circumvent or bypass, any access restriction measures on our website.</p>
    `],
    ['acceptable-use', '4. Acceptable use', `
      <p style="margin-bottom:0.6rem">4.1 You must not use our website in any way that causes, or may cause, damage to our website or impairment of the availability or accessibility of our website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
      <p style="margin-bottom:0.6rem">4.2 You must not use our website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</p>
      <p style="margin-bottom:0.6rem">4.3 You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to our website without our express written consent.</p>
      <p style="margin-bottom:0.6rem">4.4 You must not use our website to transmit or send unsolicited commercial communications.</p>
      <p style="margin-bottom:0.6rem">4.5 You must not use our website for any purposes related to marketing without our express written consent.</p>
      <p>4.6 You must ensure that all information you supply to us through our website, or in relation to our website, is true, accurate, current, complete and non-misleading.</p>
    `],
    ['services', '5. Services', `
      <p style="margin-bottom:0.6rem">5.1 Paradise Models is an introduction and companionship agency that facilitates bookings with the independent companions featured on our website (the "Services").</p>
      <p style="margin-bottom:0.6rem">5.2 All bookings made through our website, or via our telephone, Telegram or other messaging channels, are subject to availability and to these terms and conditions.</p>
      <p style="margin-bottom:0.6rem">5.3 We reserve the right to decline, cancel or amend any booking at our discretion, including where a client fails to meet our verification or safety requirements.</p>
      <p style="margin-bottom:0.6rem">5.4 Any rates, services and availability shown on our website are indicative and are confirmed at the time of booking.</p>
      <p>5.5 You agree that our website and our Services must only be used for lawful purposes, and that any arrangement made through our Services is between consenting adults.</p>
    `],
    ['registration-and-accounts', '6. Registration and accounts', `
      <p style="margin-bottom:0.6rem">6.1 In order to access certain features of our website (including our VIP Models section), you may be required to register for an account.</p>
      <p style="margin-bottom:0.6rem">6.2 You must provide accurate and complete information when registering for an account on our website, and you must keep that information up to date.</p>
      <p style="margin-bottom:0.6rem">6.3 You must not register for an account on our website if you are under 18 years of age.</p>
      <p style="margin-bottom:0.6rem">6.4 If you provide any information that is untrue, inaccurate, not current or incomplete, we reserve the right to suspend or terminate your account.</p>
      <p>6.5 You are solely responsible for maintaining the confidentiality of your account details and for any activities that occur under your account.</p>
    `],
    ['user-ids-and-passwords', '7. User IDs and passwords', `
      <p style="margin-bottom:0.6rem">7.1 If you register for an account on our website, you will be asked to choose a username and password.</p>
      <p style="margin-bottom:0.6rem">7.2 Your username must not be liable to mislead and must not be used to impersonate any other person.</p>
      <p style="margin-bottom:0.6rem">7.3 You must keep your password confidential and must not disclose it to any other person.</p>
      <p>7.4 We may disable your username and password at our sole discretion, without notice or explanation, including if you fail to comply with any of these terms and conditions.</p>
    `],
    ['cancellation-and-suspension-of-accounts', '8. Cancellation and suspension of accounts', `
      <p style="margin-bottom:0.4rem">8.1 We may, at our sole discretion and without notice or explanation, if we reasonably believe that you have breached any provision of these terms and conditions:</p>
      <ol style="margin:0 0 0.6rem 1.25rem;padding:0;list-style-type:lower-alpha">
        <li style="margin-bottom:0.3rem">suspend your account;</li>
        <li style="margin-bottom:0.3rem">restrict your access to our website; or</li>
        <li>cancel your account.</li>
      </ol>
      <p>8.2 You may cancel your account on our website at any time by contacting us using our contact details.</p>
    `],
    ['your-content-licence', '9. Your content: Licence', `
      <p style="margin-bottom:0.6rem">9.1 In these terms and conditions, "your content" means all works and materials (including without limitation text, graphics, images, audio material, video material and files) that you submit to us or our website for storage or publication on, processing by, or transmission via, our website.</p>
      <p style="margin-bottom:0.6rem">9.2 You grant to us a worldwide, irrevocable, non-exclusive, royalty-free licence to use, reproduce, store, adapt and publish your content, for the purposes of operating and promoting our website and our Services.</p>
      <p style="margin-bottom:0.6rem">9.3 You warrant and represent that your content will comply with these terms and conditions.</p>
      <p>9.4 We reserve the right, without notice or liability to you, to remove your content from our website, or otherwise cease publishing it, at any time.</p>
    `],
  ];
  return legalDocPage({
    title: 'Terms and Conditions',
    desc: 'Terms and conditions for using the Paradise Models website and booking our companionship services.',
    path: '/terms/',
    heading: 'Terms and Conditions',
    toc,
    sections,
  });
}

function buildPrivacy() {
  const toc = [
    ['intro', 'Intro'],
    ['definitions', 'Definitions'],
    ['types-of-data-collected', 'Types of Data Collected'],
    ['disclosure-of-data', 'Disclosure of Data'],
    ['payments', 'Payments'],
    ['links-to-other-sites', 'Links to Other Sites'],
    ['childrens-privacy', "Children's Privacy"],
    ['changes-to-this-privacy-policy', 'Changes to This Privacy Policy'],
    ['contact-us', 'Contact Us'],
  ];
  const sections = [
    ['intro', '1. Intro', `
      <p style="margin-bottom:0.6rem"><strong>Effective date:</strong> September 1, 2026</p>
      <p style="margin-bottom:0.6rem">Paradise Models International ("us", "we", or "our") operates the <a href="https://www.paradisemodels.com" style="color:var(--purple3)">www.paradisemodels.com</a> website (hereinafter referred to as the "Service").</p>
      <p style="margin-bottom:0.6rem">This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
      <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our <a href="/terms/" style="color:var(--purple3)">Terms and Conditions</a>, accessible from <a href="https://www.paradisemodels.com" style="color:var(--purple3)">www.paradisemodels.com</a>.</p>
    `],
    ['definitions', '2. Definitions', `
      <p style="margin-bottom:0.3rem"><strong>Service</strong></p>
      <p style="margin-bottom:0.8rem">Service is the <a href="https://www.paradisemodels.com" style="color:var(--purple3)">www.paradisemodels.com</a> website operated by Paradise Models International.</p>
      <p style="margin-bottom:0.3rem"><strong>Personal Data</strong></p>
      <p style="margin-bottom:0.8rem">Personal Data means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession).</p>
      <p style="margin-bottom:0.3rem"><strong>Usage Data</strong></p>
      <p style="margin-bottom:0.8rem">Usage Data is data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
      <p style="margin-bottom:0.3rem"><strong>Cookies</strong></p>
      <p style="margin-bottom:0.8rem">Cookies are small files stored on your device (computer or mobile device).</p>
      <p style="margin-bottom:0.3rem"><strong>Data Controller</strong></p>
      <p style="margin-bottom:0.8rem">Data Controller means the natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal information are, or are to be, processed. For the purpose of this Privacy Policy, we are a Data Controller of your Personal Data.</p>
      <p style="margin-bottom:0.3rem"><strong>Data Processors (or Service Providers)</strong></p>
      <p style="margin-bottom:0.8rem">Data Processor (or Service Provider) means any natural or legal person who processes the data on behalf of the Data Controller. We may use the services of various Service Providers in order to process your data more effectively.</p>
      <p style="margin-bottom:0.3rem"><strong>Data Subject (or User)</strong></p>
      <p style="margin-bottom:0.8rem">Data Subject is any living individual who is using our Service and is the subject of Personal Data.</p>
      <p style="margin-bottom:0.3rem"><strong>Information Collection and Use</strong></p>
      <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
    `],
    ['types-of-data-collected', '3. Types of Data Collected', `
      <p style="margin-bottom:0.3rem"><strong>Personal Data</strong></p>
      <p style="margin-bottom:0.8rem">While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
      <ul style="margin:0 0 0.8rem 1.25rem;padding:0">
        <li>Email address</li>
        <li>First name and last name</li>
        <li>Phone number</li>
      </ul>
      <p style="margin-bottom:0.3rem"><strong>Cookies and Usage Data</strong></p>
      <p style="margin-bottom:0.8rem">We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or the instructions provided in any email we send.</p>
      <p style="margin-bottom:0.3rem"><strong>Usage Data</strong></p>
      <p style="margin-bottom:0.8rem">We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
      <p style="margin-bottom:0.3rem"><strong>Tracking &amp; Cookies Data</strong></p>
      <p style="margin-bottom:0.6rem">We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information.</p>
      <p style="margin-bottom:0.6rem">Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used, such as beacons, tags and scripts, to collect and track information and to improve and analyse our Service.</p>
      <p style="margin-bottom:0.6rem">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
      <p style="margin-bottom:0.3rem">Examples of Cookies we use:</p>
      <ul style="margin:0 0 1rem 1.25rem;padding:0">
        <li style="margin-bottom:0.3rem"><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
        <li style="margin-bottom:0.3rem"><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
        <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
      </ul>
      <p style="margin-bottom:0.3rem"><strong>Use of Data</strong></p>
      <p style="margin-bottom:0.4rem">Paradise Models International uses the collected data for various purposes:</p>
      <ul style="margin:0 0 0.8rem 1.25rem;padding:0">
        <li style="margin-bottom:0.2rem">To provide and maintain our Service</li>
        <li style="margin-bottom:0.2rem">To notify you about changes to our Service</li>
        <li style="margin-bottom:0.2rem">To allow you to participate in interactive features of our Service when you choose to do so</li>
        <li style="margin-bottom:0.2rem">To provide customer support</li>
        <li style="margin-bottom:0.2rem">To gather analysis or valuable information so that we can improve our Service</li>
        <li style="margin-bottom:0.2rem">To monitor the usage of our Service</li>
        <li style="margin-bottom:0.2rem">To detect, prevent and address technical issues</li>
        <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about, unless you have opted not to receive such information</li>
      </ul>
      <p style="margin-bottom:0.3rem"><strong>Legal Basis for Processing Personal Data under the General Data Protection Regulation (GDPR)</strong></p>
      <p style="margin-bottom:0.6rem">If you are from the European Economic Area (EEA), Paradise Models International's legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Data we collect and the specific context in which we collect it.</p>
      <p style="margin-bottom:0.4rem">Paradise Models International may process your Personal Data because:</p>
      <ul style="margin:0 0 0.8rem 1.25rem;padding:0">
        <li style="margin-bottom:0.2rem">We need to perform a contract with you</li>
        <li style="margin-bottom:0.2rem">You have given us permission to do so</li>
        <li style="margin-bottom:0.2rem">The processing is in our legitimate interests and it is not overridden by your rights</li>
        <li style="margin-bottom:0.2rem">For payment processing purposes</li>
        <li>To comply with the law</li>
      </ul>
      <p style="margin-bottom:0.3rem"><strong>Retention of Data</strong></p>
      <p style="margin-bottom:0.6rem">Paradise Models International will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes and enforce our legal agreements and policies.</p>
      <p style="margin-bottom:0.6rem">Paradise Models International will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer periods.</p>
      <p style="margin-bottom:0.3rem"><strong>Transfer of Data</strong></p>
      <p style="margin-bottom:0.6rem">Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
      <p style="margin-bottom:0.6rem">If you are located outside the United Kingdom and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United Kingdom and process it there.</p>
      <p style="margin-bottom:0.6rem">Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
      <p>Paradise Models International will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy, and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place, including the security of your data and other personal information.</p>
    `],
    ['disclosure-of-data', '4. Disclosure of Data', `
      <p style="margin-bottom:0.3rem"><strong>Business Transaction</strong></p>
      <p style="margin-bottom:0.8rem">If Paradise Models International is involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
      <p style="margin-bottom:0.3rem"><strong>Disclosure for Law Enforcement</strong></p>
      <p style="margin-bottom:0.8rem">Under certain circumstances, Paradise Models International may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
      <p style="margin-bottom:0.3rem"><strong>Legal Requirements</strong></p>
      <p style="margin-bottom:0.4rem">Paradise Models International may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
      <ul style="margin:0 0 0.8rem 1.25rem;padding:0">
        <li style="margin-bottom:0.2rem">Comply with a legal obligation</li>
        <li style="margin-bottom:0.2rem">Protect and defend the rights or property of Paradise Models International</li>
        <li style="margin-bottom:0.2rem">Prevent or investigate possible wrongdoing in connection with the Service</li>
        <li style="margin-bottom:0.2rem">Protect the personal safety of users of the Service or the public</li>
        <li>Protect against legal liability</li>
      </ul>
      <p style="margin-bottom:0.3rem"><strong>Security of Data</strong></p>
      <p style="margin-bottom:0.8rem">The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
      <p style="margin-bottom:0.3rem"><strong>Our Policy on "Do Not Track" Signals under the California Online Protection Act (CalOPPA)</strong></p>
      <p style="margin-bottom:0.6rem">We do not support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked.</p>
      <p style="margin-bottom:0.8rem">You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.</p>
      <p style="margin-bottom:0.3rem"><strong>Your Data Protection Rights under the General Data Protection Regulation (GDPR)</strong></p>
      <p style="margin-bottom:0.6rem">If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Paradise Models International aims to take reasonable steps to allow you to correct, amend, delete or limit the use of your Personal Data.</p>
      <p style="margin-bottom:0.6rem">If you wish to be informed about what Personal Data we hold about you, and if you want it to be removed from our systems, please contact us.</p>
      <p style="margin-bottom:0.4rem">In certain circumstances, you have the following data protection rights:</p>
      <ul style="margin:0 0 0.8rem 1.25rem;padding:0">
        <li style="margin-bottom:0.3rem">The right to access, update or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.</li>
        <li style="margin-bottom:0.3rem">The right of rectification. You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
        <li style="margin-bottom:0.3rem">The right to object. You have the right to object to our processing of your Personal Data.</li>
        <li style="margin-bottom:0.3rem">The right of restriction. You have the right to request that we restrict the processing of your personal information.</li>
        <li style="margin-bottom:0.3rem">The right to data portability. You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format.</li>
        <li>The right to withdraw consent. You also have the right to withdraw your consent at any time where Paradise Models International relied on your consent to process your personal information.</li>
      </ul>
      <p style="margin-bottom:0.6rem">Please note that we may ask you to verify your identity before responding to such requests.</p>
      <p style="margin-bottom:0.6rem">You have the right to complain to a Data Protection Authority about our collection and use of your Personal Data. For more information, please contact your local data protection authority in the European Economic Area (EEA).</p>
      <p style="margin-bottom:0.3rem"><strong>Service Providers</strong></p>
      <p style="margin-bottom:0.6rem">We may employ third party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analysing how our Service is used.</p>
      <p style="margin-bottom:0.8rem">These third parties have access to your Personal Data only to perform these tasks on our behalf, and are obligated not to disclose or use it for any other purpose.</p>
      <p style="margin-bottom:0.3rem"><strong>Analytics</strong></p>
      <p style="margin-bottom:0.6rem">We may use third-party Service Providers to monitor and analyse the use of our Service.</p>
      <p style="margin-bottom:0.3rem"><strong>Google Analytics</strong></p>
      <p style="margin-bottom:0.6rem">Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service.</p>
      <p style="margin-bottom:0.6rem">This data is shared with other Google services. Google may use the collected data to contextualise and personalise the ads of its own advertising network.</p>
      <p style="margin-bottom:0.6rem">You can opt out of having your activity on the Service made available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js and dc.js) from sharing information with Google Analytics about visit activity.</p>
      <p>For more information on the privacy practices of Google, please visit the Google Privacy &amp; Terms web page: <a href="https://policies.google.com/privacy" style="color:var(--purple3)" target="_blank" rel="noopener">policies.google.com/privacy</a>.</p>
    `],
    ['payments', '5. Payments', `
      <p style="margin-bottom:0.6rem">We may provide paid products and/or services within the Service. In that case, we use third-party services for payment processing (e.g. payment processors).</p>
      <p style="margin-bottom:0.6rem">We will not store or collect your payment card details. That information is provided directly to our third-party payment processors, whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.</p>
      <p style="margin-bottom:0.3rem">The payment processors we work with are:</p>
      <p>Stripe: their Privacy Policy can be viewed at <a href="https://stripe.com/privacy" style="color:var(--purple3)" target="_blank" rel="noopener">stripe.com/privacy</a>.</p>
    `],
    ['links-to-other-sites', '6. Links to Other Sites', `
      <p style="margin-bottom:0.6rem">Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
      <p>We have no control over, and assume no responsibility for, the content, privacy policies or practices of any third party sites or services.</p>
    `],
    ['childrens-privacy', "7. Children's Privacy", `
      <p style="margin-bottom:0.6rem">Our Service does not address anyone under the age of 18 ("Children").</p>
      <p>We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
    `],
    ['changes-to-this-privacy-policy', '8. Changes to This Privacy Policy', `
      <p style="margin-bottom:0.6rem">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      <p style="margin-bottom:0.6rem">We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective, and update the "effective date" at the top of this Privacy Policy.</p>
      <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
    `],
    ['contact-us', '9. Contact Us', `
      <p style="margin-bottom:0.4rem">If you have any questions about this Privacy Policy, please contact us:</p>
      <ul style="margin:0;padding-left:1.25rem">
        <li style="margin-bottom:0.3rem">By email: <a href="mailto:paradisemodels.world@gmail.com" style="color:var(--purple3)">paradisemodels.world@gmail.com</a></li>
        <li style="margin-bottom:0.3rem">By visiting this page on our website: <a href="https://www.paradisemodels.com/privacypolicy" style="color:var(--purple3)">www.paradisemodels.com/privacypolicy</a></li>
        <li>By Telegram: <a href="https://t.me/paradisemodelslondon" style="color:var(--purple3)" target="_blank" rel="noopener">t.me/paradisemodelslondon</a></li>
      </ul>
    `],
  ];
  return legalDocPage({
    title: 'Privacy Policy',
    desc: "Paradise Models' privacy policy — how we collect, use and protect your personal data.",
    path: '/privacypolicy/',
    heading: 'Privacy Policy',
    toc,
    sections,
  });
}

// Day is used both as a bare number (list date column) and inside a long
// form ("17 August, 2026" on the article page itself), so split it out
// once here rather than re-deriving it in two places.
function formatBlogDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return {
    day: String(d.getUTCDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', {month: 'short', timeZone: 'UTC'}).toUpperCase(),
    monthLong: d.toLocaleString('en-US', {month: 'long', timeZone: 'UTC'}),
    year: d.getUTCFullYear(),
  };
}

function buildBlog() {
  const posts = BLOG_POSTS.filter(p => p.published).sort((a, b) => new Date(b.date) - new Date(a.date));

  return head(
    'Blog — Paradise Models',
    'The Paradise Models blog — insights, city guides and news from the world of high-class companionship.',
    SITE_URL + '/blog/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-blog">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:900px">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>The <span>Blog</span></h1>
      <p>Insights, city guides, and news from the world of high-class companionship.</p>
    </div>

    ${posts.length ? `<div class="blog-list">
      ${posts.map(p => {
        const {day, month, year} = formatBlogDate(p.date);
        return `
        <article class="blog-card">
          <a class="blog-card-img" href="/blog/${p.slug}/" aria-label="${p.title}" style="background-image:url('/images/blog/${p.image}')"></a>
          <div class="blog-card-body">
            <a href="/blog/${p.slug}/" style="text-decoration:none;color:inherit"><h2 class="blog-card-title">${p.title}</h2></a>
            <div class="blog-card-meta">
              <div class="blog-date">
                <div class="blog-date-day">${day}</div>
                <div class="blog-date-my">${month}<br>${year}</div>
              </div>
              <p class="blog-card-excerpt">${p.excerpt}</p>
            </div>
            <a class="blog-read-more" href="/blog/${p.slug}/">Read More →</a>
          </div>
        </article>`;
      }).join('')}
    </div>` : `<div class="form-section" style="text-align:center"><p style="color:var(--text-muted);margin:0">Coming soon.</p></div>`}
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

// vip:true-style split: an unpublished post still gets a real page (so
// links to it from a published article resolve), just a lightweight
// "coming soon" notice instead of its real body, and never listed on
// /blog/ or the sitemap — see BLOG_POSTS' own comment in data/blog.js.
function buildBlogPost(post) {
  if (!post.published || !post.sections) {
    return head(
      `${post.title} — Paradise Models Blog`,
      'This article is coming soon to the Paradise Models blog.',
      `${SITE_URL}/blog/${post.slug}/`,
      `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
      '#1a1e42'
    ) + `
<body class="page-blog-post">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:760px;text-align:center;min-height:50vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
    <a class="back-btn" href="/blog/" style="position:absolute;top:90px;left:2rem">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Blog
    </a>
    <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:700;margin-bottom:1rem">${post.title}</h1>
    <p style="color:var(--text-muted);font-size:1rem">Coming soon.</p>
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

  const {day, monthLong, year} = formatBlogDate(post.date);

  return head(
    `${post.title} — Paradise Models Blog`,
    post.excerpt,
    `${SITE_URL}/blog/${post.slug}/`,
    `<meta property="og:image" content="${SITE_URL}/images/blog/${post.image}">
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-blog-post">
${orbsHTML()}
${navHTML(true, false, true)}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page" style="max-width:760px">
    <a class="back-btn" href="/blog/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Blog
    </a>

    <div class="blog-post-hero" style="background-image:url('/images/blog/${post.image}')"></div>

    <h1 class="blog-post-title">${post.title}</h1>
    <div class="blog-post-date">${day} ${monthLong}, ${year}</div>

    <div class="blog-post-body">
      ${post.intro.map(p => `<p>${p}</p>`).join('')}

      <div class="blog-toc">
        <div class="blog-toc-title">Contents</div>
        <ul>
          ${post.sections.map(s => `<li><a href="#${s.id}">${s.heading}</a></li>`).join('')}
        </ul>
      </div>

      ${post.sections.map(s => `<h2 id="${s.id}">${s.heading}</h2>
      ${s.paragraphs.map(p => `<p>${p}</p>`).join('\n      ')}`).join('\n\n      ')}
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

function buildAccount() {
  return head(
    'My Account — Paradise Models',
    'Sign in to your Paradise Models account to manage VIP catalog access.',
    SITE_URL + '/account/',
    `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/home-theme.css?v=${BUILD_TS}">`,
    '#1a1e42'
  ) + `
<body class="page-account">
${orbsHTML()}
${navHTML(true, false, true)}
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
        <div style="font-size:1.3rem;font-weight:800;color:var(--purple3);margin-bottom:0.6rem">Check your email</div>
        <p style="color:var(--text-soft);font-size:14px;margin:0">We've sent a confirmation link to your inbox — click it, then come back here and sign in.</p>
      </div>
    </div>

    <!-- Signed in -->
    <div id="acctDashboard" class="form-section" style="display:none">
      <div class="form-section-title">Signed In</div>
      <p style="margin-bottom:1.25rem">Signed in as <strong id="acctEmailDisplay"></strong></p>
      <div id="acctVipStatus" style="min-height:60px;padding:1rem;border-radius:0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);margin-bottom:1.25rem;display:flex;align-items:center;justify-content:center;text-align:center"></div>
      <a id="acctVipBtn" class="submit-app-btn" href="/vip-models/" style="margin-top:0;margin-bottom:0.75rem;display:block;text-align:center;text-decoration:none;background:rgba(255,255,255,0.08)!important;box-shadow:none!important">View VIP Models</a>
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
    {url: '/sinlist/', priority: '0.6'},
    {url: '/about/', priority: '0.7'},
    {url: '/terms/', priority: '0.3'},
    {url: '/privacypolicy/', priority: '0.3'},
    {url: '/blog/', priority: '0.7'},
    {url: '/account/', priority: '0.4'},
    {url: '/faq/', priority: '0.7'},
    {url: '/become-a-model/', priority: '0.6'},
    // vip:true models don't get a sitemap entry — nothing should advertise
    // that their URL exists to crawlers ahead of a visitor unlocking it.
    ...PUBLIC_MODELS.filter(m => m.real).map(m => ({url: `/models/${m.slug}/`, priority: '0.8'})),
    // Same idea for unpublished blog posts — the page exists so links to
    // it from a published post work, but it's not indexed until real
    // content is written in and published:true is set.
    ...BLOG_POSTS.filter(p => p.published).map(p => ({url: `/blog/${p.slug}/`, priority: '0.6'})),
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
write(path.join(OUT, 'sinlist/index.html'), buildSinlist());
write(path.join(OUT, 'about/index.html'), buildAbout());
write(path.join(OUT, 'terms/index.html'), buildTerms());
write(path.join(OUT, 'privacypolicy/index.html'), buildPrivacy());
write(path.join(OUT, 'blog/index.html'), buildBlog());
BLOG_POSTS.forEach(p => {
  write(path.join(OUT, `blog/${p.slug}/index.html`), buildBlogPost(p));
});
write(path.join(OUT, 'account/index.html'), buildAccount());
write(path.join(OUT, 'sitemap.xml'), buildSitemap());
write(path.join(OUT, 'robots.txt'), buildRobots());

console.log('\nBuild complete!');
