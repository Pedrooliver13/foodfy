const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    paginate(params){
        const { filter, limit, offset, callback } = params

        let query ="",
            filterQuery ="",
            totalQuery = `(
                SELECT count(*)
                FROM chefs
            ) AS total_chefs`

        if(filter){
            filterQuery = `
            WHERE chefs.name ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*)
                FROM chefs
                ${filterQuery}
            ) AS total_chefs
            `
        }
        query = `
        SELECT chefs.*, ${totalQuery} , count(receipts) AS total_receipts
        FROM chefs
        LEFT JOIN receipts ON (chefs.id = receipts.chef_id)
        ${filterQuery}
        GROUP BY chefs.id
        LIMIT $1 OFFSET $2
        `
        db.query(query, [limit, offset], (err , results)=>{
            if(err) throw `Database is ${err}`

            callback(results.rows)
        })
    },
    create(data, callback){
        const query = `
        INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1, $2 , $3)
        RETURNING id
        `
        let values = [ 
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]
        db.query(query ,values , (err, results)=>{
            if(err) throw `Database is ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback){
        db.query(`
        SELECT chefs.* , count(receipts) AS total_recipes
        FROM chefs 
        LEFT JOIN receipts ON (receipts.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id` , [id], (err ,results)=>{
            if(err) throw `Database is ${err}`

            callback(results.rows[0])
        })
    },
    findRecipesChef(id ,callback){
        db.query(`
        SELECT *,(
            SELECT count(*)
            FROM receipts
        ) AS total_recipes , receipts.id AS recipe_id
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
        WHERE chefs.id = $1
        ` , [id],(err , results)=>{
            if(err) throw `Database is ${err}`

            callback(results.rows)
        })
    },
    update(data, callback){
        let query = `
        UPDATE chefs SET 
            name=($1),
            avatar_url=($2)
        WHERE id =$3
        `
        let values =[
            data.name,
            data.avatar_url,
            data.id
        ]
        db.query(query , values ,(err ,results)=>{
            if(err) throw `Database is ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM chefs WHERE id = $1` , [id] , (err, results)=>{
            if(err) throw `Database is ${err}`
            
            callback()
        })
    },
}