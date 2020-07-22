const express = require("express");
const routes = express.Router();

const recipesRouter = require("./recipesRoutes");
const userRouter = require("./userRoutes");

routes.use("/users", userRouter);
routes.use("/recipes", recipesRouter);

module.exports = routes;
