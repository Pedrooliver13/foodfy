function checkAllFields(fields) {
  const keys = Object.keys(fields);

  for(key of keys) {
    if (req.body[key] == '') return res.render('session/login', {
      error: "Por favor, preencha todos os campos"
    });
  }
}

async function login(req, res, next) { 
  const allFillFields = checkAllFields(req.body);
  if (allFillFields) return res.render('session/login', allFillFields);
  
  // comparar o req.body, com os os usúarios


  next();
}

module.exports = {
  login
}