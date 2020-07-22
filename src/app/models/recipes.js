const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    return db.query(`
      SELECT receipts.*, users.name AS chef_name 
      FROM receipts
      LEFT JOIN users ON (receipts.user_id = users.id)
      ORDER BY created_at DESC
    `);
  },
  pagination(params) {
    let { limit, offset, filter } = params;
    
    let query = "",
      filterQuery = "",
      totalQuery = `(
      SELECT count(*)
      FROM receipts) AS total`;

    if (filter) {
      filterQuery = `
        WHERE receipts.title ILIKE '%${filter}%'
        OR users.name ILIKE '%${filter}%'
        `;
      totalQuery = `(
        SELECT count(*)
        FROM receipts
        ${filterQuery}
        ) AS total`;
    }
    query = `
      SELECT receipts.*,${totalQuery}, users.name AS chef_name
      FROM receipts
      LEFT JOIN users ON (users.id = receipts.user_id)
      ${filterQuery}
      ORDER BY receipts.updated_at DESC
      LIMIT $1 OFFSET $2
      `;

    const results = db.query(query, [limit, offset]);
    return results;
  },
  post(data , userId) {
    const query = `
      INSERT INTO receipts (
        user_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      userId,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    return db.query(query, values);
  },
  find(id) {
    return db.query(
      `
        SELECT receipts.*, users.name AS chef_name
        FROM receipts
        LEFT JOIN users ON (receipts.user_id = users.id)
        WHERE receipts.id = $1`,
      [id]
    );
  },
  update(data) {
    const query = `
      UPDATE receipts SET
        title=($1),
        user_id=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
      `;
    let values = [
      data.title,
      data.userId,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(
      `
    DELETE FROM receipts 
    WHERE id = $1`,
      [id]
    );
  },
  ChefsSelectOptions() {
    return db.query(`SELECT name, id FROM chefs`);
  },
};
