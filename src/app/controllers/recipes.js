const Recipes = require("../models/recipes");
const File = require("../models/files");

module.exports = {
  async index(req, res) {
    let { filter, limit } = req.query;

    limit = limit || 6;
    let offset = 0;

    let params = { filter, limit, offset };

    let results = await Recipes.pagination(params);
    const recipes = results.rows;

    return res.render("site/recipes/index", { recipes, filter });
  },
  async recipes(req, res) {
    let { filter, page, limit } = req.query; // ? tudo que vem depois da interogação;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);
    const params = { filter, page, limit, offset }; // colocando tudo dentro de uma unica varialvel para mandar para o model

    let results = await Recipes.pagination(params);
    const recipes = results.rows;

    if (recipes.length != 0) {
      // para quando não houver nenhuma receita;
      const pagination = {
        page,
        total: Math.ceil(recipes[0].total / limit),
      };

      results = await File.all();
      let files = results.rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("site/recipes/recipes", {
        recipes,
        filter,
        pagination,
        files,
      });
    }

    return res.render("site/recipes/recipes");
  },
  async about(req, res) {
    return res.render("site/recipes/sobre");
  },
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
  async create(req, res) {
    let results = await Recipes.ChefsSelectOptions();
    const chefs = results.rows;

    return res.render("admin/recipes/create", { chefs });
  },
  async post(req, res) {
    let { chef_id, title, ingredients, preparation, create_at } = req.body;

    const keys = Object.keys({
      chef_id,
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
    let results = await Recipes.post(req.body);
    const recipeId = results.rows[0].id;

    const filePromises = req.files.map((file) => File.create(file)); // returning id;
    const files = await Promise.all(filePromises);

    files.forEach((file) =>
      File.CreateRecipeFiles({
        recipe_id: recipeId,
        file_id: file.rows[0].id,
      })
    );

    return res.redirect("/home");
  },
  async show(req, res) {
    let results = await Recipes.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.status(404).send("Recipe not found");

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

    return res.render("site/recipes/show", { recipe, files });
  },
  async edit(req, res) {
    let results = await Recipes.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Product is not found");

    results = await Recipes.ChefsSelectOptions();
    const chefs = results.rows;

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
    let { chef_id, title, ingredients, preparation, create_at } = req.body;

    const keys = Object.keys({
      chef_id,
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
      const newFilesPromise = req.files.map(file => File.create(file))
      const files = await Promise.all(newFilesPromise);
      
      files.forEach(file => File.CreateRecipeFiles({
        recipe_id: req.body.id,
        file_id: file.rows[0].id
      }));
    }

    //removendo virgula
    if (req.body.removed_files) {
      let removeFiles = req.body.removed_files.split(','); // [ 1, 2, 3, ]
      const lastIndex = removeFiles.length - 1;
      removeFiles.splice(lastIndex, 1);

      if (removeFiles) {
        const removeFilesPromise = removeFiles.map(id => File.deleteRecipe(id));
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

    return res.redirect("/");
  },
};
