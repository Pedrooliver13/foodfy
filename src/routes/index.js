const express = require("express");
const routes = express.Router();

const AboutControllers = require('../app/controllers/aboutControllers');
const HomeControllers = require("../app/controllers/homeControllers");

const recipes = require('./recipes');
const chefs = require('./users');


/* HOME */
routes.get("/", HomeControllers.index);

// recipes 
routes.use('/recipes', recipes);
routes.use('/chefs', chefs);

// session;
// routes.get('/login', sessionControllers.index); 

/* ABOUT */
routes.get("/sobre", AboutControllers.index);



module.exports = routes;
