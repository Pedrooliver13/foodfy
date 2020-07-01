const express = require("express");
const routes = express.Router();

const AboutControllers = require("../app/controllers/aboutControllers");
const HomeControllers = require("../app/controllers/homeControllers");

const recipes = require("./recipes");
const admin = require("./admin");
const chefs = require("./users");

/* HOME */
routes.get("/", HomeControllers.index);

// recipes
routes.use("/users", chefs);
routes.use("/admin", admin);
routes.use("/recipes", recipes);

// session;
// routes.get('/login', sessionControllers.index);

/* ABOUT */
routes.get("/sobre", AboutControllers.index);

module.exports = routes;
