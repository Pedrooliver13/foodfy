const { userId } = require("../../lib/utils");

const User = require("../models/usersModels");
const Recipes = require("../models/recipes");

async function yourRecipe(req, res, next) {
  const { id } = req.params;
  const user = await userId(req.session);

  const recipes = await Recipes.find(id);

  if(user.id != recipes.rows[0].user_id) {
    if (!user.is_admin) return res.redirect("/?error=Deu ruim");
  }

  next()
}

async function onlyAdmin(req, res, next) {
   const user = userId(req.session);

  if (!user.is_admin) return res.redirect("/?error=Deu ruim");


  next();
}

async function onlyUsers(req, res, next) {
  const { id } = req.params;

  if (!req.session.userId)
    return res.render("session/login", {
      error: "Por favor, faça login antes de acessar essa página",
    });

  // para quando não for admin, pode editar suas proprias infos;
  if (req.session.userId == id) {
    return res.redirect("/admin/users/profile");
  }

  next();
}

module.exports = {
  onlyUsers,
  onlyAdmin,
  yourRecipe
};
