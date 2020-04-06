const Chefs = require("../models/chefs");
const File = require("../models/files");

module.exports = {
  async index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 8;

    let offset = limit * (page - 1);

    const params = { filter, page, limit, offset };

    let results = await Chefs.paginate(params);
    const chefs = results.rows;

    const pagination = {
      page,
      total_chefs: Math.ceil(chefs[0].total_chefs / limit),
    };

    return res.render("site/chefs/index", { chefs, pagination, filter });
  },
  async config(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 8;

    let offset = limit * (page - 1);

    const params = { filter, page, limit, offset };

    let results = await Chefs.paginate(params);
    const chefs = results.rows;

    const pagination = {
      page,
      total_chefs: Math.ceil(chefs[0].total_chefs / limit),
    };

    return res.render("admin/chefs/gerenciar", { chefs, pagination, filter });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    const { name, avatar_url, created_at } = req.body;
    const keys = Object.keys({ name, avatar_url, created_at });

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all fields");
    }

    let results = req.files.map((file) => File.create(file));
    const files = await Promise.all(results);

    files.forEach((file) =>
      Chefs.create({
        ...req.body,
        fileId: file.rows[0].id,
      })
    );

    return res.redirect("/chefs");
  },
  async show(req, res) {
    let results = await Chefs.find(req.params.id);
    const chef = results.rows[0];

    if (!chef) return res.send("Chefs is not found");

    results = await Chefs.findRecipesChef(chef.id);
    let recipes = results.rows;

    results = await File.find(chef.file_id);
    let files = results.rows;

    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));
    await Promise.all(files);

    return res.render("site/chefs/show", { chef, recipes, files });
  },
  async edit(req, res) {
    let results = await Chefs.find(req.params.id);
    const chef = results.rows[0];

    if (!chef) return res.send("Chef not found");

    results = await File.find(chef.file_id);
    let files = results.rows;

    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    })) 
    await Promise.all(files);

    return res.render("admin/chefs/edit", { chef, files });
  },
  async put(req, res) {
    const { name } = req.body;
    const keys = Object.keys({ name });

    for (key of keys) {
      if (req.body[key] == "" && key != 'removed_files') return res.send("Please, fill all fields");
    }

    if(req.files.length > 1) return res.send('Envie no máximo uma imagem');
   
    if(req.body.removed_files){
      let removedFiles = req.body.removed_files.split(',') // [1, 2, 3,]
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      if(removedFiles){
        const removedFilesPromise = removedFiles.map(file => File.deleteChefs(file));
        await Promise.all(removedFilesPromise);
      }
    }

    if(req.files.length != 0){
      const newFilePromise = req.files.map(file => File.create(file));
      let files = await Promise.all(newFilePromise);

      files = files.map(file => Chefs.update({
        name: req.body.name,
        id: req.body.id,
        fileId: file.rows[0].id
      }))
      await Promise.all(files);
    }

    return res.redirect(`/chefs`);
  },
  delete(req, res) {
    Chefs.delete(req.body.id, () => {
      return res.redirect(`/chefs`);
    });
  },
};
