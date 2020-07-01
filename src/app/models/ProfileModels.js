const { hash } = require('bcryptjs');

module.exports = {
  async post(data) {
    const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
      `;

    const passwordHash = await hash(data.password, 8);

    const values = [
      data.name,
      data.email,
      passwordHash,
      is_admin
    ]

    const results = await db.query(query, values);
    return results.rows[0].id;
  },
  findOne(filters) {
    let query = "SELECT * FROM users";
  
    Object.keys(filters).map((key) => {

     query = `${query} ${key}`;

     Object.keys(filters[key]).map(field => {
       query = `${query} ${filters[key]} = '${field[key][field]}'`
     })


    });
    
  }
}