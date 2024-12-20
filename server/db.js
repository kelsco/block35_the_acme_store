const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');


const createTables = async()=> {
    const SQL = `
      DROP TABLE IF EXISTS favorites CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      
      CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255)
      );
      CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
      CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
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
};

const createProduct = async() => {
    const SQL = `
        INSERT INTO product(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uudi.v4(), name]);
    return response.rows[0];
}

const fetchUsers = async() => {
  const SQL = `
  SELECT * from users`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async() => {
    const SQL = `
      SELECT * from products
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const createFavorite = async ({user_id, product_id})=> {
  const response = await client.query(
    `
    insert into favorites(id, user_id, product_id)
    values($1, $2, $3) retutninh id, user_id, product_id
    `,
    [uuid.v4(), user_id, product_id]
  );
  return response.rows[0];
};

const fetchFavorites = async({ user_id }) =>{
    const response = await client.query(`select id, user_id, product_id from favorites where user_id=$1`, [ user_id ]);
    return response.rows;
}

const destroyFavorite = async ({ id, user_id }) => {
  const response = await client.query(`delete from favorites where id=$1 and user_id=$2`, [id, user_id]);
  return response; 
}

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite,
};