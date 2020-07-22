const { userId } = require("../../../lib/utils");

const Recipes = require("../../models/recipes");
const File = require("../../models/files");

module.exports = {
  async index(req, res) {
    try {
      let { recipes } = req;
      let { pagination, filter } = req.getPages;

      if (recipes)
        return res.render("public/recipes/index", {
          recipes,
          filter,
          pagination,
        });

      return res.render("public/recipes/index", {
        error: "Não encontramos nenhuma receita",
      });
    } catch (err) {
      console.error(err);

      return res.render("public/home/index", {
        error: "Aconteceu algum erro. tente novamente mais tarde",
      });
    }
  },
  async show(req, res) {
    let results = await Recipes.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.redirect({ error: "Não encontrado" }, "/");

    results = await File.findRecipe(recipe.id);
    let files = results.rows;

    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));
    await Promise.all(files);

    return res.render("public/recipes/show", { recipe, files });
  },
};
