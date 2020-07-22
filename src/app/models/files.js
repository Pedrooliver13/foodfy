const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  all(id) {
    return db.query(`
    SELECT files.*, recipe_files.recipe_id as recipe_id 
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_id = $1
    `, [id]);
  },
  create({ filename, path }) {
    // Todas as fotos (de receita e chefs);
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [filename, path];

    return db.query(query, values);
  },
  find(id){  
    return db.query( `
      SELECT * FROM files
      WHERE id = $1
    `, [id]);
  },
  findRecipe(id) {
    return db.query(`
    SELECT files.*
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_id = $1
    `,
      [id]
    );
  },
  put(data) {
    const query = `
    UPDATE files SET 
      name=($1),
      path=($2) 
    WHERE id = $3
    `;

    values = [data.name, data.path, data.id];

    return db.query(query, values);
  },
  CreateRecipeFiles({ recipe_id, file_id }) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;
    const values = [recipe_id, file_id];

    return db.query(query, values);
  },
  async deleteChefs(id){
    try {
      let results = await db.query(`
      SELECT * FROM files
      WHERE id = $1
      `, [id]);

      const file = results.rows[0]; 
      
      fs.unlinkSync(file.path);
      
      results = await db.query(`
      UPDATE users SET
        file_id=($1)
      WHERE file_id = $2
      `, [null, id])
      
      return db.query(`
      DELETE FROM files
      WHERE id = $1
      `, [id]);

    } catch (err) {
      throw new Error(err);
    }
  },
  async deleteRecipe(id) {
    try {
      let results = await db.query(`
      SELECT * FROM files
      WHERE id = $1
    `, [id]);

      const file = results.rows[0];

      fs.unlinkSync(file.path);

      results = await db.query(`
      DELETE FROM recipe_files
      WHERE file_id = $1
      `, [id]);

      return db.query(`
      DELETE FROM files
      WHERE id = $1
    `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
