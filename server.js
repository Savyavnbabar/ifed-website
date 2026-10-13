require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

app.post('/api/order', async (req, res) => {
  const { name, email, phone, product, message } = req.body || {};
  if (!name || !phone || !product || !/^\S+@\S+\.\S+$/.test(email || '')) {
    return res.status(400).json({ error: 'Please fill in name, a valid email, phone and product.' });
  }
  try {
    await transporter.sendMail({
      from: `"Indian Farmer Electronics Device Website" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `New order: ${product} – ${name}`,
      html: `<h2>New order / enquiry</h2>
        <p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone)}<br>
        <b>Product:</b> ${esc(product)}</p><p><b>Message:</b><br>${esc(message).replace(/\n/g, '<br>')}</p>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Could not send email.' });
  }
});

// ---------- Accounts (stored in data/users.json, passwords hashed with scrypt) ----------
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const loadUsers = () => { try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return []; } };
const saveUsers = users => {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};
const hashPassword = (pw, salt = crypto.randomBytes(16).toString('hex')) =>
  `${salt}:${crypto.scryptSync(pw, salt, 64).toString('hex')}`;
const checkPassword = (pw, stored) => {
  const [salt, hash] = stored.split(':');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), crypto.scryptSync(pw, salt, 64));
};
const publicUser = ({ name, email, phone, language }) => ({ name, email, phone, language });

app.post('/api/register', (req, res) => {
  const { name, phone, password, language } = req.body || {};
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please fill in name, a valid email and phone.' });
  if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  const users = loadUsers();
  if (users.some(u => u.email === email)) return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
  const user = { name: String(name).trim().slice(0, 80), email, phone: String(phone).trim().slice(0, 15),
    language: String(language || 'en').slice(0, 10), passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  res.status(201).json({ user: publicUser(user) });
});

app.post('/api/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const user = loadUsers().find(u => u.email === email);
  if (!user || !checkPassword(String(req.body?.password || ''), user.passwordHash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  res.json({ user: publicUser(user) });
});

app.put('/api/account', (req, res) => {
  const b = req.body || {};
  const email = String(b.email || '').trim().toLowerCase();
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user || !checkPassword(String(b.currentPassword || ''), user.passwordHash)) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }
  const newEmail = String(b.newEmail || '').trim().toLowerCase();
  if (!b.name || !b.phone || !/^\S+@\S+\.\S+$/.test(newEmail)) return res.status(400).json({ error: 'Please fill in name, a valid email and phone.' });
  if (newEmail !== email && users.some(u => u.email === newEmail)) return res.status(409).json({ error: 'That email is already used by another account.' });
  if (b.newPassword) {
    if (typeof b.newPassword !== 'string' || b.newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    user.passwordHash = hashPassword(b.newPassword);
  }
  Object.assign(user, { name: String(b.name).trim().slice(0, 80), email: newEmail, phone: String(b.phone).trim().slice(0, 15),
    language: String(b.language || user.language).slice(0, 10), updatedAt: new Date().toISOString() });
  saveUsers(users);
  res.json({ user: publicUser(user) });
});

const PORT =process.env.PORT || 4000;
app.listen(PORT, () => console.log(`IFED site running at http://localhost:${PORT}`));
