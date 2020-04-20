const { formatBRL } = require('../../lib/utils');

const Recipes = require('../models/recipes');
const File = require('../models/files');

module.exports = {
  async index(req, res) {
    try {
      
      let results = await Recipes.all();
      const recipes = results.rows;

      async function getImage(recipeId) {
        let results = await File.findRecipe(recipeId);
        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public",
              ""
            )}`
        );

        return files[0];
      }

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.id);

        return recipe;
      });

      let lastAdded = await Promise.all(recipesPromise);

      return res.render("site/home/index", { recipes: lastAdded });

    } catch (error) {
      console.error(error);
    }
  },
};