const db = require('../../config/db')
const {
    date
} = require('../../lib/utils')

module.exports = {
    pagination(params) {
        let {
            filter,
            limit,
            offset,
            callback
        } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*)
                FROM receipts
            ) AS total`

        if (filter) {
            filterQuery = `
            WHERE receipts.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            `
            totalQuery = `(
            SELECT count(*)
            FROM receipts
            ${filterQuery}
            ) AS total`
        }
        query = `
        SELECT receipts.*,${totalQuery}, chefs.name AS chef_name
        FROM receipts
        LEFT JOIN chefs ON (chefs.id = receipts.chef_id)
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `
        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database is ${err}`

            callback(results.rows)
        })

    },
    create(data, callback) {
        const query = `
        INSERT INTO receipts (
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database is ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
        UPDATE receipts SET
            image=($1),
            title=($2),
            chef_id=($3),
            ingredients=($4),
            preparation=($5),
            information=($6)
        WHERE id = $7
        `
        let values = [
            data.image,
            data.title,
            data.chefs,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database is ${err}`

            callback()
        })
    },
    find(id, callback) {
        db.query(`
        SELECT receipts.*, chefs.name AS chef_name
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
        WHERE receipts.id = $1`, [id], (err, results) => {
            if (err) throw `Database is ${err}`

            callback(results.rows[0])
        })

    },
    delete(id, callback) {
        db.query(`
        DELETE FROM receipts
        WHERE id = $1`, [id], (err, results) => {
            if (err) throw `Database is ${err}`

            callback()
        })

    },
    ChefsSelectOptions(callback) {
        db.query(`
        SELECT name, id
        FROM chefs
        `, (err, results) => {
            if (err) throw `Database is ${err}`

            callback(results.rows)
        })
    }
}