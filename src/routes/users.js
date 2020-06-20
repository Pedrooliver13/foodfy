const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const sessionControllers = require('../app/controllers/sessionControllers');

const Chefs = require('../app/controllers/users');
const userValidators = require('../app/validators/users');


// sessionControllers;
routes.get('/login', sessionControllers.loginForm);
routes.post('/login', sessionControllers.login);
// routes.post('/logout');

// // reset-password;
// routes.get('/forgot-password');
// routes.get('/password-reset');
// routes.post('/forgot-password');
// routes.post('/password-reset');

/* CHEF */
routes.get("/", Chefs.index);
routes.get("/create", userValidators.create, Chefs.createForm);
routes.get("/:id", Chefs.show);
routes.get("/:id/edit", Chefs.edit);


routes.post("/", multer.array("photos", 1), Chefs.create);
routes.put("/", multer.array("photos", 1), Chefs.update);
routes.delete("/", Chefs.delete);

// routes.get("/gerenciar", GerenciarControllers.chefs);


module.exports = routes;