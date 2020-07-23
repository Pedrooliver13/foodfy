const express = require("express");
const routes = express.Router();

const UserControllers = require("../../app/controllers/admin/usersControllers");
const UserValidator = require("../../app/validators/users");

// middlewares;
const multer = require("../../app/middlewares/multer");
const isAdminValidator = require('../../app/validators/isAdmin');

routes
  .get("/create", [isAdminValidator.onlyUsers, isAdminValidator.onlyAdmin],UserControllers.create)

  .get("/profile", UserValidator.show, UserControllers.show)

  .post("/", [multer.array('photos', 6), UserValidator.create], UserControllers.post)

  .get("/:id/edit", [isAdminValidator.onlyUsers, isAdminValidator.onlyAdmin ], UserControllers.edit)

  .put("/profile",[multer.array('photos', 6), UserValidator.update],  UserControllers.update)

  .delete("/profile", UserControllers.delete);

module.exports = routes;
