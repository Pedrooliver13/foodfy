const { Pool } = require("pg")

module.exports = new Pool({
    user:"postgres",
    password:"postgres",
    host:"Localhost",
    post:5432,
    database:"foodfy"
})