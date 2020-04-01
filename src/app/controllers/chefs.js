const Chefs = require('../models/chefs')

module.exports = {
    index(req, res) {
        let {
            filter,
            page,
            limit
        } = req.query

        page = page || 1
        limit = limit || 8

        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(chefs) {
                const pagination = {
                    page,
                    total_chefs: Math.ceil(chefs[0].total_chefs / limit)
                }
                return res.render('site/chefs/index', {
                    chefs,
                    pagination,
                    filter
                })
            }
        }
        Chefs.paginate(params)
    },
    config(req, res) {
        let {
            filter,
            page,
            limit
        } = req.query

        page = page || 1
        limit = limit || 8

        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(chefs) {
                const pagination = {
                    page,
                    total_chefs: Math.ceil(chefs[0].total_chefs / limit)
                }
                return res.render('admin/chefs/gerenciar', {
                    chefs,
                    pagination,
                    filter
                })
            }
        }
        Chefs.paginate(params)
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
        Chefs.create(req.body, () => {
            return res.redirect('/chefs')
        })
    },
    show(req, res) {
        Chefs.find(req.params.id, (chef) => {
            if (!chef) return res.send('Chefs is not found')

            Chefs.findRecipesChef(req.params.id ,(recipes)=>{
                return res.render('site/chefs/show', {
                    chef,
                    recipes
                })
            })
        })
    },
    edit(req, res){
        Chefs.find(req.params.id , (chef)=>{
            if(!chef) return res.send('Chef is not found')

            return res.render('admin/chefs/edit', { chef })
        })
    },
    put(req, res){
        Chefs.update(req.body , ()=>{
            return res.redirect(`/chefs`)
        })
    },
    delete(req, res){
        Chefs.delete(req.body.id , ()=>{
            return res.redirect(`/chefs`)
        })
    }            
}