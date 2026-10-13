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

// Form submit
const form = document.getElementById('order-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.disabled = true; status.className = ''; status.textContent = 'Sending…';
  try {
    const res = await fetch('/api/order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    status.className = 'ok'; status.textContent = 'Thank you! We will contact you shortly.';
    form.reset(); applyUser();
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

// ---------- Welcome & account ----------
const welcome = document.getElementById('welcome');
const authStatus = welcome.querySelector('.auth-status');
function showStep(n) {
  welcome.querySelectorAll('[data-step]').forEach(s => { s.hidden = s.dataset.step !== String(n); });
  welcome.querySelectorAll('[data-step-dot]').forEach(d => d.classList.toggle('active', +d.dataset.stepDot <= n));
}
document.getElementById('lang-next').addEventListener('click', () => showStep(2));
document.getElementById('back-to-lang').addEventListener('click', () => showStep(1));

welcome.querySelector('.tabs').addEventListener('click', e => {
  const tab = e.target.dataset.tab;
  if (!tab) return;
  welcome.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('register-form').hidden = tab !== 'register';
  document.getElementById('login-form').hidden = tab !== 'login';
  authStatus.textContent = '';
});

function finishWelcome(user) {
  store.set('welcomeDone', '1');
  if (user) store.set('user', JSON.stringify(user));
  document.documentElement.classList.remove('show-welcome');
  applyUser();
}
document.getElementById('guest-btn').addEventListener('click', () => finishWelcome(null));

async function submitAuth(form, url, extra) {
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (data.confirm !== undefined && data.confirm !== data.password) {
    authStatus.className = 'auth-status err'; authStatus.textContent = 'Passwords do not match.'; return;
  }
  const btn = form.querySelector('button');
  btn.disabled = true; authStatus.className = 'auth-status'; authStatus.textContent = 'Please wait…';
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, ...extra }) });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Something went wrong.');
    if (out.user.language && out.user.language !== store.get('lang')) setLanguage(out.user.language);
    authStatus.textContent = '';
    form.reset();
    finishWelcome(out.user);
  } catch (err) {
    authStatus.className = 'auth-status err'; authStatus.textContent = err.message;
  } finally { btn.disabled = false; }
}
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault(); submitAuth(e.target, '/api/register', { language: store.get('lang') || 'en' });
});
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault(); submitAuth(e.target, '/api/login', {});
});

// Show the signed-in user in Settings and prefill the order form
function applyUser() {
  const user = currentUser();
  settings.classList.toggle('signed-in', !!user);
  document.getElementById('sub-account').textContent = user ? user.name : 'Not signed in';
  if (!user) return;
  ['name', 'email', 'phone'].forEach(k => { const f = form.elements[k]; if (f && !f.value) f.value = user[k] || ''; });
}

// Settings pages: menu with Account, Password, Theme, Language
function currentUser() { try { return JSON.parse(store.get('user')); } catch (e) { return null; } }
function openPage(name) {
  settings.querySelectorAll('.s-page').forEach(pg => { pg.hidden = pg.dataset.page !== name; });
  settings.querySelectorAll('.auth-status').forEach(st => { st.textContent = ''; });
  const user = currentUser();
  if (name === 'account' && user) {
    const f = document.getElementById('account-form');
    f.elements.name.value = user.name || ''; f.elements.newEmail.value = user.email || ''; f.elements.phone.value = user.phone || '';
  }
  settings.scrollTop = 0;
}
settings.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  if (open) return openPage(open.dataset.open);
  if (e.target.closest('[data-back]')) return openPage('menu');
  if (e.target.closest('[data-signin]')) {
    settings.classList.remove('open');
    showStep(2); document.documentElement.classList.add('show-welcome');
  }
});
settingsBtn.addEventListener('click', () => openPage('menu'));

async function saveAccount(f, body, okMsg) {
  const st = f.querySelector('.auth-status');
  const btn = f.querySelector('button[type=submit]');
  btn.disabled = true; st.className = 'auth-status'; st.textContent = 'Saving…';
  try {
    const res = await fetch('/api/account', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Could not save changes.');
    store.set('user', JSON.stringify(out.user));
    ['name', 'email', 'phone'].forEach(k => { form.elements[k].value = out.user[k] || ''; });
    applyUser();
    f.querySelectorAll('.pw-wrap input').forEach(i => { i.value = ''; });
    st.className = 'auth-status ok'; st.textContent = okMsg;
  } catch (err) {
    st.className = 'auth-status err'; st.textContent = err.message;
  } finally { btn.disabled = false; }
}
document.getElementById('account-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, user = currentUser();
  if (!f.reportValidity() || !user) return;
  saveAccount(f, { ...Object.fromEntries(new FormData(f)), email: user.email, language: store.get('lang') || 'en' }, 'Changes saved.');
});
document.getElementById('password-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, user = currentUser();
  if (!f.reportValidity() || !user) return;
  const d = Object.fromEntries(new FormData(f));
  if (d.newPassword !== d.confirm) {
    const st = f.querySelector('.auth-status'); st.className = 'auth-status err'; st.textContent = 'New passwords do not match.'; return;
  }
  saveAccount(f, { email: user.email, newEmail: user.email, name: user.name, phone: user.phone,
    currentPassword: d.currentPassword, newPassword: d.newPassword, language: store.get('lang') || 'en' }, 'Password updated.');
});

// Show / hide toggle on every password field
document.querySelectorAll('input[type=password]').forEach(input => {
  const wrap = document.createElement('span');
  wrap.className = 'pw-wrap';
  input.replaceWith(wrap); wrap.append(input);
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'pw-toggle'; btn.textContent = 'Show';
  btn.setAttribute('aria-label', 'Show password');
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  wrap.append(btn);
});

document.getElementById('sign-out').addEventListener('click', () => {
  store.del('user'); store.del('welcomeDone');
  form.reset(); settings.classList.remove('open');
  showStep(1); document.documentElement.classList.add('show-welcome');
  applyUser();
});
applyUser();
document.getElementById('sub-language').textContent = langName(store.get('lang') || 'en');
