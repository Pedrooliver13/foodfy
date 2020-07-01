const User = require('../models/ProfileModels');
const { hash } = require('bcryptjs');

function checkAllFields(fields) {
  const keys = Object.keys(fields);

  for(key of keys) {
    if(req.body[key] == '') return {
      user: req.body,
      error: "Por favor, preencha todos os campos"
    };
  }
}


async function create(req, res, next) {
  const AllFillFields = checkAllFields(req.body);
  if (AllFillFields) return res.render('admin/chef/create', AllFillFields);

  let { email, password, is_admin, file_id } = req.body;

  const user = await User.post({
    email,
    password,
    is_admin,
    file_id
  });

  req.user = user;

  next();
}

module.exports = {
  create
}