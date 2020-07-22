const express = require("express");
const routes = express.Router();

const sessionControllers = require("../../app/controllers/admin/sessionControllers");
const sessionValidators = require("../../app/validators/session");

routes
  .get("/login", sessionControllers.loginForm)
  .post("/login", sessionValidators.login, sessionControllers.login)
  .post('/logout', sessionControllers.logout)

// reset-password;
  .get('/forgot-password', sessionControllers.forgotForm)
  .get('/password-reset', sessionControllers.resetForm)
  .post('/forgot-password', sessionValidators.forgot, sessionControllers.forgot)
  .post('/password-reset', sessionValidators.resetPassword, sessionControllers.resetPassword);

module.exports = routes;
