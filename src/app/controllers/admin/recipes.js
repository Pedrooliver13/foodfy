const Recipes = require("../../models/recipes");
const User = require('../../models/usersModels');
const File = require("../../models/files");

module.exports = {
  async configRecipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    let params = { filter, page, limit, offset };

    let results = await Recipes.pagination(params);
    const recipes = results.rows;

    if (recipes.length != 0) {
      const pagination = {
        page,
        total: Math.ceil(recipes[0].total / limit),
      };

      return res.render("admin/recipes/gerenciar", {
        recipes,
        filter,
        pagination,
      });
    }

    return res.render("admin/recipes/gerenciar");
  },
  async createForm(req, res) {
    return res.render("admin/recipes/create");
  },
  async post(req, res) {
    const { userId } = req.session;
    let { title, ingredients, preparation, create_at } = req.body;

    const keys = Object.keys({
      user_id: userId,
      title,
      ingredients,
      preparation,
      create_at,
    });

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all fields");
    }

    if (req.files.length == 0) return res.send("não está enviando");
    // retuning id;
    let results = await Recipes.post(req.body, userId);
    const recipeId = results.rows[0].id;

    const filePromises = req.files.map((file) => File.create(file)); // returning id;
    const files = await Promise.all(filePromises);

    files.forEach((file) =>
      File.CreateRecipeFiles({
        recipe_id: recipeId,
        file_id: file.rows[0].id,
      })
    );

    return res.redirect("/");
  },
  async edit(req, res) {
    let results = await Recipes.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Product is not found");

    const chefs = await User.index();
    
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

    return res.render("admin/recipes/edit", { chefs, recipe, files });
  },
  async put(req, res) {
    const { userId} = req.session;
    let { title, ingredients, preparation, create_at } = req.body;

    const keys = Object.keys({
      userId,
      title,
      ingredients,
      preparation,
      create_at,
    });

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files")
        return res.send("Please, fill all fields");
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map((file) => File.create(file));
      const files = await Promise.all(newFilesPromise);

      files.forEach((file) =>
        File.CreateRecipeFiles({
          recipe_id: req.body.id,
          file_id: file.rows[0].id,
        })
      );
    }

    //removendo virgula
    if (req.body.removed_files) {
      let removeFiles = req.body.removed_files.split(","); // [ 1, 2, 3, ]
      const lastIndex = removeFiles.length - 1;
      removeFiles.splice(lastIndex, 1);

      if (removeFiles) {
        const removeFilesPromise = removeFiles.map((id) =>
          File.deleteRecipe(id)
        );
        await Promise.all(removeFilesPromise);
      }
    }

    let files = req.files.map((file) => File.put(file));

    await Promise.all(files);
    await Recipes.update(req.body);

    return res.redirect("/");
  },
  async delete(req, res) {
    Recipes.delete(req.body.id);

    return res.redirect("/?success=Receita deletada com sucesso.");
  },
};
