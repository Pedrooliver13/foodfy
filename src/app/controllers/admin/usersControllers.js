const { imageName } = require("../../../lib/utils");

const User = require("../../models/usersModels");
const File = require("../../models/files");

module.exports = {
  create(req, res) {
    return res.render("admin/users/create");
  },
  async post(req, res) {
    try {
      // salvando imagens;
      let results = req.files.map((file) => File.create(file));
      const files = await Promise.all(results);

      files.map(async (file) => {
        const user = await User.create(req.body, file.rows[0].id);

        req.session.userId = user;
      });

      return res.redirect("/users");
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
      const { name, email, is_admin, id } = req.body;

      await User.update({ id: req.body.id, fields: {name, email, is_admin, id } });

      return res.redirect("/admin/users/profile");
    } catch (error) {
      console.error(error);
    }

    return;
    // não esqueça do enctype no form , pq sem ele não vai encontrar o req.files;
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id);

      console.log(req.body.id);

      return res.redirect('/?success="conta-deletada-com-successo"');
    } catch (error) {
      console.error(error);
    }
  },
};
