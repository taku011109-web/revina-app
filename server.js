const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const LOGIN_EMAIL    = process.env.LOGIN_EMAIL    || 'taku01.1109@gmail.com';
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || 'revina0404';
const SESSION_SECRET = process.env.SESSION_SECRET || 'revina-secret-2024';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

function requireAuth(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/login');
}

app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.use(requireAuth, express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`ReViNa running on port ${PORT}`));
