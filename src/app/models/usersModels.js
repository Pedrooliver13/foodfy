const { hash } = require("bcryptjs");
const db = require("../../config/db");

const File = require('../models/files');
const fs = require('fs');

module.exports = {
  async index() {
    const results = await db.query(`SELECT * FROM users`);

    return results.rows;
  },
  async create(data, fileId) {
    const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin,
        file_id
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `;


    const values = [data.name, data.email, data.password, data.is_admin, fileId];

    const results = await db.query(query, values);
    return results.rows[0].id;
  },
  async findOne(filters) {
    let query = "SELECT * FROM users";

    Object.keys(filters).map((key) => {
      query = `${query} ${key}`;

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);
    return results.rows[0];
  },
  async find(id) {
    return await db.query(`
      SELECT users.* , count(receipts) AS total_recipes
      FROM users 
      LEFT JOIN receipts ON (receipts.user_id = users.id)
      WHERE users.id = $1
      GROUP BY users.id`
      ,[id]);
  },
  findRecipesChef(id) {
    return db.query(`
      SELECT receipts.*, (
          SELECT count(*)
          FROM receipts
      ) AS total_recipes , receipts.id AS recipe_id
      FROM receipts
      LEFT JOIN users ON (receipts.user_id = users.id)
      WHERE users.id = $1
      `,
      [id]
    );
  },
  async update(id, fields) {
    let query = "UPDATE users SET";

    // criando o query dinâmicamente;
    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
        ${key} = '${fields[key]}', `;
      } else {
        query = `${query}
        ${key} = '${fields[key]}'
        WHERE id = ${id}
        `;
      }
    });

    return await db.query(query);
  },
  async delete(id) {
    let results = await db.query(`SELECT * FROM receipts WHERE user_id = $1`, [id]);
    const recipes = results.rows;

    const allFilesRecipes = recipes.map(async recipe => {
      await File.all(recipe.id)
    })

    let promiseResults = await Promise.all(allFilesRecipes);

    // deletar usuario;
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);

    // deletar files;
    promiseResults.map((results) => {
      results.map((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error(err);

          return res.render("user/index", {
            error: "Algum erro aconteceu!",
          });
        }
      });
    });
  },
};
