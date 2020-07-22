const express = require("express");
const routes = express.Router();

// rotas;
const routerPublic = require('./public');
const routerAdmin = require('./admin')

routes.use('/', routerPublic);
routes.use('/admin', routerAdmin);

// session;
// routes.get('/login', sessionControllers.index);

module.exports = routes;
