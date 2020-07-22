const express = require("express");
const routes = express.Router();

// controllers
const HomeControllers = require("../../app/controllers/public/homeControllers");

// home
routes.get("/", HomeControllers.index);

// about
routes.get("/sobre", (req, res) => res.render("public/about/index"));

module.exports = routes;
