const express = require('express')
const foodfy = require('./src/app/controllers/foodfy')
const Chefs = require('./src/app/controllers/chefs')
const routes = express.Router()

routes.get('/' , (req, res) =>{
    return res.redirect('/home')
})

routes.get('/recipes' , foodfy.recipes )//rota para as receitas
routes.get('/recipes/:id' , foodfy.show )
routes.get('/sobre', foodfy.about)
routes.get('/home' , foodfy.index )
routes.get('/admin/recipes/gerenciar' , foodfy.configRecipes )
routes.get('/admin/recipes/create', foodfy.create)
routes.get('/admin/recipes/:id/edit' , foodfy.edit )
routes.post('/admin' , foodfy.post)
routes.put('/admin' , foodfy.put )
routes.delete('/admin' , foodfy.delete)

/* CHEF */
routes.get('/chefs' , Chefs.index)
routes.get('/admin/chefs/create' , Chefs.create)
routes.get('/chefs/:id' , Chefs.show)
routes.get('/admin/chefs/gerenciar' , Chefs.config)
routes.get('/admin/chefs/:id/edit' , Chefs.edit)
routes.post('/chefs' , Chefs.post)
routes.put('/chefs' , Chefs.put)
routes.delete('/chefs' , Chefs.delete)

module.exports = routes