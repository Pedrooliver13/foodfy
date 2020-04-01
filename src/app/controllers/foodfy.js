const Recipes = require("../models/recipes");

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        let pagination = {
          page,
          total: Math.ceil(recipes[0].total / limit)
        };

        return res.render("site/recipes/index", {
          recipes,
          filter,
          pagination
        });
      }
    };
    Recipes.pagination(params);
  },
  recipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        let pagination = {
          page,
          total: Math.ceil(recipes[0].total / limit)
        };
        return res.render("site/recipes/recipes", {
          recipes,
          filter,
          pagination
        });
      }
    };
    Recipes.pagination(params);
  },
  about(req, res) {
    return res.render("site/recipes/sobre");
  },
  configRecipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        const pagination = {
          page,
          total: Math.ceil(recipes[0].total / limit)
        };

        return res.render("admin/recipes/gerenciar", {
          recipes,
          filter,
          pagination
        });
      }
    };
    Recipes.pagination(params);
  },
  create(req, res) {
    Recipes.ChefsSelectOptions(options => {
      return res.render("admin/recipes/create", { chefs: options });
    });
  },
  post(req, res) {
    Recipes.create(req.body, () => {
      return res.redirect("/home");
    });
  },
  show(req, res) {
    Recipes.find(req.params.id, recipe => {
      if (!recipe) {
        return res.send("recipe is not found");
      }

      return res.render("site/recipes/show", { recipe });
    });
  },
  edit(req, res) {
    Recipes.find(req.params.id, recipe => {
      if (!recipe) {
        return res.send("Recipe is not Found");
      }
      Recipes.ChefsSelectOptions(options => {
        return res.render("admin/recipes/edit", { recipe, chefs: options });
      });
    });
  },
  put(req, res) {
    Recipes.update(req.body, () => {
      return res.redirect("/home");
    });
  },
  delete(req, res) {
    Recipes.delete(req.body.id, () => {
      return res.redirect("/home");
    });
  }
};
