const { getPagination, imageName } = require("../../lib/utils");

const File = require("../models/files");
const Recipes = require("../models/recipes");

// getImage
async function getImage(req, chefId, recipeId) {
  let results = chefId
    ? await File.find(chefId)
    : await File.findRecipe(recipeId);

  if (results) {
    const files = results.rows.map((file) => imageName(req, file.path));

    return files[0];
  }
}

async function index(req, res, next) {
  let params = getPagination(req),
    results;

  results = await Recipes.pagination(params);
  const recipes = results.rows;

  if (!recipes) return res.redirect("/");

  // passando os recipes, e vamos modificar apenas os files;
  const files = recipes.map(async (recipe) => {
    recipe.img = await getImage(req, "", recipe.id);

    return recipe;
  });
  await Promise.all(files);

  if (recipes.length >= 0) {
    params.pagination = {
      page: params.page,
      total: Math.ceil(recipes[0].total / params.limit),
    };

    req.getPages = params;
  }
  
  req.recipes = results.rows;

  next();
}

module.exports = { index };
