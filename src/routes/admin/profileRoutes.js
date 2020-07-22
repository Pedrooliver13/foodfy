const express = require('express');
const routes  = express.Router();

routes.get('/profile', (req, res) => res.send('Tá Funcionando'));

module.exports = routes;