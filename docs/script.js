const products = [
  { name: 'Farm Series 15 HP', model: 'VSP-2/6011', price: '₹3,500', img: 'farm-15hp.jpg',
    desc: 'Fully automatic 15 HP submersible motor starter with digital volt and ampere display and auto/manual mode.' },
  { name: 'Farm Series 10 HP', model: 'VSP-2/4011', price: '₹3,000', img: 'farm-10hp.jpg',
    desc: 'Fully automatic 10 HP submersible motor starter with digital volt and ampere display and auto/manual mode.' },
  { name: 'Home Series 5 HP', model: 'CAP-5/4011', price: '₹3,500', img: 'home-5hp.jpg',
    desc: 'Fully automatic 5 HP submersible motor starter with digital volt and ampere display.' },
  { name: 'Home Series 3 HP', model: 'RTS-9/KT40', price: '₹1,800', img: 'home-3hp.jpg',
    desc: 'Single phase 3 HP submersible motor starter with analog voltmeter and ammeter.' },
  { name: 'Home Series 2 HP', model: 'RTS-8/KT40', price: '₹1,500', img: 'home-2hp.jpg',
    desc: 'Single phase 2 HP submersible motor starter with ammeter and indicator.' },
  { name: 'Home Series 1 HP', model: 'RTS-7/T30A', price: '₹800', img: 'home-1hp-rts7.jpg',
    desc: 'Single phase 1 HP submersible motor starter with voltmeter and ammeter.' },
  { name: 'Home Series 1 HP Compact', model: 'STS-3/S30A', price: '₹600', img: 'home-1hp-sts3.jpg',
    desc: 'Compact, economical 1 HP submersible motor starter for household water pumps.' },
  { name: 'Sensor Series 1 HP', model: 'FTS-9/T30A', price: '₹2,000', img: 'sensor-1hp.jpg',
    desc: 'Automatic 1 HP starter with water level sensors that start the pump when the tank is empty and stop it when full.' },
  { name: 'Chaff Cutter Starter', model: 'CTS-4/KT40', price: '₹700', img: 'chaff-cutter.jpg',
    desc: 'Motor starter for chaff cutter machines, suitable for 1 to 3 HP motors.' },
  { name: 'Solar Plant Installation', price: '₹7 / watt', img: 'solar.jpeg',
    desc: 'Solar power plants for business, home loads or any power equipment, at low cost with great performance.' },
  { name: 'Electricity Saver Device', price: 'Contact us for pricing', img: 'saver.jpg',
    desc: 'Reduces electricity bills and extends equipment life in homes, schools, hospitals and offices.' },
  { name: 'Electric Scooter', price: 'Contact us for pricing', img: 'scooter.jpeg',
    desc: 'Eco-friendly, rider-friendly vehicle, ideal for moving around a campus or across town.' },
  { name: 'Training Session', price: 'Contact us for pricing', img: 'training.jpg',
    desc: 'Hands-on training for school students in basic electronics, mechanical and electrical projects.' },
];

const cards = document.getElementById('products');
const select = document.getElementById('product-select');
select.innerHTML = '<option value="">Select a product</option>';
products.forEach(p => {
  cards.insertAdjacentHTML('beforeend', `
    <article class="card">
      <img src="images/${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <h3>${p.name}</h3>${p.model ? `<span class="model notranslate">Model No: ${p.model}</span>` : ''}<span class="price">${p.price}</span><p>${p.desc}</p>
        <a href="#contact" class="btn buy" data-product="${p.model ? `${p.name} (${p.model})` : p.name}">Buy Now</a>
      </div>
    </article>`);
  select.add(new Option(p.model ? `${p.name} (${p.model})` : p.name, p.model ? `${p.name} (${p.model})` : p.name));
});
select.add(new Option('Other / General enquiry', 'Other'));

// Buy Now: preselect the product in the contact form
cards.addEventListener('click', e => {
  const btn = e.target.closest('.buy');
  if (!btn) return;
  select.value = btn.dataset.product;
  setTimeout(() => document.querySelector('#order-form [name=name]').focus({ preventScroll: true }), 500);
});

// Close mobile menu after navigating
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

// Hero slider
const slides = document.querySelectorAll('#slider img');
let i = 0;
setInterval(() => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); }, 3500);

// Order form -> Web3Forms (free; emails each order to the address the access key was created with)
// Get a key at https://web3forms.com using ifed102017@gmail.com, then paste it here.
const WEB3FORMS_KEY = 'c0cc7179-3b64-4943-ad09-938d47f9466e';
const form = document.getElementById('order-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.disabled = true; status.className = ''; status.textContent = 'Sending…';
  try {
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, access_key: WEB3FORMS_KEY, replyto: data.email,
        subject: `New order: ${data.product} – ${data.name}`, from_name: 'Indian Farmer Electronics Device Website' }),
    });
    const out = await res.json();
    if (!out.success) throw new Error(out.message || 'Failed');
    status.className = 'ok'; status.textContent = 'Thank you! We will contact you shortly.';
    form.reset();
  } catch (err) {
    status.className = 'err'; status.textContent = 'Could not send. Please call +91 84749 99040.';
  } finally { btn.disabled = false; }
});

