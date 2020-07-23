const { imageName } = require("../../../lib/utils");

const User = require("../../models/usersModels");
const File = require("../../models/files");

/* 
 this part available to the public
*/

async function getImage(req, chefId, recipeId) {
  let results = chefId
    ? await File.find(chefId)
    : await File.findRecipe(recipeId);

  if (results) {
    const files = results.rows.map((file) => imageName(req, file.path));

    return files[0];
  }
}

module.exports = {
  async index(req, res) {
    try {
      const chefs = await User.index(); // pega todos os  chefs;

      const files = chefs.map(async (chef) => {
        chef.img = await getImage(req, chef.file_id);

        return files;
      });

      await Promise.all(files);

      return res.render("public/chefs/index", { chefs, success: req.query.success });
    } catch (error) {
      console.error(error);

      return res.render("public/home/index", { error: "Aconteceu algum erro" });
    }
  },
  async show(req, res) {
    const {success} = req.query;
    
    let results = await User.find(req.params.id);
    const chef = results.rows[0];

    const files = results.rows.map(async (chef) => {
      chef.img = await getImage(req, chef.file_id);

      return chef;
    });

    results = await User.findRecipesChef(req.params.id);
    const recipes = results.rows;

    // fileChef
    const recipePromise = recipes.map(async (recipe) => {
      recipe.img = await getImage(req, "", recipe.id);

      return recipe;
    })

    await Promise.all(recipePromise);
    await Promise.all(files);


    return res.render("public/chefs/show", { chef, files, recipes, success });
  },
};
