const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  pagination(params) {
    let { filter, limit, offset } = params;

    let query = "",
      filterQuery = "",
      totalQuery = `(
      SELECT count(*)
      FROM receipts) AS total`;

    if (filter) {
      filterQuery = `
        WHERE receipts.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'
        `;
      totalQuery = `(
        SELECT count(*)
        FROM receipts
        ${filterQuery}
        ) AS total`;
    }
    query = `
      SELECT receipts.*,${totalQuery}, chefs.name AS chef_name
      FROM receipts
      LEFT JOIN chefs ON (chefs.id = receipts.chef_id)
      ${filterQuery}
      LIMIT $1 OFFSET $2
      `;
    return db.query(query, [limit, offset]);
  },
  post(data) {
    const query = `
      INSERT INTO receipts (
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.chefs,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ];

    return db.query(query, values);
  },
  find(id) {
    return db.query(
      `
        SELECT receipts.*, chefs.name AS chef_name
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
        WHERE receipts.id = $1`,
      [id]
    );
  },
  update(data) {
    const query = `
      UPDATE receipts SET
        title=($1),
        chef_id=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
      `;
    let values = [
      data.title,
      data.chefs,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`
    DELETE FROM receipts 
    WHERE id = $1`,
      [id]
    );
  },
  ChefsSelectOptions() {
    return db.query(`SELECT name, id FROM chefs`);
  }
};
