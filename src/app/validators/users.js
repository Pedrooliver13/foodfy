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

  next();
}

module.exports = {
  create
}