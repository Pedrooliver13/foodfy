const express = require("express");
const multer = require("./src/app/middlewares/multer");
const routes = express.Router();

const AboutControllers = require('./src/app/controllers/aboutControllers');
const HomeControllers = require("./src/app/controllers/homeControllers");
const GerenciarControllers = require('./src/app/controllers/gerenciarControllers');
const Recipes = require("./src/app/controllers/Recipes");
const Chefs = require("./src/app/controllers/chefs");

/* HOME */
routes.get('/', (req, res)=> res.redirect('/home'));
routes.get("/home", HomeControllers.index);

/* RECIPES */
routes.get("/recipes", Recipes.index); //rota para as receitas
routes.get("/recipes/:id", Recipes.show);


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

routes.post("/chefs", multer.array("photos", 1), Chefs.post);
routes.put("/chefs", multer.array("photos", 1), Chefs.put);
routes.delete("/chefs", Chefs.delete);

/* ABOUT */
routes.get("/sobre", AboutControllers.index);


/* GERENCIAR */
routes.get("/admin/chefs/gerenciar", GerenciarControllers.chefs);
routes.get("/admin/recipes/gerenciar", Recipes.configRecipes);


module.exports = routes;
