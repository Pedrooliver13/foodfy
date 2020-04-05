const db = require("../../config/db");

module.exports = {
  all(){
    return db.query(`
      SELECT files.* , recipe_id AS recipeid
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    `)
  },
  create({ filename, path }) { // Todas as fotos (de receita e chefs);
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
    return db.query(`
    SELECT files.*, recipe_id AS recipeId
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_id = $1
    `, [id]);
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
  }
};
