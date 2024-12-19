 const { 
    client, 
    createTables, 
    createProduct, 
    createUser 
} = require('./db');
 
 
 
 const init = async () => {
    await client.connect();
    console.log('connected to db');
    await createTables();
    console.log('created tables');
 };

 init();