// Settings panel
const settings = document.getElementById('settings');
const settingsBtn = document.getElementById('settings-btn');
settingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = settings.classList.toggle('open');
  settingsBtn.setAttribute('aria-expanded', open);
  document.body.classList.remove('menu-open');
});
document.addEventListener('click', e => {
  if (!settings.contains(e.target)) { settings.classList.remove('open'); settingsBtn.setAttribute('aria-expanded', false); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') settings.classList.remove('open'); });

// Theme: light / dark / system
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const getTheme = () => { try { return localStorage.getItem('theme') || 'system'; } catch (e) { return 'system'; } };
function applyTheme(choice) {
  const dark = choice === 'dark' || (choice === 'system' && darkQuery.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelectorAll('#theme-switch button').forEach(b => b.classList.toggle('active', b.dataset.theme === choice));
}
document.getElementById('theme-switch').addEventListener('click', e => {
  const choice = e.target.dataset.theme;
  if (!choice) return;
  try { localStorage.setItem('theme', choice); } catch (err) {}
  applyTheme(choice);
});
darkQuery.addEventListener('change', () => { if (getTheme() === 'system') applyTheme('system'); });
applyTheme(getTheme());

document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- Language ----------
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: k => { try { localStorage.removeItem(k); } catch (e) {} },
};
const langName = code => (LANGUAGES.find(l => l[0] === code) || LANGUAGES[0])[1];

function setLanguage(code) {
  store.set('lang', code);
  document.getElementById('sub-language').textContent = langName(code);
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `googtrans=; path=/; ${expire}`;
  document.cookie = `googtrans=; path=/; domain=${location.hostname}; ${expire}`;
  if (code === 'en') {
    // Google can't "translate" back to the source language, so reload the original page
    if (/translated-(ltr|rtl)/.test(document.documentElement.className)) location.reload();
    return;
  }
  document.cookie = `googtrans=/en/${code}; path=/`;
  const combo = document.querySelector('.goog-te-combo');
  if (combo) { combo.value = code; combo.dispatchEvent(new Event('change')); }
}

// Searchable language list: type to filter, or scroll and click
function mountPicker(root, onPick) {
  root.classList.add('notranslate');
  root.innerHTML = '<input type="search" class="lang-search" placeholder="Type a language, e.g. Hindi" aria-label="Search languages">' +
    '<ul class="lang-list" role="listbox"></ul>';
  const input = root.querySelector('input');
  const list = root.querySelector('ul');
  let selected = store.get('lang') || 'en';
  function render() {
    const q = input.value.trim().toLowerCase();
    const items = LANGUAGES.filter(([c, en, nat]) => !q || en.toLowerCase().includes(q) || nat.toLowerCase().includes(q) || c.toLowerCase() === q);
    list.innerHTML = items.length
      ? items.map(([c, en, nat]) => `<li role="option" tabindex="-1" data-code="${c}" aria-selected="${c === selected}">
          <span>${en}</span>${nat !== en ? `<small>${nat}</small>` : ''}</li>`).join('')
      : '<li class="empty">No language found</li>';
  }
  function pick(code) { selected = code; render(); onPick(code); }
  input.addEventListener('input', render);
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const first = list.querySelector('[data-code]');
    if (first) { pick(first.dataset.code); input.value = ''; render(); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('[data-code]'); if (li) pick(li.dataset.code); });
  render();
  return { refresh: () => { selected = store.get('lang') || 'en'; render(); } };
}

let settingsPicker;
const welcomePicker = mountPicker(document.getElementById('welcome-lang'), code => { setLanguage(code); settingsPicker.refresh(); });
settingsPicker = mountPicker(document.getElementById('settings-lang'), code => { setLanguage(code); welcomePicker.refresh(); });

// ---------- Welcome (first visit: choose language) ----------
document.getElementById('lang-next').addEventListener('click', () => {
  store.set('welcomeDone', '1');
  document.documentElement.classList.remove('show-welcome');
});

// ---------- Settings pages: Theme and Language ----------
function openPage(name) {
  settings.querySelectorAll('.s-page').forEach(pg => { pg.hidden = pg.dataset.page !== name; });
  settings.scrollTop = 0;
}
settings.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  if (open) return openPage(open.dataset.open);
  if (e.target.closest('[data-back]')) openPage('menu');
});
settingsBtn.addEventListener('click', () => openPage('menu'));
document.getElementById('sub-language').textContent = langName(store.get('lang') || 'en');
