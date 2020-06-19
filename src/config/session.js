const session = require('express-session');
const pgSimple = require('connect-pg-simple')(session);

const db = require('./db');

module.exports = session({
  store: new pgSimple({
    pool: db
  }),
  secret: "helloWord",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
});