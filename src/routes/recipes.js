const express = require("express");
const routes = express.Router();

const Recipes = require('../app/controllers/recipes');
const multer = require("../app/middlewares/multer");

/* RECIPES */
routes.get("/", Recipes.index); //rota para as receitas

routes.get("/create", Recipes.createForm);
routes.get("/:id", Recipes.show);
routes.get("/:id/edit", Recipes.edit);

routes.post("/", multer.array("photos", 6), Recipes.create);
routes.put("/", multer.array("photos", 6), Recipes.put);
routes.delete("/", Recipes.delete);

// routes.get("/gerenciar", Recipes.configRecipes);

module.exports = routes;
