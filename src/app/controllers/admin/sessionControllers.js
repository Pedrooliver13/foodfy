const { imageName } = require("../../../lib/utils");

//models
const User = require("../../models/usersModels");
const File = require("../../models/files");

// dependencias;
const mailer = require("../../../lib/mailer");
const crypto = require("crypto");
const { hash } = require("bcryptjs");

module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  async login(req, res) {
    const { user } = req;

    async function getImage(userId) {
      let results = await File.find(userId);

      const files = results.rows.map((file) => imageName(req, file.path));

      return files[0];
    }

    if (user.file_id) {
      user.img = await getImage(user.file_id);
      req.session.imageProfile = user.img;
    }

    req.session.userId = user.id;

    return res.redirect(`/admin/users/profile?success=Bem vindo ${user.name}`);
  },
  async logout(req, res) {
    req.session.destroy();

    return res.redirect("/login");
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },
  async forgot(req, res) {
    const { user } = req;

    try {
      // criar o token;
      const token = crypto.randomBytes(20).toString("hex");

      // tempo limite do token;
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-replay@foodfy.com",
        subject: "Recuperação de senha",
        html: `
        <h2>Esqueceu a senha?</h2>
        <div>
          <p>Não se preocupe , clique no link para recuperar sua senha</p>
          <a href="http://localhost:3000/password-reset?token=${token}"  target="_blank">Recuperar senha</a>
        </div>
      `,
      });

      return res.render("session/forgot-password", {
        token,
        success: "E-mail Enviado com sucesso",
      });
    } catch (err) {
      console.error(err);
    }
  },
  resetForm(req, res) {
    return res.render("session/reset-password", { token: req.query.token });
  },
  async resetPassword(req, res) {
    const { user } = req;
    const { password } = req.body;

    try {
      // vamos passar uma nova senha;
      const newPassword = await hash(password, 8);

      // vamos atualizar e zerar o token;
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      });

      return res.render("session/login", {
        success: "Senha atualizada com sucesso",
      });
    } catch (err) {
      console.log(err);

      return res.render("session/reset-password", {
        error: "Aconteceu algum erro.",
      });
    }
  },
};
