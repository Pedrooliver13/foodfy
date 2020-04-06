const express = require("express");
const multer = require("./src/app/middlewares/multer");
const routes = express.Router();

const Recipes = require("./src/app/controllers/Recipes");
const Chefs = require("./src/app/controllers/chefs");

routes.get("/", (req, res) => {
  return res.redirect("/home");
});

routes.get("/home", Recipes.index);
routes.get("/recipes", Recipes.recipes); //rota para as receitas
routes.get("/recipes/:id", Recipes.show);

routes.get("/sobre", Recipes.about);
routes.get("/admin/recipes/gerenciar", Recipes.configRecipes);

routes.get("/admin/recipes/create", Recipes.create);
routes.get("/admin/recipes/:id/edit", Recipes.edit);

routes.post("/admin", multer.array("photos", 6), Recipes.post);
routes.put("/admin", multer.array("photos", 6), Recipes.put);
routes.delete("/admin", Recipes.delete);

/* CHEF */
routes.get("/chefs", Chefs.index);
routes.get("/chefs/:id", Chefs.show);
routes.get("/admin/chefs/:id/edit", Chefs.edit);

routes.get("/admin/chefs/create", Chefs.create);
routes.get("/admin/chefs/gerenciar", Chefs.config);

routes.post("/chefs", multer.array("photos", 1), Chefs.post);
routes.put("/chefs", multer.array("photos", 1), Chefs.put);
routes.delete("/chefs", Chefs.delete);

module.exports = routes;
