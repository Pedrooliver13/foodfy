const { userId } = require("../../lib/utils");

async function onlyAdmin(req, res, next) {
  const user = await userId(req.session);
 
  if (!user.is_admin)
    return res.render("public/users/edit", {
      error: "Você tem de ser admin para acessar essa página.",
      user,
    });

  next();
}

async function onlyUsers(req, res, next) {
  if (!req.session.userId)
    return res.render("session/login", {
      error: "Por favor, faça login antes de acessar essa página",
    });

  next();
}

module.exports = {
  onlyUsers,
  onlyAdmin,
};
