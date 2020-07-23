const express = require("express");
const routes = express.Router();

const Recipes = require('../../app/controllers/admin/recipes');
const multer = require("../../app/middlewares/multer");

const isAdminMiddleware = require('../../app/validators/isAdmin');

/* RECIPES */
routes.get("/create", [isAdminMiddleware.onlyUsers], Recipes.createForm);
routes.get("/:id/edit", [isAdminMiddleware.onlyUsers, isAdminMiddleware.yourRecipe], Recipes.edit);

routes.post("/", multer.array("photos", 6), Recipes.post);
routes.put("/", multer.array("photos", 6), Recipes.put);
routes.delete("/", Recipes.delete);

// routes.get("/gerenciar", Recipes.configRecipes);

module.exports = routes;
