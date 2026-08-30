// =================== CATALOG PAGE ===================
let filteredModels = [...MODELS];
let activeCat = 'all';
let selectedCities = [];
let selectedNats = [];
let selectedSvcs = [];
let ageRange = [18, 60];
let weightRange = [40, 100];
let heightRange = [150, 185];

function cityToSlug(c) { return c.toLowerCase().replace(/\s+/g, '-'); }

function applyCityFromURL() {
  const q = new URLSearchParams(window.location.search).get('city');
  if (!q) return;
  const match = CITIES.find(c => cityToSlug(c) === q.toLowerCase());
  if (!match) return;
  selectedCities = [match];
  const cb = document.querySelector('#cityList input[value="' + match + '"]');
  if (cb) cb.checked = true;
}

function initModelsPage() {
  renderModelsGrid(MODELS);
  buildCityList();
  applyCityFromURL();
  buildNatList();
  buildSvcList();
  updateRange('age');
  updateRange('weight');
  updateRange('height');
  // Init range fills
  setTimeout(() => {
    ['age', 'weight', 'height'].forEach(t => {
      const fill = document.getElementById(t + 'Fill');
      if (fill) { fill.style.left = '0%'; fill.style.width = '100%'; }
    });
  }, 100);
}

function applyFilters() {
  let ms = [...MODELS];
  if (activeCat !== 'all') ms = ms.filter(m => m.cats.includes(activeCat));
  if (selectedCities.length) ms = ms.filter(m => selectedCities.includes(m.city));
  if (selectedNats.length) ms = ms.filter(m => selectedNats.includes(m.nationality));
  if (selectedSvcs.length) ms = ms.filter(m => selectedSvcs.every(s => m.svcs.includes(s)));
  ms = ms.filter(m => m.age >= ageRange[0] && m.age <= ageRange[1]);
  ms = ms.filter(m => m.weight >= weightRange[0] && m.weight <= weightRange[1]);
  ms = ms.filter(m => m.height >= heightRange[0] && m.height <= heightRange[1]);
  filteredModels = ms;
  renderModelsGrid(ms);
}

function renderModelsGrid(ms) {
  const grid = document.getElementById('modelsGrid');
  const cnt = document.getElementById('resultsCount');
  if (!grid) return;
  grid.innerHTML = ms.map(m => modelCardHTML(m, true, false)).join('');
  if (cnt) cnt.textContent = `Showing ${ms.length} companion${ms.length === 1 ? '' : 's'}`;
}

function setCat(el, cat) {
  document.querySelectorAll('#catChips .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeCat = cat;
  applyFilters();
}

function buildCityList() {
  const el = document.getElementById('cityList');
  if (!el) return;
  el.innerHTML = CITIES.map(c => `
    <label class="filter-check">
      <input type="checkbox" value="${c}" onchange="toggleCity('${c}',this.checked)"> ${c}
    </label>`).join('');
}
function filterCities(q) {
  const els = document.querySelectorAll('#cityList .filter-check');
  els.forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleCity(c, checked) {
  if (checked) selectedCities.push(c);
  else selectedCities = selectedCities.filter(x => x !== c);
  applyFilters();
}

function buildNatList() {
  const el = document.getElementById('natList');
  if (!el) return;
  el.innerHTML = NATIONALITIES.map(n => `
    <label class="filter-check">
      <input type="checkbox" value="${n}" onchange="toggleNat('${n}',this.checked)"> ${n}
    </label>`).join('');
}
function filterNat(q) {
  const els = document.querySelectorAll('#natList .filter-check');
  els.forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleNat(n, checked) {
  if (checked) selectedNats.push(n);
  else selectedNats = selectedNats.filter(x => x !== n);
  applyFilters();
}

function buildSvcList() {
  const el = document.getElementById('svcList');
  if (!el) return;
  el.innerHTML = SERVICES.map(s => `
    <label class="filter-check">
      <input type="checkbox" value="${s}" onchange="toggleSvc('${s}',this.checked)"> ${s}
    </label>`).join('');
}
function filterSvc(q) {
  const els = document.querySelectorAll('#svcList .filter-check');
  els.forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function toggleSvc(s, checked) {
  if (checked) selectedSvcs.push(s);
  else selectedSvcs = selectedSvcs.filter(x => x !== s);
  applyFilters();
}

function updateRange(type) {
  const minEl = document.getElementById(type + 'Min');
  const maxEl = document.getElementById(type + 'Max');
  if (!minEl || !maxEl) return;
  const min = +minEl.value;
  const max = +maxEl.value;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  if (type === 'age') { ageRange = [lo, hi]; const v = document.getElementById('ageVals'); if (v) v.textContent = lo + ' – ' + hi; }
  if (type === 'weight') { weightRange = [lo, hi]; const v = document.getElementById('weightVals'); if (v) v.textContent = lo + ' – ' + hi; }
  if (type === 'height') { heightRange = [lo, hi]; const v = document.getElementById('heightVals'); if (v) v.textContent = lo + ' – ' + hi; }
  const fill = document.getElementById(type + 'Fill');
  if (fill) {
    const bounds = {age: [18, 60], weight: [40, 100], height: [150, 185]}[type];
    const range = bounds[1] - bounds[0];
    const left = ((lo - bounds[0]) / range) * 100;
    const right = ((hi - bounds[0]) / range) * 100;
    fill.style.left = left + '%';
    fill.style.width = (right - left) + '%';
  }
  applyFilters();
}

// Fake (generated) models only ever have rateHour; real ones show their
// actual lowest quoted rate, which can be null (rates on request — no
// incall or outcall on file at all, e.g. Euphoria).
function catalogPrice(m) { return m.real ? startPrice(m) : m.rateHour; }

function sortModels(val) {
  let ms = [...filteredModels];
  if (val === 'price-asc' || val === 'price-desc') {
    const withPrice = ms.filter(m => catalogPrice(m) !== null);
    const withoutPrice = ms.filter(m => catalogPrice(m) === null);
    withPrice.sort((a, b) => val === 'price-asc' ? catalogPrice(a) - catalogPrice(b) : catalogPrice(b) - catalogPrice(a));
    ms = [...withPrice, ...withoutPrice];
  }
  else if (val === 'age-asc') ms.sort((a, b) => a.age - b.age);
  else if (val === 'name') ms.sort((a, b) => a.name.localeCompare(b.name));
  renderModelsGrid(ms);
}

function clearFilters() {
  activeCat = 'all'; selectedCities = []; selectedNats = []; selectedSvcs = [];
  ageRange = [18, 60]; weightRange = [40, 100]; heightRange = [150, 185];
  document.querySelectorAll('#catChips .filter-chip').forEach((c, i) => c.classList.toggle('active', i === 0));
  document.querySelectorAll('.filter-check input').forEach(cb => cb.checked = false);
  const ageMin = document.getElementById('ageMin'); if (ageMin) ageMin.value = 18;
  const ageMax = document.getElementById('ageMax'); if (ageMax) ageMax.value = 60;
  const weightMin = document.getElementById('weightMin'); if (weightMin) weightMin.value = 40;
  const weightMax = document.getElementById('weightMax'); if (weightMax) weightMax.value = 100;
  const heightMin = document.getElementById('heightMin'); if (heightMin) heightMin.value = 150;
  const heightMax = document.getElementById('heightMax'); if (heightMax) heightMax.value = 185;
  ['age', 'weight', 'height'].forEach(t => updateRange(t));
  applyFilters();
}
