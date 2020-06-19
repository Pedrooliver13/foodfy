const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all(){
    return db.query(`
      SELECT chefs.*, count(receipts)
      FROM chefs
      LEFT JOIN receipts ON (chefs.id = receipts.chef_id)
      GROUP BY chefs.id
    `);
  },
  paginate(params) {
    const { filter, limit, offset } = params;

    let query = "",
      filterQuery = "",
      totalQuery = `(
                SELECT count(*)
                FROM chefs
            ) AS total_chefs`;

    if (filter) {
      filterQuery = `
            WHERE receipts.title ILIKE '%${filter}%'
            `;
      totalQuery = `(
                SELECT count(*)
                FROM chefs
                ${filterQuery}
            ) AS total_chefs
            `;
    }
    query = `
        SELECT chefs.*, ${totalQuery} , count(receipts) AS total_receipts
        FROM chefs
        LEFT JOIN receipts ON (chefs.id = receipts.chef_id)
        ${filterQuery}
        GROUP BY chefs.id
        ORDER BY chefs.created_at DESC
        LIMIT $1 OFFSET $2
        `;
    return db.query(query, [limit, offset]);
  },
  create({ name, fileId }) {
    const query = `
      INSERT INTO chefs (
          name,
          file_id,
          created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
      `;

    let values = [name, fileId, date(Date.now()).iso];

    return db.query(query, values);
  },
  find(id) {
    return db.query(`
        SELECT chefs.* , count(receipts) AS total_recipes
        FROM chefs 
        LEFT JOIN receipts ON (receipts.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`,
      [id]
    );
  },
  findRecipesChef(id) {
    return db.query(`
      SELECT receipts.*,(
          SELECT count(*)
          FROM receipts
      ) AS total_recipes , receipts.id AS recipe_id
      FROM receipts
      LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
      WHERE chefs.id = $1
      `,
      [id]
    );
  },
  update({ name, fileId, id }) {
    let query = `
      UPDATE chefs SET 
          name=($1),
          file_id=($2)
      WHERE id = $3
      `;
    let values = [name, fileId, id];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  },
};
