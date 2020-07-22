const { userId, imageName } = require("../../lib/utils");
const { compare } = require('bcryptjs');

const User = require("../models/usersModels");
const File = require("../models/files");

function checkAllFields(fields) {
  const keys = Object.keys(fields);

  for (key of keys) {
    if (fields[key] == "")
      return {
        user: fields,
        error: "Por favor, preencha todos os campos",
      };
  }
}

async function index(req, res, next) {
  try {
    const user = await userId(req.session); // usuario logado;
    const chefs = await User.index(); // pega todos os  chefs;

    async function getImage(chefId) {
      const results = await getImage(chefId);

      const files = results.map((file) => imageName(req, file.path));

      return files[0];
    }

    if (user) user.img = await getImage(user.file_id);

    const files = chefs.map(async (chef) => {
      chef.img = await getImage(chef.file_id);

      return files;
    });

    await Promise.all(files);

    next();
  } catch (error) {
    console.error(error);
  }
}

async function create(req, res, next) {
  const { name, email, password } = req.body;
  
  const AllFillFields = checkAllFields({name, email, password});
  if (AllFillFields) return res.render("admin/users/create", AllFillFields);

  const user = await User.findOne({ where: { email } });

  if (user)
    return res.render("admin/users/create", {
      error: "Usúario já existente",
    });

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: { id } });

  if (!user)
    return res.render("session/login", {
      error: "Usúario não encontrado",
    });

  const results = await File.find(user.file_id);
  const files = results.rows.map((file) => ({
    ...file,
    src: imageName(req, file.path),
  }));

  await Promise.all(files);

  req.files = files;
  req.user = user;

  next();
}

async function update(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const AllFillFields = checkAllFields({name, email, password});
    if (AllFillFields) return res.render("admin/users/create", AllFillFields);

    const user = await userId(req.session);

    if(!user) return res.render('session/login', {
      error: "Faça Login para acessar essa página."
    });

    const passed = await compare(password, user.password);
    
    if(!passed) return res.render('admin/users/create', {error: "Senha incorreta"});
    
    if (req.files.length > 1) return res.send("Envie no máximo uma imagem");

    if (req.body.removed_files) {
      let removedFiles = req.body.removed_files.split(","); // [1, 2, 3,]
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      if (removedFiles) {
        const removedFilesPromise = removedFiles.map((file) =>
          File.deleteChefs(file)
        );
        await Promise.all(removedFilesPromise);
      }
    }

    if (req.files.length != 0) {
      const newFilePromise = req.files.map((file) => File.create(file));
      let files = await Promise.all(newFilePromise);

      files = files.map((file) =>
        User.update({ id:user.id, fileId: file.rows[0].id })
      );
      await Promise.all(files);
    }
    
    
    
    
    // atualizar imagem
    if (req.body.removed_files) {
      let removedFiles = req.body.removed_files.split(","); // [1, 2, 3,]
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      if (removedFiles) {
        const removedFilesPromise = removedFiles.map((file) =>
          File.deleteChefs(file)
        );
        await Promise.all(removedFilesPromise);
      }
    }

    next();
  } catch (err) {
    console.error(err);

    return res.render('')
  }
}

module.exports = {
  index,
  show,
  update,
  create,
};
