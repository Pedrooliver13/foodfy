const Chefs = require("../../models/users"); // por enquanto vamos pegar dessa tabela ,  mas vamos criar outra que, vai ter login;
const File = require("../../models/files");

module.exports = {
  async index(req, res) {
    try {
      let results,
        offset,
        { page, limit, filter } = req.query;

      page = page || 1;
      limit = limit || 6;
      offset = limit * (page - 1);

      const params = { filter, limit, offset };

      results = await Chefs.paginate(params);
      const chefs = results.rows;

      async function getImage(chefId) {
        let results = await File.find(chefId);
        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public",
              ""
            )}`
        );

        return files[0];
      }

      const files = results.rows.map(async (chef) => {
        chef.img = await getImage(chef.file_id);

        return files;
      });

      await Promise.all(files);

      if (chefs.length > 0) {
        const pagination = {
          page,
          total: Math.ceil(chefs[0].total_chefs / limit),
        };

        return res.render("public/chefs/index", { chefs, files, pagination });
      } else {
        return res.render("public/chefs/index");
      }
    } catch (error) {
      console.error(error);
    }
  },
  async show(req, res) {
    try {
      let results = await Chefs.find(req.params.id);
      const chef = results.rows[0];

      // getImage
      async function getImage(chefId, recipeId) {
        let results;

        chefId
          ? (results = await File.find(chefId))
          : (results = await File.findRecipe(recipeId));

        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public",
              ""
            )}`
        );

        return files[0];
      }

      // fileChef
      let files = results.rows.map(async (chef) => {
        chef.img = await getImage(chef.file_id);

        return chef;
      });

      // getRecipes
      results = await Chefs.findRecipesChef(chef.id);
      const recipes = results.rows;

      const recipePromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(null, recipe.id);

        return recipe;
      });

      await Promise.all(recipePromise);
      await Promise.all(files);

      return res.render("public/chefs/show", { chef, files, recipes });
    } catch (error) {
      console.log(error);
    }
  },
};
