const express = require("express");
const routes = express.Router();

const RecipesControllers = require("../../app/controllers/public/recipesControllers");
const RecipesValidators = require('../../app/validators/recipeValidators');

routes.get("/recipes", RecipesValidators.index ,RecipesControllers.index); //rota para as receitas
routes.get("/recipes/:id", RecipesControllers.show);

module.exports = routes;
