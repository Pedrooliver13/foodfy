const { imageName } = require("../../../lib/utils");

const User = require("../../models/usersModels");
const File = require("../../models/files");

const {hash} = require('bcryptjs');
const mailer = require('../../../lib/mailer');

module.exports = {
  create(req, res) {
    return res.render("admin/users/create");
  },
  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      // enviar o email com a senha do usuário;
      let defaultPassword = "123";
      const password = await hash('123', 8);


      await mailer.sendMail({
        to: req.body.email,
        from: "no-replay@foodfy.com",
        subject: "Acesso ao sistema",
        html: `
        <h2>Seja bem vindo ao foodfy</h2>
        <div>
          <p>Não se preocupe, sua senha já foi criada. OBS: Você pode mudar quando quiser; </p>
          <p>Senha: ${defaultPassword} </p>

          <a href="http://localhost:3000/login" target="_blank">Entrar na conta</a>
        </div>
      `,
      })

      // salvando imagens;
      if (req.files != '') {
        let results = req.files.map((file) => File.create(file));
        const files = await Promise.all(results);

        files.map(async (file) => {
          const user = await User.create({
            email,
            password,
            name,
            is_admin
          }, file.rows[0].id);

          req.session.userId = user;
        });

        return res.redirect("/users?success=conta criada com sucesso");
      }

      const user = await User.create({
        email,
        name,
        password,
        is_admin
      });
      req.session.userId = user;

      return res.redirect("/users?success=conta criada com sucesso");

    } catch (err) {
      console.error(err);

      return res.render("public/chefs/index", {
        error: "Aconteceu algum erro",
      });
    }
  },
  async show(req, res) {
    const { user, files } = req;

    if (!user)
      return res.render("admin/session/login", {
        error: "Não encontramos o usúario",
      });

    return res.render("public/users/edit", { user, files });
  },
  async edit(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({ where: { id } });
      const results = await File.find(user.file_id);

      const files = results.rows.map((file) => ({
        ...file,
        src: imageName(req, file.path),
      }));
      await Promise.all(files);

      return res.render("admin/users/edit", { user, files });
    } catch (err) {
      console.error(err);

      return res.render("admin/users/edit", { error: "Aconteceu algo errado" });
    }
  },
  async update(req, res) {
    try {
      const { name, id } = req.body;
      const fields = { name, id };

      if (req.files.length != 0) {
        const newFilePromise = req.files.map((file) => File.create(file));
        let files = await Promise.all(newFilePromise);

        files = files.map(async (file) => {
          fields.file_id = file.rows[0].id;

          return await User.update(id, fields);
        });
      }

      await User.update(id, fields);

      return res.redirect("/users?success=Conta Atualizada com sucesso");
    } catch (error) {
      console.error(error);
    }

    // não esqueça do enctype no form , pq sem ele não vai encontrar o req.files;
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id);

      return res.redirect('/?success=Conta deletada com successo"');
    } catch (error) {
      console.error(error);
    }
  },
};
