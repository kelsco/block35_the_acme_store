const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');


const createTables = async()=> {
    const SQL = `
      DROP TABLE IF EXISTS product CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS favorite CASCADE;
      CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255)
      );
      CREATE TABLE product(
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
      CREATE TABLE favorite(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES product(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        UNIQUE (user_id, product_id)
      );
    `;
    await client.query(SQL);
  };

const createUser = async() => {
    const SQL = `
        INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, password]);
    return response.rows[0];
}

const createProduct = async() => {
    const SQL = `
        INSERT INTO product(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uudi.v4(), name]);
    return response.rows[0];
}

module.exports = {
    client,
    createTables,
    createUser,
    createProduct
};