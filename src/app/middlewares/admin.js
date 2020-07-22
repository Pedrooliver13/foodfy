function adminMiddleware(req, res, next) {
  if (!req.session || !req.session.is_admin)
    return res.redirect('/', {
      error: "Você tem de estar logado para conseguir acessar essa página",
    });

  next();
}

module.exports = adminMiddleware;