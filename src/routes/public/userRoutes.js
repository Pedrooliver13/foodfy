const express = require('express');
const routes = express.Router();

const UserControllers = require('../../app/controllers/public/usersControllers');

routes.get('/users', UserControllers.index);
routes.get('/users/:id', UserControllers.show);

module.exports = routes;
