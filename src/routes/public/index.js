const express = require("express");
const routes = express.Router();

const HomeRouter = require('../public/homeRoutes');
const RecipeRouter = require('../public/recipesRoutes');
const UserRouter = require('../public/userRoutes');
const sessionRouter = require("../public/sessionRoutes");


routes.use(HomeRouter, RecipeRouter, UserRouter, sessionRouter);

module.exports = routes;

