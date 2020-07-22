const User = require('../../models/ProfileModels');

module.exports = {
  async post(req, res) {
    const user = await User.post(req.body);

    return res.redirect('/');
  },
};