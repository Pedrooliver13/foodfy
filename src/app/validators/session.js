const { compare } = require("bcryptjs");
const User = require("../models/usersModels");

async function isLogged(req, res, next) {
  if(req.session.userId) 
   return res.redirect('/admin/users/profile?error=Você já está logado.');

  next();
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user)
    return res.render("session/login", {
      error: "Usuario não existe",
      user: req.body,
    });

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render("session/login", {
      error: "Senha incorreta",
      user: req.body,
    });

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.render("session/forgot-password", {
        error: "Esse usúario não existe",
      });

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

async function resetPassword(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.render("session/reset-password", {
        user: req.body,
        token,
        error: "Não encontramos o usúario.",
      });

    if (password != passwordRepeat)
      return res.render("session/reset-password", {
        user: req.body,
        token,
        error: "Senha e repetir senha estão incorretas.",
      });

    // vamos verificar se tem o token;
    if (token != user.reset_token)
      return res.render("session/reset-password", {
        user: req.body,
        error: "Token inválido. Tente pedir outro token",
        token,
      });

    //ver se já expirou
    let now = new Date();
    now = now.getHours();

    if (now > user.reset_token_expires)
      return res.render("session/reset-password", {
        user: req.body,
        error: "Token expirado. Tente pedir outro token",
        token,
      });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  isLogged,
  login,
  forgot,
  resetPassword,
};
